'use strict';
app.controller('appLibraryController', ['$scope', '$location', '$window', '$routeParams', '$rootScope', 'libraryService', 'authService', 'notificationService', '$route', function ($scope, $location,$window, $routeParams, $rootScope, libraryService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;

    $scope.folderId = $routeParams.fid;
    $scope.parentId = $routeParams.pid;
    $scope.chapterId =null;
    //alert($scope.chapterId);
     
     
    var qprms = $location.search();
    if (qprms.chid)
        $scope.chapterId = qprms.chid;
    
    //$location.search('id', 500);
   // console.log($location.search());
    //alert($location.search().target);
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
        bounceEnabled: true,
        showScrollbar: 'never',
        pulledDownText: '',
        pullingDownText: '',
        useNative: false,
        refreshingText: 'Updating...',
        onPullDown: function (options) {
            $scope.bind();
            //Alert.getStartupNots(null, function (arg) {
            //    options.component.release();
            //    // refreshCarts(arg);
            //});
            options.component.release();

        },
        height:'100%',
       // bindingOptions: { height: 'scroll_height', }
    };

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


            //2021-07-26
            if ($scope.chapterId) {
                var chptr = Enumerable.From($scope.chapters).Where('$.Id==' + $scope.chapterId).FirstOrDefault();
                if (chptr)
                    $scope.goChapter(chptr);
            }

        }, function (err) { General.ShowNotify(err.message, 'error'); });
    };
    ////////////////////////////////
    $scope.ds = null;
    //2021-07-26
    $scope.bind = function (callback) {
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
            callback();
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
        $scope.scroll_height = $(window).height() - 45 - 62;
        $('.library').fadeIn();

        //2021-07-26
        $scope.bind(function () { $scope.bindTree(); });
        
    }

    ///////////////////////////////////////
    //2021-07-26
    $scope.popup_folder_visible = false;
    $scope.popup_folder_title = 'Folder';
    $scope.popup_folder = {
        width: 300,
        height: 260,
        //position: 'left top',
        fullScreen: true,
        showTitle: true,
        dragEnabled: false,
        toolbarItems: [




            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {
            
        },
        onHiding: function () {
            $scope.searchStr = null;
            $location.search('chid', null);
        },
        bindingOptions: {
            visible: 'popup_folder_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            title: 'popup_folder_title',

        }
    };

    //close button
    $scope.popup_folder.toolbarItems[0].options.onClick = function (e) {

        $scope.popup_folder_visible = false;

    };
    $scope.scroll_popup_folder = {
        width: '100%',
        bounceEnabled: false,
        showScrollbar: 'never',
        pulledDownText: '',
        pullingDownText: '',
        useNative: false,
        refreshingText: 'Updating...',
        onPullDown: function (options) {
            //$scope.bind();
            //Alert.getStartupNots(null, function (arg) {
            //    options.component.release();
            //    // refreshCarts(arg);
            //});
            options.component.release();

        },
        onInitialized: function (e) {


        },
        //heigh: '100%',
        bindingOptions: { height: 'scroll_height_folder', }
    };
    $scope.scroll_height_folder = $(window).height() - 230;
    $scope.goChapter = function (ch) {
        $location.search('chid', ch.Id);
        $location.search('bid', ch.BookId);
        $scope.popup_folder_title = '';
        console.log('chapter', ch);
        $scope.currentChapter = ch;
        $scope.currentChapter.filesFiltered = Enumerable.From($scope.currentChapter.files).ToArray();
        $scope.popup_folder_visible = true;
    };
    $scope.getFolderTitle = function (f) {
        var str = "<span>" + f.TitleFormated + "</span>";
        if (f.files && f.files.length > 0)
            str += "<span class='fcnt'>(" + f.files.length + ")</span>";
        return str;
        
    };
    $scope.searchFiles = function () {
        $scope.currentChapter.filesFiltered = Enumerable.From($scope.currentChapter.files).Where(
            function (x) {
                 
                return x.SysUrl.toLowerCase().includes($scope.searchStr.toLowerCase());
            }
        ).ToArray();
    };
    $scope.searchStr = null;
    $scope.text_search = {
        placeholder: 'Search',
        valueChangeEvent: 'keyup',
        onValueChanged: function (e) {
            $scope.searchFiles();
        },
        bindingOptions: {
            value: 'searchStr'
        }
    }
    //////////////////////////////////////////
    $scope.$on('PageLoaded', function (event, prms) {
        //footerbook
        if (prms=='footer')
        $('.footer' + $scope.active).addClass('active');
        

    });
    $rootScope.$broadcast('AppLibraryLoaded', null);

         
}]);