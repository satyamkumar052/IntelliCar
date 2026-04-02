import React, { useState } from 'react';
import api from '../api';
import { MapPin, Search, Navigation } from 'lucide-react';

const LocationFinder = () => {
  const [params, setParams] = useState({ type: 'RTO', pincode: '' });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.get(`/location?type=${params.type}&pincode=${params.pincode}`);
      setResults(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Error finding locations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b border-surface-container-high pb-4">
        <h1 className="text-3xl font-heading font-bold text-white flex items-center gap-3">
          <MapPin className="text-primary" /> Service Locator
        </h1>
      </div>

      <div className="glass-card p-6 mb-8 flex flex-col md:flex-row gap-4 items-end bg-surface-container-lowest border border-outline-variant/10">
        <div className="w-full md:w-1/3">
          <label className="text-xs text-secondary uppercase font-semibold tracking-wider">Service Type</label>
          <select className="input-glow w-full mt-2 bg-surface-highest text-white" value={params.type} onChange={e => setParams({...params, type: e.target.value})}>
            <option value="RTO">RTO Office</option>
            <option value="PUC Center">PUC Center</option>
            <option value="Car Service Center">Service Center</option>
            <option value="Car Wash">Car Wash</option>
          </select>
        </div>
        <div className="w-full md:w-1/3">
          <label className="text-xs text-secondary uppercase font-semibold tracking-wider">Pincode / Area</label>
          <input 
            type="text" className="input-glow w-full mt-2 bg-surface-highest text-white" 
            placeholder="e.g. 400058 or Andheri"
            value={params.pincode} onChange={e => setParams({...params, pincode: e.target.value})}
          />
        </div>
        <button onClick={handleSearch} disabled={loading} className="w-full md:w-1/3 btn-primary flex items-center justify-center gap-2 mt-4 md:mt-0">
          <Search size={18} /> {loading ? 'Scanning Radar...' : 'Locate'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.length === 0 && !loading && params.pincode && (
           <div className="col-span-3 text-center border py-12 px-6 border-dashed border-outline-variant/20 rounded-lg bg-surface-container-lowest/50 flex flex-col items-center">
             <MapPin className="text-surface-highest w-16 h-16 mb-4 opacity-50" />
             <p className="text-white font-medium text-lg mb-2">
               No exact locations found via OpenStreetMap
             </p>
             <p className="text-secondary mb-6 max-w-lg mx-auto leading-relaxed text-sm">
               OpenStreetMap might not have indexed all "{params.type}" centers in "{params.pincode}". 
               You can run this exact search directly on Google Maps instead!
             </p>
             <a 
               href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(params.type + ' near ' + params.pincode)}`} 
               target="_blank" rel="noreferrer"
               className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
             >
               <Search size={18} /> Search directly on Google Maps
             </a>
           </div>
        )}
        
        {results.length === 0 && !loading && !params.pincode && (
           <p className="text-secondary col-span-3 text-center border py-12 border-dashed border-outline-variant/20 rounded-lg bg-surface-container-lowest/50">
             Enter a pincode or area to search for nearby locations.
           </p>
        )}

        {results.map((loc, idx) => (
          <div key={idx} className="glass-card p-6 flex flex-col justify-between hover:bg-surface-container-highest transition-colors">
            <div>
              <h3 className="text-lg font-heading font-bold text-white mb-2">{loc.name}</h3>
              <p className="text-sm text-secondary mb-4 line-clamp-2 leading-relaxed">{loc.address}</p>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-outline-variant/10">
              <span className="text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded tracking-widest">★ {loc.rating || 'N/A'} ({loc.user_ratings_total||0})</span>
              <a href={loc.maps_link} target="_blank" rel="noreferrer" className="text-white hover:text-primary transition-colors text-sm font-bold flex items-center gap-1 bg-surface-bright px-3 py-1 rounded">
                <Navigation size={14} /> NAVIGATE
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationFinder;
