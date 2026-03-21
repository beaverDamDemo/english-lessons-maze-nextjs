'use client';

import Quiz from '@/app/maze/lesson9/Quiz';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import type { FC } from 'react';

const MazePageComponent = dynamic(
  () => import('../_components/MazePageComponent'),
  { ssr: false, loading: () => <div>Loading...</div> },
);

const MazePage: FC = () => {
  const [Scene, setScene] = useState<unknown>(null);
  useEffect(() => {
    let mounted = true;
    import('@/app/maze/lesson9/scene').then((m) => {
      if (mounted) setScene(() => m.MazeScene);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Lesson 9 color theme
  const themeColor = '#795548';
  const themeColorDark = '#5D4037';
  const backgroundGradient =
    'linear-gradient(135deg, #795548 0%, #4E342E 100%)';

  if (!Scene) return <div>Loading...</div>;

  const QuizWrapper = (props: Record<string, unknown>) => (
    <Quiz onComplete={() => {}} primaryColor={themeColor} {...props} />
  );

  return (
    <MazePageComponent
      MazeScene={Scene}
      Quiz={QuizWrapper}
      lessonNumber={9}
      lessonTitle="Final Review"
      themeColor={themeColor}
      themeColorDark={themeColorDark}
      backgroundGradient={backgroundGradient}
    />
  );
};

const DynamicMazePage = dynamic(() => Promise.resolve(MazePage), {
  ssr: false,
});

export default DynamicMazePage;
