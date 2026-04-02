import React, { useState, useEffect } from 'react';
import api from '../api';
import { Loader2, Plus, Trash2 } from 'lucide-react';

const MyCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form bounds
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ brand: '', model: '', year: '', registrationNumber: '' });
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await api.get('/cars');
      setCars(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    try {
      await api.post('/cars', formData);
      setShowForm(false);
      setFormData({ brand: '', model: '', year: '', registrationNumber: '' });
      fetchCars();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Error adding car.");
    }
  };

  const confirmDelete = async () => {
    if (!vehicleToDelete) return;
    try {
      await api.delete(`/cars/${vehicleToDelete._id}`);
      setVehicleToDelete(null);
      fetchCars();
    } catch (err) {
      alert("Failed to delete car");
    }
  };

  if (loading) return <div className="p-8 mt-20 text-center animate-pulse flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Accessing Garage...</div>;

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b border-surface-container-high pb-4">
        <h1 className="text-3xl font-heading font-bold text-white">My Fleet</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          {showForm ? 'Cancel Registration' : <><Plus size={16} /> Register Vehicle</>}
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6 mb-8 max-w-2xl">
          <h2 className="text-xl font-heading mb-4">Register New Vehicle</h2>
          <form onSubmit={handleAddCar} className="grid grid-cols-2 gap-4">
            <input className="input-glow" placeholder="Brand (e.g. Maruti)" required value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} />
            <input className="input-glow" placeholder="Model (e.g. Swift)" required value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })} />
            <input className="input-glow" type="number" placeholder="Year" required value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} />
            <input className="input-glow" placeholder="Reg. Number (e.g. MH01AB1234)" required value={formData.registrationNumber} onChange={e => setFormData({ ...formData, registrationNumber: e.target.value.toUpperCase() })} />
            <button type="submit" className="btn-primary col-span-2 mt-4">Save Profile</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cars.length === 0 ? (
          <p className="text-secondary">No vehicles detected in your garage.</p>
        ) : (
          cars.map(car => (
            <div key={car._id} className="glass-card p-6 border-l-4 border-primary hover:border-l-8 transition-all relative overflow-hidden group">
              <div className="absolute right-0 top-0 h-32 w-32 bg-primary/5 rounded-bl-[100px] -z-10 group-hover:bg-primary/10 transition-colors"></div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-heading font-bold text-white">{car.brand} {car.model}</h3>
                  <p className="text-sm text-secondary">{car.year}</p>
                </div>
                <div className="relative">
                  <div className="bg-surface-lowest px-3 py-1 rounded-md border border-outline-variant/20 font-mono text-sm tracking-widest text-primary transition-opacity duration-300 group-hover:opacity-0">
                    {car.registrationNumber}
                  </div>
                  <button 
                    onClick={() => setVehicleToDelete(car)}
                    className="absolute inset-0 flex items-center justify-center text-red-500 bg-red-500/10 rounded-md border border-red-500/30 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                    title="Remove Vehicle"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {vehicleToDelete && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setVehicleToDelete(null)}
        >
          <div 
            className="bg-surface-container p-8 rounded-2xl w-[90%] max-w-md shadow-2xl animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-heading font-bold text-white mb-2">Delete Vehicle?</h2>
            <p className="text-secondary mb-6 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">{vehicleToDelete.brand} {vehicleToDelete.model}</strong> ({vehicleToDelete.registrationNumber})? This will permanently erase the vehicle and all its documents.
            </p>
            <div className="flex gap-4 justify-end">
              <button onClick={() => setVehicleToDelete(null)} className="px-5 py-2 rounded-lg text-secondary hover:text-white hover:bg-surface-container-highest transition-colors font-bold cursor-pointer">Cancel</button>
              <button onClick={confirmDelete} className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors cursor-pointer">Delete Permanently</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCars;
