'use client';

import { SignInButton, useAuth } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const AuthRedirect = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const searchParams = useSearchParams();
  const [requiredAuth, showRequiredAuth] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hasTriggered = useRef(false);

  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    if (searchParams.get('sign-in') === 'true') {
      showRequiredAuth(true);
      const params = new URLSearchParams(searchParams);
      params.delete('sign-in');
      const newUrl = params.toString() ? `/?${params.toString()}` : '/';
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isLoaded && !isSignedIn && requiredAuth && !hasTriggered.current) {
      hasTriggered.current = true;
      setTimeout(() => {
        buttonRef.current?.click();
      }, 100);
    }
  }, [isLoaded, isSignedIn, requiredAuth]);

  return (
    <>
      {requiredAuth && (
        <SignInButton mode="modal" forceRedirectUrl={redirectUrl}>
          <button
            ref={buttonRef}
            className="fixed opacity-0 pointer-events-none -z-10"
            aria-hidden="true"
          >
            Sign In
          </button>
        </SignInButton>
      )}
    </>
  );
};

export default AuthRedirect;
