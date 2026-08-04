import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store, useAppSelector } from './store/store';
import { Header } from './components/Header';
import { ComplaintForm } from './components/ComplaintForm';
import { IntakeAssistant } from './components/IntakeAssistant';
import { CompletenessCheckerModal } from './components/CompletenessCheckerModal';
import { RiskAssessmentCard } from './components/RiskAssessmentCard';
import { DuplicateDetectionModal } from './components/DuplicateDetectionModal';
import { CapaRemediationView } from './components/CapaRemediationView';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { LoggedComplaintsTable } from './components/LoggedComplaintsTable';

function MainAppContent() {
  const activeTab = useAppSelector((state) => state.complaint.activeTab);

  const [isCompletenessOpen, setIsCompletenessOpen] = useState(false);
  const [isRiskOpen, setIsRiskOpen] = useState(false);
  const [isDuplicateOpen, setIsDuplicateOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans text-slate-900 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'intake' && (
          <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
            {/* Left Column: Log Customer Complaint Form (~63% width) */}
            <div className="w-full lg:w-[63%] shrink-0 min-w-0">
              <ComplaintForm onOpenCompletenessModal={() => setIsCompletenessOpen(true)} />
            </div>

            {/* Right Column: AI Complaint Intake Assistant Sidebar (~37% width) */}
            <div className="w-full lg:w-[37%] shrink-0 min-w-0">
              <IntakeAssistant
                onOpenRiskModal={() => setIsRiskOpen(true)}
                onOpenDuplicateModal={() => setIsDuplicateOpen(true)}
                onOpenCapaView={() => {}}
              />
            </div>
          </div>
        )}

        {activeTab === 'architecture' && <ArchitectureDiagram />}
        {activeTab === 'capa' && <CapaRemediationView />}
        {activeTab === 'database' && <LoggedComplaintsTable />}
      </main>

      {/* Modals */}
      <CompletenessCheckerModal isOpen={isCompletenessOpen} onClose={() => setIsCompletenessOpen(false)} />
      <RiskAssessmentCard isOpen={isRiskOpen} onClose={() => setIsRiskOpen(false)} />
      <DuplicateDetectionModal isOpen={isDuplicateOpen} onClose={() => setIsDuplicateOpen(false)} />
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
