import { useState, type FormEvent } from "react";
import { isHangulName } from "../lib/nameJeom";
import "./Hero.css";

interface HeroProps {
    onSubmit: (name: string) => void;
    hasResult: boolean;
}

export function Hero({ onSubmit, hasResult }: HeroProps) {
    const [value, setValue] = useState("");
    const [error, setError] = useState<string | null>(null);

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const trimmed = value.trim();
        if (!isHangulName(trimmed)) {
            setError("한글 이름을 입력해 주세요. 예: 홍길동");
            return;
        }
        setError(null);
        onSubmit(trimmed);
    }

    return (
        <header className={`hero ${hasResult ? "hero--compact" : ""}`}>
            <div className="hero__inner">
                <h1 className="hero__title">이름을 입력하면 이름이 정해준 당신의 평생직장을 찾아드립니다</h1>
                <form className="hero__form" onSubmit={handleSubmit}>
                    <input
                        className="hero__input"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="이름을 입력하세요 · 예) 홍길동"
                        aria-label="이름 입력"
                        maxLength={10}
                    />
                    <button className="hero__button" type="submit">
                        확인하기
                    </button>
                </form>
                {error && (
                    <p className="hero__error" role="alert">
                        {error}
                    </p>
                )}
                {!hasResult && (
                    <button
                        type="button"
                        className="hero__info"
                        onClick={() =>
                            document
                                .getElementById("algorithm-explainer")
                                ?.scrollIntoView({ behavior: "smooth", block: "start" })
                        }
                    >
                        <strong>
                            <svg className="hero__info-icon" viewBox="0 0 20 20" aria-hidden="true">
                                <circle cx="10" cy="10" r="9" />
                                <text x="10" y="14" textAnchor="middle">
                                    ?
                                </text>
                            </svg>
                            원리가 뭔가요?
                        </strong>
                        아주 과학적이고 신빙성이 높은 이름점(Ireum-Jeom) 매칭 엔진™으로 나와 기업이 서로
                        좋아하는 정도를 각각 구해 종합 매칭 점수를 계산합니다. 스크롤해서 계산 과정을 직접
                        확인해보세요 ↓
                    </button>
                )}
            </div>
        </header>
    );
}
