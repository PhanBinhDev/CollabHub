'use client';

import { GoogleIcon } from '@/components/icons/google';
import Translate from '@/components/shared/translate/translate-text';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAuthActions } from '@convex-dev/auth/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

type AuthMode = 'signin' | 'signup';

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuthActions();

  const handleEmailAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      if (mode === 'signup') {
        await signIn('password', { email, password, flow: 'signUp' });
      } else {
        await signIn('password', { email, password, flow: 'signIn' });
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await signIn('google');
    } catch (error) {
      console.error('Google auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 md:mt-20 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            <Translate
              value={mode === 'signin' ? 'auth.signIn' : 'auth.signUp'}
            />
          </CardTitle>
          <CardDescription>
            <Translate value="auth.welcome" />
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Google OAuth */}
          <Button
            onClick={handleGoogleAuth}
            variant="outline"
            className="w-full"
            loading={loading}
          >
            <GoogleIcon className="w-4 h-4 mr-2" />
            <Translate value="auth.continueWithGoogle" />
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                <Translate value="auth.or" />
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                <Translate value="auth.email" />
              </label>
              <Input
                name="email"
                id="email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                <Translate value="auth.password" />
              </label>
              <div className="relative">
                <Input
                  name="password"
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete={
                    mode === 'signup' ? 'new-password' : 'current-password'
                  }
                  className="pr-10"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" loading={loading}>
              <Translate
                value={mode === 'signin' ? 'auth.signIn' : 'auth.signUp'}
              />
            </Button>
          </form>

          {/* Toggle Sign In / Sign Up */}
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-sm"
              disabled={loading}
            >
              {mode === 'signin' ? (
                <Translate value="auth.needAccount" />
              ) : (
                <Translate value="auth.haveAccount" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
