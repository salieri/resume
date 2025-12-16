import { ContinuousLearning } from '@/sections/continuous-learning/continuous-learning';
import { Education } from '@/sections/education/education';
import { ExecutiveSummary } from '@/sections/executive-summary/executive-summary';
import { Projects } from '@/sections/projects/projects';
import { WorkHistory } from '@/sections/work-history/work-history';

export const meta = (a, b, c) => {
  console.log('META', a, b, c);

  return [{ title: 'Resume | Aleksi Asikainen | Software Architecture & Development' }];
};

export default function Home() {
  return (
    <>
      <ExecutiveSummary />
      <WorkHistory />
      <ContinuousLearning />
      <Education />
      <Projects />
    </>
  );
}
