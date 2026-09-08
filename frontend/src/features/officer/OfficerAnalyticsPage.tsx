import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/cards/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const OfficerAnalyticsPage: React.FC = () => {
  const cropData = [
    { name: 'Paddy (Common / Grade A)', value: 55, color: '#1E5A3A' },
    { name: 'Wheat (FAQ)', value: 30, color: '#2E8B57' },
    { name: 'Mustard / Maize', value: 15, color: '#F0A93C' },
  ];

  return (
    <PageContainer
      title="Intake & Operational Analytics"
      subtitle="Aggregate visibility of daily procurement throughput, crop mix distributions, and wait times."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-base font-bold text-text-primary mb-4 pb-2 border-b border-surface-border">
            Today's Crop Intake Distribution
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cropData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {cropData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-base font-bold text-text-primary mb-4 pb-2 border-b border-surface-border">
            Key Performance Metrics
          </h2>
          <div className="space-y-4 text-xs">
            <div className="flex justify-between py-2 border-b border-surface-border">
              <span className="text-text-secondary">Average Queue Waiting Time:</span>
              <span className="font-bold text-text-primary">32 Minutes</span>
            </div>
            <div className="flex justify-between py-2 border-b border-surface-border">
              <span className="text-text-secondary">Inspection Passing Rate:</span>
              <span className="font-bold text-brand-primary">96.4%</span>
            </div>
            <div className="flex justify-between py-2 border-b border-surface-border">
              <span className="text-text-secondary">Target Achievement (Today):</span>
              <span className="font-bold text-text-primary">82% of Quota</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-text-secondary">DBT Settlement Speed:</span>
              <span className="font-bold text-brand-dark">Instant (&lt; 2 hours)</span>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};
