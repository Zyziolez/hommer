import React, {useState} from 'react'
import axios from 'axios'
import { register } from './other/routes'

export default function Register() {
    const [login, setLogin] = useState( '' )
    const [pass, setPass] = useState( '' )
    const [email, setEmail] = useState( '' )

    const handleRegister = () => {
        if( login.trim().length > 0 && pass.trim().length > 0 && email.trim().length > 0 && email.includes('@') ){
            axios.post( `/${register}`, { login: login, pass: pass, email: email } )
            .then( res => console.log(res.data) )
            .catch( err => console.log(err) )
        }else{
            console.log('error')
        }
    }
    return (
        <div>
            <section className='left' >
                <input type='text' value={login} onChange={e=> setLogin(e.target.value) } />
                <input type='password' value={pass} onChange={e=> setPass(e.target.value) } />
                <input type='text' value={email} onChange={e=> setEmail(e.target.value) } />

                <button onClick={ handleRegister } >register</button>
            </section>
            <section className='right' ></section>
        </div>
    )
}
