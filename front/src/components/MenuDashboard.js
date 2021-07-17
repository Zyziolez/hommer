import React from 'react'
import {Link, useRouteMatch } from 'react-router-dom'
import axios from 'axios'
import {logout as logOut} from './other/routes'

export default function MenuDashboard() {
let {path} = useRouteMatch()

    const logout = () => {
        axios.get(`/${logOut}`)
        .then( res => {
            window.location.reload()
        } ).catch( err => console.log(err) )
    }

    return (
        <div className='menu-dashboard' >
            <Link to={`${path}`} > <p> hommer </p> </Link>
            <section>
                <Link to={`${path}/tasks`} > Tasks </Link>
                <Link to={`${path}/callendar`} > Callendar </Link>
                <Link to={`${path}/shopping-list`} > Shopping List </Link>
                <button onClick={logout} > log out </button>
            </section>
        </div>
    )
}
