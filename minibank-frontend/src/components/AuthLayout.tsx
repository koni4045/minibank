import { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

const highlights = [
  { icon: "🔒", text: "Bank-grade security with encrypted transactions" },
  { icon: "⚡", text: "Instant transfers between MiniBank accounts" },
  { icon: "📊", text: "Real-time balance and activity tracking" },
];

function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <div className="auth-branding">
        <div className="auth-branding-content">
          <h1 className="auth-logo">MiniBank</h1>
          <p className="auth-tagline">Banking that moves as fast as you do.</p>

          <ul className="auth-highlights">
            {highlights.map((h) => (
              <li key={h.text}>
                <span className="auth-highlight-icon">{h.icon}</span>
                {h.text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-box">
          <h2>{title}</h2>
          <p className="auth-subtitle">{subtitle}</p>

          {children}

          <div className="auth-footer">{footer}</div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;