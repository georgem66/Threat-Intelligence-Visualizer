import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

interface Threat {
  id: string;
  type: string;
  value: string;
  category: string;
  severity: string;
  source: string;
  createdAt: string;
}

interface RecentThreatsProps {
  threats: Threat[];
}

const severityColors = {
  critical: 'text-red-700 bg-red-100 dark:text-red-200 dark:bg-red-900/50',
  high: 'text-orange-700 bg-orange-100 dark:text-orange-200 dark:bg-orange-900/50',
  medium: 'text-yellow-700 bg-yellow-100 dark:text-yellow-200 dark:bg-yellow-900/50',
  low: 'text-green-700 bg-green-100 dark:text-green-200 dark:bg-green-900/50',
};

const typeIcons = {
  ip: '🌐',
  domain: '🌍',
  url: '🔗',
  hash: '🔒',
  email: '📧',
};

const RecentThreats: React.FC<RecentThreatsProps> = ({ threats }) => {
  if (threats.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No recent threats</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto">
      {threats.map((threat) => (
        <div key={threat.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <span className="text-lg">
                {typeIcons[threat.type as keyof typeof typeIcons] || '🔍'}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {threat.value}
                  </p>
                  <span
                    className={clsx(
                      'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                      severityColors[threat.severity as keyof typeof severityColors]
                    )}
                  >
                    {threat.severity}
                  </span>
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {threat.category} • {threat.type}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {threat.source}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(new Date(threat.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentThreats;