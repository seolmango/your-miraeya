import { useState } from "react";
import type { CompanyMatch } from "../lib/matching";
import { generateResultImage } from "../lib/shareImage";
import { isInAppBrowser } from "../lib/inAppBrowser";
import "./ImageSaveButton.css";

interface ImageSaveButtonProps {
    userName: string;
    top: CompanyMatch[];
}

export function ImageSaveButton({ userName, top }: ImageSaveButtonProps) {
    const [loading, setLoading] = useState(false);
    const inApp = isInAppBrowser();

    async function handleSave() {
        setLoading(true);
        try {
            const blob = await generateResultImage(userName, top);
            if (!blob) return;
            const url = URL.createObjectURL(blob);

            if (inApp) {
                window.open(url, "_blank");
                setTimeout(() => URL.revokeObjectURL(url), 30000);
            } else {
                const a = document.createElement("a");
                a.href = url;
                a.download = `이름점_${userName}.png`;
                a.click();
                URL.revokeObjectURL(url);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="image-save">
            <button type="button" className="image-save-button" onClick={handleSave} disabled={loading}>
                {loading ? "이미지 만드는 중..." : "이미지 저장하기"}
            </button>
            {inApp && (
                <p className="image-save__hint">
                    앱 내장 브라우저에서는 이미지가 새 탭에 열려요. 길게 눌러 저장해주세요.
                </p>
            )}
        </div>
    );
}
