const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home.js')
const addRoutes = require('./routes/add.js')
const coursesRoutes = require('./routes/courses.js')

const app = express()

const hbs = exphbs.create({
   defaultLayout: 'main',
   extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

app.use('/', homeRoutes)
app.use('/add',addRoutes)
app.use('/courses',coursesRoutes)



const PORT = process.env.PORT || 8888

app.listen(PORT, () => {
   console.log(`Server is running on post ${PORT}`)
})
