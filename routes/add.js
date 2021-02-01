const {Router} = require('express')
const golfCourseOutlined = require('../models/course.js')
const router = Router()


router.get('/', (req, res) => {
   res.render('add', {
      title: 'Add page',
      isAdd: true
   })
})

router.post('/', (req, res) => {
  console.log(req.body)

   res.redirect('/courses')
})

module.exports = router

