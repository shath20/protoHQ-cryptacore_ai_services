
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';

interface LoginPageProps {
    onLoginSuccess: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register
    const [name, setName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
        const body = isRegistering ? { name, email, password } : { email, password };

        try {
            const response = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            login(data);
            onLoginSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center group cursor-pointer">
                    <div className="inline-block relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl transform group-hover:scale-105 transition-transform duration-300">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        {isRegistering ? 'Create an account' : 'Welcome back'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {isRegistering ? 'Start protecting your returns today' : 'Sign in to access your dashboard'}
                    </p>
                </div>

                <Card className="border-2 border-gray-100 shadow-xl bg-white overflow-hidden">
                    <CardHeader className="space-y-1 bg-gray-50/50 border-b border-gray-100">
                        <CardTitle className="text-xl">Authentication</CardTitle>
                        <CardDescription>
                            Enter your credentials to continue
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 animate-in fade-in">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            {isRegistering && (
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-3 text-gray-400">
                                            <Shield className="w-4 h-4" />
                                        </div>
                                        <Input
                                            id="name"
                                            placeholder="John Doe"
                                            type="text"
                                            className="pl-10"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <div className="absolute left-3 top-3 text-gray-400">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <Input
                                        id="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        className="pl-10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <div className="absolute left-3 top-3 text-gray-400">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        className="pl-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                        {isRegistering ? 'Creating account...' : 'Signing in...'}
                                    </>
                                ) : (
                                    isRegistering ? 'Create Account' : 'Sign In'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="bg-gray-50/50 border-t border-gray-100 flex justify-center p-4">
                        <p className="text-sm text-gray-600">
                            {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                            <button
                                onClick={() => setIsRegistering(!isRegistering)}
                                className="ml-1 text-blue-600 hover:underline font-medium focus:outline-none"
                            >
                                {isRegistering ? 'Sign in' : 'Sign up'}
                            </button>
                        </p>
                    </CardFooter>
                </Card>

                <div className="text-center text-xs text-gray-400">
                    <p>Protected by protoHQ Security Systems</p>
                </div>
            </div>
        </div>
    );
}
