import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Mountain } from "lucide-react";
import { layoutConfig, pageSpacing } from "@shared/utils/spacing";
import { BLOG_POSTS, getPostBySlug, type BlogPost } from "./blogPosts";
import BlogPostPageSkeleton from "../component/BlogPostPageSkeleton";
import { useSimulatedLoad } from "./useSimulatedLoad";

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
  const isLoading = useSimulatedLoad();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) return <BlogPostPageSkeleton />;

  if (!post) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-10">
        <Mountain className="h-16 w-16 text-sky-500 mb-6" />
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Story Not Found
        </h1>
        <Link
          to="/blog"
          className="mt-6 text-sky-500 font-bold flex items-center gap-2 text-sm"
        >
          <ArrowLeft size={18} /> Back to Journal
        </Link>
      </div>
    );
  }

  const more = BLOG_POSTS.filter(
    (p: BlogPost) => p.slug !== post.slug && p.category === post.category,
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
          className="absolute top-6 left-4 md:left-6 z-20 flex items-center gap-2 text-white/60 hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors"
        >
          <ArrowLeft size={14} /> Back to Journal
        </Link>

        <div
          className={`relative z-10 ${layoutConfig.container} pb-12 space-y-3 max-w-3xl`}
        >
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${CATEGORY_STYLES[post.category]}`}
          >
            {post.category}
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-xs font-bold text-white/70">
            <span>{post.author}</span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span>{formatDate(post.date)}</span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span className="flex items-center gap-1">
              <Clock size={13} /> {post.readMinutes} min read
            </span>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className={`${pageSpacing.section} w-full`}>
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          {post.body.map((para: string, i: number) => (
            <p
              key={i}
              className="text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-400 font-medium"
            >
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* MORE FROM THIS CATEGORY */}
      {more.length > 0 && (
        <section className={`${pageSpacing.section} pt-0 w-full`}>
          <div className={layoutConfig.container}>
            <h2 className="text-lg font-black text-slate-900 dark:text-white mb-8">
              More in {post.category}
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {more.map((p: BlogPost) => (
                <Link
                  key={p.slug}
                  to={`/blog/${p.slug}`}
                  className="group rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={p.image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-black text-sm text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors">
                      {p.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPostPage;
