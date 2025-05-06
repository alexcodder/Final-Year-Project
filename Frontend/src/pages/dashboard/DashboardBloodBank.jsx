import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function BloodBankDashboard() {
  const [bloodBanks, setBloodBanks] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  useEffect(() => {
    axios.get('/api/bloodbanks')
      .then(res => setBloodBanks(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bloodbank-dashboard">
      <h2>Blood Bank Dashboard</h2>
      <button className="add-bloodbank-btn" onClick={() => setIsAddModalOpen(true)}>Add Blood Bank</button>
      <button className="request-blood-btn" onClick={() => setIsRequestModalOpen(true)}>Request Blood</button>
      <div className="bloodbank-list">
        {bloodBanks.map(bank => (
          <div key={bank._id} className="bloodbank-card">
            <h3>{bank.name}</h3>
            <p><strong>Address:</strong> {bank.address}</p>
            <p><strong>Contact:</strong> {bank.contactNumber}</p>
            <p><strong>Blood Types:</strong> {bank.availableBloodTypes.join(', ')}</p>
          </div>
        ))}
      </div>
      <AddBloodBankForm isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <BloodRequestForm isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} />
    </div>
  );
}