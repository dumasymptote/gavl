/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

//const Login = require("../api/models/Login");
//const UserRole = require("../api/models/UserRole");

module.exports.bootstrap = async function() {

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
   if (await User.count() > 0) {
     return;
   }
  for (let identity in sails.models) {
    await sails.models[identity].destroy({});
  }
   //create userrole
  await UserRole.createEach([
    { roleName: "admin", isAdmin: true},
    { roleName: "paralegal", isAdmin: false},
  ]);


  // create temp user for testing
   await User.createEach([
     { username: 'mguthriejr', first_name: 'Mark', last_name: 'Guthrie', email: 'mguthriejr@gmail.com', emailStatus: 'confirmed',  },
     { username: 'admin', first_name: 'admin', last_name: 'test', email: 'admin@admin.com', emailStatus: 'confirmed',},
   ]);
   await Login.createEach([
    { username: 'mguthriejr', password: await sails.helpers.passwords.hashPassword('abc123')}
  ]);

};
