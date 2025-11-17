export type TocHeading = {
  id: string;
  text: string;
  level: number;
};

type TableOfContentsProps = {
  headings: TocHeading[];
  className?: string;
};

export function TableOfContents({ headings, className }: TableOfContentsProps) {
  if (!headings?.length) return null;

  return (
    <div className={className}>
      <p className="text-muted-foreground text-xs font-semibold uppercase">
        On this page
      </p>
      <ul className="mt-3 space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
          >
            <a
              href={`#${heading.id}`}
              className="text-muted-foreground hover:text-foreground"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
