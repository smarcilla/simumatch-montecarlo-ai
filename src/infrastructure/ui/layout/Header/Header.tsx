import { HamburgerButton } from "./HamburgerButton";

export function Header() {
  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="app-logo">
          <div>
            <h1 className="app-title">SimuMatch AI</h1>
            <p className="app-subtitle">Monte Carlo Simulations</p>
          </div>
        </div>
        <div className="header-actions">
          <div
            style={{
              fontSize: "var(--font-size-sm)",
              color: "var(--text-tertiary)",
            }}
          >
            Acciones | Usuario
          </div>
          <HamburgerButton />
        </div>
      </div>
    </header>
  );
}
