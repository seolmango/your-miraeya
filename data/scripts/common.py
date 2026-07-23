import re
import time
import requests
import pandas as pd
from io import StringIO

HEADERS = {"User-Agent": "Mozilla/5.0"}


def fetch_market_cap(sosok, max_pages=8):
    result = {}
    for page in range(1, max_pages + 1):
        url = f"https://finance.naver.com/sise/sise_market_sum.naver?sosok={sosok}&page={page}"
        res = requests.get(url, headers=HEADERS, timeout=10)
        res.encoding = "euc-kr"
        tables = pd.read_html(StringIO(res.text))
        df = tables[1].dropna(subset=["종목명"])
        if df.empty:
            break
        for _, row in df.iterrows():
            name = str(row["종목명"]).strip()
            cap = row["시가총액"]
            result[name] = cap
        time.sleep(0.2)
    return result


def fetch_sector_list():
    url = "https://finance.naver.com/sise/sise_group.naver?type=upjong"
    res = requests.get(url, headers=HEADERS, timeout=10)
    res.encoding = "euc-kr"
    matches = re.findall(r'sise_group_detail\.naver\?type=upjong&no=(\d+)[^>]*>([^<]+)<', res.text)
    return matches


def fetch_sector_members(no):
    url = f"https://finance.naver.com/sise/sise_group_detail.naver?type=upjong&no={no}"
    res = requests.get(url, headers=HEADERS, timeout=10)
    res.encoding = "euc-kr"
    tables = pd.read_html(StringIO(res.text))
    df = tables[2].dropna(subset=["종목명"])
    names = []
    for n in df["종목명"]:
        n = str(n).strip()
        n = re.sub(r"\s*\*$", "", n)
        names.append(n)
    return names
