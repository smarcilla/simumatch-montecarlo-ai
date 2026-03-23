// @vitest-environment jsdom
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { afterEach, describe, it, expect, vi, beforeEach } from "vitest";
import { MatchCard } from "@/infrastructure/ui/components/MatchCard";
import { FindMatchByLeagueAndSeasonResult } from "@/application/results/find-matches-by-league-and-season.result";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

function buildMatch(
  overrides: Partial<FindMatchByLeagueAndSeasonResult> = {}
): FindMatchByLeagueAndSeasonResult {
  return {
    id: "match-1",
    home: "FC Barcelona",
    away: "Real Madrid",
    date: "2025-03-15T20:00:00.000Z",
    homeColorPrimary: "#A50044",
    homeColorSecondary: "#004D98",
    awayColorPrimary: "#FFFFFF",
    awayColorSecondary: "#000000",
    homeScore: 2,
    awayScore: 1,
    status: "finished",
    league: "league-1",
    season: "season-1",
    ...overrides,
  };
}

describe("MatchCard", () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render home and away team names", () => {
    render(<MatchCard match={buildMatch()} />);
    expect(screen.getByText("FC Barcelona")).toBeDefined();
    expect(screen.getByText("Real Madrid")).toBeDefined();
  });

  it("should render the score", () => {
    render(<MatchCard match={buildMatch({ homeScore: 3, awayScore: 0 })} />);
    const scores = screen.getAllByText(/^[0-3]$/);
    expect(scores.some((el) => el.textContent === "3")).toBe(true);
    expect(scores.some((el) => el.textContent === "0")).toBe(true);
  });

  it("should render the match date formatted", () => {
    render(<MatchCard match={buildMatch()} />);
    const dateElement = screen.getByText(/Mar.*2025/);
    expect(dateElement).toBeDefined();
  });

  it("should render the translated match status", () => {
    render(<MatchCard match={buildMatch({ status: "simulated" })} />);
    expect(screen.getByText("simulated")).toBeDefined();
  });

  it("should render chronicle_generated status", () => {
    render(<MatchCard match={buildMatch({ status: "chronicle_generated" })} />);
    expect(screen.getByText("chronicle_generated")).toBeDefined();
  });

  it("should link to /match/{id}", () => {
    render(<MatchCard match={buildMatch({ id: "abc-123" })} />);
    const links = screen.getAllByRole("link");
    const matchLink = links.find((l) =>
      l.getAttribute("href")?.startsWith("/match/")
    );
    expect(matchLink).toBeDefined();
    expect(matchLink!.getAttribute("href")).toBe("/match/abc-123");
  });

  it("should show tooltip on team name hover", () => {
    render(<MatchCard match={buildMatch()} />);
    const [homeButton] = screen.getAllByRole("button", {
      name: "FC Barcelona",
    });
    expect(homeButton).toBeDefined();
    fireEvent.mouseEnter(homeButton as HTMLElement);
    const tooltips = screen.getAllByText("FC Barcelona");
    expect(tooltips.length).toBeGreaterThanOrEqual(2);
    fireEvent.mouseLeave(homeButton as HTMLElement);
  });

  it("should render TeamShield SVGs", () => {
    const { container } = render(<MatchCard match={buildMatch()} />);
    const svgs = container.querySelectorAll("svg.team-shield-svg");
    expect(svgs.length).toBe(2);
  });

  it("should apply team colors as CSS variables", () => {
    const { container } = render(
      <MatchCard
        match={buildMatch({
          homeColorPrimary: "#FF0000",
          awayColorPrimary: "#0000FF",
        })}
      />
    );
    const card = container.querySelector(".match-card") as HTMLElement;
    expect(card.style.getPropertyValue("--team-home-primary")).toBe("#FF0000");
    expect(card.style.getPropertyValue("--team-away-primary")).toBe("#0000FF");
  });
});
