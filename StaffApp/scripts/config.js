Config = {};
Config.CustomerId = 1;
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

Config.Text_NoRowSelected = 'No Rows Selected';
Config.Text_NoSarfaslSelected = 'هیچ سرفصلی انتخاب نشده است';
Config.Text_DeleteConfirm = 'The selected row will be deleted. Are you sure?';
Config.Text_CanNotDelete = 'The selected cannot be deleted';
Config.Text_CanNotEdit = 'این ردیف قابل ویرایش نمی باشد';
Config.Text_FillRequired = 'Please fill in all required fields.';
Config.Text_SavedOk = 'The changes have been successfully saved.';
Config.Text_SameItemExist = 'Same item exists.';
Config.Text_SaveFailed = 'There Is Some Problem In Saveing';
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
    { key: 'applibrary', title: 'Library', url: '/applibrary', icon: '../../content/images/booksg.png' },
    { key: 'appflight', title: 'Flight', url: '/appflight', icon: '../../content/images/booksg.png' },
     { key: 'appflightstatistics', title: 'Flight', url: '/appflight', icon: '../../content/images/booksg.png' },
      { key: 'appflightlogbook', title: 'Flight', url: '/appflight', icon: '../../content/images/booksg.png' },

    { key: 'applibrary-book', title: 'Books', url: '/applibrary/books', icon: '../../content/images/booksg.png' },
    { key: 'applibrary-video', title: 'Videos', url: '/applibrary/videos', icon: '../../content/images/booksg.png' },
    { key: 'applibrary-paper', title: 'Papers', url: '/applibrary/papers', icon: '../../content/images/booksg.png' },

    { key: 'appcertificate-last', title: 'Last', url: '/appcertificate/last', icon: '../../content/images/booksg.png' },
    { key: 'appcertificate-all', title: 'All', url: '/appcertificate/all', icon: '../../content/images/booksg.png' },


    { key: 'appcourse-pending', title: 'Last', url: '/appcourse/pending', icon: '../../content/images/booksg.png' },
    { key: 'appcourse-active', title: 'All', url: '/appcourse/active', icon: '../../content/images/booksg.png' },
    { key: 'appcourse-archive', title: 'All', url: '/appcourse/archive', icon: '../../content/images/booksg.png' },
    { key: 'appmessage', title: 'Messages', url: '/appmessage', icon: '../../content/images/booksg.png' },
    { key: 'appdocument', title: 'Documents', url: '/appdocument', icon: '../../content/images/booksg.png' },
    { key: 'appdocumentother', title: 'Documents', url: '/appdocumentother', icon: '../../content/images/booksg.png' },
   { key: 'forms', title: 'Forms', url: '/forms', icon: '../../content/images/booksg.png' },
    { key: 'formsmain', title: 'Forms', url: '/formsmain', icon: '../../content/images/booksg.png' },
];

///////////////////////////////
Exceptions = {};
Exceptions.getMessage = function (error) {
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



