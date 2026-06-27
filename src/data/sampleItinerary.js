/**
 * Sample itinerary data matching the JSON schema from llm-architecture-proposal.md.
 * Used for development/demo until the AI engine is connected.
 * 
 * Schema:
 * {
 *   title: string,
 *   days: [{ day_number, theme, items: [{ name, description, category, latitude, longitude, estimated_cost, booking_url, time_slot }] }],
 *   total_estimated_cost: number,
 *   notes: string
 * }
 */
const sampleItinerary = {
  title: 'Brooklyn Discovery Day',
  days: [
    {
      day_number: 1,
      theme: 'Downtown Brooklyn & DUMBO',
      items: [
        {
          name: 'Brooklyn Bridge Walk',
          description:
            'Start your day with an iconic sunrise walk across the Brooklyn Bridge. The Manhattan skyline views are unmatched, and you\'ll beat the crowds.',
          category: 'landmark',
          latitude: 40.7061,
          longitude: -73.9969,
          estimated_cost: 0,
          booking_url: null,
          time_slot: 'morning',
          duration: '1 hr',
          rating: 4.8,
          image: null,
          tags: ['Free', 'Must See'],
          address: 'Brooklyn Bridge, New York, NY 10038',
          hours: 'Open 24 hours',
          tip: 'Go early (before 8am) to avoid crowds and get the best photos.',
        },
        {
          name: 'DUMBO Food Tour',
          description:
            'Explore the cobblestone streets of DUMBO while sampling artisan cheeses, fresh-baked bread, and craft chocolates from local purveyors.',
          category: 'entertainment',
          latitude: 40.7033,
          longitude: -73.9893,
          estimated_cost: 45,
          booking_url: 'https://example.com/book/dumbo-food-tour',
          time_slot: 'morning',
          duration: '2 hrs',
          rating: 4.9,
          image: null,
          tags: ['Popular', 'Foodie'],
          address: 'DUMBO, Brooklyn, NY 11201',
          hours: 'Tours at 10am & 1pm daily',
          tip: 'Come hungry — there are 6 tasting stops!',
        },
        {
          name: "Juliana's Pizza",
          description:
            'Famous for their coal-fired brick oven pies since 2012. The original location from the Patsy Grimaldi family. A Brooklyn institution.',
          category: 'restaurant',
          latitude: 40.7022,
          longitude: -73.9897,
          estimated_cost: 25,
          booking_url: 'https://example.com/book/julianas',
          time_slot: 'afternoon',
          duration: '1.5 hrs',
          rating: 4.7,
          image: null,
          tags: ['Must Try', 'Local Favorite'],
          address: '19 Old Fulton Street, Brooklyn, NY 11201',
          hours: 'Mon-Sun 11:30am-10pm',
          tip: 'Go on a weekday to avoid long lines. The Margherita is their signature.',
        },
        {
          name: 'Brooklyn Botanic Garden',
          description:
            'Stroll through 52 acres of stunning gardens including the Japanese Garden, Rose Garden, and the renowned Cherry Esplanade.',
          category: 'outdoor',
          latitude: 40.6694,
          longitude: -73.9635,
          estimated_cost: 18,
          booking_url: 'https://example.com/book/bbg',
          time_slot: 'afternoon',
          duration: '2 hrs',
          rating: 4.6,
          image: null,
          tags: ['Nature', 'Family Friendly'],
          address: '990 Washington Avenue, Brooklyn, NY 11225',
          hours: 'Tue-Sun 10am-6pm (Closed Mon)',
          tip: 'Free admission on Fridays! Check their seasonal event calendar.',
        },
        {
          name: 'Brooklyn Bridge Park Sunset',
          description:
            'End your day at the waterfront park with panoramic views of the Manhattan skyline, Statue of Liberty, and sunset over the harbor.',
          category: 'outdoor',
          latitude: 40.7002,
          longitude: -73.9962,
          estimated_cost: 0,
          booking_url: null,
          time_slot: 'evening',
          duration: '1 hr',
          rating: 4.9,
          image: null,
          tags: ['Free', 'Romantic', '🌅 Sunset'],
          address: '334 Furman Street, Brooklyn, NY 11201',
          hours: '6am-1am daily',
          tip: 'Grab dinner from a nearby food truck and watch the sunset from Pier 1.',
        },
      ],
    },
  ],
  total_estimated_cost: 88,
  notes:
    'Pro tip: This route flows naturally from north to south — start at the bridge and end at the park. The whole day is easily walkable or short subway rides.',
}

export default sampleItinerary
