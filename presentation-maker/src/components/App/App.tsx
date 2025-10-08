import AppStyle from "./App.module.css";
import SlidesList from "../SlidesList/SlidesList.tsx";
import type {Presentation} from "../../store/types/types.ts";
import Toolbar from "../Toolbar/Toolbar.tsx";
import SlideEditor from "../SlideEditor/SlideEditor.tsx";
import {dispatch} from "../../store/editor.ts";
import {removeElementsFromSlide, removeSlide} from "../../store/functions/functions.ts";
import {useEffect} from "react";
import {clearSelection} from "../../store/functions/untils/utils.ts";

export default function App(presentation: Presentation) {
    const handleDelete = (evt: KeyboardEvent) => {
        if (
            evt.target instanceof HTMLElement &&
            (evt.target.tagName === 'INPUT' ||
                evt.target.tagName === 'TEXTAREA' ||
                evt.target.isContentEditable)
        ) {
            return;
        }

        if (evt.key === 'Backspace' || evt.key === 'Delete') {
            if (presentation.selection.selectedElementIds.length) {
                dispatch(removeElementsFromSlide, {
                    slideId: presentation.selection.selectedSlideIds[0],
                    elementIds: presentation.selection.selectedElementIds,
                });
            } else if (presentation.selection.selectedSlideIds.length && !presentation.selection.selectedElementIds.length) {
                dispatch(removeSlide, {slideIdsToRemove: presentation.selection.selectedSlideIds});
            }
        } else if (evt.key === 'Escape') {
            dispatch(clearSelection);
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleDelete);
        return () => document.removeEventListener('keydown', handleDelete);
    }, [presentation.selection.selectedSlideIds, presentation.selection.selectedElementIds]);

    return (
        <section className={AppStyle.presentation}>
            <Toolbar presentationId={presentation.id}
                     presentationTitle={presentation.title}
                     presentationSelection={presentation.selection}
            />
            <div className={AppStyle.presentation__container}>
                <SlidesList
                    slides={presentation.slides}
                    size={presentation.size}
                    selection={presentation.selection}
                />
                <SlideEditor
                    slides={presentation.slides}
                    size={presentation.size}
                    selection={presentation.selection}
                />
            </div>
        </section>
    )
}