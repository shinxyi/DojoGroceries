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
    .state('admin_dashboard',{
      url: '/admin_dashboard',
      views:{

        '': {
          templateUrl: 'assets/partials/admin_dash.html',
          controller: 'itemController',
          controllerAs: 'itemCtrl'
        },
        'home@admin_dashboard': {
          templateUrl: 'assets/partials/home.html'
          // controller: 'budgetController',
          // controllerAs: 'budgetCtrl'
        },
        'users@admin_dashboard': {
          templateUrl: 'assets/partials/users.html'
        },
        'suggestions@admin_dashboard': {
          templateUrl: 'assets/partials/suggestions.html',
          controller: 'commentController',
          controllerAs: 'commentCtrl'
        },
        'database@admin_dashboard': {
          templateUrl: '/assets/partials/database.html',
          controller: 'categoryController',
          controllerAs: 'categoryCtrl'
        }
      }
    })
});
