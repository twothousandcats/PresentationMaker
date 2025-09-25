import AppStyle from "./App.module.css";
import SlidesList from "../SlidesList/SlidesList.tsx";
import type {Presentation} from "../../store/types/types.ts";
import Toolbar from "../Toolbar/Toolbar.tsx";
import SlideEditor from "../SlideEditor/SlideEditor.tsx";
import {useState} from "react";

export default function App() {
    const pres: Presentation = {
        id: '1',
        title: 'new presentation',
        slides: [
            {
                id: '1',
                background: {
                    type: 'solid',
                    color: '#000',
                },
                elements: [
                    {
                        id: '1',
                        position: {
                            x: 400,
                            y: 400
                        },
                        size: {
                            width: 1000,
                            height: 400
                        },
                        type: 'text',
                        content: 'first slide',
                        fontFamily: 'Arial',
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#fc3fc3',
                        background: {
                            type: 'solid',
                            color: '#f5f5dc',
                        }
                    }
                ]
            },
            {
                id: '2',
                background: {
                    type: 'solid',
                    color: '#fff',
                },
                elements: [
                    {
                        id: '2',
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
                        fontWeight: 400,
                        color: '#000',
                        background: {
                            type: 'solid',
                            color: '#f5f5dc',
                        }
                    },
                    {
                        id: '3',
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
            {
                id: '3',
                background: {
                    type: 'image',
                    data: 'https://images.unsplash.com/photo-1731370963892-32c7347cd2d8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                },
                elements: []
            },
            {
                id: '4',
                background: {
                    type: 'image',
                    data: 'https://images.unsplash.com/photo-1758380389082-8a417db34c72?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                },
                elements: []
            },
            {
                id: '5',
                background: {
                    type: 'image',
                    data: 'https://images.unsplash.com/photo-1758380389302-b7f0ec59cf88?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                },
                elements: []
            },
        ],
        size: {
            width: 1920,
            height: 1080
        },
        selection: {
            selectedSlideIds: ['2', '3'],
            selectedElementIds: ['3']
        }
    }

    const [presentation, setPresentation] = useState<Presentation>(pres);

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