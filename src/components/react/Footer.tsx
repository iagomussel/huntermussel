const Footer = () => {
  return (
    <footer className="border-t border-border py-8" role="contentinfo">
      <div className="container flex flex-col gap-5 px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="font-heading text-sm text-muted-foreground">
            © 2025 <span className="text-foreground">HunterMussel</span>. All rights reserved.
          </span>
          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground"
          >
            <a href="/" className="transition-colors hover:text-primary">Home</a>
            <a href="/services" className="transition-colors hover:text-primary">Services</a>
            <a href="/cases" className="transition-colors hover:text-primary">Case Studies</a>
            <a href="/blog" className="transition-colors hover:text-primary">Blog</a>
            <a href="/tools" className="transition-colors hover:text-primary">Tools</a>
            <a href="/#contact" className="transition-colors hover:text-primary">Contact</a>
          </nav>
        </div>
        <span className="text-center font-body text-xs text-muted-foreground sm:text-left">
          Made with 💚 by Iago Mussel
        </span>
      </div>
    </footer>
  );
};

export default Footer;
