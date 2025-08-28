
import React from 'react';

interface GeneratedImageProps {
    imageData: string | null;
    isLoading: boolean;
}

const LoadingSpinner: React.FC = () => (
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
);

const ResultIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

const GeneratedImage: React.FC<GeneratedImageProps> = ({ imageData, isLoading }) => {
    return (
        <div className="w-full flex flex-col items-center">
            <h2 className="text-xl font-semibold text-gray-300 mb-4">Result</h2>
            <div className="w-full aspect-square bg-gray-800 border-2 border-gray-700 rounded-lg flex justify-center items-center overflow-hidden">
                {isLoading ? (
                    <LoadingSpinner />
                ) : imageData ? (
                    <img src={imageData} alt="Generated result" className="object-cover w-full h-full" />
                ) : (
                    <div className="text-center text-gray-400 px-4">
                        <ResultIcon />
                        <p>Your generated image will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GeneratedImage;
