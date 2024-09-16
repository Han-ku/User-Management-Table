import React, { useEffect, useState, useMemo } from 'react'
import SingleUser from '../compoments/SingleUser';
import { useSelector, useDispatch } from 'react-redux'
import { setData, setError, setLoading, setSearchQuery, setFilteredData, setSelectedFields,  setActiveHeader, setFilter} from './usersTableSlice'
import { RootState, AppDispatch } from '../app/store'; 

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
}

const UsersTable: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>()

    const { data, filteredData, loading, error, searchQuery, selectedFields, activeHeader, filters} = useSelector((state: RootState) => state.usersTable)
    
    const keys = useMemo<(keyof User)[]>(() => ["name", "username", "email", "phone"], [])
    const url = 'https://jsonplaceholder.typicode.com/users'

    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
        const fetchAPIData = async () => {
            dispatch(setLoading(true))

            const loadingTimeoutId = setTimeout(() => {
                setShowLoading(true)
            }, 1000)

            const errorTimeoutId = setTimeout(() => {
                dispatch(setError('Database not found'))
                dispatch(setLoading(false))
                setShowLoading(false)
            }, 10000)

            try {
                const response = await fetch(url)
                if(!response.ok) {
                    throw new Error('Failed to fetch data')
                }
                const apiData = await response.json()
                dispatch(setData(apiData))
                clearTimeout(errorTimeoutId)
                clearTimeout(loadingTimeoutId)
                setShowLoading(false)
            } catch (e: any) {
                dispatch(setError('Database not found'))
                setShowLoading(false)
                clearTimeout(loadingTimeoutId)
            }finally {
                dispatch(setLoading(false))
            }
        }
        fetchAPIData()
    }, [dispatch])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('th') && activeHeader !== null) {
                dispatch(setActiveHeader(null))
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [activeHeader, dispatch])

    useEffect(() => {
        if (data) {    
            const filtered = data.filter(user => {
                return (
                    keys.every((key) => 
                        user[key]?.toString().toLowerCase().includes(filters[key]?.toLowerCase() || '')
                    ) && keys.some(key =>
                        user[key]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
                    )
                )
            })
            dispatch(setFilteredData(filtered))
        }
    }, [filters, data, searchQuery, keys, dispatch])

    const handleHeaderClick = (key: keyof User) => {
        dispatch(setActiveHeader(activeHeader === key ? null : key))
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof User) => {
        const value = e.target.value;
        dispatch(setFilter({ key, value }))
    }

    const handleResetFilters = () => {
        keys.forEach((key) => {
            dispatch(setFilter({ key, value: '' }))
        })
        dispatch(setSearchQuery(''))
        if (data) {
            dispatch(setFilteredData(data))
        }
    }

    if (loading && showLoading) {
        return (
            <div className="loadingState">
                <img src="\gear.png" alt="Loading.." />
            </div>
        )
    }

    if (error) {
        return <div>Error: {error}</div>
    }


    return (
        <>
            <main className="table">
                <section className='table_header'>
                    <div className="filter">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                        />
                    </div>
                    <div id='container_btn'>
                        <button id='btn-reset' onClick={handleResetFilters}>Reset all filters</button>
                    </div>
                </section>
                
                <section className="table_body">
                    <table>
                        <thead>
                            <tr>
                                {keys.map((key) => (
                                     <th key={key} onClick={() => handleHeaderClick(key)}>
                                     {activeHeader === key ? (
                                         <input
                                             type="text"
                                             value={filters[key] || ''}
                                             placeholder={`Filter by ${key}`}
                                             onChange={(e) => handleInputChange(e, key)}
                                             autoFocus
                                         />
                                     ) : (
                                         key
                                     )}
                                 </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData && filteredData.length > 0 ? (
                                filteredData.map((user) => (
                                    <tr key={user.id}>
                                        <SingleUser user={user} keys={keys} />
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={keys.length}>No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>
            </main>
        </>
    )
}

export default UsersTable