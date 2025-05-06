import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../stylesheets/BloodBank.scss';
import AddBloodBankForm from '../components/Forms/AddBloodBankForm';
import BloodRequestForm from '../components/Forms/BloodRequestForm';

const BloodBank = () => {
  const [bloodBanks, setBloodBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  useEffect(() => {
    const fetchBloodBanks = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/v1/blood-banks');
        if (response.data.success) {
          setBloodBanks(response.data.data);
        } else {
          setError('Failed to fetch blood banks');
        }
      } catch (err) {
        setError('Error fetching blood banks');
      } finally {
        setLoading(false);
      }
    };
    fetchBloodBanks();
  }, []);

  // Format address object into string
  const formatAddress = (address) => {
    if (!address) return 'No address provided';
    if (typeof address === 'string') return address;
    const { street, city, state } = address;
    return `${street}, ${city}, ${state}`;
  };

  return (
    <div className='bloodbank-page'>
      <div className='bloodbank-header'>
        <h2 className='bloodbank-title'>Blood Bank List</h2>
        <button className='bloodbank-map-btn' onClick={() => navigate('/Map')}>
          View All on Map
        </button>
        <button className='bloodbank-request-btn prominent' onClick={() => setIsRequestModalOpen(true)}>
          Request Blood
        </button>
      </div>
      {loading ? (
        <div className='bloodbank-loading'>Loading...</div>
      ) : error ? (
        <div className='bloodbank-error'>{error}</div>
      ) : (
        <div className='bloodbank-table-wrapper'>
          <table className='bloodbank-table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Contact</th>
                <th>Blood Types</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bloodBanks.map(bloodBank => (
                <tr key={bloodBank._id}>
                  <td>{bloodBank.name}</td>
                  <td>{formatAddress(bloodBank.address)}</td>
                  <td>
                    <div>Phone: {bloodBank.phone}</div>
                    <div>Hotline: {bloodBank.hotline}</div>
                  </td>
                  <td>
                    {bloodBank.bloodTypes?.length > 0 ? (
                      <div className="blood-info">
                        {bloodBank.bloodTypes.map((type, idx) => (
                          <div key={idx}>
                            {type.group}: {type.available} units
                          </div>
                        ))}
                      </div>
                    ) : (
                      'No blood info'
                    )}
                  </td>
                  <td>
                    <span className={`status ${bloodBank.available ? 'available' : 'unavailable'}`}>
                      {bloodBank.available ? 'Open' : 'Closed'}
                    </span>
                  </td>
                  <td>
                    <button
                      className='bloodbank-show-btn'
                      onClick={() =>
                        navigate('/Map', {
                          state: {
                            focusBloodBank: {
                              id: bloodBank._id,
                              name: bloodBank.name,
                              lat: bloodBank.position?.lat,
                              lng: bloodBank.position?.lng
                            }
                          }
                        })
                      }
                    >
                      Show on Map
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <BloodRequestForm isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} />
    </div>
  );
};

export default BloodBank;