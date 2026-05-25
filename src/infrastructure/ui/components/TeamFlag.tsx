"use client";

import { useState } from "react";

interface TeamFlagProps {
  readonly flagUrl: string;
  readonly teamName: string;
  readonly width: number;
  readonly height: number;
  readonly className: string | undefined;
}

export function TeamFlag({
  flagUrl,
  teamName,
  width,
  height,
  className,
}: TeamFlagProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !flagUrl.trim()) {
    return (
      <span
        aria-hidden="true"
        className={className}
        style={{ display: "inline-block", width, height }}
      />
    );
  }

  return (
    <img
      src={flagUrl}
      alt={teamName}
      width={width}
      height={height}
      className={className}
      style={{ objectFit: "cover" }}
      onError={() => setHasError(true)}
    />
  );
}
