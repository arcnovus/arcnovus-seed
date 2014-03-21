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

/** The Parstangular module is the main module that houses our Parstangular goodness **/
var ParseApiModule = angular.module("Parstangular", ['restangular']);

/** Throw our Parse configuration object into the mix  **/
ParseApiModule.constant("PARSE_CONFIG", parseConfig);

/** Configure the RestangularProvider **/
ParseApiModule.config(function (RestangularProvider) {

    // Now let's configure the response extractor for each request
    RestangularProvider.setResponseExtractor(function (response, operation, what, url) {
        // This is a get for a list
        var newResponse;
        if (operation === "getList") {
            // Parse always wraps the results in an array called 'results' so here's where we tell Restangular about that
            newResponse = response.results;
        }
        return newResponse;
    });

});

/** A factory that returns a Parsified version of Restangular **/
ParseApiModule.factory('ParseService', ['Restangular', 'PARSE_CONFIG',

    function (Restangular, parseConfig) {
        /** An instance of Restangular that has been configured to work with Parse **/
        var ParseApi = Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(parseConfig.BASE_URL);
            RestangularConfigurer.setDefaultHeaders({
                'X-Parse-Application-Id': parseConfig.APP_ID,
                'X-Parse-REST-API-Key': parseConfig.API_KEY
            });
            RestangularConfigurer.setRestangularFields({
                id: "objectId",
                createdAt: "createdAt",
                updatedAt: "updatedAt"
            });

        });

        /** A helper function to reference the Rest path to your Parse objects **/
        ParseApi.Class = function (objName) {
            return this.all('classes').all(objName);
        };

        /** A helper function to reference the Parse users path **/
        ParseApi.User = function () {
            return this.all('users');
        };

        /** A helper function to get the currently logged in Parse User **/
        ParseApi.getCurrentUser = function () {
            return this.all('users').one('me').get();
        };

        /** A helper function Parse Login **/
        ParseApi.login = function (username, password) {
            var credentials = {
                "username": username,
                "password": password
            };
            return this.one('login').get(credentials);
        };

        ParseApi.signUp = function (userObj) {
            return this.User.post(userObj);
        };

        ParseApi.requestPasswordReset = function (email) {
            var emailObj = {
                "email": email
            };
            return this.one('requestPasswordReset').post(emailObj);
        };

        return ParseApi;
    }]);