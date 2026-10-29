import { useMemo } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import Hero from '../components/home/Hero'
import SearchPanel from '../components/home/SearchPanel'
import {
  FAQSection,
  FinalCTA,
  HowItWorks,
  PremiumTeaser,
  Testimonials,
  TrustStrip,
  WhyChoose,
} from '../components/home/StorySections'
import ProfileGrid from '../components/profiles/ProfileGrid'
import ProfileCard from '../components/profiles/ProfileCard'
import Button from '../components/common/Button'
import { Badge, SectionHeading } from '../components/common/ui'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../context/ProfileContext'
import { useProfileActions } from '../hooks/useProfileActions'
import { usePageMeta } from '../hooks/usePageMeta'
import { featuredProfiles } from '../data/profiles'
import { demoMemberProfile, demoPreferences } from '../data/member'
import { computeCompatibility } from '../utils/compatibility'

export default function Home() {
  usePageMeta(
    'Premium matrimonial matchmaking',
    'Saanjh is a premium matrimonial front-end demo with sample profiles, compatibility-led matching, simulated messaging and membership flows.',
  )
  const { isAuthenticated } = useAuth()
  const { profile, preferences } = useProfile()
  const { isShortlisted, getInterestFor, handleShortlist, handleInterest, handleMessage } =
    useProfileActions()

  const featured = useMemo(() => {
    const scorerProfile = isAuthenticated ? profile : demoMemberProfile
    const scorerPreferences = isAuthenticated ? preferences : demoPreferences
    return featuredProfiles.map((item) => ({
      ...item,
      match: computeCompatibility(item, scorerProfile, scorerPreferences),
    }))
  }, [isAuthenticated, profile, preferences])

  return (
    <>
      <Hero />
      <SearchPanel />
      <TrustStrip />

      <section className="py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="A glimpse of the experience"
            title="Featured sample profiles."
            description="Thoughtfully detailed fictional profiles built to demonstrate the matching experience. Every card is clearly marked as sample content."
            action={
              <Button to="/matches" variant="secondary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                View all matches
              </Button>
            }
          />
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <Badge tone="warning" size="sm">
              Sample profiles only
            </Badge>
            <Badge tone="neutral" size="sm">
              Compatibility scores are illustrative
            </Badge>
            <Badge tone="neutral" size="sm">
              <Sparkles className="h-3 w-3" aria-hidden="true" /> Demo data
            </Badge>
          </div>
          <ProfileGrid className="mt-6" columns="wide">
            {featured.map((profileItem, index) => (
              <ProfileCard
                key={profileItem.id}
                profile={profileItem}
                match={profileItem.match}
                isShortlisted={isShortlisted(profileItem.id)}
                interest={getInterestFor(profileItem.id)}
                onShortlist={handleShortlist}
                onInterest={handleInterest}
                onMessage={handleMessage}
                imagePriority={index < 2}
              />
            ))}
          </ProfileGrid>
        </div>
      </section>

      <HowItWorks />
      <WhyChoose />
      <PremiumTeaser />
      <Testimonials />
      <FAQSection />
      <FinalCTA />
    </>
  )
}
