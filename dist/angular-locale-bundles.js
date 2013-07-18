/**! 
 * @license angular-locale-bundles v0.1.1
 * Copyright (c) 2013 Ares Project Management LLC <code@prismondemand.com>. https://github.com/AresProjectManagement/angular-locale-bundles
 * License: MIT
 */
(function () {
    'use strict';

    var LocaleBundle = function ($http, $parse, apiUrl, options) {
        var _self = this,
            _options = angular.extend({
                responseTransformer: function (response) {
                    return response.data;
                },
                httpOpts: undefined
            }, options);

        this.translations = $http.get(apiUrl, _options.httpOpts)
            .then(_options.responseTransformer, function () {
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
        var _bundleUrl,
            _bundleLocaleUrl,
            _useAcceptLang = true,
            _httpCache = true,
            _responseTransformer = function (response) {
                return response.data;
            };

        this.bundleUrl = function (url) {
            _bundleUrl = url;
        };

        this.bundleLocaleUrl = function (url) {
            _bundleLocaleUrl = url;
        };

        this.responseTransformer = function (transformer) {
            _responseTransformer = transformer;
        };

        this.useAcceptLanguageHeader = function (enable) {
            _useAcceptLang = enable;
        };

        this.enableHttpCache = function (cache) {
            _httpCache = cache;
        };

        function _createUrl(bundle, locale) {
            if (locale) {
                return _bundleLocaleUrl.replace('{{bundle}}', bundle || '').replace('{{locale}}', locale || '');
            }
            return _bundleUrl.replace('{{bundle}}', bundle || '');
        }

        this.$get = function ($http, $parse) {
            return function (bundle, locale) {
                var url = _createUrl(bundle, locale);
                var httpOpts = {
                    headers: locale && _useAcceptLang ? {'Accept-Language': locale} : undefined,
                    cache: _httpCache
                };
                return new LocaleBundle($http, $parse, url, {
                    httpOpts: httpOpts,
                    responseTransformer: _responseTransformer
                });
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




