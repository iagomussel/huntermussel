import React from "react";
import { Copy, Mail } from "lucide-react";

type Props = {
  title: string;
  url: string;
};

type ShareLink = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

function BrandIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      width={14}
      height={14}
      className="h-3.5 w-3.5 object-contain"
      loading="lazy"
    />
  );
}

export default function BlogShareSection({ title, url }: Props) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const shareText = encodeURIComponent(`${title} ${url}`);

  const shareLinks: ShareLink[] = [
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <BrandIcon src="/img/logos/social/linkedin.svg" alt="LinkedIn" />,
    },
    {
      label: "Twitter",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <BrandIcon src="/img/logos/social/twitter.svg" alt="Twitter" />,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <BrandIcon src="/img/logos/social/facebook.svg" alt="Facebook" />,
    },
    {
      label: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${shareText}`,
      icon: <BrandIcon src="/img/logos/social/whatsapp.png" alt="WhatsApp" />,
    },
    {
      label: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <BrandIcon src="/img/logos/social/telegram.svg" alt="Telegram" />,
    },
    {
      label: "Reddit",
      href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      icon: <BrandIcon src="/img/logos/social/reddit.svg" alt="Reddit" />,
    },
    {
      label: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      icon: <Mail size={14} />,
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // no-op: keep UX simple even if clipboard API is unavailable
    }
  };

  return (
    <section className="mt-14 border-t border-border pt-8">
      <h2 className="font-heading text-xl font-semibold tracking-tight">Share</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {shareLinks.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card/50 px-3 py-1.5 font-body text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            {item.icon}
            {item.label}
          </a>
        ))}
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card/50 px-3 py-1.5 font-body text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Copy size={14} />
          Copy link
        </button>
      </div>
    </section>
  );
}
