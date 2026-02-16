import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold mb-4">Welcome to RigIt Platform</h1>
      <p className="text-xl text-gray-600 mb-8">
        Your complete scaffolding marketplace solution
      </p>
      {!isAuthenticated && (
        <div className="flex gap-4 justify-center">
          <Link
            to="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-700"
          >
            Login
          </Link>
        </div>
      )}
      {isAuthenticated && (
        <Link
          to="/dashboard"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 inline-block"
        >
          Go to Dashboard
        </Link>
      )}
    </div>
  );
};

export default Landing;
