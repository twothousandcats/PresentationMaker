import type {Presentation} from "./types/types.ts";
import {getRandomId} from "./functions/untils/utils.ts";

let presentation: Presentation = {
    id: getRandomId(),
    title: 'new presentation',
    slides: [
        {
            id: '1', // TODO: getRandomId()
            background: {
                type: 'solid',
                color: '#000',
            },
            elements: [
                {
                    id: '1_1', // TODO: getRandomId()
                    position: {
                        x: 400,
                        y: 400
                    },
                    size: {
                        width: 400,
                        height: 200
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
            id: getRandomId(),
            background: {
                type: 'solid',
                color: '#fff',
            },
            elements: [
                {
                    id: getRandomId(),
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
                    id: getRandomId(),
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
            id: getRandomId(),
            background: {
                type: 'image',
                data: 'https://images.unsplash.com/photo-1731370963892-32c7347cd2d8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            },
            elements: []
        },
        {
            id: getRandomId(),
            background: {
                type: 'image',
                data: 'https://images.unsplash.com/photo-1758380389082-8a417db34c72?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            },
            elements: []
        },
        {
            id: getRandomId(),
            background: {
                type: 'image',
                data: 'https://images.unsplash.com/photo-1758380389302-b7f0ec59cf88?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            },
            elements: []
        },
    ],
    size: {
        width: 1240,
        height: 720
    },
    selection: {
        selectedSlideIds: ['1'],
        selectedElementIds: ['1_1']
    }
};
let presentationChangeHandler: Function = () => {};

function getPresentation(): Presentation {
    return presentation;
}

function setPresentation(newPresentation: Presentation): void {
    presentation = newPresentation;
}

function addPresentationChangeHandler(handler: Function): void {
    presentationChangeHandler = handler;
}

function dispatch(modifiedFn: any, payload: any = null): void {
    let newPresentation = null;
    if(payload) {
        newPresentation = modifiedFn(payload, presentation);
    } else {
        newPresentation = modifiedFn(presentation);
    }
    setPresentation(newPresentation);
    if (presentationChangeHandler) {
        presentationChangeHandler(newPresentation);
    }
}

export {
    presentation,
    getPresentation,
    addPresentationChangeHandler,
    dispatch
}