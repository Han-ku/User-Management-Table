import React, { useEffect, FormEvent, useState } from 'react'
import SingleUser from '../compoments/SingleUser';
import { useSelector, useDispatch } from 'react-redux'
import { setData, setError, setLoading, setSearchQuery, setFilteredData, setSelectedFields} from './usersTableSlice'
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

    const { data, filteredData, loading, error, searchQuery, selectedFields} = useSelector((state: RootState) => state.usersTable)
    
    const keys: (keyof User)[] = ["name", "username", "email", "phone"]
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

    const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        const isChecked = e.target.checked
    
        let updatedFields: string[]
        if (isChecked) {
            updatedFields = [...selectedFields, value]
        } else {
            updatedFields = selectedFields.filter(field => field !== value)
        }
    
        dispatch(setSelectedFields(updatedFields))
    }
    
    const handleSearch = (e: FormEvent) => {
        e.preventDefault();

        const fieldsToSearch = selectedFields.length === 0 || selectedFields.length === keys.length
            ? keys.map(key => key.toString())
            : selectedFields

        if (data) {
            const filtered = data.filter(user =>
                fieldsToSearch.some(key =>
                    user[key]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
                )
            )
            dispatch(setFilteredData(filtered))
        }
    }

    return (
        <>
            <main className="table">
                <section className="section_filter">
                    <form onSubmit={handleSearch}>
                        <div>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                            />
                            <div className="multi-select">
                                <details>
                                    <summary>Sort By</summary> 
                                    <div className="options">
                                        {keys.map((key) => (
                                            <div className="selectors" key={key}>
                                                <input
                                                    type="checkbox"
                                                    id={`checkbox-${key}`}
                                                    value={key}
                                                    checked={selectedFields.includes(key)}
                                                    onChange={handleSelectChange}
                                                />
                                                <label htmlFor={`checkbox-${key}`}>{key}</label>
                                            </div>
                                        ))}
                                    </div>
                                    
                                </details>
                            </div>
                        </div>
                        
                        <button type="submit" className="submit">Search</button>
                    </form>
                </section>
                <section className="table_body">
                    <table>
                        <thead>
                            <tr>
                                {keys.map((key) => (
                                    <th key={key}>
                                        {key}
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