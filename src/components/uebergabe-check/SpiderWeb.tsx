// src/components/uebergabe-check/SpiderWeb.tsx
//
// Sechsachsiges Netzdiagramm als reines Inline-SVG, bewusst ohne
// Chart-Bibliothek: kein zusätzliches Bundle, volle Kontrolle über die
// Markenfarben und sauber druck- bzw. PDF-fähig.
//
// Die Komponente nimmt mehrere Serien entgegen, obwohl heute nur eine
// gezeichnet wird. Damit ist der spätere Perspektivvergleich (Inhaber gegen
// Führungsebene gegen Schlüsselrollen) eine Datenfrage und keine Neuentwicklung
// des Diagramms. Achsenwerte erscheinen nur bei einer einzelnen Serie, bei
// mehreren wäre die Beschriftung sonst unlesbar.

import { DIMENSIONS } from "@/lib/uebergabe-check/content";
import { formatScore, type DimensionScore } from "@/lib/uebergabe-check/scoring";

export type ChartSeries = {
  id: string;
  /** Wird in der Legende angezeigt, sobald mehr als eine Serie vorliegt. */
  label: string;
  scores: DimensionScore[];
  color: string;
};

/** Farbreihenfolge für künftige Perspektiven. Erste Farbe ist die Markenfarbe. */
export const SERIES_COLORS = [
  "rgb(0,168,165)",
  "rgb(0,112,125)",
  "rgb(202,138,4)",
  "rgb(120,113,108)",
] as const;

// Die viewBox ist breiter als hoch, weil die vier seitlichen Achsen ihre
// Beschriftung horizontal nach außen legen. Mit einem quadratischen Feld
// würden Labels wie „Schlüsselpersonen“ am Rand abgeschnitten.
const WIDTH = 620;
const HEIGHT = 440;
const CX = WIDTH / 2;
const CY = HEIGHT / 2;
const RADIUS = 125;
const RINGS = [25, 50, 75, 100];

/** Achse i liegt bei -90° + i·60°, also Dimension 1 oben. */
function pointAt(index: number, value: number) {
  const angle = (-90 + index * 60) * (Math.PI / 180);
  const distance = (value / 100) * RADIUS;
  return {
    x: CX + Math.cos(angle) * distance,
    y: CY + Math.sin(angle) * distance,
  };
}

function polygon(values: number[]): string {
  return values
    .map((value, index) => {
      const { x, y } = pointAt(index, value);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export default function SpiderWeb({ series }: { series: ChartSeries[] }) {
  const single = series.length === 1;
  const primary = series[0];

  const summary = series
    .map((entry) => {
      const values = entry.scores
        .map(
          (score) =>
            `${DIMENSIONS[score.dimension - 1].title}: ${formatScore(score.score)} von 100 Punkten`
        )
        .join(". ");
      return single ? values : `${entry.label}. ${values}`;
    })
    .join(". ");

  return (
    <figure className="m-0 w-full">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full max-w-[560px]"
        role="img"
        aria-label={`Netzdiagramm der sechs Dimensionen. ${summary}.`}
      >
        <defs>
          <linearGradient id="uc-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(0,168,165)" stopOpacity="0.30" />
            <stop offset="100%" stopColor="rgb(0,112,125)" stopOpacity="0.16" />
          </linearGradient>
        </defs>

        {/* Ringe */}
        {RINGS.map((ring) => (
          <polygon
            key={ring}
            points={polygon(Array(6).fill(ring))}
            fill="none"
            stroke="rgba(15,23,42,0.10)"
            strokeWidth={ring === 100 ? 1.4 : 1}
          />
        ))}

        {/* Achsen */}
        {DIMENSIONS.map((dimension, index) => {
          const end = pointAt(index, 100);
          return (
            <line
              key={dimension.id}
              x1={CX}
              y1={CY}
              x2={end.x}
              y2={end.y}
              stroke="rgba(15,23,42,0.10)"
              strokeWidth={1}
            />
          );
        })}

        {/* Skalenbeschriftung entlang der oberen Achse */}
        {RINGS.map((ring) => (
          <text
            key={`ring-${ring}`}
            x={CX + 6}
            y={CY - (ring / 100) * RADIUS + 3}
            fontSize="9"
            fill="rgba(15,23,42,0.30)"
          >
            {ring}
          </text>
        ))}

        {/* Messwerte, eine Fläche je Serie */}
        {series.map((entry, seriesIndex) => {
          const values = entry.scores.map((score) => score.score);
          return (
            <g key={entry.id}>
              <polygon
                points={polygon(values)}
                fill={seriesIndex === 0 && single ? "url(#uc-fill)" : "none"}
                stroke={entry.color}
                strokeWidth={2}
                strokeLinejoin="round"
              />
              {values.map((value, index) => {
                const point = pointAt(index, value);
                return (
                  <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r={4}
                    fill="#fff"
                    stroke={entry.color}
                    strokeWidth={2}
                  />
                );
              })}
            </g>
          );
        })}

        {/* Achsenbeschriftung */}
        {DIMENSIONS.map((dimension, index) => {
          const anchor = pointAt(index, 100);
          // 26 % über den äußeren Ring hinaus, damit die Labels nicht am Netz kleben.
          const x = anchor.x + (anchor.x - CX) * 0.26;
          const y = anchor.y + (anchor.y - CY) * 0.26;

          const isVertical = Math.abs(x - CX) < 8;
          const align = isVertical ? "middle" : x > CX ? "start" : "end";
          // Über der Mitte nach oben ausrichten, darunter nach unten.
          const baseY = y < CY ? y - 6 : y + 12;

          return (
            <g key={dimension.id}>
              <text
                x={x}
                y={baseY}
                textAnchor={align}
                fontSize="11.5"
                fontWeight={600}
                fill="rgba(14,20,32,0.74)"
              >
                {dimension.axisLabel[0]}
              </text>
              <text
                x={x}
                y={baseY + 14}
                textAnchor={align}
                fontSize="11.5"
                fontWeight={600}
                fill="rgba(14,20,32,0.74)"
              >
                {dimension.axisLabel[1]}
              </text>
              {single && (
                <text
                  x={x}
                  y={baseY + 29}
                  textAnchor={align}
                  fontSize="12"
                  fontWeight={700}
                  fill="rgb(0,112,125)"
                >
                  {formatScore(primary.scores[index].score)}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legende nur bei mehreren Perspektiven */}
      {!single && (
        <figcaption className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2">
          {series.map((entry) => (
            <span
              key={entry.id}
              className="inline-flex items-center gap-2 text-[13px] text-slate-600"
            >
              <span
                aria-hidden
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: entry.color }}
              />
              {entry.label}
            </span>
          ))}
        </figcaption>
      )}
    </figure>
  );
}
