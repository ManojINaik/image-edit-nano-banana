
import React, { useState } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import GeneratedImage from './components/GeneratedImage';
import Button from './components/Button';
import { generateStyledImage } from './services/geminiService';
import type { ImageFile } from './types';

const App: React.FC = () => {
    const [styleImage, setStyleImage] = useState<ImageFile | null>(null);
    const [sourceImage, setSourceImage] = useState<ImageFile | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateClick = async () => {
        if (!styleImage || !sourceImage) {
            setError('Please upload both a style and a source image.');
            return;
        }

        setError(null);
        setIsLoading(true);
        setGeneratedImage(null);

        try {
            const result = await generateStyledImage(styleImage, sourceImage);
            setGeneratedImage(result);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-6 md:p-8">
            <div className="container mx-auto max-w-6xl">
                <Header />

                <main>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <ImageUploader 
                            id="style-uploader"
                            title="Reference Style Image"
                            imageFile={styleImage}
                            onImageUpload={setStyleImage}
                        />
                        <ImageUploader 
                            id="source-uploader"
                            title="Source Face Image"
                            imageFile={sourceImage}
                            onImageUpload={setSourceImage}
                        />
                        <GeneratedImage 
                            imageData={generatedImage}
                            isLoading={isLoading}
                        />
                    </div>
                    
                    <div className="flex flex-col items-center justify-center space-y-4">
                         <Button 
                            onClick={handleGenerateClick}
                            isLoading={isLoading}
                            disabled={!styleImage || !sourceImage}
                         >
                            Generate Image
                        </Button>
                        {error && (
                            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-2 rounded-lg text-center">
                                <p><strong>Error:</strong> {error}</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;
