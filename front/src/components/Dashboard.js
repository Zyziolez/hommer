import React, {useEffect,  useState} from 'react'
import MenuDashboard from './MenuDashboard'
import axios from 'axios'
import { Redirect, useRouteMatch, Route } from 'react-router-dom'
import {  isLogged } from './other/routes';
import { lazy } from 'react';

const HomeMain = lazy( () => import('./HomeMain') )
const Tasks = lazy( () => import('./Tasks') )
const Callendar = lazy( () => import('./Callendar') )
const ShoppingList = lazy( () => import('./ShoppingList') )
const CannotFound = lazy(() => import('./other/CannotFound') )
 


export default function Dashboard() {
    const [red, setRed] = useState( false )
    let {path} = useRouteMatch()

    useEffect(() => {
        axios.get( `/${isLogged}`, {'withCredentials':true} )
        .then( res => {
            if( res.data[0] ){
            }else{
                setRed(true)
            }
        } ).catch( err => console.log(err) )
       
        return() => {
            setRed( false )
        }
    }, [])


    return (
        <div>
            <MenuDashboard/>

            <Route exact path={`${path}`} children={ <HomeMain/> } />
            <Route path={`${path}/tasks`} children={ <Tasks/> } />
            <Route  path={`${path}/callendar`} children={ <Callendar/> } />
            <Route  path={`${path}/shopping-list`} children={ <ShoppingList/> } />
            {/* <Route  path={`${path}/*`} children={ <CannotFound/>} /> */}

            {red ? <Redirect to='/' /> :null }
        </div>
    )
}
