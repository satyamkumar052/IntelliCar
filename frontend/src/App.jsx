import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyCars from './pages/MyCars';
import Documents from './pages/Documents';
import Recommendation from './pages/Recommendation';
import LocationFinder from './pages/LocationFinder';
import Chatbot from './pages/Chatbot';
import PaymentTracker from './pages/PaymentTracker';
import Profile from './pages/Profile';
import Forum from './pages/Forum';
import DiscussionDetail from './pages/DiscussionDetail';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUser, setLoading } from './store/authSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchUser());
    } else {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-surface text-gray-100 font-body">
      <ToastContainer position="top-left" hideProgressBar theme="dark" autoClose={2000} />
      <Navbar />
      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-cars" element={<MyCars />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/recommend" element={<Recommendation />} />
            <Route path="/location" element={<LocationFinder />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/payments" element={<PaymentTracker />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/forum/:id" element={<DiscussionDetail />} />
          </Route>
        </Routes>
      </main>
    </div>
  )
}

export default App;
