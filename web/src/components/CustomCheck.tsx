import { useState, type FormEvent } from "react";
import { nameJeom, isHangulName } from "../lib/nameJeom";
import "./CustomCheck.css";

interface CustomCheckProps {
    userName: string;
}

export function CustomCheck({ userName }: CustomCheckProps) {
    const [value, setValue] = useState("");
    const [result, setResult] = useState<{
        company: string;
        score: number;
        userToCompany: number;
        companyToUser: number;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const trimmed = value.trim();
        if (!isHangulName(trimmed)) {
            setError("한글이 포함된 기업 이름을 입력해 주세요.");
            setResult(null);
            return;
        }
        setError(null);
        const userToCompany = nameJeom(userName, trimmed);
        const companyToUser = nameJeom(trimmed, userName);
        setResult({
            company: trimmed,
            score: Math.round((userToCompany + companyToUser) / 2),
            userToCompany,
            companyToUser,
        });
    }

    return (
        <section className="custom-check">
            <div className="custom-check__head">
                <h2 className="custom-check__title">원하는 기업이 없나요?</h2>
                <p className="custom-check__subtitle">
                    기업 이름을 직접 입력해서 나와 그 기업의 종합 매칭 점수를 확인해보세요
                </p>
            </div>
            <form className="custom-check__form" onSubmit={handleSubmit}>
                <input
                    className="custom-check__input"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="기업 이름 · 예) 삼성전자"
                    aria-label="기업 이름 입력"
                    maxLength={20}
                />
                <button className="custom-check__button" type="submit">
                    확인
                </button>
            </form>
            {error && (
                <p className="custom-check__error" role="alert">
                    {error}
                </p>
            )}
            {result && (
                <div className="custom-check__result" aria-live="polite">
                    <p>
                        <strong>{userName}</strong> 님과 <strong>{result.company}</strong>의 종합 매칭 점수는{" "}
                        <strong className="custom-check__score">{result.score}점</strong>
                    </p>
                    <ul className="custom-check__directions">
                        <li>
                            내가 {result.company}을(를) 좋아하는 정도{" "}
                            <strong>{result.userToCompany}점</strong>
                        </li>
                        <li>
                            {result.company}이(가) 나를 좋아하는 정도{" "}
                            <strong>{result.companyToUser}점</strong>
                        </li>
                    </ul>
                </div>
            )}
        </section>
    );
}
