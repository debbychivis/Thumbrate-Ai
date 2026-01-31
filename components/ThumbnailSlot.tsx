import React, { useRef } from 'react';
import { ThumbnailSlotData } from '../types';

interface Props {
  data: ThumbnailSlotData;
  onUpload: (id: string, file: File, base64: string) => void;
  onRemove: (id: string) => void;
  disabled?: boolean;
}

export const ThumbnailSlot: React.FC<Props> = ({ data, onUpload, onRemove, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(data.id, file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    if (!data.file && !disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div className="relative group">
      {/* Label Badge */}
      <div className="absolute -top-3 -left-3 z-10 w-8 h-8 flex items-center justify-center bg-brand-600 text-white font-bold rounded-full shadow-lg border-2 border-[#0f172a]">
        {data.id}
      </div>

      <div
        onClick={handleClick}
        className={`
          relative w-full aspect-video rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden cursor-pointer
          ${data.file 
            ? 'border-brand-500 bg-slate-800' 
            : 'border-slate-600 bg-slate-800/50 hover:border-brand-400 hover:bg-slate-700/50'
          }
        `}
      >
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={disabled}
        />

        {data.previewUrl ? (
          <>
            <img 
              src={data.previewUrl} 
              alt={`Thumbnail ${data.id}`} 
              className="w-full h-full object-cover"
            />
            {!disabled && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded-md backdrop-blur-sm"
                >
                  Change
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(data.id);
                  }}
                  className="px-3 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-200 text-sm rounded-md backdrop-blur-sm"
                >
                  Remove
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">Upload Image</span>
            <span className="text-xs text-slate-500 mt-1">1280x720 Rec.</span>
          </div>
        )}
      </div>
    </div>
  );
};
