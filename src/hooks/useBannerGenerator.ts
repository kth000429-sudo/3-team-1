import { useState } from 'react';
import { openai } from '@/lib/openai';
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
        console.log("🚀 Starting Banner Generation Process...");
        try {
            // 1. Read text files
            console.log("1️⃣ Reading text files...");
            const guidelineText = await guidelineFile.text();
            const copyText = await copyFile.text();

            // 2. Prepare image for multimodal analysis (GPT-4o)
            console.log("2️⃣ Preparing images for GPT-4o analysis...");
            const toBase64 = (file: File): Promise<string> =>
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = error => reject(error);
                });

            const templateBase64 = await toBase64(templateFile);
            const referenceBase64 = referenceFile ? await toBase64(referenceFile) : null;

            // 3. Analyze inputs and create a prompt for DALL-E 3
            console.log("3️⃣ Analyzing inputs with GPT-4o...");
            const analysisResponse = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert banner designer. Your task is to analyze design guidelines, marketing copy, and reference templates to create a detailed prompt for DALL-E 3 to generate a high-quality advertising banner."
                    },
                    {
                        role: "user",
                        content: [
                            { type: "text", text: `Guideline: ${guidelineText}\n\nMarketing Copy: ${copyText}\n\nPlease analyze these and the attached template/reference images to create a prompt for a banner. The banner MUST include the exact marketing copy.` },
                            { type: "image_url", image_url: { url: templateBase64 } },
                            ...(referenceBase64 ? [{ type: "image_url", image_url: { url: referenceBase64 } }] : [] as any)
                        ]
                    }
                ]
            });

            const dallePrompt = analysisResponse.choices[0].message.content || "An advertising banner.";
            console.log("   - DALL-E Prompt:", dallePrompt);

            // 4. Generate Image with DALL-E 3
            console.log("4️⃣ Generating image with DALL-E 3 (Base64 mode)...");
            const imageResponse = await openai.images.generate({
                model: "dall-e-3",
                prompt: dallePrompt,
                n: 1,
                size: "1024x1024",
                quality: "hd",
                response_format: "b64_json" // Changed to b64_json to avoid "Failed to fetch" CORS issues
            });

            const b64Json = imageResponse.data?.[0]?.b64_json;
            if (!b64Json) {
                console.error("❌ DALL-E Response did not contain base64 data");
                throw new Error("Failed to get image data from DALL-E");
            }
            console.log("   - Image data received successfully");

            // 5. Convert Base64 to Blob and upload to Supabase Storage
            console.log("5️⃣ Uploading image to Supabase Storage...");
            const byteCharacters = atob(b64Json);
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

            if (uploadError) {
                console.error("❌ Supabase Storage Upload Error:", uploadError);
                throw uploadError;
            }
            console.log("   - Uploaded successfully:", uploadData.path);

            // 6. Save to database
            console.log("6️⃣ Saving banner record to database...");
            const metadata = {
                font: "Standard",
                colors: ["#ffffff", "#000000"],
                prompt: dallePrompt
            };

            const { data: bannerData, error: dbError } = await supabase
                .from('generated_banners')
                .insert({
                    project_id: projectId,
                    image_url: uploadData.path,
                    metadata: metadata,
                    status: 'generated'
                })
                .select()
                .single();

            if (dbError) {
                console.error("❌ Supabase Database Insert Error:", dbError);
                throw dbError;
            }

            console.log("✅ Process Complete!");
            return bannerData;

        } catch (error: any) {
            console.error("❌ Error during banner generation:", error);
            if (error.status === 401) throw new Error("OpenAI API Key is invalid or expired.");
            if (error.status === 429) throw new Error("OpenAI Quota exceeded.");
            throw error;
        } finally {
            setIsGenerating(false);
        }
    };

    return { generateBanner, isGenerating };
};
