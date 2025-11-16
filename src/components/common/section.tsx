import { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type SectionProps = {
  className?: string;
  containerClassName?: string;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
};

export function Section({
  className,
  containerClassName,
  title,
  description,
  children,
}: SectionProps) {
  return (
    <section className={cn("w-full py-12 md:py-16", className)}>
      <div className={cn("container", containerClassName)}>
        {(title || description) && (
          <header className="mb-6 text-center md:mb-10">
            {title && (
              <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
            )}
            {description && (
              <p className="text-muted-foreground mx-auto mt-2 max-w-2xl md:mt-3">
                {description}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
