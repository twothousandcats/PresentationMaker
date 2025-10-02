import type {ImageElement, Slide, TextElement} from "../types/types.ts";
import {getRandomId} from "../functions/untils/utils.ts";

const defaultSlideWidth = 240;

const defaultSlide: Slide = {
    id: getRandomId(),
    background: {
        type: 'solid',
        color: '#fff',
    },
    elements: []
};
const defaultTextElement: TextElement = {
    id: getRandomId(),
    position: {
        x: 0,
        y: 0
    },
    size: {
        width: 50,
        height: 50
    },
    background: null,
    type: 'text',
    content: '',
    fontFamily: 'Arial',
    fontSize: 14,
    fontWeight: 400,
    color: '#000'
};
const defaultImgElement: ImageElement = {
    id: getRandomId(),
    position: {
        x: 0,
        y: 0
    },
    size: {
        width: 200,
        height: 200
    },
    background: null,
    type: 'image',
    data: 'https://images.unsplash.com/photo-1758887371504-6473fa9ff96b?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
};

export {
    defaultSlideWidth,
    defaultSlide as slide,
    defaultTextElement as newTextElement,
    defaultImgElement as newImgElement,
}