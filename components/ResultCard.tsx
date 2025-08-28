import React from 'react';

interface ResultCardProps {
    title: string;
    prompt: string | null;
    imageData: string | null;
    isPromptLoading: boolean;
    isImageLoading: boolean;
}

const LoadingSpinner: React.FC = () => (
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
);

const ResultCard: React.FC<ResultCardProps> = ({ title, prompt, imageData, isPromptLoading, isImageLoading }) => {
    return (
        <div className="w-full bg-gray-800/50 p-4 rounded-lg flex flex-col gap-4">
            <h3 className="text-xl font-semibold text-gray-200 text-center">{title}</h3>
            <div className="w-full aspect-square bg-gray-800 border-2 border-gray-700 rounded-lg flex justify-center items-center overflow-hidden">
                {isImageLoading ? (
                    <LoadingSpinner />
                ) : imageData ? (
                    <img src={imageData} alt={`Generated for ${title}`} className="object-cover w-full h-full" />
                ) : (
                    <div className="text-center text-gray-500 p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                        </svg>
                        Image will appear here
                    </div>
                )}
            </div>
            <div className="bg-gray-900/70 p-3 rounded-md min-h-[120px] text-gray-300 text-sm font-mono prose prose-invert prose-p:my-0">
                {isPromptLoading ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        Generating prompt...
                    </div>
                ) : (
                    <p>{prompt || 'Prompt will appear here.'}</p>
                )}
            </div>
        </div>
    );
};

export default ResultCard;
