# angular-locale-bundles

## Installation

Download [angular-locale-bundles.js](https://github.com/AresProjectManagement/angular-locale-bundles/blob/master/src/angular-locale-bundles.js) or install with bower.

```bash
$ bower install angular-locale-bundles --save
```

Load the `angular-locale-bundles` modules into your app and configure...

```javascript
angular.module('app', ['angular-locale-bundles'])
    .config(['localeBundleFactoryProvider', function (localeBundleFactoryProvider) {
        // URL pattern to fetch locale bundles.  Placeholders: {{bundle}} and {{locale}}
        localeBundleFactoryProvider.url('/i18n/{{bundle}}.json');

        // Add the locale to the 'Accept-Language' header.  Default is true.
        localeBundleFactoryProvider.useAcceptLanguageHeader(true);
    }]);
```

## Usage

### `locale-bundle` directive

Use the `locale-bundle` directive to apply a locale bundle's translations to the scope of the directive.

```html
<div class="hero-unit" locale-bundle="hero-unit">
    <h1>{{ bundle.greeting }}</h1>

    <p>{{ bundle.installedLibraries }}</p>
    <ul>
        <li ng-repeat="thing in awesomeThings">{{thing}}</li>
    </ul>

    <h3>{{ bundle.enjoy.coding }}</h3>
</div>

<footer locale-bundle="footer">
    <p><small>{{ bundle.copyright }}</small></p>
</footer>
```

### `localeBundleFactory` service

Use `localeBundleFactory` to manually fetch locale bundles and apply them to scopes.

```javascript
angular.module('angularLocaleBundlesApp')
    .controller('MainCtrl', ['$scope', 'localeBundleFactory', function ($scope, localeBundleFactory) {

        var bundle = localeBundleFactory('awesome-things', '-en_US');

        $scope.awesomeThings = bundle.translations;
    }])
```

### `LocaleBundle` API

#### `translations`
A [promise](http://docs.angularjs.org/api/ng.$q) that resolves the bundle's translations.

#### `addToScope(scope)`
Adds the bundle's translations to the given scope

#### `get(translation)`
Returns a [promise](http://docs.angularjs.org/api/ng.$q) that resolves a translation value.

## Contributing

### Prerequisites

The project requires [Bower](http://bower.io), [Grunt](http://gruntjs.com), and [PhantomJS](http://phantomjs.org).  Once you have installed them, you can build, test, and run the project.

### Build & Test

To build and run tests, run either...

```bash
$ make install
```

or

```bash
$ npm install
$ bower install
$ grunt build
```

### Demo & Develop

To run a live demo or do some hackery, run...

```bash
$ grunt server
```

## License

MIT