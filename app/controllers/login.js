BaseModule.controller('ctrlLogin',
    function ($scope, $log, ParseService) {

        $scope.alerts = [];

        $scope.doLogin = function () {
            ParseService.login($scope.usr, $scope.pwd).then(function (data) {
                $scope.curUser = ParseService.CurrentUser.username;
                alrt = {};
                alrt.type = 'success';
                alrt.msg = 'Welcome ' + ParseService.CurrentUser.username + '.';
                $scope.alerts.push(alrt);
            }, function () {
                alrt = {
                    type: 'danger',
                    msg: 'Login failed.'
                }
                $scope.alerts.push(alrt);
            });
        };

        $scope.doSignUp = function () {
            var userObj = {};
            userObj.username = $scope.usr;
            userObj.password = $scope.pwd;

            ParseService.signUp(userObj).then(function () {
                    var alrt = {};
                    alrt.type = 'success';
                    alrt.msg = 'hooray!';
                    $log.debug("current: " + JSON.stringify(ParseService.CurrentUser));
                    $scope.alerts.push(alrt);
                    $scope.userList.push(ParseService.CurrentUser);
                },
                function () {
                    var alrt = {};
                    alrt.type = 'danger';
                    alrt.msg = 'boo!!';
                    $scope.alerts.push(alrt);
                });
        };
        $scope.open = function (url) {
            var webView = new steroids.views.WebView(url);
            steroids.layers.push(webView);
        };

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.isCurrent = function (user) {
            $log.debug('uuu: ' + JSON.stringify(user));
            if (user.objectId && user.objectId == ParseService.CurrentUser.objectId) {
                var style = {};
                style = {
                    "font-weight": "bold"
                };
                return style;
            }
        }

        ParseService.User.getList().then(function (userlist) {
            $scope.userList = userlist;
        });
    });