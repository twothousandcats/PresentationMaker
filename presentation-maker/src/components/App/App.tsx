import AppStyle from "./App.module.css";
import SlidesList from "../SlidesList/SlidesList.tsx";
import type {Presentation} from "../../store/types/types.ts";
import Toolbar from "../Toolbar/Toolbar.tsx";
import SlideEditor from "../SlideEditor/SlideEditor.tsx";
import {dispatch} from "../../store/editor.ts";
import {removeElementsFromSlide} from "../../store/functions/functions.ts";
import {useEffect} from "react";
import {clearElementsSelection} from "../../store/functions/untils/utils.ts";

export default function App(presentation: Presentation) {
    useEffect(() => {
        function handleDelete(evt: KeyboardEvent) {
            if (
                evt.target instanceof HTMLElement &&
                (evt.target.tagName === 'INPUT' ||
                    evt.target.tagName === 'TEXTAREA' ||
                    evt.target.isContentEditable)
            ) {
                return;
            }

            if (evt.key === 'Backspace' || evt.key === 'Delete') {
                dispatch(
                    removeElementsFromSlide,
                    {
                        slideId: presentation.selection.selectedSlideIds[0],
                        elementIds: presentation.selection.selectedElementIds,
                    }
                );
            } else if (evt.key === 'Escape') {
                dispatch(clearElementsSelection);
            }
        }

        document.addEventListener('keydown', handleDelete);
        return () => document.removeEventListener('keydown', handleDelete);
    }, [presentation.selection.selectedSlideIds, presentation.selection.selectedElementIds]);

    return (
        <section className={AppStyle.presentation}>
            <Toolbar {...presentation}/>
            <div className={AppStyle.presentation__container}>
                <SlidesList {...presentation}/>
                <SlideEditor {...presentation}/>
            </div>
        </section>
    )
}