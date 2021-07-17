import React, {useEffect, useState} from 'react'
import img from './../images/main-image.svg'
import MenuEnter from './MenuEnter'
import {Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import { isLogged } from './other/routes';

export default function Main() {
    const [red, setRed] = useState( false )

    useEffect(() => {
        axios.get( `/${isLogged}`, {'withCredentials':true} )
        .then( res => {
            if( res.data[0] ){
                setRed(true)
            }
        } ).catch( err => console.log(err) )

        return() => {
            setRed( false )
        }
    }, [])

    return (
        <div className='main' >
            <MenuEnter/>
            <img src={img} alt='main page' />
            <div className='ball' ></div>
                <section>
                    <h1> Organize your home life </h1>
                    <Link to='/register' > <button> register </button> </Link> 
                    <h3> or </h3>
                    <Link to='/login' > <button> login </button>  </Link>
                </section>
                {red ? <Redirect to='/welcome' /> :null }
        </div>
    )
}
