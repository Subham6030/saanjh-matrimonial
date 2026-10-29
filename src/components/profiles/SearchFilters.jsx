import { RotateCcw } from 'lucide-react'
import {
  cityOptions,
  educationLevels,
  genders,
  heights,
  languages,
  maritalStatuses,
  professionCategories,
  religions,
} from '../../data/options'
import { Select, SelectField } from '../forms/FormControls'
import Button from '../common/Button'

export const EMPTY_SEARCH_FILTERS = {
  q: '',
  gender: '',
  ageMin: '',
  ageMax: '',
  heightMin: '',
  heightMax: '',
  city: '',
  religion: '',
  education: '',
  profession: '',
  maritalStatus: '',
  language: '',
  sort: 'compatibility',
}

const ages = Array.from({ length: 43 }, (_, index) => 18 + index)

export default function SearchFilters({ filters, onChange, onReset, className, hideHeading = false }) {
  return (
    <div className={className}>
      {!hideHeading && (
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink-primary">Refine results</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
            className="px-2"
          >
            Reset
          </Button>
        </div>
      )}

      <div className={hideHeading ? 'space-y-4' : 'mt-4 space-y-4'}>
        <SelectField
          label="Looking for"
          value={filters.gender}
          onChange={(event) => onChange('gender', event.target.value)}
          placeholder="Anyone"
        >
          {genders.map((gender) => (
            <option key={gender.value} value={gender.value}>
              {gender.label}
            </option>
          ))}
        </SelectField>

        <fieldset>
          <legend className="label-base">Age range</legend>
          <div className="grid grid-cols-2 gap-2">
            <label className="sr-only" htmlFor="filter-age-min">
              Minimum age
            </label>
            <Select
              id="filter-age-min"
              value={filters.ageMin}
              onChange={(event) => onChange('ageMin', event.target.value)}
            >
              <option value="">Min age</option>
              {ages.map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </Select>
            <label className="sr-only" htmlFor="filter-age-max">
              Maximum age
            </label>
            <Select
              id="filter-age-max"
              value={filters.ageMax}
              onChange={(event) => onChange('ageMax', event.target.value)}
            >
              <option value="">Max age</option>
              {ages.map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </Select>
          </div>
        </fieldset>

        <fieldset>
          <legend className="label-base">Height range</legend>
          <div className="grid grid-cols-2 gap-2">
            <label className="sr-only" htmlFor="filter-height-min">
              Minimum height
            </label>
            <Select
              id="filter-height-min"
              className="text-xs"
              value={filters.heightMin}
              onChange={(event) => onChange('heightMin', event.target.value)}
            >
              <option value="">Min height</option>
              {heights.map((height) => (
                <option key={height.value} value={height.value}>
                  {height.label}
                </option>
              ))}
            </Select>
            <label className="sr-only" htmlFor="filter-height-max">
              Maximum height
            </label>
            <Select
              id="filter-height-max"
              className="text-xs"
              value={filters.heightMax}
              onChange={(event) => onChange('heightMax', event.target.value)}
            >
              <option value="">Max height</option>
              {heights.map((height) => (
                <option key={height.value} value={height.value}>
                  {height.label}
                </option>
              ))}
            </Select>
          </div>
        </fieldset>

        <SelectField
          label="Location"
          value={filters.city}
          onChange={(event) => onChange('city', event.target.value)}
          placeholder="Any city"
        >
          {cityOptions.map((item) => (
            <option key={item.city} value={item.city}>
              {item.city}, {item.state}
            </option>
          ))}
        </SelectField>

        <SelectField
          label="Education"
          value={filters.education}
          onChange={(event) => onChange('education', event.target.value)}
          placeholder="Any qualification"
        >
          {educationLevels.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </SelectField>

        <SelectField
          label="Profession"
          value={filters.profession}
          onChange={(event) => onChange('profession', event.target.value)}
          placeholder="Any profession"
        >
          {professionCategories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </SelectField>

        <SelectField
          label="Marital status"
          value={filters.maritalStatus}
          onChange={(event) => onChange('maritalStatus', event.target.value)}
          placeholder="Any status"
        >
          {maritalStatuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </SelectField>

        <SelectField
          label="Community"
          value={filters.religion}
          onChange={(event) => onChange('religion', event.target.value)}
          placeholder="Any community"
        >
          {religions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </SelectField>

        <SelectField
          label="Language"
          value={filters.language}
          onChange={(event) => onChange('language', event.target.value)}
          placeholder="Any language"
        >
          {languages.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </SelectField>
      </div>
    </div>
  )
}
