import style from './Slide.module.css';
import type {
    Size,
    Slide,
    Selection,
    EditorMode,
} from "../../store/types/types.ts";
import SlideElement from "../SlideElement/SlideElement.tsx";
import {concatModifiersByFlag} from "../../store/functions/utils/utils.ts";
import {SelectionOverlay} from "../SelectionOverlay/SelectionOverlay.tsx";
import {useElementDND} from "../../store/hooks/useElementDND.ts";
import {useResize} from "../../store/hooks/useResize.ts";
import {usePlacementMode} from "../../store/hooks/usePlacementMode.ts";

type SlideProps = {
    slide: Slide;
    slideSize: Size;
    selection: Selection;
    isEditable?: boolean;
    isActive?: boolean;
    activeElements?: string[];
    mode?: EditorMode;
};

export default function Slide(
    {
        slide,
        slideSize,
        selection,
        isEditable,
        isActive,
        activeElements,
        mode
    }: SlideProps) {
    const classNames = concatModifiersByFlag([
        style.slide,
        isEditable ? style.slide_editable : style.slide_preview,
        isActive ? style.slide_active : '',
    ]);
    const bgColor = slide.background && slide.background.type === 'solid'
        ? slide.background.color
        : '';
    const bgImg = slide.background && slide.background.type === 'image'
        ? slide.background.data
        : '';

    const {
        containerRef,
        placementPreview,
        handlePlacementStart,
        isPlacing,
    } = usePlacementMode({
        mode,
        slide,
        isEditable: !!isEditable,
    });
    const isInteractive = isEditable && !isPlacing;
    const {dragOffsets, handleDragStart} = useElementDND(slide, selection, isInteractive);
    const {startResizing, resizePreview} = useResize(slide, isInteractive);

    return (
        <div
            ref={containerRef}
            className={classNames}
            style={{
                backgroundColor: `${bgColor}`,
                ...(bgImg && {
                    backgroundImage: `url(${bgImg})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }),
                ...(isEditable
                    ? {
                        width: `${isEditable ? slideSize.width : ''}px`,
                        height: `${isEditable ? slideSize.height : ''}px`,
                        cursor: isPlacing ? 'crosshair' : 'default',
                    }
                    : {
                        width: '100%',
                        height: 'auto',
                        aspectRatio: `${slideSize.width} / ${slideSize.height}`,
                    }),
            }}
            onMouseDown={handlePlacementStart}>
            {slide.elements.map((element) =>
                <SlideElement
                    key={element.id}
                    element={element}
                    slideSize={slideSize}
                    slideId={slide.id}
                    slideElements={slide.elements}
                    selectedElementsIds={selection.selectedElementIds}
                    isEditable={!!isEditable}
                    isInteractive={isInteractive}
                    isPlacing={isPlacing}
                    isActive={isEditable && activeElements?.includes(element.id)}
                    onDragStart={(clientX, clientY) => handleDragStart(clientX, clientY)}
                    dragOffset={dragOffsets[element.id] || {x: 0, y: 0}}
                    resizePreview={resizePreview?.[element.id]}
                />
            )}
            {isEditable && (
                <SelectionOverlay
                    selectedElementIds={selection.selectedElementIds}
                    slideElements={slide.elements}
                    slideSize={slideSize}
                    dragOffsets={dragOffsets}
                    resizePreview={resizePreview}
                    onStartResizing={startResizing}
                />
            )
            }
            {placementPreview && (
                <div
                    style={{
                        position: 'absolute',
                        top: placementPreview.y,
                        left: placementPreview.x,
                        width: placementPreview.width,
                        height: placementPreview.height,
                        border: '1px dashed #0078d4',
                        backgroundColor: 'rgba(0, 120, 212, 0.1)',
                        pointerEvents: 'none',
                        zIndex: 1000,
                    }}
                />
            )}
        </div>
    );
}