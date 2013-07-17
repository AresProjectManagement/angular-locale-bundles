(function () {
    'use strict';

    var LocaleBundle = function ($http, $parse, apiUrl, $httpOpts) {
        var _self = this,
            _httpOpts = angular.extend({
                cache: true
            }, $httpOpts);

        this.translations = $http.get(apiUrl, _httpOpts)
            .then(function (response) {
                return response.data.body;
            }, function () {
                return {};
            });

        this.addToScope = function (scope) {
            _self.translations.then(function (translations) {
                angular.forEach(translations, function (value, key) {
                    $parse('bundle.' + key).assign(scope, value);
                });
            });
        };

        this.get = function (key) {
            return _self.translations.then(function (translations) {
                return translations[key] || key;
            }, function () {
                return key;
            });
        };

    };

    var localeBundleFactoryProvider = function () {
        var _url, _useAcceptLang = true;

        this.url = function (url) {
            _url = url;
        };

        this.useAcceptLanguageHeader = function (enable) {
            _useAcceptLang = enable;
        };

        this.$get = function ($http, $parse) {
            return function (bundle, locale) {
                var url = _url.replace('{{bundle}}', bundle || '').replace('{{locale}}', locale || '');
                var opts = locale && _useAcceptLang ? {
                    headers: {'Accept-Language': locale}
                } : {};
                return new LocaleBundle($http, $parse, url, opts);
            };
        };
        this.$get.$inject = ['$http', '$parse'];

    };

    var localeBundleDirective = function (localeBundleFactory) {
        return {
            link: function (scope, element, attrs) {
                if (!attrs.localeBundle) {
                    return;
                }
                localeBundleFactory(attrs.localeBundle).addToScope(scope);
            }
        };
    };

    angular.module('angular-locale-bundles', [])
        .provider('localeBundleFactory', localeBundleFactoryProvider)
        .directive('localeBundle', ['localeBundleFactory', localeBundleDirective]);


}());




