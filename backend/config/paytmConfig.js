import dotenv from 'dotenv';
dotenv.config();

export const paytmConfig = {
  mid: process.env.PAYTM_MID,
  key: process.env.PAYTM_MERCHANT_KEY,
  website: process.env.PAYTM_WEBSITE,
  callbackUrl: process.env.PAYTM_CALLBACK_URL,
};