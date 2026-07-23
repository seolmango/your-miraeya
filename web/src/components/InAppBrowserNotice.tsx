import { useState } from "react";
import { isInAppBrowser, openInExternalBrowser } from "../lib/inAppBrowser";
import "./InAppBrowserNotice.css";

export function InAppBrowserNotice() {
    const [copied, setCopied] = useState(false);

    if (!isInAppBrowser()) return null;

    async function handleClick() {
        const result = await openInExternalBrowser();
        if (result === "copied") {
            setCopied(true);
            setTimeout(() => setCopied(false), 4000);
        }
    }

    return (
        <div className="in-app-notice">
            <p className="in-app-notice__text">
                {copied
                    ? "링크가 복사됐어요. Safari를 열어 주소창에 붙여넣어 주세요."
                    : "지금 앱 내장 브라우저로 보고 있어요. 이미지 저장·공유 기능이 제대로 동작하지 않을 수 있어요."}
            </p>
            {!copied && (
                <button type="button" className="in-app-notice__button" onClick={handleClick}>
                    외부 브라우저로 열기
                </button>
            )}
        </div>
    );
}
