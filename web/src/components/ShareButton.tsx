import { useState } from "react";
import "./ShareButton.css";

interface ShareButtonProps {
    userName: string;
    company: string;
    score: number;
}

export function ShareButton({ userName, company, score }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    async function handleShare() {
        const text = `${userName}님을 가장 원하는 기업은 ${company}(${score}점)! 내 결과도 확인해보기`;
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({ text, url });
            } catch {
                // 사용자가 공유를 취소한 경우
            }
            return;
        }

        try {
            await navigator.clipboard.writeText(`${text}\n${url}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // 클립보드 접근이 막힌 환경
        }
    }

    return (
        <button type="button" className="share-button" onClick={handleShare}>
            {copied ? "링크가 복사됐어요" : "결과 공유하기"}
        </button>
    );
}
