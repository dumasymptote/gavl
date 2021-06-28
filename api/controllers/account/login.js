module.exports = {
  friendlyName: 'Login',
  description: 'Log user into application using the username password combo.',
  extendedDescription:
    `This action attempts to look up the user record in the database with the
    specified email address.  Then, if such a user exists, it uses
    bcrypt to compare the hashed password from the database with the provided
    password attempt.`,

  inputs: {
    username: {
      description: "Username to try the login with.",
      type: "string",
      required: true
    },
    password: {
      description:"The unencrypted password to try.",
      type: 'string',
      required: true
    },
    rememberme: {
      description: 'Option to extend users session lifetime.',
      type: 'boolean'
    },
  },

  exits: {
    success: {
      description: 'The requesting user has been successfully logged in.',
    },
    badCombo: {
      description: 'The provided email and password combo do not match an entry in the database.',
      responseType: 'unauthorized'
    },
  },

  fn: async function ({username, password, rememberme}){
    //username look up. set to lowercase first to avoid case sensitivity
    var userRecord = await Login.findOne({
      username: username.toLowerCase(),
    });
    //if no user record then kick out via bad combo exit
    if(!userRecord){
      throw 'badCombo';
    }
    //If the password doesnt match then also exit through 'badCombo
    await sails.helpers.passwords.checkPassword(password, userRecord.password)
      .intercept('incorrect','badCombo');

    //if remember me was set then keep session alive for longer time.
    if(rememberme){
      this.req.session.cookie.maxAge = sails.config.custom.remeberMeCookieMaxAge;
    }
    //Modify the active session instance.
    this.req.session.userId = userRecord.user;
     // In case there was an existing session (e.g. if we allow users to go to the login page
    // when they're already logged in), broadcast a message that we can display in other open tabs.
    //if(sails.hooks.sockets){
    //  await sails.helpers.broadcastSessionChange(this.req);
    //}
  }
};
