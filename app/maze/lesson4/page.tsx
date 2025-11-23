'use client';

import Quiz from './Quiz';
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
    import('./scene').then((m) => {
      if (mounted) setScene(() => m.MazeScene);
    });
    return () => {
      mounted = false;
    };
  }, []);
  // Lesson 4 color theme
  const themeColor = '#F44336';
  const themeColorDark = '#D32F2F';
  const backgroundGradient =
    'linear-gradient(135deg, #F44336 0%, #C62828 100%)';

  if (!Scene) return <div>Loading...</div>;

  const QuizWrapper = (props: Record<string, unknown>) => (
    <Quiz onComplete={() => {}} primaryColor={themeColor} {...props} />
  );

  return (
    <MazePageComponent
      MazeScene={Scene}
      Quiz={QuizWrapper}
      lessonNumber={4}
      lessonTitle="Nouns"
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
