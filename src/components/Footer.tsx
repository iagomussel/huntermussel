const Footer = () => {
  return (
    <footer className="border-t border-border py-8" role="contentinfo">
      <div className="container flex flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <span className="font-heading text-sm text-muted-foreground">
          © 2025 <span className="text-foreground">HunterMussel</span>. Todos os direitos reservados.
        </span>
        <span className="font-body text-xs text-muted-foreground">
          Feito com 💚 por Iago Mussel
        </span>
      </div>
    </footer>
  );
};

export default Footer;
