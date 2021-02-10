const keys = require('../keys')

module.exports = function (email) {
   return {
      to: email,
      from: keys.EMAIL_FROM,
      subject: 'Register is succesful',
      html: `
         <h1>Hello</h1>
         <p>Account created ${email}</p>
      `
   }
}
