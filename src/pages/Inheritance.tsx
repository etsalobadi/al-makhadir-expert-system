
import React from 'react';
import InheritanceCalculator from '../components/inheritance/InheritanceCalculator';

const Inheritance: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-judicial-dark">إدارة المواريث</h2>
      <InheritanceCalculator />
    </div>
  );
};

export default Inheritance;
