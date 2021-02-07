const {Router} = require('express')
const User = require('../models/user.js')
const router = Router()
const bcrypt = require('bcryptjs')


router.get('/login', async (req, res) => {
   res.render('auth/login', {
      title: 'Auth page',
      isLogin: true,
      registerError: req.flash('registerError'),
      loginError: req.flash('loginError'),
   })
})

router.get('/logout', async (req, res) => {
   req.session.destroy(() => {
      res.redirect('/auth/login#login')
   })
})

router.post('/login', async (req, res) => {
   try {
      const {email, password} = req.body

      const candidate = await User.findOne({email})

      if (candidate) {
         const areSame = await bcrypt.compare(password, candidate.password)
         if (areSame) {
            req.session.user = candidate
            req.session.isAuthenticated = true

            req.session.save(err => {
               if (err) throw err;

               res.redirect('/')
            })
         } else {
            req.flash('loginError', 'Wrong password')
            res.redirect('/auth/login#login')
         }
      } else {
         req.flash('loginError', 'User no found')
         res.redirect('/auth/login#login')
      }

   } catch (e) {
      console.log(e)
   }


})

router.post('/register', async (req, res) => {
   try {
      const {email, name, password, confirm} = req.body

      const candidate = await User.findOne({email})

      if (candidate) {
         req.flash('registerError', 'User with this email is no empty')
         res.redirect('/auth/login#register')
      } else {
         const hashPassword = await bcrypt.hash(password, 10)
         const user = new User({
            email, name, password: hashPassword, cart: {items: []}
         })

         await user.save()

         res.redirect('/auth/login#login')
      }

   } catch (e) {
      console.log(e)
   }
})

module.exports = router
