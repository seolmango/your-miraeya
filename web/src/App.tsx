import { useState, useMemo, useEffect } from "react";
import { Hero } from "./components/Hero";
import { StampReveal } from "./components/StampReveal";
import { ShareButton } from "./components/ShareButton";
import { RankingList } from "./components/RankingList";
import { SectorBars } from "./components/SectorBars";
import { ThemeSection } from "./components/ThemeSection";
import { CustomCheck } from "./components/CustomCheck";
import { AdSlot } from "./components/AdSlot";
import { Footer } from "./components/Footer";
import { InAppBrowserNotice } from "./components/InAppBrowserNotice";
import { computeMatchReport } from "./lib/matching";
import "./App.css";

function nameFromUrl(): string | null {
    return new URLSearchParams(window.location.search).get("name");
}

function App() {
    const [userName, setUserNameState] = useState<string | null>(() => nameFromUrl());

    useEffect(() => {
        function handlePopState() {
            setUserNameState(nameFromUrl());
        }
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    function setUserName(name: string | null) {
        setUserNameState(name);
        const params = new URLSearchParams(window.location.search);
        if (name) params.set("name", name);
        else params.delete("name");
        const query = params.toString();
        window.history.pushState({}, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
    }

    const report = useMemo(() => {
        if (!userName) return null;
        return computeMatchReport(userName);
    }, [userName]);

    return (
        <div className="app">
            <InAppBrowserNotice />

            {report && (
                <div className="app__topbar">
                    <button type="button" className="app__back" onClick={() => setUserName(null)}>
                        ← 다시 검색하기
                    </button>
                </div>
            )}

            <Hero onSubmit={setUserName} hasResult={report !== null} />

            {report && (
                <main className="app__results">
                    <StampReveal
                        userName={report.userName}
                        company={report.overallTop[0].company}
                        original={report.overallTop[0].original}
                        score={report.overallTop[0].score}
                    />

                    <div className="app__share">
                        <ShareButton
                            userName={report.userName}
                            company={report.overallTop[0].company}
                            top={report.overallTop}
                        />
                    </div>

                    <div className="app__ad">
                        <AdSlot label="본문 상단 광고" />
                    </div>

                    <RankingList
                        title="전체 선호도 랭킹"
                        subtitle="모든 기업을 통틀어 나를 가장 원하는 순서"
                        items={report.overallTop}
                    />

                    <SectorBars results={report.sectorResults} />

                    <div className="app__ad">
                        <AdSlot label="섹터 결과 하단 광고" />
                    </div>

                    <ThemeSection results={report.themeResults} />

                    <CustomCheck key={report.userName} userName={report.userName} />
                </main>
            )}

            <Footer />
        </div>
    );
}

export default App;
