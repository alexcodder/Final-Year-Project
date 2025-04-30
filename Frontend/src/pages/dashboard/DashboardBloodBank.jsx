import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaTint,
  FaSignOutAlt,
  FaPlus,
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  MenuItem
} from '@mui/material';

const DashboardBloodBank = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [form, setForm] = useState({ bloodGroup: '', quantity: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/v1/blood-banks/inventory', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInventory(response.data || []);
    } catch (error) {
      setAlert({ open: true, message: 'Error fetching inventory', severity: 'error' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrEdit = async (e) => {
    e.preventDefault();
    const { bloodGroup, quantity } = form;
    if (!bloodGroup || !quantity) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:3001/api/v1/blood-banks/inventory',
        { bloodGroup, quantity: parseInt(quantity) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAlert({ open: true, message: editIndex !== null ? 'Inventory updated' : 'Added new blood group', severity: 'success' });
      setForm({ bloodGroup: '', quantity: '' });
      setEditIndex(null);
      fetchInventory();
    } catch (error) {
      setAlert({ open: true, message: 'Error updating inventory', severity: 'error' });
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setForm({
      bloodGroup: inventory[index].bloodGroup,
      quantity: inventory[index].quantity
    });
  };

  const handleRemove = async (bloodGroup) => {
    if (!window.confirm('Remove this blood group?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:3001/api/v1/blood-banks/inventory',
        { bloodGroup, quantity: 0 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAlert({ open: true, message: 'Removed blood group', severity: 'success' });
      fetchInventory();
    } catch (error) {
      setAlert({ open: true, message: 'Error removing blood group', severity: 'error' });
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Blood Bank Panel</h2>
        </div>
        <div className="sidebar-nav">
          <button className="nav-item active">
            <FaTint /> <span>Manage Inventory</span>
          </button>
        </div>
        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        </div>
      </div>
      <div className="main-content">
        <div className="dashboard-content">
          <h2>Manage Blood Inventory</h2>
          <form className="inventory-form" onSubmit={handleAddOrEdit}>
            <TextField
              select
              label="Blood Group"
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleFormChange}
              required
              sx={{ mr: 2, width: 150 }}
            >
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                <MenuItem key={group} value={group}>
                  {group}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleFormChange}
              required
              sx={{ mr: 2, width: 150 }}
            />
            <Button type="submit" variant="contained" color="primary">
              {editIndex !== null ? <FaEdit style={{ marginRight: 6 }} /> : <FaPlus style={{ marginRight: 6 }} />}
              {editIndex !== null ? 'Update' : 'Add'}
            </Button>
            {editIndex !== null && (
              <Button variant="outlined" color="secondary" sx={{ ml: 2 }} onClick={() => { setEditIndex(null); setForm({ bloodGroup: '', quantity: '' }); }}>
                Cancel
              </Button>
            )}
          </form>
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Blood Group</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventory.map((item, idx) => (
                  <TableRow key={item.bloodGroup}>
                    <TableCell>{item.bloodGroup}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      <Button size="small" color="primary" onClick={() => handleEdit(idx)}><FaEdit /></Button>
                      <Button size="small" color="error" onClick={() => handleRemove(item.bloodGroup)}><FaTrash /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert onClose={() => setAlert({ ...alert, open: false })} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DashboardBloodBank;
