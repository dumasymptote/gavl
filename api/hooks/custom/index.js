//custom hook for auth
/*
 * @description :: Custom hook
* mostly taken straight from the template from the new app sails project. Removed stripe/password info since the user model is different
*/

module.exports = function defineCustomHook(sails){
 return {
   /*
     runs on sails app - load/lift
   */
   initialize: async function() {
     sails.log.info('Initializing project hook... (`api/hooks/custom/`)');
   },

   routes: {
     /*
       runs before every matching route/
       @param {Ref} req
       @param {Ref} res
       @param {Function} next
     */
     before: {
       '/*': {
         skipAssets: true,
         fn: async function(req, res, next){
           var url = require('url');

           //attach guaranteed local if get request
           if(req.method === 'GET'){
             // The  `_environment` local lets us do a little workaround to make Vue.js
             // run in "production mode" without unnecessarily involving complexities
             // with webpack et al.)
             if (res.locals._environment !== undefined) {
               throw new Error('Cannot attach Sails environment as the view local `_environment`, because this view local already exists!  (Is it being attached somewhere else?)');
             }
             res.locals._environment = sails.config.environment;
             // The `me` local is set explicitly to `undefined` here just to avoid having to
             // do `typeof me !== 'undefined'` checks in our views/layouts/partials.
             // > Note that, depending on the request, this may or may not be set to the
             // > logged-in user record further below.
             if (res.locals.me !== undefined) {
               throw new Error('Cannot attach view local `me`, because this view local already exists!  (Is it being attached somewhere else?)');
             }
             res.locals.me = undefined;
           }
           // Next, if we're running in our actual "production" or "staging" Sails
           // environment, check if this is a GET request via some other host,
           // for example a subdomain like `webhooks.` or `click.`.  If so, we'll
           // automatically go ahead and redirect to the corresponding path under
           // our base URL, which is environment-specific.
           // > Note that we DO NOT redirect virtual socket requests and we DO NOT
           // > redirect non-GET requests (because it can confuse some 3rd party
           // > platforms that send webhook requests.)  We also DO NOT redirect
           // > requests in other environments to allow for flexibility during
           // > development (e.g. so you can preview an app running locally on
           // > your laptop using a local IP address or a tool like ngrok, in
           // > case you want to run it on a real, physical mobile/IoT device)
           var configuredBaseHostname;
           try {
             configuredBaseHostname = url.parse(sails.config.custom.baseUrl).host;
           } catch (unusedErr) { /*…*/}
           if ((sails.config.environment === 'staging' || sails.config.environment === 'production') && !req.isSocket && req.method === 'GET' && req.hostname !== configuredBaseHostname) {
             sails.log.info('Redirecting GET request from `'+req.hostname+'` to configured expected host (`'+configuredBaseHostname+'`)...');
             return res.redirect(sails.config.custom.baseUrl+req.url);
           }
           // No session? Proceed as usual.
           // (e.g. request for a static asset)
           if (!req.session) { return next(); }
           // Not logged in? Proceed as usual.
           if (!req.session.userId) { return next(); }
           // Otherwise, look up the logged-in user.
           var loggedInUser = await User.findOne({
             id: req.session.userId
           });
           // If the logged-in user has gone missing, log a warning,
           // wipe the user id from the requesting user agent's session,
           // and then send the "unauthorized" response.
          if (!loggedInUser) {
            sails.log.warn('Somehow, the user record for the logged-in user (`'+req.session.userId+'`) has gone missing....');
            delete req.session.userId;
            return res.unauthorized();
          }
          // Add additional information for convenience when building top-level navigation.
           // (i.e. whether to display "Dashboard", "My Account", etc.)
          if (!loggedInUser.password || loggedInUser.emailStatus === 'unconfirmed') {
             loggedInUser.dontDisplayAccountLinkInNav = true;
          }
           // Expose the user record as an extra property on the request object (`req.me`).
           // > Note that we make sure `req.me` doesn't already exist first.
          if (req.me !== undefined) {
            throw new Error('Cannot attach logged-in user as `req.me` because this property already exists!  (Is it being attached somewhere else?)');
          }
          req.me = loggedInUser;
           // If our "lastSeenAt" attribute for this user is at least a few seconds old, then set it
           // to the current timestamp.
           // (Note: As an optimization, this is run behind the scenes to avoid adding needless latency.)
          var MS_TO_BUFFER = 60*1000;
          var now = Date.now();
          if (loggedInUser.lastSeenAt < now - MS_TO_BUFFER) {
            User.updateOne({id: loggedInUser.id})
            .set({ lastSeenAt: now })
            .exec((err)=>{
              if (err) {
                sails.log.error('Background task failed: Could not update user (`'+loggedInUser.id+'`) with a new `lastSeenAt` timestamp.  Error details: '+err.stack);
                return;
              }
              sails.log.verbose('Updated the `lastSeenAt` timestamp for user `'+loggedInUser.id+'`.');
            });
           }
           // If this is a GET request, then also expose an extra view local (`<%= me %>`).
           // > Note that we make sure a local named `me` doesn't already exist first.
           // > Also note that we strip off any properties that correspond with protected attributes.
           if (req.method === 'GET') {
             if (res.locals.me !== undefined) {
               throw new Error('Cannot attach logged-in user as the view local `me`, because this view local already exists!  (Is it being attached somewhere else?)');
             }
            res.locals.me = loggedInUser;

             // Include information on the locals as to whether email verification is required.
             res.locals.isEmailVerificationRequired = sails.config.custom.verifyEmailAddresses;
           }
           // Prevent the browser from caching logged-in users' pages.
           // (including w/ the Chrome back button)
           // > • https://mixmax.com/blog/chrome-back-button-cache-no-store
           // > • https://madhatted.com/2013/6/16/you-do-not-understand-browser-history
           res.setHeader('Cache-Control', 'no-cache, no-store');
           return next();
         }
       }
     }
   }
 };
};
