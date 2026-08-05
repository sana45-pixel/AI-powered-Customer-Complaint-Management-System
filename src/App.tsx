import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ComplaintForm } from './components/ComplaintForm';
import { IntakeAssistant } from './components/IntakeAssistant';

function MainAppContent() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-slate-900 flex flex-col justify-start py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <main className="max-w-[1340px] w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch w-full">
          {/* Left Column: Log Customer Complaint Form */}
          <div className="w-full flex flex-col">
            <ComplaintForm />
          </div>

          {/* Right Column: AI Complaint Intake Assistant */}
          <div className="w-full flex flex-col">
            <IntakeAssistant />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <MainAppContent />
    </Provider>
  );
}
