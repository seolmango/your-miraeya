import { AdSlot } from "./AdSlot";
import "./Footer.css";

const CONTACT_EMAIL = "zero2inf.zip@gmail.com";
const REPO_URL = "https://github.com/your-username/your-miraeya";

export function Footer() {
    return (
        <footer className="site-footer">
            <div className="site-footer__ad">
                <AdSlot label="하단 배너 광고" height={90} />
            </div>
            <p className="site-footer__note">
                재미로 보는 선호도 테스트입니다. 실제 취업·투자 결정과는 관계가 없어요.
            </p>
            <div className="site-footer__links">
                <a className="site-footer__link" href={`mailto:${CONTACT_EMAIL}`}>
                    {CONTACT_EMAIL}
                </a>
                <span className="site-footer__divider" aria-hidden="true">
                    ·
                </span>
                <a className="site-footer__link" href={REPO_URL} target="_blank" rel="noreferrer">
                    GitHub
                </a>
            </div>
        </footer>
    );
}
