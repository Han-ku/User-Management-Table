import React from 'react'
import { useEffect, useState } from "react";
import SingleUser from './SingleUser';

export default function Users() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [keys, setKeys] = useState([])

    const url = 'https://jsonplaceholder.typicode.com/users'

    useEffect(() => {
        async function fetchAPIData() {
            try {
                const response = await fetch(url)
                const apiData = await response.json()
                setData(apiData)
                setKeys(Object.keys(apiData[0]))
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

    return (
        <>
            <main className="table">
                <section className="table_header">
                    <h1>Users list</h1>
                </section>
                <section className="table_body">
                    <table>
                        <thead>
                            <tr>
                               {keys.map((key) =>(
                                    <th key={key}>
                                        {key}
                                    </th>
                               ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((user) => (
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

