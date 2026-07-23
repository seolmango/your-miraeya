import re

LETTER_MAP = {
    "A": "에이", "B": "비", "C": "씨", "D": "디", "E": "이", "F": "에프",
    "G": "지", "H": "에이치", "I": "아이", "J": "제이", "K": "케이", "L": "엘",
    "M": "엠", "N": "엔", "O": "오", "P": "피", "Q": "큐", "R": "알",
    "S": "에스", "T": "티", "U": "유", "V": "브이", "W": "더블유", "X": "엑스",
    "Y": "와이", "Z": "제트",
}

DIGIT_MAP = {
    "0": "공", "1": "일", "2": "이", "3": "삼", "4": "사",
    "5": "오", "6": "육", "7": "칠", "8": "팔", "9": "구",
}

WORD_OVERRIDES = {
    "NAVER": "네이버",
    "POSCO": "포스코",
    "KT&G": "케이티앤지",
    "S-OIL": "에스오일",
    "E&A": "이앤에이",
    "CJ ENM": "씨제이이엔엠",
    "CJ CGV": "씨제이씨지브이",
    "JYP ENT.": "제이와이피",
    "F&F": "에프앤에프",
    "T&D": "티앤디",
    "SFA반도체": "에스에프에이반도체",
    "ELECTRIC": "일렉트릭",
}

PREFERRED_STOCK_RE = re.compile(r"(\d*우B?)$")

ETF_MARKERS = [
    "KODEX", "TIGER", "ACE ", "SOL ", "HANARO", "KBSTAR", "ARIRANG",
    "KOSEF", "KINDEX", "TIMEFOLIO", "RISE ", "PLUS ", "WON ", "히어로즈",
]


def is_etf(name: str) -> bool:
    return any(marker in name for marker in ETF_MARKERS)


def is_preferred_stock(name: str, all_names: set) -> bool:
    m = PREFERRED_STOCK_RE.search(name)
    if not m or not m.group(1):
        return False
    base = name[: m.start()]
    return base in all_names and base != name


def koreanize(name: str) -> str:
    upper = name.upper()
    for word, reading in WORD_OVERRIDES.items():
        if word in upper:
            idx = upper.find(word)
            name = name[:idx] + reading + name[idx + len(word):]
            upper = name.upper()

    out = []
    for ch in name:
        if "가" <= ch <= "힣":
            out.append(ch)
        elif ch.upper() in LETTER_MAP:
            out.append(LETTER_MAP[ch.upper()])
        elif ch in DIGIT_MAP:
            out.append(DIGIT_MAP[ch])
        elif ch == "&":
            out.append("앤")
    return "".join(out)


def to_entry(raw: str) -> dict:
    korean = koreanize(raw)
    return {"korean": korean, "original": raw if raw != korean else None}


def clean_list(names):
    name_set = set(names)
    result = []
    for name in names:
        if is_etf(name):
            continue
        if is_preferred_stock(name, name_set):
            continue
        cleaned = koreanize(name)
        if cleaned:
            result.append(cleaned)
    return result
