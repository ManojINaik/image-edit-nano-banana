import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import Button from './components/Button';
import ResultCard from './components/ResultCard';
import { generatePromptsFromImage, generateImageFromPromptAndSource } from './services/geminiService';
import type { ImageFile, GenerationResult, GeneratedPrompts } from './types';

const App: React.FC = () => {
    const [referenceImage, setReferenceImage] = useState<ImageFile | null>(null);
    const [sourceImage, setSourceImage] = useState<ImageFile | null>(null);
    const [results, setResults] = useState<GenerationResult[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const initialResultsState: GenerationResult[] = useMemo(() => [
        { promptType: 'simple', title: 'Simple Prompt', prompt: null, image: null },
        { promptType: 'detailed', title: 'Detailed & Moody Prompt', prompt: null, image: null },
        { promptType: 'technical', title: 'Technical/Photographic Prompt', prompt: null, image: null },
    ],[]);

    const handleGenerateClick = async () => {
        if (!referenceImage || !sourceImage) {
            setError('Please upload both a reference and a source image.');
            return;
        }

        setError(null);
        setIsLoading(true);
        setResults(initialResultsState);

        try {
            // Step 1: Generate Prompts from the Reference Image
            setLoadingMessage('Analyzing style and generating prompts...');
            const prompts = await generatePromptsFromImage(referenceImage);
            
            // Update state with generated prompts
            setResults(prevResults => prevResults.map(result => ({
                ...result,
                prompt: prompts[result.promptType],
            })));

            // Step 2: Generate Images in Parallel using Source Image and Prompts
            setLoadingMessage('Applying styles to source image...');
            const imagePromises = Object.keys(prompts).map(key => 
                generateImageFromPromptAndSource(prompts[key as keyof GeneratedPrompts], sourceImage)
            );
            
            const generatedImages = await Promise.all(imagePromises);

            // Update state with generated images
            setResults(prevResults => prevResults.map((result, index) => ({
                ...result,
                image: generatedImages[index],
            })));

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
            setError(errorMessage);
            setResults([]); // Clear results on error
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    };

    const isPromptLoading = isLoading && loadingMessage.includes('prompts');
    const isImageLoading = isLoading && loadingMessage.includes('Applying styles');

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-6 md:p-8">
            <div className="container mx-auto max-w-6xl">
                <Header />

                <main className="flex flex-col items-center gap-8">
                    <section className="w-full max-w-4xl bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <ImageUploader 
                                id="reference-uploader"
                                title="Upload Reference Image (Style)"
                                imageFile={referenceImage}
                                onImageUpload={setReferenceImage}
                            />
                            <ImageUploader 
                                id="source-uploader"
                                title="Upload Source Image (Content)"
                                imageFile={sourceImage}
                                onImageUpload={setSourceImage}
                            />
                        </div>
                    </section>
                    
                    <div className="flex flex-col items-center justify-center space-y-4 w-full">
                         <Button 
                            onClick={handleGenerateClick}
                            isLoading={isLoading}
                            disabled={!referenceImage || !sourceImage}
                         >
                            {isLoading ? loadingMessage : "Generate Styled Images"}
                        </Button>
                        {error && (
                            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-2 rounded-lg text-center max-w-xl">
                                <p><strong>Error:</strong> {error}</p>
                            </div>
                        )}
                    </div>

                    {(isLoading || results.length > 0) && (
                         <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                           {results.map(result => (
                               <ResultCard 
                                   key={result.promptType}
                                   title={result.title}
                                   prompt={result.prompt}
                                   imageData={result.image}
                                   isPromptLoading={isPromptLoading}
                                   isImageLoading={isImageLoading && !!result.prompt}
                               />
                           ))}
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;