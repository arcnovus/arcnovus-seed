/**
 * @license Parstangular v0.1.0
 * (c) 2014 Arcnovus, Inc. http://parstangular.com
 * License: MIT
 *
 * Parstangular is a simple Restangular wrapper for the Parse.com REST API.
 */

/** 
 * This is an object in which to place your Parse.com configuration settings.
 * Make sure to put your Parse App Id and Rest Api Key below.
 * You can probably leave the BASE_URL property as is, unless Parse
 * has introduced a new version of their API that you intend to use.
 */
var parseConfig = {};
parseConfig.APP_ID = 'TyfDCrcDQPRkUGnAz50DHESIOk4lvfMOEt3Xd02K';
parseConfig.API_KEY = 'CqIAUk4PMCZNSTNHVJC1hGC5HTqnybEvzKnuQC3Z';
parseConfig.BASE_URL = 'https://api.parse.com/1/';

/** The Parstangular module is the main module that houses our Parstangular goodness */
var ParseApiModule = angular.module("Parstangular", ['restangular']);

/** Throw our Parse configuration object into the mix  */
ParseApiModule.constant("PARSE_CONFIG", parseConfig);

/** A factory that returns a Parsified version of Restangular */
ParseApiModule.factory('ParseService', ['Restangular', 'PARSE_CONFIG', '$log',

    function (Restangular, parseConfig, $log) {
        /** An instance of Restangular that has been configured to work with Parse */
        var ParseApi = Restangular.withConfig(function (RestangularConfigurer) {
            // Set the base url to point to the Parse endpoint.
            RestangularConfigurer.setBaseUrl(parseConfig.BASE_URL);
            // Pass our Parse app id and api key as headers for every request
            RestangularConfigurer.setDefaultHeaders({
                'X-Parse-Application-Id': parseConfig.APP_ID,
                'X-Parse-REST-API-Key': parseConfig.API_KEY
            });
            // Explicitely turn off full responses (this is the default but someone may have overriden it in the default configuration)
            RestangularConfigurer.setFullResponse(false);

            // Map to the appropriate fields returned by Parse
            RestangularConfigurer.setRestangularFields({
                id: "objectId",
                createdAt: "createdAt",
                updatedAt: "updatedAt",
                error: "error",
                code: "code"
            });

            // Handle the case where Parse returns a collection that is an array wrapped in a "results" property  
            RestangularConfigurer.setResponseExtractor(function (response, operation, what, url) {
                // new response, same as the old response
                var newResponse = response;
                // This is a get for a list
                if (operation === "getList") {
                    // Parse always wraps the results of a query against a collection in an array called 'results' so here's where we tell Restangular about that
                    newResponse = response.results;
                }


                return newResponse;
            });

        });

        /** A helper function to reference the Rest path to your Parse objects **/
        ParseApi.Class = function (objName) {
            return this.all('classes').all(objName);
        };

        /** A helper function to reference the Parse users path **/
        ParseApi.User = ParseApi.all('users');


        /** A helper function to get the currently logged in Parse User **/
        ParseApi.validateSession = function (sessionToken) {
            var tokenHeader = {
                "X-Parse-Session-Token": sessionToken
            };

            return this.oneUrl('me', parseConfig.BASE_URL + 'users/me').get(undefined, tokenHeader);
        };

        ParseApi.CurrentUser = {};


        setCurrentUser = function (objUser) {
            ParseApi.CurrentUser = objUser;
        };


        /** A helper function Parse Login **/
        ParseApi.login = function (username, password) {
            username = username.toLowerCase();
            var credentials = {
                "username": username,
                "password": password
            };
            var loginPromise = this.oneUrl('login', parseConfig.BASE_URL + 'login').get(credentials).then(function (userObj) {
                setCurrentUser(userObj);
                return userObj;
            });
            return loginPromise;
        };


        ParseApi.signUp = function (userObj) {
            if (userObj.username) {
                userObj.username = userObj.username.toLowerCase();
            }

            if (userObj.email) {
                objUser.email = objUser.email.toLowerCase();
            }

            var signUpPromise = this.User.post(userObj, null, {
                "Content-Type": "application/json"
            }).then(function (response) {
                return ParseApi.validateSession(response.sessionToken).then(function (objUser) {
                    setCurrentUser(objUser);
                    return response;
                });
                //return response;
            });
            return signUpPromise;
        };

        ParseApi.requestPasswordReset = function (email) {
            var emailObj = {
                "email": email
            };
            return this.all('requestPasswordReset').post(emailObj);
        };

        return ParseApi;
}]);