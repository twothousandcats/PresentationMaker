import style from "../ToolbarButton/ToolbarButton.module.css";
import {type ReactNode, useState} from "react";

interface ToolbarButtonProps {
    icon: ReactNode;
    onClickFn: () => void;
    ariaLabel?: string;
    disabled?: boolean;
}

export default function ToolbarButton(
    {
        icon,
        onClickFn,
        ariaLabel,
        disabled = false,
    }: ToolbarButtonProps
) {
    const [isShowTooltip, setShowTooltip] = useState(false);

    const handleClick = () => {
        if (!disabled) {
            onClickFn();
        }
    };

    return (
        <li
            className={`${style.toolbar__item} ${disabled ? style.toolbar__item_disabled : ''}`}
            onClick={handleClick}
            aria-label={ariaLabel}
            aria-disabled={disabled}
            onMouseEnter={() => !disabled && setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            {icon}
            <span
                className={`${style.toolbar__hint} ${
                    isShowTooltip ? style.toolbar__hint_show : ''
                }`}
            >
        {ariaLabel}
      </span>
        </li>
    );
}