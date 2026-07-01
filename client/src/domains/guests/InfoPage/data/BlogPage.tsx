import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Clock } from "lucide-react";
import { layoutConfig, pageSpacing } from "@shared/utils/spacing";
import { BLOG_POSTS, CATEGORIES, type BlogPost } from "./blogPosts";
import PageHero from "../component/PageHero";
import BlogPageSkeleton from "../component/BlogPageSkeleton";
import { useSimulatedLoad } from "./useSimulatedLoad";

type Category = (typeof CATEGORIES)[number];

const CATEGORY_STYLES: Record<BlogPost["category"], string> = {
  Destinations: "bg-sky-500 text-white",
  Design: "bg-amber-600 text-white",
  Hosts: "bg-emerald-600 text-white",
  Guides: "bg-violet-600 text-white",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const CategoryPill = ({ category }: { category: BlogPost["category"] }) => (
  <span
    className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${CATEGORY_STYLES[category]}`}
  >
    {category}
  </span>
);

const PostCard = ({ post }: { post: BlogPost }) => (
  <Link
    to={`/blog/${post.slug}`}
    className="group flex flex-col rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-slate-900"
  >
    <div className="relative aspect-[4/3] overflow-hidden">
      <img
        src={post.image}
        alt=""
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute top-4 left-4">
        <CategoryPill category={post.category} />
      </div>
    </div>
    <div className="flex flex-col flex-grow p-6 space-y-3">
      <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug group-hover:text-sky-500 transition-colors">
        {post.title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-3">
        {post.excerpt}
      </p>
      <div className="flex-grow" />
      <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-2">
        <span>{formatDate(post.date)}</span>
        <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
        <span className="flex items-center gap-1">
          <Clock size={11} /> {post.readMinutes} min read
        </span>
      </div>
    </div>
  </Link>
);

const BlogPage = () => {
  const isLoading = useSimulatedLoad();
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const featured =
    BLOG_POSTS.find((p: BlogPost) => p.featured) ?? BLOG_POSTS[0];

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((p: BlogPost) => p.slug !== featured.slug).filter(
      (p: BlogPost) =>
        activeCategory === "All" || p.category === activeCategory,
    );
  }, [activeCategory, featured.slug]);

  if (isLoading) return <BlogPageSkeleton />;

  return (
    <div className="flex-grow bg-white dark:bg-slate-950">
      <PageHero
        label="The Cabin Journal"
        title="Stories from the wild."
        subtitle="Trails, hosts, and the design of a good escape."
      />

      {/* FEATURED STORY */}
      <section className={`${pageSpacing.section} pb-0 w-full`}>
        <div className={layoutConfig.container}>
          <Link
            to={`/blog/${featured.slug}`}
            className="group grid md:grid-cols-2 gap-0 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 relative"
          >
            <div className="relative aspect-[16/11] md:aspect-auto overflow-hidden">
              <img
                src={featured.image}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-6 -left-2 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-r-full shadow-lg">
                {formatDate(featured.date)}
              </div>
            </div>
            <div className="flex flex-col justify-center gap-4 p-8 md:p-12 bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <CategoryPill category={featured.category} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Featured Story
                </span>
              </div>
              <h2 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-sky-500 transition-colors">
                {featured.title}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                <span>{featured.author}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span className="flex items-center gap-1">
                  <Clock size={13} /> {featured.readMinutes} min read
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-sky-500 font-black text-xs uppercase tracking-widest">
                Read the story
                <ArrowUpRight
                  size={15}
                  className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* CATEGORY FILTER */}
      <section
        className={`${layoutConfig.container} flex flex-wrap gap-3 pt-8 pb-2`}
      >
        {CATEGORIES.map((cat: Category) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-colors ${
              activeCategory === cat
                ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* GRID */}
      <section className={`${pageSpacing.section} w-full`}>
        <div className={layoutConfig.container}>
          {filteredPosts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredPosts.map((post: BlogPost) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 text-slate-400 font-bold text-sm">
              No stories in this category yet — check back soon.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
