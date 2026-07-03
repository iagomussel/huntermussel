import { useEffect, useRef } from "react";

declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (config: {
          region: string;
          portalId: string;
          formId: string;
          target: string;
          css?: string;
          cssClass?: string;
          locale?: string;
          translations?: Record<string, Record<string, string>>;
        }) => void;
      };
    };
  }
}

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

    const existing = document.querySelector('script[src="//js.hsforms.net/forms/embed/v2.js"]');
    const createForm = () => {
      if (window.hbspt && containerRef.current) {
        window.hbspt.forms.create({
          region,
          portalId,
          formId,
          target: `#${containerRef.current.id}`,
          css: "",
          cssClass: "hubspot-form-wrapper",
          locale: "en",
        });
      }
    };

    if (!existing) {
      const script = document.createElement("script");
      script.src = "//js.hsforms.net/forms/embed/v2.js";
      script.type = "text/javascript";
      script.charset = "utf-8";
      script.async = true;
      script.onload = createForm;
      document.body.appendChild(script);
    } else {
      createForm();
    }
  }, [portalId, formId, region]);

  return <div id="hubspot-form-container" ref={containerRef} className="min-h-[320px]" />;
}
