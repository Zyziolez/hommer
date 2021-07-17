const path = require('path')
const { createHome, dashboardMix, isLogged, logout } = require('../front/src/components/other/routes')
require('dotenv').config({path: path.join(__dirname, '.env')})
const cors = require('cors')
const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer")
const cookies = require('cookie-parser')
const { register, login } = require('../front/src/components/other/routes')
//vars
const app = express()
const port = 3058

//database connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DB
})

async function mail ( name, recipient, link  ) {
    let test = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_EMAIL, 
            pass: process.env.EMAIL_PASS, 
          },
    })

    let info = await transporter.sendMail({
        from: `"Registration" <admin@itinit.pl>`, 
        to: recipient,
        subject: "Registratioon", 
        text: "??", 
        html: `<div style={{ fontFamily: "Arial" }} >
        <p> hommer </p>
        <section style=" text-align: 'center'; margin-top: '3rem';" >
            <img src='./img.svg alt='email' style='height: 2rem /> 
            <h1> This is one last step! </h1>
            <p> To confirm your registration please click in the link below: </p>
            <br></br>
            <a href='/' > http://hommer.com/register/2738 </a>
            <br></br>
            <br></br>
            <p> If you did not register anywhere, dont worry, but check out <a href='/' > http://hommer.com </a> (it’s cool we promise) </p>
        </section>
    </div>`, 
      });
}

connection.connect()

//app.use stuff
app.use( cors() )
app.use(bodyParser.urlencoded({ extended: false }));
app.use( bodyParser.json() )
app.use( cookies() )

//routes
app.post( `/${login}`, (req, res) => {
    let info = req.body;
    connection.query( 'SELECT * FROM users WHERE login = ? AND  pass =  HEX(AES_ENCRYPT(?, ?)) ', [ info.login, info.pass, process.env.HASHSTRING], ( err, result, firlds  ) => {
        if(err){
            console.log(err)
            res.send(false)
        }
        if( result.length > 0 ){
            const accessToken = jwt.sign( result[0].id, process.env.JWT_STR )
            res.cookie('token', accessToken, {httpOnly: true, credentials: true})
            res.cookie('home', result[0].home_id, {httpOnly: true, credentials: true})
            res.send(true)
        }else{
            res.send(false)
        }
    } )
} )
app.post( `/${register}`, (req, res) => {
    let info = req.body;

    console.log('register')

    connection.query( 'INSERT INTO users VALUES ( UUID(), ?, HEX(AES_ENCRYPT(?, ? )), null, false )', [ info.login, info.pass, process.env.HASHSTRING], ( err, result, firlds  ) => {
        if(err){
            console.log(err)
            res.send(false)
        }
    //    mail( 'buba', 'zuziabalinska@gmail.com', 'idk' )
    } )

} )
app.get( `/${isLogged}`, (req, res) => {
    const cookie = req.cookies['token'];
    
    jwt.verify( cookie, process.env.JWT_STR, (err, user) => {
        if(err){
            res.send(false)
        }else[
            res.send([true, req.cookies['home']])
        ]
    } )
} )
app.post(`/${createHome}`, (req, res) => {
    let name = req.body.name
    const cookie = req.cookies['token'];

    jwt.verify( cookie, process.env.JWT_STR, (err, user) => {
        if(err){
            res.send(false)
        }

        const createId = () => {
            let str = ''
            
             str = Math.random() 
             str = str.toString()
                str = str.split('.')[1].slice(0, 6)
          return str
        }

        const id = createId()

        const queryPromise = new Promise((resolve, reject) => {
            connection.query( 'INSERT INTO homes VALUES ( ?,  ?, CURDATE())', [ id, name ], (err, result, fields ) => {
                if(err){
                    console.log(err)
                    reject(':(')
                }
                resolve(id)
            } )
        }).then(resp => {
            connection.query( 'UPDATE users SET home_id = ? WHERE id = ?', [id, user], (err, result, fields) => {
                if(err){
                    console.log(err)
                    res.send(false)
                }
                res.cookie('home', id, {httpOnly: true, credentials: true})
                res.send(true)
            } )
        })
    } )
})
app.get(`/${logout}`, (req, res) => {
    res.clearCookie('token')
    res.clearCookie('home')
    res.sendStatus(202)
})
app.get(`/${dashboardMix}`, (req, res) => {
    const cookie = req.cookies['token'];

    jwt.verify( cookie, process.env.JWT_STR, (err, user) => {
        if(err){
            res.send(false)
        }

        const queryPromise = new Promise((resolve, reject) => {
            connection.query( 'SELECT shopping_products.product, shopping_products.added, shopping_categories.name as category  FROM shopping_products, shopping_categories, shopping_list WHERE shopping_categories.list_id = shopping_list.id AND shopping_products.list_id = shopping_list.id AND shopping_list.home_id = ?', [ req.cookies['home'] ], (err, result, fields ) => {
                if(err){
                    console.log(err)
                    reject(':(')
                }
                resolve(result)
            } )
        }).then(resp => {
            connection.query('SELECT title, text, done, termin FROM callendar_tasks WHERE home_id = ? AND termin = CURDATE()', [req.cookies['home']], (erro, result, fields) => {
                if( erro ){
                    console.log(erro)
                }else{
                    res.send( { list:resp, callendar:result } )
                }
            } )
        })
        .catch( err => {
            console.log(err)
            res.sendStatus(500)
        } )
    } )
})

app.listen( port, () => {
    console.log( `listening ( ${port} )` )
} )

