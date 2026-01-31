export interface ThumbnailSlotData {
  id: string; // 'A', 'B', 'C', 'D', 'E'
  file: File | null;
  previewUrl: string | null;
  base64: string | null; // For API
}

export interface AnalysisResult {
  overallWinner: string;
  summary: string;
  thumbnails: {
    slotId: string;
    score: number; // 0-100
    critique: string;
    pros: string[];
    cons: string[];
  }[];
}

export type ViewState = 'landing' | 'dashboard' | 'history' | 'settings';
