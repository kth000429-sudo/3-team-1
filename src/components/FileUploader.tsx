import React from 'react';

interface FileUploaderProps {
    label: string;
    accept: string;
    onChange: (file: File | null) => void;
    fileName?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ label, accept, onChange, fileName }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        onChange(file);
    };

    return (
        <div className="grid gap-2">
            <label className="text-sm font-medium">{label}</label>
            <div className="flex items-center gap-4">
                <label className="flex flex-1 items-center justify-center h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-muted-foreground">
                            {fileName || "Drag & drop or click to upload"}
                        </span>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept={accept}
                        onChange={handleFileChange}
                    />
                </label>
                {fileName && (
                    <button
                        type="button"
                        className="text-xs text-destructive hover:underline"
                        onClick={() => onChange(null)}
                    >
                        Remove
                    </button>
                )}
            </div>
        </div>
    );
};

export default FileUploader;
