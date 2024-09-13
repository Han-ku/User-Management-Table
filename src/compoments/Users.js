import React from 'react'
import { useEffect, useReducer } from "react";
import SingleUser from './SingleUser';

const initialState = {
    data: null,
    filteredData: null,
    loading: true,
    error: null,
    searchQuery: '',
    columnFilters: {},
    inputVisible: {}
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_DATA':
            return { ...state, data: action.payload, filteredData: action.payload, loading: false }
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false }
        case 'SET_LOADING':
            return { ...state, loading: action.payload }
        case 'SET_SEARCH_QUERY':
            return { ...state, searchQuery: action.payload }
        case 'SET_FILTERED_DATA':
            return { ...state, filteredData: action.payload }
        case 'SET_COLUMN_FILTERS':
            return { ...state, columnFilters: action.payload }
        case 'TOGGLE_INPUT_VISIBLE':
            return {
                ...state,
                inputVisible: {
                    ...state.inputVisible,
                    [action.key]: !state.inputVisible[action.key]
                }
            }
        default:
            throw new Error('Unknown action type')
    }
}

export default function Users() {
    const [state, dispatch] = useReducer(reducer, initialState)
    const { data, filteredData, loading, error, searchQuery, columnFilters, inputVisible } = state;

    const keys = ["name", "username", "email", "phone"]

    const url = 'https://jsonplaceholder.typicode.com/users'

    useEffect(() => {
        async function fetchAPIData() {
            try {
                const response = await fetch(url)
                const apiData = await response.json()
                dispatch({ type: 'SET_DATA', payload: apiData })
            } catch(e) {
                dispatch({ type: 'SET_ERROR', payload: e.message })
            }
        }

        fetchAPIData()
    }, [])


    if(loading) {
        return (
           <div className="loadingState">
                <i className="fa-solid fa-gear fa-spin"></i>
           </div>
        )
    }

    if (error) {
        return <div> Error: {error} </div>;
    }

    const handleSearch = (e) => {
        e.preventDefault()

        if (data) {
            const filtered = data.filter(user => {
                return keys.some(key =>
                    user[key].toString().toLowerCase().includes(searchQuery.toLowerCase())
                )
            })
            dispatch({ type: 'SET_FILTERED_DATA', payload: filtered })
        }
    }

    const handleColumnSearch = (key, value) => {
        const updatedFilters = { ...columnFilters, [key]: value }
    
        dispatch({ type: 'SET_COLUMN_FILTERS', payload: updatedFilters })
    
        const filtered = data.filter(user =>
            Object.keys(updatedFilters).every(columnKey => {
                if (updatedFilters[columnKey]) {
                    const filterValue = updatedFilters[columnKey].toLowerCase()
                    const userValue = user[columnKey].toString().toLowerCase()
                    
                    return userValue.startsWith(filterValue) || userValue === filterValue
                }
                return true
            })
        )
        dispatch({ type: 'SET_FILTERED_DATA', payload: filtered })
    }

    const toggleInputVisibility = (key) => {
        dispatch({ type: 'TOGGLE_INPUT_VISIBLE', key })
    }

    return (
        <>
            <main className="table">
                <section className='section_filter'>
                     <form onSubmit={handleSearch}>
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            placeholder="Search..." 
                            value={searchQuery}
                            onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })} />
                        <button type="submit" className='submit'>Submit</button>
                    </form>
                </section>
                <section className="table_body">
                    <table>
                        <thead>
                            <tr>
                               {keys.map((key) =>(
                                    <th key={key}>
                                        {key}
                                        <button className='findByKey' onClick={() => toggleInputVisibility(key)} />
                                        {inputVisible[key] && (
                                            <input
                                                type="text"
                                                placeholder={`Search ${key}`}
                                                value={columnFilters[key] || ""}
                                                onChange={(e) => handleColumnSearch(key, e.target.value)}
                                            />
                                        )}
                                    </th>
                               ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((user) => (
                                <tr key={user.id}>
                                    <SingleUser user={user} keys={keys} />
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </>
    )
}

