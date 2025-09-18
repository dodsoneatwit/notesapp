
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { set } from 'lodash';

const notesSlice = createSlice({
    name: 'notes',
    initialState: {
        notes: [] as Array<Object>, // id, title, content
    },
    reducers: {
        setNotes: (state, action: PayloadAction<Array<Object>>) => { 
            state.notes = action.payload;
        }   
    }
})

export const { setNotes } = notesSlice.actions;
export default notesSlice.reducer;