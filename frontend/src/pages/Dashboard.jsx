import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../api';
import { Link } from 'react-router-dom';
import { Car, FileText, Bell, MapPin, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  
  const [stats, setStats] = useState({ 
    cars: 0, 
    totalDocs: 0, 
    reminders: [],
    docHealth: { valid: 0, expiring: 0, expired: 0 }
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [carsRes, remRes] = await Promise.all([
          api.get('/cars'),
          api.get('/reminders')
        ]);

        const cars = carsRes.data.data;

        // Fetch documents for each car concurrently
        const docsPromises = cars.map(car => api.get(`/documents/${car._id}`));
        const docsResponses = await Promise.all(docsPromises);
        
        let valid = 0, expiring = 0, expired = 0;
        let totalDocs = 0;

        docsResponses.forEach(res => {
          const docs = res.data.data;
          totalDocs += docs.length;
          docs.forEach(doc => {
            if (doc.status === 'valid') valid++;
            else if (doc.status === 'expiring_soon') expiring++;
            else if (doc.status === 'expired') expired++;
          });
        });

        // Filter reminders: only active or upcoming (can refine further based on logic, assuming backend returns relevant ones)
        const reminders = remRes.data.data;

        setStats({
          cars: cars.length,
          totalDocs,
          reminders,
          docHealth: { valid, expiring, expired }
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const healthData = [
    { name: 'Valid', value: stats.docHealth.valid, color: '#3b82f6' },       // blue-500
    { name: 'Expiring Soon', value: stats.docHealth.expiring, color: '#f59e0b' }, // amber-500
    { name: 'Expired', value: stats.docHealth.expired, color: '#ef4444' }     // red-500
  ].filter(item => item.value > 0);

  // If no document data at all, provide a blank slate indicator
  const hasDocData = healthData.length > 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-secondary font-heading tracking-widest uppercase text-sm animate-pulse">Initializing Command Center...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-surface-container-high pb-8 relative">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        <div>
          <h1 className="text-4xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-secondary mb-2 tracking-tight">
            Command Center
          </h1>
          <p className="text-secondary/80 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            System Online • Welcome back, <span className="text-white font-medium">{user.name}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <Link to="/my-cars" className="btn-secondary flex-1 md:flex-none flex items-center justify-center gap-2 group">
            <Car size={18} className="group-hover:scale-110 transition-transform" /> 
            Add Vehicle
          </Link>
          <Link to="/documents" className="btn-primary flex-1 md:flex-none flex items-center justify-center gap-2 shadow-primary/20 shadow-lg">
            <FileText size={18} /> 
            Upload Docs
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="glass-card p-8 flex flex-col justify-between group hover:border-primary/30 transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/5 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Car size={24} />
            </div>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/10">Fleet</span>
          </div>
          <div>
            <h2 className="text-4xl font-heading font-bold text-white mb-1">{stats.cars}</h2>
            <p className="text-secondary text-sm font-medium">Active Vehicles Monitored</p>
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
        </div>

        <div className="glass-card p-8 flex flex-col justify-between group hover:border-indigo-500/30 transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/5 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <FileText size={24} />
            </div>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/10">Records</span>
          </div>
          <div>
            <h2 className="text-4xl font-heading font-bold text-white mb-1">{stats.totalDocs}</h2>
            <p className="text-secondary text-sm font-medium">Documents Managed</p>
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors"></div>
        </div>

        <div className={"glass-card p-8 flex flex-col justify-between group transition-all duration-300 " + (stats.reminders.length > 0 ? "hover:border-red-500/30 border-red-500/10 shadow-[0_0_30px_-5px_rgba(239,68,68,0.1)]" : "hover:border-green-500/30")}>
          <div className="flex justify-between items-start mb-6">
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center group-hover:scale-110 transition-transform ${stats.reminders.length > 0 ? "bg-gradient-to-br from-red-500/20 to-red-600/5 border-red-500/20 text-red-500" : "bg-gradient-to-br from-green-500/20 to-green-600/5 border-green-500/20 text-green-500"}`}>
              <Bell size={24} />
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${stats.reminders.length > 0 ? "text-red-400 bg-red-500/10 border-red-500/10" : "text-green-400 bg-green-500/10 border-green-500/10"}`}>Alerts</span>
          </div>
          <div>
            <h2 className="text-4xl font-heading font-bold text-white mb-1">{stats.reminders.length}</h2>
            <p className="text-secondary text-sm font-medium">Pending Actions Requires Need</p>
          </div>
          <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full blur-2xl transition-colors ${stats.reminders.length > 0 ? 'bg-red-500/5 group-hover:bg-red-500/10' : 'bg-green-500/5 group-hover:bg-green-500/10'}`}></div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        
        {/* Document Health Chart */}
        <div className="glass-card p-8 col-span-1 border border-outline-variant/10 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2">
              <Activity size={20} className="text-primary" />
              Document Health
            </h3>
          </div>
          
          <div className="flex-grow flex items-center justify-center min-h-[280px]">
            {hasDocData ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={healthData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={6}
                  >
                    {healthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value, entry) => <span className="text-secondary text-sm ml-1">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center mx-auto mb-4 text-outline-variant">
                  <ShieldAlert size={28} />
                </div>
                <p className="text-secondary text-sm mb-4">No document data available.</p>
                <Link to="/documents" className="text-primary text-sm hover:underline font-medium">Upload your first document &rarr;</Link>
              </div>
            )}
          </div>
        </div>

        {/* Action Center - Reminders List */}
        <div className="glass-card p-0 col-span-1 lg:col-span-2 border border-outline-variant/10 flex flex-col overflow-hidden">
          <div className="p-8 border-b border-surface-container-high/50 flex justify-between items-center bg-surface-container-low/30">
            <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2">
              <AlertTriangle size={20} className="text-red-400" />
              Action Center
            </h3>
            <span className="bg-surface-highest text-secondary text-xs px-3 py-1 rounded-full font-medium border border-outline-variant/20">
              {stats.reminders.length} Active
            </span>
          </div>
          
          <div className="flex-grow p-4 min-h-[280px] overflow-y-auto custom-scrollbar">
            {stats.reminders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4 text-green-500">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-white font-medium text-lg mb-1">All Clear!</h4>
                <p className="text-secondary text-sm max-w-sm">You have no pending alerts or expiring documents. Everything is up to date.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.reminders.map(rem => {
                  const dueDate = new Date(rem.dueDate);
                  const isOverdue = dueDate < new Date();
                  
                  return (
                    <div key={rem._id} className="group relative overflow-hidden bg-surface-container-low hover:bg-surface-container-highest transition-colors rounded-xl border border-outline-variant/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      {/* Left indicator bar */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${isOverdue ? 'bg-red-500' : 'bg-amber-500'}`}></div>

                      <div className="flex items-start gap-4 z-10 pl-2">
                        <div className={`p-3 rounded-lg flex-shrink-0 ${isOverdue ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                          <Bell size={20} />
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-white text-base group-hover:text-primary transition-colors">{rem.title}</h4>
                          <p className="text-secondary text-sm mt-1">{rem.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 z-10 sm:min-w-[120px] pl-16 sm:pl-0">
                        <div className="text-left sm:text-right">
                          <div className="text-[10px] text-secondary uppercase font-bold tracking-wider mb-1">Due Date</div>
                          <div className={`font-medium ${isOverdue ? 'text-red-400' : 'text-amber-400'}`}>
                            {dueDate.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                        <button className="flex items-center gap-1 text-xs font-medium text-primary hover:text-white transition-colors bg-surface py-1.5 px-3 rounded-md border border-outline-variant/20 hover:border-primary/50">
                          Resolve
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

