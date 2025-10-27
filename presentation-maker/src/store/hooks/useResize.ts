import type {
    Size,
    Slide,
    Position
} from '../types/types.ts';
import {useCallback, useState} from 'react';
import {dispatch} from '../editor.ts';
import {changeElPosition, changeElSize} from '../functions/functions.ts';
import type {ResizeItem} from "../types/utility-types.ts";

type ResizePreview = {
    size: Size;
    position: Position;
}

const MIN_SIZE = 10;

/* const calculateResize = (
    resizeItem: ResizeItem,
    delta: ResizeDelta,
    initialWidth: number,
    initialHeight: number,
    initialX: number,
    initialY: number
): ResizePreview => {
    const {deltaX, deltaY} = delta;
    switch (resizeItem) {
        case 'top':
            return {
                height: initialHeight - deltaY,
                y: initialY + deltaY,
            };
        case 'right':
            return {
                width: initialWidth + deltaX,
            };
        case 'bottom':
            return {
                height: initialHeight + deltaY,
            };
        case 'left':
            return {
                width: initialWidth - deltaX,
                x: initialX + deltaX,
            };
        case 'topLeft':
            return {
                width: initialWidth - deltaX,
                height: initialHeight - deltaY,
                x: initialX + deltaX,
                y: initialY + deltaY,
            };
        case 'topRight':
            return {
                width: initialWidth + deltaX,
                height: initialHeight - deltaY,
                y: initialY + deltaY,
            };
        case 'bottomLeft':
            return {
                width: initialWidth - deltaX,
                height: initialHeight + deltaY,
                x: initialX + deltaX,
            };
        case 'bottomRight':
            return {
                width: initialWidth + deltaX,
                height: initialHeight + deltaY,
            };
        default:
            return {
                width: initialWidth,
                height: initialHeight,
                x: initialX,
                y: initialY,
            }
    }
}; */

const computeFinalResize = (
    resizeItem: ResizeItem,
    deltaX: number,
    deltaY: number,
    initialWidth: number,
    initialHeight: number,
    initialX: number,
    initialY: number,
): ResizePreview => {
    const affectsWidth = ['left', 'right', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight'].includes(resizeItem);
    const affectsHeight = ['top', 'bottom', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight'].includes(resizeItem);
    const affectsPositionX = ['left', 'topLeft', 'bottomLeft'].includes(resizeItem);
    const affectsPositionY = ['top', 'topLeft', 'topRight'].includes(resizeItem);

    let newWidth = initialWidth;
    let newHeight = initialHeight;

    if (affectsWidth) {
        if (['left', 'topLeft', 'bottomLeft'].includes(resizeItem)) {
            newWidth = initialWidth - deltaX;
        } else {
            newWidth = initialWidth + deltaX;
        }
    }

    if (affectsHeight) {
        if (['top', 'topLeft', 'topRight'].includes(resizeItem)) {
            newHeight = initialHeight - deltaY;
        } else {
            newHeight = initialHeight + deltaY;
        }
    }

    newWidth = Math.max(MIN_SIZE, newWidth);
    newHeight = Math.max(MIN_SIZE, newHeight);

    let newX = initialX;
    let newY = initialY;

    if (affectsPositionX) {
        newX = initialX + (initialWidth - newWidth);
    }

    if (affectsPositionY) {
        newY = initialY + (initialHeight - newHeight);
    }

    return {
        size: {width: newWidth, height: newHeight},
        position: {x: newX, y: newY},
    }
}

export const useResize = (
    slide: Slide,
    isEditable?: boolean,
) => {
    const [resizePreview, setResizePreview] = useState<Record<string, ResizePreview> | null>(null);

    const startResizing = useCallback(
        (
            elementId: string,
            resizeItem: ResizeItem,
            clientX: number,
            clientY: number
        ) => {
            if (!isEditable) {
                return;
            }

            const element = slide.elements.find(el => el.id === elementId);
            if (!element) {
                return;
            }

            const initialData = {
                width: element.size.width,
                height: element.size.height,
                x: element.position.x,
                y: element.position.y,
            }

            const startMouse: Position = {
                x: clientX,
                y: clientY,
            }

            const handleMouseMove = (event: MouseEvent) => {
                event.preventDefault(); // с изображением были баги
                const delta: Position = {
                    x: event.clientX - startMouse.x,
                    y: event.clientY - startMouse.y,
                }

                const preview = computeFinalResize(
                    resizeItem,
                    delta.x,
                    delta.y,
                    initialData.width,
                    initialData.height,
                    initialData.x,
                    initialData.y,
                );

                setResizePreview({[elementId]: preview});
            };

            const handleMouseUp = (event: MouseEvent) => {
                setResizePreview(null);

                const finalDeltaX = event.clientX - startMouse.x;
                const finalDeltaY = event.clientY - startMouse.y;

                const finalPreview = computeFinalResize(
                    resizeItem,
                    finalDeltaX,
                    finalDeltaY,
                    initialData.width,
                    initialData.height,
                    initialData.x,
                    initialData.y,
                );

                dispatch(changeElSize, {
                    slideId: slide.id,
                    elementId,
                    newSize: finalPreview.size,
                });

                dispatch(changeElPosition, {
                    slideId: slide.id,
                    elementId,
                    newPosition: finalPreview.position,
                })

                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        },
        [slide, isEditable]
    );


    return {startResizing, resizePreview};
};