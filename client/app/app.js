var app = angular.module('app', [ 'ui.router', 'ngCookies']);

app.config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('hello',{
      url: '/',
      views:{

        '': {
          templateUrl: 'assets/partials/landing.html',
          controller: 'userController',
          controllerAs: 'userCtrl'
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
          controller: 'noteController',
          controllerAs: 'noteCtrl'

        },
        'sideNotes@dashboard': {
    			templateUrl: 'assets/partials/sideNotes.html'
    		},
        'workSpace@dashboard': {
          templateUrl: '/assets/partials/workspace.html',
          controller: 'workspaceController',
          controllerAs: 'wsCtrl'
        }
      }
    })
});
