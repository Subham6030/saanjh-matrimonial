import ProfileWizard from '../components/profiles/ProfileWizard'
import { usePageMeta } from '../hooks/usePageMeta'

export default function CreateProfile() {
  usePageMeta(
    'Create your profile',
    'Build your Saanjh profile in seven guided steps. All details stay in your browser for this demo.',
  )
  return <ProfileWizard mode="create" />
}
