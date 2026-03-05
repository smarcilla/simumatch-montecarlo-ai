import type { ReactElement } from "react";

interface IconProps {
  readonly className?: string;
}

interface TableTeamShieldProps {
  readonly primary: string;
  readonly secondary: string;
  readonly name: string;
}

export function TableTeamShield({
  primary,
  secondary,
  name,
}: TableTeamShieldProps) {
  const clipId = `clip-tbl-${primary.replace("#", "")}`;
  return (
    <span className="table-team-shield-wrap" data-tooltip={name} title={name}>
      <svg
        width="20"
        height="24"
        viewBox="0 0 40 46"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={name}
      >
        <defs>
          <clipPath id={clipId}>
            <path d="M20 2L4 8V22C4 32 11.5 40.5 20 44C28.5 40.5 36 32 36 22V8L20 2Z" />
          </clipPath>
        </defs>
        <path
          d="M20 2L4 8V22C4 32 11.5 40.5 20 44C28.5 40.5 36 32 36 22V8L20 2Z"
          fill={primary}
        />
        <rect
          x="24"
          y="0"
          width="12"
          height="46"
          fill={secondary}
          clipPath={`url(#${clipId})`}
        />
        <path
          d="M20 2L4 8V22C4 32 11.5 40.5 20 44C28.5 40.5 36 32 36 22V8L20 2Z"
          stroke={secondary}
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
      </svg>
    </span>
  );
}

function RightFootIcon({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 13 L3 7 Q3 4 6 4 L9 4 Q11 4 11 6 L11 8 L13 8 L13 11 Q13 13 11 13 Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

function LeftFootIcon({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M13 13 L13 7 Q13 4 10 4 L7 4 Q5 4 5 6 L5 8 L3 8 L3 11 Q3 13 5 13 Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

function HeadIcon({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="8" cy="6" r="4" fill="currentColor" opacity="0.85" />
      <path
        d="M4 13 Q4 10 8 10 Q12 10 12 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}

function OtherBodyPartIcon({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="8"
        r="5"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.85"
      />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

function CornerIcon({ className }: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <line
        x1="4"
        y1="2"
        x2="4"
        y2="14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <polygon points="4,2 13,5 4,9" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

function PenaltyIcon({ className }: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.6"
      />
      <circle cx="8" cy="8" r="2.5" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

function SetPieceIcon({ className }: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <line
        x1="2"
        y1="13"
        x2="14"
        y2="13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="8" cy="9" r="3" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

function RegularIcon({ className }: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="8"
        r="5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.85"
      />
      <path
        d="M8 2.5 L9.5 6 L13 6.5 L10.5 9 L11 12.5 L8 11 L5 12.5 L5.5 9 L3 6.5 L6.5 6 Z"
        fill="currentColor"
        opacity="0.4"
      />
    </svg>
  );
}

function AssistedIcon({ className }: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2 8 L10 8 M7 5 L10 8 L7 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
      <circle cx="13" cy="8" r="2" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

function ThrowInIcon({ className }: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="8" cy="3" r="2" fill="currentColor" opacity="0.85" />
      <path
        d="M8 5 L8 10 M4 7 L8 6 M8 6 L12 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.85"
      />
      <circle cx="3" cy="8" r="1.5" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

function FastBreakIcon({ className }: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2 5 L8 2 L6 7 L11 5 L5 14 L7 9 L2 11 Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

function GoalIcon({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="8"
        r="5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.85"
      />
      <polygon
        points="8,5.2 9.7,6.9 9,9.1 7,9.1 6.3,6.9"
        fill="currentColor"
        opacity="0.8"
      />
      <line
        x1="8"
        y1="2.5"
        x2="8"
        y2="5.2"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.6"
      />
      <line
        x1="11.5"
        y1="4.8"
        x2="9.7"
        y2="6.9"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.6"
      />
      <line
        x1="10.7"
        y1="10.5"
        x2="9"
        y2="9.1"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.6"
      />
      <line
        x1="5.3"
        y1="10.5"
        x2="7"
        y2="9.1"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.6"
      />
      <line
        x1="4.5"
        y1="4.8"
        x2="6.3"
        y2="6.9"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.6"
      />
    </svg>
  );
}

function SaveIcon({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 13 L3 8.5 Q3 8 3.8 8 L3.8 6 Q3.8 5 4.8 5 L4.8 8 L5.8 8 L5.8 4.5 Q5.8 3.5 6.8 3.5 L6.8 8 L7.8 8 L7.8 5 Q7.8 4 8.8 4 L8.8 8.5 L9.8 8.5 Q10.8 8.5 10.8 9.5 L10.8 11 Q10.8 13 8.8 13 Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

function MissIcon({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2 5 L2 13 M8 5 L8 13 M2 5 L8 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
      <path
        d="M9 10 L14 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M12 4 L14 5 L13 7"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
    </svg>
  );
}

function BlockIcon({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="2"
        y="4"
        width="5"
        height="3"
        rx="1"
        fill="currentColor"
        opacity="0.85"
      />
      <rect
        x="9"
        y="4"
        width="5"
        height="3"
        rx="1"
        fill="currentColor"
        opacity="0.85"
      />
      <rect
        x="2"
        y="9"
        width="5"
        height="3"
        rx="1"
        fill="currentColor"
        opacity="0.85"
      />
      <rect
        x="9"
        y="9"
        width="5"
        height="3"
        rx="1"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

function PostIcon({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 3 L4 13 M12 3 L12 13 M4 3 L12 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
    </svg>
  );
}

const BODY_PART_ICONS: Record<
  string,
  { icon: (p: IconProps) => ReactElement; label: string }
> = {
  "right-foot": { icon: RightFootIcon, label: "Pie derecho" },
  "left-foot": { icon: LeftFootIcon, label: "Pie izquierdo" },
  head: { icon: HeadIcon, label: "Cabeza" },
  other: { icon: OtherBodyPartIcon, label: "Otro" },
};

const SITUATION_ICONS: Record<
  string,
  { icon: (p: IconProps) => ReactElement; label: string }
> = {
  regular: { icon: RegularIcon, label: "Jugada" },
  assisted: { icon: AssistedIcon, label: "Asistido" },
  corner: { icon: CornerIcon, label: "Córner" },
  penalty: { icon: PenaltyIcon, label: "Penalti" },
  "set-piece": { icon: SetPieceIcon, label: "Balón parado" },
  "free-kick": { icon: SetPieceIcon, label: "Falta" },
  "throw-in-set-piece": { icon: ThrowInIcon, label: "Saque lateral" },
  "fast-break": { icon: FastBreakIcon, label: "Contragolpe" },
};

const SHOT_TYPE_ICONS: Record<
  string,
  { icon: (p: IconProps) => ReactElement; label: string }
> = {
  goal: { icon: GoalIcon, label: "Gol" },
  save: { icon: SaveIcon, label: "Parada" },
  miss: { icon: MissIcon, label: "Fuera" },
  block: { icon: BlockIcon, label: "Bloqueado" },
  post: { icon: PostIcon, label: "Poste" },
};

interface ShotIconProps {
  readonly value: string;
  readonly className?: string;
}

export function BodyPartIcon({ value, className }: ShotIconProps) {
  const entry = BODY_PART_ICONS[value];
  if (!entry) return <span className={className}>{value}</span>;
  const Icon = entry.icon;
  return (
    <span
      className={`shot-icon-wrapper ${className ?? ""}`}
      data-tooltip={entry.label}
      title={entry.label}
    >
      <Icon />
    </span>
  );
}

export function SituationIcon({ value, className }: ShotIconProps) {
  const entry = SITUATION_ICONS[value];
  if (!entry) return <span className={className}>{value}</span>;
  const Icon = entry.icon;
  return (
    <span
      className={`shot-icon-wrapper ${className ?? ""}`}
      data-tooltip={entry.label}
      title={entry.label}
    >
      <Icon />
    </span>
  );
}

export function ShotTypeIcon({ value, className }: ShotIconProps) {
  const entry = SHOT_TYPE_ICONS[value];
  if (!entry) return <span className={className}>{value}</span>;
  const Icon = entry.icon;
  return (
    <span
      className={`shot-icon-wrapper ${className ?? ""}`}
      data-tooltip={entry.label}
      title={entry.label}
    >
      <Icon />
    </span>
  );
}
