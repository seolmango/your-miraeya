import { useState, useMemo, useEffect, useRef, useCallback, lazy, Suspense } from "react";
import { Hero } from "./components/Hero";
import { Footer } from "./components/Footer";
import { InAppBrowserNotice } from "./components/InAppBrowserNotice";
import { computeMatchReport } from "./lib/matching";
import { isHangulName, MAX_NAME_LENGTH } from "./lib/nameJeom";

// 랜딩(스크롤리텔링 설명)과 결과 화면은 동시에 보여질 일이 없으므로
// 서로 다른 청크로 분리해 항상 같이 로드되지 않게 한다.
const AlgorithmExplainer = lazy(() =>
    import("./components/AlgorithmExplainer").then((m) => ({ default: m.AlgorithmExplainer })),
);
const ResultsView = lazy(() => import("./components/ResultsView").then((m) => ({ default: m.ResultsView })));
import "./App.css";

function nameFromUrl(): string | null {
    const raw = new URLSearchParams(window.location.search).get("name");
    if (raw === null) return null;
    const trimmed = raw.trim().slice(0, MAX_NAME_LENGTH);
    return isHangulName(trimmed) ? trimmed : null;
}

function App() {
    const [userName, setUserNameState] = useState<string | null>(() => nameFromUrl());
    const resultsRef = useRef<HTMLElement>(null);

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

    // 공유 링크로 바로 들어왔거나 방금(재)검색을 마쳤을 때, 결과가 나타나는 지점으로
    // 자동 스크롤한다. ResultsView는 lazy 청크라서 실제로 콘텐츠가 그려진 뒤에야
    // onReady가 불리므로, 스크롤 대상의 높이가 아직 0인 상태에서 스크롤하는 것을 막아준다.
    const scrollToResults = useCallback(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

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

            {!report && (
                <Suspense fallback={null}>
                    <AlgorithmExplainer />
                </Suspense>
            )}

            {report && (
                <main className="app__results" ref={resultsRef}>
                    <Suspense fallback={null}>
                        <ResultsView report={report} onReady={scrollToResults} />
                    </Suspense>
                </main>
            )}

            <Footer />
        </div>
    );
}

export default App;
