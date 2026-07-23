import "./StampReveal.css";

interface StampRevealProps {
    userName: string;
    company: string;
    original: string | null;
    score: number;
}

export function StampReveal({ userName, company, original, score }: StampRevealProps) {
    return (
        <section className="stamp" aria-live="polite">
            <p className="stamp__lead">
                <strong>{userName}</strong> 님을 가장 원하는 기업은
            </p>
            <h2 className="stamp__company">
                {company}
                {original && <span className="stamp__original"> ({original})</span>}
            </h2>
            <div className="stamp__mark">
                <svg viewBox="0 0 160 160" aria-hidden="true">
                    <circle cx="80" cy="80" r="74" className="stamp__ring-outer" />
                    <circle cx="80" cy="80" r="62" className="stamp__ring-inner" />
                    <text x="80" y="90" textAnchor="middle" className="stamp__score">
                        {score}
                    </text>
                </svg>
                <span className="stamp__unit">점</span>
            </div>
        </section>
    );
}
