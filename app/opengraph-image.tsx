import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Forfwd — Move forward. Plan better.';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #09090b, #030712)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          padding: '80px',
        }}
      >
        {/* Decorative Glows matching Forfwd theme */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(79, 70, 229, 0.18) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Premium Content Box */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '40px',
            padding: '60px 80px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Logo icon with brand gradient */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '90px',
              height: '90px',
              borderRadius: '28px',
              background: 'linear-gradient(to bottom right, #4f46e5, #0ea5e9, #06b6d4)',
              boxShadow: '0 12px 30px rgba(79, 70, 229, 0.4)',
              marginBottom: '32px',
            }}
          >
            {/* SVG Compass Icon */}
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
          </div>

          {/* Brand Name */}
          <div
            style={{
              fontSize: '68px',
              fontWeight: 900,
              letterSpacing: '-0.05em',
              color: 'white',
              marginBottom: '16px',
            }}
          >
            Forfwd
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: '22px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
              background: 'linear-gradient(to right, #818cf8, #38bdf8, #22d3ee)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Move forward. Plan better.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
