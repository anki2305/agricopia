// controllers/paytmController.js
import PaytmChecksum from 'paytmchecksum';
import https from 'https';
import { paytmConfig } from '../config/paytmConfig.js';
import Order from '../models/orderModel.js';

// Initiate Paytm Payment
export const initiatePayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const paytmParams = {
      MID: paytmConfig.mid,
      WEBSITE: paytmConfig.website,
      INDUSTRY_TYPE_ID: 'Retail',
      CHANNEL_ID: 'WEB',
      ORDER_ID: orderId,
      CUST_ID: order.user.toString(),
      TXN_AMOUNT: amount.toString(),
      CALLBACK_URL: paytmConfig.callbackUrl,
    };

    const checksum = await PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams),
      paytmConfig.key
    );

    const paytmTxn = {
      ...paytmParams,
      CHECKSUMHASH: checksum,
    };

    res.json(paytmTxn);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Verify Paytm Payment
export const verifyPayment = async (req, res) => {
  try {
    const { ORDERID, STATUS, TXNAMOUNT, TXNID, CHECKSUMHASH } = req.body;

    const isVerifySignature = PaytmChecksum.verifySignature(
      req.body,
      paytmConfig.key,
      CHECKSUMHASH
    );

    if (isVerifySignature) {
      const order = await Order.findById(ORDERID);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      if (STATUS === 'TXN_SUCCESS') {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: TXNID,
          status: STATUS,
          update_time: Date.now(),
          email_address: order.user.email,
        };

        const updatedOrder = await order.save();

        res.json({ paymentStatus: 'SUCCESS', order: updatedOrder });
      } else {
        res.json({ paymentStatus: 'FAILURE', message: 'Transaction failed' });
      }
    } else {
      res.status(400).json({ message: 'Checksum mismatch' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};