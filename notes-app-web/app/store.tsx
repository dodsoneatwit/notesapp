
import throttle from 'lodash/throttle' // npm install --save-dev @types/lodash.throttle

import { configureStore, combineReducers } from '@reduxjs/toolkit'
import credReducer from '../store/credentialsSlice'
import { loadState, saveState } from '../store/localStorage'

const rootReducer = combineReducers({
  cred: credReducer
});

const preloadedState = loadState()
const store = configureStore({
  reducer: rootReducer,
  preloadedState
})

const throttledSaveState = throttle(() => saveState(store.getState()), 1000);
store.subscribe(throttledSaveState);

export default store;
