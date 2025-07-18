import React from 'react';
import { BarChart3, Cloud, LayoutGrid, Lock, Share2, Timer } from 'lucide-react';

const features = [
  {
    name: 'Intuitive Matrix Layout',
    description: 'Organize tasks in our beautifully designed four-quadrant system based on urgency and importance.',
    icon: LayoutGrid,
  },
  {
    name: 'Smart Task Management',
    description: 'Create, edit, and track tasks with ease. Set priorities, due dates, and mark tasks as complete.',
    icon: Timer,
  },
  {
    name: 'Productivity Analytics',
    description: 'Gain insights into your productivity patterns with detailed reports and visualizations.',
    icon: BarChart3,
  },
  {
    name: 'Team Collaboration',
    description: 'Share matrices with your team and collaborate on tasks in real-time with Pro accounts.',
    icon: Share2,
  },
  {
    name: 'Cloud Sync',
    description: 'Access your tasks from any device with secure cloud synchronization for Pro users.',
    icon: Cloud,
  },
  {
    name: 'Data Security',
    description: 'Your data is encrypted and securely stored with enterprise-grade security protocols.',
    icon: Lock,
  },
];

const Features: React.FC = () => {
  return (
    <div id="features" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Work Smarter</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to master your productivity
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our Eisenhower Matrix app provides all the tools you need to organize, prioritize, and execute your tasks effectively.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col p-6 rounded-lg hover:bg-gray-50 transition-colors">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-6 w-6 flex-none text-indigo-600" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Features;
