import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Activity, Globe } from 'lucide-react';
import ThreatMap from '../components/ThreatMap';
import MetricCard from '../components/MetricCard';
import ThreatChart from '../components/ThreatChart';
import RecentThreats from '../components/RecentThreats';
import { analyticsService } from '../services/analyticsService';

interface DashboardData {
  overview: {
    totalThreats: number;
    threatsLast30Days: number;
    threatsLast7Days: number;
    threatsToday: number;
  };
  charts: {
    topCountries: Array<{ country: string; count: number }>;
    severityDistribution: Record<string, number>;
    categoryDistribution: Record<string, number>;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    value: string;
    category: string;
    severity: string;
    source: string;
    createdAt: string;
  }>;
}

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getDashboard();
      setDashboardData(data);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              Error loading dashboard
            </h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Threat Intelligence Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Real-time threat monitoring and analysis
        </p>
      </div>

      {dashboardData && (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Threats"
              value={dashboardData.overview.totalThreats}
              icon={Shield}
              color="blue"
            />
            <MetricCard
              title="New Threats (30d)"
              value={dashboardData.overview.threatsLast30Days}
              icon={AlertTriangle}
              color="yellow"
            />
            <MetricCard
              title="New Threats (7d)"
              value={dashboardData.overview.threatsLast7Days}
              icon={Activity}
              color="green"
            />
            <MetricCard
              title="Threats Today"
              value={dashboardData.overview.threatsToday}
              icon={Globe}
              color="red"
            />
          </div>

          {/* Charts and Map */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Threat Map */}
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Geographic Distribution
              </h3>
              <ThreatMap />
            </div>

            {/* Severity Chart */}
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Threat Severity
              </h3>
              <ThreatChart
                data={dashboardData.charts.severityDistribution}
                type="doughnut"
              />
            </div>
          </div>

          {/* Category Distribution and Recent Activity */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Threat Categories
              </h3>
              <ThreatChart
                data={dashboardData.charts.categoryDistribution}
                type="bar"
              />
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h3>
              <RecentThreats threats={dashboardData.recentActivity} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;