
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExpertRegistration from '../components/experts/ExpertRegistration';
import ExpertsList from '../components/experts/ExpertsList';

const Experts: React.FC = () => {
  const [activeTab, setActiveTab] = useState('list');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-judicial-dark">إدارة الخبراء</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 max-w-md">
          <TabsTrigger value="list">قائمة الخبراء</TabsTrigger>
          <TabsTrigger value="register">تسجيل خبير جديد</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <ExpertsList />
        </TabsContent>
        
        <TabsContent value="register">
          <ExpertRegistration />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Experts;
