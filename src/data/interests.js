function daysAgo(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

export const seedInterests = [
  {
    id: 'int-1',
    profileId: 'p2',
    direction: 'incoming',
    status: 'pending',
    createdAt: daysAgo(1),
    note: 'Kabir expressed interest in your profile.',
  },
  {
    id: 'int-2',
    profileId: 'p5',
    direction: 'incoming',
    status: 'pending',
    createdAt: daysAgo(2),
    note: 'Ishaan expressed interest in your profile.',
  },
  {
    id: 'int-3',
    profileId: 'p8',
    direction: 'incoming',
    status: 'pending',
    createdAt: daysAgo(3),
    note: 'Arjan expressed interest in your profile.',
  },
  {
    id: 'int-4',
    profileId: 'p10',
    direction: 'incoming',
    status: 'pending',
    createdAt: daysAgo(4),
    note: 'Sameer expressed interest in your profile.',
  },
  {
    id: 'int-5',
    profileId: 'p1',
    direction: 'incoming',
    status: 'accepted',
    createdAt: daysAgo(6),
    note: 'You accepted Aditya’s interest.',
  },
  {
    id: 'int-6',
    profileId: 'p4',
    direction: 'incoming',
    status: 'declined',
    createdAt: daysAgo(9),
    note: 'You declined Rohan’s interest.',
  },
  {
    id: 'int-7',
    profileId: 'p3',
    direction: 'outgoing',
    status: 'accepted',
    createdAt: daysAgo(8),
    note: 'Arjun accepted your interest.',
  },
  {
    id: 'int-8',
    profileId: 'p6',
    direction: 'outgoing',
    status: 'accepted',
    createdAt: daysAgo(11),
    note: 'Vikram accepted your interest.',
  },
  {
    id: 'int-9',
    profileId: 'p9',
    direction: 'outgoing',
    status: 'pending',
    createdAt: daysAgo(1),
    note: 'Your interest is waiting for Nikhil’s response.',
  },
]
