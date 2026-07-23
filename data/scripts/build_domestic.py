import json
import sys
import time

sys.path.insert(0, "data/scripts")
from common import fetch_market_cap, fetch_sector_list, fetch_sector_members
from koreanize import is_etf, is_preferred_stock, to_entry

SECTOR_MAP = {
    "반도체": [278],
    "바이오_제약": [261, 286, 262, 281, 288, 316],
    "금융_은행": [301],
    "금융_증권카드": [321, 337, 319, 277],
    "보험": [330, 315],
    "IT_플랫폼": [287, 267, 300, 308],
    "게임": [263],
    "자동차_부품": [273, 270],
    "2차전지_에너지": [295, 325, 312, 313, 306],
    "화학_소재": [272, 289, 320, 322],
    "조선_해운": [291, 323, 326, 329, 296],
    "건설": [279],
    "철강": [304],
    "유통_소비재": [334, 265, 264, 328, 302, 268, 309, 266, 274, 297, 298],
    "엔터_미디어": [285, 314, 310, 317],
    "통신": [333, 336, 294],
    "방산_항공": [284, 305],
}

TOP_N = 15


def main():
    print("fetching market caps...")
    kospi_caps_raw = fetch_market_cap(0, max_pages=8)
    kosdaq_caps_raw = fetch_market_cap(1, max_pages=8)

    def clean_caps(caps_raw):
        names = set(caps_raw.keys())
        return {
            n: c for n, c in caps_raw.items()
            if not is_etf(n) and not is_preferred_stock(n, names)
        }

    kospi_caps = clean_caps(kospi_caps_raw)
    kosdaq_caps = clean_caps(kosdaq_caps_raw)
    all_caps = {**kospi_caps, **kosdaq_caps}
    print(f"kospi={len(kospi_caps)} kosdaq={len(kosdaq_caps)} total={len(all_caps)}")

    print("fetching sector membership...")
    member_cache = {}
    for bucket, codes in SECTOR_MAP.items():
        names = set()
        for code in codes:
            if code not in member_cache:
                member_cache[code] = fetch_sector_members(code)
                time.sleep(0.2)
            names.update(member_cache[code])
        ranked = sorted(
            ((n, all_caps[n]) for n in names if n in all_caps),
            key=lambda x: x[1],
            reverse=True,
        )
        top = [to_entry(n) for n, _ in ranked[:TOP_N]]
        with open(f"data/output/sector_{bucket}.json", "w", encoding="utf-8") as f:
            json.dump(top, f, ensure_ascii=False, indent=2)
        print(bucket, len(names), "->", top)

    kospi_top100 = sorted(kospi_caps.items(), key=lambda x: x[1], reverse=True)[:100]
    kosdaq_top100 = sorted(kosdaq_caps.items(), key=lambda x: x[1], reverse=True)[:100]
    with open("data/output/theme_kospi_top100.json", "w", encoding="utf-8") as f:
        json.dump([to_entry(n) for n, _ in kospi_top100], f, ensure_ascii=False, indent=2)
    with open("data/output/theme_kosdaq_top100.json", "w", encoding="utf-8") as f:
        json.dump([to_entry(n) for n, _ in kosdaq_top100], f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
