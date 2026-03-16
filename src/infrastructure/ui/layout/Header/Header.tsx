import { HamburgerButton } from "./HamburgerButton";
import { LanguageToggle } from "@/infrastructure/ui/components/LanguageToggle";

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
          <LanguageToggle />
          <HamburgerButton />
        </div>
      </div>
    </header>
  );
}
