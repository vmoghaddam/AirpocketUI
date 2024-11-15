'use strict';
app.controller('libraryAddController', ['$scope', '$location', 'libraryService', 'authService', '$routeParams', '$rootScope', function ($scope, $location, libraryService, authService, $routeParams, $rootScope) {
    $scope.isNew = true;
    $scope.IsEditable = $rootScope.IsLibraryEditable();
    $scope.IsEditableDoc = $rootScope.IsDocEditable();
    $scope._IsEditable = $scope.IsEditable || $scope.IsEditableDoc;
    
    $scope.IsExposedDisabled = true;

    $scope.entity = {
        Id: -1,
        Issue:null,
        Title: null,
        ISBN: null,
        DateRelease: null,
        PublisherId: null,
        ISSNPrint: null,
        ISSNElectronic: null,
        DOI: null,
        Pages: null,
        CategoryId: null,
        ImageUrl: null,
        Abstract: null,
        DateCreate: null,
        DatePublished: null,
        CustomerId: Config.CustomerId,
        IsExposed: false,
        BookKeywords: [],
        BookAuthors: [],
        BookRelatedAircraftTypes: [],
        BookRelatedGroups: [],
        BookRelatedStudyFields: [],
        BookRelatedEmployees: [],
        BookFiles: [],
        DateDeadline: null,
        Duration: null,
        LanguageId: null,
        ExternalUrl: null,
        NumberOfLessens: null,
        TypeId: 83,
        JournalId: null,
        Conference: null,
        ConferenceLocationId: null,
        DateConference: null,
        Sender: null,
        No: null,
        PublishedIn: null,
        INSPECAccessionNumber: null,
        Edition: null,
        DateEffective: null,
        FolderId: null,
        BookKey:null,
       
    };

    $scope.clearEntity = function () {
        $scope.entity.Id = -1;
        $scope.entity.Title = null;
        $scope.entity.Issue = null;
        $scope.entity.ISBN = null;
        $scope.entity.DateRelease = null;
        $scope.entity.DatePublished = null;
        $scope.entity.PublisherId = null;
        $scope.entity.ISSNPrint = null;
        $scope.entity.ISSNElectronic = null;
        $scope.entity.DOI = null;
        $scope.entity.Pages = null;
        $scope.entity.CategoryId = null;
        $scope.entity.ImageUrl = null;
        $scope.entity.Abstract = null;
        $scope.entity.DateCreate = null;
        $scope.entity.IsExposed = false;

        $scope.entity.BookKeywords = [];
        $scope.entity.BookAuthors = [];
        $scope.entity.BookRelatedAircraftTypes = [];
        $scope.entity.BookRelatedGroups = [];
        $scope.entity.BookRelatedStudyFields = [];
        $scope.entity.BookRelatedEmployees = [];
        $scope.entity.BookFiles = [];

        $scope.uploaderValueDocument = [];
        $scope.uploadedFileDocument = null;
        $scope.uploader_document_instance.reset();
        $scope.entity.CustomerId = Config.CustomerId;

        $scope.img_url = 'content/images/image.png';
        $scope.entity.DateDeadline = null;
        $scope.entity.Duration = null;
        $scope.entity.LanguageId = null;
        $scope.entity.ExternalUrl = null;
        $scope.entity.NumberOfLessens = null;
        //  $scope.entity.TypeId = null;
        $scope.entity.JournalId = null;
        $scope.entity.Conference = null;
        $scope.entity.ConferenceLocationId = null;
        $scope.entity.DateConference = null;
        $scope.entity.Sender = null;
        $scope.entity.No = null;
        $scope.entity.PublishedIn = null;
        $scope.entity.INSPECAccessionNumber = null;
        $scope.entity.Edition = null;
        $scope.entity.DateEffective = null;
        $scope.entity.BookKey = null;

        $scope.chapter_ds = [];
        $scope.dg_file_ds = null;
         
        $scope.expandedRow = [];
       
      //  $scope.entity.FolderId = null;
    };

    $scope.bind = function (data) {
        $scope.entity.Id = data.Id;
        $scope.entity.Title = data.Title;
        $scope.entity.Issue = data.Issue;
        $scope.entity.ISBN = data.ISBN;
        $scope.entity.DateRelease = data.DateRelease;
        $scope.entity.PublisherId = data.PublisherId;
        $scope.entity.ISSNPrint = data.ISSNPrint;
        $scope.entity.ISSNElectronic = data.ISSNElectronic;
        $scope.entity.DOI = data.DOI;
        $scope.entity.Pages = data.Pages;
        $scope.entity.CategoryId = data.CategoryId;
        $scope.entity.CustomerId = data.CustomerId;
        $scope.entity.Abstract = data.Abstract;
        $scope.entity.DateCreate = data.DateCreate;
        $scope.entity.DatePublished = data.DatePublished;
        $scope.entity.ImageUrl = data.ImageUrl;
        $scope.entity.BookKeywords = data.BookKeywords;
        $scope.entity.BookAuthors = data.BookAuthors;
        $scope.entity.BookRelatedAircraftTypes = data.BookRelatedAircraftTypes;
        $scope.entity.BookRelatedGroups = data.BookRelatedGroups;
        $scope.entity.BookRelatedStudyFields = data.BookRelatedStudyFields;
        $scope.entity.BookRelatedEmployees = data.BookRelatedEmployees;
        $scope.entity.BookFiles = data.BookFiles;
        $scope.entity.IsExposed = data.IsExposed;
        $scope.IsExposedDisabled = data.IsExposed == 0;

        if (data.ImageUrl)
            $scope.img_url = $rootScope.clientsFilesUrl + data.ImageUrl;
        else
            $scope.img_url = 'content/images/image.png';

        $scope.entity.DateDeadline = data.DateDeadline;
        $scope.entity.Duration = data.Duration;
        $scope.entity.LanguageId = data.LanguageId;
        $scope.entity.ExternalUrl = data.ExternalUrl;
        $scope.entity.NumberOfLessens = data.NumberOfLessens;
        $scope.entity.TypeId = data.TypeId;
        $scope.entity.JournalId = data.JournalId;
        $scope.entity.Conference = data.Conference;
        $scope.entity.ConferenceLocationId = data.ConferenceLocationId;
        $scope.entity.DateConference = data.DateConference;
        $scope.entity.Sender = data.Sender;
        $scope.entity.No = data.No;
        $scope.entity.PublishedIn = data.PublishedIn;
        $scope.entity.INSPECAccessionNumber = data.INSPECAccessionNumber;
        $scope.entity.Edition = data.Edition;
        $scope.entity.DateEffective = data.DateEffective;
        $scope.entity.FolderId = data.FolderId;
        $scope.entity.BookKey = data.BookKey;

        $scope.bookKey = data.BookKey;
        
        $scope.chapter_ds = data.Chapters;
        $scope.expandedRow = Enumerable.From(data.Chapters).Select('$.Id').ToArray();

        $scope.fillFileDs();

    };
    ///////////////////////////
    var tabs = [
        { text: "Main", id: 'main', visible_btn: false },
        { text: "Chapters/Files", id: 'files', visible_btn: false, visible: true },

        //{ text: "Aircraft Types", id: 'actypes', visible_btn: true, visible: true },
        //{ text: "Groups", id: 'groups', visible_btn: false, visible_btn2: true, visible: true },

       // { text: "Educations", id: 'educations', visible_btn: false, visible: true },

        { text: "Employees", id: 'employees', visible_btn: false, visible: true },


    ];

    $scope.btn_visible_aircrafttype = false;
    $scope.btn_visible_coursetype = false;
    $scope.btn_visible_education = false;
    $scope.btn_visible_course = false;
    $scope.btn_visible_group = false;
    $scope.btn_visible_employee = false;
    $scope.btn_visible_file = false;


    $scope.tabs = tabs;
    $scope.selectedTabIndex = 0;
    $scope.$watch("selectedTabIndex", function (newValue) {

        try {
            $scope.selectedTab = tabs[newValue];
            $('.tab').hide();
            $('.' + $scope.selectedTab.id).fadeIn(100, function () {


            });

            $scope.dg_aircrafttype_instance.repaint();
            //$scope.dg_coursetype_instance.repaint();
            $scope.dg_education_instance.repaint();
            //$scope.dg_course_instance.repaint();
            $scope.dg_group_instance.repaint();
            $scope.dg_employee_instance.repaint();
            $scope.chapter_instance.refresh();

            var myVar = setInterval(function () {

                var scl = $("#dg_education").find('.dx-datagrid-rowsview').dxScrollable('instance');
                scl.scrollTo({ left: 0 });
                var scl2 = $("#dg_aircrafttype").find('.dx-datagrid-rowsview').dxScrollable('instance'); scl2.scrollTo({ left: 0 });
                var scl3 = $("#dg_file").find('.dx-datagrid-rowsview').dxScrollable('instance'); scl3.scrollTo({ left: 0 });
                //var scl4 = $("#dg_course").find('.dx-datagrid-rowsview').dxScrollable('instance'); scl4.scrollTo({ left: 0 });
                var scl5 = $("#dg_group").find('.dx-datagrid-rowsview').dxScrollable('instance'); scl5.scrollTo({ left: 0 });
                var scl6 = $("#dg_employee").find('.dx-datagrid-rowsview').dxScrollable('instance'); scl6.scrollTo({ left: 0 });

                clearInterval(myVar);
            }, 10);

           // $scope.btn_visible_aircrafttype = newValue == 2;

            $scope.btn_visible_file = newValue == 1;
            $scope.btn_visible_education = newValue == 4;
            //$scope.btn_visible_course = newValue == 4;
           // $scope.btn_visible_group = newValue == 3;
            $scope.btn_visible_employee = newValue ==2;

           



        }
        catch (e) {
           // console.log(e);
        }

    });
    $scope.tabs_options = {


        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        bindingOptions: {

            dataSource: { dataPath: "tabs", deep: true },
            selectedIndex: 'selectedTabIndex'
        }

    };

    //////////////////////////
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

    $scope.txt_Title = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Title',
        }
    };
    $scope.txt_Edition = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Edition',
        }
    };
    $scope.txt_DateEffective = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.DateEffective',
        }
    };
    $scope.txt_Remark = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Remark',
        }
    };
    $scope.number_Lessons = {
        hoverStateEnabled: false,
        min:1,
        bindingOptions: {
            value: 'entity.NumberOfLessens',
        }
    };
    $scope.txt_Issue = {
        hoverStateEnabled: false,
        min: 1,
        bindingOptions: {
            value: 'entity.Issue',
        }
    };
    $scope.sb_Category = {

        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(79),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.CategoryId',

        }
    };
    $scope.sb_Language = {

        showClearButton: false,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(87),
        displayExpr: "Title",
        valueExpr: 'Id',
      
        bindingOptions: {
            value: 'entity.LanguageId',

        }
    };
    $scope.sb_Type = {

        showClearButton: false,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceLibraryItemTypes(),
        displayExpr: "Title",
        valueExpr: 'Id',
        onSelectionChanged: function (e) {
            if (e.selectedItem.Id == 83) {
                $scope.entity.DateDeadline = null;
                $scope.entity.Duration = null;
                $scope.entity.LanguageId = null;
                
                $scope.entity.NumberOfLessens = null;
                //  $scope.entity.TypeId = null;
                $scope.entity.JournalId = null;
                $scope.entity.Conference = null;
                $scope.entity.ConferenceLocationId = null;
                $scope.entity.DateConference = null;
                $scope.entity.Sender = null;
                $scope.entity.No = null;
                $scope.DOI = null;
               
                $scope.entity.INSPECAccessionNumber = null;
            }
            if (e.selectedItem.Id == 84) {
                $scope.entity.DateDeadline = null;
                $scope.entity.Duration = null;
                $scope.entity.LanguageId = null;
                $scope.entity.NumberOfLessens = null;
                $scope.entity.Sender = null;
                $scope.entity.No = null;
                $scope.PublisherId = null;
                $scope.entity.ISBN = null;
            }
        },
        bindingOptions: {
            value: 'entity.TypeId',

        }
    };

    /////////////////////////////
    var keywords = [];
    $scope.keywords = keywords.slice();
    $scope.tag_KeyWords = {
        //elementAttr: {

        //    class: "lowercase"
        //},
        acceptCustomValue: true,
        searchEnabled: true,
        hideSelectedItems: true,
        bindingOptions: {
            items: "keywords",
            value: "entity.BookKeywords"
        },
        onCustomItemCreating: function (args) {
            var newValue = args.text;
            if ($scope.keywords.indexOf(newValue) == -1)
                $scope.keywords.unshift(newValue);
            console.log($scope.entity.BookKeywords);

            args.customItem = newValue;
        }
    };
    //$rootScope.getDatasourceAuthors
    $scope.tag_authors_instance = null;
    $scope.tag_Authors = {
        dataSource: $rootScope.getDatasourceAuthors(),
        searchEnabled: true,
        hideSelectedItems: true,
        displayExpr: "Name",
        valueExpr: 'Id',
        onContentReady: function (e) {
            if (!$scope.tag_authors_instance)
                $scope.tag_authors_instance = e.component;
        },
        bindingOptions: {

            value: "entity.BookAuthors"
        },

    };
    $scope.btn_newAuthor = {
        icon: 'plus',
        width: 30,
        type: 'default',
        onClick: function (e) {
            if (!$scope.tag_authors_instance)
                return;

            $scope.tag_authors_instance.getDataSource().reload();

        }
    };

    
    $scope.sb_publisher_instance = null;
    $scope.sb_Publisher = {
        dataSource: $rootScope.getDatasourcePublishers(),
        showClearButton: true,
        searchEnabled: true,
        searchExpr: ["Title"],
        valueExpr: "Id",
        displayExpr: "Title",
        onContentReady: function (e) {
            if (!$scope.sb_publisher_instance)
                $scope.sb_publisher_instance = e.component;
        },
        bindingOptions: {
            value: 'entity.PublisherId',

        }

    };
    $scope.sb_journal_instance = null;
    $scope.sb_journal = {
        dataSource: $rootScope.getDatasourceJournals(),
        showClearButton: true,
        searchEnabled: true,
        searchExpr: ["Title"],
        valueExpr: "Id",
        displayExpr: "Title",
        onContentReady: function (e) {
            if (!$scope.sb_journal_instance)
                $scope.sb_journal_instance = e.component;
        },
        bindingOptions: {
            value: 'entity.JournalId',

        }

    };
    $scope.btn_newPublisher = {
        icon: 'plus',
        width: 30,
        type: 'default',
        onClick: function (e) {
            if (!$scope.sb_publisher_instance)
                return;

            $scope.sb_publisher_instance.getDataSource().reload();

        }
    };
    $scope.btn_newJournal = {
        icon: 'plus',
        width: 30,
        type: 'default',
        onClick: function (e) {
            if (!$scope.sb_journal_instance)
                return;

            $scope.sb_journal_instance.getDataSource().reload();

        }
    };
    $scope.date_DatePublication = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.DateRelease',

        }
    };
    
    $scope.txt_Duration = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Duration',
        }
    };
    $scope.txt_Abstract = {
        hoverStateEnabled: false,
        height: 170,
        bindingOptions: {
            value: 'entity.Abstract',

        }
    };
    //txt_ISSNPrint
    $scope.txt_ISSNPrint = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.ISSNPrint',
        }
    };
    //txt_ISSNElectronic
    $scope.txt_ISSNElectronic = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.ISSNElectronic',
        }
    };
    //txt_ISBN
    $scope.txt_ISBN = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.ISBN',
        }
    };

    $scope.txt_DOI = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.DOI',
        }
    };
    $scope.txt_INSPECAccessionNumber = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.INSPECAccessionNumber',
        }
    };
    $scope.txt_Remark = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.PublishedIn',
        }
    };
    //txt_Pages
    $scope.txt_Pages = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Pages',
        }
    };
    $scope.txt_DateConference = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.DateConference',
        }
    };
    
    $scope.chb_Exposed = {

        text: 'Exposed',
        bindingOptions: {
            value: 'entity.IsExposed',
            disabled: 'IsExposedDisabled',
        }
    };
     
    /////////////////////////////
    $scope.img_url = 'content/images/image.png';
    $scope.uploaderValueImage = [];
    $scope.uploadedFileImage = null;
    $scope.uploader_image = {
        //uploadedMessage: 'بارگزاری شد',
        multiple: false,
        // selectButtonText: 'انتخاب تصویر',
        labelText: '',
        accept: "image/*",
        uploadMethod: 'POST',
        uploadMode: "instantly",
        rtlEnabled: true,
        uploadUrl: $rootScope.fileHandlerUrl + '?t=clientfiles',
        onValueChanged: function (arg) {

        },
        onUploaded: function (e) {
            $scope.uploadedFileImage = e.request.responseText;
            $scope.entity.ImageUrl = e.request.responseText;
            $scope.img_url = $rootScope.clientsFilesUrl + $scope.uploadedFileImage;

        },
        bindingOptions: {
            value: 'uploaderValueImage'
        }
    };
    ///////////////////////////////
    $scope.scroll_height = 200;
    $scope.dg_height = 200;
    $scope.dg_height2 = 200;
    $scope.scroll_main = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_height', }
    };
    $scope.pop_width = 900;
    $scope.pop_height = 600;
    $scope.popup_add_visible = false;
    $scope.popup_add_title = 'New';
    $scope.popup_add = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', toolbar: 'bottom', options: {
                    type: 'default', text: 'Add', width: 120, icon: 'plus', validationGroup: 'aircrafttypeadd', bindingOptions: { visible: 'btn_visible_aircrafttype', }, onClick: function (e) {
                        // $scope.popup_aircrafttype_visible = true;
                        $rootScope.$broadcast('InitAircraftSelect', null);
                    }
                }
            },

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Delete', width: 120, icon: 'clear', validationGroup: 'aircrafttypeadd', bindingOptions: { visible: 'btn_visible_aircrafttype' }, onClick: function (e) {
                        var dg_selected = $rootScope.getSelectedRow($scope.dg_aircrafttype_instance);
                        if (!dg_selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $scope.entity.BookRelatedAircraftTypes = Enumerable.From($scope.entity.BookRelatedAircraftTypes).Where('$.Id!=' + dg_selected.Id).ToArray();
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Add', width: 120, icon: 'plus', validationGroup: 'groupadd', bindingOptions: { visible: 'btn_visible_group' }, onClick: function (e) {
                        $rootScope.$broadcast('InitJobGroupSelect', null);
                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Delete', width: 120, icon: 'clear', validationGroup: 'groupadd', bindingOptions: { visible: 'btn_visible_group' }, onClick: function (e) {
                        var dg_selected = $rootScope.getSelectedRow($scope.dg_group_instance);
                        if (!dg_selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $scope.entity.BookRelatedGroups = Enumerable.From($scope.entity.BookRelatedGroups).Where('$.Id!=' + dg_selected.Id).ToArray();
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Add', width: 120, icon: 'plus', validationGroup: 'educationadd', onClick: function (e) {

                        $rootScope.$broadcast('InitStudyFieldSelect', null);
                    }
                }, toolbar: 'bottom', bindingOptions: { visible: 'btn_visible_education', disabled: 'IsMainDisabled' }
            },

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Delete', width: 120, icon: 'clear', validationGroup: 'educationadd', bindingOptions: { visible: 'btn_visible_education', }, onClick: function (e) {
                        var dg_selected = $rootScope.getSelectedRow($scope.dg_education_instance);
                        if (!dg_selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $scope.entity.BookRelatedStudyFields = Enumerable.From($scope.entity.BookRelatedStudyFields).Where('$.Id!=' + dg_selected.Id).ToArray();
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Add', width: 120, icon: 'plus', validationGroup: 'employeeadd', bindingOptions: { visible: 'btn_visible_employee' }, onClick: function (e) {
                        $rootScope.$broadcast('InitEmployeeSelect', null);
                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Delete', width: 120, icon: 'clear', validationGroup: 'employeeadd', bindingOptions: { visible: 'btn_visible_employee' }, onClick: function (e) {
                        var dg_selected = $rootScope.getSelectedRow($scope.dg_employee_instance);
                        if (!dg_selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $scope.entity.BookRelatedEmployees = Enumerable.From($scope.entity.BookRelatedEmployees).Where('$.Id!=' + dg_selected.Id).ToArray();
                    }
                }, toolbar: 'bottom'
            },
            { widget: 'dxButton', location: 'after', options: { type: 'default', text: 'Save', icon: 'check', validationGroup: 'libraryadd', bindingOptions: {} }, toolbar: 'bottom' },
            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            var size = $rootScope.getWindowSize();
            $scope.pop_height = $(window).height() - 30;
            if (size.width <= 600) {
                $scope.pop_width = size.width;
                $scope.pop_height = size.height;
            }


            //$scope.pop_width = size.width;
            //if ($scope.pop_width > 1000)
            //    $scope.pop_width = 1000;

            // $scope.pop_height = $(window).height() - 30; //630; //size.height;
            $scope.dg_height = $scope.pop_height - 133;
            $scope.dg_height2 = $scope.dg_height - 173;
            $scope.scroll_height = $scope.pop_height - 140;

        },
        onShown: function (e) {
            $scope.loadingVisible = true;
            libraryService.getKeywords().then(function (response) {
                $scope.keywords = response.slice();
                if ($scope.tempData != null) {
                    libraryService.getBook($scope.tempData.Id).then(function (result) {
                        $scope.loadingVisible = false;
                        $scope.bind(result);

                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                }
                else


                    $scope.loadingVisible = false;


            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });




        },
        onHiding: function () {

            $scope.clearEntity();

            $scope.popup_add_visible = false;
            $rootScope.$broadcast('onLibraryHide', null);
        },
        bindingOptions: {
            visible: 'popup_add_visible',
            width: 'pop_width',
            height: 'pop_height',
            title: 'popup_add_title',
            'toolbarItems[0].visible': 'btn_visible_aircrafttype',
            'toolbarItems[1].visible': 'btn_visible_aircrafttype',
            'toolbarItems[2].visible': 'btn_visible_group',
            'toolbarItems[3].visible': 'btn_visible_group',
            'toolbarItems[4].visible': 'btn_visible_education',
            'toolbarItems[5].visible': 'btn_visible_education',
            'toolbarItems[6].visible': 'btn_visible_employee',
            'toolbarItems[7].visible': 'btn_visible_employee',
            'toolbarItems[8].visible': '_IsEditable',
        }
    };

    //close button
    $scope.popup_add.toolbarItems[9].options.onClick = function (e) {

        $scope.popup_add_visible = false;
    };

    //save button
    $scope.popup_add.toolbarItems[8].options.onClick = function (e) {

        var result = e.validationGroup.validate();

        if (!result.isValid) {
            General.ShowNotify(Config.Text_FillRequired, 'error');
            return;
        }

        //if ($scope.entity.TypeId == 83 && !$scope.entity.PublisherId) {
        //    General.ShowNotify('Please select "Publisher".', 'error');
        //    return;
        //}
        //if ($scope.entity.TypeId == 84 && !$scope.entity.JournalId) {
        //    General.ShowNotify('Please select "Journal / Conference".', 'error');
        //    return;
        //}

        if ($scope.isNew)
            $scope.entity.Id = -1;

        $scope.entity.DateRelease = new Date($scope.entity.DateRelease).ToUTC();
        $scope.entity.BookKey = $scope.bookKey  ;
        
        $scope.loadingVisible = true;
        libraryService.save($scope.entity).then(function (response) {

            $scope.clearEntity();


            General.ShowNotify(Config.Text_SavedOk, 'success');

            $rootScope.$broadcast('onLibrarySaved', response);



            $scope.loadingVisible = false;
            if (!$scope.isNew)
                $scope.popup_add_visible = false;
            else
            { $scope.bookKey = $scope.generateINT(); $rootScope.$broadcast('onFolderAdd', null); }



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    };
    ////////////////////////////
    $scope.uploaderValueDocument = [];
    $scope.uploadedFileDocument = null;
    $scope.uploader_document_instance = null;
    $scope.uploader_document = {
        //uploadedMessage: 'بارگزاری شد',
        multiple: true,
        // selectButtonText: 'انتخاب تصویر',
        labelText: '',
        // accept: "image/*",
        uploadMethod: 'POST',
        uploadMode: "instantly",

        uploadUrl: $rootScope.fileHandlerUrl + '?t=clientfiles',
        onValueChanged: function (arg) {

        },
        onUploaded: function (e) {
           
             
             
            
            var id = ($scope.entity.BookFiles.length + 1) * -1;
            var item = { Id: id, Title: e.request.responseText, FileUrl: e.request.responseText, Remark: '', DocumentId: -1, BookId: $scope.entity.Id,ChapterId:$scope.selectedChapterId };
            item.SysUrl = e.file.name; //$scope.uploaderValueDocument[0].name;
            item.FileType = e.file.type;// $scope.uploaderValueDocument[0].type;
            $scope.entity.BookFiles.push(item);
            $scope.entity.BookFiles = Enumerable.From($scope.entity.BookFiles).OrderBy('$.SysUrl').ToArray();
            $scope.fillFileDs();
            console.log(e);
            console.log($scope.uploaderValueDocument);
             console.log('*******************************');
             

        },
        onContentReady: function (e) {
            if (!$scope.uploader_document_instance)
                $scope.uploader_document_instance = e.component;

        },
        bindingOptions: {
            value: 'uploaderValueDocument'
        }
    };
    ///////////////////////////
    $scope.dg_aircrafttype_columns = [
        { dataField: "Type", caption: "Type", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, width: 200, sortIndex: 0, sortOrder: "asc" },
        { dataField: "Manufacturer", caption: "Manufacturer", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, width: 200 },

        { dataField: "Remark", caption: "Remark", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, },
    ];
    $scope.dg_aircrafttype_selected = null;
    $scope.dg_aircrafttype_instance = null;
    $scope.dg_aircrafttype = {
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'multiple' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        filterRow: { visible: true, showOperationChooser: true, },
        columnAutoWidth: false,
        columns: $scope.dg_aircrafttype_columns,
        onContentReady: function (e) {
            if (!$scope.dg_aircrafttype_instance)
                $scope.dg_aircrafttype_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_aircrafttype_selected = null;
            }
            else
                $scope.dg_aircrafttype_selected = data;


        },
        bindingOptions: {

            dataSource: 'entity.BookRelatedAircraftTypes',
            height: 'dg_height',
        },
        // dataSource:ds

    };

    ///////////////////////////
    $scope.dg_group_columns = [
        { dataField: "Type", caption: "Type", allowResizing: true, alignment: "center", dataType: 'string', allowEditing: false,width:200 },
        { dataField: "Title", caption: "Title", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, },
        //{ dataField: 'FullCode', caption: 'Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, encodeHtml: false, width: 200, sortIndex: 0, sortOrder: "asc" },

    ];
    $scope.dg_group_selected = null;
    $scope.dg_group_instance = null;
    $scope.dg_group = {
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'multiple' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        filterRow: { visible: true, showOperationChooser: true, },
        columnAutoWidth: false,
        columns: $scope.dg_group_columns,
        onContentReady: function (e) {
            if (!$scope.dg_group_instance)
                $scope.dg_group_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_group_selected = null;
            }
            else
                $scope.dg_group_selected = data;


        },
        height:350,
        bindingOptions: {

            dataSource: 'entity.BookRelatedGroups',
           // height: 'dg_height',
        },
        // dataSource:ds

    };
    //////////////////////////
    $scope.dg_education_columns = [
        { dataField: "Title", caption: "Field", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, sortIndex: 0, sortOrder: "asc" },
        { dataField: "Remark", caption: "Remark", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, width: 300 },
    ];
    $scope.dg_education_selected = null;
    $scope.dg_education_instance = null;
    $scope.dg_education = {
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'multiple' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        filterRow: { visible: true, showOperationChooser: true, },
        columnAutoWidth: false,
        columns: $scope.dg_education_columns,
        onContentReady: function (e) {
            if (!$scope.dg_education_instance)
                $scope.dg_education_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_education_selected = null;
            }
            else
                $scope.dg_education_selected = data;


        },
        bindingOptions: {

            dataSource: 'entity.BookRelatedStudyFields',
            height: 'dg_height',
        },
        // dataSource:ds

    };
    //////////////////////////
    $scope.dg_employee_columns = [
        { dataField: "Name", caption: "Name", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, sortIndex: 0, sortOrder: "asc", width: 250 },
        { dataField: 'NID', caption: 'National Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'PID', caption: 'Personnel Id', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'Location', caption: 'Department', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'CaoCardNumber', caption: 'CAO No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'NDTNumber', caption: 'NDT No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'DateJoinCompany', caption: 'Join Company', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
    ];
    $scope.dg_employee_selected = null;
    $scope.dg_employee_instance = null;
    $scope.dg_employee = {
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'multiple' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        filterRow: { visible: true, showOperationChooser: true, },
        columnAutoWidth: false,
        columns: $scope.dg_employee_columns,
        onContentReady: function (e) {
            if (!$scope.dg_employee_instance)
                $scope.dg_employee_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_employee_selected = null;
            }
            else
                $scope.dg_employee_selected = data;


        },
        bindingOptions: {

            dataSource: 'entity.BookRelatedEmployees',
            height: 'dg_height',
        },
        // dataSource:ds

    };
    ///////////////////////////////
    $scope.deleteBookFile = function (bid) {
         
        General.Confirm("Are you sure?", function (res) {
            if (res) {
                libraryService.deleteBookFile({ id: bid.data.Id }).then(function (response) {
                    $scope.entity.BookFiles = Enumerable.From($scope.entity.BookFiles).Where('$.Id!=' + bid.data.Id).OrderBy('$.SysUrl').ToArray();
                    $scope.dg_file_ds = Enumerable.From($scope.dg_file_ds).Where('$.Id!=' + bid.data.Id).ToArray();
                    $scope.dg_file_instance.refresh();
                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            }
        });
    };
    $scope.dg_file_columns = [
        //{ dataField: "Remark", caption: "Remark", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: true },
        //{ dataField: "FileUrl", caption: "Uploaded", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, width: 200 },
        { dataField: "SysUrl", caption: "Title", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false,   },
      //  { dataField: "FileType", caption: "File Type", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, width: 150 },
      {
          dataField: "Id", caption: '',
          width: 70,
          allowFiltering: false,
          allowSorting: false,
          cellTemplate: 'deleteFileTemplate',

      },

    ];
    $scope.dg_file_selected = null;
    $scope.dg_file_instance = null;
    $scope.dg_file_ds = null;
    $scope.fillFileDs = function () {
        if ($scope.selectedChapterId)
            $scope.dg_file_ds = Enumerable.From($scope.entity.BookFiles).Where('$.ChapterId==' + $scope.selectedChapterId).ToArray();
        else
            $scope.dg_file_ds = Enumerable.From($scope.entity.BookFiles).Where('!$.ChapterId').ToArray();
    };
    $scope.dg_file = {
        editing: {
            mode: "row",
            allowUpdating: false,
            allowDeleting: false,
        },
        onRowRemoved: function (e) {
            
           
        },
        showRowLines: true,
        showColumnLines: true,
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
            else
                $scope.dg_file_selected = data;


        },
        bindingOptions: {

            //dataSource: 'entity.BookFiles',
            dataSource: 'dg_file_ds',
            height: 'dg_height2',
        },
        // dataSource:ds

    };
    //////////////////////////////
    $scope.sb_folder = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceFolders(),
        itemTemplate: function (data) {
            return "<div>" + data.TitleFormated + "</div>";
        },
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.FolderId',

           
        }
    };
    //////////////////////////////
    $scope.chapterId = null;
    $scope.IsEditChapter = false;
    $scope.btn_new_folder = {
        text: '',
        type: 'default',
        icon: 'plus',

        onClick: function (e) {

            $scope.chapterId = null;
            if ($scope.chapter_selected)
                $scope.chapterId = $scope.chapter_selected.Id;



            $scope.IsEditChapter = false;
            $scope.popup_chapter_visible = true;

        }

    };
    $scope.btn_edit_folder = {
        text: '',
        type: 'default',
        icon: 'edit',

        onClick: function (e) {
            //helen

            if (!$scope.chapter_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            
            $scope.chapter = $scope.chapter_selected.Title;
             $scope.chapterId = null;
             if ($scope.chapter_selected.ParentId)
                 $scope.chapterId = $scope.chapter_selected.ParentId;
             $scope.IsEditChapter = true;
             $scope.popup_chapter_visible = true;
        }

    };
    $scope.btn_delete_folder = {
        text: '',
        type: 'danger',
        icon: 'clear',

        onClick: function (e) {

            if (!$scope.chapter_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            $scope.loadingVisible = true;
            var dto = {
                Id: $scope.chapter_selected.Id,
            };
            libraryService.deleteChapter(dto).then(function (response) {
                //jook
                $scope.loadingVisible = false;


                General.ShowNotify(Config.Text_SavedOk, 'success');
                $scope.chapter_ds = Enumerable.From($scope.chapter_ds).Where('$.Id!=' + $scope.chapter_selected.Id).OrderBy('$.FullCode').ToArray();
                $scope.chapter_instance.refresh();
                $scope.chapter_selected = null;
                $scope.chapterId = null;
                $scope.selectedChapterId = null;





            }, function (err) { $scope.loadingVisible = false; $scope.popup_folder_visible = false; General.ShowNotify(err.message, 'error'); });


        }

    };
    ///////////
    $scope.selectedChapterId = null;
    $scope.sb_chapters = {
        showClearButton: true,
        searchEnabled: true,
        onSelectionChanged: function (e) {
            if (!e.selectedItem)
                $scope.chapter_instance.clearSelection();
            else
            {
                var keys = [];
                keys.push(e.selectedItem.Id);
                $scope.chapter_instance.selectRows(keys, false);
            }
            $scope.fillFileDs();
        },
        itemTemplate: function (data) {
            return "<div>" + data.TitleFormated + "</div>";
        },
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'selectedChapterId',

            dataSource: 'chapter_ds',
        }
    };
    $scope.sb_chapter_add = {
        showClearButton: true,
        searchEnabled: true,

        itemTemplate: function (data) {
            return "<div>" + data.TitleFormated + "</div>";
        },
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'chapterId',

            dataSource: 'chapter_ds',
        }
    };

    $scope.chapter = null;
    $scope.txt_chapter_title = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'chapter',
        }
    };
    /////////////////
    $scope.chapter_columns = [

       { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, encodeHtml: false },
       // { dataField: 'FullCode', caption: 'Code', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, encodeHtml: false, width: 200, sortIndex: 0, sortOrder: "asc" },
      // { dataField: 'Items', caption: 'Items', allowResizing: true, alignment: 'center', dataType: 'string', width: 100, allowEditing: false },
        { dataField: 'Files', caption: 'Files', allowResizing: true, alignment: 'center', dataType: 'string', width: 100, allowEditing: false },
    ];

    $scope.chapter_selected = null;
    $scope.chapter_instance = null;
    $scope.chapter_ds = [];// [{ Id: 1, ParentId: null, Title: 'A' }, { Id: 2, ParentId: 1, Title: 'B'}];
    $scope.expandedRow = [];
    $scope.treeSelectedKeys = [19];
    $scope.chaptertree = {
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
        dataSource: $scope.chpater_ds,
        onContentReady: function (e) {
            if (!$scope.chapter_instance)
                $scope.chapter_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.chapter_selected = null;
                $scope.selectedChapterId = null;
               
               // $scope.dg_book_ds = null;
            }
            else {
                $scope.chapter_selected = data;
                $scope.selectedChapterId = data.Id;
                
               // $scope.dg_book_ds = null;
               // $scope.$broadcast('getFilterQuery', null);
                 
            }


        },

        keyExpr: "Id",
        parentIdExpr: "ParentId",

        showBorders: true,
        columns: $scope.chapter_columns,
        headerFilter: {
            visible: true
        },
        height: $(window).height() - 280,
        // dataStructure:'tree',
        wordWrapEnabled: true,
        bindingOptions: {
            dataSource: 'chapter_ds',
            expandedRowKeys: 'expandedRow',
            selectedRowKeys: 'treeSelectedKeys',
            //height:'height_tree',
        }
    };

    /////////////////
    $scope.generateINT = function () {
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth() + 1;

        var day = d.getDate();
        var h = d.getHours();
        var min = d.getMinutes();

        var ms = d.getMilliseconds();
        var s = d.getSeconds();
        return  year.toString() + month.toString() + day.toString() + h.toString() + min.toString() + s.toString() + ms.toString();
    };
    //////////////////////
    $scope.popup_chapter_visible = false;
    $scope.popup_chapter_title = 'Chapter';
    $scope.popup_chapter = {

        fullScreen: false,
        showTitle: true,
        height: 290,
        width: 500,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    validationGroup: 'chapteradd',
                    type: 'success', text: 'Save', icon: 'check', onClick: function (e) {
                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                         
                        var dto = {
                            Id: -1,
                            ParentId: $scope.chapterId,
                            Title: $scope.chapter,
                            BookKey:$scope.bookKey,
                            //sook
                        };
                        if ($scope.IsEditChapter)
                            dto.Id = $scope.chapter_selected.Id;


                        console.log(dto);
                        
                        $scope.loadingVisible = true;
                        libraryService.saveChapter(dto).then(function (response) {
                            //jook
                            $scope.loadingVisible = false;
                            //switch ($scope._type) {
                            //    case '83':
                            //        response.Items = response.Items83;
                            //        break;
                            //    case '84':
                            //        response.Items = response.Items84;
                            //        break;
                            //    case '85':
                            //        response.Items = response.Items85;
                            //        break;
                            //    case '86':
                            //        response.Items = response.Items86;
                            //        break;
                            //    default:
                            //        break;
                            //}

                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            var tempid = $scope.chapterId;
                            if (!$scope.IsEditChapter) {


                                $scope.chapter_ds.push(response);


                                $scope.chapterId = tempid;

                                $scope.chapter = null;
                                $scope.chapter_ds = Enumerable.From($scope.chapter_ds).OrderBy('$.Fullcode').ToArray();
                                console.log($scope.chapter_ds);
                                $scope.expandedRow.push(response.Id);
                                $scope.selectedChapterId = response.Id;
                               // $scope.fillFileDs();
                            }
                            else {
                                var row = Enumerable.From($scope.chapter_ds).Where('$.Id==' + response.Id).FirstOrDefault();

                                //row = JSON.parse(JSON.stringify(response));
                                row.TitleFormated = response.TitleFormated;
                                row.Title = response.Title;
                                row.Fullcode = response.Fullcode;
                                row.ParentId = response.ParentId;
                                row.TitleFormatedSpace = response.TitleFormatedSpace;
                                row.Items = response.Items;
                                // $scope.tree_selected = JSON.parse(JSON.stringify(response));
                                $scope.chapter_ds = Enumerable.From($scope.chapter_ds).OrderBy('$.Fullcode').ToArray();
                                 
                                $scope.chapter_instance.refresh();
                                $scope.popup_chapter_visible = false;
                            }

                            // $scope.$broadcast('getFilterQuery', null);
                            // $scope.popup_folder_visible = false;




                        }, function (err) { $scope.loadingVisible = false; $scope.popup_chapter_visible = false; General.ShowNotify(err.message, 'error'); });




                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_chapter_visible = false;
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
            visible: 'popup_chapter_visible',

            title: 'popup_chapter_title',

        }
    };
    /////////////////////////////
    $scope.tempData = null;
    $scope.bookKey = null;
    $scope.$on('InitAddLibrary', function (event, prms) {


        $scope.tempData = null;

        if (!prms.Id) {

            $scope.isNew = true;
            $scope.bookKey = $scope.generateINT();
            $scope.popup_add_title = 'New';
            $scope.entity.FolderId = prms.FolderId;

        }

        else {

            $scope.popup_add_title = 'Edit';
            $scope.tempData = prms;
            $scope.isNew = false;


        }

        $scope.popup_add_visible = true;

    });
    $scope.$on('onAircraftSelectHide', function (event, prms) {

        //alert('ac');
        //   console.log(prms);
        //CourseRelatedAircraftType
        if (!prms || prms.length == 0)
            return;
        $.each(prms, function (_i, _d) {
            var exist = Enumerable.From($scope.entity.BookRelatedAircraftTypes).Where("$.Id==" + _d.Id).FirstOrDefault();
            if (!exist) {
                $scope.entity.BookRelatedAircraftTypes.push(_d);
            }
        });
        $scope.dg_aircrafttype_instance.refresh();
    });
    $scope.removeGroup = function () {
        var dg_selected = $rootScope.getSelectedRow($scope.dg_group_instance);
        if (!dg_selected) {
            General.ShowNotify(Config.Text_NoRowSelected, 'error');
            return;
        }
        $scope.entity.BookRelatedGroups = Enumerable.From($scope.entity.BookRelatedGroups).Where('$.Id!=' + dg_selected.Id).ToArray();


    };
    $scope.addGroup = function () {
        $rootScope.$broadcast('InitJobGroupSelect', null);
    };
    $scope.$on('onJobGroupSelectHide', function (event, prms) {

        //  alert('ac');
        //  console.log(prms);
        //CourseRelatedAircraftType
        if (!prms || prms.length == 0)
            return;
        $.each(prms, function (_i, _d) {
            var exist = Enumerable.From($scope.entity.BookRelatedGroups).Where("$.Id==" + _d.Id + " && $.TypeId==" + _d.TypeId).FirstOrDefault();
            if (!exist) {
                $scope.entity.BookRelatedGroups.push(_d);
            }
        });
        $scope.dg_group_instance.refresh();
    });
    $scope.$on('onStudyFieldSelectHide', function (event, prms) {

        //  alert('ac');
        //  console.log(prms);
        //CourseRelatedAircraftType
        if (!prms || prms.length == 0)
            return;
        $.each(prms, function (_i, _d) {
            var exist = Enumerable.From($scope.entity.BookRelatedStudyFields).Where("$.Id==" + _d.Id).FirstOrDefault();
            if (!exist) {
                $scope.entity.BookRelatedStudyFields.push(_d);
            }
        });
        $scope.dg_education_instance.refresh();
    });
    $scope.$on('onEmployeeSelectHide', function (event, prms) {

        //  alert('ac');
        //  console.log(prms);
        //CourseRelatedAircraftType
        if (!prms || prms.length == 0)
            return;
        $.each(prms, function (_i, _d) {
            var exist = Enumerable.From($scope.entity.BookRelatedEmployees).Where("$.Id==" + _d.Id).FirstOrDefault();
            if (!exist) {
                $scope.entity.BookRelatedEmployees.push(_d);
            }
        });
        $scope.dg_employee_instance.refresh();
    });
    //////////////////////////////

}]);  