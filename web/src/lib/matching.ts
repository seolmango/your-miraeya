import { nameJeom, isHangulName } from "./nameJeom";
import { sectorGroups, themeGroups, type CompanyEntry } from "../data/manifest";

export interface CompanyMatch {
    company: string;
    original: string | null;
    score: number;
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

export interface MatchReport {
    userName: string;
    overallTop: CompanyMatch[];
    sectorResults: SectorResult[];
    themeResults: ThemeResult[];
}

export function computeMatchReport(userName: string, topN = 10): MatchReport | null {
    if (!isHangulName(userName)) return null;

    const scoreCache = new Map<string, CompanyMatch>();
    const scoreOf = (entry: CompanyEntry) => {
        let match = scoreCache.get(entry.korean);
        if (match === undefined) {
            match = { company: entry.korean, original: entry.original, score: nameJeom(entry.korean, userName) };
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

    const overallTop = [...scoreCache.values()].sort((a, b) => b.score - a.score).slice(0, topN);

    const sectorResults: SectorResult[] = sectorGroups
        .map((group) => {
            const all = group.companies
                .map((entry) => scoreOf(entry))
                .sort((a, b) => b.score - a.score);
            const average = all.reduce((sum, s) => sum + s.score, 0) / all.length;
            return { id: group.id, label: group.label, origin: group.origin, average, all };
        })
        .sort((a, b) => b.average - a.average);

    const themeResults: ThemeResult[] = themeGroups.map((group) => {
        const all = group.companies.map((entry) => scoreOf(entry)).sort((a, b) => b.score - a.score);
        return { id: group.id, label: group.label, all };
    });

    return { userName, overallTop, sectorResults, themeResults };
}
