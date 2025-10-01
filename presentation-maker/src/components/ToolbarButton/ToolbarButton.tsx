import style from "../ToolbarButton/ToolbarButton.module.css";
import type {ReactNode} from "react";
import {useState} from "react";

interface ToolbarButtonProps {
    icon: ReactNode;
    onclickFn: () => void;
    'aria-label'?: string;
}

export default function ToolbarButton(
    {
        icon,
        onclickFn,
        'aria-label': ariaLabel,
    }: ToolbarButtonProps
) {
    const [isShowTooltip, setShowTooltip] = useState(false);

    return (
        <li className={style.toolbar__item}
            onClick={onclickFn}
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