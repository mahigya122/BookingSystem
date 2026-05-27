const questionPools = [
  [
    "How many guests checked in today?",
    "Show today's bookings",
    "Which cabins are available?",
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

  [
    "How many bookings were made today?",
    "Show premium cabins",
    "List guests with active bookings",
  ],
];

export function getRandomSuggestions() {
  const randomIndex = Math.floor(Math.random() * questionPools.length);

  return questionPools[randomIndex];
}