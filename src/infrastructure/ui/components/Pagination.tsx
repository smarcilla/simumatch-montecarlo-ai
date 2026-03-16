"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

interface PaginationProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly leagueId: string;
  readonly seasonId: string;
  readonly statusesRaw?: string | undefined;
  readonly dateFromRaw?: string | undefined;
  readonly dateToRaw?: string | undefined;
}

export function Pagination({
  currentPage,
  totalPages,
  leagueId,
  seasonId,
  statusesRaw,
  dateFromRaw,
  dateToRaw,
}: PaginationProps) {
  const t = useTranslations("layout");
  const tFilters = useTranslations("filters");

  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    params.set("league", leagueId);
    params.set("season", seasonId);
    params.set("page", String(page));
    if (statusesRaw) params.set("statuses", statusesRaw);
    if (dateFromRaw) params.set("dateFrom", dateFromRaw);
    if (dateToRaw) params.set("dateTo", dateToRaw);
    return `/?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(0, currentPage - 2);
      let end = Math.min(totalPages - 1, currentPage + 2);

      if (currentPage < 2) {
        end = Math.min(maxVisible - 1, totalPages - 1);
      } else if (currentPage > totalPages - 3) {
        start = Math.max(0, totalPages - maxVisible);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === totalPages - 1;

  return (
    <nav className="pagination" aria-label={t("pagination")}>
      <div className="pagination-container">
        {!isFirstPage && (
          <Link href={buildUrl(0)} className="pagination-button">
            ‹‹
          </Link>
        )}

        {!isFirstPage && (
          <Link href={buildUrl(currentPage - 1)} className="pagination-button">
            ‹
          </Link>
        )}

        {pageNumbers.map((pageNum) => (
          <Link
            key={pageNum}
            href={buildUrl(pageNum)}
            className={`pagination-button ${
              pageNum === currentPage ? "active" : ""
            }`}
            aria-current={pageNum === currentPage ? "page" : undefined}
          >
            {pageNum + 1}
          </Link>
        ))}

        {!isLastPage && (
          <Link href={buildUrl(currentPage + 1)} className="pagination-button">
            ›
          </Link>
        )}

        {!isLastPage && (
          <Link href={buildUrl(totalPages - 1)} className="pagination-button">
            ››
          </Link>
        )}
      </div>

      <div className="pagination-info">
        {tFilters("page", { current: currentPage + 1, total: totalPages })}
      </div>
    </nav>
  );
}
