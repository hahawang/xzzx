angular.module('xzzx.services', [])

.factory('News', ['$http', function($http) {
  var data = [];
  return {
    getList: function(type,page) {
	  var url = 'http://60.216.52.244/weixin/index.php?r=json/newsList2&callback=JSON_CALLBACK&page='+page+'&catalog='+type;
	  return $http.jsonp(url,{timeout:3000}).then(function(response){
				console.log(response);
				data = response.data;
				return data;
			});
    },
	getDetail: function(newsId) {
	  return $http.jsonp('http://60.216.52.244/weixin/index.php?r=json/newsDetail2&callback=JSON_CALLBACK&id='+newsId).then(function(response){
				console.log(response);
				data = response.data;
				return data;
			});
    }
  }
}])


.factory('Dept', ['$http', function($http) {
	var data = [];
	var url = 'http://60.216.52.244/unicom_app/json/deptList?callback=JSON_CALLBACK&type=';
	return {
    getDeptList: function(type) {
	  return $http.jsonp(url+type).then(function(response){
				console.log(response);
				data = response.data;
				return data;
			});
    },	
	search: function(key) {
	  return $http.jsonp('http://60.216.52.244/unicom_app/json/searchStaff?callback=JSON_CALLBACK&key='+key).then(function(response){
				console.log(response);
				data = response.data;
				return data;
			});
		}    
	}
}])

.factory('localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);

