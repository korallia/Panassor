// src/components/RouteReset.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function RouteReset() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");

      const timeoutId = window.setTimeout(() => {
        const element = document.getElementById(id);

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 50);

      return () => window.clearTimeout(timeoutId);
    }

    window.scrollTo(0, 0);

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const root = document.getElementById("root");
    if (root) {
      root.scrollTop = 0;
    }
  }, [pathname, hash]);

  return null;
}