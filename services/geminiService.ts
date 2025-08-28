import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { ImageFile, GeneratedPrompts } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to remove the data URL prefix (e.g., "data:image/png;base64,")
const getBase64Data = (dataUrl: string): string => {
    return dataUrl.split(',')[1];
}

/**
 * Generates three distinct prompts from a single reference image.
 */
export const generatePromptsFromImage = async (
    referenceImage: ImageFile
): Promise<GeneratedPrompts> => {
    try {
        const imagePart = {
            inlineData: {
                data: getBase64Data(referenceImage.base64),
                mimeType: referenceImage.mimeType,
            },
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { text: "Analyze the attached image and extract its aesthetic and compositional elements. Generate three distinct prompts that describe the background, environment, lighting, color grading, camera angle, and the subject's pose (e.g., 'sitting on a bench', 'leaning against a wall'). The prompts should NOT describe the person's facial features or identity, but rather the scene and pose. The goal is to use these prompts to place a different person into this exact style and setting. Follow the JSON schema precisely." },
                    imagePart
                ]
            },
            config: {
                systemInstruction: "You are an expert prompt engineer for generative AI image models. Your task is to analyze a user-provided image and generate three distinct prompts describing its style, scene, and pose, while ignoring the specific identity of the person. Respond ONLY with a valid JSON object that matches the provided schema.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        simple: {
                            type: Type.STRING,
                            description: 'A simple prompt describing style, background and pose.',
                        },
                        detailed: {
                            type: Type.STRING,
                            description: 'A detailed, moody prompt describing style, background and pose.',
                        },
                        technical: {
                            type: Type.STRING,
                            description: 'A technical, photographic prompt describing style, background and pose.',
                        },
                    },
                    required: ["simple", "detailed", "technical"],
                },
            },
        });
        
        // The response text should be a valid JSON string matching the schema.
        const promptsJson = response.text.trim();
        return JSON.parse(promptsJson);

    } catch (error) {
        console.error('Error generating prompts with Gemini:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate prompts: ${error.message}`);
        }
        throw new Error('An unknown error occurred during prompt generation.');
    }
};


/**
 * Generates an image by applying a text prompt to a source image.
 */
export const generateImageFromPromptAndSource = async (
    prompt: string,
    sourceImage: ImageFile
): Promise<string> => {
     try {
        const imagePart = {
            inlineData: {
                data: getBase64Data(sourceImage.base64),
                mimeType: sourceImage.mimeType,
            },
        };

        const textPart = {
            text: `Using the provided image as the subject, place the person from this image into a new scene described by the following prompt. It is crucial that you preserve the identity and facial features of the person from the source image exactly. However, their clothing, pose, the background, and the overall artistic style should be completely replaced by the style described in the prompt. Do not mix the background or style from the source image. The final image should feature the person from the source image but reimagined in the new context. Prompt: ${prompt}`,
        };
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [imagePart, textPart]
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const mimeType = part.inlineData.mimeType;
                return `data:${mimeType};base64,${base64ImageBytes}`;
            }
        }
        
        throw new Error('No image was generated by the API.');

    } catch (error) {
        console.error('Error generating image with Gemini:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate image: ${error.message}`);
        }
        throw new Error('An unknown error occurred during image generation.');
    }
}