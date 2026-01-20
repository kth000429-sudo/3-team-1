import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';

import { supabase } from '@/lib/supabase';

interface BannerCardProps {
    id: string;
    imageUrl: string;
    metadata: any;
    status: string;
    onStatusChange: () => void;
}

const BannerCard: React.FC<BannerCardProps> = ({ id, imageUrl, metadata, status, onStatusChange }) => {
    const updateStatus = async (newStatus: 'approved' | 'rejected') => {
        const { error } = await supabase
            .from('generated_banners')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            console.error('Error updating banner status:', error);
        } else {
            onStatusChange();
        }
    };

    const handleDownload = async () => {
        try {
            const { data, error } = await supabase.storage
                .from('banners')
                .download(imageUrl);

            if (error) throw error;

            const url = URL.createObjectURL(data);
            const link = document.createElement('a');
            link.href = url;
            link.download = `banner-${id.split('-')[0]}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download image.');
        }
    };


    return (
        <Card className="overflow-hidden group">
            <div className="relative aspect-video bg-muted overflow-hidden">
                <img
                    src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/banners/${imageUrl}`}
                    alt="Generated Banner"
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
                <div className="absolute top-2 right-2">
                    <Badge variant={status === 'approved' ? 'default' : status === 'rejected' ? 'destructive' : 'secondary'}>
                        {status}
                    </Badge>
                </div>
            </div>
            <CardHeader className="p-4 py-2">
                <CardTitle className="text-sm font-medium">Variation</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex flex-wrap gap-1">
                    {metadata?.colors?.map((c: string) => (
                        <div key={c} className="w-4 h-4 rounded-full border" style={{ backgroundColor: c }} title={c} />
                    ))}
                    <span className="text-xs text-muted-foreground ml-2">{metadata?.font}</span>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex gap-2">
                <Button
                    size="sm"
                    variant={status === 'approved' ? 'default' : 'outline'}
                    className="flex-1 text-xs"
                    onClick={() => updateStatus('approved')}
                >
                    Approve
                </Button>
                <Button
                    size="sm"
                    variant={status === 'rejected' ? 'destructive' : 'outline'}
                    className="flex-1 text-xs"
                    onClick={() => updateStatus('rejected')}
                >
                    Reject
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    className="px-2"
                    title="Download"
                    onClick={handleDownload}
                >
                    <Download className="w-4 h-4" />
                </Button>
            </CardFooter>

        </Card>
    );
};

export default BannerCard;
