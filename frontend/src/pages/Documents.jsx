import React, { useState, useEffect } from 'react';
import api from '../api';
import { FileText, Upload, Calendar, Bell } from 'lucide-react';

const Documents = () => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState('');
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState('RC');
  const [viewDoc, setViewDoc] = useState(null);
  const [reminderDoc, setReminderDoc] = useState(null);
  const [reminderDate, setReminderDate] = useState('');
  const [reminding, setReminding] = useState(false);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    fetchCars();
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const res = await api.get('/reminders');
      setReminders(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCars = async () => {
    try {
      const res = await api.get('/cars');
      setCars(res.data.data);
      if (res.data.data.length > 0) {
        setSelectedCar(res.data.data[0]._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedCar) fetchDocuments(selectedCar);
  }, [selectedCar]);

  const fetchDocuments = async (carId) => {
    try {
      const res = await api.get(`/documents/${carId}`);
      setDocuments(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !selectedCar) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('docType', docType);

    try {
      await api.post(`/documents/${selectedCar}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setFile(null);
      fetchDocuments(selectedCar);
    } catch (err) {
      alert("Error uploading document. Check server logs.");
    } finally {
      setUploading(false);
    }
  };

  const getFullDocUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const baseUrl = api.defaults.baseURL ? api.defaults.baseURL.replace('/api', '') : 'http://localhost:5000';
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const handleSetReminder = async (e) => {
    e.preventDefault();
    if (!reminderDoc || !reminderDate) return;

    setReminding(true);
    try {
      await api.post('/reminders', {
        documentId: reminderDoc._id,
        carId: selectedCar,
        title: `${reminderDoc.docType} Expiry Alert`,
        description: `Manual reminder for your vehicle's ${reminderDoc.docType}.`,
        dueDate: reminderDate
      });
      setReminderDoc(null);
      fetchReminders();
      alert("Reminder successfully scheduled!");
    } catch (err) {
      alert("Error setting reminder. Check console.");
    } finally {
      setReminding(false);
    }
  };

  const openReminderModal = (doc) => {
    const expiry = new Date(doc.expiryDate);
    // Default to 15 days before expiry
    const defaultReminderDate = new Date(expiry.setDate(expiry.getDate() - 15)).toISOString().split('T')[0];
    setReminderDate(defaultReminderDate);
    setReminderDoc(doc);
  };

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b border-surface-container-high pb-4">
        <h1 className="text-3xl font-heading font-bold text-white">Document Vault</h1>
      </div>

      {cars.length === 0 ? (
        <p className="text-secondary">Please register a vehicle first to upload documents.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Panel */}
          <div className="glass-card p-6 h-fit bg-surface-container-lowest">
            <h2 className="text-xl font-heading mb-4">Secure Upload</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="text-xs text-secondary uppercase tracking-wider font-semibold">Select Vehicle</label>
                <select className="input-glow w-full mt-1 bg-surface-lowest text-white" value={selectedCar} onChange={e => setSelectedCar(e.target.value)}>
                  {cars.map(c => <option key={c._id} value={c._id}>{c.brand} {c.model} ({c.registrationNumber})</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-secondary uppercase tracking-wider font-semibold">Document Type</label>
                <select className="input-glow w-full mt-1 bg-surface-lowest text-white" value={docType} onChange={e => setDocType(e.target.value)}>
                  <option value="RC">RC</option>
                  <option value="Insurance">Insurance</option>
                  <option value="PUC">PUC</option>
                  <option value="License">License</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-secondary uppercase tracking-wider font-semibold">File (Image/PDF)</label>
                <input type="file" className="w-full mt-2 text-sm text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-surface-bright file:text-primary hover:file:bg-surface-container-highest cursor-pointer" onChange={e => setFile(e.target.files[0])} />
              </div>
              <button type="submit" disabled={!file || uploading} className="w-full btn-primary disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
                <Upload size={18} /> {uploading ? 'Processing AI OCR...' : 'Upload & Scan'}
              </button>
            </form>
          </div>

          {/* Documents Grid */}
          <div className="col-span-2 space-y-4">
            <h2 className="text-xl font-heading mb-4 border-b border-outline-variant/10 pb-2">Vault Records</h2>
            {documents.length === 0 ? (
              <p className="text-secondary text-sm">No documents found for this vehicle.</p>
            ) : (
              documents.map(doc => {
                const docReminder = reminders.find(r => r.document === doc._id || (r.document?._id === doc._id));
                return (
                <div key={doc._id} className={`glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 ${doc.status === 'valid' ? 'border-primary' : 'border-red-500'}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-surface-bright flex items-center justify-center text-primary shrink-0">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg text-white tracking-wide">{doc.docType} Record</h3>
                      <p className="text-xs text-secondary flex items-center gap-1 mt-1 font-mono">
                        <Calendar size={12} /> Expiry: {new Date(doc.expiryDate).toLocaleDateString()}
                      </p>
                      {docReminder && (
                        <p className="text-[10px] text-primary flex items-center gap-1 mt-1 font-bold uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded w-fit">
                           <Bell size={10} /> Reminder: {new Date(docReminder.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 items-center self-start md:self-auto ml-16 md:ml-0">
                    <span className={`text-xs px-2 py-1 rounded uppercase tracking-wider font-bold ${doc.status === 'valid' ? 'bg-primary/20 text-primary' : 'bg-red-500/20 text-red-500'}`}>
                      {doc.status.replace('_', ' ')}
                    </span>
                    <div className="flex gap-2">
                        <button onClick={() => setViewDoc(doc.fileUrl)} className="text-white hover:text-primary transition-colors text-sm font-bold bg-surface-bright px-3 py-1 rounded cursor-pointer">VIEW</button>
                        <button onClick={() => openReminderModal(doc)} className={`text-white transition-colors text-sm font-bold ${docReminder ? 'bg-red-600/40 hover:bg-red-600' : 'bg-surface-container-highest hover:bg-surface-container-high'} px-3 py-1 rounded cursor-pointer flex items-center gap-1`}>
                            <Bell size={14} className={docReminder ? "text-white" : "text-secondary"} /> {docReminder ? 'UPDATE' : 'REMIND'}
                        </button>
                    </div>
                  </div>
                </div>
              )})
            )}
          </div>
        </div>
      )}

      {/* Document View Modal */}
      {viewDoc && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setViewDoc(null)}
        >
          <div 
            className="relative bg-surface-container-low p-2 rounded-2xl w-11/12 max-w-5xl h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute -top-4 -right-4 bg-red-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold hover:bg-red-500 shadow-lg transition-transform hover:scale-110"
              onClick={() => setViewDoc(null)}
            >
              X
            </button>
            <div className="w-full h-full bg-white/5 rounded-xl overflow-hidden flex items-center justify-center">
              {viewDoc.toLowerCase().match(/\.(jpeg|jpg|png|gif)(\?.*)?$/) ? (
                <img src={getFullDocUrl(viewDoc)} alt="Document" className="max-w-full max-h-full object-contain" />
              ) : (
                <iframe src={getFullDocUrl(viewDoc)} className="w-full h-full bg-white" title="Document View" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {reminderDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="glass-card p-8 w-11/12 max-w-md bg-surface-container-low shadow-2xl">
            <h2 className="text-2xl font-heading font-bold text-white mb-2">Set Alert: {reminderDoc.docType}</h2>
            <p className="text-secondary text-sm mb-6">Schedule an automated reminder before your document expires on {new Date(reminderDoc.expiryDate).toLocaleDateString()}.</p>
            
            <form onSubmit={handleSetReminder} className="space-y-4">
              <div>
                <label className="text-xs text-secondary uppercase tracking-wider font-bold">Reminder Date</label>
                <input 
                  type="date" 
                  className="input-glow w-full mt-1 bg-surface-bright text-white" 
                  value={reminderDate} 
                  onChange={e => setReminderDate(e.target.value)} 
                  required
                />
              </div>
              <div className="flex gap-4 pt-2">
                <button 
                  type="button" 
                  onClick={() => setReminderDoc(null)} 
                  className="flex-1 px-4 py-2 rounded-lg bg-surface-container-highest text-white font-bold hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={reminding}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  {reminding ? 'Scheduling...' : 'Set Reminder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
