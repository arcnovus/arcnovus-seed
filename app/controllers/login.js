BaseModule.controller('ctrlLogin',
    function ($scope, ParseService) {

        $scope.doLogin = function () {
            alert("login pressed");
            $scope.curUser = ParseService.login($scope.usr, $scope.pwd).$object.username;
        }
        $scope.open = function (url) {

            var webView = new steroids.views.WebView(url);
            steroids.layers.push(webView);
        };
    });