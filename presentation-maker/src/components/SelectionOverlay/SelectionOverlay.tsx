import styles from './SelectionOverlay.module.css';
import type {
    Size,
    SlideElement,
    Position
} from "../../store/types/types.ts";
import {
    concatModifiersByFlag,
    getPercentValue
} from "../../store/functions/untils/utils.ts";
import type {ResizeItem} from "../../store/types/utility-types.ts";

interface SelectionOverlayProps {
    selectedElementIds: string[];
    slideElements: SlideElement[];
    slideSize: Size;
    dragOffsets?: Record<string, Position>;
    onStartResizing?: (id: string, item: ResizeItem, x: number, y: number) => void;
}

const RESIZE_HANDLERS: { pos: ResizeItem, className: string }[] = [
    {
        pos: 'top',
        className: concatModifiersByFlag([styles.resizeHandler, styles.resizeHandler_side, styles.resizeHandler_top])
    },
    {
        pos: 'right',
        className: concatModifiersByFlag([styles.resizeHandler, styles.resizeHandler_side, styles.resizeHandler_right])
    },
    {
        pos: 'bottom',
        className: concatModifiersByFlag([styles.resizeHandler, styles.resizeHandler_side, styles.resizeHandler_bottom])
    },
    {
        pos: 'left',
        className: concatModifiersByFlag([styles.resizeHandler, styles.resizeHandler_side, styles.resizeHandler_left])
    },
    {
        pos: 'topLeft',
        className: concatModifiersByFlag([styles.resizeHandler, styles.resizeHandler_corner, styles.resizeHandler_topLeft])
    },
    {
        pos: 'topRight',
        className: concatModifiersByFlag([styles.resizeHandler, styles.resizeHandler_corner, styles.resizeHandler_topRight])
    },
    {
        pos: 'bottomRight',
        className: concatModifiersByFlag([styles.resizeHandler, styles.resizeHandler_corner, styles.resizeHandler_botRight])
    },
    {
        pos: 'bottomLeft',
        className: concatModifiersByFlag([styles.resizeHandler, styles.resizeHandler_corner, styles.resizeHandler_botLeft])
    },
];

export const SelectionOverlay = (
    {
        selectedElementIds,
        slideElements,
        slideSize,
        onStartResizing,
        dragOffsets = {},
    }
    : SelectionOverlayProps) => {
    const overlays = selectedElementIds.map(id => {
        const element = slideElements.find(el => el.id === id);
        if (!element) {
            return null;
        }

        let x = element.position.x;
        let y = element.position.y;

        if (dragOffsets[id]) {
            x += dragOffsets[id].x;
            y += dragOffsets[id].y;
        }

        const xPercent = getPercentValue(x, slideSize.width);
        const yPercent = getPercentValue(y, slideSize.height);
        const widthPercent = getPercentValue(element.size.width, slideSize.width);
        const heightPercent = getPercentValue(element.size.height, slideSize.height);

        return (
            <div
                key={id}
                className={styles.selectionBox}
                style={{
                    position: 'absolute',
                    top: `${yPercent}%`,
                    left: `${xPercent}%`,
                    width: `${widthPercent}%`,
                    height: `${heightPercent}%`,
                    pointerEvents: 'none',
                    zIndex: 100,
                }}
            >
                <div className={styles.border}></div>
                {onStartResizing && (
                    RESIZE_HANDLERS.map(({pos, className}) => (
                        <div
                            className={className}
                            onMouseDown={
                                evt =>
                                    onStartResizing(id, pos, evt.clientX, evt.clientY)
                            }
                        ></div>
                    ))
                )}
            </div>
        );
    });

    return (
        <div className={styles.overlayContainer}>
            {overlays}
        </div>
    );
};