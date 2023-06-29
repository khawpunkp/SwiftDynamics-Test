import { createSlice, PayloadAction, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Define the user interface
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
  salary: number;
}

// Define the app state interface
interface AppState {
  users: User[];
}

// Define the initial state
const initialState: AppState = {
  users: [],
};

// Create the user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Add a user to the state
    addUser: (state, action: PayloadAction<User>) => {
      const user = {
        ...action.payload,
      };
      state.users.push(user);
    },
    // Update a user in the state
    updateUser: (state, action: PayloadAction<{ id: string; user: User }>) => {
      const { id, user } = action.payload;
      const index = state.users.findIndex((user) => user.id === id);
      if (index !== -1) {
        state.users[index] = user;
      }
    },
    // Remove multiple users from the state
    removeUsers: (state, action: PayloadAction<string[]>) => {
      const idsToRemove = action.payload;
      state.users = state.users.filter(
        (user) => !idsToRemove.includes(user.id)
      );
    },
    // Remove a user from the state
    removeUser: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      state.users = state.users.filter((user) => user.id !== userId);
    },
  },
});

// Configure the persist storage
const persistConfig = {
  key: "root",
  storage,
};

// Destructure the reducer and actions from the user slice
const { reducer: userReducer, actions: userActions } = userSlice;

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, userReducer);

// Configure the Redux store
const store = configureStore({
  reducer: persistedReducer,
});

// Create the persistor
const persistor = persistStore(store);

// Export the user actions, store, and persistor
export { userActions, store, persistor };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
