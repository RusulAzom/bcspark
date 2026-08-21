import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const category = params.slug.split('-')[0] || 'BCSpark Special'; // fallback, ideally fetch real category from Firestore if possible

  // Category based colors
  const gradients: any = {
    default: ['#6366f1', '#8b5cf6'],
  };
  const [c1, c2] = gradients.default;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${c1}, ${c2})`,
          color: 'white',
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 20 }}>📚</div>
        <div style={{ fontSize: 48, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 4 }}>
          BCSpark Blog
        </div>
        <div style={{ fontSize: 20, marginTop: 20, opacity: 0.9 }}>bcspark.com - BCS Preparation Platform</div>
      </div>
    ),
    {...size }
  );
}