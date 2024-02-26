import { configureStore } from '@reduxjs/toolkit'

import initialStateReducer from './Slice/initialState'

export const store = configureStore({
  reducer: {
    initialStateReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch