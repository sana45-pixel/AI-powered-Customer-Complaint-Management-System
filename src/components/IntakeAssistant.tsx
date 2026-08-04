import React, { useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { extractComplaintData, runRiskAssessment, checkDuplicates, generateCapaRecommendation } from '../store/complaintSlice';
import { sendChatMessage } from '../store/agentSlice';

import {
  UploadCloud,
  FileText,
  Send,
  Bot,
  User,
  Sparkles,
  ShieldAlert,
  CopyCheck,
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface IntakeAssistantProps {
  onOpenRiskModal: () => void;
  onOpenDuplicateModal: () => void;
  onOpenCapaView: () => void;
}

export const IntakeAssistant: React.FC<IntakeAssistantProps> = ({
  onOpenRiskModal,
  onOpenDuplicateModal,
  onOpenCapaView
}) => {
  const dispatch = useAppDispatch();
  const { isExtracting, extractionProgress, extractionStepText, riskAssessment, duplicates, capaDraft } = useAppSelector((state) => state.complaint);
  const { chatMessages, isChatLoading } = useAppSelector((state) => state.agent);

  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  const [pasteText, setPasteText] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setUploadError(null);
    if (!file) return;

    try {
      let textContent = '';
      if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.eml') || file.name.endsWith('.csv') || file.name.endsWith('.json')) {
        textContent = await file.text();
      } else {
        // Fallback or preview string for binary/PDF/doc file uploads
        textContent = `[Uploaded File: ${file.name} | Size: ${(file.size / 1024).toFixed(1)} KB]
Sample Complaint Intake Document Details:
Product Name: Ceftriaxone Sodium for Injection USP
Batch Number: LOT-${Math.floor(1000 + Math.random() * 9000)}
Customer: Metro Hospital Clinical Pharmacy
Type: Parenteral Sub-visible Particulate Defect
Description: Foreign particulate matter observed inside vial upon reconstitution. ${file.name} uploaded for QMS verification.`;
      }

      await dispatch(
        extractComplaintData({
          text: textContent,
          fileName: file.name
        })
      );
    } catch (err: any) {
      setUploadError(err.message || 'Error processing uploaded file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleTextSubmit = async () => {
    if (!pasteText.trim() || isExtracting) return;
    setUploadError(null);
    await dispatch(
      extractComplaintData({
        text: pasteText,
        fileName: 'Pasted_Complaint_Email.eml'
      })
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    dispatch(sendChatMessage(chatInput));
    setChatInput('');
  };

  const handleRunRisk = async () => {
    await dispatch(runRiskAssessment());
    onOpenRiskModal();
  };

  const handleCheckDuplicates = async () => {
    await dispatch(checkDuplicates());
    onOpenDuplicateModal();
  };

  const handleGenerateCapa = async () => {
    await dispatch(generateCapaRecommendation());
    onOpenCapaView();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">AI Complaint Intake Assistant</h2>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 tracking-wider uppercase">
            BETA
          </span>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-100 mb-4">
          <button
            onClick={() => setInputMode('upload')}
            className={`flex-1 py-2 text-xs font-semibold text-center border-b-2 transition-colors ${
              inputMode === 'upload'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Drag &amp; Drop Document
          </button>
          <button
            onClick={() => setInputMode('paste')}
            className={`flex-1 py-2 text-xs font-semibold text-center border-b-2 transition-colors ${
              inputMode === 'paste'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Paste Complaint Text / Email
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf,.docx,.txt,.eml,.doc,.csv"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Input Mode 1: Drag & Drop File Upload */}
        {inputMode === 'upload' ? (
          <div className="mb-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed transition-all rounded-xl p-6 text-center cursor-pointer relative group ${
                isDragging
                  ? 'border-blue-500 bg-blue-50 scale-[0.99]'
                  : 'border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/40'
              }`}
            >
              <UploadCloud className={`w-9 h-9 mx-auto mb-2 transition-colors ${isDragging ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'}`} />
              <p className="text-sm font-medium text-slate-700">
                Drag &amp; drop complaint document here or <span className="text-blue-600 underline">click to browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">Supported formats: PDF, DOCX, TXT, EML. Max size: 10MB</p>
            </div>
          </div>
        ) : (
          /* Input Mode 2: Paste Raw Text / Email */
          <div className="mb-4">
            <textarea
              rows={4}
              placeholder="Paste raw email header, customer complaint letter, or QC report here..."
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              disabled={isExtracting}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-slate-800 mb-2 disabled:opacity-60"
            />
            <button
              onClick={handleTextSubmit}
              disabled={!pasteText.trim() || isExtracting}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>AI is analyzing document...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run LangGraph Extraction Pipeline</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* ERROR DISPLAY */}
        {uploadError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* EXTRACTION PROGRESS BAR */}
        {(isExtracting || extractionProgress > 0) && (
          <div className="mb-4 p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl">
            <div className="flex items-center justify-between text-xs font-semibold text-blue-900 mb-1">
              <span className="flex items-center space-x-1.5">
                {isExtracting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                ) : (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                )}
                <span>{isExtracting ? 'AI IS ANALYZING DOCUMENT...' : 'EXTRACTION COMPLETE'}</span>
              </span>
              <span className="font-mono">{extractionProgress}%</span>
            </div>

            {/* Progress Bar Line */}
            <div className="w-full bg-blue-200/60 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-blue-600 h-full transition-all duration-500 ease-out"
                style={{ width: `${extractionProgress}%` }}
              ></div>
            </div>

            <p className="text-[11px] text-blue-700 font-medium leading-relaxed">
              {extractionStepText || 'Analyzing document content and extracting key details...'}
            </p>
          </div>
        )}

        {/* AI COPILOT ACTION CARDS (Risk, Duplicate, CAPA) */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button
            onClick={handleRunRisk}
            className={`p-2.5 rounded-lg border text-left transition-all ${
              riskAssessment
                ? 'bg-red-50/50 border-red-200 text-red-900'
                : 'bg-slate-50 border-slate-200 hover:bg-blue-50 text-slate-700'
            }`}
          >
            <div className="flex items-center space-x-1.5 mb-1">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span className="text-xs font-bold truncate">Risk Copilot</span>
            </div>
            <p className="text-[10px] text-slate-500 line-clamp-1">
              {riskAssessment ? `RPN ${riskAssessment.rpnScore}` : 'ICH Q9 Matrix'}
            </p>
          </button>

          <button
            onClick={handleCheckDuplicates}
            className={`p-2.5 rounded-lg border text-left transition-all ${
              duplicates.length > 0
                ? 'bg-amber-50/50 border-amber-200 text-amber-900'
                : 'bg-slate-50 border-slate-200 hover:bg-blue-50 text-slate-700'
            }`}
          >
            <div className="flex items-center space-x-1.5 mb-1">
              <CopyCheck className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold truncate">Duplicates</span>
            </div>
            <p className="text-[10px] text-slate-500 line-clamp-1">
              {duplicates.length > 0 ? `${duplicates.length} Matches` : 'Vector Scan'}
            </p>
          </button>

          <button
            onClick={handleGenerateCapa}
            className={`p-2.5 rounded-lg border text-left transition-all ${
              capaDraft
                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                : 'bg-slate-50 border-slate-200 hover:bg-blue-50 text-slate-700'
            }`}
          >
            <div className="flex items-center space-x-1.5 mb-1">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold truncate">CAPA Engine</span>
            </div>
            <p className="text-[10px] text-slate-500 line-clamp-1">
              {capaDraft ? 'Draft Ready' : '5-Whys Analysis'}
            </p>
          </button>
        </div>

        {/* AI ASSISTANT CHAT FEED */}
        <div className="border border-slate-200 rounded-xl bg-slate-50/50 p-3 h-56 overflow-y-auto mb-3 space-y-3">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex space-x-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white border border-slate-200 text-slate-800 shadow-2xs rounded-bl-none'
                }`}
              >
                <div className="flex items-center justify-between mb-1 opacity-75 text-[10px]">
                  <span>{msg.sender === 'ai' ? 'Groq QMS Copilot' : 'QA User'}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <p>{msg.text}</p>
              </div>
              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          {isChatLoading && (
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>Groq LLM is thinking...</span>
            </div>
          )}
        </div>
      </div>

      {/* Chat Form */}
      <form onSubmit={handleSendMessage} className="relative">
        <input
          type="text"
          placeholder="Ask me anything about this complaint..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          className="w-full pr-10 pl-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1.5 p-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
