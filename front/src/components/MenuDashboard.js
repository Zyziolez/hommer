import React from 'react'
import {Link } from 'react-router-dom'
import axios from 'axios'

export default function MenuDashboard() {

    const logout = () => {
        axios.get(`/${logout}`)
        .then( res => {
            window.location.reload()
        } ).catch( err => console.log(err) )
    }

    return (
        <div className='menu-dashboard' >
            <p> hommer </p>
            <section>
                <Link to='/tasks' > Tasks </Link>
                <Link to='/callendar' > Callendar </Link>
                <Link to='/shopping-list' > Shopping List </Link>
                <button onClick={logout} > log out </button>
            </section>
        </div>
    )
}
