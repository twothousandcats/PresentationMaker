import AppStyle from "./App.module.css";
import MiniatureContainer from "../MiniatureContainer/MiniatureContainer.tsx";
import Slide from "../Slide/Slide.tsx";
import type {Presentation} from "../../types/types.ts";
import Toolbar from "../Toolbar/Toolbar.tsx";

export default function App() {
    const pres: Presentation = {
        id: '1',
        title: 'new presentation',
        slides: [
            {
                id: '1',
                background: {
                    type: 'solid',
                    color: '#fff',
                },
                elements: []
            },
            {
                id: '2',
                background: {
                    type: 'solid',
                    color: '#fff',
                },
                elements: []
            },
        ],
        size: {
            width: '100%',
            height: '100%'
        },
        selection: {
            selectedSlideIds: [],
            selectedElementIds: []
        }
    }

    return (
        <section className={AppStyle.presentation}>
            <Toolbar/>
            <div className={AppStyle.presentation__container}>
                <MiniatureContainer {...pres}/>
                <Slide {...pres}/>
            </div>
        </section>
    )
}