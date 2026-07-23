const IN_APP_PATTERNS = [/KAKAOTALK/i, /Instagram/i, /FBAN|FBAV/i, /Line\//i, /NAVER\(/i, /Whale/i];

export function isInAppBrowser(): boolean {
    return IN_APP_PATTERNS.some((pattern) => pattern.test(navigator.userAgent));
}
