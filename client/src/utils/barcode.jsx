import React from "react";

export function barcodePattern(text) {
  const bars = [];
  const push = (w) => bars.push({ w, black: bars.length % 2 === 0 });
  push(3);
  push(1);
  push(3);
  for (const ch of text || "") {
    const code = ch.charCodeAt(0);
    for (let b = 5; b >= 0; b--) {
      const bit = (code >> b) & 1;
      push(bit ? 3 : 1);
    }
  }
  push(3);
  push(1);
  push(3);
  return bars;
}

export function BarcodeSVG({ value }) {
  const bars = React.useMemo(() => barcodePattern(value), [value]);
  const unit = 2.6;
  let x = 0;
  const rects = [];
  
  bars.forEach((bar, i) => {
    const width = bar.w * unit;
    if (bar.black) {
      rects.push(
        <rect key={i} x={x} y={0} width={width} height={72} fill="#141414" />
      );
    }
    x += width;
  });
  
  const totalWidth = x || 1;
  
  return (
    <svg
      viewBox={`0 0 ${totalWidth} 72`}
      width="100%"
      height="72"
      preserveAspectRatio="xMidYMid meet"
    >
      {rects}
    </svg>
  );
}