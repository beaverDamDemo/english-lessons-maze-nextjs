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
  // Lesson 7 color theme
  const themeColor = '#E91E63';
  const themeColorDark = '#C2185B';
  const backgroundGradient =
    'linear-gradient(135deg, #E91E63 0%, #AD1457 100%)';

  if (!Scene) return <div>Loading...</div>;

  const QuizWrapper = (props: Record<string, unknown>) => (
    <Quiz onComplete={() => {}} primaryColor={themeColor} {...props} />
  );

  return (
    <MazePageComponent
      MazeScene={Scene}
      Quiz={QuizWrapper}
      lessonNumber={7}
      lessonTitle="Adverbs"
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
