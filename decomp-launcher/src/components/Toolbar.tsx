import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";

type ButtonProps = { icon: ReactNode; label: string; onClick?: () => void };

export function ToolbarButton({ icon, label, onClick }: ButtonProps) {
    return (
        <button className="tb-btn" onClick={onClick}>
            <span className="tb-icon">{icon}</span>
            {label}
        </button>
    );
}


type MenuProps = {
    icon: ReactNode;
    label: string;
    items: { label: string; onClick?: () => void }[];
    align?: "left" | "right";
};

export function ToolbarMenu({ icon, label, items, align = "left" }: MenuProps) {
    const [open, setOpen] = useState(false);
    return (
        <div className="menu-wrap" onMouseLeave={() => setOpen(false)}>
            <button className="tb-btn" onClick={() => setOpen(!open)}>
                <span className="tb-icon">{icon}</span>
                {label}
                <ChevronDown size={12} className="caret" />
            </button>
            {open && (
                <div className={"menu" + (align === "right" ? " right" : "")}>
                    {items.map((it) => (
                        <button
                            key={it.label}
                            onClick={() => {
                                it.onClick?.();
                                setOpen(false);
                            }}
                        >
                            {it.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}