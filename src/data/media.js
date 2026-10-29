export const portrait = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces&w=900&h=1125&q=80`

export const gallery = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&h=900&q=80`

export const siteImages = {
  hero: gallery('1519741497674-611481863552'),
  story: gallery('1522673607200-164d1b6ce486'),
  ceremony: gallery('1511285560929-80b456fea0bc'),
  celebration: gallery('1465495976277-4387d4b0b4c6'),
}
