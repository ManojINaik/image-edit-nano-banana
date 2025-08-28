export interface ImageFile {
  base64: string;
  mimeType: string;
  name: string;
}

export interface GeneratedPrompts {
  simple: string;
  detailed: string;
  technical: string;
}

export interface GenerationResult {
  promptType: keyof GeneratedPrompts;
  title: string;
  prompt: string | null;
  image: string | null;
}
