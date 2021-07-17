import React, {useEffect, useRef, useState} from 'react'
import MenuDashboard from './MenuDashboard'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import Quote from 'inspirational-quotes'
import { dashboardMix, isLogged } from './other/routes';

export default function Dashboard() {
    const [red, setRed] = useState( false )
    // const [quote, setQuote] = useState('')
    const [callendar, setCallendar]= useState([])
    const [list, setList] = useState([])
    let dat = new Date()
    const checkRef = useRef()

    useEffect(() => {
        axios.get( `/${isLogged}`, {'withCredentials':true} )
        .then( res => {
            if( res.data[0] ){
                
            }else{
                setRed(true)
            }
        } ).catch( err => console.log(err) )
        axios.get(`/${dashboardMix}`)
        .then(res => {
            //add response status handling
            setCallendar( res.data.callendar )
            setList(res.data.list)
        }).catch(err => console.log(err))

        return() => {
            setRed( false )
        }
    }, [])

    const updateCheckbox = ( value) => {
       
            // axios.patch(`/update-checkbox/${cate}`, { new: val } )
            // .then( res => window.location.reload() )
            // .catch( er =>  console.log(er) )
        // checkRef.current = !value
        // console.log( checkRef.current )
    }

    return (
        <div>
            <MenuDashboard/>

            <section className='dash-left' >
                <div className='dash-callendar' > 
                    <div> {dat.toLocaleString('default', {month: 'long'})} </div>
                    <h2> {dat.toString().split(' ')[2]} </h2>
                </div>
                <div className='dash-quote' >
                    <h2> Quote of the day: </h2>
                    <p> {Quote.getRandomQuote()} </p>
                </div>
            </section>
            <section className='dash-right' >
                <div className='dash-cal-tasks' >
                    <h2> Tasks from callendar </h2>
                    <div>
                        <ul>
                            { callendar.length > 0 ? 
                            callendar.map( (cal, i) => 
                            <li key={i} > <b> {cal.title} </b> <span> {cal.text} </span> <input type='checkbox' checked={ cal.done } onChange={e => e.target.value = !e.target.value} ref={checkRef} /> </li>
                            )    : <h2> No tasks for today! </h2>
                        }
                        </ul>
                    </div>
                </div>
                <div className='dash-list' > 
                    <h2> Things to buy </h2>
                    <div>
                    <ul>
                            { list.length > 0 ? 
                            list.map( (lis, i) => 
                            <li key={i} > <input type='checkbox' checked={ lis.added } /> <span> {lis.product} </span> </li>
                            )    : <h2> There are no products to buy </h2>
                        }
                        </ul>
                    </div>
                </div>
            </section>

            {red ? <Redirect to='/' /> :null }
        </div>
    )
}
