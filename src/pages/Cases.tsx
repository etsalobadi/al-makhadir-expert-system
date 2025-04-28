
import React from 'react';
import CaseWorkflow from '../components/cases/CaseWorkflow';

const Cases: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-judicial-dark">إدارة القضايا</h2>
      <CaseWorkflow />
    </div>
  );
};

export default Cases;
