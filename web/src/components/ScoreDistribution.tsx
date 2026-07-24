import { useRef, useState } from "react";
import type { ScoreDistribution as ScoreDistributionData } from "../lib/matching";
import "./ScoreDistribution.css";

interface ScoreDistributionProps {
    distribution: ScoreDistributionData;
    topCompany: string;
    topScore: number;
}

const WIDTH = 640;
const HEIGHT = 260;
const PAD_L = 30;
const PAD_R = 8;
const PAD_T = 12;
const PAD_B = 26;

function normalPdf(x: number, mean: number, std: number): number {
    return (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-((x - mean) ** 2) / (2 * std * std));
}

export function ScoreDistribution({ distribution, topCompany, topScore }: ScoreDistributionProps) {
    const { binSize, bins, mean, std, total, topBinIndex } = distribution;
    const [hover, setHover] = useState<{ index: number; x: number; y: number } | null>(null);
    const wrapRef = useRef<HTMLDivElement>(null);

    const plotW = WIDTH - PAD_L - PAD_R;
    const plotH = HEIGHT - PAD_T - PAD_B;
    const maxCount = Math.max(...bins);
    const yMax = Math.max(4, Math.ceil(maxCount / 5) * 5);
    const binCount = bins.length;
    const barSlot = plotW / binCount;
    const barW = Math.min(20, barSlot - 2);

    const yFor = (count: number) => PAD_T + plotH - (count / yMax) * plotH;

    const curvePoints: string[] = [];
    for (let x = 0; x <= 100; x += 2) {
        const density = normalPdf(x, mean, std) * total * binSize;
        const px = PAD_L + (x / 100) * plotW;
        const py = yFor(density);
        curvePoints.push(`${x === 0 ? "M" : "L"}${px},${py}`);
    }

    function handleMove(index: number, event: React.MouseEvent) {
        const rect = wrapRef.current?.getBoundingClientRect();
        if (!rect) return;
        setHover({ index, x: event.clientX - rect.left, y: event.clientY - rect.top });
    }

    return (
        <section className="score-dist">
            <div className="score-dist__head">
                <h2 className="score-dist__title">종합 매칭 점수 분포</h2>
                <p className="score-dist__subtitle">
                    {topCompany}의 {topScore}점이 전체 {total}개 기업 중 어디쯤인지 보여드립니다
                </p>
            </div>

            <div className="score-dist__stats">
                <div className="score-dist__stat">
                    <span className="score-dist__stat-label">평균</span>
                    <span className="score-dist__stat-value">{mean.toFixed(1)}점</span>
                </div>
                <div className="score-dist__stat">
                    <span className="score-dist__stat-label">표준편차</span>
                    <span className="score-dist__stat-value">{std.toFixed(1)}</span>
                </div>
                <div className="score-dist__stat">
                    <span className="score-dist__stat-label">1위 점수</span>
                    <span className="score-dist__stat-value score-dist__stat-value--seal">{topScore}점</span>
                </div>
            </div>

            <div className="score-dist__legend">
                <span className="score-dist__legend-item">
                    <span className="score-dist__swatch score-dist__swatch--bar" /> 기업 분포
                </span>
                <span className="score-dist__legend-item">
                    <span className="score-dist__swatch score-dist__swatch--top" /> 1위 구간
                </span>
                <span className="score-dist__legend-item">
                    <span className="score-dist__swatch score-dist__swatch--curve" /> 동일 평균·표준편차 정규분포
                </span>
            </div>

            <div className="score-dist__chart-wrap" ref={wrapRef}>
                <svg className="score-dist__svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
                    {Array.from({ length: yMax / 5 + 1 }).map((_, i) => {
                        const value = i * 5;
                        const y = yFor(value);
                        return (
                            <g key={value}>
                                <line
                                    className="score-dist__gridline"
                                    x1={PAD_L}
                                    x2={WIDTH - PAD_R}
                                    y1={y}
                                    y2={y}
                                />
                                <text className="score-dist__axis-text" x={PAD_L - 6} y={y + 3} textAnchor="end">
                                    {value}
                                </text>
                            </g>
                        );
                    })}

                    {[0, 20, 40, 60, 80, 100].map((v) => (
                        <text
                            key={v}
                            className="score-dist__axis-text"
                            x={PAD_L + (v / 100) * plotW}
                            y={HEIGHT - PAD_B + 16}
                            textAnchor="middle"
                        >
                            {v}
                        </text>
                    ))}

                    {bins.map((count, i) => {
                        const x = PAD_L + i * barSlot + (barSlot - barW) / 2;
                        const yTop = yFor(count);
                        const h = PAD_T + plotH - yTop;
                        if (h <= 0) return null;
                        const r = Math.min(3, h);
                        const isTop = i === topBinIndex;
                        return (
                            <path
                                key={i}
                                className={`score-dist__bar ${isTop ? "score-dist__bar--top" : ""}`}
                                d={`M${x},${yTop + r}
                                    Q${x},${yTop} ${x + r},${yTop}
                                    L${x + barW - r},${yTop}
                                    Q${x + barW},${yTop} ${x + barW},${yTop + r}
                                    L${x + barW},${PAD_T + plotH}
                                    L${x},${PAD_T + plotH} Z`}
                                onMouseMove={(e) => handleMove(i, e)}
                                onMouseLeave={() => setHover(null)}
                            />
                        );
                    })}

                    <path className="score-dist__curve" d={curvePoints.join(" ")} />
                </svg>

                {hover && (
                    <div
                        className="score-dist__tooltip"
                        style={{ left: hover.x, top: hover.y }}
                    >
                        {hover.index * binSize}~{hover.index * binSize + binSize - 1}점 · {bins[hover.index]}개 기업
                    </div>
                )}
            </div>
        </section>
    );
}
