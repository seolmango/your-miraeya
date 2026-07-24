import { useState } from "react";
import type { ThemeResult } from "../lib/matching";
import "./ThemeSection.css";

interface ThemeSectionProps {
    results: ThemeResult[];
}

const COLLAPSED_COUNT = 5;

export function ThemeSection({ results }: ThemeSectionProps) {
    const [activeId, setActiveId] = useState(results[0]?.id);
    const [expanded, setExpanded] = useState(false);
    const active = results.find((r) => r.id === activeId) ?? results[0];
    const visible = expanded ? active.all : active.all.slice(0, COLLAPSED_COUNT);

    function selectTab(id: string) {
        setActiveId(id);
        setExpanded(false);
    }

    return (
        <section className="theme">
            <div className="theme__head">
                <h2 className="theme__title">테마별 베스트 매치</h2>
                <p className="theme__subtitle">
                    시총 랭킹 안에서 종합 매칭 점수(나→기업 · 기업→나 평균)가 가장 높은 곳은 어디일까
                </p>
            </div>
            <div className="theme__tabs" role="tablist">
                {results.map((result) => (
                    <button
                        key={result.id}
                        role="tab"
                        aria-selected={result.id === active.id}
                        className={`theme__tab ${result.id === active.id ? "theme__tab--active" : ""}`}
                        onClick={() => selectTab(result.id)}
                    >
                        {result.label}
                    </button>
                ))}
            </div>
            <ol className="theme__list">
                {visible.map((item, index) => (
                    <li className="theme__row" key={item.company}>
                        <span className="theme__rank">{index + 1}</span>
                        <span className="theme__name">
                            {item.company}
                            {item.original && <span className="orig-tag"> ({item.original})</span>}
                        </span>
                        <span className="theme__score">{item.score}점</span>
                    </li>
                ))}
            </ol>
            <button type="button" className="theme__toggle" onClick={() => setExpanded((v) => !v)}>
                {expanded ? "접기" : `전체 ${active.all.length}개 보기`}
            </button>
        </section>
    );
}
