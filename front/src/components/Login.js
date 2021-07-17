import React, {  useState, useEffect } from 'react'
import axios from 'axios'
import MenuEnter from './MenuEnter'
import { Redirect } from 'react-router-dom'

export default function Login() {
    const [login, setLogin] = useState( '' )
    const [pass, setPass] = useState( '' )
    const [red, setRed] = useState(false)

    const loginHandler = () => {
        if( login.trim().length > 0 && pass.trim().length > 0 ){
            axios.post( `/${login}`, { login: login, pass: pass } )
            .then( res => res.data ? setRed(true) : alert( 'zle' ) )
            .catch( err => console.log(err) )
        }
        
    }
    useEffect(() => {
        return()=>{
            setRed(false)
        }
    })

    return (
        <div className='login' >
            <MenuEnter/>
            <section className='left' >
                <input type='text' value={login} onChange={e=> setLogin(e.target.value) } />
                <input type='text' value={pass} onChange={e=> setPass(e.target.value) } />
                <button onClick={ loginHandler } > log me in! </button>
            </section>
            <section className='right' ></section>
            {red ? <Redirect to='/welcome' /> : null }
        </div> 
    )
}
