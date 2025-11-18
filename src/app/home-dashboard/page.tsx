import type { Metadata } from 'next';
import DashboardInteractive from './components/DashboardInteractive';

export const metadata: Metadata = {
  title: 'Home Dashboard - BeadApp',
  description: 'Monitor recent AI-generated posts across all projects and access primary application functions with real-time updates.',
};

export default function HomeDashboardPage() {
  return (
    <main>
      <DashboardInteractive />
    </main>
  );
}