import React, { useState } from 'react';

export default function BloodRequestForm({ isOpen, onClose }) {
  const [request, setRequest] = useState({
    name: '',
    bloodType: '',
    contact: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequest({ ...request, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!request.name) newErrors.name = 'Name is required';
    if (!request.bloodType) newErrors.bloodType = 'Blood type is required';
    if (!request.contact) newErrors.contact = 'Contact info is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    alert('Blood request sent (mockup only in Phase 2)');
    setRequest({ name: '', bloodType: '', contact: '', message: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Request Blood</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Your Name" value={request.name} onChange={handleChange} required />
          {errors.name && <span className="error">{errors.name}</span>}
          <input type="text" name="bloodType" placeholder="Blood Type Needed" value={request.bloodType} onChange={handleChange} required />
          {errors.bloodType && <span className="error">{errors.bloodType}</span>}
          <input type="text" name="contact" placeholder="Contact Info" value={request.contact} onChange={handleChange} required />
          {errors.contact && <span className="error">{errors.contact}</span>}
          <textarea name="message" placeholder="Additional Info" value={request.message} onChange={handleChange} />
          <button type="submit">Send Request</button>
        </form>
      </div>
    </div>
  );
}