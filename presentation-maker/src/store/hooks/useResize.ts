import type {
    Slide
} from '../types/types.ts';
import {useCallback} from 'react';
import {dispatch} from '../editor.ts';
import {changeElPosition, changeElSize} from '../functions/functions.ts';
import type {ResizeItem} from "../types/utility-types.ts";

type ResizeDelta = {
    deltaX: number;
    deltaY: number;
}

type ResizeResult = {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
}

const MIN_SIZE = 10;

const calculateResize = (
    resizeItem: ResizeItem,
    delta: ResizeDelta,
    initialWidth: number,
    initialHeight: number,
    initialX: number,
    initialY: number
): ResizeResult => {
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
};

export const useResize = (
    slide: Slide,
    isEditable?: boolean,
) => {
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

            const initialX = clientX;
            const initialY = clientY;
            const {width: initialWidth, height: initialHeight} = element.size;
            const {x: initialPositionX, y: initialPositionY} = element.position;

            const handleMouseMove = (event: MouseEvent) => {
                const delta = {
                    deltaX: event.clientX - initialX,
                    deltaY: event.clientY - initialY,
                }

                const result = calculateResize(
                    resizeItem,
                    delta,
                    initialWidth,
                    initialHeight,
                    initialPositionX,
                    initialPositionY,
                );

                const newWidth = result.width
                    ? Math.max(MIN_SIZE, result.width)
                    : initialWidth;
                const newHeight = result.height
                    ? Math.max(MIN_SIZE, result.height)
                    : initialHeight;

                dispatch(changeElSize, {
                    slideId: slide.id,
                    elementId,
                    newSize: {
                        width: newWidth,
                        height: newHeight
                    }
                });

                const newX = result.x ?? initialPositionX;
                const newY = result.y ?? initialPositionY;
                if (result.x || result.y) {
                    dispatch(changeElPosition, {
                        slideId: slide.id,
                        elementId,
                        newPosition: {
                            x: newX,
                            y: newY,
                        },
                    });
                }
            };

            const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        },
        [slide, isEditable]
    );


    return {startResizing};
};