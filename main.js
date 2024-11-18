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

  // Footer links with unique keys
  const footerLinks = [
    { id: 'contact', text: 'Contact Us', href: '#' },
    { id: 'learn', text: 'Learn More', href: '#' },
    { id: 'privacy', text: 'Privacy Policy', href: '#' }
  ];

  const calendarSection = h(
    "section",
    {
      key: "calendar-section",
      id: "calendar",
      className: "calendar-section",
      style: { display: currentView === "calendar" ? "block" : "none" }
    },
    h("div", { className: "calendar-view", key: "calendar-view" }, [
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
      
      // Calendar Grid with unique keys for each weekday
      h("div", { className: "calendar-grid", key: "calendar-grid" }, [
        h("div", { className: "weekdays", key: "weekdays" }, 
          ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => 
            h("div", { key: `weekday-${day.toLowerCase()}` }, day)
          )
        ),
        h("div", { className: "days", id: "calendarDays", key: "calendar-days" })
      ]),
      
      // Leave Status with unique keys
      h("div", { className: "leave-status", key: "leave-status" }, [
        h("div", { className: "status-item", key: "status-item-pto" }, [
          h("span", { className: "status-dot pto", key: "dot-pto" }),
          h("span", { "data-term": "leave", key: "text-pto" }, "Annual Leave")
        ]),
        h("div", { className: "status-item", key: "status-item-holiday" }, [
          h("span", { className: "status-dot holiday", key: "dot-holiday" }),
          h("span", { "data-term": "holiday", key: "text-holiday" }, "Bank Holiday")
        ]),
        h("div", { className: "status-item", key: "status-item-weekend" }, [
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
      { className: "content-wrapper", key: "welcome-wrapper" },
      h(
        "div",
        { className: "hero-content slide-up", key: "hero-content" },
        [
          h(
            "h1",
            { className: "main-title", key: "main-title" },
            [
              h("span", { className: "title-line", key: "title-line-1" }, "Make Time for"),
              h("span", { className: "title-line", key: "title-line-2" }, "What Matters...")
            ]
          ),
          h(
            "div",
            { className: "hero-text fade-in-delayed", key: "hero-text" },
            [
              h("p", { className: "subtitle", key: "subtitle" }, [
                "Because the best stories",
                h("br", { key: "subtitle-break" }),
                "unfold when you're living them"
              ]),
              h("p", { className: "tagline", key: "tagline" }, "Your companion to a seamless year of leave")
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
                key: "cta-button"
              },
              [
                h("span", { key: "cta-text" }, "Start Planning"),
                h("div", { className: "button-glow", key: "button-glow" })
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
          width: "100%",
          overflow: "hidden"
        }
      },
      [
        // Header
        h(
          "header",
          { 
            className: "header",
            key: "header",
            style: {
              width: "100%",
              zIndex: 10
            }
          }
        ),

        // Main Content
        h(
          "main", 
          { 
            className: "flex-grow",
            key: "main-content",
            style: {
              width: "100%",
              position: "relative"
            }
          }, 
          [welcomeSection, calendarSection]
        ),

        // Footer with mapped links
        h(
          "footer",
          { className: "footer fade-in-delayed-2", key: "footer" },
          h(
            "div",
            { className: "footer-content", key: "footer-content" },
            h(
              "nav",
              { className: "footer-nav", key: "footer-nav" },
              footerLinks.map(link => 
                h("a", 
                  { 
                    href: link.href, 
                    className: "footer-link",
                    key: `footer-link-${link.id}`
                  }, 
                  link.text
                )
              )
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
