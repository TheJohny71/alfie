// main.js
const React = window.React;
const ReactDOM = window.ReactDOM;
const { createElement: h, useState, useEffect } = React;
const { createRoot } = ReactDOM;

// Import modal components
const { ModalProvider, ModalTriggers } = await import('./components/modals/index.js');

function App() {
  const [currentView, setCurrentView] = useState("welcome");
  const [currentRegion, setCurrentRegion] = useState("UK");

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  // Create elements with keys
  const headerElement = h(
    "header",
    { className: "header", key: "header" },
    h(
      "nav",
      { className: "nav-container", key: "nav" },
      [
        h("a", { href: "/", className: "brand fade-in", key: "brand" }, "alfie"),
        h(
          "div",
          { className: "region-toggle", key: "region-toggle" },
          [
            h(
              "button",
              {
                key: "uk-button",
                className: `region-btn ${currentRegion === "UK" ? "active" : ""}`,
                onClick: () => setCurrentRegion("UK")
              },
              "UK"
            ),
            h(
              "button",
              {
                key: "us-button",
                className: `region-btn ${currentRegion === "US" ? "active" : ""}`,
                onClick: () => setCurrentRegion("US")
              },
              "US"
            )
          ]
        )
      ]
    )
  );

  // Create main content elements with keys
  const mainContent = h(
    "main",
    { className: "flex-grow", key: "main" },
    [
      h(
        "section",
        {
          key: "welcome-section",
          id: "welcome",
          className: "hero",
          style: { display: currentView === "welcome" ? "block" : "none" }
        },
        // ... rest of your welcome section code with added keys
      ),
      h(
        "section",
        {
          key: "calendar-section",
          id: "calendar",
          className: "calendar-section",
          style: { display: currentView === "calendar" ? "block" : "none" }
        }
      )
    ]
  );

  // Create footer element with key
  const footerElement = h(
    "footer",
    { className: "footer fade-in-delayed-2", key: "footer" },
    h(
      "div",
      { className: "footer-content", key: "footer-content" },
      h(
        "nav",
        { className: "footer-nav", key: "footer-nav" },
        [
          h("a", { href: "#", className: "footer-link", key: "contact" }, "Contact Us"),
          h("a", { href: "#", className: "footer-link", key: "learn" }, "Learn More"),
          h("a", { href: "#", className: "footer-link", key: "privacy" }, "Privacy Policy")
        ]
      )
    )
  );

  return h(
    ModalProvider,
    { key: "modal-provider" },
    h(
      "div",
      {
        key: "app-container",
        style: {
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }
      },
      [headerElement, mainContent, footerElement, h(ModalTriggers, { key: "modal-triggers" })]
    )
  );
}

// Initialize the app
const container = document.getElementById("root");
const root = createRoot(container);
root.render(h(App, { key: "app" }));
