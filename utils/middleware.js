// Check authentication to prevent non-users to see transactions 
const isAuthenticated = (req, res, next) => {
    if(req.session.currentUser){
      return next()
    } else {
      res.redirect('/sessions/new')
    }
  }
  
  module.exports = isAuthenticated