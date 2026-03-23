// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, it, expect, vi, beforeEach } from "vitest";
import { Pagination } from "@/infrastructure/ui/components/Pagination";

vi.mock("next-intl", () => ({
  useTranslations: (namespace: string) => {
    if (namespace === "filters") {
      return (key: string, params?: Record<string, unknown>) => {
        if (key === "page" && params)
          return `Page ${params.current} of ${params.total}`;
        return key;
      };
    }
    return (key: string) => key;
  },
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
    "aria-current"?:
      | "page"
      | "step"
      | "location"
      | "date"
      | "time"
      | "true"
      | "false"
      | boolean;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const baseProps = {
  currentPage: 0,
  totalPages: 5,
  leagueId: "league-1",
  seasonId: "season-1",
};

describe("Pagination", () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when totalPages is 1", () => {
    const { container } = render(<Pagination {...baseProps} totalPages={1} />);
    expect(container.querySelector("nav")).toBeNull();
  });

  it("should not render when totalPages is 0", () => {
    const { container } = render(<Pagination {...baseProps} totalPages={0} />);
    expect(container.querySelector("nav")).toBeNull();
  });

  it("should render page buttons for small page counts", () => {
    render(<Pagination {...baseProps} totalPages={3} />);
    expect(screen.getByText("1")).toBeDefined();
    expect(screen.getByText("2")).toBeDefined();
    expect(screen.getByText("3")).toBeDefined();
  });

  it("should render max 5 page buttons for large page counts", () => {
    render(<Pagination {...baseProps} totalPages={20} currentPage={10} />);
    const pageLinks = screen.getAllByRole("link").filter((link) => {
      const text = link.textContent ?? "";
      return /^\d+$/.test(text);
    });
    expect(pageLinks.length).toBeLessThanOrEqual(5);
  });

  it("should not show previous buttons on first page", () => {
    render(<Pagination {...baseProps} currentPage={0} />);
    expect(screen.queryByText("‹")).toBeNull();
    expect(screen.queryByText("‹‹")).toBeNull();
  });

  it("should not show next buttons on last page", () => {
    render(<Pagination {...baseProps} currentPage={4} totalPages={5} />);
    expect(screen.queryByText("›")).toBeNull();
    expect(screen.queryByText("››")).toBeNull();
  });

  it("should show navigation buttons on middle pages", () => {
    render(<Pagination {...baseProps} currentPage={2} />);
    expect(screen.getByText("‹")).toBeDefined();
    expect(screen.getByText("‹‹")).toBeDefined();
    expect(screen.getByText("›")).toBeDefined();
    expect(screen.getByText("››")).toBeDefined();
  });

  it("should include correct query params in page links", () => {
    render(
      <Pagination
        {...baseProps}
        currentPage={1}
        statusesRaw="simulated"
        dateFromRaw="2025-01-01"
        dateToRaw="2025-12-31"
      />
    );
    const links = screen.getAllByRole("link");
    const firstPageLink = links.find((l) => l.textContent === "1");
    expect(firstPageLink).toBeDefined();
    const href = firstPageLink!.getAttribute("href")!;
    expect(href).toContain("league=league-1");
    expect(href).toContain("season=season-1");
    expect(href).toContain("statuses=simulated");
    expect(href).toContain("dateFrom=2025-01-01");
    expect(href).toContain("dateTo=2025-12-31");
  });

  it("should mark current page with aria-current", () => {
    render(<Pagination {...baseProps} currentPage={2} />);
    const currentLink = screen.getByText("3");
    expect(currentLink.getAttribute("aria-current")).toBe("page");
  });

  it("should not mark non-current pages with aria-current", () => {
    render(<Pagination {...baseProps} currentPage={2} />);
    const otherLink = screen.getByText("1");
    expect(otherLink.getAttribute("aria-current")).toBeNull();
  });

  it("should display pagination info", () => {
    render(<Pagination {...baseProps} currentPage={2} totalPages={10} />);
    expect(screen.getByText("Page 3 of 10")).toBeDefined();
  });
});
