export const PATHS = {
    HOME: "/",

    ABOUT: "/about",
    HELP_CENTER: "/help-center",
    FAQS: "/faqs",
    PRIVACY: "/privacy",
    TERMS: "/terms",
    CONTACT: "/contact",
    CAREERS: "/careers",
    COOKIES: "/cookies",

    BLOG: "/blog",
    BLOG_POST: (slug: string) => `/blog/${slug}`,
} as const;


export const LEGACY_INFO_SLUG_MAP: Record<string, string> = {
    about: PATHS.ABOUT,
    "help-center": PATHS.HELP_CENTER,
    faqs: PATHS.FAQS,
    privacy: PATHS.PRIVACY,
    terms: PATHS.TERMS,
    contact: PATHS.CONTACT,
    careers: PATHS.CAREERS,
    cookies: PATHS.COOKIES,
    blog: PATHS.BLOG,
};