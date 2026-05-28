import React from 'react';
import { FileText, CheckCircle, Clock } from 'lucide-react';

export default function CitizenDashboard() {
  const mockReports = [
    { id: '1021', category: 'Water Sanitation', date: '2026-05-20', status: 'Pending' },
    { id: '0984', category: 'Mosquito Breeding', date: '2026-05-15', status: 'Resolved' },
  ];

  const getStatusBadge = (status) => {
    if (status === 'Resolved') return <span className="badge badge-resolved"><CheckCircle size={14} /> Resolved</span>;
    return <span className="badge badge-pending"><Clock size={14} /> {status}</span>;
  };

  return (
    <div className="animate-fade-in py-12 bg-light min-h-screen">
      <div className="container" style={{ maxWidth: '900px' }}>
        <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
        <p className="text-gray mb-8">Track the status of your reported health hazards.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card border-none shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-primary text-white p-3 rounded-full"><FileText size={24} /></div>
              <div>
                <p className="text-gray font-medium">Total Reports Submitted</p>
                <h3 className="text-3xl font-bold text-dark">2</h3>
              </div>
            </div>
          </div>
          <div className="card border-none shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-success text-white p-3 rounded-full"><CheckCircle size={24} /></div>
              <div>
                <p className="text-gray font-medium">Reports Resolved</p>
                <h3 className="text-3xl font-bold text-dark">1</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-0 overflow-hidden no-hover">
          <div className="bg-white p-6 border-b" style={{ borderBottom: '1px solid var(--gray-light)' }}>
            <h3 className="text-xl font-bold">My Recent Reports</h3>
          </div>
          <table className="w-full text-left bg-white" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr className="bg-light text-gray">
                <th className="p-4 font-medium border-b border-gray-light">Report ID</th>
                <th className="p-4 font-medium border-b border-gray-light">Category</th>
                <th className="p-4 font-medium border-b border-gray-light">Date Submitted</th>
                <th className="p-4 font-medium border-b border-gray-light">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockReports.map(report => (
                <tr key={report.id} className="border-b" style={{ borderBottom: '1px solid var(--gray-light)' }}>
                  <td className="p-4 font-medium">#{report.id}</td>
                  <td className="p-4">{report.category}</td>
                  <td className="p-4 text-gray">{report.date}</td>
                  <td className="p-4">{getStatusBadge(report.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
