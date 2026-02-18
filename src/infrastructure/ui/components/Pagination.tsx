// src/infrastructure/ui/components/Pagination.tsx
"use client";

import Link from "next/link";

interface PaginationProps {
  readonly currentPage: number; // 0-indexed
  readonly totalPages: number;
  readonly leagueId: string;
  readonly seasonId: string;
}

export function Pagination({
  currentPage,
  totalPages,
  leagueId,
  seasonId,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    return `/?league=${leagueId}&season=${seasonId}&page=${page}`;
  };

  // Calcular qué números de página mostrar (máximo 5)
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Mostrar todas las páginas
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas alrededor de la actual
      let start = Math.max(0, currentPage - 2);
      let end = Math.min(totalPages - 1, currentPage + 2);

      // Ajustar si estamos cerca del inicio o final
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
    <nav className="pagination" aria-label="Paginación">
      <div className="pagination-container">
        {/* Primera página */}
        {!isFirstPage && (
          <Link href={buildUrl(0)} className="pagination-button">
            ‹‹
          </Link>
        )}

        {/* Anterior */}
        {!isFirstPage && (
          <Link href={buildUrl(currentPage - 1)} className="pagination-button">
            ‹
          </Link>
        )}

        {/* Números de página */}
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

        {/* Siguiente */}
        {!isLastPage && (
          <Link href={buildUrl(currentPage + 1)} className="pagination-button">
            ›
          </Link>
        )}

        {/* Última página */}
        {!isLastPage && (
          <Link href={buildUrl(totalPages - 1)} className="pagination-button">
            ››
          </Link>
        )}
      </div>

      {/* Info de página */}
      <div className="pagination-info">
        Página {currentPage + 1} de {totalPages}
      </div>
    </nav>
  );
}
