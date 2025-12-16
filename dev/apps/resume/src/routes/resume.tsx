import { ContinuousLearning } from '@/sections/continuous-learning/continuous-learning';
import { Education } from '@/sections/education/education';
import { ExecutiveSummary } from '@/sections/executive-summary/executive-summary';
import { Projects } from '@/sections/projects/projects';
import { WorkHistory } from '@/sections/work-history/work-history';

export const handle = {
  title: 'Resume | Aleksi Asikainen | Software Architecture and Development',
  titleKey: 'resume',
};

export default function Resume() {
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
