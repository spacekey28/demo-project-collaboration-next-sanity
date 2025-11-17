import {
  PortableText,
  type PortableTextReactComponents,
} from "@portabletext/react";
import Image from "next/image";
import type { PortableTextBlock, PortableTextObject } from "sanity";

import { urlFor } from "@/lib/sanity/client";

type PortableTextValue = Array<PortableTextBlock | PortableTextObject>;

type PortableTextRendererProps = {
  value: PortableTextValue;
};

const components: PortableTextReactComponents = {
  types: {
    image: ({ value }) => {
      const src = value ? urlFor(value)?.width(1200).fit("max").url() : null;
      if (!src) return null;
      return (
        <div className="my-6 overflow-hidden rounded-lg">
          <Image
            src={src}
            alt={value?.alt || ""}
            width={1200}
            height={800}
            className="h-auto w-full"
          />
        </div>
      );
    },
    code: ({ value }) => (
      <pre className="bg-muted text-muted-foreground my-4 overflow-x-auto rounded-lg p-4 text-sm">
        <code>{value.code}</code>
      </pre>
    ),
  },
  block: {
    h2: ({ children }) => <h2 className="text-2xl font-bold">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-semibold">{children}</h3>,
    normal: ({ children }) => <p className="leading-relaxed">{children}</p>,
  },
  marks: {
    link: ({ value, children }) => (
      <a
        href={value?.href}
        className="text-primary underline hover:no-underline"
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc space-y-2 pl-5">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal space-y-2 pl-5">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  hardBreak: () => <br />,
  unknownType: ({ value }) => (
    <pre className="bg-muted text-muted-foreground rounded p-4 text-xs">
      {JSON.stringify(value, null, 2)}
    </pre>
  ),
  unknownMark: ({ children }) => <span>{children}</span>,
  unknownBlockStyle: ({ children }) => <p>{children}</p>,
  unknownList: ({ children }) => <ul>{children}</ul>,
  unknownListItem: ({ children }) => <li>{children}</li>,
};

export function PortableTextRenderer({ value }: PortableTextRendererProps) {
  if (!value?.length) {
    return null;
  }
  const typedValue = value as PortableTextBlock[];
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <PortableText value={typedValue} components={components} />
    </div>
  );
}
