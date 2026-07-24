import { useEffect } from "react";
import { StampReveal } from "./StampReveal";
import { ScoreDistribution } from "./ScoreDistribution";
import { ShareButton } from "./ShareButton";
import { RankingList } from "./RankingList";
import { CrushRankings } from "./CrushRankings";
import { SectorBars } from "./SectorBars";
import { ThemeSection } from "./ThemeSection";
import { CustomCheck } from "./CustomCheck";
import { AdSlot } from "./AdSlot";
import type { MatchReport } from "../lib/matching";

interface ResultsViewProps {
    report: MatchReport;
    onReady?: () => void;
}

export function ResultsView({ report, onReady }: ResultsViewProps) {
    // lazy 청크가 로드되어 실제 콘텐츠가 그려진 뒤에만 호출된다.
    // report가 바뀔 때마다(같은 마운트에서 새 이름을 검색한 경우 포함) 다시 알린다.
    useEffect(() => {
        onReady?.();
    }, [report, onReady]);

    return (
        <>
            <StampReveal
                userName={report.userName}
                company={report.overallTop[0].company}
                original={report.overallTop[0].original}
                score={report.overallTop[0].score}
                percentile={report.overallTop[0].percentile}
                userToCompany={report.overallTop[0].userToCompany}
                companyToUser={report.overallTop[0].companyToUser}
            />

            <div className="app__share">
                <ShareButton
                    userName={report.userName}
                    company={report.overallTop[0].company}
                    top={report.overallTop}
                />
            </div>

            <ScoreDistribution
                distribution={report.distribution}
                topCompany={report.overallTop[0].company}
                topScore={report.overallTop[0].score}
            />

            <div className="app__ad">
                <AdSlot label="본문 상단 광고" />
            </div>

            <RankingList
                title="전체 매칭 랭킹"
                subtitle="모든 기업을 통틀어 종합 매칭 점수가 가장 높은 순서"
                items={report.overallTop}
            />

            <RankingList
                title="최악의 매칭 랭킹"
                subtitle="종합 매칭 점수가 가장 낮은, 인연이 아니었던 기업들"
                items={report.overallBottom}
            />

            <CrushRankings
                myOneSidedLove={report.crushes.myOneSidedLove}
                theirOneSidedLove={report.crushes.theirOneSidedLove}
            />

            <SectorBars results={report.sectorResults} />

            <div className="app__ad">
                <AdSlot label="섹터 결과 하단 광고" />
            </div>

            <ThemeSection results={report.themeResults} />

            <CustomCheck key={report.userName} userName={report.userName} />
        </>
    );
}
