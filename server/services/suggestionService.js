const adminPools = [
  [
    "How many guests checked in today?",
    "Show today's bookings",
    "List guests with active bookings",
  ],
  [
    "Show all cancelled bookings",
    "Who is arriving today?",
    "How many cabins are occupied?",
  ],
  [
    "Show latest guests",
    "Which guest stayed the longest?",
    "Show bookings with breakfast",
  ],
];

const guestPools = [
  [
    "Which cabins are available?",
    "Do you offer discounts?",
    "What is your best luxury cabin?",
  ],
  [
    "How many people can fit in a cabin?",
    "Are there any cabins for 4 people?",
    "Show me the cheapest cabin available",
  ],
  [
    "Tell me about your luxury suites",
    "Do you have any cabins with a view?",
    "What is the price per night for the most expensive cabin?",
  ],
];

export function getRandomSuggestions(role = "admin") {
  const pools = role === "guest" ? guestPools : adminPools;
  const randomIndex = Math.floor(Math.random() * pools.length);
  return pools[randomIndex];
}
