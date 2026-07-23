import 반도체 from "./raw/sector_반도체.json";
import 바이오제약 from "./raw/sector_바이오_제약.json";
import 금융은행 from "./raw/sector_금융_은행.json";
import 금융증권카드 from "./raw/sector_금융_증권카드.json";
import 보험 from "./raw/sector_보험.json";
import IT플랫폼 from "./raw/sector_IT_플랫폼.json";
import 게임 from "./raw/sector_게임.json";
import 자동차부품 from "./raw/sector_자동차_부품.json";
import 이차전지에너지 from "./raw/sector_2차전지_에너지.json";
import 화학소재 from "./raw/sector_화학_소재.json";
import 조선해운 from "./raw/sector_조선_해운.json";
import 건설 from "./raw/sector_건설.json";
import 철강 from "./raw/sector_철강.json";
import 유통소비재 from "./raw/sector_유통_소비재.json";
import 엔터미디어 from "./raw/sector_엔터_미디어.json";
import 통신 from "./raw/sector_통신.json";
import 방산항공 from "./raw/sector_방산_항공.json";

import 해외빅테크 from "./raw/foreign_빅테크.json";
import 해외반도체 from "./raw/foreign_반도체.json";
import 해외우주방산 from "./raw/foreign_우주_방산.json";
import 해외자동차EV from "./raw/foreign_자동차_EV.json";
import 해외금융핀테크 from "./raw/foreign_금융_핀테크.json";
import 해외바이오제약 from "./raw/foreign_바이오_제약.json";
import 중국빅테크 from "./raw/foreign_중국빅테크.json";

import 코스피TOP100 from "./raw/theme_kospi_top100.json";
import 코스닥TOP100 from "./raw/theme_kosdaq_top100.json";
import 미국TOP50 from "./raw/theme_미국시총top50.json";

export interface CompanyEntry {
    korean: string;
    original: string | null;
}

export interface SectorGroup {
    id: string;
    label: string;
    origin: "domestic" | "foreign";
    companies: CompanyEntry[];
}

export interface ThemeGroup {
    id: string;
    label: string;
    companies: CompanyEntry[];
}

export const sectorGroups: SectorGroup[] = [
    { id: "반도체", label: "반도체", origin: "domestic", companies: 반도체 },
    { id: "바이오_제약", label: "바이오·제약", origin: "domestic", companies: 바이오제약 },
    { id: "금융_은행", label: "금융 (은행)", origin: "domestic", companies: 금융은행 },
    { id: "금융_증권카드", label: "금융 (증권·카드)", origin: "domestic", companies: 금융증권카드 },
    { id: "보험", label: "보험", origin: "domestic", companies: 보험 },
    { id: "IT_플랫폼", label: "IT·플랫폼", origin: "domestic", companies: IT플랫폼 },
    { id: "게임", label: "게임", origin: "domestic", companies: 게임 },
    { id: "자동차_부품", label: "자동차·부품", origin: "domestic", companies: 자동차부품 },
    { id: "2차전지_에너지", label: "2차전지·에너지", origin: "domestic", companies: 이차전지에너지 },
    { id: "화학_소재", label: "화학·소재", origin: "domestic", companies: 화학소재 },
    { id: "조선_해운", label: "조선·해운", origin: "domestic", companies: 조선해운 },
    { id: "건설", label: "건설", origin: "domestic", companies: 건설 },
    { id: "철강", label: "철강", origin: "domestic", companies: 철강 },
    { id: "유통_소비재", label: "유통·소비재", origin: "domestic", companies: 유통소비재 },
    { id: "엔터_미디어", label: "엔터·미디어", origin: "domestic", companies: 엔터미디어 },
    { id: "통신", label: "통신", origin: "domestic", companies: 통신 },
    { id: "방산_항공", label: "방산·항공", origin: "domestic", companies: 방산항공 },
    { id: "해외_빅테크", label: "해외 빅테크", origin: "foreign", companies: 해외빅테크 },
    { id: "해외_반도체", label: "해외 반도체", origin: "foreign", companies: 해외반도체 },
    { id: "해외_우주_방산", label: "해외 우주·방산", origin: "foreign", companies: 해외우주방산 },
    { id: "해외_자동차_EV", label: "해외 자동차·EV", origin: "foreign", companies: 해외자동차EV },
    { id: "해외_금융_핀테크", label: "해외 금융·핀테크", origin: "foreign", companies: 해외금융핀테크 },
    { id: "해외_바이오_제약", label: "해외 바이오·제약", origin: "foreign", companies: 해외바이오제약 },
    { id: "중국_빅테크", label: "중국 빅테크", origin: "foreign", companies: 중국빅테크 },
];

export const themeGroups: ThemeGroup[] = [
    { id: "kospi_top100", label: "코스피 시총 TOP 100", companies: 코스피TOP100 },
    { id: "kosdaq_top100", label: "코스닥 시총 TOP 100", companies: 코스닥TOP100 },
    { id: "us_top50", label: "미국 시총 TOP 50", companies: 미국TOP50 },
];
