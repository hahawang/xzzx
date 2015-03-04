// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('xzzx', ['ionic', 'xzzx.controllers', 'xzzx.services','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  //$ionicConfigProvider.tabs.position('bottom');
  $stateProvider
	.state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })
	
  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })
   
  // Each tab has its own nav history stack:
  
   .state('tab.news', {
      url: '/news',
      views: {
        'tab-news': {
          templateUrl: 'templates/tab-news.html',
          controller: 'NewsListCtrl'
        }
      }
    })	
	
    .state('tab.news-detail', {
      url: '/news/:newsId',
      views: {
        'tab-news': {
          templateUrl: 'templates/news-detail.html',
          controller: 'NewsDetailCtrl'
        }
      }
    })
	
	
	.state('tab.expert', {
      url: '/expert',
      views: {
        'tab-expert': {
          templateUrl: 'templates/tab-expert.html',
          controller: 'ExpertCtrl'
        }
      }
    })

	.state('tab.expert-detail', {
      url: '/expert/:expertId',
      views: {
        'tab-expert': {
          templateUrl: 'templates/expert-detail.html',
          controller: 'ExpertDetailCtrl'
        }
      }
    })
	
	.state('tab.product', {
      url: '/product',
      views: {
        'tab-product': {
          templateUrl: 'templates/tab-product.html',
          controller: 'ProductCtrl'
        }
      }
    })

	.state('tab.product-detail', {
      url: '/product/:productId',
      views: {
        'tab-product': {
          templateUrl: 'templates/product-detail.html',
          controller: 'ProductDetailCtrl'
        }
      }
    })
	
  .state('tab.inspection', {
      url: '/inspection',
      views: {
        'tab-inspection': {
          templateUrl: 'templates/tab-inspection.html',
          controller: 'InspectionCtrl'
        }
      }
    })
	
	.state('tab.inspection-view', {
      url: '/inspection/:sseq',
      views: {
        'tab-inspection': {
          templateUrl: 'templates/inspection-view.html',
          controller: 'InspectionCtrl'
        }
      }
    })
	 .state('tab.inspection-add', {
      url: '/inspection_add',
      views: {
        'tab-inspection': {
          templateUrl: 'templates/inspection-add.html',
          controller: 'InspectionCtrl'
        }
      }
    })    	
	
	

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })
	.state('tab.dept-list', {
      url: '/dept-list',
      views: {
        'tab-dept-list': {
          templateUrl: 'templates/tab-dept-list.html',
          controller: 'DeptListCtrl'
        }
      }
    })
	.state('tab.contacts-search', {
      url: '/contacts-search',
      views: {
        'tab-dept-list': {
          templateUrl: 'templates/contacts-search.html',
          controller: 'SearchCtrl'
        }
      }
    })
	.state('tab.dept-detail', {
      url: '/dept/:dept',
      views: {
        'tab-dept-list': {
          templateUrl: 'templates/tab-dept-detail.html',
          controller: 'DeptDetailCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
