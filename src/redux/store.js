import storageSession from "redux-persist/lib/storage/session";
import localStorage from "redux-persist/lib/storage";
import { configureStore } from "@reduxjs/toolkit";
import superAdminReducer from "./slices/superAdminStateSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
// import { persistReducer, persistStore } from "redux-persist";
// import thunk from "redux-thunk";
import { legacy_createStore as createStore } from 'redux'
import { combineReducers } from 'redux';


const persistConfig = {
  key: "root",
  storage: localStorage//storageSession, 
};
// const rootReducer = combineReducers({
//   userReducer: userReducer,
//   settingReducer: settingReducer,
// })
// const rootReducer = combineReducers({
//   user: persistReducer(persistConfig, userReducer),
//   // notes: noteReducer,
// });
const persistedReducer = persistReducer(persistConfig, superAdminReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  // middleware: [thunk],
  
});


export const persistor = persistStore(store);


