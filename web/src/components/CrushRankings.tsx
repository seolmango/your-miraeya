import type { CompanyMatch } from "../lib/matching";
import "./CrushRankings.css";

interface CrushListProps {
    title: string;
    subtitle: string;
    items: CompanyMatch[];
    lovedBy: "user" | "company";
}

function CrushList({ title, subtitle, items, lovedBy }: CrushListProps) {
    return (
        <div className="crush__col">
            <div className="crush__col-head">
                <h3 className="crush__col-title">{title}</h3>
                <p className="crush__col-subtitle">{subtitle}</p>
            </div>
            <ol className="crush__list">
                {items.map((item, index) => {
                    const mine = item.userToCompany;
                    const theirs = item.companyToUser;
                    const gap = lovedBy === "user" ? mine - theirs : theirs - mine;
                    return (
                        <li className="crush__row" key={item.company}>
                            <span className="crush__rank">{String(index + 1).padStart(2, "0")}</span>
                            <span className="crush__name">
                                {item.company}
                                {item.original && <span className="orig-tag"> ({item.original})</span>}
                            </span>
                            <span className="crush__scores">
                                <span className={lovedBy === "user" ? "crush__score--high" : ""}>나→기업 {mine}</span>
                                <span className={lovedBy === "company" ? "crush__score--high" : ""}>
                                    기업→나 {theirs}
                                </span>
                            </span>
                            <span className="crush__gap">+{gap}</span>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}

interface CrushRankingsProps {
    myOneSidedLove: CompanyMatch[];
    theirOneSidedLove: CompanyMatch[];
}

export function CrushRankings({ myOneSidedLove, theirOneSidedLove }: CrushRankingsProps) {
    return (
        <section className="crush">
            <div className="crush__head">
                <h2 className="crush__title">짝사랑 지수</h2>
                <p className="crush__subtitle">
                    같은 매칭 점수라도 마음의 크기는 다른 법. 누가 더 좋아하는지 따져봤습니다
                </p>
            </div>
            <div className="crush__grid">
                <CrushList
                    title="내가 짝사랑 중인 기업"
                    subtitle="나는 진심인데 기업은 뜨뜻미지근해요"
                    items={myOneSidedLove}
                    lovedBy="user"
                />
                <CrushList
                    title="나를 짝사랑하는 기업"
                    subtitle="기업은 진심인데 나는 뜨뜻미지근해요"
                    items={theirOneSidedLove}
                    lovedBy="company"
                />
            </div>
        </section>
    );
}
