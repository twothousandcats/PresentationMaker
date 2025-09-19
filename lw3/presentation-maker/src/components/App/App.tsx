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
                elements: [
                    {
                        id: '1',
                        position: {
                            x: 0,
                            y: 0
                        },
                        size: {
                            width: 100,
                            height: 100
                        },
                        type: 'text',
                        content: 'Slide title',
                        fontFamily: 'Arial',
                        fontSize: 14,
                        color: '#000',
                        background: {
                            type: 'solid',
                            color: '#f5f5dc',
                        }
                    },
                    {
                        id: '2',
                        position: {
                            x: 100,
                            y: 100
                        },
                        size: {
                            width: 200,
                            height: 200
                        },
                        type: 'image',
                        data: 'https://images.unsplash.com/photo-1757865579164-23ff0b8e3e5f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                        background: null
                    }
                ]
            },
        ],
        size: {
            width: 100,
            height: 100
        },
        selection: {
            selectedSlideIds: ['2'],
            selectedElementIds: []
        }
    }

    return (
        <section className={AppStyle.presentation}>
            <Toolbar {...pres}/>
            <div className={AppStyle.presentation__container}>
                <MiniatureContainer {...pres}/>
                <Slide {...pres}/>
            </div>
        </section>
    )
}