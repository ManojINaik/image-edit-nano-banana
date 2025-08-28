import React, { useRef, useState } from 'react';
import type { ImageFile } from '../types';

interface ImageUploaderProps {
    id: string;
    title: string;
    onImageUpload: (file: ImageFile | null) => void;
    imageFile: ImageFile | null;
}

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);


const ImageUploader: React.FC<ImageUploaderProps> = ({ id, title, onImageUpload, imageFile }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const processFile = (file: File | null) => {
        if (file && ['image/png', 'image/jpeg'].includes(file.type)) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageUpload({
                    base64: reader.result as string,
                    mimeType: file.type,
                    name: file.name,
                });
            };
            reader.readAsDataURL(file);
        } else {
             if (file) {
                 // Optionally, show an error to the user
                 console.warn("Invalid file type. Please upload a PNG or JPEG image.");
             }
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        processFile(file || null);
    };

    const handleContainerClick = () => {
        inputRef.current?.click();
    };

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (inputRef.current) {
            inputRef.current.value = "";
        }
        onImageUpload(null);
    }

    const handleDragEvents = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        handleDragEvents(e);
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        handleDragEvents(e);
        setIsDragging(false);
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        handleDragEvents(e);
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        processFile(file || null);
        if (e.dataTransfer.items) {
            e.dataTransfer.items.clear();
        } else {
            e.dataTransfer.clearData();
        }
    }

    const uploaderClasses = `relative w-full aspect-square bg-gray-800 border-2 border-dashed rounded-lg flex flex-col justify-center items-center cursor-pointer group transition-all duration-300 ease-in-out ${
        isDragging
        ? 'border-purple-500 bg-gray-700'
        : 'border-gray-600 hover:border-purple-500 hover:bg-gray-700'
    }`;


    return (
        <div className="w-full flex flex-col items-center">
            <h2 className="text-xl font-semibold text-gray-300 mb-4">{title}</h2>
            <div
                onClick={handleContainerClick}
                onDrop={handleDrop}
                onDragOver={handleDragEvents}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                className={uploaderClasses}
                aria-label={`${title} uploader`}
            >
                <input
                    ref={inputRef}
                    id={id}
                    type="file"
                    accept="image/png, image/jpeg"
                    className="hidden"
                    onChange={handleFileChange}
                />
                {imageFile ? (
                    <>
                        <img src={imageFile.base64} alt={imageFile.name} className="object-cover w-full h-full rounded-lg" />
                        <button 
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5 hover:bg-opacity-75 transition-opacity opacity-0 group-hover:opacity-100"
                          aria-label="Remove image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </>
                ) : (
                    <div className="text-center text-gray-400 px-4 pointer-events-none">
                        <UploadIcon />
                        <p>
                           {isDragging ? "Drop image here" : "Click or drag & drop"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUploader;