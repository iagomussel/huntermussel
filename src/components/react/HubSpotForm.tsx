import { useEffect, useRef } from "react";

interface HubSpotFormProps {
  portalId: string;
  formId: string;
  region?: string;
}

export default function HubSpotForm({ portalId, formId, region = "na1" }: HubSpotFormProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const injectedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || injectedRef.current) return;
    injectedRef.current = true;

    const scriptSrc = `https://js.hsforms.net/forms/embed/${portalId}.js`;
    const existing = document.querySelector(`script[src="${scriptSrc}"]`);

    if (!existing) {
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, [portalId, formId, region]);

  return (
    <div
      ref={containerRef}
      className="hs-form-frame min-h-[320px]"
      data-region={region}
      data-form-id={formId}
      data-portal-id={portalId}
    />
  );
}
