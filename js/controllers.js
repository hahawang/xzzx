angular.module('xzzx.controllers', ['ngCordova'])

.controller('LoginCtrl', function($scope,$ionicLoading,$http, $state,localstorage,$cordovaToast) { 
	$scope.user = localstorage.getObject("user");
 
  $scope.login = function(user) {
	$scope.showLoading();
	data = {
		'email' : user.username,
		'password' : user.password
	};
	//$http.post('http://60.216.52.244/weixin/index.php?r=json/login',data,{ 'Content-Type': 'application/x-www-form-urlencoded' }).success(function(user) {
	
	$http({
        method  : 'POST',
        url     : 'http://60.216.52.244/weixin/index.php?r=json/login',       
		data    : "email="+user.mobile+"&password"+user.password,  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' },  // set the headers so angular passing info as form data (not request payload)
		//timeout : 3000,
    }).success(function(result) {
		//$scope.showLoading();
		console.log(result);
		$ionicLoading.hide();
		if (result.id !== null && result.id !== undefined && result.id !== '') { 
			console.log('Login', result.id);
			localstorage.setObject("user",result);	
			console.log('localstorage', localstorage.getObject("user"));	
			//$cordovaToast.show('登录成功！', 'short', 'center').then(function(success){},function (error) {});
			$state.go('tab.news');
		}else{
			//$cordovaToast.show('登录失败！', 'short', 'center').then(function(success){},function (error) {});
			console.log('Login', "error");
		}
    }).error(function(){
		alert("error");
		$ionicLoading.hide();
	});       
  };  
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: '登录中...'
    });	 
  };
})

.controller('NavCtrl', function($scope, $ionicSideMenuDelegate) {
  $scope.showMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.showRightMenu = function () {
    $ionicSideMenuDelegate.toggleRight();
  };
})

.controller('InspectionCtrl', function($scope,localstorage,$http,$q,$cordovaGeolocation,$cordovaCamera,$ionicPopup,$ionicLoading,$cordovaFileTransfer,$ionicHistory,Chats) {

    var user = localstorage.getObject("user");
	var url = 'http://60.216.52.244/unicom_app/json/InspectionList3?callback=JSON_CALLBACK&mobile='+user.mobile;
	var page = 1;
	$scope.inspectionList = [];
	
	if(localstorage.getObject('inspections').length>0){
		$scope.inspectionList = localstorage.getObject('inspections');
	}
	
    $scope.doRefresh = function() {	
		page = 1;
	    $http.jsonp(url+'&page='+page,{timeout:5000})
		.success(function(items){
			$scope.inspectionList = items;
			localstorage.setObject('inspections',items);
			$scope.$broadcast('scroll.refreshComplete');
		})
		.error(function(){
			alert('出错了');
		});
	  };
	
	$scope.loadMore = function() {
	  page++;
	  $http.jsonp(url+'&page='+page,{timeout:5000}).success(function(items) {
			$scope.inspectionList = $scope.inspectionList.concat(items);
			$scope.$broadcast('scroll.infiniteScrollComplete');
		})
		.error(function(){
			alert('出错了');
		});  
	};	


  $scope.images_list =[];// ['img/3187704111250202347.jpg','img/IMG_20141210_083620.jpg','img/ionic.png'];  

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };  
  
  $scope.getLocation = function(){
	var posOptions = {timeout: 10000, enableHighAccuracy: false};
	$cordovaGeolocation.getCurrentPosition(posOptions)
    .then(function (position) {
      var lat  = position.coords.latitude
      var long = position.coords.longitude
	  $scope.insp.gps = lat + "," +long;
	  console.log(lat + "," +long);
    }, function(err) {
      // error
    });
  };
  
  $scope.appendByCamera = function() { 
	
	var options = {
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
    };
	$cordovaCamera.getPicture(options).then(function(imageURI) { 
      $scope.images_list.push(imageURI);  
	  console.log($scope.images_list);
    }, function(err) {
      // error
    });	
  };
  
  $scope.deletePic = function(uri) { 
	var confirmPopup = $ionicPopup.confirm({ 
     title: '提示',
     template: '确认删除照片吗?'
   });
   confirmPopup.then(function(res) {
     if(res) {
       $scope.images_list.splice($scope.images_list.indexOf(uri), 1);	
		console.log(uri);
     } else {
       console.log('You are not sure');
     }
   });	
  };  
   
   $scope.insp = {
        mobile:'',
        note:'',
		gpsadd:'',
    };
   
  $scope.uploadPic = function() {
		var options = {
			fileKey : 'img',
			fileName : 'test.jpg',
			mimeType : "image/jpeg",
		};
		
			$ionicLoading.show({template: '提交中...'});
			
			var promises = [];
			//提交表单
			var p1 = $http({
				method  : 'POST',
				url     : 'http://60.216.52.244/unicom_app/json/inspectionPub',       
				data    : "usermob="+user.mobile+"&note="+$scope.insp.note+"&gpsadd="+$scope.insp.gps,
				headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
				timeout : 5000,
			});
			promises.push(p1);
			if($scope.images_list.length>0){
				//上传照片			
				var url = 'http://60.216.52.244/unicom_app/json/uploadPic';
				angular.forEach($scope.images_list , function(image) {
					var promise = $cordovaFileTransfer.upload(url,image, options);
					promises.push(promise);
				});
			}
			$q.all(promises).then(function(result) {	
					console.log(result);
					$ionicLoading.hide();
					$ionicHistory.goBack();				
				// Success!
			  }, function(err) {
				console.log(err); 
				$ionicLoading.hide();
				// Error
			  }, function (progress) {
				// constant progress updates
			});	
		
			/*
			for (var i=0;i<$scope.images_list.length;i++){
				$cordovaFileTransfer.upload("http://60.216.52.244/unicom_app/json/uploadPic", $scope.images_list[i], options)
					  .then(function(result) {
						
							$ionicLoading.hide();
							$ionicHistory.goBack();
						
						// Success!
					  }, function(err) {
						// Error
					  }, function (progress) {
						// constant progress updates
					});
			}			
			*/
		
	} 
})

//资讯列表
.controller('NewsListCtrl', function($scope,$http,$ionicPopover,$ionicScrollDelegate,$ionicLoading,News,localstorage) {
	$scope.newsList = [];
	var page = 1;
	$scope.type = 1;
	$scope.options = {
        value: '1'
    };
	var url = 'http://60.216.52.244/weixin/index.php?r=json/newsList2&callback=JSON_CALLBACK';
	$scope.typeList = [
		{ text: "搜狐科技", value: "1" },
		{ text: "凤凰通信", value: "2" },
		{ text: "信产要闻", value: "3" },
		{ text: "信产运营", value: "4" }
	];
	$scope.title = $scope.typeList[0].text;
	
	if(localstorage.getObject('news').length>0){
		$scope.newsList = localstorage.getObject('news');
	}
	
	$scope.typeChange = function(item) {
		$ionicLoading.show({template: '加载中...'});
		page = 1;
		console.log("Selected text:", item.text, "value:", item.value);
		$scope.title = item.text;
		$scope.type = item.value;
		$ionicScrollDelegate.scrollTop(true);		
		
	    $http.jsonp(url+'&page='+page+'&catalog='+$scope.type,{timeout:5000}).success(function(items) {
			$scope.newsList = items;
			$scope.popover.hide();
			$ionicLoading.hide();
		})
		.error(function(){
			alert('出错了');
			$ionicLoading.hide();
		});		
	  };	
	
	$ionicPopover.fromTemplateUrl('templates/popover.html', {
		scope: $scope,
	  }).then(function(popover) {
		$scope.popover = popover;
	  });
	
	$scope.doRefresh = function() {	
		$page = 1;
	    $http.jsonp(url+'&page='+page+'&catalog='+$scope.type,{timeout:5000})
		.success(function(items){
			$scope.newsList = items;
			localstorage.setObject('news',items);
			$scope.$broadcast('scroll.refreshComplete');
		})
		.error(function(){
			alert('出错了');
		});
	  };
	
	$scope.loadMore = function() {
	  page++;
	  console.log('page:'+page);
	  $http.jsonp(url+'&page='+page+'&catalog='+$scope.type,{timeout:5000}).success(function(items) {
			$scope.newsList = $scope.newsList.concat(items);
			$scope.$broadcast('scroll.infiniteScrollComplete');
		})
		.error(function(){
			alert('出错了');
		});  
	};
})
//资讯详情
.controller('NewsDetailCtrl', function($scope, $stateParams, $ionicLoading,$ionicHistory,News) {
	$scope.title = '资讯详情';
	$ionicLoading.show({template: '努力加载中...'});
	News.getDetail($stateParams.newsId).then(function(data){
		$scope.news = data;	
		$ionicLoading.hide();
	});
	$scope.swipToPrevious= function() { 
		$ionicHistory.goBack();
	}
})
//专家门诊
.controller('ExpertCtrl', function($scope,$http,$ionicLoading,localstorage) {	
	
	$scope.data = [];
	if(localstorage.getObject('experts').length>0){
		$scope.data = localstorage.getObject('experts');
	}
	$scope.doRefresh = function() {	
		$ionicLoading.show({template: '努力加载中...'});
		$http.jsonp('http://61.156.3.49/support/index.php?r=json/expertList&callback=JSON_CALLBACK')
		.success(function(items) {
		  $scope.data = items;
		  localstorage.setObject('experts',items);
		  $scope.$broadcast('scroll.refreshComplete');
		  $ionicLoading.hide();
		})
		.error(function(){
			alert('ERROR');
			$ionicLoading.hide();
		});
	  };	
})

//专家详情
.controller('ExpertDetailCtrl', function($scope,localstorage, $stateParams, $ionicLoading,$ionicHistory) {
	$scope.title = '专家详情';
	var data = localstorage.getObject('experts');
	//$scope.expert = data[$stateParams.expertId];
	
	for (var i = 0; i < data.length; i++) {
        if (data[i].id === $stateParams.expertId) {
          $scope.expert = data[i];
		  break;
        }
      }
	
	//$scope.expert = getExpert($stateParams.expertId);
	
	$scope.swipToPrevious= function() { 
		$ionicHistory.goBack();
	}
})
//产品手册
.controller('ProductCtrl', function($scope,$http,$ionicLoading,localstorage) {	
	
	$scope.data = [];
	if(localstorage.getObject('products').length>0){
		$scope.data = localstorage.getObject('products');
	}
	$scope.doRefresh = function() {	
		$ionicLoading.show({template: '努力加载中...'});
		$http.jsonp('http://61.156.3.49/support/index.php?r=json/productList&callback=JSON_CALLBACK')
		.success(function(items) {
		  $scope.data = items;
		  localstorage.setObject('products',items);
		  $scope.$broadcast('scroll.refreshComplete');
		  $ionicLoading.hide();
		})
		.error(function(){
			alert('ERROR');
			$ionicLoading.hide();
		});
	  };	
})

//产品手册
.controller('ProductDetailCtrl', function($scope,localstorage, $stateParams, $ionicLoading,$ionicHistory) {
	$scope.title = '产品详情';
	var data = localstorage.getObject('products');
	//$scope.expert = data[$stateParams.expertId];
	
	for (var i = 0; i < data.length; i++) {
        if (data[i].id === $stateParams.productId) {
          $scope.product = data[i];
		  break;
        }
      }
	
	//$scope.expert = getExpert($stateParams.expertId);
	
	$scope.swipToPrevious= function() { 
		$ionicHistory.goBack();
	}
})

.controller('AccountCtrl', function($scope,$state,localstorage,$ionicPopup,$cordovaImagePicker,$cordovaCamera,$cordovaFileTransfer,				$ionicActionSheet) {
  $scope.user = localstorage.getObject("user");
   
  $scope.logout = function(){
	var confirmPopup = $ionicPopup.confirm({ 
     title: '提示',
     template: '确认注销吗?'
   });
   confirmPopup.then(function(res) {
     if(res) {
       $state.go('login');
     } else {
       console.log('You are not sure');
     }
   });	
  }
  /*
  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation.getCurrentPosition(posOptions)
    .then(function (position) {
      var lat  = position.coords.latitude
      var long = position.coords.longitude
	  
	  alert(lat+','+long);
    }, function(err) {
      // error
    });
   */
   
  $scope.images_list = []; 
  
  $scope.appendByCamera = function() { 
	
	var options = {
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
    };
	$cordovaCamera.getPicture(options).then(function(imageURI) {
      $scope.images_list.push(imageURI);  
    }, function(err) {
      // error
    });	
  };
  
  //image picker  
   $scope.pickImage = function () {  
		console.log('pickImage');
		var options = {
		   maximumImagesCount: 10,
		   width: 800,
		   height: 800,
		   quality: 80
		  };		  

		  $cordovaImagePicker.getPictures(options)
			.then(function (results) { 
				 console.log('results'+results);			
				 $scope.images_list.push(results[0]);  
				   
			}, function (error) {
				console.log(error);
				// error getting photos  
			});    
	};
  
  $scope.addAttachment = function() {  
    //nonePopover();  
    $ionicActionSheet.show({  
     buttons: [  
       { text: '相机' },  
       { text: '图库' }  
     ],  
     cancelText: '关闭',  
     cancel: function() {  
       return true;  
     },  
     buttonClicked: function(index) {         
       switch (index){             
        case 0:
			$scope.appendByCamera();  
            break;  
        case 1:    
			$scope.pickImage();  
			
            break;  
        default:  
            break;  
       }      
       return true;  
     }  
   });  
  };
  
  $scope.uploadPic = function() {  
	var options = {
	   fileKey : 'img',
	   fileName : 'test.jpg',
	   mimeType : "image/jpeg",
	  };
	$cordovaFileTransfer.upload("http://60.216.52.244/unicom_app/json/uploadPic", $scope.images_list[0], options)
		  .then(function(result) {
			// Success!
		  }, function(err) {
			// Error
		  }, function (progress) {
			// constant progress updates
		  });
	  }  
    
})
.controller('DeptListCtrl', function ($scope,$ionicLoading,Dept) {
    $scope.deptList = [];
	Dept.getDeptList(1).then(function(items){
		$scope.deptList = $scope.deptList.concat(items);
	});
	
	$scope.getDeptList = function(type) {
	  $ionicLoading.show({template: '加载中...'});
	  Dept.getDeptList(type).then(function(items){
			$scope.type = type;
			$scope.deptList = items;
			$ionicLoading.hide();
		});   
	};
})

.controller('SearchCtrl', function($scope, $stateParams, $ionicLoading,$ionicScrollDelegate,Dept) {
	$scope.contactsList = [];	
	
	$scope.search = function(key) {
	  $ionicLoading.show({template: '加载中...'});
	  Dept.search(key).then(function(items){
			$scope.contactsList = items;
			$ionicScrollDelegate.scrollTop(true);
			$ionicLoading.hide();
		});   
	};
})

.controller('DeptDetailCtrl', function ($scope,$stateParams, $http) {
  $http.jsonp('http://60.216.52.244/unicom_app/json/staffList2?callback=JSON_CALLBACK&dept='+$stateParams.dept)
  .success(function(data, status, headers, config) {
    $scope.staffList = data;
  })
   .error(
        function(data){
            alert("error:"+data);
        }
    );
});
