export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    body: string[];
    category: "Destinations" | "Design" | "Hosts" | "Guides";
    image: string;
    author: string;
    date: string; // ISO
    readMinutes: number;
    featured?: boolean;
}

export const BLOG_POSTS: BlogPost[] = [
    {
        slug: "alpine-trails-worth-the-detour",
        title: "Five Alpine Trails Worth the Detour",
        excerpt:
            "From glacier-carved valleys to ridge walks with views into three countries, these are the hikes our hosts send guests to first.",
        body: [
            "Every cabin on CabinHub sits within reach of a trailhead our hosts actually use themselves — not the one nearest the parking lot, but the one they'd take a visiting friend on.",
            "We asked five of our longest-standing Alpine hosts for their personal favorite, and the results range from a gentle two-hour valley walk to a full-day ridge traverse with views into three countries.",
            "Pack layers, start early, and let the cabin do the recovering afterward.",
        ],
        category: "Destinations",
        image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&q=80",
        author: "Elena Voss",
        date: "2026-06-24",
        readMinutes: 6,
        featured: true,
    },
    {
        slug: "anatomy-of-a-cabin-that-feels-like-home",
        title: "The Anatomy of a Cabin That Feels Like Home",
        excerpt:
            "It's rarely the size of the place. We broke down what our top-rated cabins have in common, from window placement to the smell at the door.",
        body: [
            "After curating hundreds of properties, a pattern emerges among the ones guests rave about — and it's almost never square footage.",
            "Good cabins share a handful of quiet decisions: south-facing glass that tracks the sun, a threshold that transitions slowly from outdoors to in, and materials chosen to age rather than wear out.",
            "We walked through four of our highest-rated stays with their architects to find the common thread.",
        ],
        category: "Design",
        image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200&q=80",
        author: "Marcus Webb",
        date: "2026-06-18",
        readMinutes: 8,
    },
    {
        slug: "meet-the-hosts-of-birch-hollow",
        title: "Meet the Hosts of Birch Hollow",
        excerpt:
            "A husband-and-wife team spent three winters restoring a 1970s A-frame by hand. Here's what they learned about hospitality along the way.",
        body: [
            "When Priya and Tom Okafor bought their A-frame, it had been empty for a decade. What followed was three winters of restoration, most of it done by hand.",
            "We sat down with them to talk about what changed when the cabin went from personal project to a place guests actually stay in.",
            "Their answer, in short: hospitality is a design decision, not an afterthought.",
        ],
        category: "Hosts",
        image: "https://images.unsplash.com/photo-1518602164578-cd0074062767?w=1200&q=80",
        author: "Elena Voss",
        date: "2026-06-10",
        readMinutes: 5,
    },
    {
        slug: "packing-for-a-shoulder-season-stay",
        title: "Packing for a Shoulder-Season Stay",
        excerpt:
            "Late autumn and early spring are our favorite windows to book — and the ones people are least prepared for. Here's the real packing list.",
        body: [
            "Shoulder season brings the emptiest trails and the best light, but the weather swings harder than most guests expect.",
            "We put together the packing list our concierge team actually gives out, built from years of 6 a.m. calls about surprise frost.",
            "Short version: bring the layer you think is excessive, and the boots you think are overkill.",
        ],
        category: "Guides",
        image: "https://images.unsplash.com/photo-1476611317561-60117649dd94?w=1200&q=80",
        author: "Jonah Reyes",
        date: "2026-05-29",
        readMinutes: 4,
    },
    {
        slug: "case-for-cooking-on-a-woodstove",
        title: "The Case for Cooking on a Woodstove",
        excerpt:
            "Slower, yes. But our most-loved cabin kitchens are built around cast iron and an open flame, not induction. Here's why guests keep asking for the recipe.",
        body: [
            "Modern conveniences are easy to add and hard to take away, which is why we were surprised how many of our top hosts deliberately left them out of the kitchen.",
            "A woodstove forces a different rhythm: slower prep, fewer dishes, and a dinner that's ready roughly when it's ready.",
            "We collected three simple recipes from hosts who swear by the method, starting with a one-pot venison stew that needs almost no attention.",
        ],
        category: "Guides",
        image: "https://images.unsplash.com/photo-1543826173-1ad81e75db85?w=1200&q=80",
        author: "Marcus Webb",
        date: "2026-05-14",
        readMinutes: 7,
    },
    {
        slug: "cabins-built-around-a-single-view",
        title: "Cabins Built Around a Single View",
        excerpt:
            "Some of our favorite properties were designed backward — from one window, out. A tour of six cabins that pick a view and commit to it.",
        body: [
            "Most architecture starts with a floor plan. A handful of the cabins on CabinHub started with a view and worked backward from there.",
            "The result is often a single oversized window, or a whole wall of glass, oriented toward one lake, one ridge, or one stand of trees.",
            "We toured six of these view-first properties to see how far the idea can go.",
        ],
        category: "Design",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80",
        author: "Elena Voss",
        date: "2026-04-30",
        readMinutes: 6,
    },
];

export const getPostBySlug = (slug: string) => BLOG_POSTS.find((p) => p.slug === slug);

export const CATEGORIES = ["All", "Destinations", "Design", "Hosts", "Guides"] as const;
