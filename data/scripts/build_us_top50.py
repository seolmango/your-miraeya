import json
import sys

import requests
from bs4 import BeautifulSoup

sys.path.insert(0, "data/scripts")
from koreanize import koreanize

URL = "https://companiesmarketcap.com/usa/largest-companies-in-the-usa-by-market-cap/"
HEADERS = {"User-Agent": "Mozilla/5.0"}
TOP_N = 50

TICKER_TO_KOREAN = {
    "NVDA": "엔비디아",
    "AAPL": "애플",
    "GOOG": "알파벳",
    "MSFT": "마이크로소프트",
    "AMZN": "아마존",
    "AVGO": "브로드컴",
    "META": "메타",
    "SPCX": "스페이스엑스",
    "TSLA": "테슬라",
    "MU": "마이크론",
    "BRK-B": "버크셔해서웨이",
    "LLY": "일라이릴리",
    "JPM": "제이피모건",
    "AMD": "에이앰디",
    "WMT": "월마트",
    "V": "비자",
    "XOM": "엑슨모빌",
    "JNJ": "존슨앤드존슨",
    "INTC": "인텔",
    "MA": "마스터카드",
    "ABBV": "애브비",
    "AMAT": "어플라이드머티리얼즈",
    "CSCO": "시스코",
    "BAC": "뱅크오브아메리카",
    "CAT": "캐터필러",
    "COST": "코스트코",
    "LRCX": "램리서치",
    "CVX": "셰브런",
    "UNH": "유나이티드헬스",
    "GE": "제너럴일렉트릭",
    "ORCL": "오라클",
    "KO": "코카콜라",
    "PG": "피앤지",
    "MS": "모건스탠리",
    "HD": "홈디포",
    "MRK": "머크",
    "GS": "골드만삭스",
    "PM": "필립모리스인터내셔널",
    "PLTR": "팔란티어",
    "DELL": "델",
    "NFLX": "넷플릭스",
    "KLAC": "케이엘에이",
    "RTX": "알티엑스",
    "GEV": "지이버노바",
    "PANW": "팔로알토네트웍스",
    "WFC": "웰스파고",
    "TXN": "텍사스인스트루먼츠",
    "SNDK": "샌디스크",
    "AXP": "아메리칸익스프레스",
    "ANET": "아리스타네트웍스",
    "C": "씨티그룹",
    "TMO": "써모피셔사이언티픽",
    "WDC": "웨스턴디지털",
    "AMGN": "암젠",
    "APH": "앰피놀",
    "TMUS": "티모바일",
    "MRVL": "마벨테크놀로지",
    "IBM": "아이비엠",
    "CRWD": "크라우드스트라이크",
    "MCD": "맥도날드",
    "NEE": "넥스트에라에너지",
    "UNP": "유니언퍼시픽",
    "ADI": "아날로그디바이스",
    "PEP": "펩시코",
    "VZ": "버라이즌",
    "QCOM": "퀄컴",
    "SCHW": "찰스슈왑",
    "ABT": "애보트",
    "WELL": "웰타워",
    "BLK": "블랙록",
    "TJX": "티제이엑스",
    "BA": "보잉",
    "DE": "존디어",
    "DIS": "디즈니",
    "GILD": "길리어드사이언스",
    "T": "에이티앤티",
    "IBKR": "인터랙티브브로커스",
    "BX": "블랙스톤",
    "SCCO": "서던코퍼",
    "COP": "코노코필립스",
    "UBER": "우버",
    "PFE": "화이자",
    "APP": "앱러빈",
    "PLD": "프로로지스",
    "CVS": "씨브이에스헬스",
    "GLW": "코닝",
    "BKNG": "부킹닷컴",
    "CRM": "세일즈포스",
    "DHR": "다나허",
    "LMT": "록히드마틴",
    "SPGI": "에스앤피글로벌",
    "BMY": "브리스톨마이어스스큅",
    "PH": "파커하니핀",
    "COF": "캐피털원",
    "MO": "알트리아그룹",
    "VRTX": "버텍스파마슈티컬스",
    "ISRG": "인튜이티브서지컬",
    "SYK": "스트라이커",
    "PGR": "프로그레시브",
    "VRT": "버티브",
}


def fetch_rows():
    res = requests.get(URL, headers=HEADERS, timeout=15)
    soup = BeautifulSoup(res.text, "lxml")
    rows = []
    for tr in soup.select("table tbody tr"):
        name_div = tr.select_one(".company-name")
        code_div = tr.select_one(".company-code")
        if not name_div or not code_div:
            continue
        rows.append((name_div.get_text(strip=True), code_div.get_text(strip=True)))
    return rows


def main():
    rows = fetch_rows()
    result = []
    unmapped = []
    for name, ticker in rows:
        if len(result) >= TOP_N:
            break
        korean = TICKER_TO_KOREAN.get(ticker)
        if korean is None:
            korean = koreanize(name)
            unmapped.append((name, ticker))
        if korean:
            result.append({"korean": korean, "original": name})

    with open("data/output/theme_미국시총top50.json", "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"wrote {len(result)} names")
    if unmapped:
        print("unmapped tickers (used letter-fallback koreanize):")
        for name, ticker in unmapped:
            print(" ", name, ticker)


if __name__ == "__main__":
    main()
