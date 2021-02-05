const {Router} = require('express')
const Course = require('../models/course.js')
const router = Router()

router.get('/', async (req, res) => {
   // await Course.find().select('price title') select - для получения нужных полей
   // await Course.find().populate('userId', 'email name') populate - для получения связанного поля из БД
   const courses = await Course.find().populate('userId', 'email name')

   res.render('courses', {
      title: 'Courses page',
      isCourses: true,
      courses
   })
})

router.get('/:id/edit', async (req, res) => {
   if (!req.query.allow) {
      return res.redirect('/')
   }

   const course = await Course.findById(req.params.id)

   res.render('course-edit', {
      title: `Edit ${course.title}`,
      course
   })

})

router.post('/edit', async (req, res) => {
   const {id} = req.body
   delete req.body.id
   await Course.findOneAndUpdate(id, req.body)

   res.redirect('/courses')
})

router.post('/remove', async (req, res) => {
   try {
      await Course.deleteOne({_id: req.body.id})

      res.redirect('/courses')
   } catch (e) {
      console.log(e)
   }
})

router.get('/:id', async (req, res) => {
   const course = await Course.findById(req.params.id)
   res.render('course', {
      title: `Course ${course.title}`,
      layout: 'empty',
      course
   })
})

module.exports = router

