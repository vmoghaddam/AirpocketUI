'use strict';
app.controller('appLibraryController', ['$scope', '$location', '$window', '$routeParams', '$rootScope', 'libraryService', 'authService', 'notificationService', '$route', function ($scope, $location,$window, $routeParams, $rootScope, libraryService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;

    $scope.folderId = $routeParams.fid;
    $scope.parentId = $routeParams.pid;


    $scope.firstBind = true;
    $scope.active = $route.current.type;
    $scope.typeId = null;
    $scope.title = null;
    switch ($scope.active) {
        case 'all':
            break;
        case 'book':
            $scope.typeId = 83;
            $scope.title = 'Books';
            break;
        case 'paper':
            $scope.typeId = 84;
            $scope.title = 'Papers';
            break;
        case 'video':
            $scope.typeId = 85;
            $scope.title = 'Videos';
            break;
        default:
            break;
    }
    $('.' + $scope.active).addClass('active');
     
    $scope.scroll_height = 200;
    $scope.scroll_main = {
        width: '100%',
        bounceEnabled: false,
        showScrollbar: 'never',
        pulledDownText: '',
        pullingDownText: '',
        useNative: true,
        refreshingText: 'Updating...',
        onPullDown: function (options) {
            $scope.bind();
            //Alert.getStartupNots(null, function (arg) {
            //    options.component.release();
            //    // refreshCarts(arg);
            //});
            options.component.release();

        },
        //height:200,
        bindingOptions: { height: 'scroll_height', }
    };
	
	
	
	  $scope.scroll_search_height = $(window).height()-150;
    $scope.scroll_search = {
        width: '100%',
        bounceEnabled: false,
        showScrollbar: 'never',
        pulledDownText: '',
        pullingDownText: '',
        useNative: false,
        refreshingText: 'Updating...',
        onPullDown: function (options) {
            
            options.component.release();

        },
        //height:200,
        bindingOptions: { height: 'scroll_search_height', }
    };

	 $scope.btn_search = {
        text: 'Search',
        type: 'normal',
        icon: 'search',
        width:'100%',
       
        onClick: function (e) {
             $scope.popup_search_visible = true;

        }

    };
	$scope.popup_search_visible = false;
	$scope.popup_search={
	   fullScreen: true,
        showTitle: true,
        dragEnabled: true,
		visible: false,
		 toolbarItems: [
          {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_search_visible = false;

                    }
                }, toolbar: 'bottom'
            }
        ],
        closeOnOutsideClick: false,
		onShowing: function (e) {




        },
        onShown: function (e) {
            if ($scope.srch) 
			{   
			    $scope.searchStr=$scope.srch;
				$scope.search();
			}
        },
        onHiding: function () {
 localStorage.removeItem("lib_search");
			$scope.searchStr='';
            $scope.popup_search_visible = false;

        },
        bindingOptions: {
            visible: 'popup_search_visible',

            title: 'Search',
            
        }
	}
	$scope.file_search_model={ };
	$scope.file_search_changed=function(bookid){
	  console.log($scope.file_search_model);
		// alert($scope.file_search_model['value_'+bookid]);
	};
	$scope.filter_files=function(x){
	  //x.files,x.BookId
		
		var ds=x.files;
		var val=$scope.file_search_model['value_'+x.BookId];
		if (val)
		{
			 ds=Enumerable.From(ds).Where(function(q){ return q.SysUrl.toLowerCase().includes(val.toLowerCase()); }).ToArray();
		}
		return ds;
	}
	$scope.toggle_files=function(evt,x){
	   var elem = evt.currentTarget || evt.srcElement;
		//$(elem).toggle(200);
		//$('.file_wrapper_'+x.BookId).toggle("slide", { direction: "right" }, 200);
		//console.log(x);
		if ($('.file_wrapper_'+x.BookId).hasClass('_open'))
		{
			$('.file_wrapper_'+x.BookId).fadeOut();
			$('.file_wrapper_'+x.BookId).removeClass('_open');
			$(elem).html('Show File(s)');
		}
		else
		{
			$('.file_wrapper_'+x.BookId).fadeIn();
			$('.file_wrapper_'+x.BookId).addClass('_open');
			$(elem).html('Hide File(s)');
		}
	}
	$scope.searchStr='';
	$scope.ds_search=[];
	$scope.search=function(){
	   libraryService.getSearch(  $scope.searchStr,$rootScope.employeeId).then(function (response) {
                     
				     $scope.ds_search=response;
               }, function (err) { $scope.loadingVisible = false;   });
	}
	$scope.text_search = {
        placeholder: 'Search',
        valueChangeEvent: 'keyup',
        //height:35,
        onValueChanged: function (e) {
			localStorage.setItem("lib_search", $scope.searchStr);
              $scope.search();
        },
        bindingOptions: {
            value: 'searchStr'
        }
    }
	
    $scope.loadingVisible = false;
    $scope.loadPanel = {
        message: 'Please wait...',

        showIndicator: true,
        showPane: true,
        shading: true,
        closeOnOutsideClick: false,
        shadingColor: "rgba(0,0,0,0.4)",
        // position: { of: "body" },
        onShown: function () {

        },
        onHidden: function () {

        },
        bindingOptions: {
            visible: 'loadingVisible'
        }
    };
    ///////////////////////////////////
    $scope.tree_columns = [

       { dataField: 'Title', caption: 'Folder', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, encodeHtml: false },
       // { dataField: 'FullCode', caption: 'Code', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, encodeHtml: false, width: 200, sortIndex: 0, sortOrder: "asc" },
      // { dataField: 'Items', caption: 'Items', allowResizing: true, alignment: 'center', dataType: 'string', width: 100, allowEditing: false },
       // { dataField: 'Files', caption: 'Files', allowResizing: true, alignment: 'center', dataType: 'string', width: 100, allowEditing: false },
    ];

    $scope.tree_selected = null;
    $scope.tree_instance = null;
    $scope.tree_ds = null; //[{ Id: 1, ParentId: null, Title: 'A' }, { Id: 2, ParentId: null, Title: 'B'}];
    $scope.expandedRow = null;

    $scope.tree = {
        selection: { mode: 'single' },

        filterRow: {
            visible: false,
            showOperationChooser: true,
        },
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'none' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        editing: {
            mode: "cell",
            allowAdding: false,
            allowUpdating: true,
            allowDeleting: false
        },
        dataSource: $scope.tree_ds,
        onContentReady: function (e) {
            if (!$scope.tree_instance)
                $scope.tree_instance = e.component;

        },
        onSelectionChanged: function (e) {
            //var data = e.selectedRowsData[0];

            //if (!data) {
            //    $scope.tree_selected = null;
            //    $scope.dg_book_ds = null;
            //}
            //else {
            //    $scope.tree_selected = data;
            //    $scope.dg_book_ds = null;
            //    $scope.$broadcast('getFilterQuery', null);
                
            //}


        },

        keyExpr: "Id",
        parentIdExpr: "ParentId",

        showBorders: true,
        columns: $scope.tree_columns,
        headerFilter: {
            visible: true
        },
        height: $(window).height() - 180,
       
        wordWrapEnabled: true,
        bindingOptions: {
            dataSource: 'tree_ds',
            expandedRowKeys: 'expandedRow',
            
        }
    };
    ///////////////////////////////
    $scope.folders = null;
    $scope.books = null;
    //chapter
    $scope.chapters = null;
    $scope.rootBooks = null;
    //////////////////////////////
    $scope.removeExt = function (filename) {
        return filename.split('.').slice(0, -1).join('.');
    }
    $scope.bindTree = function () {
        libraryService.getFoldersItems($rootScope.employeeId, $scope.folderId, $scope.parentId).then(function (response) {
            $scope.loadingVisible = false;
            console.log('*****************************');
            console.log('*****************************');
            console.log('*****************************');
            console.log(response);
            console.log('*****************************');
            console.log('*****************************');
            console.log('*****************************');
            $scope.folders = response.folders;
            //chapter
            $scope.chapters = response.chapters;
            $.each(response.folders, function (_i, _d) {
                _d.NotVisitedClass = '';
                _d.NotVisitedHintClass = '';
                if (_d.NotVisited > 0)
                {
                    _d.NotVisitedClass = 'folder-notvisited';
                    _d.NotVisitedHintClass = 'folder-notvisited-hint';
                }

            });
            $.each(response.files, function (_i, _d) {
                _d.VisitedClass = (_d.IsVisited ? "far fa-eye file-visited" : "far fa-eye");
                _d.VisitedClassTitle = (!_d.IsVisited ? "file-visited-title" : "");
                
            });
            $.each(response.items, function (_i, _d) {
                _d.VisitedClass = "fa " + (_d.IsVisited ? "fa-eye w3-text-blue" : "fa-eye-slash w3-text-red");
                _d.VisitedClassTitle = (!_d.IsVisited ? "file-visited-title" : "");
                //_d.IsDownloaded = true;
                _d.DownloadedClass = "fa " + (_d.IsDownloaded ? "fa-cloud-download-alt w3-text-blue" : "fa-cloud w3-text-red");
               // _d.filesRoot = Enumerable.From(response.files).Where('$.BookId==' + _d.BookId).OrderBy('$.Id').ToArray();
                _d.files = Enumerable.From(response.files).Where('!$.ChapterId && $.BookId==' + _d.BookId).OrderBy('$.Title').ToArray();
                _d.chapters = Enumerable.From($scope.chapters).Where('$.BookId==' + _d.BookId).OrderBy(function (x) {
                    return x.Fullcode.toString();
                }).ToArray();
                $.each(_d.chapters, function (_q, _ch) {
                    var cnt = _ch.TitleFormated.lastIndexOf("&nbsp;");
                    var pref = cnt == -1 ? '' : _ch.TitleFormated.substring(0, cnt + 6);
                    var chfiles = Enumerable.From(response.files).Where('$.ChapterId==' + _ch.Id + ' && $.BookId==' + _d.BookId).OrderBy('$.Title').ToArray();
                    $.each(chfiles, function (_w, _bk) {
                        _bk._title = pref +$scope.removeExt(  _bk.SysUrl);
                    });
                    _ch.files = chfiles;
                     
                });
                console.log(_d.chapters);

            });
           // $scope.rootBooks = Enumerable.From(response.items).Where('!$.ChapterId').ToArray();
            $scope.books = response.items;
            //$.each(response, function (_i, _d) {
            //    if (_d.ParentId == -1)
            //        _d.ParentId = null;
           
            // });
            //$scope.tree_ds = response;
          
            //$scope.expandedRow = [];
            //$scope.expandedRow.push(response[0].Id);


        }, function (err) { General.ShowNotify(err.message, 'error'); });
    };
    ////////////////////////////////
    $scope.ds = null;
    $scope.bind = function () {
        if ($scope.firstBind)
            $scope.loadingVisible = true;
        libraryService.getPersonLibrary($rootScope.employeeId, $scope.typeId).then(function (response) {
            $scope.loadingVisible = false;
            $scope.firstBind = false;
            $.each(response, function (_i, _d) {
               // _d.ImageUrl = _d.ImageUrl ? $rootScope.clientsFilesUrl + _d.ImageUrl : '../../content/images/imguser.png';
                _d.DateExposure = moment(_d.DateExposure).format('MMMM Do YYYY, h:mm:ss a');
                _d.VisitedClass = "fa " + (_d.IsVisited ? "fa-eye w3-text-blue" : "fa-eye-slash w3-text-red");
                //_d.IsDownloaded = true;
                _d.DownloadedClass = "fa " + (_d.IsDownloaded ? "fa-cloud-download-alt w3-text-blue" : "fa-cloud w3-text-red");
                _d.class = (_d.IsDownloaded && _d.IsVisited) ? "card w3-text-dark-gray bg-white" : "card text-white bg-danger";
                _d.class = "card w3-text-dark-gray bg-white";
                _d.titleClass = (_d.IsDownloaded && _d.IsVisited) ? "" : "w3-text-red";
                _d.ImageUrl= _d.ImageUrl ? $rootScope.clientsFilesUrl + _d.ImageUrl : '../../content/images/image.png';
            });
            $scope.ds = response;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    $scope.itemClick = function (bookId,employeeId) {
        //alert(bookId+' '+employeeId);
        $location.path('/applibrary/item/'+bookId ); 
    };

    $scope.goFolder = function (id, parentId, code) {
        
        $location.path('/applibrary/'+id+'/'+id);
    };
    $scope.goBook = function () {

    };
    $scope.goFile = function (fileUrl, sysUrl,id) {
        // $window.location.href = $rootScope.webBase + "pdfjs/web/viewer.html?file=../../upload/clientsfiles/pdfjs.pdf";
        $location.path('/pdfviewer/' + fileUrl + '/' +$scope.removeExt( sysUrl)+'/'+id);
    };

    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = 'Library';// > ' + $scope.title;
        $scope.scroll_height = $(window).height() - 45 - 62-50;
		$scope.scroll_search_height=$(window).height()-150;
        $('.library').fadeIn();
          $scope.bind();
        $scope.bindTree();
    }
	/* window.onresize = function (event) {
        
        setTimeout(function () {
             console.log('x');
            var _height = window.outerHeight;
            $scope.scroll_height = $(window).height() - 45 - 62;
        }, 200);
    };*/
	window.addEventListener("orientationchange", function (event) {
        //   alert(chromeNavbarHeight);
        //var _height = screen.height-100;

        //no-rotate
        setTimeout(function () {
           var _height = window.outerHeight;
           // $scope.scroll_height = $(window).height() - 45 - 100;
        },1000);

    }, false);
    //////////////////////////////////////////
    $scope.$on('PageLoaded', function (event, prms) {
        //footerbook
        if (prms=='footer')
        $('.footer' + $scope.active).addClass('active');
        

    });
	$scope.$on('$viewContentLoaded', function () {
        $scope.srch = localStorage.getItem("lib_search");
		if ($scope.srch){
			{   $scope.popup_search_visible = true;
			    $scope.searchStr=$scope.srch;
			}
		}
    });
    $rootScope.$broadcast('AppLibraryLoaded', null);

         
}]);