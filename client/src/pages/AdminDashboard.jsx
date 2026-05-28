import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Map as MapIcon, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useMap } from 'react-leaflet';

function MapDeviceLayer() {
  const map = useMap();

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (p) => {
        // Center map on current device area (NO location pin)
        map.setView(
          [p.coords.latitude, p.coords.longitude],
          Math.max(map.getZoom(), 13),
          { animate: true }
        );
      },
      () => {
        // ignore
      },
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 10000 }
    );
  }, [map]);

  return null;
}

// Fix leaflet icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = () => {
    axios.get('http://localhost:5000/api/complaints')
      .then(res => {
        setComplaints(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/complaints/${id}/status`, { status: newStatus });
      fetchComplaints();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Resolved') return <span className="badge badge-resolved"><CheckCircle size={14} /> Resolved</span>;
    return <span className="badge badge-pending"><Clock size={14} /> {status}</span>;
  };

  const getPriorityColor = (priority) => {
    if (priority === 'High') return 'text-danger font-bold';
    if (priority === 'Low') return 'text-gray';
    return 'text-warning';
  };

  return (
    <div className="animate-fade-in py-12 bg-light min-h-screen">
      <div className="container">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">{t('admin_dashboard')}</h1>
            <p className="text-gray">Monitor and manage community health issues</p>
          </div>
          <button className="btn btn-outline" onClick={fetchComplaints}>Refresh Data</button>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center no-hover">
            <h3 className="text-4xl font-bold text-primary mb-2">{complaints.length}</h3>
            <p className="text-gray font-medium">{t('total_reports')}</p>
          </div>
          <div className="card text-center no-hover">
            <h3 className="text-4xl font-bold text-warning mb-2">
              {complaints.filter(c => c.status !== 'Resolved').length}
            </h3>
            <p className="text-gray font-medium">{t('pending_action')}</p>
          </div>
          <div className="card text-center no-hover">
            <h3 className="text-4xl font-bold text-success mb-2">
              {complaints.filter(c => c.status === 'Resolved').length}
            </h3>
            <p className="text-gray font-medium">{t('resolved')}</p>
          </div>
          <div className="card text-center no-hover">
            <h3 className="text-4xl font-bold text-danger mb-2">
              {complaints.filter(c => c.priority === 'High').length}
            </h3>
            <p className="text-gray font-medium">High Priority</p>
          </div>
        </div>

        {/* Real Live Map */}
        <div className="card mb-8 p-0 overflow-hidden no-hover">
          <div className="bg-dark text-white p-4 flex justify-between items-center">
            <h3 className="text-lg font-bold flex items-center gap-2"><MapIcon size={20} /> Health Risk Heatmap</h3>
            <span className="text-sm bg-primary px-3 py-1 rounded-full">Live Map</span>
          </div>
          <div style={{ height: '400px', width: '100%' }}>
            <MapContainer
              center={[17.3850, 78.4867]}
              zoom={11}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >

              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapDeviceLayer />
            </MapContainer>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="card no-hover" style={{ padding: '0', overflowX: 'auto' }}>
          <div className="p-6 border-b" style={{ borderBottom: '1px solid var(--gray-light)' }}>
            <h3 className="text-xl font-bold">Recent Complaints</h3>
          </div>
          <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr className="bg-light text-gray">
                <th className="p-4 font-medium border-b border-gray-light">ID</th>
                <th className="p-4 font-medium border-b border-gray-light">AI Category</th>
                <th className="p-4 font-medium border-b border-gray-light">Location</th>
                <th className="p-4 font-medium border-b border-gray-light">Priority</th>
                <th className="p-4 font-medium border-b border-gray-light">Status</th>
                <th className="p-4 font-medium border-b border-gray-light">Images / Audio</th>
                <th className="p-4 font-medium border-b border-gray-light">Action</th>

              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="p-4 text-center">Loading...</td></tr>
              ) : complaints.length === 0 ? (
                <tr><td colSpan="6" className="p-4 text-center text-gray">No complaints reported yet.</td></tr>
              ) : (
                complaints.map(c => (
                  <tr key={c.id} className="border-b hover:bg-light" style={{ borderBottom: '1px solid var(--gray-light)', transition: 'background-color 0.2s' }}>
                    <td className="p-4 font-medium">#{c.id}</td>
                    <td className="p-4">
                      <span className="bg-primary text-white text-xs px-2 py-1 rounded-md">{c.category}</span>
                    </td>
                    <td className="p-4 text-gray">{c.location}</td>
                    <td className={`p-4 ${getPriorityColor(c.priority)}`}>{c.priority}</td>
                    <td className="p-4">{getStatusBadge(c.status)}</td>
                    <td className="p-4" style={{ minWidth: 260 }}>
                      <div className="flex flex-col gap-3">
                        {c.imagePath ? (
                          <div>
                            <div className="text-xs text-gray mb-1">Image</div>
                            <img
                              src={`http://localhost:5000${c.imagePath}`}
                              alt={`Complaint ${c.id} image`}
                              style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6 }}
                            />
                          </div>
                        ) : (
                          <div className="text-xs text-gray">No image</div>
                        )}

                        {c.audioPath ? (
                          <div>
                            <div className="text-xs text-gray mb-1">Audio</div>
                            <audio
                              controls
                              src={`http://localhost:5000${c.audioPath}`}
                              style={{ width: '100%' }}
                            />
                          </div>
                        ) : (
                          <div className="text-xs text-gray">No audio</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {c.status !== 'Resolved' && (
                        <button 
                          className="btn btn-secondary py-1 px-3 text-sm"
                          onClick={() => updateStatus(c.id, 'Resolved')}
                        >
                          Mark Resolved
                        </button>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
