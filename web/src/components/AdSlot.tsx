import "./AdSlot.css";

interface AdSlotProps {
    label: string;
    height?: number;
}

export function AdSlot({ label, height = 100 }: AdSlotProps) {
    return (
        <div className="ad-slot" style={{ minHeight: height }} role="complementary" aria-label="광고 영역">
            <span className="ad-slot__tag">AD</span>
            <span className="ad-slot__label">{label}</span>
        </div>
    );
}
