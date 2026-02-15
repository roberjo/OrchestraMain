import { useState, useCallback, useRef } from 'react';

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
  isLoading: boolean;
}

export function FileUploader({ onFileSelected, isLoading }: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileSelected(file);
    },
    [onFileSelected],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileSelected(file);
    },
    [onFileSelected],
  );

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
        isDragOver ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)]' : 'border-[var(--color-border-light)] bg-[var(--color-bg-tertiary)]'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      {isLoading ? (
        <p className="text-sm text-[var(--color-text-tertiary)]">Parsing file...</p>
      ) : (
        <>
          <p className="mb-2 text-sm text-[var(--color-text-secondary)]">
            Drag and drop a <strong>.csv</strong> or <strong>.xlsx</strong> file here
          </p>
          <p className="mb-4 text-xs text-[var(--color-text-tertiary)]">or</p>
          <button
            onClick={() => inputRef.current?.click()}
            className="rounded bg-[var(--color-primary-600)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-700)]"
          >
            Browse Files
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileInput}
            className="hidden"
          />
        </>
      )}
    </div>
  );
}
