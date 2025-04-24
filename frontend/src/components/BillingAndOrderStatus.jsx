import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';

const BILLING_STRATEGIES = [
  'No Discount',
  'Percentage Discount',
  'Flat Discount',
];

export default function BillingAndOrderStatus({ order, onOrderSubmit }) {
  const [billingStrategy, setBillingStrategy] = useState('No Discount');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [orderStatus, setOrderStatus] = useState(order?.status || '');
  const [orderId, setOrderId] = useState(order?.id || null);

  // WebSocket for real-time order status
  useEffect(() => {
    if (!orderId) return;
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      onConnect: () => {
        client.subscribe('/topic/order-status', message => {
          const statusUpdate = JSON.parse(message.body);
          if (statusUpdate.orderId === orderId) {
            setOrderStatus(statusUpdate.status);
            // Optionally, show a toast/notification here
          }
        });
      },
    });
    client.activate();
    return () => client.deactivate();
  }, [orderId]);

  // Handler to update order status using the Command Pattern endpoint
  const handleStatusChange = async (newStatus) => {
    if (!orderId) return;
    try {
      await axios.post(
        `http://localhost:8080/api/orders/${orderId}/command/status`,
        null,
        { params: { status: newStatus } }
      );
      // Optionally, show a toast/notification here
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  // Submit order handler
  const handleSubmit = async () => {
    const payload = {
      ...order,
      billingStrategy,
      discountAmount: billingStrategy !== 'No Discount' ? discountAmount : 0
    };
    const res = await onOrderSubmit(payload);
    if (res && res.id) {
      setOrderId(res.id);
      setOrderStatus(res.status);
    }
  };

  return (
    <div className="billing-order-status">
      <h2>Checkout</h2>
      <label>Billing Strategy:</label>
      <select value={billingStrategy} onChange={e => setBillingStrategy(e.target.value)}>
        {BILLING_STRATEGIES.map(strat => (
          <option key={strat} value={strat}>{strat}</option>
        ))}
      </select>
      {billingStrategy !== 'No Discount' && (
        <input
          type="number"
          min={0}
          value={discountAmount}
          onChange={e => setDiscountAmount(Number(e.target.value))}
          placeholder={billingStrategy === 'Percentage Discount' ? 'Enter %' : 'Enter amount'}
        />
      )}
      <button onClick={handleSubmit}>Place Order</button>
      <div style={{marginTop: '1em'}}>
        <b>Order Status:</b> {orderStatus}
      </div>
      {/* Example UI: Dropdown for status change */}
      <select
        value={orderStatus}
        onChange={e => handleStatusChange(e.target.value)}
        style={{ margin: '1rem 0', padding: '0.5rem' }}
      >
        <option value="PENDING">Pending</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
        <option value="PAID">Paid</option>
      </select>
    </div>
  );
}
