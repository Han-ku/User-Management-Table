import React from 'react'
import { useEffect, useState } from "react";

export default function Users() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const url = 'https://jsonplaceholder.typicode.com/users'

    useEffect(() => {
        async function fetchAPIData() {
            try {
                const response = await fetch(url)
                const apiData = await response.json()
                setData(apiData)
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
            <div className="mediaContainer">
                <h1>Users list</h1>
                <ul>
                    {data.map((user) => (
                    <li key={user.id}>
                        {user.name}
                    </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

