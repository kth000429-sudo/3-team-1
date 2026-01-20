import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextType {
    userId: string | null;
    login: (id: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userId, setUserId] = useState<string | null>(localStorage.getItem('abc_user_id'));

    const login = (id: string) => {
        localStorage.setItem('abc_user_id', id);
        setUserId(id);
    };

    const logout = () => {
        localStorage.removeItem('abc_user_id');
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
