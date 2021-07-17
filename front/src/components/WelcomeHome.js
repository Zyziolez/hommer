import React, {useState, useEffect} from 'react'
import HomeMenu from './HomeMenu'
import axios from 'axios'
import { Redirect, Link } from 'react-router-dom'
import { createHome, isLogged, joinHome as joinhome } from './other/routes';

export default function WelcomeHome() {
    const [jointInpt, setJoinInpt] = useState('')
    const [seeCreate, setSeeCreate] = useState(false)
    const [houseName, setHouseName] = useState('')
    const [red, setRed] = useState( false )

    useEffect(() => {
        axios.get( `/${isLogged}`, {'withCredentials':true} )
        .then( res => {
            if( res.data[1].includes('null') && res.data[1] !== undefined ){
                
            }else{
                setRed(true)
            }
        } ).catch( err => console.log(err) )

        return() => {
            setRed( false )
        }
    }, [])

    const create = () => {
        if( houseName.trim().length > 0 ){
            axios.post(`/${createHome}`, { name: houseName })
            .then( res => {
                if(res.data){
                    window.location.reload()
                }
            } )
            .catch( err => console.log(err) )
        }
    }

    const joinHome = () => {
        if( jointInpt.trim().length === 6 ){
            axios.patch(`/${joinhome}`, {code: jointInpt})
            .then(res => {
                if( res.data ){
                    setRed(true)
                }
            } )
            .catch( err =>  console.log(err) )
        }
    }

    return (
        <div>
            <HomeMenu/>
            <section className='welcome-home-left' >
                <h1> Before we start... </h1>
            </section>
            <section className='welcome-home-right' >
                <h1> Welcome home! </h1>
                <b> I dont know what to do </b> 
                <p>If your “home” already exists, enter a 6-number code if not - create your own where you can add your family!</p>
                <div className='join-create' >
                    <input id='join' type='text' value={ jointInpt } onChange={e => setJoinInpt(e.target.value) } placeholder='enter code...' />
                    <label htmlFor='join' > join home </label>
                    <button onClick={joinHome} > join </button>
                    <p> or </p>
                    <button onClick={ e => setSeeCreate( !seeCreate ) } > create home </button>
                    {seeCreate ?
                    <div className='see-create' >
                        <input type='text' value={houseName} onChange={ e => setHouseName(e.target.value) } />
                        <button onClick={create} > Create! </button>
                    </div>    : null
                }
                </div>
            </section>
            <Link to='/remind-code' className='cant-remember-btn' > I can't remember my code! </Link>
            {red ? <Redirect to='/home' /> :null }
        </div>
    )
}
