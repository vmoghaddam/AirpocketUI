'use strict';


app.controller('mntStatusController', ['$scope', '$location', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', function ($scope, $location, mntService, authService, $routeParams, $rootScope, $window, $sce) {
    $scope.entity = {
        date_initial_landing_gear: null,
        date_initial_apu: null,
        date_initial_ht1: null,
        date_initial_ht2: null,
        date_initial_ht3: null,
        date_initial_due: null,
        date_initial: null
    };

    $scope.engEntity =
    {
        id: null,
        engEntity: null
    };

    $scope.checkEntity = {
        date_initial: null,

    };

    $scope.adEntity = {
        date_initial: null,
        date_due: null
    };

    $scope.catEntity = {
        date_initial: null,
        date_due: null
    };

    $scope.engAdEntity = {
        date_initial: null,
        date_due: null
    };

    $scope.selectedTabIndex = -1;
    $scope.selectedTabId = null;
    $scope.tabs = [
        { text: "RBA", id: '30' },
        { text: "RBB", id: '224' },
        { text: "RBC", id: '225' },
    ];

    $scope.tabs_options = {
        scrollByContent: true,
        showNavButtons: true,


        onItemClick: function (arg) {

        },
        onItemRendered: function (e) {
            $scope.selectedTabIndex = -1;
            $scope.selectedTabIndex = 0;
            $scope.selectedTabId = 30;
        },
        bindingOptions: {
            //visible: 'tabsdatevisible',
            dataSource: { dataPath: "tabs", deep: true },
            selectedIndex: 'selectedTabIndex'
        }

    };
    $scope.$watch("selectedTabIndex", function (newValue) {
        try {
            $('.tabc').hide();
            $scope.entity.date_initial_landing_gear = $scope.entity.date_initial_landing_gear == null ? null : moment($scope.entity.date_initial_landing_gear).format('YYYY-MM-DD');
            $scope.entity.date_initial_apu = $scope.entity.date_initial_apu == null ? null : moment($scope.entity.date_initial_apu).format('YYYY-MM-DD');
            $scope.entity.date_initial_ht1 = $scope.entity.date_initial_ht1 == null ? null : moment($scope.entity.date_initial_ht1).format('YYYY-MM-DD');
            $scope.entity.date_initial_ht2 = $scope.entity.date_initial_ht2 == null ? null : moment($scope.entity.date_initial_ht2).format('YYYY-MM-DD');
            $scope.entity.date_initial_ht3 = $scope.entity.date_initial_ht3 == null ? null : moment($scope.entity.date_initial_ht3).format('YYYY-MM-DD');
            $scope.entity.date_initial_due = $scope.entity.date_initial_due == null ? null : moment($scope.entity.date_initial_due).format('YYYY-MM-DD');
            $scope.entity.date_initial = $scope.entity.date_initial == null ? null : moment($scope.entity.date_initial).format('YYYY-MM-DD');

            mntService.saveLLP($scope.entity).then(function (response) {
                console.log(response);
            });


            var id = $scope.tabs[newValue].id;
            $scope.selectedTabId = id;
            console.log($scope.selectedTabId);
            $('#' + id).fadeIn();
            $scope.bind();
            switch (id) {
                case '30':
                    $scope.eng1Id = 1;
                    $scope.eng2Id = 2;
                    break;

                case '224':
                    $scope.eng1Id = 3;
                    $scope.eng2Id = 4;
                    break;

                case '225':
                    $scope.eng1Id = 5;
                    $scope.eng2Id = 6;
                    break;

                default:
                    break;
            }
            if ($scope.dg_coming_instance)
                $scope.dg_coming_instance.refresh();
            if ($scope.dg_ad_instance)
                $scope.dg_ad_instance.refresh();
        }
        catch (e) {

        }
    });



    $scope.selectedStatusTabIndex = -1;
    $scope.selectedStatusTabId = null;
    $scope.statusTabs = [
        { text: "HT and LLP Status", id: 'llp' },
        { text: "Coming Check", id: 'coming' },
        { text: "AD/SB Status", id: 'ad' },
    ];

    $scope.statusTabs_options = {
        scrollByContent: true,
        showNavButtons: true,


        onItemClick: function (arg) {

        },
        onItemRendered: function (e) {
            $scope.selectedStatusTabIndex = -1;
            $scope.selectedStatusTabIndex = 0;
        },
        bindingOptions: {
            //visible: 'tabsdatevisible',
            dataSource: { dataPath: "statusTabs", deep: true },
            selectedIndex: 'selectedStatusTabIndex'
        }

    };
    $scope.$watch("selectedStatusTabIndex", function (newValue) {
        try {
            $('.tabst').hide();
            var id = $scope.statusTabs[newValue].id;
            $scope.selectedStatusTabId = id;
            $('#' + id).fadeIn();

            switch (id) {
                case 'llp':

                    break;

                case 'coming':

                    break;

                case 'ad':

                    break;

                default:
                    break;
            }
            if ($scope.dg_coming_instance)
                $scope.dg_coming_instance.refresh();
            if ($scope.dg_ad_instance)
                $scope.dg_ad_instance.refresh();
        }
        catch (e) {

        }
    });


    ////////////////////////////

    $scope.fill = function (data) {
        $scope.entity = data;
    }

    $scope.bind = function () {
        mntService.getLLP($scope.selectedTabId).then(function (response) {
            $scope.fill(response.data);
        });

        mntService.getCheck($scope.selectedTabId).then(function (response) {

            $scope.dg_coming_ds = response.data;
            console.log($scope.dg_coming_ds)

        });

        mntService.getADSB($scope.selectedTabId).then(function (response) {
            $scope.dg_ad_ds = response.data;
            console.log($scope.dg_ad_ds)
        });

    }

    $scope.bindEng = function () {

        mntService.getEngine($scope.engEntity.id, $scope.engEntity.engine_no).then(function (res) {
            $scope.engEntity = res.data;
        });
        mntService.getEngADSB($scope.engEntity.id).then(function (response) {
            $scope.dg_eng_ad_ds = response.data;
            console.log($scope.dg_eng_part_ds)
        });
        mntService.getEngLlp($scope.engEntity.id).then(function (response) {
            $scope.dg_eng_part_ds = response.data;
            console.log($scope.dg_eng_ad_ds)
        });
    }



    //////////////////////////////
    $scope.btn_coming_add = {
        text: '',
        type: 'default',
        icon: 'plus',
        width: 35,
        onClick: function (e) {
            $scope.popup_tasks_visible = true;

        }

    };

    $scope.btn_coming_remove = {
        text: '',
        type: 'danger',
        icon: 'close',
        width: 35,
        onClick: function (e) {

            $scope.loadingVisible = true;
            mntService.deleteAcCheck($scope.dg_coming_id).then(function (response) {
                $scope.dg_coming_ds = Enumerable.From($scope.dg_coming_ds).Where(function (x) {
                    return x.id != $scope.dg_coming_id.id;
                }).ToArray();
                $scope.loadingVisible = false;
            });

        }

    };

    $scope.btn_ad_add = {
        text: '',
        type: 'default',
        icon: 'plus',
        width: 35,
        onClick: function (e) {
            $scope.popup_ad_visible = true;

        }

    };

    $scope.btn_ad_remove = {
        text: '',
        type: 'danger',
        icon: 'close',
        width: 35,
        onClick: function (e) {
            $scope.loadingVisible = true;
            mntService.deleteAcAdsb($scope.dg_ad_id).then(function (response) {
                $scope.dg_ad_ds = Enumerable.From($scope.dg_ad_ds).Where(function (x) {
                    return x.id != $scope.dg_ad_id.id;
                }).ToArray();
                $scope.loadingVisible = false;
            });
        }

    };

    $scope.btn_eng_part_remove = {
        text: '',
        type: 'danger',
        icon: 'close',
        width: 35,
        onClick: function (e) {
            $scope.loadingVisible = true;
            mntService.deleteEngLlp($scope.dg_eng_part_id).then(function (response) {
                $scope.dg_eng_part_ds = Enumerable.From($scope.dg_eng_part_ds).Where(function (x) {
                    return x.id != $scope.dg_eng_part_id.id;
                }).ToArray();
                $scope.loadingVisible = false;
            });
        }

    };

    $scope.btn_eng_part_add = {
        text: '',
        type: 'default',
        icon: 'plus',
        width: 35,
        onClick: function (e) {

            $scope.popup_cat_visible = true;
        }

    };

    $scope.btn_eng_ad_remove = {
        text: '',
        type: 'danger',
        icon: 'close',
        width: 35,
        onClick: function (e) {
            $scope.loadingVisible = true;
            mntService.deleteEngAdsb($scope.dg_eng_ad_id).then(function (response) {
                $scope.dg_eng_ad_ds = Enumerable.From($scope.dg_eng_ad_ds).Where(function (x) {
                    return x.id != $scope.dg_eng_ad_id.id;
                }).ToArray();
                $scope.loadingVisible = false;
            });
        }

    };

    $scope.btn_eng_ad_add = {
        text: '',
        type: 'default',
        icon: 'plus',
        width: 35,
        onClick: function (e) {
            $scope.popup_adsb_visible = true;

        }

    };

    $scope.btn_eng1 = {
        text: '',
        type: 'default',
        icon: 'default',
        width: 15,
        onClick: function (e) {
            $scope.engEntity.engine_no = 1;
            $scope.engEntity.id = $scope.eng1Id
            $scope.popup_eng_visible = true;
            $scope.bindEng();

        }

    };

    $scope.btn_eng2 = {
        text: '',
        type: 'default',
        icon: 'default',
        width: 15,
        onClick: function (e) {
            $scope.engEntity.engine_no = 2;
            $scope.engEntity.id = $scope.eng2Id
            $scope.popup_eng_visible = true;
            $scope.bindEng();
        }

    };

    $scope.btn_save = {
        text: 'Save',
        type: 'success',
        onClick: function (e) {


            $scope.entity.date_initial_landing_gear = $scope.entity.date_initial_landing_gear == null ? null : moment($scope.entity.date_initial_landing_gear).format('YYYY-MM-DD');
            $scope.entity.date_initial_apu = $scope.entity.date_initial_apu == null ? null : moment($scope.entity.date_initial_apu).format('YYYY-MM-DD');
            $scope.entity.date_initial_ht1 = $scope.entity.date_initial_ht1 == null ? null : moment($scope.entity.date_initial_ht1).format('YYYY-MM-DD');
            $scope.entity.date_initial_ht2 = $scope.entity.date_initial_ht2 == null ? null : moment($scope.entity.date_initial_ht2).format('YYYY-MM-DD');
            $scope.entity.date_initial_ht3 = $scope.entity.date_initial_ht3 == null ? null : moment($scope.entity.date_initial_ht3).format('YYYY-MM-DD');
            $scope.entity.date_initial_due = $scope.entity.date_initial_due == null ? null : moment($scope.entity.date_initial_due).format('YYYY-MM-DD');
            $scope.entity.date_initial = $scope.entity.date_initial == null ? null : moment($scope.entity.date_initial).format('YYYY-MM-DD');
            $scope.entity.ID = $scope.selectedTabId;
            console.log($scope.entity);

            mntService.saveLLP($scope.entity).then(function (response) {
                console.log(response);
            });
        }

    };

    /////////////////////////////
    $scope.num_tfh = {
        bindingOptions: {
            value: "entity.total_flight_minute",
        }
    }

    $scope.num_tfc = {
        bindingOptions: {
            value: "entity.total_flight_cycle",
        }
    }

    $scope.dt_update = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: "entity.date_initial",
        }
    }


    $scope.num_ldg = {
        bindingOptions: {
            value: "entity.landing_gear_remaining",
        }
    }

    $scope.dt_ldg = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: "entity.date_initial_landing_gear",
        }
    }


    $scope.num_apu = {
        bindingOptions: {
            value: "entity.apu_remaining",
        }
    }

    $scope.dt_apu = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: "entity.date_initial_apu",
        }
    }


    $scope.txt_firstHT = {
        bindingOptions: {
            value: "entity.ht1_remaining",
        }
    }

    $scope.dt_firstHT = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: "entity.date_initial_ht1",
        }
    }

    $scope.txt_secondHT = {
        bindingOptions: {
            value: "entity.ht2_remaining",
        }
    }

    $scope.dt_secondHT = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: "entity.date_initial_ht2",
        }
    }


    $scope.txt_thirdHT = {
        bindingOptions: {
            value: "entity.ht3_remaining",
        }
    }

    $scope.dt_thirdHT = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: "entity.date_initial_ht3",
        }
    }

    $scope.num_defects = {
        bindingOptions: {
            value: "entity.deffects_no",
        }
    }

    $scope.num_firstDue = {
        bindingOptions: {
            value: "entity.first_due_remaining",
        }
    }

    $scope.dt_defectsUpdate = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: "entity.date_initial_due",
        }
    }

    $scope.txt_engModel = {
        bindingOptions: {
            value: "engEntity.model",
        }
    }
    $scope.num_engSerial = {
        bindingOptions: {
            value: "engEntity.serial_no",
        }
    }

    $scope.txt_cat = {
        bindingOptions: {
            value: "engEntity.cat",
        }
    }
    $scope.num_engTfh = {
        bindingOptions: {
            value: "engEntity.remaining_minutes",
        }
    }
    $scope.num_engTfc = {
        bindingOptions: {
            value: "engEntity.remaining_cycles",
        }
    }

    $scope.dt_engUpdate = {
        bindingOptions: {
            value: "engEntity.date_initial",
        }
    }

    $scope.txt_taskChk = {
        bindingOptions: {
            value: "checkEntity.check",
        }
    }

    $scope.txt_tasks = {
        bindingOptions: {
            value: "checkEntity.tasks",
        }
    }

    $scope.txt_tasksEstimated = {
        bindingOptions: {
            value: "checkEntity.estimated_working_days",
        }
    }

    $scope.txt_tasksRemaining = {
        bindingOptions: {
            value: "checkEntity.remaining_minutes",
        }
    }

    $scope.dt_taskUpdate = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: "checkEntity.date_initial",
        }
    }


    $scope.dt_adDue = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: "adEntity.date_due",
        }
    }

    $scope.dt_adUpdate = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: "adEntity.date_initial",
        }
    }

    $scope.txt_subject = {
        bindingOptions: {
            value: "adEntity.subject",
        }
    }

    $scope.txt_adsb = {
        bindingOptions: {
            value: "adEntity.reference",
        }
    }

    $scope.txt_adEstimated = {
        bindingOptions: {
            value: "adEntity.estimated_working_days",
        }
    }

    $scope.txt_title = {
        bindingOptions: {
            value: "catEntity.title",
        }
    }

    $scope.txt_cata = {
        bindingOptions: {
            value: "catEntity.cat_a",
        }
    }

    $scope.txt_catb = {
        bindingOptions: {
            value: "catEntity.cat_b",
        }
    }

    $scope.txt_catc = {
        bindingOptions: {
            value: "catEntity.cat_c",
        }
    }
    $scope.txt_catCycle = {
        bindingOptions: {
            value: "catEntity.remaining_cycles",
        }
    }

    $scope.dt_catUpdate = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: "catEntity.date_initial",
        }
    }

    $scope.dt_catDue = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: "catEntity.date_due",
        }
    }



    $scope.txt_adPart = {
        bindingOptions: {
            value: "engAdEntity.reference",
        }
    }

    $scope.txt_adSubject = {
        bindingOptions: {
            value: "engAdEntity.subject",
        }
    }

    $scope.txt_adRemark = {
        bindingOptions: {
            value: "engAdEntity.remark",
        }
    }
    $scope.txt_adCycle = {
        bindingOptions: {
            value: "engAdEntity.remaining_cycles",
        }
    }

    $scope.dt_adDue = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: "engAdEntity.date_due",
        }
    }

    $scope.dt_engAdUpdate = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: "engAdEntity.date_initial",
        }
    }
    /////////////////////////////////////


    $scope.dg_coming_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },




        { dataField: 'check', caption: 'Check', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'remaining_minutes', caption: 'Remaining Hour', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'tasks', caption: 'Task', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 250 },
        { dataField: 'estimated_working_days', caption: 'Estimated Working Hour', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250 },



    ];


    $scope.dg_coming_selected = null;
    $scope.dg_coming_instance = null;
    $scope.dg_coming_ds = null;
    $scope.dg_coming_id = { id: null };
    $scope.dg_coming = {



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

        columns: $scope.dg_coming_columns,
        onContentReady: function (e) {

            if (!$scope.dg_coming_instance)
                $scope.dg_coming_instance = e.component;

        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            $scope.dg_coming_id.id = e.selectedRowsData[0].id;


            if (!data) {
                $scope.dg_coming_selected = null;
            }
            else
                $scope.dg_coming_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_coming_ds'
        },
        columnChooser: {
            enabled: false
        },

    };




    $scope.dg_ad_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },




        { dataField: 'reference', caption: 'AD/SB Ref', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'subject', caption: 'Subject', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 200 },
        { dataField: 'estimated_working_days', caption: 'Estimated Working Hour', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250 },
        { dataField: 'date_due', caption: 'Due Date', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'remaining_days_actual', caption: 'Remaining Day', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250 },



    ];



    $scope.dg_ad_selected = null;
    $scope.dg_ad_instance = null;
    $scope.dg_ad_ds = [];
    $scope.dg_ad_id = { id: null };
    $scope.dg_ad = {



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

        columns: $scope.dg_ad_columns,
        onContentReady: function (e) {
            if (!$scope.dg_ad_instance)
                $scope.dg_ad_instance = e.component;

        },

        onRowClick: function (e) {



        },

        onRowPrepared: function (e) {


        },


        onCellPrepared: function (e) {

        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            $scope.dg_ad_id.id = e.selectedRowsData[0].id;

            if (!data) {
                $scope.dg_ad_selected = null;
            }
            else
                $scope.dg_ad_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_ad_ds'
        },
        columnChooser: {
            enabled: false
        },

    };


    $scope.dg_eng_part_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },




        { dataField: 'title', caption: 'Title', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 100 },
        {
            caption: 'Life Time Limit',
            alignment: 'center',
            columns: [
                { dataField: 'cat_a', caption: 'CAT A', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: 'cat_b', caption: 'CAT B', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: 'cat_c', caption: 'CAT C', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
            ]
        },
        { dataField: 'remaining_cycles', caption: 'Remaining Cycle', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },



    ];



    $scope.dg_eng_part_selected = null;
    $scope.dg_eng_part_instance = null;
    $rootScope.dg_eng_part_ds = null;
    $scope.dg_eng_part_id = { id: null }
    $scope.dg_eng_part = {



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
        height: ($(window).height() - 255) / 2,

        columns: $scope.dg_eng_part_columns,
        onContentReady: function (e) {
            if (!$scope.dg_eng_part_instance)
                $scope.dg_eng_part_instance = e.component;

        },


        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            $scope.dg_eng_part_id.id = e.selectedRowsData[0].id;

            if (!data) {
                $scope.dg_eng_part_selected = null;
            }
            else
                $scope.dg_eng_part_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_eng_part_ds'
        },
        columnChooser: {
            enabled: false
        },

    };


    $scope.dg_eng_ad_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },




        { dataField: 'reference', caption: 'AD/SB Reference', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 100 },
        { dataField: 'subject', caption: 'Subject', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'remark', caption: 'Remark', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'date_due', caption: 'Due Date', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        {
            caption: 'Remaining',
            alignment: 'center',
            columns: [
                { dataField: '', caption: 'Day', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
                { dataField: 'remaining_cycles', caption: 'Cycle', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },

            ]
        },



    ];



    $scope.dg_eng_ad_selected = null;
    $scope.dg_eng_ad_instance = null;
    $rootScope.dg_eng_ad_ds = null;
    $scope.dg_eng_ad_id = { id: null }
    $scope.dg_eng_ad = {



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
        height: ($(window).height() - 255) / 2,

        columns: $scope.dg_eng_ad_columns,
        onContentReady: function (e) {
            if (!$scope.dg_eng_ad_instance)
                $scope.dg_eng_ad_instance = e.component;

        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            $scope.dg_eng_ad_id.id = e.selectedRowsData[0].id;

            if (!data) {
                $scope.dg_eng_ad_selected = null;
            }
            else
                $scope.dg_eng_ad_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_eng_ad_ds'
        },
        columnChooser: {
            enabled: false
        },

    };


    /////////////////////////////

    $scope.engEntity = {}


    $scope.popup_eng_visible = false;
    $scope.popup_eng = {

        fullScreen: true,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {

                        $scope.engEntity =
                        {
                            id: null,
                            engEntity: null
                        };
                        $scope.popup_eng_visible = false;
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'remove', onClick: function (e) {

                        $scope.engEntity.aircraft_id = $scope.selectedTabId;
                        $scope.engEntity.date_initial = $scope.engEntity.date_initial == null ? null : moment($scope.engEntity.date_initial).format('YYYY-MM-DD')
                        if ($scope.engEntity.engine_no == 1)
                            $scope.engEntity.id = $scope.eng1Id
                        else
                            $scope.engEntity.id = $scope.eng2Id

                        mntService.saveEngStatus($scope.engEntity).then(function (response) {

                        });

                        $scope.popup_eng_visible = false;
                    }
                }, toolbar: 'bottom'
            },



        ],
        visible: false,

        closeOnOutsideClick: false,

        bindingOptions: {
            visible: 'popup_eng_visible',
            'toolbarItems[0].visible': 'btn_duties_visible',
            'toolbarItems[1].visible': 'btn_crewlist_visible',

        }
    };

    $scope.checkEntity = {};

    $scope.popup_tasks_visible = false;
    $scope.popup_tasks = {

        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        height: 600,
        width: 600,
        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {


                        $scope.popup_tasks_visible = false;
                    }



                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: '', onClick: function (e) {

                        $scope.checkEntity.date_initial = $scope.checkEntity.date_initial == null ? null : moment($scope.checkEntity.date_initial).format('YYYY-MM-DD');
                        $scope.checkEntity.aircraft_id = $scope.selectedTabId;
                        $scope.loadingVisible = true;
                        mntService.saveCheck($scope.checkEntity).then(function (response) {
                            console.log(response);
                            $scope.loadingVisible = false;
                            $scope.bind();
                            $scope.checkEntity = {};
                        });

                        $scope.popup_tasks_visible = false;
                    }
                }, toolbar: 'bottom'
            }


        ],
        visible: false,

        closeOnOutsideClick: false,
        bindingOptions: {
            visible: 'popup_tasks_visible',
            'toolbarItems[0].visible': 'btn_duties_visible',
            'toolbarItems[1].visible': 'btn_crewlist_visible',

        }
    };

    $scope.popup_ad_visible = false;
    $scope.popup_ad = {

        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        height: 600,
        width: 600,
        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {



                        $scope.popup_ad_visible = false;
                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: '', onClick: function (e) {

                        $scope.adEntity.date_initial = $scope.adEntity.date_initial == null ? null : moment($scope.adEntity.date_initial).format("YYYY-MM-DD");
                        $scope.adEntity.date_due = $scope.adEntity.date_due == null ? null : moment($scope.adEntity.date_due).format("YYYY-MM-DD");
                        $scope.adEntity.aircraft_id = $scope.selectedTabId;
                        $scope.loadingVisible = true;
                        mntService.saveADSB($scope.adEntity).then(function (response) {
                            console.log(response);
                            $scope.bind();
                            $scope.loadingVisible = false;
                            $scope.adEntity = {}

                        });

                        $scope.popup_ad_visible = false;
                    }
                }, toolbar: 'bottom'
            },


        ],
        visible: false,

        closeOnOutsideClick: false,
        bindingOptions: {
            visible: 'popup_ad_visible',
            'toolbarItems[0].visible': 'btn_duties_visible',
            'toolbarItems[1].visible': 'btn_crewlist_visible',

        }
    };

    $scope.popup_cat_visible = false;
    $scope.popup_cat = {

        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        height: 600,
        width: 600,
        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {



                        $scope.popup_cat_visible = false;
                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: '', onClick: function (e) {

                        $scope.catEntity.date_initial = $scope.catEntity.date_initial == null ? null : moment($scope.catEntity.date_initial).format("YYYY-MM-DD");
                        $scope.catEntity.date_due = $scope.catEntity.date_due == null ? null : moment($scope.catEntity.date_due).format("YYYY-MM-DD");
                        $scope.catEntity.engine_id = $scope.engEntity.id
                        $scope.loadingVisible = true;
                        mntService.saveEngLlp($scope.catEntity).then(function (response) {
                            console.log(response);
                            $scope.bindEng();
                            $scope.loadingVisible = false;
                            $scope.catEntity = {};
                        });

                        $scope.popup_cat_visible = false;
                    }
                }, toolbar: 'bottom'
            },

        ],
        visible: false,

        closeOnOutsideClick: false,
        bindingOptions: {
            visible: 'popup_cat_visible',
            'toolbarItems[0].visible': 'btn_duties_visible',
            'toolbarItems[1].visible': 'btn_crewlist_visible',

        }
    };

    $scope.popup_adsb_visible = false;
    $scope.popup_adsb = {

        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        height: 680,
        width: 600,
        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {



                        $scope.popup_adsb_visible = false;
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: '', onClick: function (e) {

                        $scope.engAdEntity.date_initial = $scope.engAdEntity.date_initial == null ? null : moment($scope.engAdEntity.date_initial).format("YYYY-MM-DD");
                        $scope.engAdEntity.date_due = $scope.engAdEntity.date_due == null ? null : moment($scope.engAdEntity.date_due).format("YYYY-MM-DD");
                        $scope.engAdEntity.engine_id = $scope.engEntity.id;
                        $scope.loadingVisible = true;
                        mntService.saveEngAdsb($scope.engAdEntity).then(function (response) {
                            console.log(response);
                            $scope.bindEng();
                            $scope.loadingVisible = false;
                            $scope.engAdEntity = {}
                        });

                        $scope.popup_adsb_visible = false;
                    }
                }, toolbar: 'bottom'
            },

        ],
        visible: false,

        closeOnOutsideClick: false,
        bindingOptions: {
            visible: 'popup_adsb_visible',
            'toolbarItems[0].visible': 'btn_duties_visible',
            'toolbarItems[1].visible': 'btn_crewlist_visible',

        }
    };


    $scope.loadingVisible = false;
    $scope.loadPanel = {
        message: 'Please wait...',

        showIndicator: true,
        showPane: true,
        shading: true,
        closeOnOutsideClick: false,
        shadingColor: "rgba(0,0,0,0.4)",
        onShown: function () {

        },
        onHidden: function () {

        },
        bindingOptions: {
            visible: 'loadingVisible'
        }
    };


}]);


