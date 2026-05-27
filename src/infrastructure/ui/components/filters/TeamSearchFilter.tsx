"use client";

import { TeamSuggestionResult } from "@/application/results/find-team-suggestions.result";
import { getTeamSuggestions } from "@/infrastructure/actions/team.actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

interface TeamSearchFilterProps {
  readonly currentTeamSlug?: string;
  readonly currentTeamName?: string;
}

export function TeamSearchFilter({
  currentTeamSlug,
  currentTeamName,
}: TeamSearchFilterProps) {
  const t = useTranslations("filters");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [inputValue, setInputValue] = useState(currentTeamName ?? "");
  const [suggestions, setSuggestions] = useState<TeamSuggestionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState<
    number | null
  >(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const skipNextFetchRef = useRef(false);
  const requestIdRef = useRef(0);

  const leagueId = searchParams.get("league") ?? "";
  const seasonId = searchParams.get("season") ?? "";
  const activeTeamSlug = searchParams.get("team") ?? "";

  useEffect(() => {
    setInputValue(currentTeamName ?? "");
  }, [currentTeamName, currentTeamSlug]);

  useEffect(() => {
    suggestionRefs.current = suggestionRefs.current.slice(
      0,
      suggestions.length
    );
  }, [suggestions.length]);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  useEffect(() => {
    const normalizedPattern = inputValue.trim();

    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      setIsLoading(false);
      setIsOpen(false);
      return;
    }

    if (
      normalizedPattern.length < 3 ||
      leagueId.length === 0 ||
      seasonId.length === 0
    ) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const currentRequestId = ++requestIdRef.current;
    setIsLoading(true);

    const timeoutId = setTimeout(async () => {
      try {
        const result = await getTeamSuggestions(
          normalizedPattern,
          leagueId,
          seasonId
        );

        if (currentRequestId !== requestIdRef.current) {
          return;
        }

        setSuggestions(result);
        setIsOpen(true);
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [inputValue, leagueId, seasonId]);

  const updateUrl = (teamSlug?: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "0");

    if (teamSlug) {
      params.set("team", teamSlug);
    } else {
      params.delete("team");
    }

    router.push(`/?${params.toString()}`);
  };

  const handleSelect = (suggestion: TeamSuggestionResult) => {
    skipNextFetchRef.current = true;
    setInputValue(suggestion.name);
    setSuggestions([]);
    setIsOpen(false);
    setFocusedSuggestionIndex(null);
    updateUrl(suggestion.slug);
    focusInput();
  };

  const handleClear = () => {
    setInputValue("");
    setSuggestions([]);
    setIsOpen(false);
    setFocusedSuggestionIndex(null);
    updateUrl();
    inputRef.current?.focus();
  };

  const focusInput = () => {
    setFocusedSuggestionIndex(null);
    inputRef.current?.focus();
  };

  const focusSuggestion = (index: number) => {
    const suggestionButton = suggestionRefs.current[index];
    if (!suggestionButton) {
      return;
    }
    setFocusedSuggestionIndex(index);
    suggestionButton.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Delete") {
      if (hasActiveTeamFilter) {
        event.preventDefault();
        handleClear();
      }
      return;
    }

    if (event.key === "ArrowDown") {
      if (hasOpenSuggestions) {
        event.preventDefault();
        focusSuggestion(0);
      }
      return;
    }

    if (event.key === "ArrowUp") {
      if (hasOpenSuggestions) {
        event.preventDefault();
        focusSuggestion(suggestions.length - 1);
      }
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (isOpen) {
        setIsOpen(false);
        setFocusedSuggestionIndex(null);
        focusInput();
        return;
      }

      if (suggestions.length > 0) {
        setIsOpen(true);
      }

      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      setFocusedSuggestionIndex(null);
    }
  };

  const handleSuggestionKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    suggestion: TeamSuggestionResult,
    index: number
  ) => {
    if (event.key === "Delete") {
      if (hasActiveTeamFilter) {
        event.preventDefault();
        handleClear();
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (index === suggestions.length - 1) {
        focusInput();
      } else {
        focusSuggestion(index + 1);
      }

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (index === 0) {
        focusInput();
      } else {
        focusSuggestion(index - 1);
      }

      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      focusInput();
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      handleSelect(suggestion);
    }
  };

  const normalizedPattern = inputValue.trim();
  const hasEnoughChars = normalizedPattern.length >= 3;
  const hasActiveTeamFilter = activeTeamSlug.length > 0;
  const hasOpenSuggestions = suggestions.length > 0 && isOpen;
  const showDropdown = isOpen && hasEnoughChars;
  const showNoSuggestions =
    showDropdown && !isLoading && suggestions.length === 0;

  return (
    <div className="filter-group team-search-filter" ref={containerRef}>
      <label htmlFor="team-search-input" className="filter-label">
        {t("team")}
      </label>

      <div className="team-search-input-wrapper">
        <input
          id="team-search-input"
          ref={inputRef}
          type="text"
          className="team-search-input"
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value);
            setIsOpen(true);
            setFocusedSuggestionIndex(null);
          }}
          onFocus={() => {
            setFocusedSuggestionIndex(null);
            if (hasEnoughChars) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck={false}
          placeholder={t("team")}
        />

        {activeTeamSlug ? (
          <button
            type="button"
            className="team-search-clear"
            onClick={handleClear}
            aria-label={t("clearTeam")}
          >
            ×
          </button>
        ) : null}

        {showDropdown ? (
          <div className="team-search-dropdown">
            {isLoading ? (
              <div className="team-search-empty">{tCommon("processing")}</div>
            ) : null}

            {isLoading
              ? null
              : suggestions.map((suggestion, index) => (
                  <button
                    type="button"
                    key={suggestion.id}
                    className="team-search-item"
                    ref={(element) => {
                      suggestionRefs.current[index] = element;
                    }}
                    tabIndex={focusedSuggestionIndex === index ? 0 : -1}
                    onMouseDown={(event) => event.preventDefault()}
                    onFocus={() => {
                      setFocusedSuggestionIndex(index);
                    }}
                    onKeyDown={(event) =>
                      handleSuggestionKeyDown(event, suggestion, index)
                    }
                    onClick={() => handleSelect(suggestion)}
                  >
                    {suggestion.name}
                  </button>
                ))}

            {showNoSuggestions ? (
              <div className="team-search-empty">{t("noTeamSuggestions")}</div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
