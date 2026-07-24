import type { CompanyMatch } from "./matching";

const WIDTH = 720;
const HEIGHT = 1280;
const SCALE = 2;

const PAPER = "#f3ede0";
const INK = "#1f1b16";
const INK_SOFT = "#4a4136";
const SEAL = "#b3231c";
const LINE = "#c9bfa8";

async function ensureFonts(): Promise<void> {
    await Promise.all([
        document.fonts.load('700 64px "Song Myung"'),
        document.fonts.load('400 24px "Pretendard"'),
        document.fonts.load('600 24px "Pretendard"'),
    ]);
    await document.fonts.ready;
}

function displayUrl(): string {
    const raw = window.location.href.replace(/^https?:\/\//, "");
    try {
        return decodeURIComponent(raw);
    } catch {
        return raw;
    }
}

function truncateToWidth(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
    if (ctx.measureText(text).width <= maxWidth) return text;
    let end = text.length;
    while (end > 0 && ctx.measureText(text.slice(0, end) + "…").width > maxWidth) end--;
    return text.slice(0, end) + "…";
}

function fitTitleFont(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
    maxSize: number,
    minSize: number,
): { size: number; text: string } {
    let size = maxSize;
    while (size > minSize) {
        ctx.font = `700 ${size}px "Song Myung"`;
        if (ctx.measureText(text).width <= maxWidth) return { size, text };
        size -= 2;
    }
    ctx.font = `700 ${minSize}px "Song Myung"`;
    return { size: minSize, text: truncateToWidth(ctx, text, maxWidth) };
}

function drawRow(
    ctx: CanvasRenderingContext2D,
    y: number,
    rank: number,
    item: CompanyMatch,
    highlight: boolean,
) {
    const nameX = 104;
    const scoreX = WIDTH - 64;
    const nameMaxWidth = 400;

    ctx.textAlign = "left";
    ctx.font = '400 18px "Pretendard"';
    ctx.fillStyle = highlight ? SEAL : INK_SOFT;
    ctx.fillText(String(rank).padStart(2, "0"), 56, y);

    ctx.font = highlight ? '600 24px "Pretendard"' : '400 24px "Pretendard"';
    ctx.fillStyle = highlight ? SEAL : INK;
    const fullName = item.original ? `${item.company} (${item.original})` : item.company;
    ctx.fillText(truncateToWidth(ctx, fullName, nameMaxWidth), nameX, y);

    ctx.textAlign = "right";
    ctx.font = '700 24px "Song Myung"';
    ctx.fillStyle = highlight ? SEAL : INK;
    ctx.fillText(`${item.score}점`, scoreX, y);

    ctx.strokeStyle = LINE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(56, y + 22);
    ctx.lineTo(WIDTH - 56, y + 22);
    ctx.stroke();
}

export async function generateResultImage(userName: string, top: CompanyMatch[]): Promise<Blob | null> {
    await ensureFonts();

    const canvas = document.createElement("canvas");
    canvas.width = WIDTH * SCALE;
    canvas.height = HEIGHT * SCALE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.scale(SCALE, SCALE);

    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 1;
    ctx.strokeRect(24, 24, WIDTH - 48, HEIGHT - 48);

    ctx.textAlign = "center";
    ctx.font = '400 18px "Pretendard"';
    ctx.fillStyle = INK_SOFT;
    ctx.fillText("이름이 정해준 내 평생직장 찾기", WIDTH / 2, 110);

    ctx.font = '400 28px "Pretendard"';
    ctx.fillStyle = INK;
    ctx.fillText(
        truncateToWidth(ctx, `${userName}님의 이름이 정해준 평생직장은`, WIDTH - 120),
        WIDTH / 2,
        185,
    );

    const top1 = top[0];
    ctx.textAlign = "center";
    const titleFit = fitTitleFont(ctx, top1.company, WIDTH - 120, 68, 32);
    ctx.fillStyle = INK;
    ctx.fillText(titleFit.text, WIDTH / 2, 280);

    if (top1.original) {
        ctx.font = '400 24px "Pretendard"';
        ctx.fillStyle = INK_SOFT;
        ctx.fillText(truncateToWidth(ctx, `(${top1.original})`, WIDTH - 120), WIDTH / 2, 320);
    }

    const circleY = 460;
    ctx.beginPath();
    ctx.arc(WIDTH / 2, circleY, 104, 0, Math.PI * 2);
    ctx.strokeStyle = SEAL;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(WIDTH / 2, circleY, 89, 0, Math.PI * 2);
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.7;
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.font = '700 64px "Song Myung"';
    ctx.fillStyle = SEAL;
    ctx.fillText(String(top1.score), WIDTH / 2, circleY + 24);
    ctx.font = '700 20px "Song Myung"';
    ctx.fillText("점", WIDTH / 2, circleY + 60);

    const top1Percentile = Math.max(0.1, Math.round((100 - top1.percentile) * 10) / 10);
    ctx.textAlign = "center";
    ctx.font = '400 16px "Pretendard"';
    ctx.fillStyle = INK_SOFT;
    ctx.fillText(`전체 기업 중 상위 ${top1Percentile}%의 매칭 점수입니다`, WIDTH / 2, 595);

    ctx.font = '600 18px "Pretendard"';
    ctx.fillStyle = INK;
    ctx.fillText(`나→기업 ${top1.userToCompany} · 기업→나 ${top1.companyToUser}`, WIDTH / 2, 624);

    ctx.textAlign = "center";
    ctx.font = '400 20px "Pretendard"';
    ctx.fillStyle = INK_SOFT;
    ctx.fillText("전체 선호도 랭킹 TOP 10", WIDTH / 2, 645);

    let y = 700;
    top.slice(0, 10).forEach((item, index) => {
        drawRow(ctx, y, index + 1, item, index === 0);
        y += 55;
    });

    ctx.textAlign = "center";
    ctx.font = '400 16px "Pretendard"';
    ctx.fillStyle = INK_SOFT;
    ctx.globalAlpha = 0.75;
    ctx.fillText(
        truncateToWidth(ctx, displayUrl(), WIDTH - 120),
        WIDTH / 2,
        HEIGHT - 40,
    );
    ctx.globalAlpha = 1;

    return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), "image/png");
    });
}
