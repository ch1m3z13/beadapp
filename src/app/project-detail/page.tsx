import type { Metadata } from 'next';
import ProjectDetailInteractive from './components/ProjectDetailInteractive';

export const metadata: Metadata = {
  title: 'Project Details - BeadApp',
  description: 'View detailed project updates, generate AI posts, and track on-chain activity.',
};

export default function ProjectDetailPage() {
  return <ProjectDetailInteractive />;
}