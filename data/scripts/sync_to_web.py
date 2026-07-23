import shutil
from pathlib import Path

SRC = Path("data/output")
DST = Path("web/src/data/raw")


def main():
    DST.mkdir(parents=True, exist_ok=True)
    for old in DST.glob("*.json"):
        old.unlink()
    count = 0
    for path in SRC.glob("*.json"):
        shutil.copy(path, DST / path.name)
        count += 1
    print(f"synced {count} files to {DST}")


if __name__ == "__main__":
    main()
