import React, {useEffect,  useState} from 'react'
import axios from 'axios'
import Quote from 'inspirational-quotes'
import { dashboardMix, isLogged } from './other/routes';
import openSocket from 'socket.io-client'

const socket = openSocket(window.location.origin, {secure: true});

export default function HomeMain() {
    const [callendar, setCallendar]= useState([])
    const [list, setList] = useState([])
    let dat = new Date()


    useEffect(() => {
        axios.get(`/${dashboardMix}`)
        .then(res => {
            //add response status handling
            setCallendar( res.data.callendar )
            setList(res.data.list)
        }).catch(err => console.log(err))

    }, [])

    const updateCheckbox = (category, value, id) => {

        socket.emit( 'change-checkbox', { category: category, value: value, id: id } )
    }

    return (
        <div>

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
                            callendar.map( (cal, i) => {
                                let checker = cal.done
                                return( 
                                    <li key={i} > <b> {cal.title} </b> <span> {cal.text} </span> <input type='checkbox' defaultChecked={ checker } onChange={ e=> {
                                        checker = !checker
                                        updateCheckbox( 'callendar', checker, cal.id )
                                        e.target.checked = checker
                                    } } /> </li>
                                 )
                            }
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
                           list.map( (lis, i) => {
                            let checker = lis.done
                            return( 
                                <li key={i} >  <input type='checkbox' defaultChecked={ checker } onChange={ e=> {
                                    checker = !checker
                                    updateCheckbox( 'list', checker, lis.id )
                                    e.target.checked = checker
                                } } /> <span> {lis.product} </span> </li>
                             )
                        }
                        )     : <h2> There are no products to buy </h2>
                        }
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    )
}
