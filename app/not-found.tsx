import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ maxWidth: 640, margin: '6rem auto', padding: '2rem', textAlign: 'center' }}>
      <h1>Page not found</h1>
      <p>The requested NEXUS page does not exist.</p>
      <Link href="/">Return to workspace</Link>
    </main>
  );
}
