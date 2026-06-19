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
    "Which is the most 5-star rated cabin?",
    "Which cabin offers the most activities?",
    "Which cabin has free breakfast?",
  ],
  [
    "Which cabin is lowest in price?",
    "How do I book a cabin?",
    "Can Cabin 22 occupy 10 guests?",
  ],
  [
    "What is your best luxury cabin?",
    "Show me cabins with a mountain view.",
    "Do you offer any discounts for long stays?",
  ],
];

export function getRandomSuggestions(role = "admin") {
  const pools = role === "guest" ? guestPools : adminPools;
  const randomIndex = Math.floor(Math.random() * pools.length);
  return pools[randomIndex];
}
