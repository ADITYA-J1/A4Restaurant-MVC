import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', isRegistered: false });
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/auth/register', form, {
        headers: { 'Content-Type': 'application/json' }
      });
      toast.success('🎉 Registered successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2500);
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed! Please try again.';
      toast.error(`❌ ${message}`, { autoClose: 2500 });
      console.error(error);
    }
  };

  return (
    <div style={wrapper}>
      <ToastContainer position="top-center" />
      <div style={card}>
        <h2 style={heading}>Register</h2>
        <form onSubmit={handleSubmit}>
          <input style={input} name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input style={input} name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input style={input} name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <div style={{ margin: '10px 0' }}>
            <label>
              <input type="checkbox" name="isRegistered" checked={form.isRegistered} onChange={handleChange} />
              Receive Offers
            </label>
          </div>
          <button style={button} type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

const wrapper = {
  minHeight: '100vh',
  background: 'linear-gradient(to right,rgb(117, 255, 255),rgb(197, 126, 255))',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: 'Segoe UI'
};

const card = {
  background: '#fff',
  borderRadius: '15px',
  padding: '30px',
  width: '100%',
  maxWidth: '400px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
};

const heading = {
  textAlign: 'center',
  marginBottom: '20px',
  color: '#ff758c'
};

const input = {
  width: '100%',
  padding: '12px',
  margin: '10px 0',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  transition: '0.3s',
};

const button = {
  width: '100%',
  padding: '12px',
  background: '#ff758c',
  color: '#fff',
  fontSize: '1rem',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  marginTop: '15px',
  transition: '0.3s',
};
