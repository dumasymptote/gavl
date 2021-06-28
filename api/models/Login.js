module.exports = {
  attributes: {
    //A reference column to connect to a user
    user:{
      model:'user',
      unique: true
    },
    username:{
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      required: true,
      description: 'Securely hashed representation of the user\'s login password.',
      protect: true,
      example: '2$28a8eabna301089103-13948134nad'
    },
    passwordResetToken:{
      type: 'string',
      description: 'A unique token used to verify the users identity when requesting a password reset. Expires after 1 use, or after a set amount of time has elapsed.'
    },
    passwordResetTokenExpiresAt: {
      type: 'number',
      description: 'A JS timestamp (epoch ms) representing the moment when this users `passwordResetToken` will expire (or 0 if the user currently has no such token).',
      example: 1502844074211
    },
  }
};
