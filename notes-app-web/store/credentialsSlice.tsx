
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const credSlice = createSlice({
  name: 'cred',
  initialState: {
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    signedIn: false,
  },
  reducers: {
    setFirstName: (state, action: PayloadAction<string>) => { 
      state.firstname = action.payload; 
    },
    setLastName: (state, action: PayloadAction<string>) => { 
      state.lastname = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => { 
      state.username = action.payload; 
    },
    setEmail: (state, action: PayloadAction<string>) => { 
      state.email = action.payload; 
    },
    setPassword: (state, action: PayloadAction<string>) => { 
      state.password = action.payload; 
    },
    setSignedIn: (state, action: PayloadAction<boolean>) => { 
      state.signedIn = action.payload; 
    },
    clearCredentials: (state) => { 
      state.firstname = ""
      state.lastname = ""
      state.username = ""
      state.email = ""
      state.password = ""
      state.signedIn = false; 
    }
  }
});

export const { setFirstName, setLastName, setUserName, setEmail, setPassword, setSignedIn, clearCredentials } = credSlice.actions;
export default credSlice.reducer;