var app = angular.module('app', [ 'ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('hello',{
      url: '/',
      views:{

        '': {
          templateUrl: 'assets/partials/landing.html'
        },
        'login@hello': {
    			templateUrl: 'assets/partials/login.html'
    		},
        'register@hello': {
          templateUrl: '/assets/partials/register.html',
        }
      }
    })
    .state('about',{
      url: '/about',
      templateUrl: 'assets/partials/about.html'
    })
    .state('dashboard',{
      url: '/dashboard',
      views:{

        '': {
          templateUrl: 'assets/partials/dash.html',
          controller: 'itemController',
          controllerAs: 'itemCtrl'
        },
        'suggestions@dashboard': {
    			templateUrl: 'assets/partials/suggestions.html',
          controller: 'commentController',
          controllerAs: 'commentCtrl'
    		},
        'database@dashboard': {
          templateUrl: '/assets/partials/database.html',
          controller: 'categoryController',
          controllerAs: 'categoryCtrl'
        }
      }
    })
});
