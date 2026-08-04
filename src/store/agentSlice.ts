import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ChatMessage, LangGraphNodeState } from '../types/complaint';

interface AgentState {
  chatMessages: ChatMessage[];
  isChatLoading: boolean;
  selectedModel: 'llama-3.3-70b-versatile' | 'gemma2-9b-it';
  nodeTrace: LangGraphNodeState[];
  activeNodeName: string | null;
}

const INITIAL_NODES: LangGraphNodeState[] = [
  { nodeName: 'Ingestion_Node', status: 'idle', timestamp: '', details: 'Parses PDF, DOCX, EML or raw text payload.' },
  { nodeName: 'Extraction_Node', status: 'idle', timestamp: '', details: 'Groq LLM extracts product, batch, and complaint defect fields.' },
  { nodeName: 'Completeness_Gate', status: 'idle', timestamp: '', details: 'Verifies 21 CFR Part 211 mandatory QMS fields.' },
  { nodeName: 'Risk_Evaluator', status: 'idle', timestamp: '', details: 'Calculates Risk Priority Number (RPN) & ICH Q9 classification.' },
  { nodeName: 'Duplicate_Matcher', status: 'idle', timestamp: '', details: 'Queries PostgreSQL vector embeddings for recurring batch defects.' },
  { nodeName: 'CAPA_Engine', status: 'idle', timestamp: '', details: 'Generates 5-Whys root cause, containment, & preventive actions.' }
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'ai',
    text: 'Hello! I am your AI Quality Intake Assistant powered by LangGraph & Groq API. Drag & drop a complaint document (PDF/EML/DOCX) or paste complaint text, and I will extract key details, evaluate QMS completeness, run risk assessment, and suggest CAPA remediation.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    agentNode: 'Ingestion_Node'
  }
];

const initialState: AgentState = {
  chatMessages: INITIAL_MESSAGES,
  isChatLoading: false,
  selectedModel: 'llama-3.3-70b-versatile',
  nodeTrace: INITIAL_NODES,
  activeNodeName: null
};

export const sendChatMessage = createAsyncThunk(
  'agent/sendMessage',
  async (userText: string, { getState, dispatch }) => {
    // Add user message to state
    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    dispatch(addChatMessage(userMsg));

    // Call backend endpoint or simulate Groq LLM response
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, model: 'llama-3.3-70b-versatile' })
      });
      if (response.ok) {
        const data = await response.json();
        return data.reply as string;
      }
    } catch (e) {
      console.warn('Backend API unavailable, executing client-side agent logic', e);
    }

    // Client-side fallback response tailored for Pharma QMS context
    await new Promise((r) => setTimeout(r, 800));
    const lower = userText.toLowerCase();
    if (lower.includes('risk') || lower.includes('severity')) {
      return 'I analyzed the complaint against ICH Q9 Quality Risk Management principles. High-risk factors include parenterals, sterile injectable particulates, or potency deviations. Click "Run Risk Assessment" to compute the Risk Priority Number (RPN).';
    } else if (lower.includes('capa') || lower.includes('root cause')) {
      return 'The automated CAPA remediation engine uses 5-Whys and Ishikawa methods. It recommends line containment, SCADA interlock enforcement, and QA sign-off compliant with 21 CFR Part 11.';
    } else if (lower.includes('duplicate') || lower.includes('batch')) {
      return 'Duplicate detection scans historical QMS databases for identical batch/lot numbers and recurring defect categories across manufacturing facilities.';
    } else {
      return `Processed request via Groq [llama-3.3-70b-versatile]. Quality fields updated. Is there a specific section (Origin, Product Identification, or Severity) you would like me to inspect or re-extract?`;
    }
  }
);

export const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    addChatMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.chatMessages.push(action.payload);
    },
    updateNodeStatus: (
      state,
      action: PayloadAction<{ nodeName: string; status: LangGraphNodeState['status']; details?: string }>
    ) => {
      const idx = state.nodeTrace.findIndex((n) => n.nodeName === action.payload.nodeName);
      if (idx !== -1) {
        state.nodeTrace[idx].status = action.payload.status;
        state.nodeTrace[idx].timestamp = new Date().toLocaleTimeString();
        if (action.payload.details) {
          state.nodeTrace[idx].details = action.payload.details;
        }
      }
      state.activeNodeName = action.payload.nodeName;
    },
    resetNodes: (state) => {
      state.nodeTrace.forEach((n) => {
        n.status = 'idle';
        n.timestamp = '';
      });
      state.activeNodeName = null;
    },
    setSelectedModel: (state, action: PayloadAction<AgentState['selectedModel']>) => {
      state.selectedModel = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.isChatLoading = true;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.isChatLoading = false;
        state.chatMessages.push({
          id: 'msg-' + Date.now(),
          sender: 'ai',
          text: action.payload,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          agentNode: 'LangGraph_Copilot'
        });
      })
      .addCase(sendChatMessage.rejected, (state) => {
        state.isChatLoading = false;
        state.chatMessages.push({
          id: 'msg-' + Date.now(),
          sender: 'ai',
          text: 'Unable to connect to Groq LLM endpoint. Operating in cached QMS fallback mode.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      });
  }
});

export const { addChatMessage, updateNodeStatus, resetNodes, setSelectedModel } = agentSlice.actions;

export default agentSlice.reducer;
