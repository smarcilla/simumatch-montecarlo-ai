"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { getDefaultDateForSeason } from "@/infrastructure/ui/utils/season-default-date";

function toDate(s: string): Date | undefined {
  if (!s) return undefined;
  const d = new Date(s + "T12:00:00");
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function fromDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fmt(d: Date | undefined): string {
  if (!d) return "";
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const CalendarIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

interface DateRangeFilterProps {
  readonly seasonYear: string;
}

export function DateRangeFilter({ seasonYear }: DateRangeFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromStr = searchParams.get("dateFrom") ?? "";
  const toStr = searchParams.get("dateTo") ?? "";

  const committedFrom = toDate(fromStr);
  const committedTo = toDate(toStr);
  const committedRange: DateRange = { from: committedFrom, to: committedTo };

  const [open, setOpen] = useState(false);
  const [pickerRange, setPickerRange] = useState<DateRange | undefined>(
    undefined
  );
  const [displayMonth, setDisplayMonth] = useState<Date | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const getSeasonMonth = (): Date | undefined => {
    if (!seasonYear) return undefined;
    return getDefaultDateForSeason(seasonYear);
  };

  const handleOpen = () => {
    setPickerRange(committedRange);
    setDisplayMonth(committedFrom ?? getSeasonMonth());
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelect = (selected: DateRange | undefined) => {
    setPickerRange(selected);
    if (selected?.from && selected?.to) {
      const params = new URLSearchParams(searchParams);
      params.set("dateFrom", fromDateStr(selected.from));
      params.set("dateTo", fromDateStr(selected.to));
      params.set("page", "0");
      router.push(`/?${params.toString()}`);
      setOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    const params = new URLSearchParams(searchParams);
    params.delete("dateFrom");
    params.delete("dateTo");
    params.set("page", "0");
    router.push(`/?${params.toString()}`);
  };

  const displayRange = open ? pickerRange : committedRange;
  const hasSelection = !!(committedFrom || committedTo);
  const getLabel = (): string => {
    if (!committedFrom) return "Seleccionar período";
    if (committedTo) return `${fmt(committedFrom)} – ${fmt(committedTo)}`;
    return `Desde ${fmt(committedFrom)}`;
  };
  const label = getLabel();

  const dayPickerProps = displayMonth ? { month: displayMonth } : {};

  return (
    <div className="filter-group filter-date-picker" ref={containerRef}>
      <span className="filter-label">Período</span>
      <div className="filter-date-trigger-row">
        <button
          type="button"
          className={`filter-date-trigger${open ? " open" : ""}`}
          onClick={open ? handleClose : handleOpen}
        >
          <CalendarIcon />
          <span>{label}</span>
        </button>
        {hasSelection && (
          <button
            type="button"
            className="filter-clear-btn"
            onClick={handleClear}
            aria-label="Limpiar fechas"
          >
            <CloseIcon />
          </button>
        )}
      </div>
      {open && (
        <div className="filter-date-popover">
          <DayPicker
            mode="range"
            selected={displayRange}
            onSelect={handleSelect}
            {...dayPickerProps}
            onMonthChange={setDisplayMonth}
          />
        </div>
      )}
    </div>
  );
}
