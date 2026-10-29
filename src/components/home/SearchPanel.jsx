import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useProfile } from '../../context/ProfileContext'
import { cityOptions, religions } from '../../data/options'
import { Select } from '../forms/FormControls'

const ages = Array.from({ length: 43 }, (_, index) => 18 + index)

export default function SearchPanel() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { preferences } = useProfile()
  const [form, setForm] = useState({
    lookingFor: isAuthenticated ? preferences.lookingFor || '' : '',
    ageMin: isAuthenticated ? preferences.ageMin || '' : '',
    ageMax: isAuthenticated ? preferences.ageMax || '' : '',
    religion: isAuthenticated ? preferences.religions?.[0] || '' : '',
    city: isAuthenticated ? preferences.locations?.[0] || '' : '',
  })

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function submit(event) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (form.lookingFor) params.set('lookingFor', form.lookingFor)
    if (form.ageMin) params.set('ageMin', form.ageMin)
    if (form.ageMax) params.set('ageMax', form.ageMax)
    if (form.religion) params.set('religion', form.religion)
    if (form.city) params.set('city', form.city)
    params.set('source', 'home')
    navigate(`/search?${params.toString()}`)
  }

  return (
    <div className="container-page relative z-20 -mt-2">
      <form
        onSubmit={submit}
        className="card-surface grid gap-3 p-4 lg:grid-cols-[0.9fr_1.3fr_0.9fr_0.9fr_auto] lg:items-end lg:gap-3 lg:p-5"
        aria-label="Find matches"
      >
        <div>
          <label htmlFor="home-looking" className="label-base">
            I am looking for
          </label>
          <Select
            id="home-looking"
            value={form.lookingFor}
            onChange={(event) => update('lookingFor', event.target.value)}
            className="bg-bg-primary/60"
          >
            <option value="">Anyone</option>
            <option value="female">A woman</option>
            <option value="male">A man</option>
            <option value="non-binary">A non-binary person</option>
          </Select>
        </div>

        <div>
          <span className="label-base">Age range</span>
          <div className="grid grid-cols-2 gap-2">
            <label className="sr-only" htmlFor="home-age-min">
              Minimum age
            </label>
            <Select
              id="home-age-min"
              value={form.ageMin}
              onChange={(event) => update('ageMin', event.target.value)}
              className="bg-bg-primary/60"
            >
              <option value="">Min</option>
              {ages.map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </Select>
            <label className="sr-only" htmlFor="home-age-max">
              Maximum age
            </label>
            <Select
              id="home-age-max"
              value={form.ageMax}
              onChange={(event) => update('ageMax', event.target.value)}
              className="bg-bg-primary/60"
            >
              <option value="">Max</option>
              {ages.map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <label htmlFor="home-community" className="label-base">
            Community
          </label>
          <Select
            id="home-community"
            value={form.religion}
            onChange={(event) => update('religion', event.target.value)}
            className="bg-bg-primary/60"
          >
            <option value="">Any community</option>
            {religions.map((religion) => (
              <option key={religion} value={religion}>
                {religion}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label htmlFor="home-city" className="label-base">
            Location
          </label>
          <Select
            id="home-city"
            value={form.city}
            onChange={(event) => update('city', event.target.value)}
            className="bg-bg-primary/60"
          >
            <option value="">Any city</option>
            {cityOptions.map((item) => (
              <option key={item.city} value={item.city}>
                {item.city}
              </option>
            ))}
          </Select>
        </div>

        <button type="submit" className="btn-primary h-[42px] w-full px-5 lg:w-auto">
          <Search className="h-4 w-4" aria-hidden="true" />
          <span>Search</span>
        </button>
      </form>
      <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-ink-muted lg:justify-end">
        <SlidersHorizontal className="h-3 w-3" aria-hidden="true" />
        You can refine age, height, education, profession and languages on the next screen.
      </p>
    </div>
  )
}
