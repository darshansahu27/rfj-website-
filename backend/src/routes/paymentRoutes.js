
import { randomUUID, createHmac, timingSafeEqual } from "node:crypto";
import express from "express";
import supabaseAdmin from "../config/supabaseAdmin.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";
import razorpay from "../config/razorpay.js";

const router = express.Router();

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const RETRY_WINDOW_MINUTES = 15;

/**
 * POST /api/payments/create
 *
 * Creates a Razorpay payment order for an existing customer order.
 * The customer must be authenticated and must own the RFJ order.
 */
router.post("/create", verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.firebaseUser?.uid;
    const { orderId, paymentMethod } = req.body ?? {};

    if (!UUID_REGEX.test(orderId || "")) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    if (!["upi", "card", "online"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method.",
      });
    }

    // Resolve the authenticated customer.
    const { data: profile, error: profileError } =
      await supabaseAdmin
        .from("profiles")
        .select("id, role")
        .eq("firebase_uid", firebaseUid)
        .maybeSingle();

    if (profileError) throw profileError;

    if (!profile || profile.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "A registered customer account is required.",
      });
    }

    // Confirm that this order belongs to the authenticated customer.
    const { data: order, error: orderError } =
      await supabaseAdmin
        .from("orders")
        .select(
          "id, customer_id, order_number, total_amount, status, payment_expires_at"
        )
        .eq("id", orderId)
        .eq("customer_id", profile.id)
        .maybeSingle();

    if (orderError) throw orderError;

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (order.status !== "pending_payment") {
      return res.status(409).json({
        success: false,
        message: "This order is not awaiting payment.",
        orderStatus: order.status,
      });
    }

    if (
      !order.payment_expires_at ||
      new Date(order.payment_expires_at).getTime() <= Date.now()
    ) {
      const { error: expiryError } = await supabaseAdmin
        .from("orders")
        .update({ status: "expired" })
        .eq("id", order.id)
        .eq("status", "pending_payment");

      if (expiryError) throw expiryError;

      return res.status(410).json({
        success: false,
        message: "The payment window for this order has expired.",
      });
    }

    const amount = Number(order.total_amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount.",
      });
    }

    // Razorpay expects the amount in the smallest currency unit (paise).
    const amountInPaise = Math.round(amount * 100);

    if (!Number.isSafeInteger(amountInPaise) || amountInPaise <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount.",
      });
    }

    // Create a fresh Razorpay order for this payment attempt.
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: order.order_number,
      notes: {
        rfj_order_id: order.id,
        rfj_order_number: order.order_number,
      },
    });

    // The database payment_method enum supports only "upi" and "online".
    // Card is therefore stored as "online".
    const storedPaymentMethod =
      paymentMethod === "upi" ? "upi" : "online";

    const { data: payment, error: paymentError } =
      await supabaseAdmin
        .from("payments")
        .insert({
          id: randomUUID(),
          order_id: order.id,
          payment_method: storedPaymentMethod,
          gateway: "razorpay",
          gateway_order_id: razorpayOrder.id,
          amount,
          payment_status: "pending",
        })
        .select("id, gateway_order_id, amount, payment_status")
        .single();

    if (paymentError) throw paymentError;

    return res.status(201).json({
      success: true,
      message: "Payment order created.",
      payment,
      razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
      customer: {
        name: req.body.name || "",
        email: req.body.email || "",
        contact: req.body.phone || "",
      },
      paymentMethod,
    });
  } catch (error) {
    console.error("Razorpay payment creation failed:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to start payment. Please try again.",
    });
  }
});

/**
 * POST /api/payments/verify
 *
 * Verifies the Razorpay callback signature and independently checks
 * the payment status with Razorpay before confirming the RFJ order.
 */
router.post("/verify", verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.firebaseUser?.uid;

    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body ?? {};

    if (
      !UUID_REGEX.test(orderId || "") ||
      typeof razorpay_order_id !== "string" ||
      typeof razorpay_payment_id !== "string" ||
      typeof razorpay_signature !== "string"
    ) if (!/^[a-f0-9]{64}$/i.test(razorpay_signature)) {
  return res.status(400).json({
    success: false,
    message: "Invalid payment signature format.",
  });
}

    const { data: profile, error: profileError } =
      await supabaseAdmin
        .from("profiles")
        .select("id, role")
        .eq("firebase_uid", firebaseUid)
        .maybeSingle();

    if (profileError) throw profileError;

    if (!profile || profile.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "A registered customer account is required.",
      });
    }

    const { data: order, error: orderError } =
      await supabaseAdmin
        .from("orders")
        .select(
  "id, customer_id, status, total_amount, payment_expires_at"
)
        .eq("id", orderId)
        .eq("customer_id", profile.id)
        .maybeSingle();

    if (orderError) throw orderError;

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    const { data: payment, error: paymentError } =
      await supabaseAdmin
        .from("payments")
        .select("id, order_id, gateway_order_id, gateway_payment_id, amount, payment_status")
        .eq("order_id", order.id)
        .eq("gateway_order_id", razorpay_order_id)
        .eq("gateway", "razorpay")
        .maybeSingle();

    if (paymentError) throw paymentError;

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment attempt not found.",
      });
    }

    // Verify the Razorpay callback signature using the backend secret.
    const expectedSignature = createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET
    )
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const receivedBuffer = Buffer.from(razorpay_signature, "hex");

    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed.",
      });
    }

    // Independently retrieve the payment from Razorpay.
    const razorpayPayment =
      await razorpay.payments.fetch(razorpay_payment_id);

    if (
      razorpayPayment.order_id !== razorpay_order_id ||
      razorpayPayment.status !== "captured" ||
      razorpayPayment.currency !== "INR" ||
      Number(razorpayPayment.amount) !==
        Math.round(Number(payment.amount) * 100)
    ) {
      return res.status(409).json({
        success: false,
        message: "Razorpay has not confirmed a captured payment.",
        paymentStatus: razorpayPayment.status,
      });
    }

    // Do not silently overwrite a different payment attempt.
    if (
      payment.gateway_payment_id &&
      payment.gateway_payment_id !== razorpay_payment_id
    ) {
      return res.status(409).json({
        success: false,
        message: "A different payment is already recorded for this attempt.",
      });
    }

    // Record the verified payment.
    const { error: updatePaymentError } =
      await supabaseAdmin
        .from("payments")
        .update({
          gateway_payment_id: razorpay_payment_id,
          transaction_reference: razorpay_payment_id,
          payment_status: "successful",
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          failure_reason: null,
        })
        .eq("id", payment.id);

    if (updatePaymentError) throw updatePaymentError;

    
    // A captured payment must not confirm an expired order.
    const paymentDeadline = order.payment_expires_at
      ? new Date(order.payment_expires_at).getTime()
      : 0;

    const paymentWindowExpired =
      !paymentDeadline || paymentDeadline <= Date.now();

    if (
      order.status === "pending_payment" &&
      paymentWindowExpired
    ) {
      const { error: expiryError } = await supabaseAdmin
        .from("orders")
        .update({ status: "expired" })
        .eq("id", order.id)
        .eq("status", "pending_payment");

      if (expiryError) throw expiryError;

      return res.status(409).json({
        success: false,
        message:
          "Payment was captured after the payment deadline. Please contact RFJ support.",
        paymentStatus: "successful",
        orderStatus: "expired",
      });
    }

    // Confirm only an order that is still awaiting payment.
    if (order.status === "pending_payment") {
      const { data: confirmedOrder, error: confirmError } =
        await supabaseAdmin
          .from("orders")
          .update({
            status: "confirmed",
          })
          .eq("id", order.id)
          .eq("status", "pending_payment")
          .select("id, order_number, status")
          .maybeSingle();

      if (confirmError) throw confirmError;

      if (!confirmedOrder) {
        return res.status(409).json({
          success: false,
          message:
            "Payment was captured, but the order status changed. Please contact RFJ support.",
          paymentStatus: "successful",
        });
      }

      return res.json({
        success: true,
        message: "Payment verified and order confirmed.",
        order: confirmedOrder,
        paymentStatus: "successful",
      });
    }

    // Allow safe repeat verification of an already-confirmed order.
    if (order.status === "confirmed") {
      return res.json({
        success: true,
        message: "Payment was already verified.",
        order: {
          id: order.id,
          status: order.status,
        },
        paymentStatus: "successful",
      });
    }

    return res.status(409).json({
      success: false,
      message:
        "Payment was captured, but this order is no longer awaiting payment. Please contact RFJ support.",
      paymentStatus: "successful",
      orderStatus: order.status,
    });



  } catch (error) {
    console.error("Razorpay payment verification failed:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify payment. Please contact support if money was deducted.",
    });
  }
});

/**
 * POST /api/payments/webhook
 *
 * Receives Razorpay payment notifications.
 * Signature verification uses the original raw request body.
 */
router.post("/webhook", async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    if (!webhookSecret || !Buffer.isBuffer(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook configuration or request body.",
      });
    }

    if (typeof signature !== "string") {
      return res.status(400).json({
        success: false,
        message: "Missing webhook signature.",
      });
    }

    // Verify the signature against the exact raw request bytes.
    const expectedSignature = createHmac("sha256", webhookSecret)
      .update(req.body)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const receivedBuffer = Buffer.from(signature, "hex");

    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature.",
      });
    }

    const event = JSON.parse(req.body.toString("utf8"));

    if (
      event.event !== "payment.captured" &&
      event.event !== "payment.failed"
    ) {
      return res.status(200).json({
        success: true,
        message: "Event received; no action required.",
      });
    }

    const razorpayPayment = event.payload?.payment?.entity;

    if (
      !razorpayPayment?.id ||
      !razorpayPayment?.order_id
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment information is missing.",
      });
    }

    // Find the exact RFJ payment attempt.
    const { data: payment, error: paymentLookupError } =
      await supabaseAdmin
        .from("payments")
        .select("id, order_id, amount, payment_status")
        .eq("gateway", "razorpay")
        .eq("gateway_order_id", razorpayPayment.order_id)
        .maybeSingle();

    if (paymentLookupError) throw paymentLookupError;

    // A webhook for an unknown Razorpay order must not change RFJ data.
    if (!payment) {
      return res.status(200).json({
        success: true,
        message: "Payment attempt not found in RFJ.",
      });
    }

    const now = new Date().toISOString();

    if (event.event === "payment.failed") {
      // Do not overwrite a payment that has already succeeded.
      if (payment.payment_status !== "successful") {
        const { error } = await supabaseAdmin
          .from("payments")
          .update({
            gateway_payment_id: razorpayPayment.id,
            payment_status: "failed",
            failure_reason:
              razorpayPayment.error_description ||
              razorpayPayment.error_reason ||
              "Payment failed.",
            updated_at: now,
          })
          .eq("id", payment.id);

        if (error) throw error;
      }

      // Keep the RFJ order pending so the customer can retry.
      return res.status(200).json({
        success: true,
        message: "Failed payment event processed.",
      });
    }

    // payment.captured
    const expectedAmount = Math.round(Number(payment.amount) * 100);

    if (
      razorpayPayment.currency !== "INR" ||
      Number(razorpayPayment.amount) !== expectedAmount
    ) {
      console.error(
        "Razorpay webhook amount/currency mismatch:",
        razorpayPayment.id
      );

      return res.status(400).json({
        success: false,
        message: "Payment amount or currency mismatch.",
      });
    }

    // Record the captured payment, even if the order has expired.
    // A late capture must be reconciled; it must not silently confirm
    // an expired order.
    const { error: paymentUpdateError } = await supabaseAdmin
      .from("payments")
      .update({
        gateway_payment_id: razorpayPayment.id,
        transaction_reference: razorpayPayment.id,
        payment_status: "successful",
        paid_at: now,
        failure_reason: null,
        updated_at: now,
      })
      .eq("id", payment.id);

    if (paymentUpdateError) throw paymentUpdateError;

    const { data: order, error: orderLookupError } =
      await supabaseAdmin
        .from("orders")
        .select("id, status, payment_expires_at")
        .eq("id", payment.order_id)
        .maybeSingle();

    if (orderLookupError) throw orderLookupError;

    if (!order) {
      console.error(
        "Captured payment has no matching RFJ order:",
        payment.order_id
      );

      return res.status(200).json({
        success: true,
        message: "Payment recorded; order requires investigation.",
      });
    }

    const isWithinPaymentWindow =
      order.payment_expires_at &&
      new Date(order.payment_expires_at).getTime() > Date.now();

    if (
      order.status === "pending_payment" &&
      isWithinPaymentWindow
    ) {
      const { error: confirmError } = await supabaseAdmin
        .from("orders")
        .update({ status: "confirmed" })
        .eq("id", order.id)
        .eq("status", "pending_payment");

      if (confirmError) throw confirmError;
    } else if (
      order.status !== "confirmed"
    ) {
      console.error(
        "Captured payment requires manual reconciliation:",
        {
          orderId: order.id,
          orderStatus: order.status,
          razorpayPaymentId: razorpayPayment.id,
        }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Captured payment event processed.",
    });
  } catch (error) {
    console.error("Razorpay webhook processing failed:", error);

    return res.status(500).json({
      success: false,
      message: "Webhook processing failed.",
    });
  }
});

export default router;
