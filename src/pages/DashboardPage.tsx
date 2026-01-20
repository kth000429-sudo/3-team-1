import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import AssetTable from '@/components/AssetTable';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const DashboardPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { userId } = useAuth();

    const { data: assets, isLoading } = useQuery({
        queryKey: ['assets', userId],
        queryFn: async () => {
            if (!userId) return [];
            const { data, error } = await supabase
                .from('generated_banners')
                .select('*, projects!inner(user_id)')
                .eq('projects.user_id', userId)
                .eq('status', 'approved')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Fetch error:', error);
                throw error;
            }
            return data;
        },
        enabled: !!userId,
    });


    const filteredAssets = assets?.filter(asset =>
        asset.metadata?.font?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.id.includes(searchTerm)
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end gap-4">
                <div className="space-y-2 flex-1">
                    <h1 className="text-3xl font-bold tracking-tighter">Asset Management</h1>
                    <p className="text-muted-foreground">Manage your history of banners and their deliberation status.</p>
                </div>
                <div className="w-full max-w-sm">
                    <Input
                        placeholder="Search by font or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="h-64 bg-muted animate-pulse rounded-lg" />
            ) : (
                <AssetTable data={filteredAssets || []} />
            )}
        </div>
    );
};

export default DashboardPage;
