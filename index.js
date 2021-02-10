const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const csrf = require('csurf')
const flash = require('connect-flash')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const exphbs = require('express-handlebars')
const _handlebars = require('handlebars')
const homeRoutes = require('./routes/home.js')
const addRoutes = require('./routes/add.js')
const coursesRoutes = require('./routes/courses.js')
const cartRoutes = require('./routes/cart.js')
const ordersRoutes = require('./routes/orders.js')
const authRoutes = require('./routes/auth.js')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const varMiddleware = require('./middleware/variables.js')
const userMiddleware = require('./middleware/user.js')
const keys = require('./keys')

const app = express()


const hbs = exphbs.create({
   defaultLayout: 'main',
   extname: 'hbs',
   handlebars: allowInsecurePrototypeAccess(_handlebars)
})

const store = new MongoStore({
   collection: 'sessions',
   uri: keys.MONGODB_URI
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
   secret: keys.SESSION_SECRET,
   resave: false,
   saveUninitialized: false,
   store
}))

app.use(csrf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)


const PORT = process.env.PORT || 8888

async function start() {
   try {


      await mongoose.connect(keys.MONGODB_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         useFindAndModify: false
      })

      app.listen(PORT, () => {
         console.log(`Server is running on post ${PORT}`)
      })
   } catch (e) {
      console.log(e)
   }
}

start()


