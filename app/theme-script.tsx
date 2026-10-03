export function ThemeScript() {
  const script = `
    (function () {
      try {
        var stored = localStorage.getItem("theme");
        var preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", stored || preferred);
      } catch (e) {}
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
