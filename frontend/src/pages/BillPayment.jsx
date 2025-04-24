import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, Box, Button, Card, CardContent, RadioGroup, FormControlLabel, Radio, Divider, TextField
} from '@mui/material';
import QRCode from 'react-qr-code';

// Utility to get or generate a visit/session ID (persisted in localStorage for the session)
function getVisitId() {
  let visitId = localStorage.getItem('visitId');
  if (!visitId) {
    visitId = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    localStorage.setItem('visitId', visitId);
  }
  return visitId;
}

const BillPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, orders: initialOrders } = location.state || {};
  const [orders, setOrders] = useState(initialOrders || []);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [paid, setPaid] = useState(false);
  const [upiPaid, setUpiPaid] = useState(false);
  const [billingStrategy, setBillingStrategy] = useState('No Discount');
  const [customDiscount, setCustomDiscount] = useState(0);

  const visitId = getVisitId();

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:8080/api/orders/user/${user.id}/visit/${visitId}`);
        setOrders(res.data);
      } catch (e) {
        // fallback: keep initial orders
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
    // eslint-disable-next-line
  }, [user, visitId]);

  const allPaid = orders && orders.length > 0 && orders.every(order => order.status === 'PAID' || order.status === 'COMPLETED');

  const total = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  const calculateDiscount = () => {
    if (billingStrategy === 'Percentage Discount') {
      return total * (customDiscount / 100);
    }
    if (billingStrategy === 'Flat Discount') {
      return customDiscount;
    }
    return 0;
  };

  const totalDiscount = calculateDiscount();
  const grandTotal = total - totalDiscount;

  const handlePay = async () => {
    try {
      await axios.post('http://localhost:8080/api/orders/pay-user-orders', {
        userId: user.id,
        orderIds: orders.map(o => o.id),
        paymentMethod,
        discountAmount: totalDiscount,
        billingStrategy: billingStrategy,
        customDiscount: customDiscount
      });
      if (paymentMethod === 'UPI') {
        setUpiPaid(true);
      } else {
        setPaid(true);
      }
      const res = await axios.get(`http://localhost:8080/api/orders/user/${user.id}/visit/${visitId}`);
      setOrders(res.data);
    } catch (err) {
      alert('Payment failed, please try again.');
    }
  };

  if (loading) return <Container><Typography>Loading...</Typography></Container>;
  if (!user || orders.length === 0) return <Container><Typography>No orders found.</Typography></Container>;
  if (allPaid) return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" color="success.main">Thank you for your payment!</Typography>
          <Typography variant="body2">Your payment has been received and your order is marked as done.</Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/')}>Go to Home</Button>
        </CardContent>
      </Card>
    </Container>
  );

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>Bill for {user.name}</Typography>
          <Typography variant="body1" color="text.secondary">Email: {user.email}</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Your Orders:</Typography>
          {orders.map(order => (
            <Box key={order.id} sx={{ mb: 1, pl: 1, borderLeft: '2px solid #ccc' }}>
              <Typography variant="subtitle2">Order #{order.id}</Typography>
              <Typography variant="body2">Items: {order.items.length}</Typography>
              <Box sx={{ ml: 2 }}>
                {order.items.map((item, idx) => (
                  <Typography key={idx} variant="body2" sx={{ fontStyle: 'italic' }}>- {item.menuItem?.name || 'Unnamed Item'}</Typography>
                ))}
              </Box>
              <Typography variant="body2">Total: ₹{order.totalAmount.toFixed(2)}</Typography>
            </Box>
          ))}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Total: ₹{total.toFixed(2)}</Typography>
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1">Billing/Discount Strategy:</Typography>
            <RadioGroup
              row
              value={billingStrategy}
              onChange={e => setBillingStrategy(e.target.value)}
            >
              <FormControlLabel value="No Discount" control={<Radio />} label="No Discount" />
              <FormControlLabel value="Percentage Discount" control={<Radio />} label="Percentage Discount" />
              <FormControlLabel value="Flat Discount" control={<Radio />} label="Flat Discount" />
            </RadioGroup>
            {billingStrategy !== 'No Discount' && (
              <TextField
                sx={{ mt: 1 }}
                type="number"
                label={billingStrategy === 'Percentage Discount' ? 'Discount (%)' : 'Discount Amount'}
                value={customDiscount}
                onChange={e => setCustomDiscount(Number(e.target.value))}
                inputProps={{ min: 0 }}
              />
            )}
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Grand Total: ₹{grandTotal.toFixed(2)}</Typography>
          {!paid && !upiPaid && (
            <>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>Select Payment Method:</Typography>
              <RadioGroup
                row
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                sx={{ mb: 2 }}
              >
                <FormControlLabel value="CASH" control={<Radio />} label="Cash" />
                <FormControlLabel value="CARD" control={<Radio />} label="Card" />
                <FormControlLabel value="UPI" control={<Radio />} label="UPI" />
              </RadioGroup>
              <Button variant="contained" color="primary" onClick={handlePay}>Pay ₹{grandTotal.toFixed(2)}</Button>
            </>
          )}

          {paid && paymentMethod === 'CASH' && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" color="success.main">Thank you for your payment!</Typography>
              <Typography variant="body2">Please collect your receipt at the counter.</Typography>
            </Box>
          )}

          {paid && paymentMethod === 'CARD' && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" color="success.main">Thank you for your payment!</Typography>
              <Typography variant="body2">Your card has been charged successfully.</Typography>
            </Box>
          )}

          {paymentMethod === 'UPI' && !upiPaid && (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="h6">Scan this QR to pay</Typography>
              <QRCode value={`upi://pay?pa=restaurant@upi&pn=Restaurant&am=${grandTotal.toFixed(2)}`} size={180} />
              <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={() => setPaid(true)}>
                I've Paid
              </Button>
            </Box>
          )}

          {upiPaid && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" color="success.main">Thank you for your UPI payment!</Typography>
              <Typography variant="body2">Your payment has been received.</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default BillPayment;
