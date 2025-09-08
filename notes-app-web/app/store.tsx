
import { configureStore } from '@reduxjs/toolkit'
import credReducer from '../store/credentialsSlice';

export default configureStore({
  reducer: {
    cred: credReducer 
  }
})

