const fs = require('fs')
const path = require('path')

const pathName = path.join(
   path.dirname(process.mainModule.filename),
   'data',
   'cart.json'
)

class Cart {
   static async add(course) {
      const cart = await Cart.fetch()

      const idx = cart.courses.findIndex(c => c.id === course.id)
      const candidate = cart.courses[idx]

      if (candidate) {
         //курс уже есть
         candidate.count++
         cart.courses[idx] = candidate
      } else {
         course.count = 1
         cart.courses.push(course)
      }

      cart.price += +course.price

      return new Promise((resolve, reject) => {
         fs.writeFile(pathName, JSON.stringify(cart), (error) => {
               if (error) {
                  reject(error)
               } else {
                  resolve()
               }
            }
         )
      })
   }

   static async fetch() {
      return new Promise((resolve, reject) => {
         fs.readFile(pathName, 'utf-8', (error, content) => {
               if (error) {
                  reject(error)
               } else {
                  resolve(JSON.parse(content))
               }
            }
         )
      })
   }

   static async remove(id) {
      const cart = await Cart.fetch()

      const idx = cart.courses.findIndex(c => c.id === id)
      const course = cart.courses[idx]

      if (course.count === 1) {
         //курс уже есть
         cart.courses = cart.courses.filter(c => c.id !== id)
      } else {
         cart.courses[idx].count--
      }

      cart.price -= +course.price

      return new Promise((resolve, reject) => {
         fs.writeFile(pathName, JSON.stringify(cart), (error) => {
               if (error) {
                  reject(error)
               } else {
                  resolve(cart)
               }
            }
         )
      })
   }
}

module.exports = Cart


