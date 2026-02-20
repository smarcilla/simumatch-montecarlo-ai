"use client";

export function HamburgerButton() {
  const handleClick = () => {
    globalThis.dispatchEvent(new CustomEvent("toggle-mobile-menu"));
  };

  return (
    <button
      className="hamburger-button"
      onClick={handleClick}
      aria-label="Abrir menú de competiciones"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect y="3" width="20" height="2" rx="1" fill="currentColor" />
        <rect y="9" width="20" height="2" rx="1" fill="currentColor" />
        <rect y="15" width="20" height="2" rx="1" fill="currentColor" />
      </svg>
    </button>
  );
}
