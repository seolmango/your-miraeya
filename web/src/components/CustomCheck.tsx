import { useState, type FormEvent } from "react";
import { nameJeom, isHangulName } from "../lib/nameJeom";
import "./CustomCheck.css";

interface CustomCheckProps {
    userName: string;
}

export function CustomCheck({ userName }: CustomCheckProps) {
    const [value, setValue] = useState("");
    const [result, setResult] = useState<{ company: string; score: number } | null>(null);
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
        setResult({ company: trimmed, score: nameJeom(trimmed, userName) });
    }

    return (
        <section className="custom-check">
            <div className="custom-check__head">
                <h2 className="custom-check__title">원하는 기업이 없나요?</h2>
                <p className="custom-check__subtitle">
                    기업 이름을 직접 입력해서 그 기업이 나를 얼마나 원하는지 확인해보세요
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
                <p className="custom-check__result" aria-live="polite">
                    <strong>{result.company}</strong>이(가) <strong>{userName}</strong> 님을 원하는 정도는{" "}
                    <strong className="custom-check__score">{result.score}점</strong>
                </p>
            )}
        </section>
    );
}
