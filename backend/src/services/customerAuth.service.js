import supabase from "../supabase.js";

export const sendCustomerOtp = async (phone) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const verifyCustomerOtp = async (phone, token) => {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};