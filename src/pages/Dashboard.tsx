
import React from 'react';
import WelcomeSection from '../components/dashboard/WelcomeSection';
import DashboardStats from '../components/dashboard/DashboardStats';
import DashboardOverview from '../components/dashboard/DashboardOverview';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <WelcomeSection />
      <DashboardStats />
      <DashboardOverview />
    </div>
  );
};

export default Dashboard;
