'use strict';

angular.module('angularLocaleBundlesApp')
    .controller('MainCtrl', ['$scope', 'localeBundleFactory', function ($scope, localeBundleFactory) {

        var bundle = localeBundleFactory('awesome-things', '-en_US');

        $scope.awesomeThings = bundle.translations;
    }]);
