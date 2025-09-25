import style from "../ToolbarButton/ToolbarButton.module.css";
import type {ReactNode} from "react";

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
    return (
        <li className={style.toolbar__item}
            onClick={onclickFn}
            aria-label={ariaLabel}>
            {icon}
        </li>
    )
}