'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (getApps().length) {
    return getSdks(getApp());
  }

  // When deployed to Firebase App Hosting, environment variables are used.
  // Locally, the try/catch falls back to the firebaseConfig object.
  // This is a robust way to handle both environments without build warnings.
  try {
    const app = initializeApp();
    return getSdks(app);
  } catch (e) {
    const app = initializeApp(firebaseConfig);
    return getSdks(app);
  }
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from '@/hooks/use-collection';
export * from '@/hooks/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
