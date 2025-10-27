import styles from './SelectionOverlay.module.css';
import type {
    Size,
    SlideElement,
    Position
} from "../../store/types/types.ts";
import {
    concatModifiersByFlag,
    getPercentValue, getRandomId
} from "../../store/functions/untils/utils.ts";
import type {ResizeItem} from "../../store/types/utility-types.ts";

interface SelectionOverlayProps {
    selectedElementIds: string[];
    slideElements: SlideElement[];
    slideSize: Size;
    dragOffsets?: Record<string, Position>;
    resizePreview?: Record<string, { size: Size, position: Position }> | null;
    onStartResizing?: (id: string, item: ResizeItem, x: number, y: number) => void;
}

type Handler = {
    key: string;
    pos: ResizeItem;
    className: string;
}

const RESIZE_HANDLERS: Handler[] = [
    {
        key: getRandomId(),
        pos: 'top',
        className: concatModifiersByFlag([styles.resizeHandler, styles.resizeHandler_side, styles.resizeHandler_top])
    },
    {
        key: '2',
        pos: 'right',
        className: concatModifiersByFlag([styles.resizeHandler, styles.resizeHandler_side, styles.resizeHandler_right])
    },
    {
        key: '3',
        pos: 'bottom',
        className: concatModifiersByFlag([styles.resizeHandler, styles.resizeHandler_side, styles.resizeHandler_bottom])
    },
    {
        key: '4',
        pos: 'left',
        className: concatModifiersByFlag([styles.resizeHandler, styles.resizeHandler_side, styles.resizeHandler_left])
    },
    {
        key: '5',
        pos: 'topLeft',
        className: concatModifiersByFlag([styles.resizeHandler, styles.resizeHandler_corner, styles.resizeHandler_topLeft])
    },
    {
        key: '6',
        pos: 'topRight',
        className: concatModifiersByFlag([styles.resizeHandler, styles.resizeHandler_corner, styles.resizeHandler_topRight])
    },
    {
        key: '7',
        pos: 'bottomRight',
        className: concatModifiersByFlag([styles.resizeHandler, styles.resizeHandler_corner, styles.resizeHandler_botRight])
    },
    {
        key: '8',
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
        resizePreview,
        dragOffsets = {},
    }
    : SelectionOverlayProps) => {
    const overlays = selectedElementIds.map(id => {
        const element = slideElements.find(el => el.id === id);
        if (!element) {
            return null;
        }

        const preview = resizePreview?.[id];
        const displayPosition = preview?.position || element.position;
        const displaySize = preview?.size || element.size;

        let x = displayPosition.x;
        let y = displayPosition.y;

        if (dragOffsets[id]) {
            x += dragOffsets[id].x;
            y += dragOffsets[id].y;
        }

        const xPercent = getPercentValue(x, slideSize.width);
        const yPercent = getPercentValue(y, slideSize.height);
        const widthPercent = getPercentValue(displaySize.width, slideSize.width);
        const heightPercent = getPercentValue(displaySize.height, slideSize.height);

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
                    RESIZE_HANDLERS.map(({key, pos, className}) => (
                        <div
                            key={key}
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