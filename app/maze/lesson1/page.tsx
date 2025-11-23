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
  // Lesson 1 color theme - Green
  const themeColor = '#4CAF50';
  const themeColorDark = '#388E3C';
  const backgroundGradient =
    'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)';

  if (!Scene) return <div>Loading...</div>;

  // Provide required props to Quiz so it matches the expected signature
  const QuizWrapper: React.ComponentType<Record<string, unknown>> = (props) => (
    <Quiz onComplete={() => {}} primaryColor={themeColor} {...props} />
  );

  return (
    <MazePageComponent
      MazeScene={Scene}
      Quiz={QuizWrapper}
      lessonNumber={1}
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
