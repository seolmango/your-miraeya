import { useState } from "react";
import type { CompanyMatch } from "../lib/matching";
import { generateResultImage } from "../lib/shareImage";
import { isInAppBrowser } from "../lib/inAppBrowser";
import "./ShareButton.css";

interface ShareButtonProps {
    userName: string;
    company: string;
    top: CompanyMatch[];
}

type Status = "idle" | "loading" | "shared" | "fallback";

export function ShareButton({ userName, company, top }: ShareButtonProps) {
    const [status, setStatus] = useState<Status>("idle");

    async function handleShare() {
        setStatus("loading");

        const url = window.location.href;
        const text = `${userName}님의 이름이 정해준 평생직장은 ${company}입니다. 과연 당신은? ${url}`;
        const blob = await generateResultImage(userName, top);
        const file = blob ? new File([blob], `이름점_${userName}.png`, { type: "image/png" }) : null;

        const canShareFile = !!(file && navigator.canShare?.({ files: [file] }));
        if (canShareFile || navigator.share) {
            try {
                await navigator.share(canShareFile ? { files: [file as File], text } : { text });
                setStatus("shared");
                setTimeout(() => setStatus("idle"), 2000);
            } catch {
                setStatus("idle");
            }
            return;
        }

        if (file) {
            const objectUrl = URL.createObjectURL(file);
            if (isInAppBrowser()) {
                window.open(objectUrl, "_blank");
                setTimeout(() => URL.revokeObjectURL(objectUrl), 30000);
            } else {
                const a = document.createElement("a");
                a.href = objectUrl;
                a.download = file.name;
                document.body.appendChild(a);
                a.click();
                a.remove();
                // 즉시 해제하면 다운로드가 시작되기 전에 URL이 사라지는 브라우저가 있다
                setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
            }
        }

        try {
            await navigator.clipboard.writeText(text);
        } catch {
            // 클립보드 접근이 막힌 환경
        }

        setStatus("fallback");
        setTimeout(() => setStatus("idle"), 3000);
    }

    const label = {
        idle: "결과 공유하기",
        loading: "준비 중...",
        shared: "공유했어요",
        fallback: isInAppBrowser() ? "새 탭에 이미지 저장 · 문구 복사 완료" : "이미지 저장 · 문구 복사 완료",
    }[status];

    return (
        <button
            type="button"
            className="share-button"
            onClick={handleShare}
            disabled={status === "loading"}
        >
            {label}
        </button>
    );
}
