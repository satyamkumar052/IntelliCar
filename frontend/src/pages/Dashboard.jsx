import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../api';
import { Link } from 'react-router-dom';
import { Car, FileText, Bell, MapPin } from 'lucide-react';
import { RadialBarChart, RadialBar, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [stats, setStats] = useState({ cars: 0, docs: 0, reminders: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [carsRes, remRes] = await Promise.all([
          api.get('/cars'),
          api.get('/reminders')
        ]);

        const cars = carsRes.data.data;

        // Fetch documents for each car concurrently to tally total documents
        const docsPromises = cars.map(car => api.get(`/documents/${car._id}`));
        const docsResponses = await Promise.all(docsPromises);
        const totalDocs = docsResponses.reduce((acc, res) => acc + res.data.data.length, 0);

        setStats({
          cars: cars.length,
          docs: totalDocs,
          reminders: remRes.data.data
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [api]);

  const documentData = [
    { name: 'RC Valid', count: 80, fill: '#2563eb' },
    { name: 'Insurance Expiring', count: 20, fill: '#ffb4ab' },
  ];

  if (loading) return <div className="p-8 mt-20 text-center animate-pulse">Loading Telemetry...</div>;

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8 border-b border-surface-container-high pb-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Command Center</h1>
          <p className="text-secondary text-sm">Welcome back, {user.name}.</p>
        </div>
        <div className="hidden md:flex gap-4">
          <Link to="/my-cars" className="btn-secondary flex items-center gap-2"><Car size={16} /> Add Vehicle</Link>
          <Link to="/documents" className="btn-primary flex items-center gap-2"><FileText size={16} /> Upload Docs</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="glass-card p-6 flex items-center justify-between">
          <div>
            <p className="text-secondary text-xs uppercase font-bold tracking-wider mb-1">Active Vehicles</p>
            <h2 className="text-3xl font-heading font-bold text-white">{stats.cars}</h2>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Car size={24} />
          </div>
        </div>

        <div className="glass-card p-6 flex items-center justify-between">
          <div>
            <p className="text-secondary text-xs uppercase font-bold tracking-wider mb-1">Total Docs</p>
            <h2 className="text-3xl font-heading font-bold text-white">{stats.docs || 0}</h2>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <FileText size={24} />
          </div>
        </div>

        <div className="glass-card p-6 flex items-center justify-between">
          <div>
            <p className="text-secondary text-xs uppercase font-bold tracking-wider mb-1">Alerts</p>
            <h2 className="text-3xl font-heading font-bold text-red-400">{stats.reminders.length}</h2>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
            <Bell size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Document Status Gauge */}
        <div className="glass-card p-6 col-span-1 border border-outline-variant/10">
          <h3 className="text-lg font-heading font-bold mb-4 flex items-center gap-2">Document Health</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" barSize={15} data={documentData}>
                <RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff' }} background clockWise dataKey="count" />
                <Tooltip />
                <Legend iconSize={10} layout="vertical" verticalAlign="bottom" wrapperStyle={{ fontSize: '12px' }} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reminders List */}
        <div className="glass-card p-6 col-span-2 border border-outline-variant/10">
          <h3 className="text-lg font-heading font-bold mb-4 flex items-center gap-2">Active Reminders</h3>
          {stats.reminders.length === 0 ? (
            <div className="text-secondary text-sm">No active alerts. Systems green.</div>
          ) : (
            <div className="space-y-4">
              {stats.reminders.map(rem => (
                <div key={rem._id} className="flex items-center justify-between p-4 rounded-md bg-surface-container-lowest border-l-4 border-red-500">
                  <div>
                    <h4 className="font-bold text-white mb-1">{rem.title}</h4>
                    <p className="text-secondary text-xs">{rem.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-secondary uppercase mb-1">Due Date</div>
                    <div className="font-heading font-bold text-red-400">{new Date(rem.dueDate).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
