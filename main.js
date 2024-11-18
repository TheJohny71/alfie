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

  const calendarSection = h(
    "section",
    {
      key: "calendar-section",
      id: "calendar",
      className: "calendar-section",
      style: { display: currentView === "calendar" ? "block" : "none" }
    },
    h("div", { className: "calendar-view" }, [
      // Calendar Header
      h("header", { className: "calendar-header", key: "calendar-header" }, [
        h("div", { className: "nav-controls", key: "nav-controls" }, [
          h("button", { className: "nav-btn", id: "prevMonth", key: "prev-btn" }, "←"),
          h("h2", { id: "currentMonth", key: "current-month" }, "November 2024"),
          h("button", { className: "nav-btn", id: "nextMonth", key: "next-btn" }, "→")
        ]),
        h("div", { className: "view-controls", key: "view-controls" }, [
          h("button", { className: "view-btn active", "data-view": "month", key: "month-btn" }, "Month"),
          h("button", { className: "view-btn", "data-view": "week", key: "week-btn" }, "Week")
        ])
      ]),
      
      // Calendar Grid
      h("div", { className: "calendar-grid", key: "calendar-grid" }, [
        h("div", { className: "weekdays", key: "weekdays" }, [
          h("div", { key: "mon" }, "Mon"),
          h("div", { key: "tue" }, "Tue"),
          h("div", { key: "wed" }, "Wed"),
          h("div", { key: "thu" }, "Thu"),
          h("div", { key: "fri" }, "Fri"),
          h("div", { key: "sat" }, "Sat"),
          h("div", { key: "sun" }, "Sun")
        ]),
        h("div", { className: "days", id: "calendarDays", key: "calendar-days" })
      ]),
      
      // Leave Status
      h("div", { className: "leave-status", key: "leave-status" }, [
        h("div", { className: "status-item", key: "status-pto" }, [
          h("span", { className: "status-dot pto", key: "dot-pto" }),
          h("span", { "data-term": "leave", key: "text-pto" }, "Annual Leave")
        ]),
        h("div", { className: "status-item", key: "status-holiday" }, [
          h("span", { className: "status-dot holiday", key: "dot-holiday" }),
          h("span", { "data-term": "holiday", key: "text-holiday" }, "Bank Holiday")
        ]),
        h("div", { className: "status-item", key: "status-weekend" }, [
          h("span", { className: "status-dot weekend", key: "dot-weekend" }),
          h("span", { key: "text-weekend" }, "Weekend")
        ])
      ])
    ])
  );

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
            { className: "main-title" },
            [
              h("span", { className: "title-line", key: "title-1" }, "Make Time for"),
              h("span", { className: "title-line", key: "title-2" }, "What Matters...")
            ]
          ),
          h(
            "div",
            { className: "hero-text fade-in-delayed" },
            [
              h("p", { className: "subtitle" }, [
                "Because the best stories",
                h("br"),
                "unfold when you're living them"
              ]),
              h("p", { className: "tagline" }, "Your companion to a seamless year of leave")
            ]
          ),
          h(
            "div",
            { className: "cta-wrapper fade-in-delayed-2" },
            h(
              "button",
              {
                className: "cta-button",
                onClick: () => handleViewChange("calendar")
              },
              [
                h("span", null, "Start Planning"),
                h("div", { className: "button-glow" })
              ]
            )
          )
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
      [
        // Header
        h(
          "header",
          { className: "header", key: "header" },
          h(
            "nav",
            { className: "nav-container" },
            [
              h("a", { href: "/", className: "brand fade-in" }, "alfie"),
              h(
                "div",
                { className: "region-toggle" },
                [
                  h(
                    "button",
                    {
                      className: `region-btn ${currentRegion === "UK" ? "active" : ""}`,
                      onClick: () => setCurrentRegion("UK")
                    },
                    "UK"
                  ),
                  h(
                    "button",
                    {
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

        // Main Content
        h("main", { className: "flex-grow" }, [welcomeSection, calendarSection]),

        // Footer
        h(
          "footer",
          { className: "footer fade-in-delayed-2" },
          h(
            "div",
            { className: "footer-content" },
            h(
              "nav",
              { className: "footer-nav" },
              [
                h("a", { href: "#", className: "footer-link" }, "Contact Us"),
                h("a", { href: "#", className: "footer-link" }, "Learn More"),
                h("a", { href: "#", className: "footer-link" }, "Privacy Policy")
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
