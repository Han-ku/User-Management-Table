import { configureStore } from "@reduxjs/toolkit"
import usersReducer from '../compoments/usersTableSlice'

export interface RootState {
    usersTable: ReturnType<typeof usersReducer>
}

export type AppDispatch = typeof store.dispatch

export const store = configureStore({
    reducer: {
        usersTable: usersReducer, 
    }
})