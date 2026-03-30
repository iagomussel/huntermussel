import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { initAnalytics, trackPageView } from "@/lib/analytics";

export function GoogleAnalytics() {
  const location = useLocation();
  const hasMountedRef = useRef(false);

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    trackPageView(location.pathname + location.search, document.title);
  }, [location.pathname, location.search]);

  return null;
}
