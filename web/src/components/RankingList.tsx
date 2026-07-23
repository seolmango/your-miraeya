import type { CompanyMatch } from "../lib/matching";
import "./RankingList.css";

interface RankingListProps {
    title: string;
    subtitle?: string;
    items: CompanyMatch[];
}

export function RankingList({ title, subtitle, items }: RankingListProps) {
    return (
        <section className="ranking">
            <div className="ranking__head">
                <h2 className="ranking__title">{title}</h2>
                {subtitle && <p className="ranking__subtitle">{subtitle}</p>}
            </div>
            <ol className="ranking__list">
                {items.map((item, index) => (
                    <li className="ranking__row" key={item.company}>
                        <span className="ranking__rank">{String(index + 1).padStart(2, "0")}</span>
                        <span className="ranking__name">
                            {item.company}
                            {item.original && <span className="orig-tag"> ({item.original})</span>}
                        </span>
                        <span className="ranking__bar-track">
                            <span
                                className="ranking__bar-fill"
                                style={{ width: `${Math.max(item.score, 4)}%` }}
                            />
                        </span>
                        <span className="ranking__score">{item.score}</span>
                    </li>
                ))}
            </ol>
        </section>
    );
}
