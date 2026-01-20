import { useLocation } from 'react-router-dom';
import BannerGrid from '../components/BannerGrid';
import { Button } from '@/components/ui/button';

const ReviewPage = () => {
    const location = useLocation();
    const projectId = location.state?.projectId;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter">Variation Review</h1>
                    <p className="text-muted-foreground">
                        {projectId ? `Reviewing variations for project: ${projectId.split('-')[0]}...` : 'Review and filter all generated banner variations.'}
                    </p>
                </div>
                <div className="flex gap-2 text-sm">
                    <Button variant="outline" size="sm">Filter by Color</Button>
                    <Button variant="outline" size="sm">Filter by Font</Button>
                </div>
            </div>

            <BannerGrid projectId={projectId} />

            <div className="flex justify-center py-8">
                <Button variant="ghost">Load More</Button>
            </div>
        </div>
    );
};

export default ReviewPage;
