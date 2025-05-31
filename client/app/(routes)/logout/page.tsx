'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '@/app/_lib/slices/authSlice';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // This will clear all state, localStorage, and cookies
    dispatch(logout());
    
    // Redirect to home page after logout
    router.push('/');
  }, [dispatch, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Logging out...</h1>
        <p className="text-gray-600">Please wait while we sign you out.</p>
      </div>
    </div>
  );
}

