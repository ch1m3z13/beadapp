import type { Metadata } from 'next';
import AddProjectInteractive from './components/AddProjectInteractive';

export const metadata: Metadata = {
  title: 'Add Project - BeadApp',
  description: 'Create a new social media project for automated tracking and AI-powered content generation from X and Farcaster platforms.',
};

export default function AddProjectPage() {
  return <AddProjectInteractive />;
}