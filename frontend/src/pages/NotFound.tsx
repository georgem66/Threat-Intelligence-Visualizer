import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Shield } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative text-center">
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
              <Shield className="h-16 w-16 text-white" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-3xl font-bold text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-xl text-slate-300 max-w-md mx-auto">
              The page you're looking for has been moved, deleted, or doesn't exist.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Home className="h-5 w-5" />
            <span>Go Home</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
