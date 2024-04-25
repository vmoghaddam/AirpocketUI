'use strict';
app.controller('qaReferController', ['$scope', '$location', 'qaService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', 'qahService',function ($scope, $location, qaService, authService, $routeParams, $rootScope, $window, $sce,qahService) {



    $scope.commentEntity = {};
    $scope.feedbackEntity = {};

    $scope.files = [];

    $scope.selectedTabIndex = -1;
    $scope.selectedTabId = null;
    $scope.popupselectedTabIndex = -1;
    $scope.popupselectedTabId = null;
    $scope.tabs = [
        { text: "Description", id: 'comment' },
        { text: "Attachment", id: 'attachment' },
    ];


    $scope.$watch("selectedTabIndex", function (newValue) {
        //ati
        try {
            $('.tabs').hide();
            var id = $scope.tabs[newValue].id;
            $scope.selectedTabId = id;
            $('#' + id).fadeIn();

            switch (id) {
                case 'comment':

                    break;

                case 'attachment':

                    break;


                default:
                    break;
            }
            if ($scope.dg_comment_instance)
                $scope.dg_comment_instance.refresh();
            if ($scope.dg_attachment_instance)
                $scope.dg_attachment_instance.refresh();

        }
        catch (e) {

        }


    });


    $scope.tabs_options = {
        scrollByContent: true,
        showNavButtons: true,


        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        onItemRendered: function (e) {
            $scope.selectedTabIndex = -1;
            $scope.selectedTabIndex = 0;
        },
        bindingOptions: {
            //visible: 'tabsdatevisible',
            dataSource: { dataPath: "tabs", deep: true },
            selectedIndex: 'selectedTabIndex'
        }

    };



    $scope.isFullScreen = false
    $scope.popup_comment_visible = false;
    $scope.popup_height = 500;
    $scope.popup_width = 680;
    $scope.popup_comment_title = 'Comment';
    $scope.popup_instance = null;

    $scope.popup_comment = {


        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'catering', onClick: function (e) {
                        $scope.commentEntity.files = $scope.files;
                        qaService.sendComment($scope.commentEntity).then(function (res) {
                            if (res.IsSuccess == true) {
                                $scope.loadingVisible = false;
                                $scope.popup_comment_visible = false;
                            }

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_comment_visible = false;
                    }
                }, toolbar: 'bottom'
            }

        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            $scope.popup_instance.repaint();


        },
        onShown: function (e) {



        },
        onHiding: function () {
            $scope.files = [];
            $scope.commentEntity.Comment = null;
            $scope.bind();
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        bindingOptions: {
            visible: 'popup_comment_visible',
            fullScreen: 'isFullScreen',
            title: 'popup_comment_title',
            height: 'popup_height',
            width: 'popup_width',
            //'toolbarItems[0].visible': 'isEditable',
            //'toolbarItems[2].visible': 'isEditable',

        }
    };

    $scope.btn_comment = {
        text: 'Add Evidence',
        type: 'default',
        width: '100%',
        onClick: function (e) {
            $scope.popup_comment_visible = true;
        }
    }




    $scope.isFullScreen = false
    $scope.popup_feedback_visible = false;
    $scope.popup_height = 500;
    $scope.popup_width = 680;
    $scope.popup_feedback_title = 'feedback';
    $scope.popup_instance = null;

    $scope.popup_feedback = {


        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'catering', onClick: function (e) {
                        $scope.feedbackEntity.TypeId=2;   
						$scope.feedbackEntity.CreatorId=$rootScope.employeeId;
                        qaService.saveFeedBack($scope.feedbackEntity).then(function (res) {
                            if (res.IsSuccess == true) {
                                $scope.loadingVisible = false;
                                $scope.popup_feedback_visible = false;
                                $scope.bind();
                            }

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_feedback_visible = false;
                    }
                }, toolbar: 'bottom'
            }

        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            $scope.popup_instance.repaint();


        },
        onShown: function (e) {



        },
        onHiding: function () {
            //$scope.files = [];
            //$scope.feedbackEntity.feedback = null;
            //$scope.bind();
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        bindingOptions: {
            visible: 'popup_feedback_visible',
            fullScreen: 'isFullScreen',
            title: 'popup_feedback_title',
            height: 'popup_height',
            width: 'popup_width',
            //'toolbarItems[0].visible': 'isEditable',
            //'toolbarItems[2].visible': 'isEditable',

        }
    };


    $scope.btn_feedback = {
        text: 'Add Feedback',
        type: 'default',
        width: '100%',
        onClick: function (e) {
            $scope.popup_feedback_visible = true;

        }
    }

    $scope.uploaderValueDocument = [];
    $scope.fileList = [];
    $scope.fileNames = [];
    $scope.fileCount = 0
    var id = -1;
    $scope.uploader_document_instance = null;
    $scope.uploader_document = {
        multiple: true,
        labelText: '',
        selectButtonText: 'Select Files',
        uploadMethod: 'POST',
        uploadMode: "instantly",

        uploadUrl: apiQA + 'api/qa/uploadfile?t=clientfiles',



        onUploadStarted: function (res) {
            $scope.loadingVisible = true;
            $scope.fileList.push(res.file);
            $scope.fileCount = $scope.fileList.length;
            $scope.loadingVisible = true;
        },



        onUploaded: function (e) {
            $scope.loadingVisible = false;
            $.each(e, function (_i, _d) {
                $scope.files.push({ Id: id = id + 1, AttachmentId: -1, FileName: _d.name, FileType: _d.type });
            });

        },

        bindingOptions: {
            value: 'uploaderValueDocument'
        }
    };


    $scope.dg_attachment_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },


        { dataField: 'FileName', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'number', allowEditing: false, minWidth: 150 },
        {
            dataField: "Id",
            caption: '',
            width: 100,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'downloadTemplate',
            name: 'downloadFile',
            fixed: true,
            fixedPosition: 'right',
        },

        {
            dataField: "Id",
            caption: '',
            width: 100,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'deleteTemplate',
            name: 'deleteFile',
            fixed: true,
            fixedPosition: 'right',
        },



    ];
    $scope.dg_attachment_selected = null;
    $scope.dg_attachment_instance = null;
    $rootScope.dg_attachment_ds = null;
    $scope.dg_attachment = {
        wordWrapEnabled: true,
        rowAlternationEnabled: false,
        headerFilter: {
            visible: false
        },
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
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: true,
        height: $scope.popup_height - 200,
        width: "100%",
        columns: $scope.dg_attachment_columns,
        onContentReady: function (e) {
            if (!$scope.dg_attachment_instance)
                $scope.dg_attachment_instance = e.component;

        },



        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];
            if (!data) {
                $scope.dg_attachment_selected = null;
            }
            else
                $scope.dg_attachment_selected = data;


        },




        bindingOptions: {
            dataSource: 'files'
        },
        columnChooser: {
            enabled: false
        },

    };



    $scope.deleteFile = function (f) {

        console.log(f);

        if (f.Id != -1) {
            $.each($scope.files, function (_i, _d) {
                if (_d.Id == f.Id)
                    $scope.attachment = _d;
            });
        } else {
            $.each($scope.files, function (_i, _d) {
                if (_d.AttachmentId == f.AttachmentId)
                    $scope.attachment = _d;
            });
        }



        qaService.deleteAttachment($scope.attachment).then(function (response) {
            if (f.Id != -1) {
                $scope.files = Enumerable.From($scope.files).Where(function (x) {
                    return x.Id != f.Id;
                }).ToArray();
            } else {
                $scope.files = Enumerable.From($scope.files).Where(function (x) {
                    return x.AttachmentId != f.AttachmentId;
                }).ToArray();
            }
        });
    }



    $scope.download = function (fileName) {
        $scope.loadingVisible = true;
        var filename = fileName.split(".");
        qaService.downloadQa(filename[0], filename[1]).then(function (response) {
            $scope.loadingVisible = false;
        });
    }



    $scope.bind = function () {
        qaService.getReferredList($scope.commentEntity.EmployeeId, $scope.commentEntity.Type, $scope.commentEntity.Id).then(function (response) {
            $rootScope.referred_list_ds = response.Data;
            $scope.expandedRow = Enumerable.From(response.Data).Select('$.Id').ToArray();
        });

        qaService.getComments($scope.commentEntity.Id, $scope.commentEntity.Type).then(function (response) {
            $scope.comments = response.Data;
        });

        qaService.getImportedFile($scope.commentEntity.Id, $scope.commentEntity.ProducerId, $scope.commentEntity.Type).then(function (response) {
            $rootScope.dg_attachments_ds = response.Data;
			$scope.files = response.Data;
        });

        qaService.getFeedBack($scope.commentEntity.Id, $scope.commentEntity.Type).then(function (response) {
            $scope.FeedBacks = response.Data;
			console.log($scope.FeedBacks);
        });
    };




    $scope.scroll_comment_height = $(window).height() - 200;
    $scope.scroll_comment = {
        bounceEnabled: false,
        showScrollbar: 'never',
        pulledDownText: '',
        pullingDownText: '',
        useNative: true,
        refreshingText: 'Updating...',
        onPullDown: function (options) {

            options.component.release();

        },
        onInitialized: function (e) {


        },
        bindingOptions: {
            height: 'scroll_comment_height'
        }

    };


    $scope.scroll_feedback_height = $(window).height() - 200;
    $scope.scroll_feedback = {
        bounceEnabled: false,
        showScrollbar: 'never',
        pulledDownText: '',
        pullingDownText: '',
        useNative: true,
        refreshingText: 'Updating...',
        onPullDown: function (options) {

            options.component.release();

        },
        onInitialized: function (e) {


        },
        bindingOptions: {
            height: 'scroll_feedback_height'
        }

    };



    $scope.btn_send = {
        type: 'success',
        icon: 'add',

        bindingOptions: {},
        onClick: function (e) {

            qaService.sendComment($scope.commentEntity).then(function (response) {
                qaService.getComments($scope.commentEntity.Id, $scope.commentEntity.Type).then(function (response) {
                    $rootScope.dg_comment_ds = response.Data;
                });
            });
        }

    };

$scope.txt_priority = {
        readOnly: true,
        focusStateEnabled: false,
         
        bindingOptions: {
            value: 'ref_priority'
        }
    }
	
	$scope.txt_deadline = {
        readOnly: true,
        focusStateEnabled: false,
         
        bindingOptions: {
            value: 'ref_deadline'
        }
    }
	
    $scope.txt_referComment = {
        readOnly: true,
        focusStateEnabled: false,
        height: 90,
        bindingOptions: {
            value: 'commentEntity.referComment'
        }
    }

    $scope.txt_comment = {
        height: $scope.popup_height - 140,
        bindingOptions: {
            value: 'commentEntity.Comment'
        }
    }


    $scope.txt_feedback = {
        height: $scope.popup_height - 100,
        bindingOptions: {
            value: 'feedbackEntity.Feedback'
        }
    }

    //$scope.btn_dltFeedback = {
    //    type: 'danger',
    //    text: '',
    //    icon: 'remove',
      
    //};

    $scope.dltFeedback = function (id) {
        General.Confirm(Config.Text_DeleteConfirm, function (res) {
            qaService.dltFeedBack(id).then(function (response) {
                console.log(response);
                $scope.bind();
            });
        });
    }

    $scope.dg_comment_columns = [


        /*{
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
*/


        { dataField: 'DateComment', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', format: 'yyyy-MM-dd', allowEditing: false, width: 120, },

        { dataField: 'name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'number', allowEditing: false, width: 250, fixed: true, fixedPosition: 'left' },
        { dataField: 'Comment', caption: 'Comment', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 400 },







    ];
    $scope.dg_comment_selected = null;
    $rootScope.dg_comment_instance = null;
    $rootScope.dg_comment_ds = null;
    $scope.dg_comment = {



        wordWrapEnabled: true,
        rowAlternationEnabled: false,
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

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: $(window).height() - 250,
        columns: $scope.dg_comment_columns,
        onContentReady: function (e) {
            if (!$rootScope.dg_comment_instance)
                $rootScope.dg_comment_instance = e.component;

        },

        onRowClick: function (e) {

        },

        onRowPrepared: function (e) {
        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];


            if (!data) {
                $scope.dg_comment_selected = null;
            }
            else
                $scope.dg_comment_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_comment_ds'
        },
        columnChooser: {
            enabled: false
        },

    };





    $scope.referred_list_columns = [
        { dataField: 'ReferredName', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: true, fixedPosition: 'left', minWidth: 300 },
		 { dataField: 'Comment', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300 },
       { dataField: 'Priority', caption: 'Priority', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },		
		{ dataField: 'DeadLine', caption: 'Deadline', allowResizing: true, alignment: 'center', dataType: 'date',format: 'yyyy-MM-dd', allowEditing: false, width: 150 },
		
        { dataField: 'ReviewResultTitle', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'DateStatus', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date',format: 'yyyy-MM-dd', allowEditing: false, width: 150 },
        //{ dataField: 'Comment', caption: 'Note', allowResizing: true, alignment: 'left', dataType: 'date', allowEditing: false, width: 300 },
    ];

    $scope.tree_height = $(window).height() - 388;
    $scope.referred_list = {
        keyExpr: 'Id',
        parentIdExpr: 'ParentId',
        columns: $scope.referred_list_columns,
        noDataText: '',
        selection: { mode: 'single' },
		showColumnLines:true,
		wordWrapEnabled:true,
        columnAutoWidth: false,
        autoExpandAll: 'true',

        onContentReady: function (e) {
            if (!$scope.referred_list_instance)
                $rootScope.referred_list_instance = e.component;
        },

        onRowClick: function (e) {
            $scope.commentEntity.referComment = e.data.Comment;
			$scope.ref_priority=e.data.Priority;
			$scope.ref_deadline= e.data.DeadLine ? moment(new Date(e.data.DeadLine)).format("YYYY-MM-DD")  :'';
			//console.log();
        },

        bindingOptions: {
            dataSource: 'referred_list_ds',
            height: 'tree_height',
            expandedRowKeys: 'expandedRow',

        }
    }


    $scope.ht_click = function ($event, id) {

        $('.ht').removeClass('selected');
        $($event.currentTarget).addClass('selected');
        $('.ht_content').hide();
        $('#' + id).fadeIn();
		 $scope.dg_consequences_instance.refresh();

    }


    //////2024-01-15 
	////REGISTER
	$scope.scroll_register_height = $(window).height() - 200;
    $scope.scroll_register = {
        bounceEnabled: false,
        showScrollbar: 'never',
        pulledDownText: '',
        pullingDownText: '',
        useNative: true,
        refreshingText: 'Updating...',
        onPullDown: function (options) {

            options.component.release();

        },
        onInitialized: function (e) {


        },
        bindingOptions: {
            height: 'scroll_register_height'
        }

    };
	$scope._date_identification=null;
	$scope.date_identification = {
        type: "date",
        placeholder: '',
        width: '100%',
        displayFormat: "yyyy-MM-dd",
        bindingOptions: {
            value: '_date_identification',

        }
    };
	
	
	$scope._date_responsible_manager=null;
	$scope.date_responsible_manager = {
        type: "date",
        placeholder: '',
        width: '100%',
        displayFormat: "yyyy-MM-dd",
        bindingOptions: {
            value: 'register.initial_responsible_sign',

        }
    };
	
	$scope._date_qa_approval=null;
	$scope.date_qa_approval = {
        type: "date",
        placeholder: '',
        width: '100%',
        displayFormat: "yyyy-MM-dd",
        bindingOptions: {
            value: 'register.initial_qa_sign',

        }
    };
	
	$scope._date_review=null;
	$scope.date_review = {
        type: "date",
        placeholder: '',
        width: '100%',
        displayFormat: "yyyy-MM-dd",
        bindingOptions: {
            value: 'register.final_date',

        }
    };
	
	
	
	$scope._txt_source=null;
	$scope.txt_source = {
        
        bindingOptions: {
            value: '_txt_source',


        }
    };
	
	$scope._txt_scope=null;
	$scope.txt_scope = {
        
        bindingOptions: {
            value: 'register.id_department',


        }
    };
	
	$scope._txt_index=null;
	$scope.txt_index = {
        
        bindingOptions: {
            value: 'register.initial_index',


        }
    };
	
	$scope._txt_index2=null;
	$scope.txt_index2 = {
        
        bindingOptions: {
            value: 'register.final_index',


        }
    };
	
	$scope._txt_qa_approval=null;
	$scope.txt_qa_approval = {
        
        bindingOptions: {
            value: '_txt_qa_approval',


        }
    };
	
	$scope._txt_hazard=null;
	$scope.txt_hazard = {
        bindingOptions: {
            value: 'register.id_hazard_description',
            height: '60',
             
        }
    };
	
	$scope._check_relevant=false;
	$scope.check_relevant = {
        
        text: "Relevant Previously Reported Incident Data",

        bindingOptions: {
            value: 'register.has_relevant',
        }
    };
	
	
	$scope._sb_severity=null;
	$scope.sb_severity = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: ['A','B','C','D','E'],
		 onValueChanged:function(){
			 $scope.register.initial_index=null;
             if ($scope.register.initial_severity_level && $scope.register.initial_prob_level){
				$scope.register.initial_index=$scope.register.initial_prob_level+$scope.register.initial_severity_level;
			}
		 },
		
        bindingOptions: {
            value: 'register.initial_severity_level',
            
        }
    };
	
	
	
	$scope._sb_severity2=null;
	$scope.sb_severity2 = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: ['A','B','C','D','E'],
        onValueChanged:function(){
			
			 $scope.register.final_index=null;
             if ($scope.register.final_severity_level && $scope.register.final_prob_level){
				$scope.register.final_index=$scope.register.final_prob_level+$scope.register.final_severity_level;
			}
		},
        bindingOptions: {
            value: 'register.final_severity_level',
            
        }
    };
	
	
	
	$scope._sb_prob=null;
	$scope.sb_prob = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: [1,2,3,4,5],
         onValueChanged:function(){
			 $scope.register.initial_index=null;
             if ($scope.register.initial_severity_level && $scope.register.initial_prob_level){
				$scope.register.initial_index=$scope.register.initial_prob_level+$scope.register.initial_severity_level;
			}
		 },
        bindingOptions: {
            value: 'register.initial_prob_level',
            
        }
    };
	
	
	$scope._sb_prob2=null;
	$scope.sb_prob2 = {
        showClearButton: true,
        searchEnabled: true,
         dataSource: [1,2,3,4,5],
         onValueChanged:function(){
			
			 $scope.register.final_index=null;
             if ($scope.register.final_severity_level && $scope.register.final_prob_level){
				$scope.register.final_index=$scope.register.final_prob_level+$scope.register.final_severity_level;
			}
		},
        bindingOptions: {
            value: 'register.final_prob_level',
            
        }
    };
	
	 
	
	
	$scope._sb_risk_type=null;
	$scope.sb_risk_type = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: ['Tolerable and Acceptable','Intolerable'],
        
        bindingOptions: {
            value: 'register.initial_acceptability',
            
        }
    };
	
	
	$scope._sb_description=null;
	$scope.sb_description = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: ['Control action is required','No control action is required','Urgent control action is','Stop operations'],
        
        bindingOptions: {
            value: 'register.initital_description',
            
        }
    };
	
	
	$scope._sb_responsible_manager=null;
	$scope.sb_responsible_manager = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: ['Operations','E & M','Safety & Compliance Monitoring','Ground Operations','Dispatch','Security','Training','Catering'],
        
        bindingOptions: {
            value: 'register.initial_responsible_manager',
            
        }
    };
	
	
	$scope._sb_accept=null;
	$scope.sb_accept = {
        showClearButton: true,
        searchEnabled: true,
         dataSource: ['Tolerable and Acceptable','Intolerable'],
        
        bindingOptions: {
            value: 'register.final_acceptability',
            
        }
    };
	
	
	 
	$scope.dg_consequences_selected = null;
    $scope.dg_consequences_instance = null;
    $scope.dg_consequences_ds = [];
    $scope.dg_consequences = {
        headerFilter: {
            visible: false
        },
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
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
       
        height: 150, 

        columns: [
		      { dataField: 'title', caption: 'Hazard Consequence', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,},
			/*  {
            dataField: "id",
            caption: '',
            width: 80,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'temp_con',
            name: 'delete_con',
            fixed: false,
            fixedPosition: 'right',
            },*/
			  
		],
        onContentReady: function (e) {
            if (!$scope.dg_consequences_instance)
                $scope.dg_consequences_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_consequences_selected = null;

            }
            else {
                $scope.dg_consequences_selected = data;

            }
        },
        onRowPrepared: function (e) {
           // if (e.data && e.data.IsPositioning)
            //    e.rowElement.css('background', '#ffccff');

        },

        bindingOptions: {
            dataSource: 'dg_consequences_ds',

        }
    };
	$scope._txt_con=null;
	$scope.txt_con = {
        
        bindingOptions: {
            value: '_txt_con',


        }
    };
	$scope.btn_add_con={
        text: '',
        type: 'default',
        icon: 'plus',
        width: '20',
        
        onClick: function (e) {
            
               if (!$scope._txt_con)
				return;
			 
            var _id=-1*($scope.dg_consequences_ds.length+1);
			$scope.dg_consequences_ds.push({id:_id,title:$scope._txt_con});
			$scope._txt_con=null;

        }

    };
	$scope.btn_remove_con={
        text: '',
        type: 'danger',
        icon: 'close',
        width: '20',
        
        onClick: function (e) {
             
			

        }

    };
	$scope.remove_dummy=function(ds){
		
		ds=Enumerable.From(ds).Where('!$.dummy').ToArray();
		return ds;
	};
	$scope.dg_action_taken_selected = null;
    $scope.dg_action_taken_instance = null;
    $scope.dg_action_taken_ds = [];
    $scope.dg_action_taken = {
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: false,
            showOperationChooser: true,
        },
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'none' },

        noDataText: '',
        width:function(){ return $(window).width()*0.37;},
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
       
        height: 150, 

        columns: [
		   { dataField: 'action', caption: 'Action Taken', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,minWidth:300 },
		   { dataField: 'responsible_staff', caption: 'Responsible', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,width:150 },
		   { dataField: 'time_limit_remark', caption: 'Time Limit', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,width:150 },
		   
		   { dataField: 'date', caption: 'Date', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,width:120,format: 'yyyy-MMM-dd' },
		   { dataField: 'qa_approval_date', caption: 'QA App.', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,width:120,format: 'yyyy-MMM-dd' },
		   /*{
            dataField: "id",
            caption: '',
            width: 60,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'temp_action',
            name: 'delete_action',
            fixed: true,
            fixedPosition: 'right',
        },*/
		   
		   
		],
        onContentReady: function (e) {
            if (!$scope.dg_action_taken_instance)
                $scope.dg_action_taken_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_action_taken_selected = null;

            }
            else {
                $scope.dg_action_taken_selected = data;

            }
        },
        onRowPrepared: function (e) {
           // if (e.data && e.data.IsPositioning)
            //    e.rowElement.css('background', '#ffccff');

        },

        bindingOptions: {
            dataSource: 'dg_action_taken_ds',

        }
    };
	$scope._txt_action=null;
	$scope.txt_action = {
        
        bindingOptions: {
            value: '_txt_action',


        }
    };
	$scope._txt_action_staff=null;
	$scope.txt_action_staff = {
        
        bindingOptions: {
            value: '_txt_action_staff',


        }
    };
	
	$scope._txt_action_time_limit=null;
	$scope.txt_action_time_limit = {
        
        bindingOptions: {
            value: '_txt_action_time_limit',


        }
    };
	$scope._date_action_qa_approval=null;
	$scope.date_action_qa_approval = {
        type: "date",
        placeholder: '',
        width: '100%',
        displayFormat: "yyyy-MM-dd",
        bindingOptions: {
            value: '_date_action_qa_approval',

        }
    };
	
	$scope._date_action_staff=null;
	$scope.date_action_staff = {
        type: "date",
        placeholder: '',
        width: '100%',
        displayFormat: "yyyy-MM-dd",
        bindingOptions: {
            value: '_date_action_staff',

        }
    };
	
	$scope.btn_add_action={
        text: '',
        type: 'default',
        icon: 'plus',
        width: '20',
        
        onClick: function (e) {
             if (!$scope._txt_action)
				return;
			
            var _id=-1*($scope.dg_action_taken_ds.length+1);
			$scope.dg_action_taken_ds.push({
				id:_id,
				action:$scope._txt_action,
				responsible_staff:$scope._txt_action_staff,
				time_limit_remark:$scope._txt_action_time_limit,
				qa_approval_date:$scope._date_action_qa_approval,
				date:$scope._date_action_staff,
			});
			 
            $scope._txt_action=null;
			//setTimeout(function(){alert('x');$scope.dg_action_taken_instance.refresh();}, 500);

        }

    };
	$scope.btn_remove_action={
        text: '',
        type: 'danger',
        icon: 'close',
        width: '20',
        
        onClick: function (e) {
             
			

        }

    };
	
	$scope.dg_monitoring_selected = null;
    $scope.dg_monitoring_instance = null;
    $scope.dg_monitoring_ds = [];
    $scope.dg_monitoring = {
        headerFilter: {
            visible: false
        },
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
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
       
        height: 120, 

         columns: [
		   
		   { dataField: 'date_last_updated', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yyyy-MMM-dd' },
		   { dataField: 'cpmment', caption: 'Comment', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
		   /*{
            dataField: "id",
            caption: '',
            width: 60,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'temp_monitor',
            name: 'delete_monitor',
            fixed: true,
            fixedPosition: 'right',
        },*/
		],
        onContentReady: function (e) {
            if (!$scope.dg_monitoring_instance)
                $scope.dg_monitoring_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_monitoring_selected = null;

            }
            else {
                $scope.dg_monitoring_selected = data;

            }
        },
        onRowPrepared: function (e) {
           // if (e.data && e.data.IsPositioning)
            //    e.rowElement.css('background', '#ffccff');

        },

        bindingOptions: {
            dataSource: 'dg_monitoring_ds',

        }
    };
	$scope._txt_monitor=null;
	$scope.txt_monitor = {
        
        bindingOptions: {
            value: '_txt_monitor',


        }
    };
	$scope._date_last_updated=null;
	$scope.date_last_updated = {
        type: "date",
        placeholder: '',
        width: '100%',
        displayFormat: "yyyy-MM-dd",
        bindingOptions: {
            value: '_date_last_updated',

        }
    };
	$scope.btn_add_monitor={
        text: '',
        type: 'default',
        icon: 'plus',
        width: '20',
        
        onClick: function (e) {
             if (!$scope._txt_monitor)
				return;
			
            var _id=-1*($scope.dg_monitoring_ds.length+1);
			$scope.dg_monitoring_ds.push({id:_id,cpmment:$scope._txt_monitor,date_last_updated:$scope._date_last_updated});
            $scope._txt_monitor=null;
			$scope._date_last_updated=null;

        }

    };
	$scope.btn_remove_monitor={
        text: '',
        type: 'danger',
        icon: 'close',
        width: '20',
        
        onClick: function (e) {
             
			

        }

    };
	
	$scope.dg_root_cause_selected = null;
    $scope.dg_root_cause_instance = null;
    $scope.dg_root_cause_ds = [];
    $scope.dg_root_cause = {
        headerFilter: {
            visible: false
        },
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
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
       
        height: 120, 

        columns: [
		 { dataField: 'root_cause', caption: 'Root Cause', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
		 /*{
            dataField: "id",
            caption: '',
            width: 60,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'temp_root',
            name: 'delete_root',
            fixed: true,
            fixedPosition: 'right',
        },*/
		],
        onContentReady: function (e) {
            if (!$scope.dg_root_cause_instance)
                $scope.dg_root_cause_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_root_cause_selected = null;

            }
            else {
                $scope.dg_root_cause_selected = data;

            }
        },
        onRowPrepared: function (e) {
           // if (e.data && e.data.IsPositioning)
            //    e.rowElement.css('background', '#ffccff');

        },

        bindingOptions: {
            dataSource: 'dg_root_cause_ds',

        }
    };
	$scope._txt_root=null;
	$scope.txt_root = {
        
        bindingOptions: {
            value: '_txt_root',


        }
    };
	$scope.btn_add_root={
        text: '',
        type: 'default',
        icon: 'plus',
        width: '20',
        
        onClick: function (e) {
            if (!$scope._txt_root)
				return;
			
            var _id=-1*($scope.dg_root_cause_ds.length+1);
			$scope.dg_root_cause_ds.push({id:_id,root_cause:$scope._txt_root});
			$scope._txt_root=null;

        }

    };
	$scope.btn_remove_root={
        text: '',
        type: 'danger',
        icon: 'close',
        width: '20',
        
        onClick: function (e) {
             
			

        }

    };
	 $scope.register={
		 id:-1,
	     form_type:$scope.tempData.Type,
	     form_id:$scope.tempData.Id,
         id_date:null,
		 id_department:null,
		 id_risk_register_number:null,
	     id_hazard_description:null,
		 
		 initial_prob_level:null,
	     initial_severity_level:null,
	      initial_index:null,
		final_prob_level:null,
		final_severity_level:null,
		final_index:null,
		approval_relevant_department:null,
		approval_relevant_department_id:null,
		approval_relevant_department_date:null,
		approval_qa:null,
		approval_qa_id:null,
		approval_qa_date:null,
		
		initial_acceptability:null,
		initital_description:null,
		initial_responsible_manager:null,
		initial_responsible_sign:null,
		initial_qa_approval:null,
		initial_qa_sign:null,
		final_acceptability:null,
		final_date:null,
		
 
		remark:null,
		id_source:null,
		has_relevant:null,
		consequences:[],
		actions:[],
		monitors:[],
		
		root_causes:[],
	 };
	 $scope.btn_save_register = {
        text: 'SAVE',
        //hint: 'Airport Weekly Report',
        type: 'default',
        //icon: 'fas fa-print',
        width: '120',

        onClick: function (e) {
            //2024-01-16
			$scope.register.actions=$scope.dg_action_taken_ds;
			$scope.register.monitors=$scope.dg_monitoring_ds;
			$scope.register.consequences=$scope.dg_consequences_ds;
			$scope.register.root_causes=$scope.dg_root_cause_ds;
			console.log($scope.register);
			$scope.loadingVisible = true;
			qahService.saveRegister($scope.register).then(function (res) {
                             
                                $scope.loadingVisible = false;
								$scope.register.id=res;
                                
                            

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
		/*	var acc=[];
		acc.push(
		{
			id:-1,
	 
			risk_type:$scope._sb_risk_type,
			is_control_action:$scope._sb_description=='Control action is required',
			is_no_control_action:$scope._sb_description=='No control action is required',
			is_urgent_control_action:$scope._sb_description=='Urgent control action is',
			is_stop_operation:$scope._sb_description=='Stop operations',
			responsible_manager:$scope._sb_responsible_manager,
			responsible_manager_id:null,
			responsible_manager_date:null,
			responsible_manager_qa_date:null,
			responsible_manager_qa_id:null,
			level_id:1,
			level_remark:null,
		},
		{
			id:-2,
	 
			risk_type:$scope._sb_accept,
			is_control_action:null,
			is_no_control_action:null,
			is_urgent_control_action:null,
			is_stop_operation:null,
			responsible_manager:null,
			responsible_manager_id:null,
			responsible_manager_date:null,
			responsible_manager_qa_date:null,
			responsible_manager_qa_id:null,
			level_id:2,
			level_remark:null,
		}
		);*/
		
		
		
		
		
		
		
		
		// end of click
        }

    };
	$scope.bind_register=function(){
		
		qahService.getRegister($scope.tempData.Id,$scope.tempData.Type).then(function (res) {
                             
                                $scope.loadingVisible = false;
								//$scope.register.id=res;
								console.log('bound',res);
		
								 $scope.register.id= res.id;
	     $scope.register.form_type= res.form_type;
	     $scope.register.form_id= res.form_id;
         $scope.register.id_date= res.id_date;
		 $scope.register.id_department= res.id_department;
		 $scope.register.id_risk_register_number= res.id_risk_register_number;
	     $scope.register.id_hazard_description= res.id_hazard_description;
		 
		 $scope.register.initial_prob_level= res.initial_prob_level;
	     $scope.register.initial_severity_level= res.initial_severity_level;
	      //$scope.register.initial_index= res.initial_index;
		$scope.register.final_prob_level= res.final_prob_level;
		$scope.register.final_severity_level= res.final_severity_level;
		//$scope.register.final_index= res.final_index;
		$scope.register.approval_relevant_department= res.approval_relevant_department;
		$scope.register.approval_relevant_department_id= res.approval_relevant_department_id;
		$scope.register.approval_relevant_department_date= res.approval_relevant_department_date;
		$scope.register.approval_qa= res.approval_qa;
		$scope.register.approval_qa_id= res.approval_qa_id;
		$scope.register.approval_qa_date= res.approval_qa_date;
		
		$scope.register.initial_acceptability= res.initial_acceptability;
		$scope.register.initital_description= res.initital_description;
		$scope.register.initial_responsible_manager= res.initial_responsible_manager;
		$scope.register.initial_responsible_sign= res.initial_responsible_sign;
		$scope.register.initial_qa_approval= res.initial_qa_approval;
		$scope.register.initial_qa_sign= res.initial_qa_sign;
		$scope.register.final_acceptability= res.final_acceptability;
		$scope.register.final_date= res.final_date;
		$scope.register.remark= res.remark;
		$scope.register.id_source= res.id_source;
		
		$scope.register.consequences= res.consequences;
		$scope.dg_consequences_ds=res.consequences;
		
		$scope.register.actions= res.actions;
		$scope.dg_action_taken_ds=res.actions;
		
		$scope.register.monitors= res.monitors;
		$scope.dg_monitoring_ds=res.monitors;
		
		$scope.register.root_causes= res.root_causes;
		$scope.dg_root_cause_ds=res.root_causes;
		
 
		
                                
                            

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
		 
		
		
	};
	$scope.get_register_style=function(){
		
		return {
			
		  height:$(window).height()-200
		};
	};
	////////////////////////////


    $scope.$on('InitTest', function (event, prms) {

		console.log(prms);

        $scope.tempData = prms;
        $scope.commentEntity.Id = $scope.tempData.Id;
        $scope.commentEntity.Type = parseInt($scope.tempData.Type);
        $scope.commentEntity.ProducerId = $scope.tempData.ProducerId;
        $scope.commentEntity.EmployeeId = $scope.tempData.EmployeeId;
        $scope.feedbackEntity.EntityId = $scope.tempData.Id;
        $scope.feedbackEntity.Type = parseInt($scope.tempData.Type);
        $scope.feedbackEntity.ProducerId = parseInt($scope.tempData.ProducerId);
        $scope.feedbackEntity.EmployeeId = $scope.tempData.EmployeeId;
        $rootScope.isNotDetermined = $scope.tempData.isNotDetermined;

        $scope.bind();
		$scope.bind_register();
    });

    var appWindow = angular.element($window);
    appWindow.bind('resize', function () {
        $scope.tree_height = $(window).height() - 288;
		
    });
    $scope.$on('$viewContentLoaded', function () {
		//alert($('#register').width());
	});
	
	//alert($('#register').width());

}]);


