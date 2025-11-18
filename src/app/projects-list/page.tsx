import type { Metadata } from 'next';
import ProjectsListInteractive from './components/ProjectsListInteractive';

export const metadata: Metadata = {
  title: 'Projects - BeadApp',
  description: 'View and manage your tracked Web3 projects with real-time updates and AI-powered insights.',
};

export default function ProjectsListPage() {
  return <ProjectsListInteractive />;
}