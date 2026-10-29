import ProfileWizard from '../components/profiles/ProfileWizard'
import { usePageMeta } from '../hooks/usePageMeta'

export default function EditProfile() {
  usePageMeta(
    'Edit your profile',
    'Update your Saanjh demo profile, photos and the details that shape your matches.',
  )
  return <ProfileWizard mode="edit" />
}
