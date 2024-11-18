// main.js
const React = window.React;
const ReactDOM = window.ReactDOM;
const { createElement, useState, useEffect } = React;
const { createRoot } = ReactDOM;

const { ModalProvider, ModalTriggers } = await import('./components/modals/index.js');

function App() {
  const [currentView, setCurrentView] = useState("welcome");
  const [currentRegion, setCurrentRegion] = useState("UK");

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return createElement(
    ModalProvider,
    null,
    createElement(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }
      },
      // Header
      createElement(
        "header",
        { className: "header" },
        createElement(
          "nav",
          { className: "nav-container" },
          createElement("a", { href: "/", className: "brand fade-in" }, "alfie"),
          createElement(
            "div",
            { className: "region-toggle" },
            createElement(
              "button",
              {
                className: `region-btn ${currentRegion === "UK" ? "active" : ""}`,
                onClick: () => setCurrentRegion("UK")
              },
              "UK"
            ),
            createElement(
              "button",
              {
                className: `region-btn ${currentRegion === "US" ? "active" : ""}`,
                onClick: () => setCurrentRegion("US")
              },
              "US"
            )
          )
        )
      ),

      // Main Content
      createElement(
        "main",
        { className: "flex-grow" },
        // Welcome Section
        createElement(
          "section",
          {
            id: "welcome",
            className: "hero",
            style: { display: currentView === "welcome" ? "block" : "none" }
          },
          createElement(
            "div",
            { className: "content-wrapper" },
            createElement(
              "div",
              { className: "hero-content slide-up" },
              createElement(
                "h1",
                { className: "main-title" },
                createElement("span", { className: "title-line" }, "Make Time for"),
                createElement("span", { className: "title-line" }, "What Matters...")
              ),
              createElement(
                "div",
                { className: "hero-text fade-in-delayed" },
                createElement(
                  "p",
                  { className: "subtitle" },
                  "Because the best stories",
                  createElement("br"),
                  "unfold when you are living them"
                ),
                createElement(
                  "p",
                  { className: "tagline" },
                  "Your companion to a seamless year of leave"
                )
              ),
              createElement(
                "div",
                { className: "cta-wrapper fade-in-delayed-2" },
                createElement(
                  "button",
                  {
                    className: "cta-button",
                    onClick: () => handleViewChange("calendar")
                  },
                  createElement("span", null, "Start Planning"),
                  createElement("div", { className: "button-glow" })
                )
              )
            )
          )
        ),

        // Calendar Section
        createElement(
          "section",
          {
            id: "calendar",
            className: "calendar-section",
            style: { display: currentView === "calendar" ? "block" : "none" }
          }
        )
      ),

      // Footer
      createElement(
        "footer",
        { className: "footer fade-in-delayed-2" },
        createElement(
          "div",
          { className: "footer-content" },
          createElement(
            "nav",
            { className: "footer-nav" },
            createElement("a", { href: "#", className: "footer-link" }, "Contact Us"),
            createElement("a", { href: "#", className: "footer-link" }, "Learn More"),
            createElement("a", { href: "#", className: "footer-link" }, "Privacy Policy")
          )
        )
      ),
      
      // Modal Triggers
      createElement(ModalTriggers, null)
    )
  );
}

// Initialize the app
const container = document.getElementById("root");
const root = createRoot(container);
root.render(createElement(App));
