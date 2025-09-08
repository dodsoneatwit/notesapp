
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const credSlice = createSlice({
  name: 'cred',
  initialState: {
    email: '',
    password: '',
  },
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => { 
      state.email = action.payload; 
    },
    setPassword: (state, action: PayloadAction<string>) => { 
      state.password = action.payload; 
    },
  }
});

export const { setEmail, setPassword } = credSlice.actions;
export default credSlice.reducer;