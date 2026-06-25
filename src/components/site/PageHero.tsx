import { Link } from "@tanstack/react-router";

interface Props {
  title: string;
  eyebrow?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  align?: "left" | "center";
}

export function PageHero({ title, eyebrow, description, image, imageAlt = "", align = "center" }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
      {image && (
        <img
          src={image}
          alt={imageAlt}
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-hero-overlay" />
      <div className={`container-x py-20 sm:py-24 ${align === "center" ? "text-center" : ""}`}>
        {eyebrow && (
          <p className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl lg:text-[3.25rem]">
          {title}
        </h1>
        {description && (
          <p className={`mt-5 text-base text-primary-foreground/85 sm:text-lg ${align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
            {description}
          </p>
        )}
      </div>
      <BreadCrumb />
    </section>
  );
}

function BreadCrumb() {
  return (
    <div className="border-t border-white/10 bg-primary-dark/40">
      <div className="container-x py-3 text-xs text-primary-foreground/80">
        <Link to="/" className="hover:text-gold">Home</Link>
        <span className="mx-2 text-primary-foreground/40">/</span>
        <span className="text-gold">Current page</span>
      </div>
    </div>
  );
}
