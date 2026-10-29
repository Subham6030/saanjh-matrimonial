function minutesAgo(minutes) {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString()
}

export const seedConversationData = [
  {
    id: 'conv-p1',
    profileId: 'p1',
    unread: 1,
    messages: [
      {
        id: 'm-101',
        sender: 'them',
        text: 'Hi Aanya — your profile made me smile. The chai line is extremely relatable.',
        at: minutesAgo(186),
      },
      {
        id: 'm-102',
        sender: 'me',
        text: 'That line is 100% true. I have burned many a saucepan in pursuit of the perfect cup.',
        at: minutesAgo(171),
      },
      {
        id: 'm-103',
        sender: 'them',
        text: 'A shared hazard, then. I noticed you also like photography. Film or digital?',
        at: minutesAgo(152),
      },
      {
        id: 'm-104',
        sender: 'me',
        text: 'Mostly film, though my phone does most of the actual work these days.',
        at: minutesAgo(61),
      },
      {
        id: 'm-105',
        sender: 'them',
        text: 'That sounds about right. I would love to hear about your favourite photo walks sometime.',
        at: minutesAgo(28),
      },
    ],
  },
  {
    id: 'conv-p3',
    profileId: 'p3',
    unread: 0,
    messages: [
      {
        id: 'm-201',
        sender: 'me',
        text: 'Hi Arjun — your profile mentions complicated recipes. What is the most ambitious thing you have cooked lately?',
        at: minutesAgo(1440),
      },
      {
        id: 'm-202',
        sender: 'them',
        text: 'A slow-cooked Kerala fish curry for eight people. It went surprisingly well, which means I will probably never repeat it.',
        at: minutesAgo(1380),
      },
      {
        id: 'm-203',
        sender: 'me',
        text: 'That is the correct approach to success. I made a lemon tart last weekend that collapsed beautifully.',
        at: minutesAgo(1210),
      },
      {
        id: 'm-204',
        sender: 'them',
        text: 'A collapsed tart is still a tart. I respect the effort. How did the family feel about it?',
        at: minutesAgo(1170),
      },
      {
        id: 'm-205',
        sender: 'me',
        text: 'They ate it in about ten minutes and asked for another. Tough critics.',
        at: minutesAgo(1155),
      },
    ],
  },
  {
    id: 'conv-p6',
    profileId: 'p6',
    unread: 0,
    messages: [
      {
        id: 'm-301',
        sender: 'them',
        text: 'Hello Aanya, thank you for accepting the interest. I saw that you enjoy trekking — any favourite trails?',
        at: minutesAgo(2880),
      },
      {
        id: 'm-302',
        sender: 'me',
        text: 'Hi Vikram! I am a beginner, honestly. I did a lovely weekend trail near Lonavala last winter.',
        at: minutesAgo(2790),
      },
      {
        id: 'm-303',
        sender: 'them',
        text: 'That is a good place to start. I am trying to get back into trail running before the weather turns.',
        at: minutesAgo(2700),
      },
      {
        id: 'm-304',
        sender: 'me',
        text: 'Trail running sounds heroic. I will stick to walking and taking photographs of everyone else running.',
        at: minutesAgo(2650),
      },
    ],
  },
]

export const demoReplies = [
  'That sounds lovely — tell me more.',
  'I was just thinking about that too. Small world.',
  'I appreciate you saying that. How has your week been so far?',
  'That is a very good question. Let me think and get back to you properly.',
  'I would like that. Coffee and a long conversation sounds ideal.',
  'Honestly, same. I am glad it is not just me.',
]
