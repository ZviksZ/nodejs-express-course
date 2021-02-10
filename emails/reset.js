const keys = require('../keys')

module.exports = function (email, token) {
   return {
      to: email,
      from: keys.EMAIL_FROM,
      subject: 'Recovery password',
      html: `
         <h1>Recovery</h1>
         <p>Recovery password to account ${email}</p>
         <p><a href="${keys.BASE_URL}/auth/password/${token}">Recovery password</a></p>
         <hr>
         <a href="${keys.BASE_URL}">Market</a>
      `
   }
}
