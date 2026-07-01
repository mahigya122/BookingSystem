import { lazy } from "react";

export const ClientDashboard = lazy(
  () => import("../domains/cabins/explore/ClientDashboard"),
);
export const ClientProfile = lazy(
  () => import("../domains/guests/ClientProfile"),
);
export const Login = lazy(() => import("./LoginWrapper"));
export const CabinDetails = lazy(
  () => import("../domains/cabins/details/CabinDetails"),
);
export const MyBookings = lazy(() => import("../domains/bookings/MyBookings"));
export const PaymentSuccess = lazy(
  () => import("../domains/payments/PaymentSuccess"),
);
export const PaymentFailure = lazy(
  () => import("../domains/payments/PaymentFailure"),
);

// InfoPage removed — replaced by the split-out pages below

export const AboutPage = lazy(
  () => import("../domains/guests/InfoPage/data/AboutPage"),
);
export const HelpCenterPage = lazy(
  () => import("../domains/guests/InfoPage/data/HelpCenterPage"),
);
export const FAQsPage = lazy(
  () => import("../domains/guests/InfoPage/data/FAQsPage"),
);
export const PrivacyPage = lazy(
  () => import("../domains/guests/InfoPage/data/PrivacyPage"),
);
export const TermsPage = lazy(
  () => import("../domains/guests/InfoPage/data/TermsPage"),
);
export const ContactPage = lazy(
  () => import("../domains/guests/InfoPage/data/ContactPage"),
);
export const CareersPage = lazy(
  () => import("../domains/guests/InfoPage/data/CareersPage"),
);
export const CookiesPage = lazy(
  () => import("../domains/guests/InfoPage/data/CookiesPage"),
);
export const BlogPage = lazy(
  () => import("../domains/guests/InfoPage/data/BlogPage"),
);
export const BlogPostPage = lazy(
  () => import("../domains/guests/InfoPage/data/BlogPostPage"),
);
export const LegacyInfoRedirect = lazy(
  () => import("../domains/guests/InfoPage/data/LegacyInfoRedirect"),
);

export const GuestMessages = lazy(
  () => import("../domains/guests/GuestsMessageindex"),
);
