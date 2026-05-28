import { TeamFlag } from "@/infrastructure/ui/components/TeamFlag";

type TeamBadgeSize = "card" | "table" | "detail";

interface TeamBadgeProps {
  readonly primary: string;
  readonly secondary: string;
  readonly teamName: string;
  readonly flagUrl: string | undefined;
  readonly size?: TeamBadgeSize;
}

const BADGE_DIMENSIONS: Record<
  TeamBadgeSize,
  { width: number; height: number }
> = {
  card: { width: 40, height: 46 },
  table: { width: 20, height: 24 },
  detail: { width: 64, height: 74 },
};

function sanitizeColor(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, "");
}

function TeamShield({
  primary,
  secondary,
  size,
}: {
  readonly primary: string;
  readonly secondary: string;
  readonly size: TeamBadgeSize;
}) {
  const dimensions = BADGE_DIMENSIONS[size];
  const clipId = `clip-${size}-${sanitizeColor(primary)}-${sanitizeColor(secondary)}`;
  const className = size === "table" ? undefined : "team-shield-svg";

  return (
    <svg
      width={dimensions.width}
      height={dimensions.height}
      viewBox="0 0 40 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <path d="M20 2L4 8V22C4 32 11.5 40.5 20 44C28.5 40.5 36 32 36 22V8L20 2Z" />
        </clipPath>
      </defs>
      <path
        d="M20 2L4 8V22C4 32 11.5 40.5 20 44C28.5 40.5 36 32 36 22V8L20 2Z"
        fill={primary}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="1"
      />
      <rect
        x="24"
        y="0"
        width="12"
        height="46"
        fill={secondary}
        fillOpacity="0.75"
        clipPath={`url(#${clipId})`}
      />
    </svg>
  );
}

export function TeamBadge({
  primary,
  secondary,
  teamName,
  flagUrl,
  size = "card",
}: TeamBadgeProps) {
  const dimensions = BADGE_DIMENSIONS[size];
  const normalizedFlagUrl = flagUrl?.trim();
  const tableWrapClassName = normalizedFlagUrl
    ? "table-team-shield-wrap team-flag-circle-wrap"
    : "table-team-shield-wrap";
  const badge = normalizedFlagUrl ? (
    <TeamFlag
      flagUrl={normalizedFlagUrl}
      teamName={teamName}
      width={dimensions.width}
      height={dimensions.height}
      className={size === "table" ? undefined : "team-shield-svg"}
    />
  ) : (
    <TeamShield primary={primary} secondary={secondary} size={size} />
  );

  if (size === "table") {
    return (
      <span
        className={tableWrapClassName}
        data-tooltip={teamName}
        title={teamName}
      >
        {badge}
      </span>
    );
  }

  if (normalizedFlagUrl) {
    return <span className={`team-flag-circle-wrap-${size}`}>{badge}</span>;
  }

  return badge;
}

interface TableTeamBadgeProps {
  readonly primary: string;
  readonly secondary: string;
  readonly name: string;
  readonly flagUrl: string | undefined;
}

export function TableTeamBadge({
  primary,
  secondary,
  name,
  flagUrl,
}: TableTeamBadgeProps) {
  return (
    <TeamBadge
      primary={primary}
      secondary={secondary}
      teamName={name}
      flagUrl={flagUrl}
      size="table"
    />
  );
}
