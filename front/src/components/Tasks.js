import React, {useState} from 'react'
import plus from './../images/plus.svg'

export default function Tasks() {
    const [tasks, setTasks] = useState([]) 

    const addTask = () => {

    }

    return (
        <div className='tasks' >
            <section className='up' >
                <h1> Tasks </h1>
                <button onClick={addTask} >  </button>
            </section>
            <section className='down' ></section>
        </div>
    )
}
