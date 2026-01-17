// Vesta Voice Assistant Type Definitions

export enum VoiceRecordingState {
  IDLE = 'idle',
  LISTENING = 'listening',
  THINKING = 'thinking',
  SPEAKING = 'speaking',
}

export interface VestaMessage {
  text: string;
  timestamp: number;
}

export interface AudioConfig {
  silenceThreshold: number;
  silenceDuration: number;
  volumeThreshold: number;
}

export interface VestaSessionState {
  isExpanded: boolean;
  isProcessing: boolean;
  isCallActive: boolean;
  currentState: VoiceRecordingState;
}

// API Types
export interface VestaApiRequest {
  audio: File | Blob;
  homeId: number;
  token: string;
}

export interface VestaApiResponse {
  success: boolean;
  response?: string;
  answer?: string;
  message?: string;
  text?: string;
}

export interface TTSRequest {
  text: string;
  apiKey: string;
}
