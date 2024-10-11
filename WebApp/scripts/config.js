Config = {};
Config.CustomerId =1;
Config.AirlineId = 10;
Config.AirlineId = 27;
//Config.CustomerId = 1;
//Config.AirlineId = 10;
//Config.User = {};
//Config.CurrentLocation = {};
// Config.serviceRoot = 'http://localhost:53121/';
//Config.webRoot = 'http://localhost:7386/';
//Config.reportRoot = 'http://localhost:9440/';
//Config.reportViewer = Config.reportRoot + 'viewer.aspx';
//Config.serviceUrl = Config.serviceRoot + 'api/';
//Config.serviceUrlOData = 'http://localhost:53121/OData/';
//Config.fileHandlerUrl = Config.webRoot + 'filehandler.ashx';
//Config.clientsFilesUrl = Config.webRoot + 'upload/images/clientsfiles/';

Config.Text_NoRowSelected = 'No Row(s) Selected';
Config.Text_NoFlightSelected = 'No Flight(s) Selected';
Config.Text_NoSarfaslSelected = 'هیچ سرفصلی انتخاب نشده است';
Config.Text_DeleteConfirm = 'The selected row will be deleted. Are you sure?';
Config.Text_SimpleConfirm = 'Are you sure?';
Config.Text_CanNotDelete = 'The selected cannot be deleted';
Config.Text_CanNotEdit = 'این ردیف قابل ویرایش نمی باشد';
Config.Text_FillRequired = 'Please fill in all required fields.';
Config.Text_SavedOk = 'The changes have been successfully saved.';
Config.Text_SameItemExist = 'Same item exists.';
Config.Text_GanttErrors = 'Gaps & Overlaps';
Config.Text_InvalidDates = 'Invalid Dates';
Config.Text_OffBlock = 'Off Block Value is invalid';
Config.Text_TakeOff = 'Take Off Value is invalid';
Config.Text_Landing = 'Landing Value is invalid';
Config.Text_OnBlock = 'On Block Value is invalid';
Config.Text_DelayCodesNETotalDelay = 'Delay Codes Validation Error';
Config.Text_CancelReason = 'Cancellation Reason Error';
Config.Text_DiversionReason = 'Diversion Reason Error';
Config.Text_RampReason = 'Returning To Ramp Reason Error';
Config.Text_StatusTime = 'Status Time Error';
Config.Text_DiversionAltAirport = 'Alternate Airport Error';
Config.LocalData = {};


/////////////////////////////////
Config.Types = [
    { type: 'airport', table: 'ViewAirport' },
   // { type: 'aidnc', table: 'ViewAid' },

];
Config.Fields = [
    //ViewAid
    { table: "ViewAirport", key: "CityId", value: "CityId" },
    { table: "ViewAirport", key: "Name", value: "Name" },
    { table: "ViewAirport", key: "IATA", value: "IATA" },
    { table: "ViewAirport", key: "ICAO", value: "ICAO" },


];

Config.MenuItems = [
    { moduleId: 2, key: 'library_book', title: 'Books', url: '/library/83/-1/-1', icon: 'content/images/booksg.png' },
    { moduleId: 2, key: 'library_video', title: 'Videos', url: '/library/85/-1/-1', icon: 'content/images/Videos2.png' },
    { moduleId: 2, key: 'library_paper', title: 'Papers', url: '/library/84/-1/-1', icon: 'content/images/Papers2.png' },
    { moduleId: 2, key: 'library_document', title: 'Documents', url: '/document', icon: 'content/images/docs2.png' },
    { moduleId: 2, key: 'library_people', title: 'People', url: '/person/book', icon: 'content/images/study2.png' },

    { moduleId: 2, key: 'library_notification', title: 'Notifications', url: '/notification', icon: 'content/images/notification2.png' },
    { moduleId: 2, key: 'library_publisher', title: 'Publishers', url: '/publisher', icon: 'content/images/publisher2.png' },
    { moduleId: 2, key: 'library_author', title: 'Authors', url: '/author', icon: 'content/images/quill2.png' },
    { moduleId: 2, key: 'library_journal', title: 'Journals', url: '/journal', icon: 'content/images/newspaper2.png' },
    { moduleId: 2, key: 'library_conference', title: 'Conferences', url: '/conference', icon: 'content/images/teamwork2.png' },


      { moduleId: 1, key: 'profile_users', title: 'Users', url: '/users', icon: 'content/images/shield.png' },
    { moduleId: 1, key: 'profile_person', title: 'Employees', url: '/person', icon: 'content/images/group2.png' },
    { moduleId: 1, key: 'profile_course_person', title: 'Courses', url: '/course/person', icon: 'content/images/course2.png' },
    { moduleId: 1, key: 'profile_person_certificate', title: 'Certificates', url: '/person/certificate', icon: 'content/images/certificates2.png' },
    { moduleId: 1, key: 'profile_person_course', title: 'Employees Courses', url: '/person/course', icon: 'content/images/setting2.png' },
    { moduleId: 1, key: 'profile_course', title: 'Archive', url: '/course', icon: 'content/images/cabinets2.png' },
   
      { moduleId: 1, key: 'profile_course_type', title: 'Course Type', url: '/course/type', icon: 'content/images/types2.png' },
   
    { moduleId: 1, key: 'profile_location', title: 'Departments', url: '/location', icon: 'content/images/office2.png' },
    
    { moduleId: 1, key: 'profile_aircrafttype', title: 'Aircraft Types', url: '/aircrafttype', icon: 'content/images/actype2.png' },
    
    { moduleId: 1, key: 'profile_educationfield', title: 'Education Fields', url: '/option/59', icon: 'content/images/fields2.png' },
    
    { moduleId: 1, key: 'profile_post', title: 'Posts', url: '/option/36', icon: 'content/images/diagram2.png' },
  
    { moduleId: 1, key: 'profile_group', title: 'Groups', url: '/jobgroup', icon: 'content/images/circle2.png' },

    { moduleId: 1, key: 'profile_airports', title: 'Airports', url: '/airport', icon: 'content/images/airport.png' },


    { moduleId: 3, key: 'profile_person', title: 'Employees', url: '/person', icon: 'content/images/group2.png' },
    { moduleId: 3, key: 'flight_planning', title: 'Planning', url: '/commercial/planning', icon: 'content/images/actype2.png' },
     { moduleId: 3, key: 'flight_planning_board', title: 'Planning Board', url: '/plan/board', icon: 'content/images/actype2.png' },

     { moduleId: 3, key: 'flight_plans', title: 'Plans', url: '/commercial/plans', icon: 'content/images/actype2.png' },

    { moduleId: 3, key: 'flight_assign_register', title: 'Registers', url: '/maintenance/flights/calendar', icon: 'content/images/actype2.png' },
     { moduleId: 3, key: 'flight_change_register', title: 'Registers', url: '/maintenance/flights/registers', icon: 'content/images/actype2.png' },
    { moduleId: 3, key: 'flight_assign_crew_cockpit', title: 'FDPs (Cockpit)', url: '/crewtest', icon: 'content/images/actype2.png' },
    { moduleId: 3, key: 'flight_assign_crew_cabin', title: 'FDPs (Cabin)', url: '/crewtest', icon: 'content/images/actype2.png' },

     { moduleId: 3, key: 'flight_assign_crew_cockpit', title: 'FDPs (Cockpit)', url: '/crewtest', icon: 'content/images/actype2.png' },
    { moduleId: 3, key: 'flight_assign_crew_cabin', title: 'FDPs (Cabin)', url: '/crewtest', icon: 'content/images/actype2.png' },
    
    { moduleId: 3, key: 'roster', title: 'Crew Scheduler', url: '/roster', icon: 'content/images/actype2.png' },
{ moduleId: 3, key: 'flight_calendar_cockpit', title: 'Calendar (Cockpit)', url: '/crewtest', icon: 'content/images/actype2.png' },
{ moduleId: 3, key: 'flight_calendar_cabin', title: 'Calendar (Cabin)', url: '/crewtest', icon: 'content/images/actype2.png' },


    { moduleId: 3, key: 'flight_fuel', title: 'Fuel', url: '/fuel/report', icon: 'content/images/fuel.png' },
    { moduleId: 3, key: 'flight_crew', title: 'Crew', url: '/crew/report', icon: 'content/images/actype2.png' },

     { moduleId: 3, key: 'flight_crew_time', title: 'Crew Flights', url: '/crew/time/report', icon: 'content/images/actype2.png' },
      { moduleId: 3, key: 'flight_roster', title: 'Daily Roster', url: '/roster', icon: 'content/images/actype2.png' },
       { moduleId: 3, key: 'flight_report', title: 'Flights', url: '/flights/report', icon: 'content/images/actype2.png' },

    { moduleId: 3, key: 'flight_board', title: 'Flight Board 1', url: '/flight/board', icon: 'content/images/actype2.png' },
     { moduleId: 3, key: 'flight_board_ceo', title: 'Flight Board ceo', url: '/flight/board/ceo', icon: 'content/images/actype2.png' },
     { moduleId: 3, key: 'flight_aog', title: 'Flight AOG 1', url: '/reg/availability', icon: 'content/images/actype2.png' },
      { moduleId: 3, key: 'flight_blocktime', title: 'Flight block Times', url: '/route', icon: 'content/images/actype2.png' },
    { moduleId: 3, key: 'flight_board_2', title: 'Flight Board 2', url: '/dispatch/flights/THR/0', icon: 'content/images/actype2.png' },
     
    { moduleId: 3, key: 'flight_airports', title: 'Airports', url: '/dispatch/airport', icon: 'content/images/airport.png' },
    { moduleId: 3, key: 'flight_archive', title: 'Flights Archive', url: '/flight/archive', icon: 'content/images/actype2.png' },
    { moduleId: 3, key: 'flight_delay', title: 'Delay', url: '/delay/report', icon: 'content/images/delay.png' },

    { moduleId: 3, key: 'flight_dc', title: 'Delay', url: '/delay/codes', icon: 'content/images/delay.png' },



     { moduleId: 3, key: 'fdr_report', title: 'FDR Report', url: '/fdr', icon: 'content/images/actype2.png' },
      { moduleId: 3, key: 'fin_report', title: 'Fin. Daily Report', url: '/fin/report', icon: 'content/images/actype2.png' },
       { moduleId: 3, key: 'fin_monthly_report', title: 'Fin. Monthly Report', url: '/fin/monthly/report', icon: 'content/images/actype2.png' },

         { moduleId: 3, key: 'delays_report', title: 'Delays Report', url: '/delays', icon: 'content/images/actype2.png' },


           { moduleId: 3, key: 'atr_forma', title: 'Form A', url: '/forma', icon: 'content/images/forma.png' },
    { moduleId: 3, key: 'atr_citypair', title: 'City-Pair Report', url: '/citypair', icon: 'content/images/citypair.png' },



    { moduleId: 3, key: 'register_flights_report', title: 'Register Fix Time', url: '/reg/flights/monthly', icon: 'content/images/actype2.png' },

    { moduleId: 3, key: 'summary_flights_report', title: 'Register Fix Time', url: '/flights/monthly', icon: 'content/images/actype2.png' },

];

///////////////////////////////
Exceptions = {};
Exceptions.getMessage = function (error) {

    

    if (error.data.ModelState) {

        if (error.data.ModelState.errs) {

            //console.log(error.data.ModelState.errs);
             
            return {
                message: error.data.ModelState.errs
            };
            //return
           // {
           //     message: "XXXXX" //error.data.ModelState.errs.j
           // };
        }
        else
            return {
                message: "Unknown error"
            };
    }
    if (error.data.indexOf('Location-04') != -1) {
        
        return {
            message: "Assigned employees found.The selected item cannot be deleted."
        };
    }
    if (error.data.indexOf('Location-03') != -1) {
        return { message: "Sub items found.The selected item cannot be deleted." };
    }
    //Option-06
    if (error.data.indexOf('Option-06') != -1) {
        return { message: "The selected item cannot be deleted." };
    }
    if (error.data.indexOf('Option-03:Employees found') != -1) {
        return { message: "Assigned employees found.The selected item cannot be deleted." };
    }
    if (error.data.indexOf('Option-04:Library item found') != -1) {
        return { message: "Assigned library items found.The selected item cannot be deleted." };
    }
    if (error.data.indexOf('Option-05:Course found') != -1) {
        return { message: "Assigned courses found.The selected item cannot be deleted." };
    }
    return { message:error.status+' '+ error.statusText+' '+error.data };
};
/////////////////////////////
Colors = {};
Colors.Palette = [
    
    '#ff275d',
    '#00b0f0',
    '#2cb77b',
    '#ffff00',
    '#ab85c3',
    '#a51a4d',
    '#7583ae',
    '#00FF00',
    '#ff9900',
    '#ff0000',
    '#5cffef',
    '#006395',
    '#ff0095',
    '#b4ff00',
    '#a11e9e',
    '#a11e38',
    '#a15c38',
    '#5a5c57',
    '#005f2a',
    '#00b2b1',
    '#6676ab',
    '#6676f6',
    '#661cf6',
    '#ff6100',
    '#3d3e34',
    '#7d9387',
    '#f6b2b1',
    '#f6b25a',
    '#f6765a',
    '#9f765a',
    '#9f76ab',
    
];
Colors.getRandom = function () {
    var color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
    return color;
};

Colors.getColor = function (index) {
    if (index <= Colors.Palette.length - 1)
        return Colors.Palette[index];
    return Colors.getRandom ();
};
Colors.getColorReverse = function (index) {
    if (index <= Colors.Palette.length - 1)
        return Colors.Palette[Colors.Palette.length - 1-index];
    return Colors.getRandom();
};



/////////////////////////////////////




