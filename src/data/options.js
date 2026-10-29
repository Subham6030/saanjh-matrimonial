export const genders = [
  { value: 'female', label: 'Woman' },
  { value: 'male', label: 'Man' },
  { value: 'non-binary', label: 'Non-binary' },
]

export const lookingForOptions = [
  { value: 'male', label: 'Men' },
  { value: 'female', label: 'Women' },
  { value: 'non-binary', label: 'Non-binary people' },
]

export const profileForOptions = ['Self', 'Parent', 'Sibling', 'Guardian']

export const maritalStatuses = ['Never Married', 'Divorced', 'Widowed', 'Separated']

export const educationLevels = ['High School', 'Diploma', "Bachelor's", "Master's", 'Doctorate']

export const professionCategories = [
  'Technology',
  'Design',
  'Healthcare',
  'Finance',
  'Education',
  'Law',
  'Business',
  'Creative',
  'Government',
  'Hospitality',
  'Media',
  'Other',
]

export const incomeRanges = [
  'Prefer not to say',
  'Under ₹5 LPA',
  '₹5–10 LPA',
  '₹10–15 LPA',
  '₹15–25 LPA',
  '₹25–40 LPA',
  '₹40+ LPA',
]

export const languages = [
  'English',
  'Hindi',
  'Marathi',
  'Tamil',
  'Telugu',
  'Kannada',
  'Malayalam',
  'Gujarati',
  'Bengali',
  'Punjabi',
  'Urdu',
  'Konkani',
  'Odia',
  'Assamese',
  'Sanskrit',
]

export const motherTongues = [
  'Hindi',
  'Marathi',
  'Tamil',
  'Telugu',
  'Kannada',
  'Malayalam',
  'Gujarati',
  'Bengali',
  'Punjabi',
  'Urdu',
  'Konkani',
  'Odia',
  'Assamese',
  'Sanskrit',
  'English',
  'Other',
]

export const religions = [
  'Hindu',
  'Muslim',
  'Christian',
  'Sikh',
  'Jain',
  'Buddhist',
  'Parsi',
  'Spiritual',
  'Other',
]

export const diets = ['Vegetarian', 'Eggetarian', 'Non-vegetarian', 'Vegan', 'Jain']

export const smokingOptions = ['No', 'Occasionally', 'Yes']
export const drinkingOptions = ['No', 'Occasionally', 'Yes']

export const familyTypes = ['Nuclear', 'Joint', 'Extended']
export const familyValues = ['Traditional', 'Moderate', 'Liberal']

export const interestsList = [
  'Travel',
  'Cooking',
  'Reading',
  'Yoga',
  'Photography',
  'Music',
  'Cricket',
  'Movies',
  'Art',
  'Fitness',
  'Running',
  'Trekking',
  'Dancing',
  'Volunteering',
  'Gardening',
  'Chess',
  'Gaming',
  'Coffee',
  'Baking',
  'Writing',
  'Football',
  'Cycling',
  'Theatre',
  'Pets',
]

export const countries = [
  'India',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Canada',
  'Australia',
  'Singapore',
  'Other',
]

export const cityOptions = [
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Bengaluru', state: 'Karnataka' },
  { city: 'Delhi', state: 'Delhi' },
  { city: 'Noida', state: 'Uttar Pradesh' },
  { city: 'Gurugram', state: 'Haryana' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Kolkata', state: 'West Bengal' },
  { city: 'Ahmedabad', state: 'Gujarat' },
  { city: 'Jaipur', state: 'Rajasthan' },
  { city: 'Kochi', state: 'Kerala' },
  { city: 'Chandigarh', state: 'Chandigarh' },
  { city: 'Goa', state: 'Goa' },
]

export const cities = cityOptions.map((item) => item.city)

export const states = [...new Set(cityOptions.map((item) => item.state))]

export const heights = Array.from({ length: 56 }, (_, index) => {
  const cm = 140 + index
  const totalInches = Math.round(cm / 2.54)
  const feet = Math.floor(totalInches / 12)
  const inches = totalInches % 12
  return { value: cm, label: `${cm} cm · ${feet}'${inches}"` }
})

export const sortOptions = [
  { value: 'compatibility', label: 'Best compatibility' },
  { value: 'newest', label: 'Newest profiles' },
  { value: 'age-asc', label: 'Age: low to high' },
  { value: 'age-desc', label: 'Age: high to low' },
]

export const notificationFilters = ['All', 'Unread']

export const planIntervals = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly', note: 'Save 2 months' },
]
