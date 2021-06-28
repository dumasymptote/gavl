module.exports = {
  friendlyName: 'View Login',
  description: 'Displays the login page.',
  exits: {
    success: {
      viewTemplatePath: 'pages/account/login'
    },
    redirect: {
      description: 'The user is already logged in.',
      responseType: 'redirect'
    }
  },
  fn: async function(){
    if(this.req.me){
      throw {redirect : '/'};
    }
    return{};
  }
};
