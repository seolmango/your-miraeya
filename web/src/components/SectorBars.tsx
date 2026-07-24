import { useState } from "react";
import type { SectorResult } from "../lib/matching";
import "./SectorBars.css";

interface SectorBarsProps {
    results: SectorResult[];
}

export function SectorBars({ results }: SectorBarsProps) {
    const [openId, setOpenId] = useState<string | null>(null);
    const max = Math.max(...results.map((r) => r.average), 1);

    return (
        <section className="sectors">
            <div className="sectors__head">
                <h2 className="sectors__title">섹터별 선호도</h2>
                <p className="sectors__subtitle">
                    섹터의 평균 종합 매칭 점수(나→기업 · 기업→나 평균)가 높은 순서로 줄 세웠습니다
                </p>
            </div>
            <ul className="sectors__list">
                {results.map((result) => {
                    const isOpen = openId === result.id;
                    return (
                        <li className="sectors__row" key={result.id}>
                            <button
                                type="button"
                                className="sectors__summary"
                                aria-expanded={isOpen}
                                onClick={() => setOpenId(isOpen ? null : result.id)}
                            >
                                <span className="sectors__label-line">
                                    <span className={`sectors__badge sectors__badge--${result.origin}`}>
                                        {result.origin === "domestic" ? "국내" : "해외"}
                                    </span>
                                    <span className="sectors__label">{result.label}</span>
                                    <span className="sectors__average">{result.average.toFixed(1)}</span>
                                    <span className={`sectors__chevron ${isOpen ? "sectors__chevron--open" : ""}`}>
                                        ▾
                                    </span>
                                </span>
                                <span className="sectors__bar-track">
                                    <span
                                        className="sectors__bar-fill"
                                        style={{ width: `${(result.average / max) * 100}%` }}
                                    />
                                </span>
                            </button>
                            {isOpen && (
                                <ol className="sectors__full">
                                    {result.all.map((item, index) => (
                                        <li className="sectors__full-row" key={item.company}>
                                            <span className="sectors__full-rank">{index + 1}</span>
                                            <span className="sectors__full-name">
                                                {item.company}
                                                {item.original && (
                                                    <span className="orig-tag"> ({item.original})</span>
                                                )}
                                            </span>
                                            <span className="sectors__full-score">{item.score}</span>
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
