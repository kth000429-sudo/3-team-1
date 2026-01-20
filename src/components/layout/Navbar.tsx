import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { userId, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center flex justify-between">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center space-x-2 font-bold text-2xl text-blue-600">
                        <img src="/abc-logo.png" alt="ABC Logo" className="w-8 h-8 object-contain" />
                        <span>ABC</span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link to="/" className="transition-colors hover:text-foreground text-foreground/60">Generate</Link>
                        <Link to="/review" className="transition-colors hover:text-foreground text-foreground/60">Review</Link>
                        <Link to="/dashboard" className="transition-colors hover:text-foreground text-foreground/60">Dashboard</Link>
                    </nav>
                </div>

                <div className="flex items-center space-x-4">
                    {userId && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-xs font-semibold text-muted-foreground border">
                            <User className="w-3 h-3" />
                            <span>Emp ID: {userId}</span>
                        </div>
                    )}
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-red-500">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
