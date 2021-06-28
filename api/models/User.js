module.exports = {
  attributes: {
    username: {
      type:'string',
      required: true,
      unique: true
    },
    first_name: {
      type:'string',
      required: true
    },
    last_name: {
      type:'string',
      required: true
    },
    email: {
      type: 'string',
      required: true,
      isEmail: true,
      maxLength: 200,
      example: 'birds@law.com'
    },
    emailStatus:{
      type: 'string',
      isIn: ['unconfirmed', 'change-requested','confirmed'],
      defaultsTo: 'uncconfirmed',
      description: 'Confirmation status of user email address.'
    },
    phone1: {
      type: 'string',
      required: false
    },
    phone2: {
      type: 'string',
      required: false
    },
    phone3: {
      type: 'string',
      required: false
    },
    emailChangeCandidate: {
      type: 'string',
      isEmail: true,
      description: 'A still-unconfirmed email address that this user wants to change to (if relevant).'
    },
    emailProofToken: {
      type: 'string',
      description: 'A pseudorandom, probabilistically-unique token for use in our account verification emails.'
    },
    emailProofTokenExpiresAt: {
      type: 'number',
      description: 'A JS timestamp (epoch ms) representing the moment when this users `emailProofToken` will expire (or 0 if the user currently has no such token).',
      example: 1502844074211
    },
    tosAcceptedByIp: {
      type: 'string',
      description: 'The IP (ipv4) address of the request that accepted the terms of service.',
      extendedDescription: 'Useful for certain types of businesses and regulatory requirements (KYC, etc.)',
      moreInfoUrl: 'https://en.wikipedia.org/wiki/Know_your_customer'
    },
    lastSeenAt: {
      type: 'number',
      description: 'A JS timestamp (epoch ms) representing the moment at which this user most recently interacted with the backend while logged in (or 0 if they have not interacted with the backend at all yet).',
      example: 1502844074211
    },
    //Relationship fields
    userLogin: {
      collection: 'login',
      via: 'user'
    },
    userRole: {
      model: 'userrole'
    }
  },
};
