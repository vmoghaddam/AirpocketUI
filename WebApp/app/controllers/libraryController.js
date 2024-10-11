'use strict';
app.controller('libraryController', ['$scope', '$location', '$routeParams', '$rootScope', 'libraryService', 'authService', 'notificationService', '$route', '$q', '$http', function ($scope, $location, $routeParams, $rootScope, libraryService, authService, notificationService, $route, $q, $http) {
    $scope.prms = $routeParams.prms;
    $scope.IsEditable = $rootScope.IsLibraryEditable();
    $scope.IsEditableDoc = $rootScope.IsDocEditable();
    // console.log($location.search());
    //////////////////////////////////
    $scope.dsUrl = null;
    $scope.filterVisible = false;
    $scope.dg_selected = null;
    // $scope.IsDocument = false;
    //  if ($routeParams.tmp)
    $scope.IsDocument = $route.current.isDocument;
    if ($scope.IsDocument)
        $scope._type = 86;
    $scope.IsNotDocument = !$route.current.isDocument;

    $scope._type = $routeParams.type;
     
    $scope._publisher = $routeParams.publisher;
    $scope._author = $routeParams.author;

    $scope._filterConsts = {
        key: 'library',
        values: [
            { id: 'TypeId', value: $scope._type ? Number($scope._type) : -1 },
        ],

    };

    $scope.$on('FilterLoaded', function (event, prms) {
        $scope.$broadcast('initFilters', $scope._filterConsts);
    });



    ////////////////////////////////

    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,

        bindingOptions: {},
        onClick: function (e) {

            $scope.$broadcast('getFilterQuery', null);

        }

    };
    $scope.btn_filter = {
        text: '',
        type: 'default',
        icon: 'filter',
        width: 40,
        onClick: function (e) {
            if ($scope.filterVisible) {
                $scope.filterVisible = false;
                $('.col-grid').removeClass('col-lg-7').addClass('col-lg-10');
                $('.book-side').removeClass('col-lg-12').addClass('col-lg-8');
                // $('.col-row-sum').removeClass().addClass();
                $('.filter').hide();
            }
            else {
                $scope.filterVisible = true;
                $('.col-grid').removeClass('col-lg-10').addClass('col-lg-7');
                $('.book-side').removeClass('col-lg-8').addClass('col-lg-12');
                //  $('.col-row-sum').removeClass().addClass('');
                $('.filter').show();
            }
        }

    };
    $scope.btn_delete = {
        text: 'Delete',
        type: 'danger',
        icon: 'clear',
        width: 120,

        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_book_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }

            General.Confirm(Config.Text_DeleteConfirm, function (res) {
                if (res) {

                    var dto = { Id: $scope.dg_selected.Id, };
                    $scope.loadingVisible = true;
                    libraryService.delete(dto).then(function (response) {
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');
                        if (!$scope.IsDocument) {
                            $scope.tree_selected.Items = $scope.tree_selected.Items - 1;
                            $scope.tree_instance.refresh();
                        }
                      

                        $scope.doRefresh = true;
                        $scope.bind();



                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                }
            });
        }
    };
    $scope.btn_new = {
        text: 'New',
        type: 'default',
        icon: 'plus',
        width: 120,
        onClick: function (e) {
            
            if (!$scope.IsDocument && !$scope.tree_selected) {
                General.ShowNotify('Please select a folder.', 'error');
                return;
            }
            var data = { Id: null, FolderId: $scope.tree_selected? $scope.tree_selected.Id:null };
            if ($scope.IsDocument) {
                $rootScope.$broadcast('InitAddDocument', data);

            }
            else
                $rootScope.$broadcast('InitAddLibrary', data);


        }

    };
    $scope.IsEditFolder = false;
    $scope.btn_new_folder = {
        text: '',
        type: 'default',
        icon: 'plus',

        onClick: function (e) {

            $scope.folderId = null;
            if ($scope.tree_selected)
                $scope.folderId = $scope.tree_selected.Id;

          

            $scope.IsEditFolder = false;
            $scope.popup_folder_visible = true;

        }

    };
    $scope.btn_edit_folder = {
        text: '',
        type: 'default',
        icon: 'edit',

        onClick: function (e) {
             

            if (!$scope.tree_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            $scope.folder = $scope.tree_selected.Title;
            $scope.folderId = null;
            if ($scope.tree_selected.ParentId)
                $scope.folderId = $scope.tree_selected.ParentId;
            $scope.IsEditFolder = true;
            $scope.popup_folder_visible = true;
        }

    };
    $scope.btn_delete_folder = {
        text: '',
        type: 'danger',
        icon: 'clear',

        onClick: function (e) {

            if (!$scope.tree_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            $scope.loadingVisible = true;
            var dto = {
                Id: $scope.tree_selected.Id,
            };
            libraryService.deleteFolder(dto).then(function (response) {
                //jook
                $scope.loadingVisible = false;


                General.ShowNotify(Config.Text_SavedOk, 'success');
                $scope.tree_ds = Enumerable.From($scope.tree_ds).Where('$.Id!=' + $scope.tree_selected.Id).OrderBy('$.Fullcode').ToArray();
                $scope.tree_instance.refresh();
                $scope.tree_selected = null;
                $scope.folderId = null;
              




            }, function (err) { $scope.loadingVisible = false; $scope.popup_folder_visible = false; General.ShowNotify(err.message, 'error'); });


        }

    };
    $scope.btn_edit = {
        text: 'Edit',
        type: 'default',
        icon: 'edit',
        width: 120,

        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_book_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = $scope.dg_selected;
            if ($scope.IsDocument) {
                $rootScope.$broadcast('InitAddDocument', data);

            }
            else
                $rootScope.$broadcast('InitAddLibrary', data);
        }

    };
    $scope.btn_view = {
        text: 'View',
        type: 'default',
       // icon: 'edit',
        width: 120,

        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_book_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = $scope.dg_selected;
            if ($scope.IsDocument) {
                $rootScope.$broadcast('InitAddDocument', data);

            }
            else
                $rootScope.$broadcast('InitAddLibrary', data);
        }

    };
    $scope.btn_expose = {
        text: 'Expose',
        type: 'default',
        icon: 'ion ion-ios-cloud',
        width: 120,

        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_book_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }

            $scope.popup_expose_visible = true;

        }

    };

    $scope.btn_move = {
        text: 'Move',
        type: 'default',
        icon: 'ion ion-ios-folder',
        width: 120,

        onClick: function (e) {
            $scope.dg_selecteds = $rootScope.getSelectedRows($scope.dg_book_instance);
            if (!$scope.dg_selecteds || $scope.dg_selecteds.length == 0) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }

           
            $scope.popup_move_visible = true;

        }

    };


    $scope.btn_employees = {
        text: 'Employees',
        type: 'default',
        icon: 'group',
        width: 200,
        onClick: function (e) {

            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_book_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            //$scope.courseEmployee.Id = $scope.dg_selected.Id;
            $scope.popup_employees_visible = true;
        }

    };
    //////////////////////////////////
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
    //////////////////////////////////
    //dg_book_selected
    $scope.txt_Abstract = {
        hoverStateEnabled: false,
        height: 120,
        rtlEnabled:true,
        readOnly: true,
        bindingOptions: {
            value: 'dg_book_selected.Abstract',

        }
    };
    $scope.txt_Keywords = {
        hoverStateEnabled: false,
        height: 50,
        readOnly: true,
        bindingOptions: {
            value: 'dg_book_selected.Keywords',

        }
    };
    $scope.txt_Authors = {
        hoverStateEnabled: false,
        height: 70,
        readOnly: true,
        bindingOptions: {
            value: 'authors',

        }
    };
    ///////////////////////////////////
    $scope.itemCaption = 'Details';
    $scope.IsDetailsVisible = false;
    $scope.img_url = 'content/images/image.png';
    $scope.authors = '';
    $scope.publisher = '';
    $scope.No = '';
    $scope.Sender = '';
    $scope.PublisherCaption = 'Publisher';
    $scope.isbn = '';
    $scope.bookid = '';
    $scope.itemType = -1;
    $scope.dg_book_columns = [
        {
            dataField: "IsExposed", caption: '',
            width: 55,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                if (options.value == 1)
                    $("<div>")
                        .append("<img src='content/images/" + "eye" + ".png' />")
                        .appendTo(container);


            },
            fixed: true, fixedPosition: 'left',
        },
        //{
        //    dataField: "TypeId", caption: '',
        //    width: 55,
        //    allowFiltering: false,
        //    allowSorting: false,
        //    cellTemplate: function (container, options) {
        //        if (options.value == 83)
        //            $("<div>")
        //                .append("<img src='content/images/" + "book2" + ".png' />")
        //                .appendTo(container);
        //        if (options.value == 84)
        //            $("<div>")
        //                .append("<img src='content/images/" + "paper" + ".png' />")
        //                .appendTo(container);
        //        if (options.value == 85)
        //            $("<div>")
        //                .append("<img src='content/images/" + "movie" + ".png' />")
        //                .appendTo(container);


        //    },
        //    fixed: true, fixedPosition: 'left',
        //},
         { dataField: 'FileCount', caption: 'Files', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 60, fixed: true, fixedPosition: 'left', },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 500, fixed: true, fixedPosition: 'left', sortIndex: 1, sortOrder: "asc" },
        
        { dataField: 'Edition', caption: 'Revision', allowResizing: true, dataType: 'string', allowEditing: false, width: 200 },
        {dataField: 'Issue', caption: 'Issue', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 200 },
       { dataField: 'Category', caption: 'Category', allowResizing: true, dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'Publisher', caption: 'Publisher', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300 },
        { dataField: 'DateEffective', caption: 'Effective', allowResizing: true, dataType: 'string', allowEditing: false, width: 200, alignment: 'center' },
        { dataField: 'DateRelease', caption: 'Publication Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 200 },
        { dataField: 'DateExposure', caption: 'Exposure Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 200 },



    ];
    $scope.dg_book_height = 100;
    $scope.dg_book_selected = null;
    $scope.dg_book_instance = null;
    $scope.dg_book_ds = null;
    $scope.dg_book = {
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'none' },

        noDataText: '',
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'multiple' },

        columnAutoWidth: false,


        columns: $scope.dg_book_columns,
        onContentReady: function (e) {
            if (!$scope.dg_book_instance)
                $scope.dg_book_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {

                $scope.dg_book_selected = null;

                $scope.itemCaption = 'Details';
                $scope.img_url = 'content/images/image.png';
                $scope.authors = '';
                $scope.publisher = '';
                $scope.PublisherCaption = 'Publisher';
                $scope.isbn = '';
                $scope.IsDetailsVisible = false;
                $scope.itemType = -1;
                $scope.bookFiles = null;

            }
            else {
                $scope.dg_book_selected = data;
                $scope.itemCaption = data.Title;
                $scope.img_url = data.ImageUrl ? $rootScope.clientsFilesUrl + data.ImageUrl : 'content/images/image.png';

                $scope.authors = data.Authors ? data.Authors.split(",").join("<br/>") : '';
                $scope.publisher = data.Publisher;
                $scope.isbn = data.ISBN;
                $scope.bookid = data.Id;
                $scope.IsDetailsVisible = true;
                $scope.PublisherCaption = 'Publisher';
                $scope.itemType = data.TypeId;
                if (data.TypeId == 84) {
                    $scope.PublisherCaption = 'Published In';
                    $scope.publisher = data.Journal;
                }
                //zool
                libraryService.getBookFiles(data.Id).then(function (response) {
                    $scope.bookFiles = response;

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                ///////////////////////////////////

            }


        },
        height: $(window).height() - 175,
        bindingOptions: {
            dataSource: 'dg_book_ds', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };
    ////////////////////////////////////////////////
    /////////////////////////////
    $scope.dg_doc_columns = [
        {
            dataField: "IsExposed", caption: '',
            width: 55,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                if (options.value == 1)
                    $("<div>")
                        .append("<img src='content/images/" + "eye" + ".png' />")
                        .appendTo(container);


            },
            fixed: true, fixedPosition: 'left',
        },

        { dataField: 'No', caption: 'No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left' },
        { dataField: 'Category', caption: 'Category', allowResizing: true, dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 400, fixed: true, fixedPosition: 'left', sortIndex: 1, sortOrder: "asc" },

        { dataField: 'Sender', caption: 'Sender', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300 },
        { dataField: 'Edition', caption: 'Edition', allowResizing: true, dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'DateEffective', caption: 'Effective', allowResizing: true, dataType: 'string', allowEditing: false, width: 200, alignment: 'center' },
        { dataField: 'DateRelease', caption: 'Publication Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 200 },
        { dataField: 'DateExposure', caption: 'Exposure Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 200 },
        {
            dataField: "Id", caption: '',
            width: 130,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {

                $("<div>")
                    .append("<a  href='downloadhandler.ashx?t=book&id=" + options.value + "' class='w3-button w3-block w3-blue' style=' margin:0 auto 0px auto;text-decoration:none'>Download</a>")
                    .appendTo(container);


            },
            fixed: true, fixedPosition: 'right',
        },


    ];
    $scope.dg_doc_height = 100;
    $scope.dg_doc_selected = null;
    $scope.dg_doc_instance = null;
    $scope.dg_doc_ds = null;
    $scope.dg_doc = {
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'none' },

        noDataText: '',
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_doc_columns,
        onContentReady: function (e) {
            if (!$scope.dg_book_instance)
                $scope.dg_book_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {

                $scope.dg_book_selected = null;

                $scope.itemCaption = 'Details';
                $scope.img_url = 'content/images/image.png';
                $scope.authors = '';
                $scope.publisher = '';
                $scope.PublisherCaption = 'Publisher';
                $scope.isbn = '';
                $scope.IsDetailsVisible = false;
                $scope.No = '';
                $scope.Sender = '';
                $scope.itemType = -1;

            }
            else {
                $scope.dg_book_selected = data;
                $scope.itemCaption = data.Title;
                $scope.img_url = data.ImageUrl ? $rootScope.clientsFilesUrl + data.ImageUrl : 'content/images/image.png';

                $scope.authors = data.Authors ? data.Authors.split(",").join("<br/>") : '';

                $scope.publisher = data.Publisher;
                $scope.isbn = data.ISBN;
                $scope.bookid = data.Id;
                $scope.IsDetailsVisible = true;
                $scope.PublisherCaption = 'Publisher';
                $scope.itemType = data.TypeId;
                $scope.No = data.No;
                $scope.Sender = data.Sender;

                if (data.TypeId == 84) {
                    $scope.PublisherCaption = 'Published In';
                    $scope.publisher = data.Journal;
                }

            }


        },
        height: $(window).height() - 175,
        bindingOptions: {
            dataSource: 'dg_book_ds', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };
    //$scope.dg_employees_height = $(window).height() - 200;
    /////////////////////////////////////////////////
    $scope.dg_file_columns = [
      //{ dataField: "Remark", caption: "Remark", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: true },
      
        { dataField: "SysUrl", caption: "File(s)", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, },
        //8-11
        {
            dataField: "Id", caption: '',
            width: 100,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'renameTemplate',
            name: 'rename',
            
            //visible:false,

        },
        
      //{ dataField: "FileType", caption: "File Type", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, width: 150 },
      {
          dataField: "Id", caption: '',
          width: 60,
          allowFiltering: false,
          allowSorting: false,
          cellTemplate: function (container, options) {

              $("<div>")
                  .append("<a  href='downloadhandler.ashx?t=bookfile&id=" + options.value + "' class='w3-button w3-block w3-blue' style=' margin:0 auto 0px auto;text-decoration:none;padding:8px !important;border-radius:50%;width:40px'> <i class='icon ion-md-cloud-download ion-20'></i></a>")
                  .appendTo(container);


          },
          fixed: true, fixedPosition: 'right',
      }

    ];
    $scope.dg_file_selected = null;
    $scope.dg_file_instance = null;
    $scope.dg_file = {
        editing: {
            allowUpdating: false,
            allowDeleting: false,
        },
        showColumnHeaders: true,
        showRowLines: true,
        showColumnLines: false,
        sorting: { mode: 'multiple' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        filterRow: { visible: false, showOperationChooser: true, },
        columnAutoWidth: false,
        columns: $scope.dg_file_columns,
        onContentReady: function (e) {
            if (!$scope.dg_file_instance)
                $scope.dg_file_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_file_selected = null;
            }
            else { $scope.dg_file_selected = data; console.log('book file',data.Id); }


        },
        height: $(window).height() - 220,
        bindingOptions: {

            dataSource: 'bookFiles',
             
        },
        // dataSource:ds

    };
    /////////////////////////////////////////////////
    $scope.dg_employees_columns = [
        //{
        //    dataField: "IsDownloaded", caption: '',
        //    width: 55,
        //    allowFiltering: false,
        //    allowSorting: false,
        //    cellTemplate: function (container, options) {
        //        var fn = options.value == 0 ? 'notdownloaded' : 'downloaded';

        //        $("<div>")
        //            .append("<img src='content/images/" + fn + ".png' />")
        //            .appendTo(container);
        //    },
        //    fixed: true, fixedPosition: 'left', sortIndex: 1, sortOrder: "asc"
        //},
        {
            dataField: "IsVisited", caption: '',
            width: 55,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                var fn = options.value == 0 ? 'notvisited' : 'visited';

                $("<div>")
                    .append("<img src='content/images/" + fn + ".png' />")
                    .appendTo(container);
            },
            fixed: true, fixedPosition: 'left',  sortIndex: 0, sortOrder: "desc"
        },
        { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: true, fixedPosition: 'left',  width:200 },
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,  fixed: true, fixedPosition: 'left', sortIndex: 1, sortOrder: "asc" },
       
        { dataField: 'Mobile', caption: 'Mobile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        
        { dataField: 'PID', caption: 'Personnel Id', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        //{ dataField: 'DateJoinCompany', caption: 'Join Company', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
        //{ dataField: 'CaoCardNumber', caption: 'CAO No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
       // { dataField: 'NDTNumber', caption: 'NDT No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },


        { dataField: 'DateVisit', caption: 'Visit Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
       // { dataField: 'DateDownload', caption: 'Download Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },




    ];
    $scope.dg_employees_height = 100;
    $scope.dg_employees_selected = null;
    $scope.dg_employees_instance = null;
    $scope.dg_employees_ds = null;
    $scope.dg_employees = {
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'none' },

        noDataText: '',
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'multiple' },

        columnAutoWidth: false,
        height: '100%',

        columns: $scope.dg_employees_columns,
        onContentReady: function (e) {
            if (!$scope.dg_employees_instance)
                $scope.dg_employees_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_employees_selected = null;
            }
            else
                $scope.dg_employees_selected = data;


        },
        summary: {
            totalItems: [{
                column: "PID",
                summaryType: "count"
            }]
        },
        bindingOptions: {
            dataSource: 'applicableEmployees', //'dg_employees_ds',
            height: 'dg_employees_height'
        }
    };
    ///////////////////////////////////////

    ////////////////////////////////////
    $scope.selectedEmployees = null;
    $scope.pop_width_employees = 600;
    $scope.pop_height_employees = 450;
    $scope.dg_height_full = 100;
    $scope.scroll_height_full = 400;
    $scope.popup_employees_visible = false;
    $scope.popup_employees_title = 'Employees';
    $scope.popup_employees = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [


            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', width: 200, text: 'Notify', icon: 'ion ion-ios-notifications', onClick: function (e) {
                        $scope.selectedEmployees = $rootScope.getSelectedRows($scope.dg_employees_instance);
                        if (!$scope.selectedEmployees) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }

                        $scope.Notify.Message =
                            'Dear ' + '[#Name]' + ',' + '\r\n'
                            //+ "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                            //+ '\r\n'
                            + '\r\n'
                            +  $scope.dg_selected.Title 
                            + '\r\n'
                            //+ '\r\n'
                            + 'Your(s) sincerely' + '\r\n'
                            + $rootScope.userTitle
                            + '\r\n'
                            + moment().format('MMMM Do YYYY, h:mm:ss a');

                        $scope.popup_notify_visible = true;
                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_employees_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            var size = $rootScope.getWindowSize();

            $scope.pop_width_employees = size.width - 300;
            //if ($scope.pop_width > 1200)
            //     $scope.pop_width = 1200;

            $scope.pop_height_employees = $(window).height() - 30; //630; //size.height;
            $scope.dg_height_full = $scope.pop_height_employees - 133;
            $scope.dg_employees_height = $scope.dg_height_full - 81-30;
            $scope.scroll_height_full = $scope.pop_height_employees - 133;





        },
        onShown: function (e) {

            $scope.bindEmployees();
        },
        onHiding: function () {

            //$('.cn').removeClass('w3-2017-flame');
            //$scope.courseEmployee = {
            //    Id: -1,
            //    Total: '-',
            //    Pending: '-',
            //    Registered: '-',
            //    Attended: '-',

            //    Canceled: '-',
            //    Failed: '-',
            //    Passed: '-',
            //    ApplicablePeople: [],
            //};
            $scope.applicableEmployees = [];
            $scope.popup_employees_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        bindingOptions: {
            visible: 'popup_employees_visible',
            width: 'pop_width_employees',
            height: 'pop_height_employees',
            title: 'popup_employees_title',

        }
    };
    /////////////////////////
    $scope.popup_expose_visible = false;
    $scope.popup_expose_title = 'Expose Book';
    $scope.popup_expose = {

        fullScreen: false,
        showTitle: true,
        height: 200,
        width: 500,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', onClick: function (e) {

                        $scope.expose.BookId = $scope.dg_selected.Id;

                        $scope.loadingVisible = true;
                        libraryService.exposeBook($scope.expose).then(function (response) {
                            //jook
                            $scope.loadingVisible = false;


                            //General.ShowNotify(Config.Text_SavedOk, 'success');
                            //var text = "A new item added to your e-library: " + "\n\n" + $scope.dg_selected.Title + "\n\n" + "Please access your Crew Pocket account to see more details."
                            //    + "\n" + "Date Sent: " + moment(new Date()).format('MM-DD-YYYY HH:mm');
                            //console.log(text);
                            //notificationService.sms(text, '09306678047').then(function (response) {

                            //}, function (err) { $scope.loadingVisible = false; General.ShowNotify2(err.message, 'error', 5000); });
                            $scope.expose = {
                                BookId: null,
                                SMS: true,
                                Email: true,
                                AppNotification: true,
                                CustomerId: Config.CustomerId,
                            };


                            $scope.$broadcast('getFilterQuery', null);
                            $scope.popup_expose_visible = false;




                        }, function (err) { $scope.loadingVisible = false; $scope.popup_expose_visible = false; General.ShowNotify(err.message, 'error'); });




                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_expose_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {



        },
        onShown: function (e) {


        },
        onHiding: function () {



            $scope.expose = {
                BookId: null,
                SMS: true,
                Email: true,
                AppNotification: true,
                CustomerId: Config.CustomerId,
            };
            $scope.popup_expose_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        bindingOptions: {
            visible: 'popup_expose_visible',

            title: 'popup_expose_title',

        }
    };
    /////////////////////////

    $scope.popup_folder_visible = false;
    $scope.popup_folder_title = 'Folder';
    $scope.popup_folder = {

        fullScreen: false,
        showTitle: true,
        height: 290,
        width: 500,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    validationGroup: 'folderadd',
                    type: 'success', text: 'Save', icon: 'check', onClick: function (e) {
                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        var dto = {
                            Id: -1,
                            ParentId: $scope.folderId,
                            Title: $scope.folder,
                            //sook
                        };
                        if ($scope.IsEditFolder)
                            dto.Id = $scope.tree_selected.Id;

                        $scope.loadingVisible = true;
                        libraryService.saveFolder(dto).then(function (response) {
                            //jook
                            $scope.loadingVisible = false;
                            switch ($scope._type) {
                                case '83':
                                    response.Items = response.Items83;
                                    break;
                                case '84':
                                    response.Items = response.Items84;
                                    break;
                                case '85':
                                    response.Items = response.Items85;
                                    break;
                                case '86':
                                    response.Items = response.Items86;
                                    break;
                                default:
                                    break;
                            }

                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            var tempid = $scope.folderId;
                            if (!$scope.IsEditFolder) {

                               
                                $scope.tree_ds.push(response);

                               
                                $scope.folderId = tempid;

                                $scope.folder = null;
                                $scope.tree_ds = Enumerable.From($scope.tree_ds).OrderBy('$.Fullcode').ToArray();

                            }
                            else {
                                var row = Enumerable.From($scope.tree_ds).Where('$.Id==' + response.Id).FirstOrDefault();
                                
                                //row = JSON.parse(JSON.stringify(response));
                                row.TitleFormated = response.TitleFormated;
                                row.Title = response.Title;
                                row.Fullcode = response.Fullcode;
                                row.ParentId = response.ParentId;
                                row.TitleFormatedSpace = response.TitleFormatedSpace;
                                row.Items = response.Items;
                               // $scope.tree_selected = JSON.parse(JSON.stringify(response));
                                $scope.tree_ds = Enumerable.From($scope.tree_ds).OrderBy('$.Fullcode').ToArray();
                                console.log($scope.tree_ds);
                                console.log(row);
                                $scope.tree_instance.refresh();
                                $scope.popup_folder_visible = false;
                            }
                           
                            // $scope.$broadcast('getFilterQuery', null);
                            // $scope.popup_folder_visible = false;




                        }, function (err) { $scope.loadingVisible = false; $scope.popup_folder_visible = false; General.ShowNotify(err.message, 'error'); });




                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_folder_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {



        },
        onShown: function (e) {


        },
        onHiding: function () {

            $scope.popup_folder_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        bindingOptions: {
            visible: 'popup_folder_visible',

            title: 'popup_folder_title',

        }
    };
    /////////////////////////
    $scope.popup_move_visible = false;
    $scope.popup_move_title = 'Move';
    $scope.popup_move = {

        fullScreen: false,
        showTitle: true,
        height: 230,
        width: 500,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', onClick: function (e) {
                        if (!$scope.selectedFolderId)
                            return;
                        var _ids = Enumerable.From($scope.dg_selecteds).Select('$.Id').ToArray().join('_');
                        var dto = {
                            folderId: $scope.selectedFolderId,
                            ids: _ids,
                        };

                        $scope.loadingVisible = true;
                        libraryService.move(dto).then(function (response) {
                            //jook
                            $scope.loadingVisible = false;


                            General.ShowNotify(Config.Text_SavedOk, 'success');

                            $scope.tree_selected.Items = $scope.tree_selected.Items - $scope.dg_selecteds.length;
                            var des = Enumerable.From($scope.tree_ds).Where('$.Id==' + $scope.selectedFolderId).FirstOrDefault();
                            des.Items = des.Items + $scope.dg_selecteds.length;
                            $scope.tree_instance.refresh();

                            $scope.$broadcast('getFilterQuery', null);
                            $scope.popup_move_visible = false;




                        }, function (err) { $scope.loadingVisible = false; $scope.popup_move_visible = false; General.ShowNotify(err.message, 'error'); });




                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_move_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {



        },
        onShown: function (e) {


        },
        onHiding: function () {

            $scope.popup_move_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        bindingOptions: {
            visible: 'popup_move_visible',

            title: 'popup_move_title',

        }
    };
    //////////////////////////////
    $scope.popup_notify_visible = false;
    $scope.popup_notify_title = 'Notify';
    $scope.popup_notify = {

        fullScreen: false,
        showTitle: true,
        height: 500,
        width: 500,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', onClick: function (e) {

                        //cmnt
                        $scope.Notify.ObjectId = $scope.dg_selected.Id;
                        $scope.Notify.Message = $scope.Notify.Message.replace(/\r?\n/g, '<br />');
                        var temp = Enumerable.From($scope.selectedEmployees).Select('{EmployeeId:$.EmployeeId,Name:$.Name}').ToArray();
                        $.each(temp, function (_i, _d) {
                            $scope.Notify.Employees.push(_d.EmployeeId);
                            $scope.Notify.Names.push(_d.Name);
                        });
                        //$scope.Notify.Employees=  Enumerable.From($scope.selectedEmployees).Select('$.EmployeeId').ToArray();
                        $scope.loadingVisible = true;
                        notificationService.notify($scope.Notify).then(function (response) {

                            $scope.loadingVisible = false;


                            General.ShowNotify(Config.Text_SavedOk, 'success');

                            $scope.Notify = {
                                ModuleId: $rootScope.moduleId,
                                TypeId: 97,

                                SMS: true,
                                Email: true,
                                App: true,
                                Message: null,
                                CustomerId: Config.CustomerId,
                                SenderId: null,
                                Employees: [],
                                Names: [],
                            };


                            $scope.popup_notify_visible = false;




                        }, function (err) { $scope.loadingVisible = false; $scope.popup_notify_visible = false; General.ShowNotify(err.message, 'error'); });




                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_notify_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {



        },
        onShown: function (e) {


        },
        onHiding: function () {



            $scope.Notify = {
                ModuleId: $rootScope.moduleId,
                TypeId: 97,

                SMS: true,
                Email: true,
                App: true,
                Message: null,
                CustomerId: Config.CustomerId,
                SenderId: null,
                Employees: [],
                Names: [],
            };
            $scope.popup_notify_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        position: 'right',
        bindingOptions: {
            visible: 'popup_notify_visible',

            title: 'popup_notify_title',

        }
    };
    ////////////////////////////
    //8-11
    var _rename = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseAPI + 'api/book/file/rename', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    $scope.renameFile = function (row) {
        var data = row.data;
        $scope._fileId = data.Id;
        $scope._fileName = data.SysUrl;
        $scope._fileData = data;
        $scope.popup_rename_visible = true;
    };
    $scope._fileName = null;
    $scope._fileId = null;
    $scope._fileData = null;
    $scope.txt_filename = {
        hoverStateEnabled: false,
         
        bindingOptions: {
            value: '_fileName',
        }
    };
    $scope.popup_rename_visible = false;
    $scope.popup_rename_title = 'Rename';
    $scope.popup_rename = {

        fullScreen: false,
        showTitle: true,
        height: 200,
        width: 500,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', onClick: function (e) {

                        if (!$scope._fileName) {
                            General.ShowNotify('Invalid File Name', 'error');
                            return;
                        }
                        $scope.loadingVisible = true;
                        _rename({ id: $scope._fileId, name: $scope._fileName }).then(function (response) {

                            $scope.loadingVisible = false;
                            $scope._fileData.SysUrl = $scope._fileName;

                            General.ShowNotify(Config.Text_SavedOk, 'success');
 

                            $scope.popup_rename_visible = false;




                        }, function (err) { $scope.loadingVisible = false; $scope.popup_notify_visible = false; General.ShowNotify(err.message, 'error'); });




                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_rename_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {



        },
        onShown: function (e) {


        },
        onHiding: function () {
            $scope._fileName = null;
            $scope._fileId = null;
           
            $scope.popup_rename_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        position: 'right',
        bindingOptions: {
            visible: 'popup_rename_visible',

            title: 'popup_rename_title',

        }
    };
    ////////////////////////////
    $scope.expose = {
        BookId: null,
        SMS: true,
        Email: true,
        AppNotification: true,
        CustomerId: Config.CustomerId,
    };
    $scope.chb_SMS = {

        text: 'Send SMS',
        bindingOptions: {
            value: 'expose.SMS',

        }
    };
    $scope.chb_Email = {

        text: 'Send Email',
        bindingOptions: {
            value: 'expose.Email',

        }
    };
    $scope.chb_AppNotification = {

        text: 'Send Notification',
        bindingOptions: {
            value: 'expose.AppNotification',

        }
    };


    $scope.Notify = {
        ModuleId: $rootScope.moduleId,
        TypeId: 97,

        SMS: true,
        Email: true,
        App: true,
        Message: null,
        CustomerId: Config.CustomerId,
        SenderId: null,
        Employees: [],
        Names: [],
    };

    $scope.chb_SMSNotify = {

        text: 'Send SMS',
        bindingOptions: {
            value: 'Notify.SMS',

        }
    };
    $scope.chb_EmailNotify = {

        text: 'Send Email',
        bindingOptions: {
            value: 'Notify.Email',

        }
    };
    $scope.chb_AppNotificationNotify = {

        text: 'Send Notification',
        bindingOptions: {
            value: 'Notify.AppNotification',

        }
    };
    $scope.txt_MessageNotify = {
        hoverStateEnabled: false,
        height: 300,
        bindingOptions: {
            value: 'Notify.Message',

        }
    };
    ////////////////////////////
    $scope.doRefresh = false;
    $scope.filters = [];
    $scope.getFilters = function () {
        var filters = $scope.filters;
        if (filters.length == 0)
            filters = [['Id', '>', 0]];
        else {
            //filters.push('and');
            //filters.push(['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]);

        }


        return filters;
    };
    $scope.bind = function () {
        var url = !$scope.IsDocument ? 'odata/library/books/folder/' + Config.CustomerId + '/' + $scope.tree_selected.Fullcode + '/0' : 'odata/library/documents/' + Config.CustomerId ;
        if (!$scope.dg_book_ds /*&& $scope.doRefresh*/) {

            $scope.dg_book_ds = {
                store: {
                    type: "odata",
                    url: $rootScope.serviceUrl + url,
                    key: "Id",
                    version: 4,
                    onLoaded: function (e) {
                        // $scope.loadingVisible = false;
                        //filter
                        $rootScope.$broadcast('OnDataLoaded', null);
                    },
                    beforeSend: function (e) {

                        $scope.dsUrl = General.getDsUrl(e);

                        // $scope.$apply(function () {
                        //    $scope.loadingVisible = true;
                        // });
                        $rootScope.$broadcast('OnDataLoading', null);
                    },
                },
                // filter: [['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]],
                sort: [{ getter: "DateCreate", desc: true }],

            };
        }

        if ($scope.doRefresh) {
            $scope.filters = $scope.getFilters();
            $scope.dg_book_ds.filter = $scope.filters;
            $scope.dg_book_instance.refresh();
            $scope.doRefresh = false;
        }

    };
    $scope.applicableEmployees = [];
    $scope.bindEmployees = function () {
        $scope.loadingVisible = true;
        libraryService.getBookApplicableEmployees($scope.dg_selected.Id).then(function (response) {
            $scope.loadingVisible = false;
            console.log(response);
            $scope.applicableEmployees = (response);
            //$scope.dg_employees_ds = courseEmployee.ApplicablePeople;

            // $scope.dg_employees_instance.refresh();

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.filterTiles = [];
    $scope.EmployeeTotal = 0;
    $scope.filterStatus = function ($event, statusId) {
        //$event.currentTarget

        var self = $($event.currentTarget).hasClass('w3-2017-flame');
        if (self) {
            $($event.currentTarget).removeClass('w3-2017-flame');
            $scope.filterTiles = Enumerable.From($scope.filterTiles).Where('$!=' + statusId).ToArray();
        }
        else {
            $($event.currentTarget).addClass('w3-2017-flame');
            $scope.filterTiles.push(statusId);
        }
        var filter = [];
        $.each($scope.filterTiles, function (_i, _d) {
            switch (_d) {
                case -1:
                    //IsVisited
                    filter.push(['IsVisited', '=', false]);
                    filter.push('and');
                    break;
                case -2:
                    //IsDownloaded
                    filter.push(['IsDownloaded', '=', false]);
                    filter.push('and');
                    break;
                case 1:
                    filter.push(['IsVisited', '=', true]);
                    filter.push('and');
                    break;
                case 2:
                    filter.push(['IsDownloaded', '=', true]);
                    filter.push('and');
                    break;
                default:
                    break;

            }
        });
        if (filter.length > 0) {
            filter.pop();
            $scope.dg_employees_instance.filter(filter);
        }
        else
            $scope.dg_employees_instance.clearFilter();
        //$('.cn').removeClass('w3-2017-flame');
        //if (!self)
        //    $($event.currentTarget).addClass('w3-2017-flame');
        //else
        //    statusId = null;
        //if (statusId) {
        //    if (statusId != -1)
        //        $scope.dg_employees_instance.filter('StatusId', '=', Number(statusId));
        //    else
        //        $scope.dg_employees_instance.filter('StatusId', '=', null);

        //}
        //else
        //    $scope.dg_employees_instance.clearFilter();
    };
    //////////////////////////////
    $scope.tree_columns = [

        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, encodeHtml: false },
        // { dataField: 'FullCode', caption: 'Code', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, encodeHtml: false, width: 200, sortIndex: 0, sortOrder: "asc" },
        { dataField: 'Items', caption: 'Items', allowResizing: true, alignment: 'center', dataType: 'string', width: 100, allowEditing: false },
         { dataField: 'Files', caption: 'Files', allowResizing: true, alignment: 'center', dataType: 'string', width: 100, allowEditing: false },
    ];

    $scope.tree_selected = null;
    $scope.tree_instance = null;
    $scope.tree_ds = null; //[{ Id: 1, ParentId: null, Title: 'A' }, { Id: 2, ParentId: null, Title: 'B'}];
    $scope.expandedRow = null;

    $scope.tree = {
        selection: { mode: 'single' },

        filterRow: {
            visible: true,
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
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.tree_selected = null;
                $scope.dg_book_ds = null;
            }
            else {
                $scope.tree_selected = data;
                $scope.dg_book_ds = null;
                $scope.$broadcast('getFilterQuery', null);
                // $scope.bind();
                //personService.getEmployeesByGroupCode(data.FullCode).then(function (response) {
                //    $scope.dg_employees_ds = response;


                //}, function (err) { General.ShowNotify(err.message, 'error'); });
            }


        },

        keyExpr: "Id",
        parentIdExpr: "ParentId",

        showBorders: true,
        columns: $scope.tree_columns,
        headerFilter: {
            visible: true
        },
        height: $(window).height() - 180,
        // dataStructure:'tree',
        wordWrapEnabled:true,
        bindingOptions: {
            dataSource: 'tree_ds',
            expandedRowKeys: 'expandedRow',
            //height:'height_tree',
        }
    };

    $scope.selectedFolderId = null;
    $scope.sb_folder = {
        showClearButton: true,
        searchEnabled: true,

        itemTemplate: function (data) {
            return "<div>" + data.TitleFormated + "</div>";
        },
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'selectedFolderId',

            dataSource: 'tree_ds',
        }
    };

    $scope.folderId = null;
    $scope.sb_folder_add = {
        showClearButton: true,
        searchEnabled: true,

        itemTemplate: function (data) {
            return "<div>" + data.TitleFormated + "</div>";
        },
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'folderId',

            dataSource: 'tree_ds',
        }
    };

    $scope.folder = null;
    $scope.txt_folder_title = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'folder',
        }
    };

    $scope.bindTree = function () {
        libraryService.getFolders(Config.CustomerId).then(function (response) {
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {
                switch ($scope._type) {
                    case '83':
                        _d.Items = _d.Items83;
                        _d.Files = _d.Files83;
                        break;
                    case '84':
                        _d.Items = _d.Items84;
                        _d.Files = _d.Files84;
                        break;
                    case '85':
                        _d.Items = _d.Items85;
                        _d.Files = _d.Files85;
                        break;
                    case '86':
                        _d.Items = _d.Items86;
                        _d.Files = _d.Files86;
                        break;
                    default:
                        break;
                }
            });
            $scope.tree_ds = response;
            $scope.expandedRow = [];
            $scope.expandedRow.push(response[0].Id);


        }, function (err) { General.ShowNotify(err.message, 'error'); });
    };
    ///////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = !$scope.IsDocument ? '> Knowledge' : '> Documents';
        switch ($scope._type) {
            case '83':
                $rootScope.page_title = '> Books';
                break;
            case '84':
                $rootScope.page_title = '> Papers';
                break;
            case '85':
                $rootScope.page_title = '> Videos';
                break;
            default:
                break;
        }
        $('.library').fadeIn();

        //$scope.loadingVisible = true;
        $scope.bindTree();

    }
    //////////////////////////////////////////
    $scope.$on('getFilterResponse', function (event, prms) {

        $scope.filters = prms;

        $scope.doRefresh = true;
        $scope.bind();
    });
    $scope.$on('onTemplateSearch', function (event, prms) {

        $scope.$broadcast('getFilterQuery', null);
    });
    $scope.$on('onLibrarySaved', function (event, prms) {

        $scope.doRefresh = true;
    });
    $scope.$on('onFolderAdd', function (event, prms) {

        $scope.tree_selected.Items = $scope.tree_selected.Items + 1;
        $scope.tree_instance.refresh();
    });
    
    $scope.$on('onLibraryHide', function (event, prms) {

        $scope.bind();


    });
    //////////////////////////////////////////
    $rootScope.$broadcast('LibraryLoaded', null);





}]);