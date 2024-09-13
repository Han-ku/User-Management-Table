import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: null,
    filteredData: null,
    loading: true,
    error: null,
    searchQuery: '',
    columnFilters: {},
    inputVisible: {}
}

export const usersSlice = createSlice({
    name: 'usersTable',
    initialState,
    reducers: {
        setData: (state, action) => {
            state.data = action.payload
            state.filteredData = action.payload
            state.loading = false
        },
        setError: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload
        },
        setFilteredData: (state, action) => {
            state.filteredData = action.payload
        },
        setColumnFilters: (state, action) => {
            state.columnFilters = action.payload
        },
        toggleInputVisible: (state, action) => {
            if (typeof state.inputVisible[action.payload] === 'undefined') {
                state.inputVisible[action.payload] = true
            } else {
                state.inputVisible[action.payload] = !state.inputVisible[action.payload]
            }
        }
    }
})


export const { 
    setData, setError, setLoading, 
    setSearchQuery, setFilteredData, 
    setColumnFilters, toggleInputVisible} = usersSlice.actions

export default usersSlice.reducer