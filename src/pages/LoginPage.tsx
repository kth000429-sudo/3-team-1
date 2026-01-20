import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const LoginPage = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!/^\d{6}$/.test(employeeId)) {
            setError('Please enter a 6-digit employee number.');
            return;
        }

        setIsLoading(true);
        // Simulate a brief delay for feel
        setTimeout(() => {
            login(employeeId);
            setIsLoading(false);
            navigate('/');
        }, 800);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
            <div className="w-full max-w-md space-y-8 flex flex-col items-center">
                <div className="w-32 h-32 mb-4">
                    <img src="/abc-logo.png" alt="ABC Logo" className="w-full h-full object-contain" />
                </div>

                <Card className="w-full border-slate-800 bg-slate-900/50 backdrop-blur-xl text-slate-100 shadow-2xl">
                    <CardHeader className="text-center space-y-1">
                        <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                            ABC Creator
                        </CardTitle>
                        <CardDescription className="text-slate-400 italic">
                            AI-Powered Ad Banner Generation
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                                    Employee Number
                                </label>
                                <Input
                                    type="text"
                                    placeholder="6-digit ID (e.g. 123456)"
                                    maxLength={6}
                                    value={employeeId}
                                    onChange={(e) => setEmployeeId(e.target.value.replace(/\D/g, ''))}
                                    className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-600 text-center text-xl h-12 tracking-widest focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                                />
                                {error && <p className="text-xs text-red-500 text-center font-medium">{error}</p>}
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold shadow-lg shadow-blue-900/20 transition-all duration-300 transform hover:scale-[1.02]"
                                disabled={isLoading || employeeId.length !== 6}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Connecting...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <div className="px-6 pb-6 text-center">
                        <p className="text-[10px] text-slate-500">Internal Use Only. Confidential & Proprietary.</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;
