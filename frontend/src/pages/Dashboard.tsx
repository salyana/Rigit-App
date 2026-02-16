import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api/client';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    projects: 0,
    quotes: 0,
    bookings: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, quotesRes, bookingsRes] = await Promise.all([
          apiClient.get('/projects'),
          apiClient.get('/quotes'),
          apiClient.get('/bookings'),
        ]);
        setStats({
          projects: projectsRes.data.projects?.length || 0,
          quotes: quotesRes.data.quotes?.length || 0,
          bookings: bookingsRes.data.bookings?.length || 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p className="text-lg mb-8">Welcome back, {user?.name}!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Projects</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.projects}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Quotes</h3>
          <p className="text-3xl font-bold text-green-600">{stats.quotes}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Bookings</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.bookings}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
