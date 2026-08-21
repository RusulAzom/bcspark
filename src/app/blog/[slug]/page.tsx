export const dynamic = 'force-dynamic';

export default async function BlogDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <div>Test: {slug} - OK</div>;
}