import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import BannerCard from './BannerCard';
import { useAuth } from '@/contexts/AuthContext';


interface BannerGridProps {
    projectId?: string;
}

const BannerGrid: React.FC<BannerGridProps> = ({ projectId }) => {
    const { userId } = useAuth();
    const { data: banners, isLoading, refetch } = useQuery({
        queryKey: ['banners', projectId, userId],
        queryFn: async () => {
            let query = supabase.from('generated_banners').select('*, projects!inner(user_id)');

            if (projectId) {
                query = query.eq('project_id', projectId);
            } else if (userId) {
                query = query.eq('projects.user_id', userId);
            }

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        },
        enabled: !!(projectId || userId),
    });


    if (isLoading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <div key={i} className="aspect-video bg-muted animate-pulse rounded-lg" />)}
    </div>;

    if (!banners || banners.length === 0) return (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No banner variations generated yet.</p>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner) => (
                <BannerCard
                    key={banner.id}
                    id={banner.id}
                    imageUrl={banner.image_url}
                    metadata={banner.metadata}
                    status={banner.status}
                    onStatusChange={() => refetch()}
                />
            ))}
        </div>
    );
};

export default BannerGrid;
