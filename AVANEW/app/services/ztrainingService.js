'use strict';
app.factory('ztrnService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {



    var serviceFactory = {};

    var _getCourseTypes = function () {
         
        var deferred = $q.defer();
        $http.get(zapitrn + 'api/course/types').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getCourseTypeGroups = function (cid) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/course/type/groups/'+cid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getCourseSessions = function (cid) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/course/sessions/'+cid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getCertificateTypes = function () {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/certificate/types').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getCoursePeople = function (cid) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/course/people/'+cid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) { 

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    //_getCoursePeopleSessions
    var _getCoursePeopleSessions = function (cid) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/course/peoplesessions/' + cid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveCourseType = function (entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/course/types/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _deleteCourseType = function (entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/course/types/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveCourse = function (entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/course/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _deleteCourse = function (entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/course/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveCertificate = function (entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/certificate/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveCoursePeople = function (entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/course/people/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _deleteCoursePeople = function (entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/course/people/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveCourseSessionPres = function (entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/course/session/pres/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveSessionsSync = function (entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/course/sessions/sync', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveCoursePeopleStatus = function (entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/course/people/status/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveCoursePeopleStatusAll = function (entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/course/people/status/all/save/new', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveCoursePeopleStatusSelected = function (entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/course/people/status/all/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getCourse = function (cid) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/course/' + cid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getCoursesByType = function (tid,sid) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/course/bytype/' + tid+'/'+sid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getCourseView = function (cid) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/course/view/' + cid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getCourseViewObject = function (cid) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/course/view/object/' + cid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getPersonCourses = function (pid) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/person/courses/' + pid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getPersonMandatoryCourses = function (pid) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/person/courses/mandatory/' + pid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    
    var _saveSessionsSyncGet = function (pid) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/course/sessions/sync/get/' + pid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _getMainGroups = function () {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/groups/main/'  ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getEmployees = function (root) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/employees/'+root).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getExpiring = function () {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/expiring/ct/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getExpiringMain = function (type) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/expiring/ct/main/'+type).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getExpiringGroup = function (type,group) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/expiring/ct/group/' + type + '/' + group).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    //api/courses/mandatory/people/{type}/{group}
    var _getCourseTypePeople = function (type, group) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/courses/mandatory/people/' + type + '/' + group).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
	 //2022-01-19
    var _getEmployee = function (id) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/employee/' + id  ).then(function (response) {
            deferred.resolve(response.data.Data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getEmployee = _getEmployee;



    var _getMainGroupsExpiring = function (main) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/groups/main/expiring/' + main + '/' ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getMainGroupsExpiring = _getMainGroupsExpiring;

    var _getGroupsExpiring = function (main,group) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/groups/expiring/' + main + '/' + group).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getGroupsExpiring = _getGroupsExpiring;

    var _getGroupsExpiringCourseTypes = function (main, group,type) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/groups/expiring/course/types/' + main + '/' + group+'/'+type).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getGroupsExpiringCourseTypes = _getGroupsExpiringCourseTypes;
    var _getExpiringByMainCode = function (main) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/expiring/ct/main/group/'+main).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getExpiringByMainCode = _getExpiringByMainCode;
	
	///////////////////////////////////
	var _getTeachers = function () {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/teacher/query').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getTeachers = _getTeachers;


    var _saveTeacher = function (entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/teacher/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.saveTeacher = _saveTeacher;

    //api/teacher/delete
    var _deleteTeacher = function(entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/teacher/delete', entity).then(function(response) {
            deferred.resolve(response.data);
        }, function(err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.deleteTeacher = _deleteTeacher;


    var _getTeacherCourses = function(id) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/teacher/courses/'+id).then(function(response) {
            deferred.resolve(response.data);
        }, function(err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getTeacherCourses = _getTeacherCourses;


    var _getGroups = function (cid) {

        return $http.get(serviceBase + 'odata/base/jobgroups/' + cid).then(function (results) {

            // console.log(results);

            return results;
        }
            //    , function (error) { console.log('errors'); console.log(error); }
        );
    };
    serviceFactory.getGroups = _getGroups;



    var _getCourseTypeByGroup = function (gid) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/course/type/groups/group/' + gid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getCourseTypeByGroup = _getCourseTypeByGroup;

    var _saveGroupTypeX = function (entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/course/type/group/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.saveGroupTypeX = _saveGroupTypeX;
	
	
	 var _getCourseAttendance = function (cid,pid) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/course/attendance/' + cid+'/'+pid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getCourseAttendance = _getCourseAttendance;



    var _saveCourseAttendance = function (entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/course/attendance/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.saveCourseAttendance = _saveCourseAttendance;



    var _deleteAttendance = function (entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/course/attendance/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.deleteAttendance = _deleteAttendance;
	
 
 var _courseNotify = function (cid,pids ) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/course/notify/' + cid+'/'+pids ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.courseNotify = _courseNotify;

    var _courseNotifyTeachers = function (cid ) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/course/notify/teacher/' + cid  ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.courseNotifyTeachers = _courseNotifyTeachers;


    var _saveSessionsSyncTeachersGet = function (pid) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/course/sessions/sync/teacher/get/' + pid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.saveSessionsSyncTeachersGet = _saveSessionsSyncTeachersGet;


    var _getCertificateUrl = function (pid, tid) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/certificate/url/' + pid + '/' + tid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getCertificateUrl = _getCertificateUrl;


    var _getDocumentUrl = function (pid, tid) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/document/url/' + pid + '/' + tid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getDocumentUrl = _getDocumentUrl;

    var _getCertificateObj_old = function (pid, tid) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/certificate/obj/' + pid + '/' + tid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
	
	
	var _getCertificateObj = function (pid, tid,str) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/certificate/obj/' + pid + '/' + tid+'/'+str).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getCertificateObj = _getCertificateObj;


    var _getTeacherDocuments = function (  tid) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/teacher/documents/'  + tid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getTeacherDocuments = _getTeacherDocuments;


    var _getTeachersReport = function (entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/teachers/report', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getTeachersReport = _getTeachersReport;
	
	
    var _getTrnStatCoursePeople = function (df, dt,  ct,   status,   cstatus,   cls,   pid,inst1,inst2,rank,active,grp) {
        var deferred = $q.defer();
        $http.get(zapitrn + 'api/trn/stat/coursepeople?df=' + df + '&dt=' + dt + '&ct=' + ct + '&status=' + status + '&cstatus=' + cstatus+'&cls='+cls+'&pid='+pid+'&inst1='+inst1+'&inst2='+inst2+'&rank='+rank+'&active='+active+'&grp='+grp).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getTrnStatCoursePeople = _getTrnStatCoursePeople;
	
	
	  var _savePersonDoc = function (entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/person/doc/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.savePersonDoc = _savePersonDoc;

    var _saveCourseFP = function (entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/course/pf/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.saveCourseFP = _saveCourseFP;
	
var _saveSyllabus = function (entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/course/syllabus/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.saveSyllabus = _saveSyllabus;
	
	 /////////////////////////
    var _getAllowedPeopleForCourse = function (id) {
        var deferred = $q.defer();
        $http.get(zapitrn + 'api/course/allowed/employees/'+id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getAllowedPeopleForCourse = _getAllowedPeopleForCourse;


    var _getTrnExpiringGroups = function () {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/trn/monitoring/expiring/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getTrnExpiringGroups = _getTrnExpiringGroups;
	
	
	 var _getTrnSchedule = function (y,m,mng_id) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/trn/schedule/'+y+'/'+m+'/'+mng_id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getTrnSchedule = _getTrnSchedule;
	
	var _getCourseDS = function () {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/course/query/'   ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getCourseDS = _getCourseDS;
	
	
	
	
	  var _getTrnSchedule = function (y,m,mng_id) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/trn/schedule/'+y+'/'+m+'/'+mng_id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getTrnSchedule = _getTrnSchedule;

    var _getTrnYearScheduleType = function (y, t,mng_id) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/trn/schedule/year/type/' + y + '/' +t+'/'+mng_id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getTrnYearScheduleType = _getTrnYearScheduleType;


    var _getTrnYearMonthScheduleType = function (y,m, t,mng_id) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/trn/schedule/year/month/type/' + y + '/'+m+'/' + t+'/'+mng_id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getTrnYearMonthScheduleType = _getTrnYearMonthScheduleType;



    var _getTrnProfilesAbs = function (g) {
          g =g=='All'?'-1': g.replace('/', 'x');
        var deferred = $q.defer();
        $http.get(zapitrn + 'api/profiles/abs/' + g ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getTrnProfilesAbs = _getTrnProfilesAbs;


    var _getTrnYearSchedulePerson = function (y, p) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/trn/schedule/year/person/' + y + '/' + p).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getTrnYearSchedulePerson = _getTrnYearSchedulePerson;


    var _getTrnYearMonthSchedulePerson = function (y, m, p) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/trn/schedule/year/month/person/' + y + '/' + m + '/' + p).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getTrnYearMonthSchedulePerson = _getTrnYearMonthSchedulePerson;


    var _getTrnScheduleYear = function (y,mng_id ) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/trn/schedule/year/' + y+'/'+mng_id ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getTrnScheduleYear = _getTrnScheduleYear;



    var _getTrnSummary = function (df,dt) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/trn/dashboard/report/summary/' + '?df='+df+'&dt='+dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getTrnSummary = _getTrnSummary;


    var _getRptCoursePerson = function (df, dt,pid) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/trn/dashboard/report/person/' +pid+ '?df=' + df + '&dt=' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getRptCoursePerson = _getRptCoursePerson;


    var _getRptCourseJobGroup = function (df, dt, ct,jg) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/trn/dashboard/report/group/' + ct+'/'+jg + '?df=' + df + '&dt=' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getRptCourseJobGroup = _getRptCourseJobGroup;



    var _getRptCourseType = function (df, dt ) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/trn/dashboard/report/type/'   + '?df=' + df + '&dt=' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getRptCourseType = _getRptCourseType;
	
	
	
	var _getManagerGroups = function (mng_id) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/trn/manager/groups/'  + mng_id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getManagerGroups = _getManagerGroups;
	
    var _generateQuestions = function (entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/trn/exam/questions/generate', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.generateQuestions = _generateQuestions;



    var _get_exam_summary = function (exam_id) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/exam/summary/' + exam_id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.get_exam_summary = _get_exam_summary;


    var _get_exam_results = function (exam_id) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/exam/results/' + exam_id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.get_exam_results = _get_exam_results;


    var _get_exam_person_results = function (exam_id,person_id) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/exam/person/results/' + exam_id + '/' + person_id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.get_exam_person_results = _get_exam_person_results;



    var _set_exam_status = function (entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/trn/exam/status', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.set_exam_status = _set_exam_status;


    var _regenerate_questions = function (entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/trn/exam/person/questions/generate', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.regenerate_questions = _regenerate_questions;


    var _get_ato_exam = function (exam_id, client_id) {
        var deferred = $q.defer();
        $http.get(zapitrn + 'api/client/exam/' + exam_id + '/' + client_id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.get_ato_exam = _get_ato_exam;


    var _get_templates = function () {
        var deferred = $q.defer();
        $http.get(zapitrn + 'api/question/templates/' ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.get_templates = _get_templates;
	
	
	 //war
    var _getCourseTypeSubjects = function (cid) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/course/types/subjects/' + cid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getCourseTypeSubjects = _getCourseTypeSubjects;

    var _copy_people = function (entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/course/people/copy', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.copy_people = _copy_people;


    var _getCoursePeopleNames = function (cid) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/course/people/names/' + cid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getCoursePeopleNames = _getCoursePeopleNames;

    var _update_score = function (entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/course/save/score', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.update_score = _update_score;
	
	
	
	
	var _get_exams = function (cid) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/exams'  ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.get_exams = _get_exams;
    /////////////////////////
    var _save_exam = function (entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/trn/exam/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.save_exam = _save_exam;
    //api/trn/exam/questions/generate/new
    var _save_exam_questions = function (entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/trn/exam/questions/generate/new', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.save_exam_questions = _save_exam_questions;
    var _get_courses = function () {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/course/query/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.get_courses = _get_courses;
    //api/trn/exam/template/{id}
    var _get_temps = function (id) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/trn/exam/template/'+id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.get_temps = _get_temps;

    //api/trn/exam/follow/
    var _get_exam_followup = function (id) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/trn/exam/follow/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.get_exam_followup = _get_exam_followup;
    //api/trn/exam/people/{id}
    var _get_exam_people = function (id) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/trn/exam/people/'+id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.get_exam_people = _get_exam_people;



    
    //api/trn/exam/questions/generate/new
    var _save_press_all = function (entity) {
        var deferred = $q.defer();
        $http.post(zapitrn + 'api/course/session/pres/save/all', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.save_press_all = _save_press_all;
	
	
	
	
	var _get_filter_types = function () {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/filter/types/' ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.get_filter_types = _get_filter_types;
	
	
	var _get_filter_people = function () {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/filter/people/' ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.get_filter_people = _get_filter_people;
	
	
	
	var _get_courses_ds = function (type,pid) {

        var deferred = $q.defer();
        $http.get(zapitrn + 'api/courses/'+type+'/'+pid ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.get_courses_ds = _get_courses_ds;
    /////////////////////////
    serviceFactory.getExpiring = _getExpiring;
    serviceFactory.getExpiringMain = _getExpiringMain;
    serviceFactory.getExpiringGroup = _getExpiringGroup;
    serviceFactory.getCourseTypePeople = _getCourseTypePeople;

    serviceFactory.getMainGroups = _getMainGroups;
    serviceFactory.getEmployees = _getEmployees;
    serviceFactory.getPersonCourses = _getPersonCourses;
    serviceFactory.getPersonMandatoryCourses = _getPersonMandatoryCourses;
    serviceFactory.getCourseView = _getCourseView;
    serviceFactory.getCourseViewObject = _getCourseViewObject;
    serviceFactory.getCourse = _getCourse;
    serviceFactory.getCourseTypes = _getCourseTypes;
    serviceFactory.getCoursesByType = _getCoursesByType;
    serviceFactory.getCourseTypeGroups = _getCourseTypeGroups;
    serviceFactory.getCertificateTypes = _getCertificateTypes;
    serviceFactory.saveCourseType = _saveCourseType;
    serviceFactory.deleteCourseType = _deleteCourseType;
    serviceFactory.saveCourse = _saveCourse;
    serviceFactory.deleteCourse = _deleteCourse;
    serviceFactory.saveCertificate = _saveCertificate;
    serviceFactory.saveCourseSessionPres = _saveCourseSessionPres;
    serviceFactory.saveSessionsSync = _saveSessionsSync;
    serviceFactory.saveSessionsSyncGet = _saveSessionsSyncGet;
    serviceFactory.saveCoursePeople = _saveCoursePeople;
    serviceFactory.deleteCoursePeople = _deleteCoursePeople;
    serviceFactory.saveCoursePeopleStatus = _saveCoursePeopleStatus;
    serviceFactory.saveCoursePeopleStatusAll = _saveCoursePeopleStatusAll;
    serviceFactory.saveCoursePeopleStatusSelected = _saveCoursePeopleStatusSelected;
    serviceFactory.getCourseSessions = _getCourseSessions;
    serviceFactory.getCoursePeople = _getCoursePeople;
    serviceFactory.getCoursePeopleSessions = _getCoursePeopleSessions;
    return serviceFactory;

}]);