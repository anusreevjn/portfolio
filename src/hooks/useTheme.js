import { useCallback, useEffect, useState } from "react";

const read = () => (document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");

export function useTheme() {
  const [theme, setTheme] = useState(read);

  useEffect(() => {
    const mo = new MutationObserver(() => setTheme(read()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  const toggle = useCallback(() => {
    const next = read() === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem("av-theme", next);
    } catch {
      return;
    }
  }, []);

  return [theme, toggle];
}
