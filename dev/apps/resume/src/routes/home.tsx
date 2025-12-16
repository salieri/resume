import { ExecutiveSummary } from '@/sections/executive-summary/executive-summary';
import { WorkHistory } from '@/sections/work-history/work-history';

export default function Home() {
  return (
    <>
      <ExecutiveSummary />
      <WorkHistory />
    </>
  );
}
