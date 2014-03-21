BaseModule.controller('ctrlLogin',
    function ($scope, $log, ParseService) {

        $scope.doLogin = function () {
            alert("login pressed");
            ParseService.login($scope.usr, $scope.pwd).then(function (response) {
                $log.debug(response);
            }); //.$object.username;
        }
        $scope.open = function (url) {

            var webView = new steroids.views.WebView(url);
            steroids.layers.push(webView);
        };
    });