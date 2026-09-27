'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Keep the client message generic; server details must never be rendered here.
    console.error('NEXUS page error', error.digest);
  }, [error]);

  return (
    <main style={{ maxWidth: 640, margin: '6rem auto', padding: '2rem', textAlign: 'center' }}>
      <h1>Something went wrong</h1>
      <p>We could not load this page. Please try again.</p>
      <button type="button" onClick={() => reset()}>Try again</button>
    </main>
  );
}
