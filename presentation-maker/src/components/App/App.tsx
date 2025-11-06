import AppStyle from './App.module.css';
import SlidesList from '../SlidesList/SlidesList.tsx';
import type {Presentation} from '../../store/types/types.ts';
import Toolbar from '../Toolbar/Toolbar.tsx';
import SlideEditor from '../SlideEditor/SlideEditor.tsx';
import {dispatch} from '../../store/editor.ts';
import {removeElementsFromSlide, removeSlide} from '../../store/functions/functions.ts';
import {useEffect, useCallback} from 'react';
import {clearSelection} from '../../store/functions/utils/utils.ts';

interface AppProps extends Presentation {
}

export default function App(
    {
        id,
        title,
        slides,
        size,
        selection,
        mode
    }: AppProps
) {
    const handleDelete = useCallback(
        (evt: KeyboardEvent) => {
            const target = evt.target;
            if (
                target instanceof HTMLElement &&
                (target.tagName === 'INPUT' ||
                    target.tagName === 'TEXTAREA' ||
                    target.isContentEditable)
            ) {
                return;
            }

            if (evt.key === 'Backspace' || evt.key === 'Delete') {
                if (selection.selectedElementIds.length > 0) {
                    dispatch(removeElementsFromSlide, {
                        slideId: selection.selectedSlideIds[0],
                        elementIds: selection.selectedElementIds,
                    });
                } else if (selection.selectedSlideIds.length > 0) {
                    dispatch(removeSlide, {
                        slideIdsToRemove: selection.selectedSlideIds,
                    });
                }
            } else if (evt.key === 'Escape') {
                dispatch(clearSelection);
            }
        },
        [selection.selectedSlideIds, selection.selectedElementIds]
    );

    useEffect(() => {
        document.addEventListener('keydown', handleDelete as EventListener);
        return () => {
            document.removeEventListener('keydown', handleDelete as EventListener);
        };
    }, [handleDelete]);

    return (
        <section className={AppStyle.presentation}>
            <Toolbar
                presentationId={id}
                presentationTitle={title}
                presentationSelection={selection}
            />
            <div className={AppStyle.presentation__container}>
                <SlidesList
                    slides={slides}
                    size={size}
                    selection={selection}
                />
                <SlideEditor
                    slides={slides}
                    size={size}
                    selection={selection}
                    mode={mode}
                />
            </div>
        </section>
    );
}