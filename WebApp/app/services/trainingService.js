'use strict';
app.factory('trnService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {



    var serviceFactory = {};

    var _getCourseTypes = function () {
         
        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/course/types').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getCourseTypeGroups = function (cid) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/course/type/groups/'+cid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getCourseSessions = function (cid) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/course/sessions/'+cid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getCertificateTypes = function () {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/certificate/types').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getCoursePeople = function (cid) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/course/people/'+cid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) { 

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    //_getCoursePeopleSessions
    var _getCoursePeopleSessions = function (cid) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/course/peoplesessions/' + cid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveCourseType = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseTRN + 'api/course/types/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _deleteCourseType = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseTRN + 'api/course/types/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveCourse = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseTRN + 'api/course/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _deleteCourse = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseTRN + 'api/course/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveCertificate = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseTRN + 'api/certificate/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveCoursePeople = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseTRN + 'api/course/people/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _deleteCoursePeople = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseTRN + 'api/course/people/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveCourseSessionPres = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseTRN + 'api/course/session/pres/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveSessionsSync = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseTRN + 'api/course/sessions/sync', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveCoursePeopleStatus = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseTRN + 'api/course/people/status/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getCourse = function (cid) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/course/' + cid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getCoursesByType = function (tid,sid) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/course/bytype/' + tid+'/'+sid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getCourseView = function (cid) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/course/view/' + cid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getCourseViewObject = function (cid) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/course/view/object/' + cid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getPersonCourses = function (pid) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/person/courses/' + pid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getPersonMandatoryCourses = function (pid) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/person/courses/mandatory/' + pid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    
    var _saveSessionsSyncGet = function (pid) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/course/sessions/sync/get/' + pid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _getMainGroups = function () {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/groups/main/'  ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getEmployees = function (root) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/employees/'+root).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getExpiring = function () {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/expiring/ct/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getExpiringMain = function (type) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/expiring/ct/main/'+type).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getExpiringGroup = function (type,group) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/expiring/ct/group/' + type + '/' + group).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    //api/courses/mandatory/people/{type}/{group}
    var _getCourseTypePeople = function (type, group) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/courses/mandatory/people/' + type + '/' + group).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    //2022-01-19
    var _getEmployee = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/employee/' + id  ).then(function (response) {
            deferred.resolve(response.data.Data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getEmployee = _getEmployee;



    var _getMainGroupsExpiring = function (main) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/groups/main/expiring/' + main + '/' ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getMainGroupsExpiring = _getMainGroupsExpiring;

    var _getGroupsExpiring = function (main,group) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/groups/expiring/' + main + '/' + group).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getGroupsExpiring = _getGroupsExpiring;

    var _getGroupsExpiringCourseTypes = function (main, group,type) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/groups/expiring/course/types/' + main + '/' + group+'/'+type).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getGroupsExpiringCourseTypes = _getGroupsExpiringCourseTypes;
    var _getExpiringByMainCode = function (main) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/expiring/ct/main/group/'+main).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getExpiringByMainCode = _getExpiringByMainCode;


    ////////////////////////
    var _getTeachers = function () {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/teacher/query').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getTeachers = _getTeachers;


    var _saveTeacher = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseTRN + 'api/teacher/save', entity).then(function (response) {
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
        $http.post(serviceBaseTRN + 'api/teacher/delete', entity).then(function(response) {
            deferred.resolve(response.data);
        }, function(err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.deleteTeacher = _deleteTeacher;


    var _getTeacherCourses = function(id) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/teacher/courses/'+id).then(function(response) {
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
        $http.get(serviceBaseTRN + 'api/course/type/groups/group/' + gid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getCourseTypeByGroup = _getCourseTypeByGroup;

    var _saveGroupTypeX = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseTRN + 'api/course/type/group/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.saveGroupTypeX = _saveGroupTypeX;


    var _getCourseAttendance = function (cid,pid) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/course/attendance/' + cid+'/'+pid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getCourseAttendance = _getCourseAttendance;



    var _saveCourseAttendance = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseTRN + 'api/course/attendance/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.saveCourseAttendance = _saveCourseAttendance;



    var _deleteAttendance = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseTRN + 'api/course/attendance/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.deleteAttendance = _deleteAttendance;



    var _courseNotify = function (cid,pids ) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/course/notify/' + cid+'/'+pids ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.courseNotify = _courseNotify;

    var _courseNotifyTeachers = function (cid ) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/course/notify/teacher/' + cid  ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.courseNotifyTeachers = _courseNotifyTeachers;


    var _saveSessionsSyncTeachersGet = function (pid) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/course/sessions/sync/teacher/get/' + pid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.saveSessionsSyncTeachersGet = _saveSessionsSyncTeachersGet;


    var _getCertificateUrl = function (pid, tid) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/certificate/url/' + pid + '/' + tid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getCertificateUrl = _getCertificateUrl;


    var _getDocumentUrl = function (pid, tid) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/document/url/' + pid + '/' + tid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getDocumentUrl = _getDocumentUrl;

    var _getCertificateObj = function (pid, tid,str) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/certificate/obj/' + pid + '/' + tid+'/'+str).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getCertificateObj = _getCertificateObj;


    var _getTeacherDocuments = function (  tid) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/teacher/documents/'  + tid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getTeacherDocuments = _getTeacherDocuments;


    var _getTeachersReport = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseTRN + 'api/teachers/report', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getTeachersReport = _getTeachersReport;


    var _getTrnStatCoursePeople = function (df, dt,  ct,   status,   cstatus,   cls,   pid,inst1,inst2,rank,active,grp) {
        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/trn/stat/coursepeople?df=' + df + '&dt=' + dt + '&ct=' + ct + '&status=' + status + '&cstatus=' + cstatus+'&cls='+cls+'&pid='+pid+'&inst1='+inst1+'&inst2='+inst2+'&rank='+rank+'&active='+active+'&grp='+grp).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getTrnStatCoursePeople = _getTrnStatCoursePeople;


    var _savePersonDoc = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseTRN + 'api/person/doc/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.savePersonDoc = _savePersonDoc;

    var _saveCourseFP = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseTRN + 'api/course/pf/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.saveCourseFP = _saveCourseFP;




    ////////////////////////
    /////////////////////////
    var _getAllowedPeopleForCourse = function (id) {
        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/course/allowed/employees/'+id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getAllowedPeopleForCourse = _getAllowedPeopleForCourse;


    var _getTrnExpiringGroups = function () {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/trn/monitoring/expiring/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getTrnExpiringGroups = _getTrnExpiringGroups;



    var _getTrnSchedule = function (y,m) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/trn/schedule/'+y+'/'+m).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getTrnSchedule = _getTrnSchedule;

    var _getTrnYearScheduleType = function (y, t) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/trn/schedule/year/type/' + y + '/' +t).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getTrnYearScheduleType = _getTrnYearScheduleType;


    var _getTrnYearMonthScheduleType = function (y,m, t) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/trn/schedule/year/month/type/' + y + '/'+m+'/' + t).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getTrnYearMonthScheduleType = _getTrnYearMonthScheduleType;



    var _getTrnProfilesAbs = function (g) {
        g = g.replace('/', 'x');
        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/profiles/abs/' + g ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getTrnProfilesAbs = _getTrnProfilesAbs;


    var _getTrnYearSchedulePerson = function (y, p) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/trn/schedule/year/person/' + y + '/' + p).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getTrnYearSchedulePerson = _getTrnYearSchedulePerson;


    var _getTrnYearMonthSchedulePerson = function (y, m, p) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/trn/schedule/year/month/person/' + y + '/' + m + '/' + p).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getTrnYearMonthSchedulePerson = _getTrnYearMonthSchedulePerson;


    var _getTrnScheduleYear = function (y ) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/trn/schedule/year/' + y ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getTrnScheduleYear = _getTrnScheduleYear;



    var _getTrnSummary = function (df,dt) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/trn/dashboard/report/summary/' + '?df='+df+'&dt='+dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getTrnSummary = _getTrnSummary;


    var _getRptCoursePerson = function (df, dt,pid) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/trn/dashboard/report/person/' +pid+ '?df=' + df + '&dt=' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getRptCoursePerson = _getRptCoursePerson;


    var _getRptCourseJobGroup = function (df, dt, ct,jg) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/trn/dashboard/report/group/' + ct+'/'+jg + '?df=' + df + '&dt=' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getRptCourseJobGroup = _getRptCourseJobGroup;



    var _getRptCourseType = function (df, dt ) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/trn/dashboard/report/type/'   + '?df=' + df + '&dt=' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getRptCourseType = _getRptCourseType;
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
    serviceFactory.getCourseSessions = _getCourseSessions;
    serviceFactory.getCoursePeople = _getCoursePeople;
    serviceFactory.getCoursePeopleSessions = _getCoursePeopleSessions;
    return serviceFactory;

}]);