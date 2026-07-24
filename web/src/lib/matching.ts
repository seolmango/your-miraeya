import { nameJeom, isHangulName } from "./nameJeom";
import { sectorGroups, themeGroups, type CompanyEntry } from "../data/manifest";

export interface CompanyMatch {
    company: string;
    original: string | null;
    /** 종합 매칭 점수 (나→기업, 기업→나 평균) */
    score: number;
    /** 내가 이 기업을 좋아하는 정도 */
    userToCompany: number;
    /** 이 기업이 나를 좋아하는 정도 */
    companyToUser: number;
    /** 전체 기업 중 이 점수보다 낮은 기업의 비율 (%) */
    percentile: number;
}

export interface SectorResult {
    id: string;
    label: string;
    origin: "domestic" | "foreign";
    average: number;
    all: CompanyMatch[];
}

export interface ThemeResult {
    id: string;
    label: string;
    all: CompanyMatch[];
}

export interface CrushReport {
    /** 내가 짝사랑하는 기업 Top10 (내가 더 좋아함) */
    myOneSidedLove: CompanyMatch[];
    /** 나를 짝사랑하는 기업 Top10 (기업이 더 좋아함) */
    theirOneSidedLove: CompanyMatch[];
}

export interface ScoreDistribution {
    binSize: number;
    /** 각 구간(binSize 단위)에 속한 기업 수 */
    bins: number[];
    mean: number;
    std: number;
    total: number;
    /** overallTop[0] 점수가 속한 구간의 인덱스 */
    topBinIndex: number;
}

export interface MatchReport {
    userName: string;
    overallTop: CompanyMatch[];
    sectorResults: SectorResult[];
    themeResults: ThemeResult[];
    crushes: CrushReport;
    distribution: ScoreDistribution;
}

export function computeMatchReport(userName: string, topN = 10): MatchReport | null {
    if (!isHangulName(userName)) return null;

    const scoreCache = new Map<string, Omit<CompanyMatch, "percentile">>();
    const scoreOf = (entry: CompanyEntry) => {
        let match = scoreCache.get(entry.korean);
        if (match === undefined) {
            const userToCompany = nameJeom(userName, entry.korean);
            const companyToUser = nameJeom(entry.korean, userName);
            match = {
                company: entry.korean,
                original: entry.original,
                score: Math.round((userToCompany + companyToUser) / 2),
                userToCompany,
                companyToUser,
            };
            scoreCache.set(entry.korean, match);
        }
        return match;
    };

    for (const group of sectorGroups) {
        for (const entry of group.companies) scoreOf(entry);
    }
    for (const group of themeGroups) {
        for (const entry of group.companies) scoreOf(entry);
    }

    const allMatches = [...scoreCache.values()];
    const sortedScores = allMatches.map((m) => m.score).sort((a, b) => a - b);
    const percentileOf = (score: number) => {
        let lo = 0;
        let hi = sortedScores.length;
        while (lo < hi) {
            const mid = (lo + hi) >>> 1;
            if (sortedScores[mid] < score) lo = mid + 1;
            else hi = mid;
        }
        return Math.round((lo / sortedScores.length) * 1000) / 10;
    };
    const withPercentile = (m: Omit<CompanyMatch, "percentile">): CompanyMatch => ({
        ...m,
        percentile: percentileOf(m.score),
    });

    const overallTop = [...allMatches]
        .sort((a, b) => b.score - a.score)
        .slice(0, topN)
        .map(withPercentile);

    const sectorResults: SectorResult[] = sectorGroups
        .map((group) => {
            const all = group.companies
                .map((entry) => withPercentile(scoreOf(entry)))
                .sort((a, b) => b.score - a.score);
            const average = all.reduce((sum, s) => sum + s.score, 0) / all.length;
            return { id: group.id, label: group.label, origin: group.origin, average, all };
        })
        .sort((a, b) => b.average - a.average);

    const themeResults: ThemeResult[] = themeGroups.map((group) => {
        const all = group.companies.map((entry) => withPercentile(scoreOf(entry))).sort((a, b) => b.score - a.score);
        return { id: group.id, label: group.label, all };
    });

    const myOneSidedLove = [...allMatches]
        .sort((a, b) => b.userToCompany - b.companyToUser - (a.userToCompany - a.companyToUser))
        .slice(0, topN)
        .map(withPercentile);
    const theirOneSidedLove = [...allMatches]
        .sort((a, b) => b.companyToUser - b.userToCompany - (a.companyToUser - a.userToCompany))
        .slice(0, topN)
        .map(withPercentile);

    const binSize = 4;
    const binCount = Math.ceil(100 / binSize);
    const bins = new Array(binCount).fill(0);
    for (const m of allMatches) {
        bins[Math.min(binCount - 1, Math.floor(m.score / binSize))]++;
    }
    const mean = allMatches.reduce((sum, m) => sum + m.score, 0) / allMatches.length;
    const variance = allMatches.reduce((sum, m) => sum + (m.score - mean) ** 2, 0) / allMatches.length;
    const std = Math.sqrt(variance);
    const topBinIndex = Math.min(binCount - 1, Math.floor(overallTop[0].score / binSize));

    return {
        userName,
        overallTop,
        sectorResults,
        themeResults,
        crushes: { myOneSidedLove, theirOneSidedLove },
        distribution: { binSize, bins, mean, std, total: allMatches.length, topBinIndex },
    };
}
