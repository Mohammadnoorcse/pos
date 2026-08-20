import React from "react";

export function ScallopBorder({ id, colors }) {
  return (
    <svg
      className="absolute top-0 left-0 right-0"
      width="100%"
      height="9"
      preserveAspectRatio="none"
      viewBox="0 0 30 9"
    >
      <defs>
        <pattern
          id={id}
          width="30"
          height="9"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="5" cy="0" r="5.5" fill={colors[0]} />
          <circle cx="15" cy="0" r="5.5" fill={colors[1]} />
          <circle cx="25" cy="0" r="5.5" fill={colors[2]} />
        </pattern>
      </defs>
      <rect width="30" height="9" fill={`url(#${id})`} />
    </svg>
  );
}