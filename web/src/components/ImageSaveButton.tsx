import { useState } from "react";
import type { CompanyMatch } from "../lib/matching";
import { generateResultImage } from "../lib/shareImage";
import "./ImageSaveButton.css";

interface ImageSaveButtonProps {
    userName: string;
    top: CompanyMatch[];
}

export function ImageSaveButton({ userName, top }: ImageSaveButtonProps) {
    const [loading, setLoading] = useState(false);

    async function handleSave() {
        setLoading(true);
        try {
            const blob = await generateResultImage(userName, top);
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `이름점_${userName}.png`;
            a.click();
            URL.revokeObjectURL(url);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button type="button" className="image-save-button" onClick={handleSave} disabled={loading}>
            {loading ? "이미지 만드는 중..." : "이미지 저장하기"}
        </button>
    );
}
