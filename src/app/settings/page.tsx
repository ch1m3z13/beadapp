import type { Metadata } from 'next';
import SettingsInteractive from './components/SettingsInteractive';

export const metadata: Metadata = {
  title: 'Settings - BeadApp',
  description: 'Manage your account preferences, notifications, and wallet connections.',
};

export default function SettingsPage() {
  return <SettingsInteractive />;
}