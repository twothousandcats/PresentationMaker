import style from "../ToolbarButton/ToolbarButton.module.css";
import type {ReactNode} from "react";
import {useState} from "react";

interface ToolbarButtonProps {
    icon: ReactNode;
    onClickFn: () => void;
    ariaLabel?: string;
}

export default function ToolbarButton(
    {
        icon,
        onClickFn,
        ariaLabel,
    }: ToolbarButtonProps
) {
    const [isShowTooltip, setShowTooltip] = useState(false);

    return (
        <li className={style.toolbar__item}
            onClick={onClickFn}
            aria-label={ariaLabel}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}>
            {icon}
            <span className={`${style.toolbar__hint} ${isShowTooltip ? style.toolbar__hint_show : ''}`}>
                {ariaLabel}
            </span>
        </li>
    )
}