import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Mountain } from "lucide-react";
import { BLOG_POSTS, getPostBySlug, type BlogPost } from "./blogPosts";

const CATEGORY_STYLES: Record<BlogPost["category"], string> = {
  Destinations: "bg-sky-500 text-white",
  Design: "bg-amber-600 text-white",
  Hosts: "bg-emerald-600 text-white",
  Guides: "bg-violet-600 text-white",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = slug ? getPostBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-10 bg-transparent">
        <Mountain className="h-16 w-16 text-sky-500 mb-6" />
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Story Not Found
        </h1>
        <Link
          to="/blog"
          className="mt-6 text-sky-500 font-bold flex items-center gap-2"
        >
          <ArrowLeft size={20} /> Back to Journal
        </Link>
      </div>
    );
  }

  const more = BLOG_POSTS.filter(
    (p) => p.slug !== post.slug && p.category === post.category,
  ).slice(0, 3);

  return (
    <div className="flex-grow bg-white dark:bg-slate-950">
      {/* HERO */}
      <section className="relative h-[55vh] flex items-end overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <img
            src={post.image}
            alt=""
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
        </div>

        <Link
          to="/blog"
          className="absolute top-10 left-10 z-20 flex items-center gap-2 text-white/70 hover:text-white font-black text-xs uppercase tracking-widest transition-colors group"
        >
          <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-slate-950 transition-all">
            <ArrowLeft size={18} />
          </div>
          <span>Back to Journal</span>
        </Link>

        <div className="relative z-10 max-w-3xl mx-auto px-6 pb-16 space-y-4">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${CATEGORY_STYLES[post.category]}`}
          >
            {post.category}
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-sm font-bold text-white/70">
            <span>{post.author}</span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span>{formatDate(post.date)}</span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span className="flex items-center gap-1">
              <Clock size={14} /> {post.readMinutes} min read
            </span>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="max-w-3xl mx-auto px-6 py-20 space-y-8">
        {post.body.map((para, i) => (
          <p
            key={i}
            className="text-xl md:text-2xl leading-relaxed text-slate-600 dark:text-slate-400 font-medium"
          >
            {para}
          </p>
        ))}
      </section>

      {/* MORE FROM THIS CATEGORY */}
      {more.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8">
            More in {post.category}
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {more.map((p) => (
              <Link
                key={p.slug}
                to={`/blog/${p.slug}`}
                className="group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={p.image}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-black text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors">
                    {p.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPostPage;
