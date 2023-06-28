import { createSlice, PayloadAction, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { v4 as uuidv4 } from 'uuid';

export interface User {
    id: string; 
    title: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    nationality: string;
    id1: string;
    id2: string;
    id3: string;
    id4: string;
    id5: string;
    idNumber: string;
    gender: string;
    dial: string;
    number: string;
    phoneNumber: string;
    passportNumber: string;
    salary: string;
}

interface AppState {
    users: User[];
}

const initialState: AppState = {
    users: [],
};


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      addUser: (state, action: PayloadAction<User>) => {
        const userWithId = {
          ...action.payload,
          id: uuidv4(), // Generate a unique ID using uuidv4()
        };
        state.users.push(userWithId);
      },
      updateUser: (state, action: PayloadAction<{ id: string; user: User }>) => {
        const { id, user } = action.payload;
        const index = state.users.findIndex((user) => user.id === id);
        if (index !== -1) {
          state.users[index] = user;
        }
      },
      removeUsers: (state, action: PayloadAction<string[]>) => {
        const idsToRemove = action.payload;
        state.users = state.users.filter((user) => !idsToRemove.includes(user.id));
      },
      removeUser: (state, action: PayloadAction<string>) => {
        const userId = action.payload;
        state.users = state.users.filter((user) => user.id !== userId);
      },
    },
  });

const persistConfig = {
    key: 'root',
    storage,
};

const { reducer: userReducer, actions: userActions } = userSlice;

const persistedReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store);

export { userActions, store, persistor };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
