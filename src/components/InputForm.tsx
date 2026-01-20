import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import FileUploader from '../components/FileUploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useBannerGenerator } from '@/hooks/useBannerGenerator';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
    guideline: z.any().refine((file) => file instanceof File, "Guideline file is required"),
    copy: z.any().refine((file) => file instanceof File, "Copy file is required"),
    template: z.any().refine((file) => file instanceof File, "Template file is required"),
    reference: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const InputForm = () => {
    const navigate = useNavigate();
    const { generateBanner, isGenerating } = useBannerGenerator();
    const { setValue, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormValues) => {
        try {
            // 1. Upload input files to Supabase Storage (for history)
            const uploadFile = async (bucket: string, file: File) => {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;
                const { error, data: uploadData } = await supabase.storage.from(bucket).upload(filePath, file);
                if (error) throw error;
                return uploadData.path;
            };

            const guidelinePath = await uploadFile('inputs', data.guideline);
            const copyPath = await uploadFile('inputs', data.copy);
            const templatePath = await uploadFile('inputs', data.template);
            let referencePath = null;
            if (data.reference) {
                referencePath = await uploadFile('inputs', data.reference);
            }

            // 2. Save project record
            const { data: project, error: projectError } = await supabase
                .from('projects')
                .insert({
                    guideline_url: guidelinePath,
                    copy_text_url: copyPath,
                    template_url: templatePath,
                    reference_image_url: referencePath,
                })
                .select()
                .single();

            if (projectError) throw projectError;

            // 3. Trigger AI Generation
            await generateBanner({
                guidelineFile: data.guideline,
                copyFile: data.copy,
                templateFile: data.template,
                referenceFile: data.reference,
                projectId: project.id
            });

            // 4. Navigate to review page
            navigate('/review', { state: { projectId: project.id } });
        } catch (error: any) {
            console.error('Error submitting form:', error);
            alert(error.message || 'Failed to process and generate banner. Please check your API key or connection.');
        }
    };

    const guideline = watch('guideline');
    const copy = watch('copy');
    const template = watch('template');
    const reference = watch('reference');

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Input Sources</CardTitle>
                    <CardDescription>Upload the required files for banner generation.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <FileUploader
                        label="Deliberation Guideline (.txt)"
                        accept=".txt"
                        onChange={(file) => setValue('guideline', file)}
                        fileName={guideline?.name}
                    />
                    {errors.guideline && <p className="text-xs text-destructive">{errors.guideline.message as string}</p>}

                    <FileUploader
                        label="Marketing Copy (.txt)"
                        accept=".txt"
                        onChange={(file) => setValue('copy', file)}
                        fileName={copy?.name}
                    />
                    {errors.copy && <p className="text-xs text-destructive">{errors.copy.message as string}</p>}

                    <FileUploader
                        label="Design Template (.png, .jpg)"
                        accept=".png,.jpg,.jpeg"
                        onChange={(file) => setValue('template', file)}
                        fileName={template?.name}
                    />
                    {errors.template && <p className="text-xs text-destructive">{errors.template.message as string}</p>}

                    <FileUploader
                        label="Reference Image (Optional, .png, .jpg)"
                        accept=".png,.jpg,.jpeg"
                        onChange={(file) => setValue('reference', file)}
                        fileName={reference?.name}
                    />

                    <Button type="submit" className="w-full mt-4" disabled={isGenerating}>
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating Variations...
                            </>
                        ) : (
                            'Generate Variations'
                        )}
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
};

export default InputForm;
