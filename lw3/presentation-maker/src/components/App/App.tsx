import AppStyle from "./App.module.css";
import SlidesList from "../SlidesList/SlidesList.tsx";
import type {Presentation} from "../../store/types/types.ts";
import Toolbar from "../Toolbar/Toolbar.tsx";
import SlideEditor from "../SlideEditor/SlideEditor.tsx";

export default function App(presentation: Presentation) {
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