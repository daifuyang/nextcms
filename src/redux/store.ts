import { configureStore } from '@reduxjs/toolkit'

import initialStateReducer from './slice/initialState'
import userState from './slice/userState'
import { useDispatch, useSelector } from 'react-redux'

export const store = configureStore({
  reducer: {
    initialStateReducer,
    userState
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()