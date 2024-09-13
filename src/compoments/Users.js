import React from 'react'
import { useEffect, useState } from "react";
import SingleUser from './SingleUser';

export default function Users() {
    const [data, setData] = useState(null)
    const [filteredData, setFilteredData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [columnFilters, setColumnFilters] = useState({})
    const [inputVisible, setInputVisible] = useState({})

    const keys = ["name", "username", "email", "phone"]

    const url = 'https://jsonplaceholder.typicode.com/users'

    useEffect(() => {
        async function fetchAPIData() {
            try {
                const response = await fetch(url)
                const apiData = await response.json()
                setData(apiData)
                setFilteredData(apiData)
                console.log('Users: ', apiData)
            } catch(e) {
                console.error('Error fetching users:', e)
                setError(e.message)
            } finally {
                setLoading(false)
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
            setFilteredData(filtered)
        }
    }

    const handleColumnSearch = (key, value) => {
        const updatedFilters = { ...columnFilters, [key]: value }
    
        setColumnFilters(updatedFilters)
    
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
        setFilteredData(filtered)
    }

    const toggleInputVisibility = (key) => {
        setInputVisible({
            ...inputVisible,
            [key]: !inputVisible[key] 
        })
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
                            onChange={(e) => setSearchQuery(e.target.value)} />
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

