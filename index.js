const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const exphbs = require('express-handlebars')
const _handlebars = require('handlebars')
const homeRoutes = require('./routes/home.js')
const addRoutes = require('./routes/add.js')
const coursesRoutes = require('./routes/courses.js')
const cartRoutes = require('./routes/cart.js')
const ordersRoutes = require('./routes/orders.js')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

const User = require('./models/user.js')

const app = express()

const hbs = exphbs.create({
   defaultLayout: 'main',
   extname: 'hbs',
   handlebars: allowInsecurePrototypeAccess(_handlebars)
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req, res, next) => {
   try {
      const user = await User.findById('601bc58cf9d7d344fc2fdbba')

      req.user = user

      next()
   } catch (e) {
      console.log(e)
   }

})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)


const PORT = process.env.PORT || 8888

async function start() {
   try {
      const url = 'mongodb+srv://viks2332:viks2332@cluster0.tgkbk.mongodb.net/shop'

      await mongoose.connect(url, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         useFindAndModify: false
      })

      const candidate = await User.findOne()

      if (!candidate) {
         const user = new User({
            email: 'viks2332@gmail.com',
            name: 'Viks',
            cart: {items: []}
         })

         await user.save()
      } else {

      }

      app.listen(PORT, () => {
         console.log(`Server is running on post ${PORT}`)
      })
   } catch (e) {
      console.log(e)
   }
}

start()


