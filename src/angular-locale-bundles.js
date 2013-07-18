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

        this.addToScope = function (scope, prefix) {
            prefix = prefix || 'bundle';
            _self.translations.then(function (translations) {
                angular.forEach(translations, function (value, key) {
                    $parse(prefix + '.' + key).assign(scope, value);
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

        function _createUrl(bundle, locale) {
            if (locale) {
                return _bundleLocaleUrl.replace('{{bundle}}', bundle || '').replace('{{locale}}', locale || '');
            }
            return _bundleUrl.replace('{{bundle}}', bundle || '');
        }

    };

    var localeBundleDirective = function (localeBundleFactory) {

        function parseLocaleBundleAttr(attr) {
            if (!attr || attr.trim().length === 0) {
                return null;
            }

            var details = {
                    bundle: attr,
                    prefix: 'bundle'
                },
                parts = [];

            if (attr.indexOf(' as ') > -1) {
                parts = attr.split(/\s+as\s+/);
                details.bundle = parts[0];
                details.prefix = parts[1];
            }

            return details;
        }

        return {
            link: function (scope, element, attrs) {
                var bundleDetails = parseLocaleBundleAttr(attrs.localeBundle);
                if (!bundleDetails) {
                    return;
                }

                localeBundleFactory(bundleDetails.bundle).addToScope(scope, bundleDetails.prefix);
                scope.$watch(bundleDetails.prefix + '.locale', function (locale) {
                    if (!locale || locale.trim().length === 0) {
                        localeBundleFactory(bundleDetails.bundle).addToScope(scope, bundleDetails.prefix);
                    } else {
                        localeBundleFactory(bundleDetails.bundle, locale).addToScope(scope, bundleDetails.prefix);
                    }
                });
            }
        };
    };

    angular.module('angular-locale-bundles', [])
        .provider('localeBundleFactory', localeBundleFactoryProvider)
        .directive('localeBundle', ['localeBundleFactory', localeBundleDirective]);


}());




