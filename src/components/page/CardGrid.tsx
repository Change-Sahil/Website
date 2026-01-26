type CardItem = {
  title: string;
  text: string;
};

type CardGridProps = {
  items: CardItem[];
  columns?: 2 | 3;
};

export default function CardGrid({
  items,
  columns = 3
}: CardGridProps) {
  const gridCols =
    columns === 2
      ? "md:grid-cols-2"
      : "md:grid-cols-3";

  return (
    <div className={`grid gap-6 ${gridCols}`}>
      {items.map((item, i) => (
        <div key={i} className="card">
          <div className="font-semibold">
            {item.title}
          </div>
          <p className="mt-3 text-sm leading-6 muted">
            {item.text}
          </p>
        </div>
      ))}
    </div>
  );
}
