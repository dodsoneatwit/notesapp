
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { set } from 'lodash';

const spacesSlice = createSlice({
    name: 'spaces',
    initialState: {
        spaces: [] as Array<Object>,
    },
    reducers: {
        setSpaces: (state, action: PayloadAction<Array<Object>>) => { 
            state.spaces = action.payload;
        }   
    }
})

export const { setSpaces } = spacesSlice.actions;
export default spacesSlice.reducer;