import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  MenuItem
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Blood = () => {
  const navigate = useNavigate();
  const [bloodBanks, setBloodBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [filteredBanks, setFilteredBanks] = useState([]);

  useEffect(() => {
    const fetchBloodBanks = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/v1/blood-banks/all');
        setBloodBanks(response.data);
        setFilteredBanks(response.data);
      } catch (error) {
        console.error('Error fetching blood banks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBloodBanks();
  }, []);

  useEffect(() => {
    let filtered = bloodBanks;

    if (searchTerm) {
      filtered = filtered.filter(bank =>
        bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bank.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedBloodGroup) {
      filtered = filtered.filter(bank =>
        bank.bloodInventory.some(item =>
          item.bloodGroup === selectedBloodGroup && item.quantity > 0
        )
      );
    }

    setFilteredBanks(filtered);
  }, [searchTerm, selectedBloodGroup, bloodBanks]);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleViewOnMap = (bank) => {
    navigate('/map', {
      state: {
        focusHospital: {
          id: bank._id,
          lat: bank.latitude || 27.7172,
          lng: bank.longitude || 85.3240
        }
      }
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="blood-page">
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom className="blood-page__title">
            Find Blood Banks
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card className="blood-page__filters">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Search Filters
                  </Typography>
                  <TextField
                    fullWidth
                    label="Search by name or city"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    select
                    label="Blood Group"
                    value={selectedBloodGroup}
                    onChange={(e) => setSelectedBloodGroup(e.target.value)}
                    margin="normal"
                  >
                    <MenuItem value="">
                      All Blood Groups
                    </MenuItem>
                    {bloodGroups.map((group) => (
                      <MenuItem key={group} value={group}>
                        {group}
                      </MenuItem>
                    ))}
                  </TextField>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card className="blood-page__table-card">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Blood Banks
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table className="blood-table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Address</TableCell>
                          <TableCell>City</TableCell>
                          <TableCell>Contact</TableCell>
                          <TableCell>Available Blood Groups</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredBanks.map((bank) => (
                          <TableRow key={bank._id}>
                            <TableCell>{bank.name}</TableCell>
                            <TableCell>{bank.address}</TableCell>
                            <TableCell>{bank.city}</TableCell>
                            <TableCell>{bank.contactNumber}</TableCell>
                            <TableCell>
                              {bank.bloodInventory
                                .filter(item => item.quantity > 0)
                                .map(item => item.bloodGroup)
                                .join(', ')}
                            </TableCell>
                            <TableCell>
                              <button
                                className="blood-map-btn"
                                onClick={() => handleViewOnMap(bank)}
                              >
                                View on Map
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default Blood;