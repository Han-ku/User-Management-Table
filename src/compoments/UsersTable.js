import React from 'react'
import SingleUser from './SingleUser';
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { setData, setError, setLoading, setSearchQuery, setFilteredData, setColumnFilters, toggleInputVisible } from './usersTableSlice'

const UsersTable = () => {

    const dispatch = useDispatch()

    const { data, filteredData, loading, error, searchQuery, columnFilters, inputVisible } = useSelector(state => state.usersTable)
    
    const keys = ["name", "username", "email", "phone"]
    const url = 'https://jsonplaceholder.typicode.com/users'

    useEffect(() => {
        const fetchAPIData = async () => {
            dispatch(setLoading(true))
            try {
                const response = await fetch(url)
                const apiData = await response.json()
                dispatch(setData(apiData))
            } catch (e) {
                dispatch(setError(e.message))
            }
        }

        fetchAPIData()
    }, [dispatch])

    if (loading) {
        return (
            <div className="loadingState">
                <i className="fa-solid fa-gear fa-spin"></i>
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (data) {
            const filtered = data.filter(user =>
                keys.some(key =>
                    user[key].toString().toLowerCase().includes(searchQuery.toLowerCase())
                )
            )
            dispatch(setFilteredData(filtered))
        }
    }

    const handleColumnSearch = (key, value) => {
        const updatedFilters = { ...columnFilters, [key]: value }
        dispatch(setColumnFilters(updatedFilters))

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
        dispatch(setFilteredData(filtered))
    }

    const toggleInputVisibility = (key) => {
        dispatch(toggleInputVisible(key))
    }


    return (
        <>
            <main className="table">
                <section className="section_filter">
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                        />
                        <button type="submit" className="submit">Submit</button>
                    </form>
                </section>
                <section className="table_body">
                    <table>
                        <thead>
                            <tr>
                                {keys.map((key) => (
                                    <th key={key}>
                                        {key}
                                        <button className="findByKey" onClick={() => toggleInputVisibility(key)} />
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

export default UsersTable