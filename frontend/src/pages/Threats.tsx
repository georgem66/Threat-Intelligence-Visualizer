import React from 'react';

const ThreatsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Threat Management
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View and manage threat intelligence data
        </p>
      </div>
      
      <div className="card p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Threat Management Interface
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Advanced threat listing, filtering, and management features coming soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThreatsPage;