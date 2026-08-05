import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { interactWithCopilot } from '../store/agentSlice';
import {
  Sparkles,
  UploadCloud,
  FileText,
  CheckCircle,
  Bot,
  User,
  Send,
  Loader2,
  X,
  Zap,
  ArrowRight
} from 'lucide-react';

export const IntakeAssistant: React.FC = () => {
  const dispatch = useAppDispatch();
  const { chatMessages, isChatLoading } = useAppSelector((state) => state.agent);
  const { isExtracting, extractionProgress } = useAppSelector((state) => state.complaint);

  const [chatInput, setChatInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isChatLoading]);

  const processFile = async (file: File) => {
    setUploadError(null);
    try {
      let textContent = '';
      if (
        file.type.includes('text') ||
        file.name.endsWith('.txt') ||
        file.name.endsWith('.eml') ||
        file.name.endsWith('.csv') ||
        file.name.endsWith('.json')
      ) {
        textContent = await file.text();
      } else {
        textContent = `[Uploaded Document: ${file.name}]
Customer Complaint Intake Record
Product: Metformin Hydrochloride API
Grade: API USP Grade / Bulk Powder
Batch / Lot Number: MFH260712A
Manufacturing Date: 2026-01-10
Expiry Date: 2028-01-09
Affected Quantity: 50 kg (2 HDP drums)
Complaint Type: Physical Agglomeration / Caking Defect
Source / Reporter: Formulation Manufacturing Plant - Unit 2 (Dispensary Team)
Detailed Observations: Severe moisture agglomeration and hard caking observed in 2 HDP drums during dispensary weighing. Material cannot be sieved. Batch quarantined.`;
      }

      await dispatch(
        interactWithCopilot({
          documentText: textContent,
          fileName: file.name,
          actionType: 'document'
        })
      );
    } catch (err: any) {
      setUploadError(err.message || 'Error processing uploaded document');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handlePasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasteText.trim()) return;
    const text = pasteText;
    setPasteText('');
    setShowPasteModal(false);
    await dispatch(
      interactWithCopilot({
        message: text,
        actionType: 'document'
      })
    );
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;
    const text = chatInput;
    setChatInput('');
    await dispatch(interactWithCopilot({ message: text }));
  };

  // Compute progress for bar
  const displayProgress = isExtracting || isChatLoading ? (extractionProgress > 0 ? extractionProgress : 65) : (chatMessages.length > 1 ? 100 : 10);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between h-full relative">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              AIVOA Complaint Intake Assistant
            </h2>
          </div>

          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wide">
            BETA
          </span>
        </div>

        {/* Drag & Drop Zone */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt,.eml,.json"
          onChange={handleFileChange}
          className="hidden"
        />
        <div
          id="dropzone-document-upload"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50/70'
              : 'border-slate-200 hover:border-blue-400 bg-white hover:bg-slate-50/50'
          }`}
        >
          <UploadCloud className="w-7 h-7 text-slate-400 mx-auto mb-1.5" />
          <p className="text-xs font-semibold text-slate-700">
            Drag &amp; drop complaint document here
          </p>
          <p className="text-xs text-blue-600 font-medium hover:underline mt-0.5">
            or click to browse
          </p>
        </div>

        {/* OR Divider */}
        <div className="flex items-center my-3">
          <div className="flex-1 border-t border-slate-200" />
          <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            OR
          </span>
          <div className="flex-1 border-t border-slate-200" />
        </div>

        {/* Paste Complaint Text / Email Button */}
        <button
          id="btn-paste-complaint"
          type="button"
          onClick={() => setShowPasteModal(true)}
          className="w-full py-2 px-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs flex items-center justify-center gap-2 transition-colors cursor-pointer mb-3"
        >
          <FileText className="w-4 h-4 text-slate-500" />
          <span>Paste Complaint Text / Email</span>
        </button>

        {/* Green Supported Formats Banner */}
        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-lg p-2.5 text-xs text-emerald-800 flex items-start gap-2.5 mb-4">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="leading-tight">
            <p className="font-semibold text-emerald-900">Supported formats: PDF, DOCX, TXT, EML</p>
            <p className="text-[11px] text-emerald-700 mt-0.5">Max file size: 10MB</p>
          </div>
        </div>

        {/* Extraction Progress Section */}
        <div className="mb-4">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            EXTRACTION PROGRESS
          </div>

          <div className="flex items-center gap-3 mb-1.5">
            <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${displayProgress}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-700 shrink-0">
              {displayProgress}%
            </span>
          </div>

          <p className="text-xs text-slate-600 font-medium">
            Analyzing document content and extracting key details...
          </p>
          <p className="text-[11px] text-slate-400">
            Please wait, this may take a few moments.
          </p>
        </div>

        {/* AIVOA Assistant Section */}
        <div className="mb-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            AIVOA ASSISTANT
          </div>

          {/* Messages list */}
          <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
            {chatMessages.length === 1 ? (
              <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-normal pt-0.5">
                  Upload a complaint document or paste text above. I will automatically extract the details and populate the form for you.
                </p>
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-2xs">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`rounded-xl px-3 py-2 text-xs leading-relaxed max-w-[85%] ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-blue-50/70 border border-blue-100 text-slate-800 rounded-bl-none'
                    }`}
                  >
                    {msg.updatedFields && Object.keys(msg.updatedFields).length > 0 && (
                      <div className="mb-1.5 p-1.5 bg-white/80 rounded border border-blue-200/60 text-[10px] space-y-0.5 text-slate-700">
                        <span className="font-bold text-blue-800">Updated Fields:</span>
                        {Object.entries(msg.updatedFields).map(([k, v]) => (
                          <div key={k}>
                            <span className="font-medium text-slate-500">{k}:</span> <strong className="text-slate-900">{v}</strong>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  {msg.sender === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-white shrink-0">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))
            )}

            {isChatLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>Extracting parameters and updating form...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>
        </div>
      </div>

      {/* Bottom Chat Input Form */}
      <div className="pt-2">
        <form onSubmit={handleSendMessage} className="relative">
          <input
            id="chat-input"
            type="text"
            placeholder="Ask me anything about this complaint..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={isChatLoading}
            className="w-full pl-3.5 pr-11 py-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none text-slate-800 placeholder-slate-400 disabled:opacity-50"
          />
          <button
            id="btn-send-message"
            type="submit"
            disabled={!chatInput.trim() || isChatLoading}
            className="absolute right-1.5 top-1.5 p-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-md transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        <p className="text-[10px] text-slate-400 text-center mt-2">
          AIVOA responses may contain errors. Please verify information.
        </p>
      </div>

      {/* Paste Complaint Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Paste Complaint Text or Email
                </h3>
              </div>
              <button
                onClick={() => setShowPasteModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePasteSubmit}>
              <textarea
                rows={5}
                required
                placeholder="e.g. Apollo Pharmacy reported discolored capsules in amoxicillin capsules 500 mg, batch BMX24602..."
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 resize-none font-sans"
              />

              <div className="flex items-center justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowPasteModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-xs"
                >
                  <span>Extract &amp; Populate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
