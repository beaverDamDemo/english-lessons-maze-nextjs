export default function ErrorPage({ statusCode }: { statusCode?: number }) {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>{statusCode || 'Error'} - Something went wrong</h1>
    </div>
  );
}
