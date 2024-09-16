import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    [key: string]: any;
}

interface UsersTableState {
    data: User[] | null;
    filteredData: User[] | null;
    loading: boolean;
    error: string | null;
    searchQuery: string;
    selectedFields: string[]; 
}

const initialState: UsersTableState = {
    data: null,
    filteredData: null,
    loading: true,
    error: null,
    searchQuery: '',
    selectedFields: [],
}

export const usersSlice = createSlice({
    name: 'usersTable',
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<User[]>) => {
            state.data = action.payload
            state.filteredData = action.payload
            state.loading = false
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload
            state.loading = false
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload
        },
        setSelectedFields: (state, action: PayloadAction<string[]>) => {
            state.selectedFields = action.payload;
        },
        setFilteredData: (state, action: PayloadAction<User[]>) => {
            state.filteredData = action.payload
        }
    }
})


export const { 
    setData, setError, setLoading, 
    setSearchQuery,setSelectedFields,
    setFilteredData} = usersSlice.actions

export default usersSlice.reducer