'use strict';
app.controller('hazardAddController', ['$scope', '$location',   '$routeParams', '$rootScope','qahService',
 function ($scope, $location,   $routeParams, $rootScope,qahService) {
    $scope.isNew = true;
	
	
	
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
	
	
	var tabs = [
        { text: "Main", id: 'main',  },
        { text: "Sources", id: 'sources',   },
		{ text: "Root Causes", id: 'root_causes',   },
		{ text: "Consequences", id: 'consequences',   },
		{ text: "Attachments", id: 'attachments',   },
		 
		{ text: "Relevants ", id: 'relevants',   },
		
		 
			{text:'Risk Assessment', id:'assessment'},
			
				{text:'Actions', id:'actions'},
				
				{text:'Review', id:'assessment_review'},
				
				{text:'Monitoring', id:'monitoring'},

        


    ];
	 
	 $scope.tabs = tabs;
    $scope.selectedTabIndex = 0;
    $scope.$watch("selectedTabIndex", function (newValue) {

        try {
            $scope.selectedTab = tabs[newValue];
            $('.tab').hide();
            $('.' + $scope.selectedTab.id).fadeIn(100, function () {


            });
             /*
            $scope.dg_aircrafttype_instance.repaint();
            
            $scope.dg_education_instance.repaint();
          
            $scope.dg_group_instance.repaint();
            $scope.dg_employee_instance.repaint();
            $scope.chapter_instance.refresh();

            var myVar = setInterval(function () {

                var scl = $("#dg_education").find('.dx-datagrid-rowsview').dxScrollable('instance');
                scl.scrollTo({ left: 0 });
                var scl2 = $("#dg_aircrafttype").find('.dx-datagrid-rowsview').dxScrollable('instance'); scl2.scrollTo({ left: 0 });
                var scl3 = $("#dg_file").find('.dx-datagrid-rowsview').dxScrollable('instance'); scl3.scrollTo({ left: 0 });
                  var scl5 = $("#dg_group").find('.dx-datagrid-rowsview').dxScrollable('instance'); scl5.scrollTo({ left: 0 });
                var scl6 = $("#dg_employee").find('.dx-datagrid-rowsview').dxScrollable('instance'); scl6.scrollTo({ left: 0 });

                clearInterval(myVar);
            }, 10);

             $scope.btn_visible_file = newValue == 1;
            $scope.btn_visible_education = newValue == 4;
             $scope.btn_visible_employee = newValue ==2;
              */
           



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

     /////////////////// CMS2
     $scope.entity = {};


     $scope.hazard_category = null;
     $scope.sb_hazard_category = {
         showClearButton: true,
         searchEnabled: true,
         displayExpr: "title",
         //valueExpr: 'id',
         // dataSource: ['Audit Findings','Mandatory Reports','Voluntary Report','Other'],
         onValueChanged: function () {

         },

         bindingOptions: {
             value: 'hazard_category',
             dataSource: 'ds_hazard_category'

         }
     };

     $scope.hazard_type = null;
     $scope.sb_hazard_type = {
         showClearButton: true,
         searchEnabled: true,
         displayExpr: "title",
         //valueExpr: 'id',
         // dataSource: ['Audit Findings','Mandatory Reports','Voluntary Report','Other'],
         onValueChanged: function () {

         },

         bindingOptions: {
             value: 'hazard_type',
             dataSource: 'ds_hazard_type'

         }
     };

     ///////////////////////////////////////////




	$scope.get_scroll_style=function(){
		
		return {
			
		  height:$(window).height()-240
		};
	};
	
	 $scope.ds_category=[];
	$scope.pop_width = $(window).width()-100;
    $scope.pop_height = $(window).height()-100;
    $scope.popup_add_visible = false;
    $scope.popup_add_title = 'New';
    $scope.popup_add = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [
            
            { widget: 'dxButton', location: 'after', options: { type: 'default', text: 'Save', icon: 'check', validationGroup: 'libraryadd', bindingOptions: {} }, toolbar: 'bottom' },
            
			{ widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove',onClick:function(e){ $scope.popup_add_visible=false;} }, toolbar: 'bottom' }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {
             

        },
        onShown: function (e) {
			qahService.getCategories(-1).then(function (cats) {
				console.log(cats);
				$scope.ds_category=cats;
			}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });	
            //$scope.loadingVisible = true;
            /*libraryService.getKeywords().then(function (response) {
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
             */



        },
        onHiding: function () {

            //$scope.clearEntity();
			 

            $scope.popup_add_visible = false;
            $rootScope.$broadcast('onHaardAddHide', null);
        },
        bindingOptions: {
            visible: 'popup_add_visible',
            width: 'pop_width',
            height: 'pop_height',
            title: 'popup_add_title',
             
        }
    };
	
	$scope.entity={
		 
		id:null,
		title:null,
		description:null,
		priority:null,
		scope_id:null,
		location:null,
		gps_coordinate:null,
		date_occurred:null,
		category_id:null,
		subcategory_id:null,
		remark:null,
		
	};
	
	$scope.risk_index=null;
	$scope.risk_probability=null;
	$scope.risk_severity=null;
	
	$scope.click_matrix_cell=function(prob,sev){
		
	    $scope.risk_probability=prob;
		$scope.risk_severity=sev;
		$scope.risk_index=$scope.risk_probability+$scope.risk_severity;
		$scope.do_tolerability();
		
	};
	$scope.get_cell_matrix_class=function(idx){
		if (idx==$scope.risk_index)
			return 'td-matrix selected';
		else return 'td-matrix';
		
	};
	$scope.risk_tolerability=null;
	$scope.risk_tolerability_action=null;
	$scope.do_tolerability=function(){
		var acceptable=['1B','1C','1D','1E','2D','2E','3E'];
		//var miti=[];
		var unacceptable=['3A','4A','5A','4B','5B','5C'];
		
		if (acceptable.indexOf($scope.risk_index)!=-1){
			$scope.risk_tolerability='Acceptable';
			$scope.risk_tolerability_action='قابل قبول است و اقدام كنترلی لازم ندارد';
		}
		else if (unacceptable.indexOf($scope.risk_index)!=-1){
			$scope.risk_tolerability='Unacceptable';
			$scope.risk_tolerability_action='اقدام اصلاحی عاجل به منظور كاهش ریسک و مهار تهدید ایمنی یا توقف فعالیت هوانوردی مربوطه';
		}
		else
		{
			$scope.risk_tolerability='Mitigatable';
			$scope.risk_tolerability_action='براساس اقدامات كنترلی در نظر گرفته شده قابل تحمل است. ممكن است نیاز به تصمیم مدیرت داشته باشد';
		}
		
	};
	$scope.get_tolerability_class=function(){
		return $scope.risk_tolerability;
	};
	$scope.txt_assessment_remark={
		height:100,//$(window).height()-505,
	};
	
	$scope.txt_assessment_review_remark={
		height: $(window).height()-505,
	};
	$scope.btn_consequence_add = {
        text: '',
        type: 'default',
        icon: 'plus',
        width: '20',
        validationGroup: 'consequence',
        bindingOptions: {},
        onClick: function (e) {
            


        }

    };
	const employees = [{
  id: 1,
  fullName: 'John Heart',
  prefix: 'Dr.',
  position: 'CEO',
  expanded: true,
  items: [{
    id: 2,
    fullName: 'Samantha Bright',
    prefix: 'Dr.',
    position: 'COO',
    expanded: true,
    items: [{
      id: 3,
      fullName: 'Kevin Carter',
      prefix: 'Mr.',
      position: 'Shipping Manager',
    }, {
      id: 14,
      fullName: 'Victor Norris',
      prefix: 'Mr.',
      selected: true,
      position: 'Shipping Assistant',
    }],
  }, {
    id: 4,
    fullName: 'Brett Wade',
    prefix: 'Mr.',
    position: 'IT Manager',
    expanded: true,
    items: [{
      id: 5,
      fullName: 'Amelia Harper',
      prefix: 'Mrs.',
      position: 'Network Admin',
    }, {
      id: 6,
      fullName: 'Wally Hobbs',
      prefix: 'Mr.',
      position: 'Programmer',
    }, {
      id: 7,
      fullName: 'Brad Jameson',
      prefix: 'Mr.',
      position: 'Programmer',
    }, {
      id: 8,
      fullName: 'Violet Bailey',
      prefix: 'Ms.',
      position: 'Jr Graphic Designer',
    }],
  }, {
    id: 9,
    fullName: 'Barb Banks',
    prefix: 'Mrs.',
    position: 'Support Manager',
    expanded: true,
    items: [{
      id: 10,
      fullName: 'Kelly Rodriguez',
      prefix: 'Ms.',
      position: 'Support Assistant',
    }, {
      id: 11,
      fullName: 'James Anderson',
      prefix: 'Mr.',
      position: 'Support Assistant',
    }],
  }],
}];
	$scope.tree_route_cause = {
          dataSource: employees,
          
			height: $(window).height()-320,
			onContentReady(e) {
				//syncSelection(e.component);
	      },
        onSelectionChanged(e) {
         // syncSelection(e.component);
        },
      onInitialized(e) {
         //$scope.treeView = e.component;
        },
      bindingOptions: {
         selectionMode: 'multiple',
         showCheckBoxesMode: 'normal',
         selectNodesRecursive: 'true',
         selectByClick: 'true',
		 items:'ds_root_cause'
    },
  };
  $scope.ds_root_cause=[
    {
	  id:1,
	 title:'Human Factors', expanded: true,
	    items:[
		   {id:10,title:'Insufficient Rest'},{id:11,title:'CRM'},
		]
	},
    {
      id:2,expanded: true,
	  title:'Equipments', items:[{id:20,title:'Equipment malfunction'},]
    }	,
     {
      id:3,expanded: true,
	  title:'Weather', items:[{id:30,title:'Insufficient visibility'},]
    },
    {
      id:4,expanded: true,
	  title:'Parent', items:[{id:40,title:'Child 1'},{id:41,title:'Child 2'},
	    {id:42,title:'Child 3',expanded: true,items:[{id:421,title:'sub 1'},{id:422,title:'sub 2'}]},
	  ]
    }	
  ];
  
  
  $scope.txt_hazard_remark={
	  height:50,
  }
  $scope.txt_hazard_tags={
	  height:50,
  }
  $scope.txt_source_remark={
	  height:50,
  }
  $scope.tree_hazard_subcategory = {
          dataSource: employees,
          
			height: $(window).height()-620,
			onContentReady(e) {
				//syncSelection(e.component);
	      },
        onSelectionChanged(e) {
         // syncSelection(e.component);
        },
      onInitialized(e) {
         //$scope.treeView = e.component;
        },
      bindingOptions: {
         selectionMode: 'multiple',
         showCheckBoxesMode: 'normal',
         selectNodesRecursive: 'true',
         selectByClick: 'true',
		 items:'ds_hazard_subcategory'
    },
  };
  $scope.ds_hazard_subcategory=[
     
    {
      id:4,expanded: false,
	  title:'Parent A', items:[{id:40,title:'Child 1'},{id:41,title:'Child 2'},
	    {id:42,title:'Child 3',expanded: true,items:[{id:421,title:'sub 1'},{id:422,title:'sub 2'}]},
	  ]
    }	,
	{
      id:5,expanded: true,
	  title:'Parent B', items:[{id:50,title:'Child 1'},{id:51,title:'Child 2'},
	    {id:52,title:'Child 3',expanded: true,items:[{id:521,title:'sub 1'},{id:522,title:'sub 2'}]},
	  ]
    }
  ];
  ////////////////////////////////
  $scope.btn_people_add = {
        text: '',
        type: 'default',
        icon: 'plus',
        width: '40',
        
        bindingOptions: {},
        onClick: function (e) {
            


        }

    };
	$scope.btn_part_add = {
        text: '',
        type: 'default',
        icon: 'plus',
        width: '40',
        
        bindingOptions: {},
        onClick: function (e) {
            


        }

    };
  $scope.dg_people_columns = [
        
        
        { dataField: 'Position', caption: 'Department', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120,   },

        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,   },
		  { dataField: 'NID', caption: 'NID', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120,   },
		 
        
    ];
    $scope.dg_people_selected = null;
    $scope.dg_people_instance = null;
    $scope.dg_people_ds = null;
    $scope.dg_people = {
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
        //2020-10-27 1 s
        height: 285,// $(window).height() - 250,// 490 

        columns: $scope.dg_people_columns,
        onContentReady: function (e) {
            if (!$scope.dg_people_instance)
                $scope.dg_people_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_people_selected = null;

            }
            else {
                $scope.dg_people_selected = data;

            }
        },
        onRowPrepared: function (e) {
            if (e.data && e.data.IsPositioning)
                e.rowElement.css('background', '#ffccff');

        },

        bindingOptions: {
            dataSource: 'dg_people_ds',

        }
    };
	
	 $scope.dg_parts_columns = [
        
        
        { dataField: 'Position', caption: 'P/N', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 140,   },

        { dataField: 'Name', caption: 'S/N', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false,  width: 140,  },
		  { dataField: 'NID', caption: 'Description', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth:200    },
		 
        
    ];
    $scope.dg_parts_selected = null;
    $scope.dg_parts_instance = null;
    $scope.dg_parts_ds = null;
    $scope.dg_parts = {
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
        //2020-10-27 1 s
        height: 200,// $(window).height() - 250,// 490 

        columns: $scope.dg_parts_columns,
        onContentReady: function (e) {
            if (!$scope.dg_parts_instance)
                $scope.dg_parts_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_parts_selected = null;

            }
            else {
                $scope.dg_parts_selected = data;

            }
        },
        onRowPrepared: function (e) {
            if (e.data && e.data.IsPositioning)
                e.rowElement.css('background', '#ffccff');

        },

        bindingOptions: {
            dataSource: 'dg_parts_ds',

        }
    };
	
	
	$scope.dg_responsible_columns = [
        
        
        { dataField: 'Position', caption: 'Department', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120,   },

        { dataField: 'Name', caption: 'Responsible Manager', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,   },
		  
        
    ];
    $scope.dg_responsible_selected = null;
    $scope.dg_responsible_instance = null;
    $scope.dg_responsible_ds = null;
    $scope.dg_responsible = {
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
        //2020-10-27 1 s
        height: 240,// $(window).height() - 250,// 490 

        columns: $scope.dg_responsible_columns,
        onContentReady: function (e) {
            if (!$scope.dg_responsible_instance)
                $scope.dg_responsible_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_responsible_selected = null;

            }
            else {
                $scope.dg_responsible_selected = data;

            }
        },
        onRowPrepared: function (e) {
            if (e.data && e.data.IsPositioning)
                e.rowElement.css('background', '#ffccff');

        },

        bindingOptions: {
            dataSource: 'dg_responsible_ds',

        }
    };
	
	
	
	$scope.dg_action_columns = [
        { dataField: 'NID', caption: 'Task', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 250,   },
        { dataField: 'Position', caption: 'Out Source', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100,   },
		{ dataField: 'Position', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100,   },
		{ dataField: 'Position', caption: 'Term', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100,   },
        { dataField: 'Position', caption: 'Department', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150,   },

        { dataField: 'Name', caption: 'Assigned To', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,width:150   },
		  { dataField: 'NID', caption: 'NID', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100,   },
		  { dataField: 'NID', caption: 'Deadline', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130,   },
		  
		  { dataField: 'Position', caption: 'Done', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100,   },
		  { dataField: 'Position', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 100,   },
		    { dataField: 'Position', caption: 'Accepted', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100,   },
		    { dataField: 'Position', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 100,   },
		 
        
    ];
    $scope.dg_action_selected = null;
    $scope.dg_action_instance = null;
    $scope.dg_action_ds = null;
    $scope.dg_action = {
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
        //2020-10-27 1 s
        height:   $(window).height() - 300, 

        columns: $scope.dg_action_columns,
        onContentReady: function (e) {
            if (!$scope.dg_action_instance)
                $scope.dg_action_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_action_selected = null;

            }
            else {
                $scope.dg_action_selected = data;

            }
        },
        onRowPrepared: function (e) {
            if (e.data && e.data.IsPositioning)
                e.rowElement.css('background', '#ffccff');

        },

        bindingOptions: {
            dataSource: 'dg_action_ds',

        }
    };
  
  /////////////////////
  
	$scope.dg_source_columns = [
        //{
        //    caption: 'Crew', columns: [
        //         { dataField: 'IsPositioning', caption: 'DH', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 55 },
        //        { dataField: 'Position', caption: 'Pos.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 75, fixed: true, fixedPosition: 'left' },

        //        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        //         { dataField: 'Mobile', caption: 'Mobile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, visible: $scope.IsCrewMobileVisible },
        //           {
        //               dataField: 'RP', caption: 'Pickup', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: true, width: 120, editorOptions: {
        //                   type: "time"
        //               }, format: "HH:mm"
        //           },



        //    ]
        //}
        
        { dataField: 'Position', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120,   },

        { dataField: 'Name', caption: 'Reporter', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 180 },
		  { dataField: 'Mobile', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120,   },
		{ dataField: 'Sex', caption: 'Confidential', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120,   },
        { dataField: 'Mobile', caption: 'Anonymous', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120,   },
		{ dataField: 'Mobile', caption: 'Remark', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false,   },
        
    ];
    $scope.dg_source_selected = null;
    $scope.dg_source_instance = null;
    $scope.dg_source_ds = null;
    $scope.dg_source = {
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
        //2020-10-27 1 s
        height: 230,// $(window).height() - 250,// 490 

        columns: $scope.dg_source_columns,
        onContentReady: function (e) {
            if (!$scope.dg_source_instance)
                $scope.dg_source_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_source_selected = null;

            }
            else {
                $scope.dg_source_selected = data;

            }
        },
        onRowPrepared: function (e) {
            if (e.data && e.data.IsPositioning)
                e.rowElement.css('background', '#ffccff');

        },

        bindingOptions: {
            dataSource: 'dg_source_ds',

        }
    };
	
	
	
	$scope.dg_consequence_columns = [
        
        
        { dataField: 'Position', caption: 'Category', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200,   },

        { dataField: 'Name', caption: 'Severity', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
		  
		{ dataField: 'Mobile', caption: 'Consequence', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false,   },
        
    ];
    $scope.dg_consequence_selected = null;
    $scope.dg_consequence_instance = null;
    $scope.dg_consequence_ds = null;
    $scope.dg_consequence = {
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
        //2020-10-27 1 s
        height: 350,// $(window).height() - 250,// 490 

        columns: $scope.dg_consequence_columns,
        onContentReady: function (e) {
            if (!$scope.dg_consequence_instance)
                $scope.dg_consequence_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_consequence_selected = null;

            }
            else {
                $scope.dg_consequence_selected = data;

            }
        },
        onRowPrepared: function (e) {
            if (e.data && e.data.IsPositioning)
                e.rowElement.css('background', '#ffccff');

        },

        bindingOptions: {
            dataSource: 'dg_consequence_ds',

        }
    };
	/////////////////////////////////
	$scope.txt_hazard_description = {
        bindingOptions: {
            value: 'entity.description',
            height: '70',
             
        }
    };
	$scope.dt_hazard_occurred = {
        type: "date",
        placeholder: '',
        width: '100%',
        displayFormat: "yyyy-MM-dd",
        bindingOptions: {
            value: 'entity.date_occurred',

        }
    };
	$scope.sb_hazard_priority = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: ['Normal','High','Low'],
		 onValueChanged:function(){
			
		 },
		
        bindingOptions: {
            value: 'entity.priority',
            
        }
    };
	$scope.sb_hazard_issue_type = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: ['Hazard','Occurance'],
		 onValueChanged:function(){
			
		 },
		
        bindingOptions: {
           // value: 'entity.priority',
            
        }
    };
	
	
	$scope.ds_hazard_source_type=[
	  {id:1,title:'Safety Form Reports'},
		  {id:2,title:'Audits'},
			  {id:3,title:'Others'}
	   
	];
	$scope.hazard_source_type=null;
	$scope.sb_hazard_source = {
        showClearButton: true,
        searchEnabled: true,
		 displayExpr: "title",
        valueExpr: 'id',
       // dataSource: ['Audit Findings','Mandatory Reports','Voluntary Report','Other'],
		 onValueChanged:function(){
			
		 },
		
        bindingOptions: {
            value: 'hazard_source_type',
			dataSource:'ds_hazard_source_type'
            
        }
    };
	$scope.btn_form_select = {
        text: '',
        type: 'default',
        icon: 'find',
        width: '20',
        validationGroup: 'consequence',
        bindingOptions: {},
        onClick: function (e) {
            


        }

    };
	$scope.btn_form_show = {
        text: '',
        type: 'success',
        icon: 'info',
        width: '20',
        validationGroup: 'consequence',
        bindingOptions: {},
        onClick: function (e) {
            


        }

    };
	
	
	
	$scope.task_status='Not Started';
	$scope.sb_task_status = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: ['Not Started','Started','Done','Rejected','Confirmed'],
		 onValueChanged:function(){
			
		 },
		
        bindingOptions: {
            value: 'task_status',
            
        }
    };
	
	
	$scope.task_urgency='Normal';
	$scope.sb_task_urgency = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: ['Low','Normal','High'],
		 onValueChanged:function(){
			
		 },
		
        bindingOptions: {
            value: 'task_urgency',
            
        }
    };
	
	
	$scope.task_type='Corrective';
	$scope.sb_task_type = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: ['Corrective','Preventive','Not Set'],
		 onValueChanged:function(){
			
		 },
		
        bindingOptions: {
            value: 'task_type',
            
        }
    };
	
	$scope.task_term='Short Term';
	$scope.sb_task_term = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: ['Short Term','Long Term','Not Set'],
		 onValueChanged:function(){
			
		 },
		
        bindingOptions: {
            value: 'task_term',
            
        }
    };
	
	 $scope.check_is_anonymous = {
        width: '100%',
        text: "Is Anonymous",

        bindingOptions: {
            value: 'sms_nira_sf',
        }
    };
	$scope.check_is_confidential = {
        width: '100%',
        text: "Is Confidential",

        bindingOptions: {
            value: 'sms_nira_sf',
        }
    };
	$scope.txt_hazard_root_other={height:150};
	$scope.txt_hazard_root_analysis={height:$(window).height()-495};
	
	$scope.tree_ds=[
  {
    "ID": 1,
    "name": "Stores",
    "expanded": true
  },
  {
    "ID": "1_1",
    "categoryId": 1,
    "name": "Super Mart of the West",
    "expanded": true
  },
  {
    "ID": "1_1_1",
    "categoryId": "1_1",
    "name": "Video Players"
  },
  {
    "ID": "1_1_1_1",
    "categoryId": "1_1_1",
    "name": "HD Video Player",
    "price": 220
  },
  {
    "ID": "1_1_1_2",
    "categoryId": "1_1_1",
    "name": "SuperHD Video Player",
    "price": 270
  },
  {
    "ID": "1_1_2",
    "categoryId": "1_1",
    "name": "Televisions",
    "expanded": true
  },
  {
    "ID": "1_1_2_1",
    "categoryId": "1_1_2",
    "name": "SuperLCD 42",
    "price": 1200
  },
  {
    "ID": "1_1_2_2",
    "categoryId": "1_1_2",
    "name": "SuperLED 42",
    "price": 1450
  },
  {
    "ID": "1_1_2_3",
    "categoryId": "1_1_2",
    "name": "SuperLED 50",
    "price": 1600
  },
  {
    "ID": "1_1_2_4",
    "categoryId": "1_1_2",
    "name": "SuperLCD 55",
    "price": 1750
  },
  {
    "ID": "1_1_2_5",
    "categoryId": "1_1_2",
    "name": "SuperLCD 70",
    "price": 4000
  },
  {
    "ID": "1_1_3",
    "categoryId": "1_1",
    "name": "Monitors"
  },
  {
    "ID": "1_1_3_1",
    "categoryId": "1_1_3",
    "name": "19\""
  },
  {
    "ID": "1_1_3_1_1",
    "categoryId": "1_1_3_1",
    "name": "DesktopLCD 19",
    "price": 160
  },
  {
    "ID": "1_1_4",
    "categoryId": "1_1",
    "name": "Projectors"
  },
  {
    "ID": "1_1_4_1",
    "categoryId": "1_1_4",
    "name": "Projector Plus",
    "price": 550
  },
  {
    "ID": "1_1_4_2",
    "categoryId": "1_1_4",
    "name": "Projector PlusHD",
    "price": 750
  }
];

  $scope.sb_category={
	   valueExpr: 'id',
    displayExpr: 'title',
    placeholder: 'Select a value...',
    showClearButton: true,
	dataSource: $scope.tree_ds,
	contentTemplate(e) {
      const $treeView = $('<div>').dxTreeView({
        dataSource: e.component.getDataSource(),
        dataStructure: 'plain',
        keyExpr: 'id',
        parentIdExpr: 'parent_id',
        selectionMode: 'single',
        displayExpr: 'title',
        selectByClick: true,
        onContentReady(args) {
          const value = e.component.option('value');
          //syncTreeViewSelection(args.component, value);
        },
        selectNodesRecursive: false,
        onItemSelectionChanged(args) {
          const selectedKeys = args.component.getSelectedNodeKeys();
          e.component.option('value', selectedKeys);
        },
      });

      treeView = $treeView.dxTreeView('instance');

      e.component.on('valueChanged', (args) => {
       // syncTreeViewSelection(treeView, args.value);
        e.component.close();
      });

      return $treeView;
    },
  };
  
  
  
    $scope.treeBoxValue = '1_1';
  $scope.isGridBoxOpened = false;


   let treeView_category;

  const syncTreeViewSelection_ = function (treeViewInstance) {
    if (!treeViewInstance) return;

    if (!$scope.treeBoxValue) {
      treeViewInstance.unselectAll();
    } else {
      treeViewInstance.selectItem($scope.treeBoxValue);
    }
  };
  
  const syncTreeViewSelection = function (treeViewInstance) {
    if (!$scope.category_selected) return;

    if (!$scope.category_selected) {
      treeViewInstance.unselectAll();
      return;
    }

    //$scope.treeBoxValue.forEach((key) => {
    //  treeViewInstance.selectItem(key);
    //});
	$.each($scope.category_selected,function(_i,key){ treeViewInstance.selectItem(key);});
  };
  
  
 
  $scope.sb_category = {
    bindingOptions: {
      value: 'category_selected',
      opened: 'isGridBoxOpened',
	  dataSource: 'ds_category'
    },
    valueExpr: 'ID',
    displayExpr: 'name',
    placeholder: 'Select a value...',
    showClearButton: true,
    
    onValueChanged() {
      syncTreeViewSelection(treeView_category);
    },
    treeView : {
		bindingOptions: {
			dataSource: 'ds_category'
		},
     
      dataStructure: 'plain',
      keyExpr: 'ID',
      parentIdExpr: 'categoryId',
      displayExpr: 'name',
      selectByClick: true,
      selectNodesRecursive: false,
      selectionMode: 'multiple',
	   showCheckBoxesMode: 'normal',
      onContentReady(e) {
        treeView_category = e.component;

        syncTreeViewSelection(treeView_category);
      },
      onItemSelectionChanged(args) {
		  //console.log(args);
		  //var nodes=args.component.getSelectedNodes();
		  //console.log(nodes);
		  //$scope.treeBoxValue = args.itemData.ID;
		  var index = $scope.category_selected.indexOf(args.itemData.ID);
          if (index > -1) {  
               $scope.category_selected.splice(index, 1);  
          }
		  else $scope.category_selected.push(args.itemData.ID);
		  console.log($scope.category_selected);
        
      },
      onItemClick() {
        $scope.isGridBoxOpened = false;
      },
    },
  };
  
  $scope.category_selected=[];
	
	
	/////////////////////////////////
	
	$scope.tempData = null;
    $scope.bookKey = null;
    $scope.$on('InitAddHazard', function (event, prms) {

  
        $scope.tempData = null;

        if (!prms.Id) {

            $scope.isNew = true;
             

        }

        else {

            
            $scope.tempData = prms;
            $scope.isNew = false;


        }

        $scope.popup_add_visible = true;

    });
    //////////////////////////////

}]);  
	
	