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

  // Create welcome section with proper click handler
  const welcomeSection = h(
    "section",
    {
      key: "welcome-section",
      id: "welcome",
      className: "hero",
      style: { display: currentView === "welcome" ? "block" : "none" }
    },
    h(
      "div",
      { className: "content-wrapper" },
      h(
        "div",
        { className: "hero-content slide-up" },
        [
          h(
            "h1",
            { className: "main-title", key: "title" },
            [
              h("span", { className: "title-line", key: "title-line-1" }, "Make Time for"),
              h("span", { className: "title-line", key: "title-line-2" }, "What Matters...")
            ]
          ),
          h(
            "div",
            { className: "hero-text fade-in-delayed", key: "hero-text" },
            [
              h(
                "p",
                { className: "subtitle", key: "subtitle" },
                ["Because the best stories", h("br", { key: "br" }), "unfold when you're living them"]
              ),
              h(
                "p",
                { className: "tagline", key: "tagline" },
                "Your companion to a seamless year of leave"
              )
            ]
          ),
          h(
            "div",
            { className: "cta-wrapper fade-in-delayed-2", key: "cta-wrapper" },
            h(
              "button",
              {
                className: "cta-button",
                onClick: () => handleViewChange("calendar"),
                key: "start-button"
              },
              [
                h("span", { key: "button-text" }, "Start Planning"),
                h("div", { className: "button-glow", key: "button-glow" })
              ]
            )
          )
        ]
      )
    )
  );

  // Calendar section
  const calendarSection = h(
    "section",
    {
      key: "calendar-section",
      id: "calendar",
      className: "calendar-section",
      style: { display: currentView === "calendar" ? "block" : "none" }
    },
    h("div", { className: "calendar-view" }, [
      h("header", { className: "calendar-header", key: "calendar-header" },
        [
          h("div", { className: "nav-controls", key: "nav-controls" }, [
            h("button", { className: "nav-btn", id: "prevMonth", key: "prev-btn" }, "←"),
            h("h2", { id: "currentMonth", key: "current-month" }, "November 2024"),
            h("button", { className: "nav-btn", id: "nextMonth", key: "next-btn" }, "→")
          ]),
          h("div", { className: "view-controls", key: "view-controls" }, [
            h("button", { className: "view-btn active", "data-view": "month", key: "month-btn" }, "Month"),
            h("button", { className: "view-btn", "data-view": "week", key: "week-btn" }, "Week")
          ])
        ]
      ),
      // ... rest of your calendar implementation
    ])
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
      [
        // Header
        h(
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
        ),
        
        // Main content sections
        h("main", { className: "flex-grow", key: "main" }, [
          welcomeSection,
          calendarSection
        ]),
        
        // Footer
        h(
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
        ),
        
        // Modal Triggers
        h(ModalTriggers, { key: "modal-triggers" })
      ]
    )
  );
}

// Initialize the app
const container = document.getElementById("root");
const root = createRoot(container);
root.render(h(App, { key: "app" }));
