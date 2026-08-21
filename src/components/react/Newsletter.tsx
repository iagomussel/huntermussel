import { useEffect, useRef, useState } from "react";
import { X, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const POPUP_SEEN_COOKIE = "nl_popup_seen";
const BAR_DISMISSED_COOKIE = "nl_bar_dismissed";

function hasCookie(name: string): boolean {
  return document.cookie.split("; ").some((c) => c.startsWith(`${name}=`));
}

function setCookie(name: string, days: number) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=1; expires=${expires}; path=/; SameSite=Lax`;
}

type Status = "idle" | "loading" | "success" | "error";

function useSubscribe(source: string) {
  const [status, setStatus] = useState<Status>("idle");

  async function subscribe(email: string) {
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      if (!res.ok) throw new Error("subscribe failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return { status, subscribe };
}

function SubscribeForm({ source, onSuccess }: { source: string; onSuccess?: () => void }) {
  const [email, setEmail] = useState("");
  const { status, subscribe } = useSubscribe(source);

  useEffect(() => {
    if (status === "success") onSuccess?.();
  }, [status, onSuccess]);

  if (status === "success") {
    return <p className="font-body text-sm text-primary">You're in. Check your inbox to confirm.</p>;
  }

  return (
    <form
      className="flex w-full max-w-md items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (email.trim()) subscribe(email.trim());
      }}
    >
      <Input
        type="email"
        required
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-9 bg-background"
        aria-label="Email address"
      />
      <Button type="submit" size="sm" disabled={status === "loading"}>
        {status === "loading" ? "Joining..." : "Subscribe"}
      </Button>
      {status === "error" && <span className="sr-only" role="alert">Something went wrong, try again.</span>}
    </form>
  );
}

export function NewsletterBar() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (!hasCookie(BAR_DISMISSED_COOKIE)) setDismissed(false);
  }, []);

  if (dismissed) return null;

  function dismiss() {
    setCookie(BAR_DISMISSED_COOKIE, 30);
    setDismissed(true);
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur">
      <div className="container flex flex-col items-center justify-center gap-3 px-6 py-3 sm:flex-row">
        <div className="flex items-center gap-2 font-heading text-sm">
          <Mail size={16} className="text-primary" />
          Get new articles and tools in your inbox.
        </div>
        <SubscribeForm source="bar" />
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute right-3 top-3 text-muted-foreground transition-colors hover:text-foreground sm:static"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (hasCookie(POPUP_SEEN_COOKIE)) return;

    function onMouseLeave(e: MouseEvent) {
      if (triggeredRef.current) return;
      if (e.clientY > 0) return;
      triggeredRef.current = true;
      setCookie(POPUP_SEEN_COOKIE, 90);
      setOpen(true);
      document.removeEventListener("mouseout", onMouseLeave);
    }

    document.addEventListener("mouseout", onMouseLeave);
    return () => document.removeEventListener("mouseout", onMouseLeave);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Newsletter signup"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X size={18} />
        </button>
        <h2 className="mb-2 font-heading text-xl font-bold">Before you go</h2>
        <p className="mb-4 font-body text-sm text-muted-foreground">
          Get new articles on AI automation, DevOps, and cloud infrastructure straight to your inbox. No spam.
        </p>
        <SubscribeForm source="exit_intent_popup" onSuccess={() => setTimeout(() => setOpen(false), 1500)} />
      </div>
    </div>
  );
}

export default function Newsletter() {
  return (
    <>
      <NewsletterBar />
      <NewsletterPopup />
    </>
  );
}
