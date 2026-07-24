import "./StampReveal.css";

interface StampRevealProps {
    userName: string;
    company: string;
    original: string | null;
    score: number;
    percentile: number;
    userToCompany: number;
    companyToUser: number;
}

export function StampReveal({
    userName,
    company,
    original,
    score,
    percentile,
    userToCompany,
    companyToUser,
}: StampRevealProps) {
    const topRatio = Math.max(0.1, Math.round((100 - percentile) * 10) / 10);

    return (
        <section className="stamp" aria-live="polite">
            <p className="stamp__lead">
                <strong>{userName}</strong> 님의 이름이 정해준 평생직장은
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
            <p className="stamp__percentile">전체 기업 중 상위 {topRatio}%의 매칭 점수입니다</p>
            <div className="stamp__breakdown">
                <span>
                    내가 {company}을(를) 좋아하는 정도 <strong>{userToCompany}</strong>
                </span>
                <span className="stamp__breakdown-divider" aria-hidden="true" />
                <span>
                    {company}이(가) 나를 좋아하는 정도 <strong>{companyToUser}</strong>
                </span>
            </div>
        </section>
    );
}
