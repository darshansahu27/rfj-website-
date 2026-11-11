
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);

export const sendOrderInvoiceEmail = async ({
  to,
  customerName,
  orderNumber,
  orderDate,
  items = [],
  subtotal,
  deliveryFee,
  discount,
  totalAmount,
  deliveryAddress,
  paymentMethod,
  paymentId,
}) => {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    throw new Error("Resend environment variables are missing.");
  }

  if (!to || !orderNumber) {
    throw new Error("Customer email and order number are required.");
  }

  const money = (value) =>
    `₹${Number(value || 0).toFixed(2)}`;

  const itemRows = items.map((item) => `
    <tr>
      <td style="padding:12px;border-bottom:1px solid #eee;">
        ${escapeHtml(item.name)}
      </td>
      <td style="padding:12px;text-align:center;border-bottom:1px solid #eee;">
        ${Number(item.quantity || 0)}
      </td>
      <td style="padding:12px;text-align:right;border-bottom:1px solid #eee;">
        ${money(item.total)}
      </td>
    </tr>
  `).join("");

  const html = `
    <div style="font-family:Arial,sans-serif;background:#fff8f5;padding:24px;">
      <div style="max-width:600px;margin:auto;background:white;border-radius:12px;overflow:hidden;">
        <div style="background:#9d1c2e;color:white;padding:24px;text-align:center;">
          <h1 style="margin:0;">Rohit Food Junction</h1>
          <p style="margin:8px 0 0;">Order confirmation & invoice</p>
        </div>

        <div style="padding:24px;color:#333;">
          <h2>Thank you, ${escapeHtml(customerName)}!</h2>
          <p>Your payment has been successfully verified.</p>

          <p><strong>Order number:</strong> ${escapeHtml(orderNumber)}</p>
          <p><strong>Order date:</strong> ${escapeHtml(orderDate)}</p>

          <h3>Order items</h3>
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background:#fff0eb;">
                <th style="padding:12px;text-align:left;">Item</th>
                <th style="padding:12px;">Qty</th>
                <th style="padding:12px;text-align:right;">Amount</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>

          <div style="margin-top:20px;text-align:right;line-height:1.9;">
            <div>Subtotal: ${money(subtotal)}</div>
            <div>Delivery: ${money(deliveryFee)}</div>
            <div>Discount: -${money(discount)}</div>
            <h2 style="color:#9d1c2e;">Total paid: ${money(totalAmount)}</h2>
          </div>

          <h3>Delivery address</h3>
          <p>${escapeHtml(deliveryAddress)}</p>

          <h3>Payment details</h3>
          <p>Payment method: ${escapeHtml(paymentMethod)}</p>
          <p>Payment ID: ${escapeHtml(paymentId)}</p>

          <p style="margin-top:28px;">Thank you for choosing Rohit Food Junction!</p>
        </div>
      </div>
    </div>
  `;

  const result = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: [to],
    subject: `RFJ Order Confirmation - ${orderNumber}`,
    html,
  });

  if (result.error) {
    throw new Error(result.error.message || "Resend email delivery failed.");
  }

  return result.data;
};
