'use client';
import dynamic from 'next/dynamic';

const KonvaCanvas = dynamic(() => import('../components/KonvaCanvas'), {
  ssr: false,
});

export default function MyPage() {
  return (
    <div>
      <KonvaCanvas />
    </div>
  );
}