const {Router} = require('express')
const Course = require('../models/course.js')
const router = Router()
const auth = require('../middleware/auth')

function mapCartItems(cart) {
   return cart.items.map(c => ({
      ...c.courseId._doc,
      id: c.courseId._id,
      count: c.count
   }))
}

function computePrice(courses) {
   return courses.reduce((total, course) => {
      return total += course.price * course.count
   }, 0)
}

router.get('/', auth, async (req, res) => {
   const user = await req.user
      .populate('cart.items.courseId')
      .execPopulate() //для получения объекта курса в корзине

   const courses = mapCartItems(user.cart)

   res.render('cart', {
      title: 'Cart page',
      isCart: true,
      courses,
      price: computePrice(courses)
   })
})

router.post('/add', auth, async (req, res) => {
   const course = await Course.findById(req.body.id)
   await req.user.addToCart(course)

   res.redirect('/cart')
})

router.delete('/remove/:id', auth, async (req, res) => {
   await req.user.removeFromCart(req.params.id)
   const user = await req.user
      .populate('cart.items.courseId')
      .execPopulate()

   const courses = mapCartItems(user.cart)

   res.status(200).json({
      courses, price: computePrice(courses)
   })
})


module.exports = router
