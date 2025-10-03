
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { set } from 'lodash';

const spacesSlice = createSlice({
    name: 'spaces',
    initialState: {
        spaces: [] as Array<Object>,
        index: 0
    },
    reducers: {
        setSpaces: (state, action: PayloadAction<Array<Object>>) => { 
            state.spaces = action.payload;
        },
        setSpIndex: (state, action: PayloadAction<number>) => { 
            state.index = action.payload;
        }
    }
})

export const { setSpaces, setSpIndex } = spacesSlice.actions;
export default spacesSlice.reducer;