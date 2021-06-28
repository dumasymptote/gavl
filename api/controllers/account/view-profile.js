module.exports = {
  friendlyName: 'View Profile for Logged in User',
  description: 'Displays the User Profile page.',
  exits: {
    success: {
      viewTemplatePath: 'pages/account/profile'
    },
    redirect: {
      description: 'The user is not already logged in.',
      responseType: 'redirect'
    }
  },
  fn: async function(){
    if(!this.req.me){
      throw {redirect : '/'};
    }
    return{};
  }
};
