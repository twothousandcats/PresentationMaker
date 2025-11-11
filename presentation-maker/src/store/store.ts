import {configureStore} from "@reduxjs/toolkit";
import editorReducer from './editorSlice.ts';


export const store = configureStore({
    reducer: {
        editor: editorReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;