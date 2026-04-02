import React, { useState, useEffect, useMemo } from 'react';
import api from '../api';
import {
  IndianRupee, Plus, Trash2, Filter, TrendingUp,
  CreditCard, ShieldCheck, Receipt, AlertTriangle,
  ChevronDown, X, Calendar, Car, Search
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const TYPE_META = {
  Service: { icon: <Receipt size={15} />, color: '#38bdf8', bg: 'rgba(56,189,248,0.08)', border: 'rgba(56,189,248,0.2)' },
  Challan: { icon: <AlertTriangle size={15} />, color: '#f97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.2)' },
  Insurance: { icon: <ShieldCheck size={15} />, color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)' },
  RoadTax: { icon: <CreditCard size={15} />, color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)' },
  Other: { icon: <IndianRupee size={15} />, color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)' },
};

const STATUS_COLORS = {
  completed: '#34d399',
  pending: '#fbbf24',
  failed: '#ef4444',
};

const TYPES = ['Service', 'Challan', 'Insurance', 'RoadTax', 'Other'];

const formatCurrency = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

/* ───────────── Main Component ───────────── */
const PaymentTracker = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    carId: '', amount: '', paymentType: 'Service', status: 'completed', note: '', date: null
  });
  const [formLoading, setFormLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = async () => {
    try {
      const [paymentsRes, statsRes, carsRes] = await Promise.all([
        api.get('/payments'),
        api.get('/payments/stats'),
        api.get('/cars')
      ]);
      setPayments(paymentsRes.data.data);
      setStats(statsRes.data.data);
      setCars(carsRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.paymentType) return;
    setFormLoading(true);
    try {
      await api.post('/payments', formData);
      setFormData({ carId: '', amount: '', paymentType: 'Service', status: 'completed', note: '', date: null });
      setShowForm(false);
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/payments/${id}`);
      setDeleteId(null);
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  /* ── Filtered + searched list ── */
  const filteredPayments = useMemo(() => {
    let list = payments;
    if (filterType) list = list.filter(p => p.paymentType === filterType);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(p =>
        p.paymentType.toLowerCase().includes(q) ||
        (p.note && p.note.toLowerCase().includes(q)) ||
        (p.transactionId && p.transactionId.toLowerCase().includes(q)) ||
        (p.car && (`${p.car.make} ${p.car.model}`).toLowerCase().includes(q))
      );
    }
    return list;
  }, [payments, filterType, searchTerm]);

  /* ── Chart data ── */
  const pieData = useMemo(() => {
    if (!stats) return [];
    return TYPES.filter(t => stats.byType[t] > 0).map(t => ({
      name: t, value: stats.byType[t], color: TYPE_META[t].color
    }));
  }, [stats]);

  const barData = useMemo(() => {
    if (!stats) return [];
    return TYPES.map(t => ({
      name: t, amount: stats.byType[t], fill: TYPE_META[t].color
    }));
  }, [stats]);

  if (loading) {
    return (
      <div className="p-8 mt-20 text-center">
        <div className="inline-flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-sky-400/40 border-t-sky-400 rounded-full animate-spin" />
          Loading payment data...
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .pay-animate {
          animation: slideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .pay-stagger-1 { animation-delay: 0.04s; }
        .pay-stagger-2 { animation-delay: 0.08s; }
        .pay-stagger-3 { animation-delay: 0.12s; }
        .pay-stagger-4 { animation-delay: 0.16s; }
        .pay-overlay {
          animation: fadeIn 0.2s ease both;
        }
        .pay-modal {
          animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .pay-row:hover {
          background: rgba(255,255,255,0.02);
        }
        .pay-row {
          transition: background 0.15s ease;
        }
        .pay-input {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 10px 14px;
          color: #e2e8f0;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
          font-family: 'Manrope', sans-serif;
        }
        .pay-input:focus {
          border-color: rgba(56,189,248,0.5);
          box-shadow: 0 0 0 3px rgba(56,189,248,0.08);
        }
        .pay-input::placeholder {
          color: rgba(148,163,184,0.4);
        }
        .pay-select {
          appearance: none;
          background: rgba(255,255,255,0.03) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 12px center;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 10px 36px 10px 14px;
          color: #e2e8f0;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
          font-family: 'Manrope', sans-serif;
          cursor: pointer;
        }
        .pay-select:focus {
          border-color: rgba(56,189,248,0.5);
        }
        .pay-select option {
          background: #1e293b;
          color: #e2e8f0;
        }
        .pay-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
          border: 1px solid;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: 'Space Grotesk', sans-serif;
        }
        .pay-chip:hover {
          filter: brightness(1.2);
        }
        .pay-chip.active {
          filter: brightness(1.3);
          box-shadow: 0 0 12px rgba(56,189,248,0.15);
        }
        .pay-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          border-radius: 5px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-family: 'Space Grotesk', sans-serif;
        }
      `}</style>

      <div className="p-6 md:p-10 max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 pay-animate">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-sky-400" style={{ animation: 'pulse-dot 2s ease infinite' }} />
              <span className="font-['Space_Grotesk'] text-[11px] font-semibold tracking-[0.2em] text-sky-400/70 uppercase">
                Financial Overview
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-['Space_Grotesk'] font-bold text-white tracking-tight">
              Payment Tracker
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-['Manrope']">
              Track all your vehicle-related expenses in one place.
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-[#0b0e14] px-5 py-2.5 rounded-lg font-['Space_Grotesk'] font-bold text-sm tracking-wide transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(56,189,248,0.2)]"
          >
            <Plus size={16} strokeWidth={2.5} />
            Add Payment
          </button>
        </div>

        {/* ── Stats Cards ── */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Spent', value: formatCurrency(stats.totalSpent), icon: <TrendingUp size={18} />, accent: '#38bdf8', delay: 'pay-stagger-1' },
              { label: 'This Month', value: formatCurrency(stats.monthlySpent), icon: <Calendar size={18} />, accent: '#a78bfa', delay: 'pay-stagger-2' },
              { label: 'Transactions', value: stats.count, icon: <CreditCard size={18} />, accent: '#34d399', delay: 'pay-stagger-3' },
              { label: 'Categories', value: TYPES.filter(t => stats.byType[t] > 0).length, icon: <Filter size={18} />, accent: '#fbbf24', delay: 'pay-stagger-4' },
            ].map((card, i) => (
              <div
                key={i}
                className={`pay-animate ${card.delay}`}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12,
                  padding: '20px 22px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute', top: 0, right: 0, width: 80, height: 80,
                  background: `radial-gradient(circle at top right, ${card.accent}08, transparent)`,
                }} />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-['Space_Grotesk'] text-[11px] font-semibold tracking-[0.15em] uppercase mb-1.5"
                      style={{ color: `${card.accent}99` }}>
                      {card.label}
                    </p>
                    <p className="text-2xl font-['Space_Grotesk'] font-bold text-white">{card.value}</p>
                  </div>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: `${card.accent}10`,
                    border: `1px solid ${card.accent}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: card.accent,
                  }}>
                    {card.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Charts Row ── */}
        {stats && stats.count > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            {/* Bar Chart */}
            <div className="pay-animate pay-stagger-2" style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12, padding: '20px 22px',
            }}>
              <h3 className="font-['Space_Grotesk'] text-sm font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={14} className="text-sky-400" />
                Spending by Category
              </h3>
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} barSize={32} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                    <XAxis
                      dataKey="name" axisLine={false} tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Space Grotesk' }}
                    />
                    <YAxis
                      axisLine={false} tickLine={false}
                      tick={{ fill: '#475569', fontSize: 10, fontFamily: 'Space Grotesk' }}
                      tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 8, fontSize: 12, fontFamily: 'Manrope',
                      }}
                      labelStyle={{ color: '#94a3b8' }}
                      formatter={(value) => [formatCurrency(value), 'Amount']}
                      cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    />
                    <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} fillOpacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="pay-animate pay-stagger-3" style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12, padding: '20px 22px',
            }}>
              <h3 className="font-['Space_Grotesk'] text-sm font-bold text-white mb-4 flex items-center gap-2">
                <CreditCard size={14} className="text-purple-400" />
                Distribution
              </h3>
              <div className="flex items-center gap-4" style={{ height: 200 }}>
                <div style={{ width: '55%', height: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData} cx="50%" cy="50%"
                        innerRadius={50} outerRadius={80}
                        paddingAngle={3} dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} fillOpacity={0.85} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 8, fontSize: 12,
                        }}
                        formatter={(value) => [formatCurrency(value), 'Amount']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-2.5 flex-1">
                  {pieData.map(d => (
                    <div key={d.name} className="flex items-center gap-2">
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                      <span className="text-xs text-slate-400 font-['Manrope'] flex-1">{d.name}</span>
                      <span className="text-xs text-slate-300 font-['Space_Grotesk'] font-semibold">
                        {formatCurrency(d.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Filters + Search ── */}
        <div className="pay-animate pay-stagger-3 flex flex-col md:flex-row gap-3 mb-5">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pay-input"
              style={{ paddingLeft: 34 }}
            />
          </div>

          {/* Type filter chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              className={`pay-chip ${!filterType ? 'active' : ''}`}
              style={{
                background: !filterType ? 'rgba(56,189,248,0.12)' : 'transparent',
                color: !filterType ? '#38bdf8' : '#64748b',
                borderColor: !filterType ? 'rgba(56,189,248,0.3)' : 'rgba(255,255,255,0.08)'
              }}
              onClick={() => setFilterType('')}
            >
              All
            </button>
            {TYPES.map(t => (
              <button
                key={t}
                className={`pay-chip ${filterType === t ? 'active' : ''}`}
                style={{
                  background: filterType === t ? TYPE_META[t].bg : 'transparent',
                  color: filterType === t ? TYPE_META[t].color : '#64748b',
                  borderColor: filterType === t ? TYPE_META[t].border : 'rgba(255,255,255,0.08)',
                }}
                onClick={() => setFilterType(filterType === t ? '' : t)}
              >
                {TYPE_META[t].icon}
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* ── Payments Table ── */}
        <div className="pay-animate pay-stagger-4" style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12, overflow: 'hidden',
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr 0.8fr 0.7fr 1.2fr 0.6fr 48px',
            padding: '12px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.01)',
          }}>
            {['Type', 'Vehicle', 'Amount', 'Status', 'Date / TXN', 'Note', ''].map((h, i) => (
              <span key={i} className="font-['Space_Grotesk'] text-[10px] font-bold tracking-[0.15em] uppercase text-slate-500">
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {filteredPayments.length === 0 ? (
            <div className="py-16 text-center">
              <IndianRupee size={28} className="mx-auto text-slate-600 mb-3" />
              <p className="text-slate-500 text-sm font-['Manrope']">No payments found.</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-3 text-sky-400 text-xs font-['Space_Grotesk'] font-semibold hover:underline"
              >
                + Add your first payment
              </button>
            </div>
          ) : (
            filteredPayments.map((payment) => {
              const meta = TYPE_META[payment.paymentType] || TYPE_META.Other;
              return (
                <div key={payment._id} className="pay-row" style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1.2fr 0.8fr 0.7fr 1.2fr 0.6fr 48px',
                  padding: '14px 20px',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                  alignItems: 'center',
                }}>
                  {/* Type */}
                  <div className="flex items-center gap-2">
                    <div style={{
                      width: 28, height: 28, borderRadius: 7,
                      background: meta.bg, border: `1px solid ${meta.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: meta.color,
                    }}>
                      {meta.icon}
                    </div>
                    <span className="text-sm text-slate-200 font-['Space_Grotesk'] font-semibold">
                      {payment.paymentType}
                    </span>
                  </div>

                  {/* Vehicle */}
                  <div className="flex items-center gap-1.5">
                    {payment.car ? (
                      <>
                        <Car size={12} className="text-slate-500" />
                        <span className="text-sm text-slate-300 font-['Manrope']">
                          {payment.car.make} {payment.car.model}
                          {payment.car.registrationNumber && (
                            <span className="text-slate-500 ml-1 text-xs">
                              ({payment.car.registrationNumber})
                            </span>
                          )}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-slate-600">—</span>
                    )}
                  </div>

                  {/* Amount */}
                  <span className="text-sm text-white font-['Space_Grotesk'] font-bold">
                    {formatCurrency(payment.amount)}
                  </span>

                  {/* Status */}
                  <div>
                    <span className="pay-badge" style={{
                      background: `${STATUS_COLORS[payment.status]}15`,
                      color: STATUS_COLORS[payment.status],
                      border: `1px solid ${STATUS_COLORS[payment.status]}30`,
                    }}>
                      <div style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: STATUS_COLORS[payment.status],
                      }} />
                      {payment.status}
                    </span>
                  </div>

                  {/* Date / TXN */}
                  <div>
                    <div className="text-sm text-slate-300 font-['Manrope']">
                      {new Date(payment.date).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </div>
                    {payment.transactionId && (
                      <div className="text-[10px] text-slate-600 font-['DM_Mono',monospace] mt-0.5">
                        {payment.transactionId}
                      </div>
                    )}
                  </div>

                  {/* Note */}
                  <div className="text-xs text-slate-500 font-['Manrope'] truncate" title={payment.note}>
                    {payment.note || '—'}
                  </div>

                  {/* Delete */}
                  <div className="flex justify-end">
                    {deleteId === payment._id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(payment._id)}
                          className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                          title="Confirm delete"
                        >
                          <Trash2 size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteId(null)}
                          className="text-slate-500 hover:text-slate-300 p-1 rounded transition-colors"
                          title="Cancel"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteId(payment._id)}
                        className="text-slate-600 hover:text-red-400 p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                        style={{ opacity: 1 }}
                        title="Delete payment"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Footer summary */}
          {filteredPayments.length > 0 && (
            <div style={{
              padding: '12px 20px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span className="text-xs text-slate-500 font-['Manrope']">
                {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''} shown
              </span>
              <span className="text-sm text-white font-['Space_Grotesk'] font-bold">
                Total: {formatCurrency(filteredPayments.reduce((s, p) => s + p.amount, 0))}
              </span>
            </div>
          )}
        </div>


        {/* ══════════════════ Add Payment Modal ══════════════════ */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ padding: 16 }}>
            <div className="pay-overlay absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />

            <div className="pay-modal relative w-full max-w-lg" style={{
              background: '#111827',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              overflow: 'hidden',
            }}>
              {/* Modal header */}
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <h2 className="text-lg font-['Space_Grotesk'] font-bold text-white">New Payment</h2>
                  <p className="text-xs text-slate-500 font-['Manrope'] mt-0.5">Record a new expense</p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-slate-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal form */}
              <form onSubmit={handleSubmit} style={{ padding: '20px 24px' }}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Payment Type */}
                  <div>
                    <label className="block font-['Space_Grotesk'] text-[11px] font-semibold tracking-[0.12em] uppercase text-slate-500 mb-1.5">
                      Type
                    </label>
                    <select
                      className="pay-select"
                      value={formData.paymentType}
                      onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                    >
                      {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block font-['Space_Grotesk'] text-[11px] font-semibold tracking-[0.12em] uppercase text-slate-500 mb-1.5">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      className="pay-input"
                      placeholder="0"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Vehicle */}
                  <div>
                    <label className="block font-['Space_Grotesk'] text-[11px] font-semibold tracking-[0.12em] uppercase text-slate-500 mb-1.5">
                      Vehicle <span className="text-slate-600">(optional)</span>
                    </label>
                    <select
                      className="pay-select"
                      value={formData.carId}
                      onChange={(e) => setFormData({ ...formData, carId: e.target.value })}
                    >
                      <option value="">No vehicle</option>
                      {cars.map(c => (
                        <option key={c._id} value={c._id}>
                          {c.make} {c.model} {c.registrationNumber ? `(${c.registrationNumber})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block font-['Space_Grotesk'] text-[11px] font-semibold tracking-[0.12em] uppercase text-slate-500 mb-1.5">
                      Status
                    </label>
                    <select
                      className="pay-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>

                {/* Date */}
                <div className="mb-4">
                  <label className="block font-['Space_Grotesk'] text-[11px] font-semibold tracking-[0.12em] uppercase text-slate-500 mb-1.5">
                    Date <span className="text-slate-600">(defaults to today)</span>
                  </label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={formData.date ? dayjs(formData.date) : null}
                      onChange={(newValue) => setFormData({ ...formData, date: newValue ? newValue.toDate() : null })}
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-root': {
                          color: '#e2e8f0',
                          fontFamily: 'Manrope, sans-serif',
                          fontSize: '14px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '8px',
                          transition: 'border-color 0.2s, box-shadow 0.2s',
                          padding: 0,
                          '&:hover': {
                            borderColor: 'rgba(56,189,248,0.5)',
                          },
                          '&.Mui-focused': {
                            borderColor: 'rgba(56,189,248,0.5)',
                            boxShadow: '0 0 0 3px rgba(56,189,248,0.08)',
                          }
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '& .MuiInputBase-input': {
                          padding: '10px 14px',
                        },
                        '& .MuiSvgIcon-root': {
                          color: '#94a3b8'
                        }
                      }}
                    />
                  </LocalizationProvider>
                </div>

                {/* Note */}
                <div className="mb-6">
                  <label className="block font-['Space_Grotesk'] text-[11px] font-semibold tracking-[0.12em] uppercase text-slate-500 mb-1.5">
                    Note <span className="text-slate-600">(optional)</span>
                  </label>
                  <input
                    type="text"
                    className="pay-input"
                    placeholder="e.g. Oil change, tyre replacement..."
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  />
                </div>

                {/* Submit */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-2.5 rounded-lg border border-white/10 text-slate-400 font-['Space_Grotesk'] font-semibold text-sm hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading || !formData.amount}
                    className="flex-1 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-[#0b0e14] font-['Space_Grotesk'] font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {formLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#0b0e14]/30 border-t-[#0b0e14] rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Plus size={15} strokeWidth={2.5} />
                        Add Payment
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PaymentTracker;
