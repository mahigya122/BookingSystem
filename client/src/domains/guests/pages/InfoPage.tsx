import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Mountain, Shield, Info, HelpCircle, FileText, Phone, Briefcase, BookOpen, Cookie } from "lucide-react";
import { useEffect } from "react";

const INFO_CONTENT: Record<string, { title: string, subtitle: string, icon: any, content: string[] }> = {
    "about": {
        title: "Our Story",
        subtitle: "Redefining the art of nature escapes since 2024.",
        icon: Info,
        content: [
            "CabinHub was born from a simple yet profound desire: to reconnect people with the raw, unfiltered beauty of nature without compromising on the elegance of modern living.",
            "What started as a collection of three forest hideaways has grown into a curated portfolio of over 500 premium cabins across the globe. Each property is handpicked for its architectural integrity, environmental harmony, and 'soul'.",
            "We believe that true luxury isn't about excess; it's about the space to breathe, the time to reflect, and the opportunity to create memories that outlast the stay."
        ]
    },
    "help-center": {
        title: "Help Center",
        subtitle: "Everything you need to know for a seamless stay.",
        icon: HelpCircle,
        content: [
            "Welcome to the CabinHub Help Center. We are dedicated to ensuring your experience is as serene as our locations.",
            "From technical booking assistance to local destination guides, our resources are designed to provide immediate clarity.",
            "If you can't find what you're looking for, our concierge team is available 24/7 to assist with your specific needs."
        ]
    },
    "faqs": {
        title: "Frequently Asked Questions",
        subtitle: "Quick answers to common inquiries.",
        icon: HelpCircle,
        content: [
            "How do I book? Select your dates, cabin, and guests, then follow our 3-step secure checkout process.",
            "What is the cancellation policy? Most cabins offer a full refund up to 7 days before check-in. Specific policies are listed on each cabin page.",
            "Are pets allowed? Many of our forest cabins are pet-friendly. Look for the 'Pet Friendly' tag in the filters."
        ]
    },
    "privacy": {
        title: "Privacy Policy",
        subtitle: "Your trust is our most valuable asset.",
        icon: Shield,
        content: [
            "At CabinHub, we take your privacy as seriously as your comfort. This policy outlines how we protect and manage your data.",
            "We only collect information essential to providing our services, such as booking details and communication preferences.",
            "We never sell your data to third parties. Your information is encrypted and stored in secure, world-class data centers."
        ]
    },
    "terms": {
        title: "Terms of Service",
        subtitle: "The foundation of our community.",
        icon: FileText,
        content: [
            "By using CabinHub, you agree to respect the natural environments and local communities that host our cabins.",
            "Our terms ensure a fair and transparent relationship between guests, hosts, and our platform.",
            "Please review our guest conduct guidelines and booking conditions to ensure a harmonious experience for everyone."
        ]
    },
    "contact": {
        title: "Contact Us",
        subtitle: "We're here to listen and assist.",
        icon: Phone,
        content: [
            "Have a question or need specialized assistance? Our team of travel curators is ready to help.",
            "Email: concierge@cabinhub.com | Phone: +1 (800) 555-CABIN",
            "Our physical headquarters is nestled in the Cascade Mountains, but our heart is wherever you choose to escape."
        ]
    },
    "careers": {
        title: "Join the Team",
        subtitle: "Help us build the future of travel.",
        icon: Briefcase,
        content: [
            "We're looking for passionate individuals who love nature and believe in the power of great design.",
            "From engineers to hospitality experts, we offer remote-first roles with regular team retreats in our finest cabins.",
            "Check back soon for specific openings or send your resume to talent@cabinhub.com."
        ]
    },
    "blog": {
        title: "Cabin Journal",
        subtitle: "Stories, tips, and inspiration from the wild.",
        icon: BookOpen,
        content: [
            "The Cabin Journal is your source for travel inspiration and local secrets.",
            "Discover the best hiking trails in the Alps, the perfect winter cabin recipes, and interviews with our most inspiring hosts.",
            "New stories published every Tuesday. Stay tuned for the next adventure."
        ]
    },
    "cookies": {
        title: "Cookie Policy",
        subtitle: "Enhancing your digital journey.",
        icon: Cookie,
        content: [
            "We use cookies to remember your preferences and provide a more personalized browsing experience.",
            "You can manage your cookie settings at any time through your browser preferences.",
            "We only use essential and performance-enhancing cookies to make our platform faster and more intuitive."
        ]
    }
};

const InfoPage = () => {
    const { slug } = useParams();
    const data = slug ? INFO_CONTENT[slug] : null;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!data) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center p-10 bg-transparent">
                <Mountain className="h-16 w-16 text-sky-500 mb-6" />
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Page Not Found</h1>
                <Link to="/" className="mt-6 text-sky-500 font-bold flex items-center gap-2">
                    <ArrowLeft size={20} /> Back to Home
                </Link>
            </div>
        );
    }

    const Icon = data.icon;

    return (
        <div className="flex-grow bg-white dark:bg-slate-950">
            {/* HERO SECTION */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-slate-950">
                <div className="absolute inset-0 opacity-40">
                    <img
                        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80"
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                </div>

                <div className="relative z-10 text-center space-y-6 max-w-4xl px-6">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500 shadow-2xl shadow-sky-500/40 mb-2">
                        <Icon className="h-8 w-8 text-white" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tight">
                        {data.title}
                    </h1>
                    <p className="text-lg md:text-2xl text-sky-400 font-bold italic" style={{ fontFamily: "'Dancing Script', cursive" }}>
                        {data.subtitle}
                    </p>
                </div>

                {/* BACK BUTTON */}
                <Link
                    to="/"
                    className="absolute top-10 left-10 z-20 flex items-center gap-2 text-white/70 hover:text-white font-black text-xs uppercase tracking-widest transition-colors group"
                >
                    <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-slate-950 transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    <span>Back to Home</span>
                </Link>
            </section>

            {/* CONTENT SECTION */}
            <section className="max-w-4xl mx-auto px-6 py-24 space-y-12">
                {data.content.map((para, i) => (
                    <p key={i} className="text-xl md:text-2xl leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
                        {para}
                    </p>
                ))}
            </section>
        </div>
    );
};

export default InfoPage;
