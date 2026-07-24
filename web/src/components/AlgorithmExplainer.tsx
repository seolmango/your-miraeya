import { useEffect, useRef, useState } from "react";
import "./AlgorithmExplainer.css";

interface Jamo {
    syllable: string;
    cho: string;
    jung: string;
    jong: string;
    strokes: number;
}

const CHOSUNG = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const JUNGSUNG = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"];
const JONGSUNG = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const CHOSUNG_STROKES = [8, 9, 8, 9, 1, 0, 0, 1, 5, 9, 1, 8, 0, 3, 1, 9, 0, 1, 0];
const JUNGSUNG_STROKES = [1, 2, 2, 3, 1, 2, 2, 3, 1, 3, 4, 2, 2, 1, 3, 4, 2, 2, 0, 1, 0];
const JONGSUNG_STROKES = [9, 0, 1, 2, 0, 3, 3, 1, 2, 3, 5, 6, 4, 5, 6, 5, 2, 3, 5, 1, 3, 0, 2, 3, 1, 2, 3, 2];

function decompose(ch: string): Jamo {
    const code = ch.charCodeAt(0) - 44032;
    const jong = code % 28;
    const jung = Math.floor(code / 28) % 21;
    const cho = Math.floor(Math.floor(code / 28) / 21);
    return {
        syllable: ch,
        cho: CHOSUNG[cho],
        jung: JUNGSUNG[jung],
        jong: JONGSUNG[jong] || "-",
        strokes: CHOSUNG_STROKES[cho] + JUNGSUNG_STROKES[jung] + JONGSUNG_STROKES[jong],
    };
}

const NAME_A = "클로드";
const NAME_B = "설망고";
const jamoA = [...NAME_A].map(decompose);
const jamoB = [...NAME_B].map(decompose);
const initialSequence: number[] = [];
for (let i = 0; i < Math.max(jamoA.length, jamoB.length); i++) {
    if (i < jamoA.length) initialSequence.push(jamoA[i].strokes);
    if (i < jamoB.length) initialSequence.push(jamoB[i].strokes);
}

function fold(sequence: number[]): number[][] {
    const rounds: number[][] = [];
    let current = sequence;
    while (current.length > 2) {
        const next: number[] = [];
        for (let i = 0; i < current.length - 1; i++) next.push((current[i] + current[i + 1]) % 10);
        rounds.push(next);
        current = next;
    }
    return rounds;
}

const foldRounds = fold(initialSequence);
const finalPair = foldRounds[foldRounds.length - 1];
const scoreAtoB = finalPair[0] * 10 + finalPair[1];

function foldReverse(sequence: number[]): number {
    let current = sequence;
    while (current.length > 2) {
        const next: number[] = [];
        for (let i = 0; i < current.length - 1; i++) next.push((current[i] + current[i + 1]) % 10);
        current = next;
    }
    return current.length === 2 ? current[0] * 10 + current[1] : current[0];
}
const reverseSequence: number[] = [];
for (let i = 0; i < Math.max(jamoA.length, jamoB.length); i++) {
    if (i < jamoB.length) reverseSequence.push(jamoB[i].strokes);
    if (i < jamoA.length) reverseSequence.push(jamoA[i].strokes);
}
const scoreBtoA = foldReverse(reverseSequence);
const composite = Math.round((scoreAtoB + scoreBtoA) / 2);

const STEP_COUNT = 7;

function JamoTable({ name, jamos, accent }: { name: string; jamos: Jamo[]; accent: "a" | "b" }) {
    return (
        <div className={`algo-card algo-card--${accent}`}>
            <p className="algo-card__label">{name}</p>
            <table className="algo-table">
                <thead>
                    <tr>
                        <th>음절</th>
                        <th>초성</th>
                        <th>중성</th>
                        <th>종성</th>
                        <th>JSI</th>
                    </tr>
                </thead>
                <tbody>
                    {jamos.map((j, i) => (
                        <tr key={i}>
                            <td>{j.syllable}</td>
                            <td>{j.cho}</td>
                            <td>{j.jung}</td>
                            <td>{j.jong}</td>
                            <td className="algo-table__strokes">{j.strokes}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function SequenceChips({ values, accentByIndex }: { values: number[]; accentByIndex?: (i: number) => "a" | "b" | undefined }) {
    return (
        <div className="algo-sequence">
            {values.map((v, i) => (
                <span key={i} className={`algo-chip ${accentByIndex ? `algo-chip--${accentByIndex(i) ?? "n"}` : ""}`}>
                    {v}
                </span>
            ))}
        </div>
    );
}

export function AlgorithmExplainer() {
    const [activeStep, setActiveStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);
    const markerRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        const index = markerRefs.current.indexOf(entry.target as HTMLDivElement);
                        if (index !== -1) setActiveStep(index);
                    }
                }
            },
            { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
        );
        for (const el of markerRefs.current) {
            if (el) observer.observe(el);
        }
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        let frame = 0;
        function onScroll() {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const section = sectionRef.current;
                if (!section) return;
                const rect = section.getBoundingClientRect();
                const total = rect.height - window.innerHeight;
                if (total <= 0) {
                    setProgress(0);
                    return;
                }
                const scrolled = Math.min(Math.max(-rect.top, 0), total);
                setProgress(scrolled / total);
            });
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => {
            window.removeEventListener("scroll", onScroll);
            cancelAnimationFrame(frame);
        };
    }, []);

    function goToHero() {
        document.querySelector<HTMLInputElement>(".hero__input")?.focus();
        document.querySelector(".hero")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    return (
        <section
            className="algo"
            id="algorithm-explainer"
            ref={sectionRef}
            style={{ height: `${STEP_COUNT * 100}vh` }}
        >
            <div className="algo__sticky">
                <div className="algo__rail" aria-hidden="true">
                    <div className="algo__rail-track">
                        <div className="algo__rail-fill" style={{ height: `${progress * 100}%` }} />
                    </div>
                    <ol className="algo__rail-dots">
                        {Array.from({ length: STEP_COUNT }).map((_, i) => (
                            <li key={i} className={i === activeStep ? "is-active" : ""} />
                        ))}
                    </ol>
                </div>

                <div className="algo__stage" data-step={activeStep}>
                    {activeStep === 0 && (
                        <div className="algo-panel">
                            <p className="algo-kicker">MATCHING ALGORITHM WHITE PAPER</p>
                            <h2 className="algo-title">이름점 매칭 엔진™은 어떻게 작동하는가</h2>
                            <p className="algo-desc">
                                지금부터 <strong>클로드</strong>와 <strong>설망고</strong>, 두 이름을 실제 알고리즘에
                                넣어 계산 과정을 그대로 보여드립니다. 참고로 이 문서는 어떠한 학술 기관의 검증도
                                받은 적이 없습니다.
                            </p>
                            <div className="algo-badges">
                                <span className="algo-badge">특허출원준비중</span>
                                <span className="algo-badge">누적 계산 1,204,932건</span>
                                <span className="algo-badge">신뢰도 99.2%(자체측정)</span>
                            </div>
                        </div>
                    )}

                    {activeStep === 1 && (
                        <div className="algo-panel">
                            <p className="algo-kicker">STEP 1 · 원본 이름 원자 분해</p>
                            <h2 className="algo-title">이름을 초성·중성·종성으로 쪼갭니다</h2>
                            <p className="algo-desc">
                                저희가 독자 개발한 <strong>자모획수지수(JSI)</strong>는 한글 낱자 하나하나를
                                초성·중성·종성으로 해체한 뒤, 각 자모의 획수를 더해 음절의 고유 수치를 뽑아냅니다.
                                양자역학처럼 들리지만 사실 그냥 자음·모음 획수를 세는 것입니다.
                            </p>
                            <JamoTable name={NAME_A} jamos={jamoA} accent="a" />
                        </div>
                    )}

                    {activeStep === 2 && (
                        <div className="algo-panel">
                            <p className="algo-kicker">STEP 2 · 상대 개체 동일 처리</p>
                            <h2 className="algo-title">비교 대상도 같은 방식으로 분해합니다</h2>
                            <p className="algo-desc">
                                공정성을 위해 상대 이름에도 완전히 동일한 JSI 프로토콜을 적용합니다. 여기서는
                                기업명 대신 예시로 <strong>{NAME_B}</strong>를 사용하겠습니다.
                            </p>
                            <JamoTable name={NAME_B} jamos={jamoB} accent="b" />
                        </div>
                    )}

                    {activeStep === 3 && (
                        <div className="algo-panel">
                            <p className="algo-kicker">STEP 3 · 운명 시퀀스 합성</p>
                            <h2 className="algo-title">두 이름의 수치를 교차로 엮습니다</h2>
                            <p className="algo-desc">
                                두 이름의 JSI 값을 한 글자씩 번갈아 배열해 하나의 <strong>운명 시퀀스</strong>를
                                만듭니다. DNA 이중나선 구조와 흡사하다는 평가가 있습니다(저희 자체 평가입니다).
                            </p>
                            <SequenceChips
                                values={initialSequence}
                                accentByIndex={(i) => (i % 2 === 0 ? "a" : "b")}
                            />
                            <p className="algo-caption">
                                <span className="algo-chip algo-chip--a algo-chip--legend">■</span> {NAME_A}
                                <span className="algo-chip algo-chip--b algo-chip--legend">■</span> {NAME_B}
                            </p>
                        </div>
                    )}

                    {activeStep === 4 && (
                        <div className="algo-panel">
                            <p className="algo-kicker">STEP 4 · 감정 압축 알고리즘</p>
                            <h2 className="algo-title">인접한 두 값을 계속 더해 압축합니다</h2>
                            <p className="algo-desc">
                                이웃한 두 수치를 더한 뒤 10으로 나눈 나머지만 남기는 연산을 배열이 두 자리로 줄어들
                                때까지 반복합니다. 파스칼의 삼각형과 미묘하게 닮았지만 우연입니다.
                            </p>
                            <div className="algo-rounds">
                                {foldRounds.map((round, i) => (
                                    <div className="algo-rounds__row" key={i}>
                                        <span className="algo-rounds__label">{i + 1}차 압축</span>
                                        <SequenceChips values={round} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeStep === 5 && (
                        <div className="algo-panel">
                            <p className="algo-kicker">STEP 5 · 방향성 보정 및 종합 매칭 점수</p>
                            <h2 className="algo-title">사랑은 원래 비대칭이라 두 번 계산합니다</h2>
                            <p className="algo-desc">
                                같은 두 이름이라도 어느 쪽에서 바라보느냐에 따라 값이 달라집니다. 그래서 정방향과
                                역방향을 각각 계산한 뒤 평균을 내 최종 종합 매칭 점수를 발표합니다.
                            </p>
                            <div className="algo-final">
                                <div className="algo-final__row">
                                    <span>{NAME_A} → {NAME_B}</span>
                                    <strong>{scoreAtoB}</strong>
                                </div>
                                <div className="algo-final__row">
                                    <span>{NAME_B} → {NAME_A}</span>
                                    <strong>{scoreBtoA}</strong>
                                </div>
                                <div className="algo-final__row algo-final__row--composite">
                                    <span>종합 매칭 점수</span>
                                    <strong>{composite}</strong>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeStep === 6 && (
                        <div className="algo-panel">
                            <p className="algo-kicker">이제 당신 차례입니다</p>
                            <h2 className="algo-title">여기까지가 이름점 매칭 엔진™의 전부입니다</h2>
                            <p className="algo-desc">
                                MIT 교수<span className="algo-desc__fine-print">지망생</span>이 개발한 저희의
                                알고리즘으로 내 평생직장을 지금 바로 확인해보세요.
                            </p>
                            <button type="button" className="algo-cta" onClick={goToHero}>
                                내 진짜 점수 확인하러 가기 ↑
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {Array.from({ length: STEP_COUNT }).map((_, i) => (
                <div
                    key={i}
                    className="algo__marker"
                    style={{ top: `${(i / STEP_COUNT) * 100}%`, height: `${100 / STEP_COUNT}%` }}
                    ref={(el) => {
                        markerRefs.current[i] = el;
                    }}
                />
            ))}
        </section>
    );
}
