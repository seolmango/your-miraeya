const CHOSUNG_STROKES = [
    8, 0, 8, 9, 0, 0, 0, 1, 0, 9, 0, 8, 0, 0, 1, 9, 0, 1, 0
];

const JUNGSUNG_STROKES = [
    1, 2, 0, 0, 1, 2, 2, 0, 1, 3, 0, 0, 2, 1, 3, 0, 0, 0, 0, 0, 0
];

const JONGSUNG_STROKES = [
    9, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0
];

function normalize(name: string): string {
    return name.replace(/[^가-힣]/g, "");
}

function getStrokes(ch: string): number {
    const code = ch.charCodeAt(0) - 44032;

    if (code < 0 || code > 11171) return 0;

    const jong = code % 28;
    const jung = Math.floor(code / 28) % 21;
    const cho = Math.floor(Math.floor(code / 28) / 21);

    return CHOSUNG_STROKES[cho] + JUNGSUNG_STROKES[jung] + JONGSUNG_STROKES[jong];
}

export function nameJeom(name1: string, name2: string): number {
    const n1 = normalize(name1);
    const n2 = normalize(name2);

    const minLength = Math.min(n1.length, n2.length);

    let strokes: number[] = [];
    for (let i = 0; i < minLength; i++) {
        strokes.push(getStrokes(n1[i]));
        strokes.push(getStrokes(n2[i]));
    }
    const longer = n1.length > n2.length ? n1 : n2;
    for (let i = minLength; i < longer.length; i++) {
        strokes.push(getStrokes(longer[i]));
    }

    if (strokes.length === 0) return 0;

    while (strokes.length > 2) {
        const nextStrokes: number[] = [];
        for (let i = 0; i < strokes.length - 1; i++) {
            nextStrokes.push((strokes[i] + strokes[i + 1]) % 10);
        }
        strokes = nextStrokes;
    }

    return strokes.length === 2 ? strokes[0] * 10 + strokes[1] : strokes[0];
}

export function isHangulName(name: string): boolean {
    return normalize(name).length > 0;
}
