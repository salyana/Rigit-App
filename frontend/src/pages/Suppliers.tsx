import { useEffect, useState } from 'react';
import apiClient from '../api/client';

interface Supplier {
  id: string;
  company_name: string;
  description: string;
  rating: number;
}

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await apiClient.get('/suppliers');
        setSuppliers(response.data.suppliers || []);
      } catch (error) {
        console.error('Failed to fetch suppliers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  if (loading) {
    return <div>Loading suppliers...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Suppliers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">{supplier.company_name}</h3>
            <p className="text-gray-600 mb-4">{supplier.description}</p>
            <div className="flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="ml-2">{supplier.rating.toFixed(1)}</span>
            </div>
          </div>
        ))}
        {suppliers.length === 0 && (
          <p className="text-gray-500">No suppliers found.</p>
        )}
      </div>
    </div>
  );
};

export default Suppliers;
