export default function Home() {
  return (
    <main
      style={{
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0b0f1a 0%, #111827 40%, #0f172a 100%)",
        color: "#f8fafc",
      }}
    >
      <header
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #5865F2, #22c55e)",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            R
          </div>
          <span style={{ fontWeight: 700, fontSize: 18 }}>Resell Buddy</span>
        </div>
        <nav style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <a href="/pricing" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14 }}>
            Pricing
          </a>
          <a
            href="https://whop.com/resell-buddy"
            target="_blank"
            rel="noreferrer"
            style={{
              background: "#5865F2",
              color: "white",
              padding: "8px 16px",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Get access
          </a>
        </nav>
      </header>

      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "64px 24px 48px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "6px 12px",
            borderRadius: 999,
            background: "rgba(88, 101, 242, 0.15)",
            border: "1px solid rgba(88, 101, 242, 0.35)",
            color: "#a5b4fc",
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 24,
          }}
        >
          Discord-first · Whop billing · Built for resellers
        </div>
        <h1
          style={{
            fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
            lineHeight: 1.1,
            fontWeight: 800,
            margin: "0 0 20px",
            letterSpacing: "-0.03em",
          }}
        >
          Catch the deal
          <br />
          <span style={{ color: "#22c55e" }}>before the feed moves on</span>
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            color: "#94a3b8",
            maxWidth: 560,
            margin: "0 auto 36px",
            lineHeight: 1.6,
          }}
        >
          Real-time marketplace monitoring with instant Discord alerts. Create
          targeted monitors, get notified in your private channel or DM, and
          flip faster than the competition.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <a
            href="https://whop.com/checkout/plan_vAO3R1lqZ11UT"
            target="_blank"
            rel="noreferrer"
            style={{
              background: "#22c55e",
              color: "#052e16",
              padding: "14px 28px",
              borderRadius: 10,
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            Start Pro — €14.99/mo
          </a>
          <a
            href="/pricing"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#f8fafc",
              padding: "14px 28px",
              borderRadius: 10,
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            Compare plans
          </a>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "32px 24px 80px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 20,
        }}
      >
        {[
          {
            title: "Discord bot as primary UI",
            body: "Invite the bot, /link your account, manage monitors and alerts without leaving Discord. Slash commands for create, list, pause, status.",
          },
          {
            title: "Plan-gated monitors",
            body: "Free: 1 monitor. Pro: 10. Elite: unlimited. Limits enforced in the API, worker, and bot — no surprises.",
          },
          {
            title: "Instant deal alerts",
            body: "Rich embeds to a channel you choose or DMs (Pro+). Keyword, brand, size, price filters so you only see what matters.",
          },
          {
            title: "Whop subscriptions",
            body: "Buy monthly or yearly through Whop. Access unlocks automatically. Cancel anytime from your Whop account.",
          },
        ].map((f) => (
          <div
            key={f.title}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              padding: 24,
            }}
          >
            <h3 style={{ margin: "0 0 10px", fontSize: 17 }}>{f.title}</h3>
            <p style={{ margin: 0, color: "#94a3b8", fontSize: 14, lineHeight: 1.55 }}>{f.body}</p>
          </div>
        ))}
      </section>

      <section style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 96px" }}>
        <h2 style={{ textAlign: "center", fontSize: "1.75rem", marginBottom: 32 }}>
          How it works
        </h2>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 16 }}>
          {[
            "Subscribe on Whop (Pro or Elite).",
            "Invite the Resell Buddy Discord bot to your server.",
            "Run /link — connect Discord to your subscription.",
            "Create monitors (dashboard or /monitor create) and set an alert channel.",
            "Get notified the second a matching listing appears.",
          ].map((step, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12,
                padding: "16px 20px",
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: "#5865F2",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 700,
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span style={{ color: "#e2e8f0", lineHeight: 1.5 }}>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "28px 24px",
          textAlign: "center",
          color: "#64748b",
          fontSize: 13,
        }}
      >
        <p style={{ margin: "0 0 8px" }}>
          Resell Buddy is an independent tool. Not affiliated with Vinted or any marketplace.
        </p>
        <p style={{ margin: 0 }}>
          You are responsible for complying with marketplace terms of service and applicable law.
        </p>
      </footer>
    </main>
  );
}
