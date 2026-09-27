'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main style={{ maxWidth: 640, margin: '6rem auto', padding: '2rem', textAlign: 'center' }}>
          <h1>NEXUS is temporarily unavailable</h1>
          <p>Please try again in a moment.</p>
          <button type="button" onClick={() => reset()}>Try again</button>
        </main>
      </body>
    </html>
  );
}
