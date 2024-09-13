import { configureStore } from "@reduxjs/toolkit"
import usersReducer from '../compoments/usersTableSlice'
export const store = configureStore({
    reducer: {
        usersTable: usersReducer, 
    }
})