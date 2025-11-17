import Image from "next/image";

import { urlFor } from "@/lib/sanity/client";
import type { Author } from "@/lib/sanity/zod";

type AuthorBioProps = {
  author: Author;
  className?: string;
};

export function AuthorBio({ author, className }: AuthorBioProps) {
  const avatar = author.photo
    ? urlFor(author.photo)?.width(200).height(200).fit("crop").url()
    : undefined;

  return (
    <div
      className={`flex items-center gap-4 rounded-lg border p-4 ${className ?? ""}`}
    >
      {avatar ? (
        <Image
          src={avatar}
          alt={author.name}
          width={64}
          height={64}
          className="h-16 w-16 rounded-full object-cover"
        />
      ) : (
        <div className="bg-muted h-16 w-16 rounded-full" />
      )}
      <div>
        <h4 className="text-lg font-semibold">{author.name}</h4>
        {author.bio && (
          <p className="text-muted-foreground text-sm">{author.bio}</p>
        )}
      </div>
    </div>
  );
}
