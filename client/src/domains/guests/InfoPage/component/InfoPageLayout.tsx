import type { ReactNode } from "react";
import { layoutConfig, pageSpacing } from "@shared/utils/spacing";
import PageHero from "./PageHero";

interface InfoPageLayoutProps {
  label: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const InfoPageLayout = ({
  label,
  title,
  subtitle,
  children,
}: InfoPageLayoutProps) => (
  <div className="flex-grow bg-white dark:bg-slate-950">
    <PageHero label={label} title={title} subtitle={subtitle} />

    <section className={`${pageSpacing.section} w-full`}>
      <div className={`${layoutConfig.container} max-w-2xl mx-auto space-y-6`}>
        {children}
      </div>
    </section>
  </div>
);

export default InfoPageLayout;

/** Shared paragraph style so every static page reads at the same size/weight. */
export const InfoParagraph = ({ children }: { children: ReactNode }) => (
  <p className="text-sm md:text-base leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
    {children}
  </p>
);
