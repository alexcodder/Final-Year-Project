import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../stylesheets/Hospital.scss';

const Hospital = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/v1/hospitals');
        if (response.data.success) {
          setHospitals(response.data.data);
        } else {
          setError('Failed to fetch hospitals');
        }
      } catch (err) {
        setError('Error fetching hospitals');
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  // Format address object into string
  const formatAddress = (address) => {
    if (!address) return 'No address provided';
    if (typeof address === 'string') return address;
    const { street, city, state } = address;
    return `${street}, ${city}, ${state}`;
  };

  return (
    <div className='hospital-page'>
      <h2 className='hospital-title'>Hospital List</h2>
      <button className='hospital-map-btn' onClick={() => navigate('/Map')}>
        View All on Map
      </button>
      {loading ? (
        <div className='hospital-loading'>Loading...</div>
      ) : error ? (
        <div className='hospital-error'>{error}</div>
      ) : (
        <div className='hospital-table-wrapper'>
          <table className='hospital-table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Address</th>
                <th>Contact</th>
                <th>Emergency</th>
                <th>Status</th>
                <th>Beds</th>
                <th>Doctors</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hospitals.map(hospital => (
                <tr key={hospital._id}>
                  <td>{hospital.name}</td>
                  <td>{hospital.type}</td>
                  <td>{formatAddress(hospital.address)}</td>
                  <td>
                    <div>Phone: {hospital.phone}</div>
                    <div>Hotline: {hospital.hotline}</div>
                  </td>
                  <td>
                    <span className={`status ${hospital.emergencyServices ? 'available' : 'unavailable'}`}>
                      {hospital.emergencyServices ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td>
                    <span className={`status ${hospital.available ? 'available' : 'unavailable'}`}>
                      {hospital.available ? 'Open' : 'Closed'}
                    </span>
                  </td>
                  <td>
                    {hospital.beds?.length > 0 ? (
                      <div className="bed-info">
                        {hospital.beds.map((bed, idx) => (
                          <div key={idx}>
                            {bed.type}: {bed.available}/{bed.total}
                          </div>
                        ))}
                      </div>
                    ) : (
                      'No bed info'
                    )}
                  </td>
                  <td>
                    {hospital.doctors?.length > 0 ? (
                      <div className="doctor-info">
                        Total: {hospital.doctors.length}
                        <br />
                        Available: {hospital.doctors.filter(d => d.available).length}
                      </div>
                    ) : (
                      'No doctor info'
                    )}
                  </td>
                  <td>
                    <button
                      className='hospital-show-btn'
                      onClick={() =>
                        navigate('/Map', {
                          state: {
                            focusHospital: {
                              id: hospital._id,
                              name: hospital.name,
                              lat: hospital.position?.lat,
                              lng: hospital.position?.lng
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
    </div>
  );
};

export default Hospital;