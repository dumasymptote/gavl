/**
 * cloud.setup.js
 *
 * Configuration for this Sails app's generated browser SDK ("Cloud").
 *
 * Above all, the purpose of this file is to provide endpoint definitions,
 * each of which corresponds with one particular route+action on the server.
 *
 * > This file was automatically generated.
 * > (To regenerate, run `sails run rebuild-cloud-sdk`)
 */

Cloud.setup({

  /* eslint-disable */
  methods: {"login":{"verb":"POST","url":"/account/login","args":["username","password","rememberme"]},"sendPasswordRecoveryEmail":{"verb":"POST","url":"/api/v1/account/send-password-recovery-email","args":["emailAddress"]}}
  /* eslint-enable */

});
