import React from 'react';
import Todo from '../components/Todo';
import { Helmet } from 'react-helmet-async';

const OdontoMasterPlanning = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <Helmet>
        <title>OdontoMaster Marketing Planning</title>
        <meta name="description" content="Planning tasks for the OdontoMaster white-label dental clinic management system marketing site" />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">OdontoMaster Marketing Site Planning</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Use this planner to organize tasks for creating an effective marketing site
            for the OdontoMaster white-label dental clinic management system.
          </p>
        </div>
        
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Product:</strong> OdontoMaster - A white-label dental clinic management system
            </p>
            <p>
              <strong>Target Audience:</strong> Dental software resellers, dental practice consultants, and dental technology providers
            </p>
            <p>
              <strong>Primary Goal:</strong> Drive organic traffic and generate qualified leads for the white-label solution
            </p>
            <p>
              <strong>Key Selling Points:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Comprehensive patient management</li>
              <li>Appointment scheduling and reminders</li>
              <li>Dental chart and treatment planning</li>
              <li>Billing and insurance processing</li>
              <li>Customizable branding options</li>
              <li>Cloud-based or on-premises deployment</li>
            </ul>
          </div>
        </div>
        
        <Todo />
      </div>
    </div>
  );
};

export default OdontoMasterPlanning; 