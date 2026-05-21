import { HamburgerButton } from "./HamburgerButton";
import { LanguageToggle } from "@/infrastructure/ui/components/LanguageToggle";

export function Header() {
  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="app-logo">
          <div>
            <span className="logo-expected">Expected</span>
            <span className="logo-score">Score</span>
            <span className="logo-domain">.app</span>
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
