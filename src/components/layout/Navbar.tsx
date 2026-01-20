import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navbar = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 flex">
                    <Link to="/" className="mr-6 flex items-center space-x-2 font-bold text-xl text-primary">
                        ABC
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link to="/" className="transition-colors hover:text-foreground/80 text-foreground/60">Input</Link>
                        <Link to="/review" className="transition-colors hover:text-foreground/80 text-foreground/60">Review</Link>
                        <Link to="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">Dashboard</Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-2">
                    <Button variant="outline" size="sm">
                        Contact Support
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
