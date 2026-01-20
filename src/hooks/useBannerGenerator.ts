import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface GenerateOptions {
    guidelineFile: File;
    copyFile: File;
    templateFile: File;
    referenceFile?: File;
    projectId: string;
}

export const useBannerGenerator = () => {
    const [isGenerating, setIsGenerating] = useState(false);

    const generateBanner = async ({
        guidelineFile,
        copyFile,
        templateFile,
        referenceFile,
        projectId
    }: GenerateOptions) => {
        setIsGenerating(true);
        console.log("🚀 Starting Banner Generation Process via Edge Function...");
        try {
            // 1. Prepare data
            const guidelineText = await guidelineFile.text();
            const copyText = await copyFile.text();

            const toBase64 = (file: File): Promise<string> =>
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = error => reject(error);
                });

            const templateBase64 = await toBase64(templateFile);
            const referenceBase64 = referenceFile ? await toBase64(referenceFile) : null;

            // 2. Call Supabase Edge Function
            console.log("📡 Calling 'generate-banner' Edge Function...");
            const { data, error: functionError } = await supabase.functions.invoke('generate-banner', {
                body: {
                    guidelineText,
                    copyText,
                    templateBase64,
                    referenceBase64,
                    openaiKey: import.meta.env.VITE_OPENAI_API_KEY
                }
            });

            if (functionError) throw new Error(functionError.message || "Edge Function failed");
            if (data.error) throw new Error(data.error);

            const { b64_json, dallePrompt } = data;

            // 3. Convert Base64 to Blob and upload to Supabase Storage
            console.log("📦 Received image. Uploading to Storage...");
            const byteCharacters = atob(b64_json);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/png' });

            const fileName = `${projectId}-${Date.now()}.png`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('banners')
                .upload(fileName, blob, { contentType: 'image/png' });

            if (uploadError) throw uploadError;

            // 4. Save to database
            console.log("📊 Saving record to database...");
            const { data: bannerData, error: dbError } = await supabase
                .from('generated_banners')
                .insert({
                    project_id: projectId,
                    image_url: uploadData.path,
                    metadata: {
                        font: "Standard",
                        colors: ["#ffffff", "#000000"],
                        prompt: dallePrompt
                    },
                    status: 'generated'
                })
                .select()
                .single();

            if (dbError) throw dbError;

            console.log("✅ Generation Successful!");
            return bannerData;

        } catch (error: any) {
            console.error("❌ Generation failed:", error);
            throw error;
        } finally {
            setIsGenerating(false);
        }
    };

    return { generateBanner, isGenerating };
};
