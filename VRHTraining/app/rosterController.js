'use strict';
app.controller('rosterController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;
    $scope.dt_from = new Date();
    $scope.dt_to = new Date().addDays(0);
    $scope.dt_fromSearched=new Date();
    $scope.dt_toSearched = new Date().addDays(0);
    //$scope.dt_from = new Date(2020, 0, 21, 0, 0, 0);
    //$scope.dt_to = new Date(2020, 0, 24, 0, 0, 0);
    $scope.date_from = {
        type: "date",
        placeholder: 'From',
        width: '100%',
        onValueChanged:function(e){
            
        },
        bindingOptions: {
            value: 'dt_from',

        }
    };
    $scope.date_to = {
        type: "date",
        placeholder: 'To',
        width: '100%',

        bindingOptions: {
            value: 'dt_to',

        }
    };


    $scope.output = [];
    $scope.getPosition = function (pos) {
        switch (pos) {
            case 12000:
                return 'IP';
            case 1160:
                return 'P1';
            case 1161:
                return 'P2';
            case 1162:
                return 'Safety';
            case 10002:
                return 'ISCCM';
            case 1157:
                return 'SCCM';
            case 1158:
                return 'CCM';
            case 1153:
                return 'OBS';
            case 1154:
                return 'CHECK';
            default:
                return '';
        }
    };
    $scope.getPositionId = function (pos) {
        //when isnull(fi.PositionId,f.JobGroupId)=1160 then 'Captain'
        //when isnull(fi.PositionId,f.JobGroupId)=1161 then 'FO' 
        //when isnull(fi.PositionId,f.JobGroupId)=1162 then 'SO' 
        //when isnull(fi.PositionId,f.JobGroupId)=1163 then 'OBSP1' 
        //when isnull(fi.PositionId,f.JobGroupId)=1164 then 'OBSP2' 
        //when isnull(fi.PositionId,f.JobGroupId)=1205 then 'TRI' 
        //when isnull(fi.PositionId,f.JobGroupId)=1206 then 'TRE' 
        //when isnull(fi.PositionId,f.JobGroupId)=1158 then 'CCM' 
        //when isnull(fi.PositionId,f.JobGroupId)=1153 then 'CCM(OBS)' 
        //when isnull(fi.PositionId,f.JobGroupId)=1154 then 'Check' 

        //when isnull(fi.PositionId,f.JobGroupId)=1157 then 'SCCM' 
        //when isnull(fi.PositionId,f.JobGroupId)=1156 then 'SCCM2' 
        //when isnull(fi.PositionId,f.JobGroupId)=1155 then 'SCCM3' 
        //when isnull(fi.PositionId,f.JobGroupId)=10002 then 'ISCCM'
        switch (pos) {
            case 'IP':
            case 'IP1':
            case 'IP2':
                //return 1206;
                return 12000;
            case 'P1':
            case 'P12':
            case 'P13':
            case 'P14':
            case 'P15':
            case 'P11':
                return 1160;
            case 'P2':
            case 'P21':
            case 'P22':
            case 'P23':
            case 'P24':
            case 'P25':
                return 1161;
            case 'Safety':
            case 'Safety1':
            case 'Safety2':
                return 1162;
            case 'ISCCM':
            case 'ISCCM1':
                return 10002;
            case 'SCCM':
            case 'SCCM1':
            case 'SCCM2':
            case 'SCCM3':
            case 'SCCM4':
            case 'SCCM5':
                return 1157;
            case 'CCM':
            case 'CCM1':
            case 'CCM2':
            case 'CCM3':
            case 'CCM4':
            case 'CCM5':
                return 1158;
            case 'OBS':
            case 'OBS1':
            case 'OBS2':
                return 1153;
            case 'CHECK':
            case 'CHECK1':
            case 'CHECK2':
                return 1154;
            default:
                return null;
        }
    };
    $scope.addItem = function (data, pos,rpos) {
        //        {
        //            FlightId: 17020,
        //            PositionId: 1160,
        //            DH:false,
        //        },
        var crewId = data[pos];
        var dh = data[pos + 'DH'];
        var flightId = data.ID;
       
        var row = Enumerable.From($scope.output).Where('$.CrewId==' + crewId).FirstOrDefault();
        if (!row) {
            row = { CrewId: crewId, Flights: [] };
            $scope.output.push(row);
        }
        row.Flights.push({ FlightId: flightId, PositionId: $scope.getPositionId(pos), DH: dh,RosterPosition:rpos,STD: data.STD,STA:data.STA });

    };
    $scope.addItemDH2 = function (data, pos, rpos, crid) {
        //        {
        //            FlightId: 17020,
        //            PositionId: 1160,
        //            DH:false,
        //        },
        var crewId = crid ? crid : data[pos];
        var dh = true; //data[pos + 'DH'];
        var flightId = data.ID;
     
        var row = Enumerable.From($scope.output).Where('$.CrewId==' + crewId).FirstOrDefault();
        if (!row) {
            row = { CrewId: crewId, Flights: [] };
            $scope.output.push(row);
        }
        row.Flights.push({ FlightId: flightId, PositionId: $scope.getPositionId(pos), DH: dh, RosterPosition: rpos, STD: data.STD, STA: data.STA });

    };
    //zigi3
    $scope.getFlightCrews = function (fid) {
        var _d = Enumerable.From($scope.dg_ds).Where('$.ID==' + fid).FirstOrDefault();
        var crewIds = [];
        if (_d.IP   ) {
            var rec = { Id: _d.IP, Rank: 'IP', RankOrder: 0 };
            if (_d.IPDH)
                rec.DH = true;
            crewIds.push(rec);
            
        }
        if(_d.IP1)
        {
            var rec = { Id: _d.IP1, Rank: 'IP', RankOrder: 0 };
            if (_d.IP1DH)
                rec.DH = true;
            crewIds.push(rec);
        }
        if (_d.IP2) {
            var rec = { Id: _d.IP2, Rank: 'IP', RankOrder: 0 };
            if (_d.IP2DH)
                rec.DH = true;
            crewIds.push(rec);
        }

        //P1
        if (_d.P1 ) {
            var rec = { Id: _d.P1, Rank: 'P1', RankOrder: 1 };
            if (_d.P1DH)
                rec.DH = true;
            crewIds.push(rec);
        }
        if (_d.P11){
            var rec = { Id: _d.P11, Rank: 'P1', RankOrder: 1 };
            if (_d.P11DH)
                rec.DH = true;
            crewIds.push(rec);
        }
        if (_d.P12){
            var rec = { Id: _d.P12, Rank: 'P1', RankOrder: 1 };
            if (_d.P12DH)
                rec.DH = true;
            crewIds.push(rec);
        }
        if (_d.P13){
            var rec = { Id: _d.P13, Rank: 'P1', RankOrder: 1 };
            if (_d.P13DH)
                rec.DH = true;
            crewIds.push(rec);
        }
        if (_d.P14){
            var rec = { Id: _d.P14, Rank: 'P1', RankOrder: 1 };
            if (_d.P14DH)
                rec.DH = true;
            crewIds.push(rec);
        }
        if (_d.P15){
            var rec = { Id: _d.P15, Rank: 'P1', RankOrder: 1 };
            if (_d.P15DH)
                rec.DH = true;
            crewIds.push(rec);
        }

        //P2
        
        if (_d.P2) {
            var rec = { Id: _d.P2, Rank: 'P2', RankOrder: 2 };
            if (_d.P2DH)
                rec.DH = true;
            crewIds.push(rec);
        }
        if (_d.P21) {
            var rec = { Id: _d.P21, Rank: 'P2', RankOrder: 2 };
            if (_d.P21DH)
                rec.DH = true;
            crewIds.push(rec);
        }
        if (_d.P22) {
            var rec = { Id: _d.P22, Rank: 'P2', RankOrder: 2 };
            if (_d.P22DH)
                rec.DH = true;
            crewIds.push(rec);
        }
        if (_d.P23) {
            var rec = { Id: _d.P23, Rank: 'P2', RankOrder: 2 };
            if (_d.P23DH)
                rec.DH = true;
            crewIds.push(rec);
        }
        if (_d.P24) {
            var rec = { Id: _d.P24, Rank: 'P2', RankOrder: 2 };
            if (_d.P24DH)
                rec.DH = true;
            crewIds.push(rec);
        }
        if (_d.P25) {
            var rec = { Id: _d.P25, Rank: 'P2', RankOrder: 2 };
            if (_d.P25DH)
                rec.DH = true;
            crewIds.push(rec);
        }
        //Safety
        if (_d.Safety ) {
            var rec = { Id: _d.Safety, Rank: 'Safety', RankOrder: 3 };
            if (_d.SafetyDH)
                rec.DH = true;
            crewIds.push(rec);
        }
        if (  _d.Safety1 ) {
            var rec = { Id: _d.Safety1, Rank: 'Safety', RankOrder: 3 };
            if (_d.Safety1DH)
                rec.DH = true;
            crewIds.push(rec);
        }
        if (  _d.Safety2) {
            var rec = { Id: _d.Safety2, Rank: 'Safety', RankOrder: 3 };
            if (_d.Safety2DH)
                rec.DH = true;
            crewIds.push(rec);
        }

        //ISCCM
        if (  _d.ISCCM) {
            var rec = { Id: _d.ISCCM, Rank: 'ISCCM', RankOrder: 4 };
            if (_d.ISCCMDH)
                rec.DH = true;
            crewIds.push(rec);
        }
        if (_d.ISCCM1 ) {
            var rec = { Id: _d.ISCCM1, Rank: 'ISCCM1', RankOrder: 4 };
            if (_d.ISCCM1DH)
                rec.DH = true;
            crewIds.push(rec);
        }
        if (_d.ISCCM2) {
            var rec = { Id: _d.ISCCM2, Rank: 'ISCCM1', RankOrder: 4 };
            if (_d.ISCCM2DH)
                rec.DH = true;
            crewIds.push(rec);
        }
        //SCCM
        
        if (_d.SCCM) {
            var rec = { Id: _d.SCCM, Rank: 'SCCM', RankOrder: 5 };
            if (_d.SCCMDH)
                rec.DH = true;
            crewIds.push(rec);
        }
        if (_d.SCCM1) {
            var rec = { Id: _d.SCCM1, Rank: 'SCCM', RankOrder: 5 };
            if (_d.SCCM1DH)
                rec.DH = true;
            crewIds.push(rec);
        }
        if (_d.SCCM2) {
            var rec = { Id: _d.SCCM2, Rank: 'SCCM', RankOrder: 5 };
            if (_d.SCCM2DH)
                rec.DH = true;
            crewIds.push(rec);
        }
        if (_d.SCCM3) {
            var rec = { Id: _d.SCCM3, Rank: 'SCCM', RankOrder: 5 };
            if (_d.SCCM3DH)
                rec.DH = true;
            crewIds.push(rec);
        }
        if (_d.SCCM4) {
            var rec = { Id: _d.SCCM4, Rank: 'SCCM', RankOrder: 5 };
            if (_d.SCCM4DH)
                rec.DH = true;
            crewIds.push(rec);
        }
        if (_d.SCCM5) {
            var rec = { Id: _d.SCCM5, Rank: 'SCCM', RankOrder: 5 };
            if (_d.SCCM5DH)
                rec.DH = true;
            crewIds.push(rec);
        }
       

        //CCM
        
        if (_d.CCM) {
            var rec = { Id: _d.CCM, Rank: 'CCM', RankOrder: 6 };
            if (_d.CCMDH)
                rec.DH = true;
            crewIds.push(rec);
        }
        if (_d.CCM1) {
            var rec = { Id: _d.CCM1, Rank: 'CCM', RankOrder: 6 };
            if (_d.CCM1DH)
                rec.DH = true;
            crewIds.push(rec);
        }
        if (_d.CCM2) {
            var rec = { Id: _d.CCM2, Rank: 'CCM', RankOrder: 6 };
            if (_d.CCM2DH)
                rec.DH = true;
            crewIds.push(rec);
        }
        if (_d.CCM3) {
            var rec = { Id: _d.CCM3, Rank: 'CCM', RankOrder: 6 };
            if (_d.CCM3DH)
                rec.DH = true;
            crewIds.push(rec);
        }
        if (_d.CCM4) {
            var rec = { Id: _d.CCM4, Rank: 'CCM', RankOrder: 6 };
            if (_d.CCM4DH)
                rec.DH = true;
            crewIds.push(rec);
        }
        if (_d.CCM5) {
            var rec = { Id: _d.CCM5, Rank: 'CCM', RankOrder: 6 };
            if (_d.CCM5DH)
                rec.DH = true;
            crewIds.push(rec);
        }
        //OBS
        if (_d.OBS) {
            var rec = { Id: _d.OBS, Rank: 'OBS', RankOrder: 7 };
            if (_d.OBSDH)
                rec.DH = true;
            crewIds.push(rec);
        }
        if (_d.OBS1) {
            var rec = { Id: _d.OBS1, Rank: 'OBS', RankOrder: 7 };
            if (_d.OBS1DH)
                rec.DH = true;
            crewIds.push(rec);
        }
        if (_d.OBS2) {
            var rec = { Id: _d.OBS2, Rank: 'OBS', RankOrder: 7 };
            if (_d.OBS2DH)
                rec.DH = true;
            crewIds.push(rec);
        }
        //Check
         
        if (_d.CHECK) {
            var rec = { Id: _d.CHECK, Rank: 'CHECK', RankOrder: 8 };
            if (_d.CHECKDH)
                rec.DH = true;
            crewIds.push(rec);
        }
        if (_d.CHECK1) {
            var rec = { Id: _d.CHECK1, Rank: 'CHECK', RankOrder: 8 };
            if (_d.CHECK1DH)
                rec.DH = true;
            crewIds.push(rec);
        }
        if (_d.CHECK2) {
            var rec = { Id: _d.CHECK2, Rank: 'CHECK', RankOrder: 8 };
            if (_d.CHECK2DH)
                rec.DH = true;
            crewIds.push(rec);
        }

        $.each(crewIds, function (_i, _d) {
            var c = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.Id).FirstOrDefault();
            _d.Name = c.ScheduleName;
        });

        return crewIds;

    };
    $scope.getCrewFlights = function (crewId) {
        var flights = [];
         $.each($scope.dg_ds, function (_i, _d) {
        //    if (_d.IP ==crewId || _d.IP1==crewId || _d.IP2==crewId
        //        || _d.P1==crewId || _d.P11==crewId || _d.P12==crewId || _d.P13==crewId || _d.P14==crewId || _d.P15==crewId
        //        || _d.P2==crewId || _d.P21==crewId || _d.P22==crewId || _d.P23==crewId || _d.P24==crewId || _d.P25==crewId
        //        || _d.Safety1==crewId || _d.Safety2==crewId
        //        || _d.ISCCM1==crewId
        //        || _d.SCCM==crewId || _d.SCCM1==crewId || _d.SCCM2==crewId || _d.SCCM3==crewId || _d.SCCM4==crewId || _d.SCCM5==crewId
        //         || _d.CCM==crewId || _d.CCM1==crewId || _d.CCM2==crewId || _d.CCM3==crewId || _d.CCM4==crewId || _d.CCM5==crewId
        //        || _d.OBS1==crewId || _d.OBS2==crewId
        //         || _d.CHECK1==crewId || _d.CHECK2==crewId
        //        )
             if (_d.IP ==crewId || _d.IP1==crewId || _d.IP2==crewId) {
                
                 flights.push({ No: _d.FlightNumber, rank: 'IP' });
             }
             
             //P1
             if (_d.P1 == crewId || _d.P11 == crewId || _d.P12 == crewId || _d.P13 == crewId || _d.P14 == crewId || _d.P15 == crewId) {
                 flights.push({ No: _d.FlightNumber, rank: 'P1' });
             }
            
             //P2
             if (_d.P2 == crewId || _d.P21 == crewId || _d.P22 == crewId || _d.P23 == crewId || _d.P24 == crewId || _d.P25 == crewId) {
                 flights.push({ No: _d.FlightNumber, rank: 'P2' });
             }
             
             //Safety
             if (_d.Safety == crewId || _d.Safety1 == crewId || _d.Safety2 == crewId) {
                 flights.push({ No: _d.FlightNumber, rank: 'Safety' });
             }
             
             //ISCCM
             if (_d.ISCCM1 == crewId || _d.ISCCM==crewId) {
                 flights.push({ No: _d.FlightNumber, rank: 'ISCCM' });
             }
             //SCCM
             if (_d.SCCM == crewId || _d.SCCM1 == crewId || _d.SCCM2 == crewId || _d.SCCM3 == crewId || _d.SCCM4 == crewId || _d.SCCM5 == crewId) {
                 flights.push({ No: _d.FlightNumber, rank: 'SCCM' });
             }
             
             //CCM
             if (_d.CCM == crewId || _d.CCM1 == crewId || _d.CCM2 == crewId || _d.CCM3 == crewId || _d.CCM4 == crewId || _d.CCM5 == crewId) {
                 flights.push({ No: _d.FlightNumber, rank: 'CCM' });
             }
             
             //OBS
             if (_d.OBS1 == crewId || _d.OBS2 == crewId || _d.OBS) {
                 flights.push({ No: _d.FlightNumber, rank: 'OBS' });

             }
             
             //Check
             if (_d.CHECK1 == crewId || _d.CHECK2 == crewId || _d.CHECK==crewId) {
                 flights.push({ No: _d.FlightNumber, rank: 'CHECK' });

             }
             
             if (_d.DHs) {
                 var _dhs = Enumerable.From(_d.DHs).Where('$.Id==' + crewId).FirstOrDefault();
                 if (_dhs)
                     flights.push({No:_dhs.FlightNumber+'DH',rank:_dhs.Position,DH:true});

             }
           
         });
         var ranks = Enumerable.From(flights)
             .Distinct('$.rank').ToArray().length;
         //if (ranks == 1)
             return Enumerable.From(flights).Select('$.No').ToArray().join('-');
        //else
        //     return Enumerable.From(flights).Select(function (x) {
         //        return x.No + '(' + x.rank + ')';
        //     }).ToArray().join('-');
    };
    $scope.getCrewFlightsObj = function (crewId) {
        var flights = [];
        $.each($scope.dg_ds, function (_i, _d) {
           
            if (_d.IP == crewId || _d.IP1 == crewId || _d.IP2 == crewId) {

                flights.push({ No: _d.FlightNumber, rank: 'IP',Id:_d.ID,STD:_d.STD,ToIATA:_d.ToAirportIATA,To:_d.ToAirport, FlightTime:_d.FlightTimeActual?_d.FlightTimeActual:_d.FlightTime });
            }

            //P1
            if (_d.P1 == crewId || _d.P11 == crewId || _d.P12 == crewId || _d.P13 == crewId || _d.P14 == crewId || _d.P15 == crewId) {
                flights.push({ No: _d.FlightNumber, rank: 'P1', Id: _d.ID, STD: _d.STD, ToIATA: _d.ToAirportIATA, To: _d.ToAirport, FlightTime: _d.FlightTimeActual ? _d.FlightTimeActual : _d.FlightTime });
            }

            //P2
            if (_d.P2 == crewId || _d.P21 == crewId || _d.P22 == crewId || _d.P23 == crewId || _d.P24 == crewId || _d.P25 == crewId) {
                flights.push({ No: _d.FlightNumber, rank: 'P2', Id: _d.ID, STD: _d.STD, ToIATA: _d.ToAirportIATA, To: _d.ToAirport, FlightTime: _d.FlightTimeActual ? _d.FlightTimeActual : _d.FlightTime });
            }

            //Safety
            if (_d.Safety == crewId || _d.Safety1 == crewId || _d.Safety2 == crewId) {
                flights.push({ No: _d.FlightNumber, rank: 'Safety', Id: _d.ID, STD: _d.STD, ToIATA: _d.ToAirportIATA, To: _d.ToAirport, FlightTime: _d.FlightTimeActual ? _d.FlightTimeActual : _d.FlightTime });
            }

            //ISCCM
            if (_d.ISCCM1 == crewId || _d.ISCCM == crewId) {
                flights.push({ No: _d.FlightNumber, rank: 'ISCCM', Id: _d.ID, STD: _d.STD, ToIATA: _d.ToAirportIATA, To: _d.ToAirport, FlightTime: _d.FlightTimeActual ? _d.FlightTimeActual : _d.FlightTime });
            }
            //SCCM
            if (_d.SCCM == crewId || _d.SCCM1 == crewId || _d.SCCM2 == crewId || _d.SCCM3 == crewId || _d.SCCM4 == crewId || _d.SCCM5 == crewId) {
                flights.push({ No: _d.FlightNumber, rank: 'SCCM', Id: _d.ID, STD: _d.STD, ToIATA: _d.ToAirportIATA, To: _d.ToAirport, FlightTime: _d.FlightTimeActual ? _d.FlightTimeActual : _d.FlightTime });
            }

            //CCM
            if (_d.CCM == crewId || _d.CCM1 == crewId || _d.CCM2 == crewId || _d.CCM3 == crewId || _d.CCM4 == crewId || _d.CCM5 == crewId) {
                flights.push({ No: _d.FlightNumber, rank: 'CCM', Id: _d.ID, STD: _d.STD, ToIATA: _d.ToAirportIATA, To: _d.ToAirport, FlightTime: _d.FlightTimeActual ? _d.FlightTimeActual : _d.FlightTime });
            }

            //OBS
            if (_d.OBS1 == crewId || _d.OBS2 == crewId || _d.OBS) {
                flights.push({ No: _d.FlightNumber, rank: 'OBS', Id: _d.ID, STD: _d.STD, ToIATA: _d.ToAirportIATA, To: _d.ToAirport, FlightTime: _d.FlightTimeActual ? _d.FlightTimeActual : _d.FlightTime });

            }

            //Check
            if (_d.CHECK1 == crewId || _d.CHECK2 == crewId || _d.CHECK == crewId) {
                flights.push({ No: _d.FlightNumber, rank: 'CHECK', Id: _d.ID, STD: _d.STD, ToIATA: _d.ToAirportIATA, To: _d.ToAirport, FlightTime: _d.FlightTimeActual ? _d.FlightTimeActual : _d.FlightTime });

            }


        });
        return flights;
    };
    $scope.btn_save = {
        text: 'Save',
        type: 'default',
        // icon: 'search',
        width: 120,
        // validationGroup: 'ctrsearch',
        bindingOptions: { disabled: 'btnGanttDisabled' },
        onClick: function (e) {
          
            //return;
            $scope.output = [];
            $.each($scope.dg_ds, function (_i, _d) {
                if (_d.IP) {
                    $scope.addItem(_d, 'IP',1);
                }
                if (_d.IP1) {
                    $scope.addItem(_d, 'IP1',1);
                }
                if (_d.IP2) {
                    $scope.addItem(_d, 'IP2',2);
                }
                //P1
                if (_d.P1) {
                    $scope.addItem(_d, 'P1',1);
                }
                if (_d.P11) {
                    $scope.addItem(_d, 'P11',1);
                }
                if (_d.P12) {
                    $scope.addItem(_d, 'P12',2);
                }
                if (_d.P13) {
                    $scope.addItem(_d, 'P13',3);
                }
                if (_d.P14) {
                    $scope.addItem(_d, 'P14',4);
                }
                if (_d.P15) {
                    $scope.addItem(_d, 'P15',5);
                }
                //P2
                if (_d.P2) {
                    $scope.addItem(_d, 'P2',1);
                }
                if (_d.P21) {
                    $scope.addItem(_d, 'P21',1);
                }
                if (_d.P22) {
                    $scope.addItem(_d, 'P22',2);
                }
                if (_d.P23) {
                    $scope.addItem(_d, 'P23',3);
                }
                if (_d.P24) {
                    $scope.addItem(_d, 'P24',4);
                }
                if (_d.P25) {
                    $scope.addItem(_d, 'P25',5);
                }
                //Safety
                if (_d.Safety) {
                    $scope.addItem(_d, 'Safety',1);
                }
                if (_d.Safety1) {
                    $scope.addItem(_d, 'Safety1',1);
                }
                if (_d.Safety2) {
                    $scope.addItem(_d, 'Safety2',2);
                }
                //ISCCM
                if (_d.ISCCM1) {
                    $scope.addItem(_d, 'ISCCM1',1);
                }
                //SCCM
                if (_d.SCCM) {
                    $scope.addItem(_d, 'SCCM',1);
                }
                if (_d.SCCM5) {
                    $scope.addItem(_d, 'SCCM5',5);
                }
                if (_d.SCCM1) {
                    $scope.addItem(_d, 'SCCM1',1);
                }
                if (_d.SCCM2) {
                    $scope.addItem(_d, 'SCCM2',2);
                }
                if (_d.SCCM3) {
                    $scope.addItem(_d, 'SCCM3',3);
                }
                if (_d.SCCM4) {
                    $scope.addItem(_d, 'SCCM4',4);
                }
                //CCM
                if (_d.CCM1) {
                    $scope.addItem(_d, 'CCM1',1);
                }
                if (_d.CCM2) {
                    $scope.addItem(_d, 'CCM2',2);
                }
                if (_d.CCM3) {
                    $scope.addItem(_d, 'CCM3',3);
                }
                if (_d.CCM4) {
                    $scope.addItem(_d, 'CCM4',4);
                }
                if (_d.CCM5) {
                    $scope.addItem(_d, 'CCM5',5);
                }
                //OBS
                if (_d.OBS1) {
                    $scope.addItem(_d, 'OBS1',1);

                }
                if (_d.OBS2) {
                    $scope.addItem(_d, 'OBS2',2);
                }
                //Check
                if (_d.CHECK1) {
                    $scope.addItem(_d, 'CHECK1',1);

                }
                if (_d.CHECK2) {
                    $scope.addItem(_d, 'CHECK2',2);
                }

                if (_d.DHs) {
                    $.each(_d.DHs, function (_z, _dhs) {
                        //if (_dhs.Id == $scope.rowCrew.Id)
                        $scope.addItemDH2(_d, _dhs.Position, 1, _dhs.Id);
                    });
                }
                   
                /////////////
            });

            //soosk
            var duties = [];
            console.log($scope.crewDuties);
            $.each($scope.crewDuties, function (_i, _d) {
                
                duties.push({
                    Id:_d.Id,
                    Start:_d.DutyStartLocal,
                    End:_d.DutyEndLocal,
                    LocationId: _d.FirstLocationId,
                    Type: _d.dutyType,
                    CrewId: _d.crewId,
                    GroupId: _d.GroupId,
                    TypeTitle: _d.dutyTypeTitle,

                });
            });
            
            //pipi
            var dt = $scope.dt_toSearched ? new Date($scope.dt_toSearched) : new Date(2020, 0, 24, 0, 0, 0);
            var df = $scope.dt_fromSearched ? new Date($scope.dt_fromSearched) : new Date(2020, 0, 21, 0, 0, 0);
            var _df = moment(df).format('YYYY-MM-DDTHH:mm:ss');
            var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
            $scope.loadingVisible = true;
            //flightService.roster($scope.output,_df,_dt).then(function (response) {
            flightService.rosterValidate($scope.output, _df, _dt).then(function (response) {
                $scope.loadingVisible = false;

                
                if (!response) {
                    var rosterDto = {
                        rosterColumns: $scope.output,
                        rosterDuties: duties,
                    };
                    flightService.roster(rosterDto, _df, _dt).then(function (response) {
                        $scope.loadingVisible = false;
                        if (response.error) {
                            //alert('error');
                            console.log('Roster Errors');
                            console.log(response);
                            $scope.dg_error_ds = response.errors;
                            $scope.popup_error_visible = true;
                        } else
                        {
                            $scope.loadingVisible = true;
                            flightService.rosterDuty(duties, _df, _dt).then(function (response) {
                               
                                $scope.getDuties(function () {
                                    $scope.loadingVisible = false;
                                    General.ShowNotify(Config.Text_SavedOk, 'success');
                                });

                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                        }


                        
                        

                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                }
                else
                {
                    $.each(response, function (_i, _d) {
                        General.ShowNotify(_d.CrewId+'   '+_d.Message, 'error');
                    })
                }

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


        }
    };
    $scope.ganttFlightCrews = [];
    
    $scope.btn_assign = {
        text: 'Assign',
        type: 'default',
        // icon: 'search',
        width: 120,
        // validationGroup: 'ctrsearch',
        bindingOptions: { disabled: 'btnGanttDisabled' },
        onClick: function (e) {
            $scope.dg_instance.filter(['Register', '=', 'CAR']);

            return;
            $scope.dg_selected = $rootScope.getSelectedRows($scope.dg_instance);
            $scope.selectedFlightIds = Enumerable.From($scope.dg_selected).Select('$.ID').ToArray();
            if ($scope.selectedFlightIds.length == 0)
                return;


            $scope.selectedDataFields = [];
            $scope.selectedCaptions = [];
            var vclmns = $scope.dg_instance.getVisibleColumns();
        
            $scope.ds_selected_flights = Enumerable.From($scope.dg_selected).Where(function (x) {
                return true;
            }).ToArray();
            $scope.assignedCrews = [];
            $scope.assignedCrewsDistinct = [];
            var ids = [];
            $.each($scope.ds_selected_flights, function (_i, _d) {
                ids.push(_d.ID);
                if (_d.IP) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.IP).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'IP', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                if (_d.IP1) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.IP1).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'IP1', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                if (_d.IP2) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.IP2).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'IP2', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                //P1
                if (_d.P1) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P1).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P1', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                if (_d.P11) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P11).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P11', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                if (_d.P12) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P12).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P12', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                if (_d.P13) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P13).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P13', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                if (_d.P14) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P14).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P14', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                if (_d.P15) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P15).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P15', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                //P2
                if (_d.P2) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P2).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P2', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                if (_d.P21) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P21).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P21', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                if (_d.P22) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P22).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P22', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                if (_d.P23) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P23).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P23', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                if (_d.P24) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P24).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P24', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                if (_d.P25) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P25).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P25', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                //Safety
                if (_d.Safety) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.Safety).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'Safety', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                if (_d.Safety1) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.Safety1).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'Safety1', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                if (_d.Safety2) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.Safety2).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'Safety2', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                //ISCCM
                if (_d.ISCCM1) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.ISCCM1).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'ISCCM1', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                //SCCM
                if (_d.SCCM) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.SCCM).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'SCCM', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                if (_d.SCCM1) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.SCCM1).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'SCCM1', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                if (_d.SCCM2) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.SCCM2).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'SCCM2', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                if (_d.SCCM3) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.SCCM3).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'SCCM3', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                if (_d.SCCM4) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.SCCM4).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'SCCM4', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                if (_d.SCCM5) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.SCCM5).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'SCCM5', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                //CCM
                if (_d.CCM1) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.CCM1).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'CCM1', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                if (_d.CCM2) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.CCM2).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'CCM2', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                if (_d.CCM3) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.CCM3).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'CCM3', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                if (_d.CCM4) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.CCM4).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'CCM4', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                if (_d.CCM5) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.CCM5).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'CCM5', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                //OBS
                if (_d.OBS1) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.OBS1).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'OBS1', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                if (_d.OBS2) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.OBS2).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'OBS2', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                //Check
                if (_d.CHECK1) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.CHECK1).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'CHECK1', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
                if (_d.CHECK2) {
                    var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.CHECK2).FirstOrDefault();
                    $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'CHECK2', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                }
            });
            
            // $scope.assignedCrewsDistinct = Enumerable.From($scope.assignedCrews).Distinct("[$.CrewId, $.Name,$.Position,$.GO].join(',')").OrderBy('$.GO').ToArray();
            $scope.assignedCrewsDistinct = Enumerable.From($scope.assignedCrews).Distinct("[$.CrewId, $.Name,$.Tab,$.GO].join(',')").OrderBy('$.GO').ToArray();
            $.each($scope.assignedCrewsDistinct, function (_j, _w) {
                _w._assignedFlights = $scope.getCrewFlights(_w.CrewId);

            });

            //boob
            $scope.loadingVisible = true;
            flightService.getFDPStats(ids.join('_')).then(function (response) {
                $scope.loadingVisible = false;
                $scope.FDPStat = response;
                response.DurationStr = pad(Math.floor(response.Duration / 60)).toString() + ':' + pad(Math.round(response.Duration % 60)).toString();
                response.FlightStr = pad(Math.floor(response.Flight / 60)).toString() + ':' + pad(Math.round(response.Flight % 60)).toString();
                response.ExtendedStr = pad(Math.floor(response.Extended / 60)).toString() + ':' + pad(Math.round(response.Extended % 60)).toString();
                response.MaxFDPExtendedStr = pad(Math.floor(response.MaxFDPExtended / 60)).toString() + ':' + pad(Math.round(response.MaxFDPExtended % 60)).toString();
                response.MaxFDPStr = pad(Math.floor(response.MaxFDP / 60)).toString() + ':' + pad(Math.round(response.MaxFDP % 60)).toString();
                response.RestTo = moment(new Date(response.RestTo)).format('YY-MM-DD HH:mm');
                $scope.dg3_ds = [];
                $scope.dg3_ds.push({ Title: 'Max FDP', Value: response.MaxFDPStr });
                $scope.dg3_ds.push({ Title: 'Extended', Value: response.ExtendedStr });
                $scope.dg3_ds.push({ Title: 'Max Ext. FDP', Value: response.MaxFDPExtendedStr });

                $scope.dg3_ds.push({ Title: 'FDP', Value: response.DurationStr });
                $scope.dg3_ds.push({ Title: 'Flight', Value: response.FlightStr });
                $scope.dg3_ds.push({ Title: 'Rest Until', Value: response.RestTo });
                var dt = new Date($scope.ds_selected_flights[0].STDDay);
                var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
                flightService.getCrewDutyFlight(_dt).then(function (fd) {
                    $scope.loadingVisible = false;
                    $.each(fd, function (_j, _q) {
                        var crw = Enumerable.From($scope.ds_crew).Where('$.Id==' + _q.CrewId).FirstOrDefault();
                        if (crw) {
                            crw.Flight28 = _q.Flight28;
                            crw.Flight28Str = pad(Math.floor(_q.Flight28 / 60)).toString() + ':' + pad(Math.round(_q.Flight28 % 60)).toString();

                            crw.FlightYear = _q.FlightYear;
                            crw.FlightYearStr = pad(Math.floor(_q.FlightYear / 60)).toString() + ':' + pad(Math.round(_q.FlightYear % 60)).toString();

                            crw.FlightCYear = _q.FlightCYear;
                            crw.FlightCYearStr = pad(Math.floor(_q.FlightCYear / 60)).toString() + ':' + pad(Math.round(_q.FlightCYear % 60)).toString();

                            crw.Duty7 = _q.Duty7;
                            crw.Duty7Str = pad(Math.floor(_q.Duty7 / 60)).toString() + ':' + pad(Math.round(_q.Duty7 % 60)).toString();

                            crw.Duty14 = _q.Duty14;
                            crw.Duty14Str = pad(Math.floor(_q.Duty14 / 60)).toString() + ':' + pad(Math.round(_q.Duty14 % 60)).toString();

                            crw.Duty28 = _q.Duty28;
                            crw.Duty28Str = pad(Math.floor(_q.Duty28 / 60)).toString() + ':' + pad(Math.round(_q.Duty28 % 60)).toString();


                        }
                    });
                    $scope.popup_assign_visible = true;

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            // $scope.popup_assign_visible = true;

        }
    };
    $scope.btnGanttDisabled = true;
    $scope.btn_gantt = {
        text: 'Gantt',
        type: 'default',
        // icon: 'search',
        width: 120,
        // validationGroup: 'ctrsearch',
        bindingOptions: {disabled:'btnGanttDisabled'},
        onClick: function (e) {
            $scope.ganttFlightCrews = [];
            $scope.selectedIds = [];
            $scope.selectedItems = [];
            $scope.popup_gantt_visible = true;
           
        }
    };
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        // validationGroup: 'ctrsearch',
        bindingOptions: {},
        onClick: function (e) {
            $scope.bind();

            return;
            var dto = [];
            dto.push(
           

             {
                 CrewId: 312,//shams
                 Flights: [
                      {
                          FlightId: 17022,
                          PositionId: 1157,
                          DH: false,
                      },
                      {
                          FlightId: 17023,
                          PositionId: 1157,
                          DH: false,
                      },
                      {
                          FlightId: 17024,
                          PositionId: 1157,
                          DH: true,
                      },
                      {
                          FlightId: 17025,
                          PositionId: 1157,
                          DH: true,
                      }

                    ,
                    {
                        FlightId: 17026,
                        PositionId: 1157,
                        DH: false,
                    }
                    ,
                    {
                        FlightId: 17027,
                        PositionId: 1157,
                        DH: false,
                    }




                 ]
             }
           

            );
           
            flightService.roster(dto).then(function (response) {
             


            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



            // public class RosterFlight
            //{
            //    public int FlightId { get; set; }
            //    public int PositionId { get; set; }
            //    public bool DH { get; set; }
            //}
            //public class RosterColumn
            //{
            //    public int CrewId { get; set; }
            //    public List<RosterFlight> Flights { get; set; }
            //}


        }

    };

    $scope.btn_refresh = {
        text: 'Refresh',
        type: 'normal',
        // icon: 'search',
        width: 120,
        // validationGroup: 'ctrsearch',
        bindingOptions: {},
        onClick: function (e) {
            $scope.loadingVisible = true;
            flightService.deleteKeys().then(function (response) {
                $scope.loadingVisible = false;
                 
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


        }
    };


    $scope.palete = ['#ffffff',
'#e6ffe6',
'#e6f2ff',
'#ffffe6',
'#ffe6ff',
        '#f2f2f2',
'#e6ffff', ];
    //////////////////////////////////////
    $scope.checkConflict = function (flights) {
        var hasConflict = false;
        $.each(flights, function (_i, _d) {
            _d.Route = _d.FromAirportIATA + '-' + _d.ToAirportIATA;
            var f = Enumerable.From(flights).Where(function (x) {
                return x.ID != _d.ID && (
                    (new Date(x.STD) >= new Date(_d.STD) && new Date(x.STD) <= new Date(_d.STA))
                    ||
                    (new Date(x.STA) >= new Date(_d.STD) && new Date(x.STA) <= new Date(_d.STA))
                  );
            }).FirstOrDefault();
            if (f)
                hasConflict = true;
        });

        return hasConflict;
    };
    $scope.checkContinuity = function (flights) {
        var hasError = false;
        var ordered = Enumerable.From(flights).OrderBy(function (x) { return new Date(x.STD); }).ToArray();
        $.each(ordered, function (_i, _d) {
            if (_i > 0 && _i < ordered.length - 1) {
                if (_d.ToAirport != ordered[_i + 1].FromAirport)
                    hasError = true;
            }
        });
        return hasError;

    };
    //////////////////////////////////////
    $scope.IPs = [{ Id: 1, Name: 'KHANJANI' }, { Id: 2, Name: 'DAVARI' }];
    $scope.dg_columnsX = [
       // { dataField: 'IsCanceled', caption: 'CNL', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 50, fixed: true, fixedPosition: 'left',  sortIndex: 2, sortOrder: "asc" },
        { dataField: 'STDDay', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 95, /*format: 'EEE MM-dd'*/ format:'EEE d', sortIndex: 0, sortOrder: "asc" },
        {dataField: 'FlightNumber', caption: 'No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, fixed: false, fixedPosition: 'left' },

       {
           caption: 'Flight',
           fixed: false, fixedPosition: 'left',
           columns: [
                

               //{ dataField: 'AircraftType', caption: 'AC Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, fixed: false, fixedPosition: 'left' },
                { dataField: 'Register', caption: 'Reg.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 95, fixed: false, fixedPosition: 'left', sortIndex: 1, sortOrder: "asc" },
               
               { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
               { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
               { dataField: 'STDLocal', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 85, format: 'HH:mm', sortIndex: 3, sortOrder: "asc" },
               { dataField: 'STALocal', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 85, format: 'HH:mm' },



           ],
       },
      
        {
            dataField: "Id", caption: 'Cockpit',
            width: 400,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'cockpitTemplate',

        },
        {
            dataField: "Id", caption: 'Cabin',
            width: 600,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'cabinTemplate',

        },
         //{
         //    dataField: "Id", caption: 'Instructors',
         //    width: 300,
         //    allowFiltering: false,
         //    allowSorting: false,
         //    cellTemplate: 'instructorTemplate',

         //},
         {
             dataField: "Id", caption: 'Others',
             width: 400,
             allowFiltering: false,
             allowSorting: false,
             cellTemplate: 'otherTemplate',

         },

       // ,{
       //     caption: 'Cockpit',
       //     fixed: false, fixedPosition: 'right',
       //     columns: [



       //         {
       //             dataField: 'P11',
       //             caption: 'P1(1)',
       //             width: 140,
       //             lookup: {

       //                 displayExpr: "ScheduleName",
       //                 valueExpr: "Id",
       //                 allowClearing: true,

       //             }
       //         },

       //          {
       //              dataField: 'P12',
       //              caption: 'P1(2)',
       //              width: 140,
       //              lookup: {

       //                  displayExpr: "ScheduleName",
       //                  valueExpr: "Id",
       //                  allowClearing: true,

       //              }
       //          },

       //         {
       //             dataField: 'P21',
       //             caption: 'P2(1)',
       //             width: 140,
       //             lookup: {

       //                 displayExpr: "ScheduleName",
       //                 valueExpr: "Id",
       //                 allowClearing: true,

       //             }
       //         },

       //           {
       //               dataField: 'P22',
       //               caption: 'P2(2)',
       //               width: 140,
       //               lookup: {

       //                   displayExpr: "ScheduleName",
       //                   valueExpr: "Id",
       //                   allowClearing: true,

       //               }
       //           },




       //     ]
       // },
       //{
       //    caption: 'Cabin',
       //    columns: [
       //       {
       //           dataField: 'SCCM1',
       //           caption: 'SCCM(1)',
       //           width: 140,
       //           lookup: {

       //               displayExpr: "ScheduleName",
       //               valueExpr: "Id",
       //               allowClearing: true,

       //           }
       //       },

       //         {
       //             dataField: 'SCCM2',
       //             caption: 'SCCM(2)',
       //             width: 140,
       //             lookup: {

       //                 displayExpr: "ScheduleName",
       //                 valueExpr: "Id",
       //                 allowClearing: true,

       //             }
       //         },

       //        {
       //            dataField: 'CCM1',
       //            caption: 'CCM1',
       //            width: 140,
       //            lookup: {

       //                displayExpr: "ScheduleName",
       //                valueExpr: "Id",
       //                allowClearing: true,

       //            }
       //        },

       //        {
       //            dataField: 'CCM2',
       //            caption: 'CCM2',
       //            width: 140,
       //            lookup: {

       //                displayExpr: "ScheduleName",
       //                valueExpr: "Id",
       //                allowClearing: true,

       //            }
       //        },

       //        {
       //            dataField: 'CCM3',
       //            caption: 'CCM3',
       //            width: 140,
       //            lookup: {

       //                displayExpr: "ScheduleName",
       //                valueExpr: "Id",
       //                allowClearing: true,

       //            }
       //        },

       //    ]
       //},
       //{
       //    caption: 'Instructors',
       //    columns: [
       //        {
       //            dataField: "IP1",
       //            caption: "IP1",
       //            width: 140,
       //            lookup: {

       //                displayExpr: "ScheduleName",
       //                valueExpr: "Id",
       //                allowClearing: true,

       //            }
       //        },
       //         {
       //             dataField: 'ISCCM1',
       //             caption: 'ISCCM',
       //             width: 140,
       //             lookup: {

       //                 displayExpr: "ScheduleName",
       //                 valueExpr: "Id",
       //                 allowClearing: true,

       //             }
       //         },

       //    ]
       //},
      
       //{
       //    caption: 'Others',
       //    columns: [
       //         {
       //             dataField: 'Safety1',
       //             caption: 'Safety',
       //             width: 140,
       //             lookup: {

       //                 displayExpr: "ScheduleName",
       //                 valueExpr: "Id",
       //                 allowClearing: true,

       //             }
       //         },
       //           {
       //               dataField: 'OBS1',
       //               caption: 'OBS(1)',
       //               width: 140,
       //               lookup: {

       //                   displayExpr: "ScheduleName",
       //                   valueExpr: "Id",
       //                   allowClearing: true,

       //               }
       //           },
                
       //           {
       //               dataField: 'CHECK1',
       //               caption: 'Check(1)',
       //               width: 140,
       //               lookup: {

       //                   displayExpr: "ScheduleName",
       //                   valueExpr: "Id",
       //                   allowClearing: true,

       //               }
       //           },
       //    ]
       //},
        {
                  dataField: "Id", caption: 'DHs',
                  width: 400,
                  allowFiltering: false,
                  allowSorting: false,
                  cellTemplate: 'DHTemplate',

        },
       
        

    ];
    $scope.dg_selected = null;
    $scope.dg_instance = null;
    $scope.dg_ds = null;
    $scope.FDPStat = { IsOver: false };
     
    $scope.dg = {
        
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
        editing: {
            mode: "cell",
            allowUpdating: false
        },
        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'virtual' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: $(window).height() - 140,

        columns: $scope.dg_columnsX,
        onContentReady: function (e) {
            if (!$scope.dg_instance)
                $scope.dg_instance = e.component;

            showSelection(e.component, selectedRange);

        },
        onCellClick: function (e) {
            selectedRange.startRowIndex = selectedRange.endRowIndex = e.rowIndex;
            selectedRange.startColumnIndex = selectedRange.endColumnIndex = e.columnIndex;
            isSelectionStopped = false;
            showSelection(e.component, selectedRange);
        },
        onCellHoverChanged: function (e) {

            var event = e.jQueryEvent;
            if (event.buttons === 1) {
                if (isSelectionStopped) {
                    isSelectionStopped = false;
                    selectedRange = {};
                }
                if (selectedRange.startRowIndex === undefined) {
                    selectedRange.startRowIndex = e.rowIndex;
                }
                if (e.columnIndex < 6)
                    return;
                if (selectedRange.startColumnIndex === undefined) {
                    selectedRange.startColumnIndex = e.columnIndex;
                }

                selectedRange.endRowIndex = e.rowIndex;
                selectedRange.endColumnIndex = e.columnIndex;

                showSelection(e.component, selectedRange);

            }
            else {
                isSelectionStopped = true;
                //   if (selectedRange.startRowIndex >= 0)
                //    $scope.popup_assign_visible = true;
            }
        },
        onEditorPreparing: function (e) {
            // $scope.dg_instance.beginUpdate();  
            //  $scope.dg_instance.columnOption('IP', 'lookup.dataSource', [{ Id: 1, Name: "S1-lookup changed" }, { Id: 2, Name: "S2-lookup changed" }]);

            //$scope.dg_instance.endUpdate();  

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_selected = null;
            }
            else
                $scope.dg_selected = data;


        },
       
        onCellPrepared: function (e) {
            //Register
            if (e.rowType === "data" && (e.column.dataField == "Register" || e.column.dataField == "FlightNumber")) {
                if (e.data.Color1)
                    e.cellElement.css("backgroundColor", e.data.Color1);
                if (e.data.Color2)
                    e.cellElement.css("color", e.data.Color2);
            }
            if (e.rowType === "data" && e.column.dataField == "FromAirportIATA" && e.data.FromAirportIATA=='THR') {
                e.cellElement.css("backgroundColor", '#fff');
                e.cellElement.css("color", '#336699');
            }
            if (e.rowType === "data" && e.column.dataField == "FromAirportIATA" && e.data.FromAirportIATA == 'MHD') {
                e.cellElement.css("backgroundColor", '#eee');
                e.cellElement.css("color", '#cc0066');
            }
           


        },
        onRowPrepared: function (e) {  
            if (e.rowType === "data") {
                var day = (new Date(e.data.STDDay)).getDay();
                e.rowElement.css("backgroundColor", $scope.palete[day]);
            }
            //42 %  10

        },
        onRowUpdated: function (e) {
            
            var key = e.key.ID;
            var selected = $rootScope.getSelectedRows($scope.dg_instance);

            var exist = Enumerable.From(selected).Where('$.ID==' + key).FirstOrDefault();
            if (!exist)
                return;

            var name = Object.keys(e.data);
            var value = e.data[name];

            if (!selected)
                return;
            $.each(selected, function (_i, _d) {
                if (_d.ID != key) {
                    _d[name] = value;
                }

            });
            $scope.dg_instance.refresh();
        },
        onContextMenuPreparing: function (e) {
            //ati
            if (e.target == "content") {
                // e.items can be undefined
                if (!e.items) e.items = [];

                // Add a custom menu item
                e.items.push({
                    text: "Assign Crew",
                    onItemClick: function () {
                      
                        var clmns = [];
                        var rws = [];
                        foreachRange(selectedRange, function (rowIndex, columnIndex) {
                            // $scope.dg_instance.cellValue(rowIndex, columnIndex, "updated");
                            
                            clmns.push(columnIndex);
                            rws.push(rowIndex);
                        });
                        clmns = Enumerable.From(clmns).Distinct().ToArray();
                        rws = Enumerable.From(rws).Distinct().ToArray();
                        $scope.selectedFlightIds = [];
                        $.each(rws, function (_i, _d) {
                            $scope.selectedFlightIds.push($scope.dg_instance.getKeyByRowIndex(_d).ID);
                        });
                        $scope.selectedDataFields = [];
                        $scope.selectedCaptions = [];
                        var vclmns = $scope.dg_instance.getVisibleColumns();
                        $.each(clmns, function (_i, _d) {
                            $scope.selectedDataFields.push(vclmns[_d].dataField);
                            $scope.selectedCaptions.push(vclmns[_d].caption);
                        });
                        //$.each($scope.selectedCaptions, function (_i, _d) {

                        //    $scope.tabs.push({ text: _d, id: $scope.selectedDataFields[_i] });
                        //});
                        
                        $scope.ds_selected_flights = Enumerable.From($scope.dg_ds).Where(function (x) {
                            return $scope.selectedFlightIds.indexOf(x.ID) != -1;
                        }).ToArray();

                        var conflict = $scope.checkConflict($scope.ds_selected_flights);
                        var continuity = $scope.checkContinuity($scope.ds_selected_flights);
                        if (conflict || continuity) {
                            General.ShowNotify('Interuption/Continuity Error', 'error');
                            return;
                        }


                        $scope.assignedCrews = [];
                        $scope.assignedCrewsDistinct = [];
                        var ids = [];
                        var tempAssigned = [];
                        $.each($scope.ds_selected_flights, function (_i, _d) {
                            ids.push(_d.ID);
                            
                            if (_d.DHs) {
                                $.each(_d.DHs, function (_z, _dhs) {
                                    //_d.DHs.push({Id:dhc.Id,Name:dhc.Name,Position:dhc.Position,RosterPosition:dhc.RosterPosition,GroupOrder:dhc.GroupOrder,FlightId:_d.ID,FlightNumber:_d.FlightNumber,FlightTime:_d.FlightTime});
                                    tempAssigned.push({ Key: _dhs.Id.toString() + '*' + _dhs.FlightId.toString(), CrewId: _dhs.Id, Position: _dhs.Position, FlightId: _dhs.FlightId, Name: _dhs.Name, No: _dhs.FlightNumber, DH: true, GO: _dhs.GroupOrder, FlightTime: _dhs.FlightTime });
                                });
                               
                            }
                            if (_d.IP1) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.IP1).FirstOrDefault();
                                // $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'IP1', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                                tempAssigned.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'IP1', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder,FlightTime:_d.FlightTime });
                            }
                            if (_d.IP2) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.IP2).FirstOrDefault();
                                tempAssigned.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'IP2', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.P11) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P11).FirstOrDefault();
                                tempAssigned.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P11', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.P12) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P12).FirstOrDefault();
                                tempAssigned.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P12', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.P13) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P13).FirstOrDefault();
                                tempAssigned.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P13', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.P14) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P14).FirstOrDefault();
                                tempAssigned.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P14', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.P15) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P15).FirstOrDefault();
                                tempAssigned.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P15', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.P21) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P21).FirstOrDefault();
                                tempAssigned.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P21', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.P22) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P22).FirstOrDefault();
                                tempAssigned.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P22', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.P23) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P23).FirstOrDefault();
                                tempAssigned.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P23', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.P24) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P24).FirstOrDefault();
                                tempAssigned.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P24', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.P25) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P25).FirstOrDefault();
                                tempAssigned.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P25', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.Safety1) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.Safety1).FirstOrDefault();
                                tempAssigned.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'Safety1', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.Safety2) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.Safety2).FirstOrDefault();
                                tempAssigned.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'Safety2', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }

                            if (_d.ISCCM1) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.ISCCM1).FirstOrDefault();
                                tempAssigned.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'ISCCM1', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }

                            if (_d.SCCM1) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.SCCM1).FirstOrDefault();
                                tempAssigned.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'SCCM1', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.SCCM2) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.SCCM2).FirstOrDefault();
                                tempAssigned.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'SCCM2', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.SCCM3) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.SCCM3).FirstOrDefault();
                                tempAssigned.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'SCCM3', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.SCCM4) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.SCCM4).FirstOrDefault();
                                tempAssigned.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'SCCM4', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.SCCM5) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.SCCM5).FirstOrDefault();
                                tempAssigned.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'SCCM5', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }

                            if (_d.CCM1) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.CCM1).FirstOrDefault();
                                tempAssigned.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'CCM1', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.CCM2) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.CCM2).FirstOrDefault();
                                tempAssigned.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'CCM2', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.CCM3) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.CCM3).FirstOrDefault();
                                tempAssigned.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'CCM3', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.CCM4) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.CCM4).FirstOrDefault();
                                tempAssigned.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'CCM4', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.CCM5) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.CCM5).FirstOrDefault();
                                tempAssigned.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'CCM5', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.OBS1) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.OBS1).FirstOrDefault();
                                tempAssigned.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'OBS1', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.OBS2) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.OBS2).FirstOrDefault();
                                tempAssigned.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'OBS2', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.CHECK1) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.CHECK1).FirstOrDefault();
                                tempAssigned.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'CHECK1', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.CHECK2) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.CHECK2).FirstOrDefault();
                                tempAssigned.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'CHECK2', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }

                        });
                        $.each(tempAssigned, function (_z, _t) {
                            _t.Tab = _t.Position.substr(0, _t.Position.length - 1);
                        });
                        var tempIds = Enumerable.From(ids).Distinct().ToArray();
                        var tempDistinct = Enumerable.From(tempAssigned).Distinct("[$.CrewId, $.FlightId].join(',')").ToArray();
                     

                        var checked = [];
                        $.each(tempDistinct, function (_j, _w) {
                          //  var _ccnt = Enumerable.From(tempDistinct).Where('$.CrewId==' + _w.CrewId).ToArray().length;
                          //  if (_ccnt == tempIds.length)
                                checked.push(_w.CrewId);
                        });

                        $scope.assignedCrewsDistinct = Enumerable.From(tempAssigned).Where( 
                        function (x) {
                            

                            return checked.indexOf(x.CrewId) != -1;
                        }
                            )
                        //.Distinct("[$.CrewId, $.Name,$.Position,$.GO].join(',')").OrderBy('$.GO').ToArray();
                        .Distinct("[$.CrewId, $.Name,$.Tab,$.GO].join(',')").OrderBy('$.GO').ToArray();
                        $.each($scope.assignedCrewsDistinct, function (_j, _w) {
                            _w._assignedFlights = $scope.getCrewFlights(_w.CrewId);
                            
                        });
                        $scope.assignedCrews = Enumerable.From(tempAssigned).ToArray();
                       
                        //boob
                        $scope.loadingVisible = true;
                        flightService.getFDPStats(ids.join('_')).then(function (response) {
                            
                            $scope.FDPStat = response;
                            response.DurationStr = pad(Math.floor(response.Duration / 60)).toString() + ':' + pad(Math.round(response.Duration % 60)).toString();
                            response.FlightStr = pad(Math.floor(response.Flight / 60)).toString() + ':' + pad(Math.round(response.Flight % 60)).toString();
                            response.DutyStr = pad(Math.floor(response.Duty / 60)).toString() + ':' + pad(Math.round(response.Duty % 60)).toString();
                            response.ExtendedStr = pad(Math.floor(response.Extended / 60)).toString() + ':' + pad(Math.round(response.Extended % 60)).toString();
                            response.MaxFDPExtendedStr = pad(Math.floor(response.MaxFDPExtended / 60)).toString() + ':' + pad(Math.round(response.MaxFDPExtended % 60)).toString();
                            response.MaxFDPStr = pad(Math.floor(response.MaxFDP / 60)).toString() + ':' + pad(Math.round(response.MaxFDP % 60)).toString();
                            response.RestTo = moment(new Date(response.RestTo)).format('YY-MM-DD HH:mm');
                            $scope.dg3_ds = [];
                            //$scope.dg3_ds.push({ Title: 'Max FDP', Value: response.MaxFDPStr });
                            $scope.dg3_ds.push({ Title: 'Extended', Value: response.ExtendedStr });
                            $scope.dg3_ds.push({ Title: 'Max Ext. FDP', Value: response.MaxFDPExtendedStr });

                            $scope.dg3_ds.push({ Title: 'FDP', Value: response.DurationStr });
                            $scope.dg3_ds.push({ Title: 'Duty', Value: response.DutyStr });
                            $scope.dg3_ds.push({ Title: 'Flight', Value: response.FlightStr });
                            $scope.dg3_ds.push({ Title: 'Rest Until', Value: response.RestTo });

                            //gigi
                            var dt = new Date($scope.ds_selected_flights[0].STDDay);
                            //gorbe
                            var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
                            //new fuck gantt
                            _dt = moment((new Date($scope.dt_fromSearched)).addDays(-1)).format('YYYY-MM-DDTHH:mm:ss');
                            $scope.popup_assign_visible = true;
                            //flightService.getCrewDutyFlight(_dt).then(function (fd) {
                            //    $scope.loadingVisible = false;
                            //    $.each(fd, function (_j, _q) {
                            //        var crw = Enumerable.From($scope.ds_crew).Where('$.Id==' + _q.CrewId).FirstOrDefault();
                            //        if (crw) {
                            //            crw.Flight28 = _q.Flight28;
                            //            crw.Flight28Str = pad(Math.floor(_q.Flight28 / 60)).toString() + ':' + pad(Math.round(_q.Flight28 % 60)).toString();

                            //            crw.FlightYear = _q.FlightYear;
                            //            crw.FlightYearStr = pad(Math.floor(_q.FlightYear / 60)).toString() + ':' + pad(Math.round(_q.FlightYear % 60)).toString();

                            //            crw.FlightCYear = _q.FlightCYear;
                            //            crw.FlightCYearStr = pad(Math.floor(_q.FlightCYear / 60)).toString() + ':' + pad(Math.round(_q.FlightCYear % 60)).toString();

                            //            crw.Duty7 = _q.Duty7;
                            //            crw.Duty7Str = pad(Math.floor(_q.Duty7 / 60)).toString() + ':' + pad(Math.round(_q.Duty7 % 60)).toString();

                            //            crw.Duty14 = _q.Duty14;
                            //            crw.Duty14Str = pad(Math.floor(_q.Duty14 / 60)).toString() + ':' + pad(Math.round(_q.Duty14 % 60)).toString();

                            //            crw.Duty28 = _q.Duty28;
                            //            crw.Duty28Str = pad(Math.floor(_q.Duty28 / 60)).toString() + ':' + pad(Math.round(_q.Duty28 % 60)).toString();


                            //        }
                            //    });
                            //    $scope.popup_assign_visible = true;

                            //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                        // $scope.popup_assign_visible = true;
                    }
                },
                //{
                //    text: "Clear",
                //    onItemClick: function () {
                //        var clmns = [];
                //        var rws = [];
                //        foreachRange(selectedRange, function (rowIndex, columnIndex) {
                //            // $scope.dg_instance.cellValue(rowIndex, columnIndex, "updated");
                           
                //            clmns.push(columnIndex);
                //            rws.push(rowIndex);
                //        });
                //        clmns = Enumerable.From(clmns).Distinct().ToArray();
                //        rws = Enumerable.From(rws).Distinct().ToArray();
                //        var vclmns = $scope.dg_instance.getVisibleColumns();
                //        $.each(clmns, function (_i, _d) {
                             
                //            var f = vclmns[_d].dataField;
                //            if (f.startsWith('IP') || f.startsWith('P1') || f.startsWith('P2') || f.startsWith('Safety') || f.startsWith('ISCCM')
                //                || f.startsWith('SCCM') || f.startsWith('CCM') || f.startsWith('OBS') || f.startsWith('CHECK')) {
                              
                //                $.each(rws, function (_j, _r) {
                //                    // alert($scope.dg_ds[_r][f]);
                //                    if (f.includes('DH'))
                //                        $scope.dg_ds[_r][f] = false;
                //                    else
                //                        $scope.dg_ds[_r][f] = null;
                //                });
                //            }
                           
                //        });
                        
                //    }
                //}
                );
            }
        },
        bindingOptions: {
            dataSource: 'dg_ds'
        }
    };
    ///////////////////////////////
    $scope.dg_columns2 = [

            // { dataField: 'STDDay', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 70, format: 'MM-dd', sortIndex: 0, sortOrder: "asc" },

             //{ dataField: 'AircraftType', caption: 'AC Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, fixed: false, fixedPosition: 'left' },
             
              { dataField: 'FlightNumber', caption: 'No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 65, fixed: false, fixedPosition: 'left' },
             { dataField: 'Route', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },

             { dataField: 'STDLocal', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 78, format: 'HH:mm', sortIndex: 1, sortOrder: "asc" },
             { dataField: 'STALocal', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 78, format: 'HH:mm' },

              { dataField: 'Duration', caption: 'DUR', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
               { dataField: 'Register', caption: 'Reg.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 83, fixed: false, fixedPosition: 'left', sortIndex: 2, sortOrder: "asc" },

    ];
    $scope.dg2_selected = null;
    $scope.dg2_instance = null;
    $scope.ds_selected_flights = null;
    $scope.dg2 = {
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
        height: ($(window).height() - 400) / 2,

        columns: $scope.dg_columns2,
        onContentReady: function (e) {
            if (!$scope.dg2_instance)
                $scope.dg2_instance = e.component;

        },
        onRowPrepared: function (e) {
            if (e.rowType === "data") {
                var day = (new Date(e.data.STDDay)).getDay();
                e.rowElement.css("backgroundColor", $scope.palete[day]);
            }
            //42 %  10

        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg2_selected = null;
            }
            else
                $scope.dg2_selected = data;


        },


        bindingOptions: {
            dataSource: 'ds_selected_flights'
        }
    };
    //////////////////////////////
    $scope.dg_columns3 = [


              { dataField: 'Title', caption: 'No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 110, fixed: false, fixedPosition: 'left' },
             { dataField: 'Value', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },



    ];
    $scope.dg3_selected = null;
    $scope.dg3_instance = null;
    $scope.dg3_ds = null;
    $scope.dg3 = {
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
        height: ($(window).height() - 400) / 2,

        columns: $scope.dg_columns3,
        onContentReady: function (e) {
            if (!$scope.dg3_instance)
                $scope.dg3_instance = e.component;

        },
        onRowPrepared: function (e) {
            //if (e.rowType === "data") {
            //    var day = (new Date(e.data.STDDay)).getDay();
            //    e.rowElement.css("backgroundColor", $scope.palete[day]);
            //}
            //42 %  10

        },
        showColumnHeaders: false,
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg3_selected = null;
            }
            else
                $scope.dg32_selected = data;


        },
        onCellPrepared: function (e) {
            //lightgray
            if (e.rowType === "data" && e.column.dataField == "Title")
                e.cellElement.css("backgroundColor", "lightgray");
            if (e.rowType === "data" && e.column.dataField == "Value" && e.data.Title == 'FDP' && $scope.FDPStat.IsOver)
                e.cellElement.css("backgroundColor", "#ffcccc");

        },

        bindingOptions: {
            dataSource: 'dg3_ds'
        }
    };
    /////////////////////////////
    //sharon
    //$scope.ds_selected_flights
    $scope.flightTileClass = function (item) {
        var flt = item.Flight;
        var dh = item.DH;
        var ids = Enumerable.From($scope.ds_selected_flights).Select('$.ID').ToArray();
        

        var cls = ids.indexOf(flt.ID) == -1 ? 'flight1' : 'flight2';
        if ($scope.selectedDHIds.indexOf(flt.ID) != -1 || dh)
            cls += ' dh';
        return cls;
    };
    $scope.IsDutyOverClass = function (x) {
        return x.IsOver ? 'error' : '';
    };
    $scope.IsRestErrorClass = function (x) {
        return x.restError ? 'error' : '';
    };
    $scope.IsFDPHasErrorClass = function (x) {
        return x.hasError ? 'error' : '';
    };
    $scope.formatDateTime = function (dt) {
        return moment(dt).format('MM-DD HH:mm');
    };
    $scope.formatTime = function (dt) {
        return moment(dt).format('HHmm');
    };
    $scope.formatMinutes = function (mm) {

        if (!mm)
            return "00:00";
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(Math.floor(mm % 60)).toString();
    };
    $scope.outputTemps = [];
    $scope.crewTempFDPs = [];
    $scope.crewTempRow = {Valid:true, Duty7: 0, Duty14: 0, Duty28: 0, Flight28: 0, FlightYear: 0, Duty7Class: '', Duty14Class: '', Duty28Class: '', Flight28Class:'',FlightYearClass:''};
    $scope.addItemTemp = function (data, pos, rpos,crid) {
        //        {
        //            FlightId: 17020,
        //            PositionId: 1160,
        //            DH:false,
        //        },
        var crewId =crid?crid: data[pos];
        var dh = data[pos + 'DH'];
        var flightId = data.ID;
      
        var row = Enumerable.From($scope.outputTemps).Where('$.CrewId==' + crewId).FirstOrDefault();
        if (!row) {
            row = { CrewId: crewId, Flights: [] };
            $scope.outputTemps.push(row);
        }
        row.Flights.push({ FlightId: flightId, PositionId: $scope.getPositionId(pos), DH: dh, RosterPosition: rpos, STD: data.STD, STA: data.STA });

    };
    $scope.addItemTempCal = function (data, pos, rpos, crid) {
        //        {
        //            FlightId: 17020,
        //            PositionId: 1160,
        //            DH:false,
        //        },
       // alert(crid+'   '+pos);
        var crewId = crid ? crid : data[pos];
        var dh = data[pos + 'DH'];
        var flightId = data.ID;

        var row = Enumerable.From($scope.outputTemps).Where('$.CrewId==' + crewId).FirstOrDefault();
        if (!row) {
            row = { CrewId: crewId, Flights: [] };
            $scope.outputTemps.push(row);
        }
        row.Flights.push({ FlightId: flightId, PositionId: $scope.getPositionId(pos), DH: dh, RosterPosition: rpos, STD: data.STD, STA: data.STA });

    };

    $scope.addItemTempDH = function (data, pos, rpos, crid) {
        //        {
        //            FlightId: 17020,
        //            PositionId: 1160,
        //            DH:false,
        //        },
        var crewId = crid ? crid : data[pos];
        var dh = $scope.selectedDHIds.indexOf(data.ID) != -1; //data[pos + 'DH'];
        var flightId = data.ID;
        
        var row = Enumerable.From($scope.outputTemps).Where('$.CrewId==' + crewId).FirstOrDefault();
        if (!row) {
            row = { CrewId: crewId, Flights: [] };
            $scope.outputTemps.push(row);
        }
        row.Flights.push({ FlightId: flightId, PositionId: $scope.getPositionId(pos), DH: dh, RosterPosition: rpos, STD: data.STD, STA: data.STA });

    };
    $scope.addItemTempDH2 = function (data, pos, rpos, crid) {
        //        {
        //            FlightId: 17020,
        //            PositionId: 1160,
        //            DH:false,
        //        },
        var crewId = crid ? crid : data[pos];
        var dh =true; //data[pos + 'DH'];
        var flightId = data.ID;
         
        var row = Enumerable.From($scope.outputTemps).Where('$.CrewId==' + crewId).FirstOrDefault();
        if (!row) {
            row = { CrewId: crewId, Flights: [] };
            $scope.outputTemps.push(row);
        }
        row.Flights.push({ FlightId: flightId, PositionId: $scope.getPositionId(pos), DH: dh, RosterPosition: rpos, STD: data.STD, STA: data.STA });

    };
    $scope.getDutyHeaderClass = function (dt) {
        return '_duty _duty' + dt;
    };

    $scope.prePostDs = [];
    $scope.getPrePost = function (crewId, callback) {
        var entity = Enumerable.From($scope.prePostDs).Where('$.Id==' + crewId).FirstOrDefault();
        if (entity)
        {
            callback(entity);
            return;
        }
        else
        {
            var dt = $scope.dt_toSearched ? new Date($scope.dt_toSearched) : new Date(2020, 0, 24, 0, 0, 0);
            var df = $scope.dt_fromSearched ? new Date($scope.dt_fromSearched) : new Date(2020, 0, 21, 0, 0, 0);
            var _df = moment(df).format('YYYY-MM-DDTHH:mm:ss');
            var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
            $scope.loadingVisible = true;
            flightService.rosterPrePost([], _df, _dt, crewId).then(function (response) {
                $scope.loadingVisible = false;
                entity = { Id: crewId, preDuty: response.preDuty, postDuty: response.postDuty };
                $scope.prePostDs.push(entity);
                callback(entity);

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }
    };
    $scope.getTempDuties = function () {
        if (!$scope.dg_crew_selected)
            return;
        //6-11
        var prePostentity = Enumerable.From($scope.prePostDs).Where('$.Id==' + $scope.rowCrew.Id).FirstOrDefault();
        $scope.crewTempRow = {
            Valid: true,
            Duty7: $scope.dg_crew_selected.Duty7, Duty14: $scope.dg_crew_selected.Duty14, Duty28: $scope.dg_crew_selected.Duty28,
            Flight28: $scope.dg_crew_selected.Flight28, FlightYear: $scope.dg_crew_selected.FlightYear, Duty7Class: '', Duty14Class: '', Duty28Class: '', Flight28Class: '', FlightYearClass: ''
        };
        $scope.outputTemps = [];
        $scope.crewTempFDPs = [];
            $.each($scope.dg_ds, function (_i, _d) {
                if (_d.IP == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'IP', 1);
                }
                if (_d.IP1 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'IP1', 1);
                }
                if (_d.IP2 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'IP2', 2);
                }
                //P1
                if (_d.P1 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'P1', 1);
                }
                if (_d.P11 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'P11', 1);
                }
                if (_d.P12 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'P12', 2);
                }
                if (_d.P13 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'P13', 3);
                }
                if (_d.P14 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'P14', 4);
                }
                if (_d.P15 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'P15', 5);
                }
                //P2
                if (_d.P2 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'P2', 1);
                }
                if (_d.P21 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'P21', 1);
                }
                if (_d.P22 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'P22', 2);
                }
                if (_d.P23 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'P23', 3);
                }
                if (_d.P24 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'P24', 4);
                }
                if (_d.P25 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'P25', 5);
                }
                //Safety
                if (_d.Safety == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'Safety', 1);
                }
                if (_d.Safety1 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'Safety1', 1);
                }
                if (_d.Safety2 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'Safety2', 2);
                }
                //ISCCM
                if (_d.ISCCM1 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'ISCCM1', 1);
                }
                //SCCM
                if (_d.SCCM == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'SCCM', 1);
                }
                if (_d.SCCM5 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'SCCM5', 5);
                }
                if (_d.SCCM1 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'SCCM1', 1);
                }
                if (_d.SCCM2 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'SCCM2', 2);
                }
                if (_d.SCCM3 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'SCCM3', 3);
                }
                if (_d.SCCM4 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'SCCM4', 4);
                }
                //CCM
                if (_d.CCM1 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'CCM1', 1);
                }
                if (_d.CCM2 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'CCM2', 2);
                }
                if (_d.CCM3 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'CCM3', 3);
                }
                if (_d.CCM4 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'CCM4', 4);
                }
                if (_d.CCM5 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'CCM5', 5);
                }
                //OBS
                if (_d.OBS1 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'OBS1', 1);

                }
                if (_d.OBS2 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'OBS2', 2);
                }
                //Check
                if (_d.CHECK1 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'CHECK1', 1);

                }
                if (_d.CHECK2 == $scope.rowCrew.Id) {
                    $scope.addItemTemp(_d, 'CHECK2', 2);
                }
                if (_d.DHs)
                    $.each(_d.DHs, function (_z, _dhs) {
                        if (_dhs.Id == $scope.rowCrew.Id)
                            $scope.addItemTempDH2(_d, _dhs.Position, 1, _dhs.Id);
                    });

                /////////////
            });


            $.each($scope.ds_selected_flights, function (_i, _d) {
                $scope.addItemTempDH(_d, 'CHECK1', 1, $scope.rowCrew.Id);
            });
          
            //return;
            //pipi
            var dt = $scope.dt_toSearched ? new Date($scope.dt_toSearched) : new Date(2020, 0, 24, 0, 0, 0);
            var df = $scope.dt_fromSearched ? new Date($scope.dt_fromSearched) : new Date(2020, 0, 21, 0, 0, 0);
            var _df = moment(df).format('YYYY-MM-DDTHH:mm:ss');
            var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
             $scope.loadingVisible2 = true;
            
           // flightService.rosterValidate($scope.output, _df, _dt).then(function (response) {
            //5-28a    

               
                //if (!response) {
                   //6-18
             flightService.rosterTemp($scope.outputTemps, _df, _dt, $scope.rowCrew.Id).then(function (response) {
                        $scope.loadingVisible2 = false;
                        var _cduties = Enumerable.From($scope.crewDuties).Where('$.crewId==' + $scope.rowCrew.Id).ToArray();
                        //console.log(_cduties);
                        $.each(_cduties, function (_o, _cd) {
                            if (_cd.Id >=0) {
                                _cd.duty.RestTo = _cd.duty.RestUntil;
                                _cd.duty.RestToLocal = _cd.duty.RestUntilLocal;
                                _cd.duty.isPrePost = false;
                                _cd.duty.flights = null;
                                _cd.duty.IsOver = _cd.IsDutyOver;
                                _cd.duty.LastLocation = _cd.duty.Location;
                                _cd.duty.FirstLocation = _cd.duty.Location;
                                _cd.duty.dutyType = _cd.duty.DutyType;
                                _cd.duty.dutyTypeTitle = _cd.duty.DutyTypeTitle;
                                console.log(_cd.duty);
                                response.fdps.push(_cd.duty);
                            }
                            else {
                                response.fdps.push(_cd);
                            }
                           
                            
                        });
                       // response.fdps = Enumerable.From(response.fdps).OrderBy('$.DutyStart').ToArray();
                        
                 //console.log(response.fdps);
                        if (prePostentity) {
                            response.preDuty = prePostentity.preDuty;
                            response.postDuty = prePostentity.postDuty;
                        }
                        if (response.preDuty) {
                            response.preDuty.duty.RestTo = response.preDuty.duty.RestUntil;
                            response.preDuty.duty.RestToLocal = response.preDuty.duty.RestUntilLocal;
                            response.preDuty.duty.isPrePost = true;
                            response.preDuty.duty.flights = response.preDuty.flights;
                            response.preDuty.duty.IsOver = response.preDuty.duty.IsDutyOver;
                            response.preDuty.duty.LastLocation = response.preDuty.LastLocation;
                            response.preDuty.duty.FirstLocation = response.preDuty.FirstLocation;
                            response.preDuty.duty.dutyType = response.preDuty.dutyType;
                            response.preDuty.duty.dutyTypeTitle = response.preDuty.dutyTypeTitle;
                            response.dutyType = response.preDuty.DutyType;
                            response.dutyTypeTitle = response.preDuty.DutyTypeTitle;
                            response.fdps.splice(0, 0, response.preDuty.duty);
                        }
                        if (response.postDuty) {
                            response.postDuty.duty.RestTo = response.postDuty.duty.RestUntil;
                            response.postDuty.duty.RestToLocal = response.postDuty.duty.RestUntilLocal;
                            response.postDuty.duty.isPrePost = true;
                            response.postDuty.duty.flights = response.postDuty.flights;
                            response.postDuty.duty.IsOver = response.postDuty.duty.IsDutyOver;
                            response.postDuty.duty.LastLocation = response.postDuty.LastLocation;
                            response.postDuty.duty.FirstLocation = response.postDuty.FirstLocation;
                            response.postDuty.duty.dutyType = response.postDuty.dutyType;
                            response.postDuty.duty.dutyTypeTitle = response.postDuty.dutyTypeTitle;
                             
                            response.dutyType = response.postDuty.dutyType;
                            response.dutyTypeTitle = response.postDuty.dutyTypeTitle;
                            if (response.fdps && response.fdps.length > 0 && response.fdps.Items && response.fdps.Items.length > 0) {
                              //  response.postDuty.duty.LastLocation = response.fdps.Items[response.fdps.flights.length - 1].Flight.ToAirportIATA;
                              //  response.postDuty.duty.LastLocationClass = response.postDuty.duty.LastLocation != response.postDuty.duty.flights[0].FromAirportIATA ? 'error' : '';
                            }
                            response.fdps.push( response.postDuty.duty);
                        }
                        response.fdps = Enumerable.From(response.fdps).OrderBy(function (x) {
                            return new Date(x.DutyStart);
                        }).ToArray();
                        $.each(response.fdps, function (_i, _d) {
                            _d.start = _d.DutyStart;
                            _d.end = _d.RestTo;
                            if (!_d.dutyType) {
                                
                                       _d.dutyType = 1165;
                                       _d.dutyTypeTitle = 'FDP';
                                   }
                                 
                            _d.PreLocation = null;
                            _d.LastLocationClass = '';
                            if (_i > 0) {
                                _d.PreLocation = response.fdps[_i - 1].LastLocation;
                                _d.LastLocationClass = _d.PreLocation != _d.FirstLocation ? 'error' : '';
                                //alert(_d.PreLocation + '  ' + _d.FirstLocation);

                            }
                            else
                            {
                                if (!_d.isPrePost) {
                                    //LastLocation
                                    _d.PreLocation = $scope.rowCrew.LastLocation;
                                    _d.LastLocationClass = _d.PreLocation != _d.FirstLocation ? 'error' : '';
                                }
                            }
                            //if (_i == 0 && response.preDuty) {
                                
                            //    _d.LastLocation = response.preDuty.flights[response.preDuty.flights.length - 1].ToAirportIATA;
                                 
                            //} else {
                            //    var _pre_fdp = response.fdps[_i - 1];
                            //    if (_pre_fdp.Items && _pre_fdp.Items.length > 0) {
                       
                            //        LastLocation = _pre_fdp.Items[_pre_fdp.flights - 1].Flight.ToAirportIATA;
                            //    }
                            //}
                            //if (_i == 0) {
                            //    if (!_d.isPrePost)
                            //        _d.LastLocation = null; //$scope.rowCrew.LastLocation;
                            //}
                            //else
                            //{
                            //    if (response.fdps[_i - 1].isPrePost)
                                 
                            //        _d.LastLocation = response.fdps[_i - 1].flights[response.fdps[_i - 1].flights.length - 1].ToAirportIATA;
                                     
                                
                            //    else
                                 
                            //        _d.LastLocation = response.fdps[_i - 1].Items[response.fdps[_i - 1].Items.length - 1].Flight.ToAirportIATA;
                                
                                 
                            //}

                            if (_i < response.fdps.length - 1)
                                if (new Date(_d.RestTo) > new Date(response.fdps[_i + 1].DutyStart))
                                    _d.restError = true;
                            if (_d.restError || _d.IsOver)
                                _d.hasError = true;
                            if (!_d.isPrePost) {
                                //$scope.crewTempRow = { Duty7: 0, Duty14: 0, Duty28: 0, Flight28: 0, FlightYear :0};
                                $scope.crewTempRow.Duty7 += _d.Duty;
                                if ($scope.crewTempRow.Duty7 > 60 * 60)
                                     $scope.crewTempRow.Duty7Class='error';
                                $scope.crewTempRow.Duty14 += _d.Duty;
                                if ($scope.crewTempRow.Duty14 > 110 * 60)
                                    $scope.crewTempRow.Duty14Class = 'error';
                                $scope.crewTempRow.Duty28 += _d.Duty;
                                if ($scope.crewTempRow.Duty28 > 190 * 60)
                                    $scope.crewTempRow.Duty28Class = 'error';
                                $scope.crewTempRow.Flight28 += _d.Flight;
                                if ($scope.crewTempRow.Flight28 > 100 * 60)
                                    $scope.crewTempRow.Flight28Class = 'error';

                                $scope.crewTempRow.FlightYear += _d.Flight;
                                if ($scope.crewTempRow.FlightYear > 1000 * 60)
                                    $scope.crewTempRow.FlightYearClass = 'error';

                             //   _d.LastLocationClass = _d.LastLocation && _d.LastLocation != _d.Items[0].Flight.FromAirportIATA ? 'error' : '';
                             //   if (_i == response.fdps.length - 1)
                             //       _d.LastLocationClass = '';
                                 
                                
                            }
                            else {
                                //_d.LastLocationClass = _d.LastLocation && _d.LastLocation != _d.flights[0].FromAirportIATA ? 'error' : '';
                            }
                            if (_d.LastLocationClass == 'error' || _d.IsOver || _d.restError)
                                $scope.crewTempRow.Valid = false;

                            if (!$scope.crewTempRow.Valid) {
                             //   alert(_d.LastLocationClass);
                             //   alert(_d.IsOver);
                             //   alert(_d.restError);
                            }

                        });

                        if ($scope.crewTempRow.Valid == true) {
                            $scope.crewTempRow.Valid = $scope.crewTempRow.FlightYearClass != 'error' && $scope.crewTempRow.Flight28Class != 'error'
                               && $scope.crewTempRow.Flight28Class != 'error' && $scope.crewTempRow.Duty28Class != 'error' && $scope.crewTempRow.Duty14Class != 'error'
                            && $scope.crewTempRow.Duty7Class != 'error';
                        }

                        console.log(response.fdps);
                        $scope.crewTempFDPs = response.fdps;
                      

                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                //}
                //else
                //{
                //    $.each(response, function (_i, _d) {
                //        General.ShowNotify(_d.CrewId+'   '+_d.Message, 'error');
                //    })
                //}

          //  }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        //////////////////////////
    };
    //sheler
    $scope.getTempDutiesCalendar = function (_crwId,year, month,callback) {
        //if (!$scope.dg_crew_selected)
        //    return;
        ////6-11

        //$scope.crewTempRow = {
        //    Valid: true,
        //    Duty7: $scope.dg_crew_selected.Duty7, Duty14: $scope.dg_crew_selected.Duty14, Duty28: $scope.dg_crew_selected.Duty28,
        //    Flight28: $scope.dg_crew_selected.Flight28, FlightYear: $scope.dg_crew_selected.FlightYear, Duty7Class: '', Duty14Class: '', Duty28Class: '', Flight28Class: '', FlightYearClass: ''
        //};
        $scope.outputTemps = [];
        console.log('$scope.outputTemps ' + $scope.outputTemps.length);
        //$scope.crewTempFDPs = [];
        $.each($scope.dg_ds, function (_i, _d) {
            if (_d.IP == _crwId) {
                $scope.addItemTempCal(_d, 'IP', 1);
            }
            if (_d.IP1 == _crwId) {
                $scope.addItemTempCal(_d, 'IP1', 1);
            }
            if (_d.IP2 == _crwId) {
                $scope.addItemTempCal(_d, 'IP2', 2);
            }
            //P1
            if (_d.P1 == _crwId) {
                $scope.addItemTempCal(_d, 'P1', 1);
            }
            if (_d.P11 == _crwId) {
                $scope.addItemTempCal(_d, 'P11', 1);
            }
            if (_d.P12 == _crwId) {
                $scope.addItemTempCal(_d, 'P12', 2);
            }
            if (_d.P13 == _crwId) {
                $scope.addItemTempCal(_d, 'P13', 3);
            }
            if (_d.P14 == _crwId) {
                $scope.addItemTempCal(_d, 'P14', 4);
            }
            if (_d.P15 == _crwId) {
                $scope.addItemTempCal(_d, 'P15', 5);
            }
            //P2
            if (_d.P2 == _crwId) {
                $scope.addItemTempCal(_d, 'P2', 1);
            }
            if (_d.P21 == _crwId) {
                $scope.addItemTempCal(_d, 'P21', 1);
            }
            if (_d.P22 == _crwId) {
                $scope.addItemTempCal(_d, 'P22', 2);
            }
            if (_d.P23 == _crwId) {
                $scope.addItemTempCal(_d, 'P23', 3);
            }
            if (_d.P24 == _crwId) {
                $scope.addItemTempCal(_d, 'P24', 4);
            }
            if (_d.P25 == _crwId) {
                $scope.addItemTempCal(_d, 'P25', 5);
            }
            //Safety
            if (_d.Safety == _crwId) {
                $scope.addItemTempCal(_d, 'Safety', 1);
            }
            if (_d.Safety1 == _crwId) {
                $scope.addItemTempCal(_d, 'Safety1', 1);
            }
            if (_d.Safety2 == _crwId) {
                $scope.addItemTempCal(_d, 'Safety2', 2);
            }
            //ISCCM
            if (_d.ISCCM1 == _crwId) {
                $scope.addItemTempCal(_d, 'ISCCM1', 1);
            }
            //SCCM
            if (_d.SCCM == _crwId) {
                $scope.addItemTempCal(_d, 'SCCM', 1);
            }
            if (_d.SCCM5 == _crwId) {
                $scope.addItemTempCal(_d, 'SCCM5', 5);
            }
            if (_d.SCCM1 == _crwId) {
                $scope.addItemTempCal(_d, 'SCCM1', 1);
            }
            if (_d.SCCM2 == _crwId) {
                $scope.addItemTempCal(_d, 'SCCM2', 2);
            }
            if (_d.SCCM3 == _crwId) {
                $scope.addItemTempCal(_d, 'SCCM3', 3);
            }
            if (_d.SCCM4 == _crwId) {
                $scope.addItemTempCal(_d, 'SCCM4', 4);
            }
            //CCM
            if (_d.CCM1 == _crwId) {
                $scope.addItemTempCal(_d, 'CCM1', 1);
            }
            if (_d.CCM2 == _crwId) {
                $scope.addItemTempCal(_d, 'CCM2', 2);
            }
            if (_d.CCM3 == _crwId) {
                $scope.addItemTempCal(_d, 'CCM3', 3);
            }
            if (_d.CCM4 == _crwId) {
                $scope.addItemTempCal(_d, 'CCM4', 4);
            }
            if (_d.CCM5 == _crwId) {
                $scope.addItemTempCal(_d, 'CCM5', 5);
            }
            //OBS
            if (_d.OBS1 == _crwId) {
                $scope.addItemTempCal(_d, 'OBS1', 1);

            }
            if (_d.OBS2 == _crwId) {
                $scope.addItemTempCal(_d, 'OBS2', 2);
            }
            //Check
            if (_d.CHECK1 == _crwId) {
                $scope.addItemTempCal(_d, 'CHECK1', 1);

            }
            if (_d.CHECK2 == _crwId) {
                $scope.addItemTempCal(_d, 'CHECK2', 2);
            }
            //if (_d.DHs)
            //    $.each(_d.DHs, function (_z, _dhs) {
            //        if (_dhs.Id == _crwId)
            //            $scope.addItemTempDH2(_d, _dhs.Position, 1, _dhs.Id);
            //    });

            /////////////
        });


        //$.each($scope.ds_selected_flights, function (_i, _d) {
        //    $scope.addItemTempDH(_d, 'CHECK1', 1, _crwId);
        //});
        
        //return;
        //pipi
        var dt = $scope.dt_toSearched ? new Date($scope.dt_toSearched) : new Date(2020, 0, 24, 0, 0, 0);
        var df = $scope.dt_fromSearched ? new Date($scope.dt_fromSearched) : new Date(2020, 0, 21, 0, 0, 0);
        var _df = moment(df).format('YYYY-MM-DDTHH:mm:ss');
        var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
        $scope.loadingVisible = true;

        // flightService.rosterValidate($scope.output, _df, _dt).then(function (response) {
        //5-28a    


        //if (!response) {
        //6-18
        
        flightService.rosterTempCal($scope.outputTemps, _df, _dt, _crwId, year, month).then(function (response) {
            $scope.loadingVisible = false;
            var _cduties = Enumerable.From($scope.crewDuties).Where('$.crewId==' + _crwId).ToArray();
            //console.log(_cduties);
            $.each(_cduties, function (_o, _cd) {
                if (_cd.Id >= 0) {
                    _cd.duty.RestTo = _cd.duty.RestUntil;
                    _cd.duty.RestToLocal = _cd.duty.RestUntilLocal;
                    _cd.duty.isPrePost = false;
                    _cd.duty.flights = null;
                    _cd.duty.IsOver = _cd.IsDutyOver;
                    _cd.duty.LastLocation = _cd.duty.Location;
                    _cd.duty.FirstLocation = _cd.duty.Location;
                    _cd.duty.dutyType = _cd.duty.DutyType;
                    _cd.duty.dutyTypeTitle = _cd.duty.DutyTypeTitle;
                    
                    response.fdps.push(_cd.duty);
                }
                else {
                    response.fdps.push(_cd);
                }


            });
            // response.fdps = Enumerable.From(response.fdps).OrderBy('$.DutyStart').ToArray();

            //console.log(response.fdps);
            
            response.fdps = Enumerable.From(response.fdps).OrderBy(function (x) {
                return new Date(x.DutyStart);
            }).ToArray();
            $.each(response.fdps, function (_i, _d) {
                _d.start = _d.DutyStart;
                _d.end = _d.RestTo;
                if (!_d.dutyType) {

                    _d.dutyType = 1165;
                    _d.dutyTypeTitle = 'FDP';
                }

               
               

                

            });

            
            callback( response.fdps);


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
       

        //////////////////////////
    };


    $scope.getTempDutiesSTBY = function () {
        $scope.IsStbyAMVisible = false;
        $scope.IsStbyPMVisible = false;

        if (!$scope.dg_crew_stby_selected)
            return;
        //6-11

        $scope.crewTempRow = {
            Valid: true,
            Duty7: $scope.dg_crew_stby_selected.Duty7, Duty14: $scope.dg_crew_stby_selected.Duty14, Duty28: $scope.dg_crew_stby_selected.Duty28,
            Flight28: $scope.dg_crew_stby_selected.Flight28, FlightYear: $scope.dg_crew_stby_selected.FlightYear, Duty7Class: '', Duty14Class: '', Duty28Class: '', Flight28Class: '', FlightYearClass: ''
        };
        $scope.outputTemps = [];
        $scope.crewTempFDPs = [];
        //hodi
        $.each($scope.dg_ds, function (_i, _d) {
            if (_d.IP == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'IP', 1);
            }
            if (_d.IP1 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'IP1', 1);
            }
            if (_d.IP2 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'IP2', 2);
            }
            //P1
            if (_d.P1 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'P1', 1);
            }
            if (_d.P11 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'P11', 1);
            }
            if (_d.P12 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'P12', 2);
            }
            if (_d.P13 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'P13', 3);
            }
            if (_d.P14 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'P14', 4);
            }
            if (_d.P15 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'P15', 5);
            }
            //P2
            if (_d.P2 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'P2', 1);
            }
            if (_d.P21 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'P21', 1);
            }
            if (_d.P22 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'P22', 2);
            }
            if (_d.P23 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'P23', 3);
            }
            if (_d.P24 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'P24', 4);
            }
            if (_d.P25 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'P25', 5);
            }
            //Safety
            if (_d.Safety == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'Safety', 1);
            }
            if (_d.Safety1 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'Safety1', 1);
            }
            if (_d.Safety2 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'Safety2', 2);
            }
            //ISCCM
            if (_d.ISCCM1 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'ISCCM1', 1);
            }
            //SCCM
            if (_d.SCCM == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'SCCM', 1);
            }
            if (_d.SCCM5 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'SCCM5', 5);
            }
            if (_d.SCCM1 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'SCCM1', 1);
            }
            if (_d.SCCM2 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'SCCM2', 2);
            }
            if (_d.SCCM3 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'SCCM3', 3);
            }
            if (_d.SCCM4 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'SCCM4', 4);
            }
            //CCM
            if (_d.CCM1 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'CCM1', 1);
            }
            if (_d.CCM2 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'CCM2', 2);
            }
            if (_d.CCM3 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'CCM3', 3);
            }
            if (_d.CCM4 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'CCM4', 4);
            }
            if (_d.CCM5 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'CCM5', 5);
            }
            //OBS
            if (_d.OBS1 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'OBS1', 1);

            }
            if (_d.OBS2 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'OBS2', 2);
            }
            //Check
            if (_d.CHECK1 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'CHECK1', 1);

            }
            if (_d.CHECK2 == $scope.rowCrew.Id) {
                $scope.addItemTemp(_d, 'CHECK2', 2);
            }
            if (_d.DHs)
                $.each(_d.DHs, function (_z, _dhs) {
                    if (_dhs.Id == $scope.rowCrew.Id)
                        $scope.addItemTempDH2(_d, _dhs.Position, 1, _dhs.Id);
                });

            /////////////
        });
         
      

        //return;
        //pipi
        var dt = $scope.dt_toSearched ? new Date($scope.dt_toSearched) : new Date(2020, 0, 24, 0, 0, 0);
        var df = $scope.dt_fromSearched ? new Date($scope.dt_fromSearched) : new Date(2020, 0, 21, 0, 0, 0);
        var _df = moment(df).format('YYYY-MM-DDTHH:mm:ss');
        var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
        $scope.loadingVisible2 = true;

        // flightService.rosterValidate($scope.output, _df, _dt).then(function (response) {
        //5-28a    


        //if (!response) {
        //6-18
        flightService.rosterTemp($scope.outputTemps, _df, _dt, $scope.rowCrew.Id).then(function (response) {
            $scope.loadingVisible2 = false;
            var _cduties = Enumerable.From($scope.crewDuties).Where('$.crewId==' + $scope.rowCrew.Id).ToArray();
            //console.log(_cduties);
            $.each(_cduties, function (_o, _cd) {
                console.log('cduties');
                console.log(_cd);

                if (_cd.Id >=0) {
                    _cd.duty.RestTo = _cd.duty.RestUntil;
                    _cd.duty.RestToLocal = _cd.duty.RestUntilLocal;
                    _cd.duty.isPrePost = false;
                    _cd.duty.flights = null;
                    _cd.duty.IsOver = _cd.IsDutyOver;
                    _cd.duty.LastLocation = _cd.duty.Location;
                    _cd.duty.FirstLocation = _cd.duty.Location;
                    _cd.duty.dutyType = _cd.duty.DutyType;
                    _cd.duty.dutyTypeTitle = _cd.duty.DutyTypeTitle;
                    console.log(_cd.duty);
                    response.fdps.push(_cd.duty);
                }
                else {
                    response.fdps.push(_cd);
                }


            });
            response.fdps = Enumerable.From(response.fdps).OrderBy('$.DutyStart').ToArray();

            //console.log(response.fdps);
            if (response.preDuty) {
                response.preDuty.duty.RestTo = response.preDuty.duty.RestUntil;
                response.preDuty.duty.RestToLocal = response.preDuty.duty.RestUntilLocal;
                response.preDuty.duty.isPrePost = true;
                response.preDuty.duty.flights = response.preDuty.flights;
                response.preDuty.duty.IsOver = response.preDuty.duty.IsDutyOver;
                response.preDuty.duty.LastLocation = response.preDuty.LastLocation;
                response.preDuty.duty.FirstLocation = response.preDuty.FirstLocation;
                response.preDuty.duty.dutyType = response.preDuty.dutyType;
                response.preDuty.duty.dutyTypeTitle = response.preDuty.dutyTypeTitle;
                response.fdps.splice(0, 0, response.preDuty.duty);
            }
            if (response.postDuty) {
                response.postDuty.duty.RestTo = response.postDuty.duty.RestUntil;
                response.postDuty.duty.RestToLocal = response.postDuty.duty.RestUntilLocal;
                response.postDuty.duty.isPrePost = true;
                response.postDuty.duty.flights = response.postDuty.flights;
                response.postDuty.duty.IsOver = response.postDuty.duty.IsDutyOver;
                response.postDuty.duty.LastLocation = response.postDuty.LastLocation;
                response.postDuty.duty.FirstLocation = response.postDuty.FirstLocation;
                response.postDuty.duty.dutyType = response.postDuty.dutyType;
                response.postDuty.duty.dutyTypeTitle = response.postDuty.dutyTypeTitle;
                if (response.fdps && response.fdps.length > 0 && response.fdps.Items && response.fdps.Items.length > 0) {
                    //  response.postDuty.duty.LastLocation = response.fdps.Items[response.fdps.flights.length - 1].Flight.ToAirportIATA;
                    //  response.postDuty.duty.LastLocationClass = response.postDuty.duty.LastLocation != response.postDuty.duty.flights[0].FromAirportIATA ? 'error' : '';
                }
                response.fdps.push(response.postDuty.duty);
            }

            $.each(response.fdps, function (_i, _d) {
                _d.start = _d.DutyStart;
                _d.end = _d.RestTo;
                
                if (!_d.dutyType) {

                    _d.dutyType = 1165;
                    _d.dutyTypeTitle = 'FDP';
                }

                _d.PreLocation = null;
                _d.LastLocationClass = '';
                if (_i > 0) {
                    _d.PreLocation = response.fdps[_i - 1].LastLocation;
                    _d.LastLocationClass = _d.PreLocation != _d.FirstLocation ? 'error' : '';
                    //alert(_d.PreLocation + '  ' + _d.FirstLocation);

                }
                //if (_i == 0 && response.preDuty) {

                //    _d.LastLocation = response.preDuty.flights[response.preDuty.flights.length - 1].ToAirportIATA;

                //} else {
                //    var _pre_fdp = response.fdps[_i - 1];
                //    if (_pre_fdp.Items && _pre_fdp.Items.length > 0) {

                //        LastLocation = _pre_fdp.Items[_pre_fdp.flights - 1].Flight.ToAirportIATA;
                //    }
                //}
                //if (_i == 0) {
                //    if (!_d.isPrePost)
                //        _d.LastLocation = null; //$scope.rowCrew.LastLocation;
                //}
                //else
                //{
                //    if (response.fdps[_i - 1].isPrePost)

                //        _d.LastLocation = response.fdps[_i - 1].flights[response.fdps[_i - 1].flights.length - 1].ToAirportIATA;


                //    else

                //        _d.LastLocation = response.fdps[_i - 1].Items[response.fdps[_i - 1].Items.length - 1].Flight.ToAirportIATA;


                //}

                if (_i < response.fdps.length - 1)
                    if (new Date(_d.RestTo) > new Date(response.fdps[_i + 1].DutyStart))
                        _d.restError = true;
                if (_d.restError || _d.IsOver)
                    _d.hasError = true;
                if (!_d.isPrePost) {
                    //$scope.crewTempRow = { Duty7: 0, Duty14: 0, Duty28: 0, Flight28: 0, FlightYear :0};
                    $scope.crewTempRow.Duty7 += _d.Duty;
                    if ($scope.crewTempRow.Duty7 > 60 * 60)
                        $scope.crewTempRow.Duty7Class = 'error';
                    $scope.crewTempRow.Duty14 += _d.Duty;
                    if ($scope.crewTempRow.Duty14 > 110 * 60)
                        $scope.crewTempRow.Duty14Class = 'error';
                    $scope.crewTempRow.Duty28 += _d.Duty;
                    if ($scope.crewTempRow.Duty28 > 190 * 60)
                        $scope.crewTempRow.Duty28Class = 'error';
                    $scope.crewTempRow.Flight28 += _d.Flight;
                    if ($scope.crewTempRow.Flight28 > 100 * 60)
                        $scope.crewTempRow.Flight28Class = 'error';

                    $scope.crewTempRow.FlightYear += _d.Flight;
                    if ($scope.crewTempRow.FlightYear > 1000 * 60)
                        $scope.crewTempRow.FlightYearClass = 'error';

                    //   _d.LastLocationClass = _d.LastLocation && _d.LastLocation != _d.Items[0].Flight.FromAirportIATA ? 'error' : '';
                    //   if (_i == response.fdps.length - 1)
                    //       _d.LastLocationClass = '';


                }
                else {
                    //_d.LastLocationClass = _d.LastLocation && _d.LastLocation != _d.flights[0].FromAirportIATA ? 'error' : '';
                }
                if (_d.LastLocationClass == 'error')
                    $scope.crewTempRow.Valid = false;

            });

            if ($scope.crewTempRow.Valid == true) {
                $scope.crewTempRow.Valid = $scope.crewTempRow.FlightYearClass != 'error' && $scope.crewTempRow.Flight28Class != 'error'
                   && $scope.crewTempRow.Flight28Class != 'error' && $scope.crewTempRow.Duty28Class != 'error' && $scope.crewTempRow.Duty14Class != 'error'
                && $scope.crewTempRow.Duty7Class != 'error';
            }

            console.log(response.fdps);
            $scope.crewTempFDPs = response.fdps;
            $scope.checkStbyAdd();

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        //}
        //else
        //{
        //    $.each(response, function (_i, _d) {
        //        General.ShowNotify(_d.CrewId+'   '+_d.Message, 'error');
        //    })
        //}

        //  }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        //////////////////////////
    };
    //calCrew
    $scope.infoCrew = function (data) {
        $scope.dg_crew_selected = data;
        $scope.rowCrew = data;
        $scope.fillSelectedCrewHistory();
    };
    $scope._calCrewSelected = null;
    $scope.calCrew = function (data) {
        $scope.cal_crew_current = General.getDayFirstHour(new Date($scope.dt_fromSearched));
        $scope._calCrewSelected = data.Id;
        $scope.popup_cal_visible = true;
    };
    $scope.fillSelectedCrewHistory = function () {
        $scope.getPrePost($scope.rowCrew.Id, function (prepost) {

            if (!$scope.rowCrew.isFtl) {
                console.log('ftl init ' + $scope.rowCrew.Id);
                var _dt = moment($scope.dt_fromSearched).format('YYYY-MM-DDTHH:mm:ss');
                $scope.loadingVisible = true;
                flightService.getCrewFTLByDate($scope.rowCrew.Id, _dt).then(function (response) {
                    $scope.loadingVisible = false;
                    $scope.rowCrew.isFtl = true;

                    $scope.rowCrew.Flight28 = response.Flight28;
                    $scope.rowCrew.FlightYear = response.FlightYear;
                    $scope.rowCrew.FlightCYear = response.FlightCYear;
                    $scope.rowCrew.Duty7 = response.Duty7;
                    $scope.rowCrew.Duty14 = response.Duty14;
                    $scope.getTempDuties();

                    //crw.Duty28 = 0;
                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }
            else
                $scope.getTempDuties();
        });
    }
    /////////////////////////////
    $scope.dg_crew_columns = [

            { dataField: 'JobGroup', caption: 'RNK', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 65, },
              { dataField: 'ScheduleName', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },
              { dataField: 'LastLocation', caption: 'Apt', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, },
              { dataField: 'RosterFlightsStr', caption: 'Roster', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70, },
                      //{ dataField: 'Flight28Str', caption: 'F-28', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70, },
                      //{ dataField: 'FlightYearStr', caption: 'F-12M', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, },
                     //  { dataField: 'FlightCYearStr', caption: 'F-Y', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, },
                      //  { dataField: 'Duty7Str', caption: 'D-7', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70, },
                     //   { dataField: 'Duty14Str', caption: 'D-14', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70, },
                     //   { dataField: 'Duty28Str', caption: 'D-28', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70, },
                     {
                         dataField: "Id", caption: '',
                         width: 70,
                         allowFiltering: false,
                         allowSorting: false,
                         cellTemplate: 'calCrewTemplate',
                         name: 'ccalcrew',
                         // visible: false,

                     },
                     {
                         dataField: "Id", caption: '',
                         width: 70,
                         allowFiltering: false,
                         allowSorting: false,
                         cellTemplate: 'infoCrewTemplate',
                         name: 'cinfocrew',
                        // visible: false,

                     },
              {
                  dataField: "Id", caption: '',
                  width: 70,
                  allowFiltering: false,
                  allowSorting: false,
                  cellTemplate: 'addCrewTemplate',
                  name:'caddcrew',
                  //visible:false,

              },

    ];
    $scope.dg_crew_selected = null;
    $scope.rowCrew = null;
    $scope.dg_crew_instance = null;
    $scope.dg_crew_ds = null;
    $scope.dg_crew = {
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
        height: $(window).height() - 399,

        columns: $scope.dg_crew_columns,
        onContentReady: function (e) {
            if (!$scope.dg_crew_instance)
                $scope.dg_crew_instance = e.component;

        },
        onRowPrepared: function (e) {



        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];
            
            if (!data) {
                $scope.dg_crew_selected = null;
                $scope.rowCrew = null;
                $scope.crewTempRow = { Valid: true, Duty7: 0, Duty14: 0, Duty28: 0, Flight28: 0, FlightYear: 0, Duty7Class: '', Duty14Class: '', Duty28Class: '', Flight28Class: '', FlightYearClass: '' };
                $scope.outputTemps = [];
                $scope.crewTempFDPs = [];
            }
            else {
                //afrang
                $scope.dg_crew_selected = data;
                $scope.rowCrew = data;

              //  $scope.fillSelectedCrewHistory();

               
            }


        },


        bindingOptions: {
            dataSource: 'dg_crew_ds'
        }
    };
    //pipi2
    $scope.assignedCrews = [];
    $scope.assignedCrewsDistinct = [];
    $scope.addCrew = function (_crew) {
        var crewid = _crew.data.Id;
        $scope.getPrePost(crewid, function (prepost) {
            var selectedFlights = Enumerable.From($scope.ds_selected_flights).OrderBy(function (x) {
                return new Date(x.STD);
            }).ToArray();
            var reporting = new Date(selectedFlights[0].STD).addMinutes(-60);
            var endDuty = new Date(selectedFlights[selectedFlights.length - 1].STA).addMinutes(30 + 12 * 60);
            var pre = prepost.preDuty;
            var post = prepost.postDuty;
            //if (pre) {
            //    if (  
            //         (reporting>= new Date(pre.DutyStart) && reporting<=new Date(pre.RestUntil))
            //          ||
            //         (endDuty>= new Date(pre.DutyStart) && endDuty<=new Date(pre.RestUntil))
            //         ||
            //         (new Date(pre.DutyStart)>=reporting && new Date(pre.DutyStart)<=endDuty)
            //       )
            //    {
            //        General.ShowNotify('Pre Duty Error', 'error');
            //        return;
            //    }

            //}

            //if (post) {
            //    if (
            //        (reporting >= new Date(post.DutyStart) && reporting <= new Date(post.RestUntil))
            //         ||
            //        (endDuty >= new Date(post.DutyStart) && endDuty <= new Date(post.RestUntil))
            //        ||
            //        (new Date(post.DutyStart) >= reporting && new Date(post.DutyStart) <= endDuty)
            //      ) {
            //        General.ShowNotify('Post Duty Error', 'error');
            //        return;
            //    }
            //}

            $scope.addCrewFromSummery(_crew.data);

        });
        
        //jool
        //var crewDs = Enumerable.From($scope.dg_crew_ds).Where('$.Id!=' + crewid).ToArray();
        //var selectedFlightIds = Enumerable.From($scope.ds_selected_flights).Select('$.ID').ToArray();
        //var _position = $scope.selectedTabId;
       
        //    var cnt = Enumerable.From($scope.assignedCrewsDistinct).Where(function (w) {
        //        return w.Position.startsWith(_position);
        //    }).ToArray().length;
        //    _position = _position + (cnt + 1).toString();
        

        //var current = Enumerable.From($scope.assignedCrews).Where(function (x) {
        //    return x.CrewId == crewid && selectedFlightIds.indexOf(x.FlightId) != -1;
        //}).Select('$.Key').ToArray();
        //$scope.assignedCrews = Enumerable.From($scope.assignedCrews).Where(function (x) {
        //    return current.indexOf('$.Key') == -1;
        //}).ToArray();




        //$.each($scope.ds_selected_flights, function (_i, _d) {
        //    $scope.assignedCrews.push({ Key: crewid.toString() + '*' + _d.ID.toString(), CrewId: crewid, Position: _position, FlightId: _d.ID, Name: _crew.data.ScheduleName, No: _d.FlightNumber, DH: false, GO: _crew.data.GroupOrder,RosterPosition:(cnt+1) });
        //});
     

        //$scope.assignedCrewsDistinct = Enumerable.From($scope.assignedCrews).Distinct("[$.CrewId, $.Name,$.Position,$.GO,$.RosterPosition].join(',')").OrderBy('$.GO').ToArray();
        //$.each($scope.assignedCrewsDistinct, function (_j, _w) {
        //    _w._assignedFlights = $scope.getCrewFlights(_w.CrewId);
        //});
        //$scope.dg_crew_ds = crewDs;
    };
    $scope.getFirstEmptyPosition = function (fid, pos) {
        var row = Enumerable.From($scope.dg_ds).Where('$.ID==' + fid).FirstOrDefault();
        var c = 1;
        var condition = true;
        while (condition) {
            var cell = row[pos + c.toString()];
            var res = Enumerable.From($scope.assignedCrews).Where('$.Position=="' + pos + c.toString() + '" && $.FlightId=='+fid).FirstOrDefault();
            if (!cell && !res)
                condition = false;
            else
            c++;
            //kooni
        }
        return   c ;
    };
    //zigi
    $scope.addCrewFromSummery = function (_crew) {
       
        var crewid = _crew.Id;
        var _crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + crewid).FirstOrDefault();
        var crewDs = Enumerable.From($scope.dg_crew_ds).Where('$.Id!=' + crewid).ToArray();
        var selectedFlightIds = Enumerable.From($scope.ds_selected_flights).Select('$.ID').ToArray();
        var _position = $scope.selectedTabId;
        var _tab = $scope.selectedTabId;
        //if (_position == 'CCM')
        // {
        var cnt = Enumerable.From($scope.assignedCrewsDistinct).Where(function (w) {
            return w.Position.startsWith(_position);
        }).ToArray().length;
        //_position = _position + (cnt + 1).toString();


        //}
       
        var current = Enumerable.From($scope.assignedCrews).Where(function (x) {
            return x.CrewId == crewid && selectedFlightIds.indexOf(x.FlightId) != -1;
        }).Select('$.Key').ToArray();
        $scope.assignedCrews = Enumerable.From($scope.assignedCrews).Where(function (x) {
            return current.indexOf('$.Key') == -1;
        }).ToArray();


        var _flights = $scope.getCrewFlightsObj(crewid);
        var _flightTime = 0;
        
        $.each($scope.ds_selected_flights, function (_i, _d) {
           // var pcnt = Enumerable.From($scope.assignedCrews).Where('$.Tab=="' + _tab + '" && $.FlightId==' + _d.ID + ' && !$.DH').ToArray().length + 1;
            var pcnt = $scope.getFirstEmptyPosition(_d.ID, $scope.selectedTabId);
             //alert(pcnt);
            _position = $scope.selectedTabId + pcnt.toString();//_tab + pcnt.toString();
           
            $scope.assignedCrews.push({Tab:_tab, _assignedFlights: '-', Key: crewid.toString() + '*' + _d.ID.toString(), CrewId: crewid, Position: _position, FlightId: _d.ID, Name: _crew.ScheduleName, No: _d.FlightNumber, DH: $scope.selectedDHIds.indexOf(_d.ID) != -1, GO: _crew.GroupOrder, RosterPosition: /*(cnt + 1)*/pcnt });
            _flights.push({ No: _d.FlightNumber, rank: '', Id: _d.ID, STD: _d.STD, ToIATA: _d.ToAirportIATA, To: _d.ToAirport });
            _flightTime += _d.FlightTime;
        });
        _flights = Enumerable.From(_flights).OrderByDescending('$.STD').ToArray();
        //nook
        console.log('$$$$$$$%%%%%%%%%%%%%%%%%%5^^^^^^^^^^^^^^^^^6');
        console.log($scope.ds_selected_flights);
        console.log($scope.assignedCrews);
             console.log('$$$$$$$%%%%%%%%%%%%%%%%%%5^^^^^^^^^^^^^^^^^6');
        // flights.push({ No: _d.FlightNumber, rank: 'CHECK', Id: _d.ID, STD: _d.STD, ToIATA: _d.ToAirportIATA, To: _d.ToAirport });
         
        _crew.LastLocationId = _flights[0].To;
        _crew.LastLocation = _flights[0].ToIATA;
        
       
        
        _crew.RosterFlights += _flightTime;
        
        _crew.RosterFlightsStr = $scope.formatMinutes(_crew.RosterFlights);
        
        //$scope.assignedCrewsDistinct = Enumerable.From($scope.assignedCrews).Distinct("[$.CrewId, $.Name,$.Position,$.GO,$.RosterPosition].join(',')").OrderBy('$.GO').ToArray();
        $scope.assignedCrewsDistinct = Enumerable.From($scope.assignedCrews).Distinct("[$.CrewId, $.Name,$.Tab,$.GO ].join(',')").OrderBy('$.GO').ToArray();
        //$.each($scope.assignedCrewsDistinct, function (_j, _w) {
        //    _w._assignedFlights = $scope.getCrewFlights(_w.CrewId);
        //    alert(_w._assignedFlights);
        //});
        $scope.dg_crew_ds = crewDs;
        
    };
    $scope.removeAssignedCrew = function (_crew) {
        var crewid = _crew.CrewId;
        var key = _crew.Key;
        var _flights = Enumerable.From($scope.assignedCrews).Where('$.CrewId==' + crewid).ToArray();
        $.each(_flights, function (_i, _d) {
            if (_d.DH)
            {
                 
                var dgdsFlight = Enumerable.From($scope.dg_ds).Where('$.ID==' + _d.FlightId).FirstOrDefault();
                
                if (dgdsFlight.DHs)
                    dgdsFlight.DHs = Enumerable.From(dgdsFlight.DHs).Where('$.Id!=' + crewid).ToArray();
                
            }
        });
        var flightTime = Enumerable.From(_flights).Sum('$.FlightTime');
        
        $scope.assignedCrews = Enumerable.From($scope.assignedCrews).Where('$.CrewId!=' + crewid).ToArray();
      
        //$scope.assignedCrewsDistinct = Enumerable.From($scope.assignedCrews).Distinct("[$.CrewId, $.Name,$.Position,$.GO,$.RosterPosition].join(',')").OrderBy('$.GO').ToArray();
        $scope.assignedCrewsDistinct = Enumerable.From($scope.assignedCrews).Distinct("[$.CrewId, $.Name,$.Tab,$.GO ].join(',')").OrderBy('$.GO').ToArray();

        var record = Enumerable.From($scope.ds_crew).Where(function (x) {
            return x.Id==crewid;
        }).FirstOrDefault();
        record.RosterFlights -= flightTime;
        record.RosterFlightsStr = $scope.formatMinutes(record.RosterFlights);
        //sooki
        var nrecord = JSON.parse(JSON.stringify(record));
        $scope.dg_crew_ds.push(nrecord);
        $scope.dg_crew_ds = Enumerable.From($scope.dg_crew_ds).OrderBy('$.GroupOrder').ThenBy('$.RosterFlights').ThenBy('$.Flight28').ThenBy('$.Duty7').ThenBy('$.ScheduleName').ToArray();

       // $scope.dg_crew_ds = crewDs;
    };


    $scope.getColor = function (pos) {
        //#99ffcc
    };
   
   
    $scope._updateFlightsDs = function () {
       
        var ips1 = Enumerable.From($scope.assignedCrews).Where('$.Position=="IP1"').OrderBy('$.Name').ToArray();
        var ips2 = Enumerable.From($scope.assignedCrews).Where('$.Position=="IP2"').OrderBy('$.Name').ToArray();

        var p11s = Enumerable.From($scope.assignedCrews).Where('$.Position=="P11"').OrderBy('$.Name').ToArray();
        var p12s = Enumerable.From($scope.assignedCrews).Where('$.Position=="P12"').OrderBy('$.Name').ToArray();
        var p13s = Enumerable.From($scope.assignedCrews).Where('$.Position=="P13"').OrderBy('$.Name').ToArray();
        var p14s = Enumerable.From($scope.assignedCrews).Where('$.Position=="P14"').OrderBy('$.Name').ToArray();
        var p15s = Enumerable.From($scope.assignedCrews).Where('$.Position=="P15"').OrderBy('$.Name').ToArray();


        var p21s = Enumerable.From($scope.assignedCrews).Where('$.Position=="P21"').OrderBy('$.Name').ToArray();
        var p22s = Enumerable.From($scope.assignedCrews).Where('$.Position=="P22"').OrderBy('$.Name').ToArray();
        var p23s = Enumerable.From($scope.assignedCrews).Where('$.Position=="P23"').OrderBy('$.Name').ToArray();
        var p24s = Enumerable.From($scope.assignedCrews).Where('$.Position=="P24"').OrderBy('$.Name').ToArray();
        var p25s = Enumerable.From($scope.assignedCrews).Where('$.Position=="P25"').OrderBy('$.Name').ToArray();



        var sa1s = Enumerable.From($scope.assignedCrews).Where('$.Position=="Safety1"').OrderBy('$.Name').ToArray();
        var sa2s = Enumerable.From($scope.assignedCrews).Where('$.Position=="Safety2"').OrderBy('$.Name').ToArray();

        var isccm1s = Enumerable.From($scope.assignedCrews).Where('$.Position=="ISCCM1"').OrderBy('$.Name').ToArray();

        var sccm1s = Enumerable.From($scope.assignedCrews).Where('$.Position=="SCCM1"').OrderBy('$.Name').ToArray();
        var sccm2s = Enumerable.From($scope.assignedCrews).Where('$.Position=="SCCM2"').OrderBy('$.Name').ToArray();
        var sccm3s = Enumerable.From($scope.assignedCrews).Where('$.Position=="SCCM3"').OrderBy('$.Name').ToArray();
        var sccm4s = Enumerable.From($scope.assignedCrews).Where('$.Position=="SCCM4"').OrderBy('$.Name').ToArray();
        var sccm5s = Enumerable.From($scope.assignedCrews).Where('$.Position=="SCCM5"').OrderBy('$.Name').ToArray();

        var ccm1s = Enumerable.From($scope.assignedCrews).Where('$.Position=="CCM1"').OrderBy('$.Name').ToArray();
        var ccm2s = Enumerable.From($scope.assignedCrews).Where('$.Position=="CCM2"').OrderBy('$.Name').ToArray();
        var ccm3s = Enumerable.From($scope.assignedCrews).Where('$.Position=="CCM3"').OrderBy('$.Name').ToArray();
        var ccm4s = Enumerable.From($scope.assignedCrews).Where('$.Position=="CCM4"').OrderBy('$.Name').ToArray();
        var ccm5s = Enumerable.From($scope.assignedCrews).Where('$.Position=="CCM5"').OrderBy('$.Name').ToArray();


        var obs1s = Enumerable.From($scope.assignedCrews).Where('$.Position=="OBS1"').OrderBy('$.Name').ToArray();
        var obs2s = Enumerable.From($scope.assignedCrews).Where('$.Position=="OBS2"').OrderBy('$.Name').ToArray();

        var check1s = Enumerable.From($scope.assignedCrews).Where('$.Position=="CHECK1"').OrderBy('$.Name').ToArray();
        var check2s = Enumerable.From($scope.assignedCrews).Where('$.Position=="CHECK2"').OrderBy('$.Name').ToArray();
        //pook
        var sccm1 = null;
        if (sccms && sccms.length > 0) {
            sccm1 = sccms[0];

        }
        var obs1 = null;
        if (obses && obses.length > 0) {
            obs1 = obses[0];

        }

        var ccm1 = null;
        if (ccm1s && ccm1s.length > 0) {
            ccm1 = ccm1s[0];

        }
        var ccm2 = null;
        if (ccm2s && ccm2s.length > 0) {
            ccm2 = ccm2s[0];

        }
        var ccm3 = null;
        if (ccm3s && ccm3s.length > 0) {
            ccm3 = ccm3s[0];

        }



        ///////////////////////////////
        var ip1 = null;
        if (ips && ips.length > 0) {
            ip1 = ips[0];

        }
        var p11 = null;
        if (p1s && p1s.length > 0) {
            p11 = p1s[0];

        }
        var p21 = null;
        if (p2s && p2s.length > 0) {
            p21 = p2s[0];

        }
        var sa1 = null;
        if (sas && sas.length > 0) {
            sa1 = sas[0];

        }

        var selectedFlightIds = Enumerable.From($scope.ds_selected_flights).Select('$.ID').ToArray();
        var flights = Enumerable.From($scope.dg_ds).Where(function (x) {
            return selectedFlightIds.indexOf(x.ID) != -1;
        }).ToArray();
        $.each(flights, function (_i, _d) {
            _d.IP = ip1 ? ip1.CrewId : null;
            _d.P1 = p11 ? p11.CrewId : null;
            _d.P2 = p21 ? p21.CrewId : null;
            _d.Safety = sa1 ? sa1.CrewId : null;
            _d.CCM1 = ccm1 ? ccm1.CrewId : null;
            _d.CCM2 = ccm2 ? ccm2.CrewId : null;
            _d.CCM3 = ccm3 ? ccm3.CrewId : null;
            _d.SCCM = sccm1 ? sccm1.CrewId : null;
            _d.OBS = obs1 ? obs1.CrewId : null;
        });


        //$scope.dg_ds[0].IP = 312;
       // $scope.dg_instance.refresh();
    };
    /////////////////////////////
    $scope.getCrewIdFromAssignedCrews = function (pos, flt) {
         
        var item = Enumerable.From($scope.assignedCrews).Where(
            function (x) {
                return x.Position==pos && x.FlightId==flt.ID && !x.DH
            }
            //'$.Position=="' + pos + '"'
            ).FirstOrDefault();
        if (!item)
            return null;

        return Number(item.CrewId);
    };
    $scope.getCrewIdFromAssignedCrews2 = function (pos, flt) {

        var item = Enumerable.From($scope.assignedCrews).Where(
            function (x) {
                return x.Position == pos && x.FlightId == flt.ID && !x.DH
            }
            //'$.Position=="' + pos + '"'
            ).FirstOrDefault();
        if (!item)
            return null;
        var _crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + item.CrewId).FirstOrDefault();

        return { cid: Number(item.CrewId), name: item.Name, pos: item.Position };
    };
    $scope.getCrewIdFromAssignedCrewsObj = function (pos, flt) {
        
        var item = Enumerable.From($scope.assignedCrews).Where(
            function (x) {
                return x.Position == pos && x.FlightId == flt.ID && x.DH
            }
            
            ).FirstOrDefault();
        if (!item)
            return null;
        var _crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + item.CrewId).FirstOrDefault();
       // var _crew = $scope.ds_crew[0];
        _crew._Name = item.Name;
        _crew._Position = item.Position;
        _crew._RosterPosition = item.RosterPosition;
        return _crew;
    };
    /////////////////////////////////////
    //6-6
    //nani
    $scope.updateFlightsDs = function () {
        $scope.dg_instance.beginUpdate();
        
        var selectedFlightIds = Enumerable.From($scope.ds_selected_flights).Select('$.ID').ToArray();
       
        var flights = Enumerable.From($scope.dg_ds).Where(function (x) {
            return selectedFlightIds.indexOf(x.ID) != -1;
        }).ToArray();

        
        var _ranks = ['IP', 'IP1', 'IP2', 'P1', 'P11', 'P12', 'P13', 'P14', 'P15', 'P2', 'P21', 'P22', 'P23', 'P24', 'P25', 'Safety1', 'Safety2', 'CCM', 'CCM1'
        ,'CCM2','CCM3','CCM4','CCM5','SCCM','SCCM1','SCCM2','SCCM3','SCCM4','SCCM5','OBS1','OBS2','ISCCM','ISCCM1','CHECK1','CHECK2'];
        $.each(flights, function (_i, _d) {
            _d.cockpit = [];
            _d.cabin = [];
            _d.instructor = [];
            _d.other = [];
            if ($scope.selectedDHIds.indexOf(_d.ID) == -1)
                $.each(_ranks, function (_j, _r) {
                    //$scope.getCrewIdFromAssignedCrews(_r, _d);
                    var resu = $scope.getCrewIdFromAssignedCrews2(_r, _d);
                    
                    _d[_r] =resu? resu.cid:null;
                    if (resu)
                    {
                        if (resu.pos.startsWith('ISCCM') || resu.pos.startsWith('SCCM') || resu.pos.startsWith('CCM'))
                            _d.cabin.push(resu);
                        else
                            if (resu.pos.startsWith('IP') || resu.pos.startsWith('P1') || resu.pos.startsWith('P2'))
                            _d.cockpit.push(resu);
                        else
                            _d.other.push(resu);
                    }
                    
                });
            else
            {
                if (!_d.DHIds)
                    _d.DHIds = [];
                if (!_d.DHRanks)
                    _d.DHRanks = [];
                if (!_d.DHNames)
                    _d.DHNames = [];
               // if (!_d.DHs)
                    _d.DHs = [];
                $.each(_ranks, function (_j, _r) {
                   
                    var dhc = $scope.getCrewIdFromAssignedCrewsObj(_r, _d);
                    if (dhc)
                        _d.DHs.push({Id:dhc.Id,Name:dhc._Name,Position:dhc._Position,RosterPosition:dhc._RosterPosition,GroupOrder:dhc.GroupOrder,FlightId:_d.ID,FlightNumber:_d.FlightNumber,FlightTime:_d.FlightTime});
                });

            }
            
             
        });

       
        $scope.dg_instance.endUpdate();
       // $scope.dg_instance.refresh();
        //$scope.dg_ds[0].IP = 312;
        
      // $scope.dg_instance.repaint();
    };
    /////////////////////////////
    $scope.selectedTabIndex = -1;
    $scope.selectedTabId = null;
    $scope.tabs = [
        { text: "IP", id: 'IP' },
         { text: "P1", id: 'P1' },
          { text: "P2", id: 'P2' },
           { text: "Safety", id: 'Safety' },
            { text: "SCCM", id: 'SCCM' },
            { text: "CCM", id: 'CCM' },
             //{ text: "CCM1", id: 'CCM1' },
             // { text: "CCM2", id: 'CCM2' },
             //  { text: "CCM3", id: 'CCM3' },
                { text: "OBS", id: 'OBS' },
    ];

    $scope.$watch("selectedTabIndex", function (newValue) {
        //ati
        try {
            $('.tabc').hide();
            var id = $scope.tabs[newValue].id;
            $scope.selectedTabId = id;
            // $('#' + id).fadeIn();
            $scope.dg_crew_ds = null;
            var _ds = null;
            switch (id) {
                case 'IP':
                    _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                        return x.JobGroup == 'TRE' || x.JobGroup == 'TRI' || x.JobGroup == 'LTC' ;
                    }).ToArray();
                    break;
                case 'P1':
                    _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                        return x.JobGroup == 'P1' || x.JobGroup == 'TRE' || x.JobGroup == 'TRI' || x.JobGroup == 'LTC';
                    }).ToArray();
                    break;
                case 'P2':
                    _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                        return x.JobGroup == 'P2' || x.JobGroup=='P1';
                    }).ToArray();
                    break;
                case 'Safety':
                    _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                        return x.JobGroup == 'TRE' || x.JobGroup == 'TRI' || x.JobGroup == 'LTC' || x.JobGroup == 'P1' || x.JobGroup == 'P2';
                    }).ToArray();
                    break;
                case 'SCCM':
                    _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                        return x.JobGroup == 'SCCM';
                    }).ToArray();
                    break;
                case 'CCM':
                    _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                        return x.JobGroup == 'CCM';
                    }).ToArray();
                    break;
                case 'CCM1':
                    _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                        return x.JobGroup == 'CCM';
                    }).ToArray();
                    break;
                case 'CCM2':
                    _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                        return x.JobGroup == 'CCM';
                    }).ToArray();
                    break;
                case 'CCM3':
                    _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                        return x.JobGroup == 'CCM';
                    }).ToArray();
                    break;
                case 'OBS':
                    _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                        return x.JobGroup == 'CCM' || x.JobGroup=='P2' || x.JobGroup=='P1';
                    }).ToArray();
                    break;
                default:
                    break;
            }
            var filtered = Enumerable.From(_ds).Where(function (x) {
                var assigned = Enumerable.From($scope.assignedCrews).Where('$.CrewId==' + x.Id).ToArray();
                if (assigned && assigned.length > 0) {
                    //var f1 = Enumerable.From($scope.ds_selected_flights).Select('Number($.ID)').OrderBy('$').ToArray().join('*');
                    //var f2 = Enumerable.From(assigned).Select('Number($.FlightId)').OrderBy('$').ToArray().join('*');
                    //if (f1 == f2)
                    //    return false;
                    //return true;
                    return false;
                }
                else
                    return true;
            }).ToArray();
            $scope.dg_crew_ds = Enumerable.From(filtered).OrderBy('$.GroupOrder').ThenBy('$.RosterFlights').ThenBy('$.Flight28').ThenBy('$.Duty7').ThenBy('$.ScheduleName').ToArray();
            //jigi
            $scope.dg_crew_instance.refresh();
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
    /////////////////////////////
    var selectedRange = {};
    var isSelectionStopped;

    function foreachRange(selectedRange, func) {
        if (selectedRange.startRowIndex >= 0) {
            var minRowIndex = Math.min(selectedRange.startRowIndex, selectedRange.endRowIndex);
            var maxRowIndex = Math.max(selectedRange.startRowIndex, selectedRange.endRowIndex);
            var minColumnIndex = Math.min(selectedRange.startColumnIndex, selectedRange.endColumnIndex);
            var maxColumnIndex = Math.max(selectedRange.startColumnIndex, selectedRange.endColumnIndex);

            for (var rowIndex = minRowIndex; rowIndex <= maxRowIndex; rowIndex++) {
                for (var columnIndex = minColumnIndex; columnIndex <= maxColumnIndex; columnIndex++) {
                    func(rowIndex, columnIndex);
                }
            }
        }
    }

    function showSelection(component, selectedRange) {
        component.element().find(".cell-selected").removeClass("cell-selected");
        foreachRange(selectedRange, function (rowIndex, columnIndex) {
            component.getCellElement(rowIndex, columnIndex).addClass("cell-selected");
        });
    }
    ////////////////////////////////////
    $scope.tempContainerStyle = {};
    $scope.popup_assign_visible = false;
    $scope.popup_assign_title = 'Assign';
    $scope.popup_assign = {

        shading: false,
        position: { my: 'left', at: 'left', of: window, offset: '5 5' },
        width: 500,
        height: 450, //function () { return $(window).height() * 0.95 },
        fullScreen: true,
        showTitle: true,
        dragEnabled: true,
        //toolbarItems: [
        //    //{
        //    //    widget: 'dxButton', location: 'after', options: {
        //    //        type: 'success', text: 'Save', icon: 'arrowright', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {
        //    //            //if (!$scope.dg_upd_selected)
        //    //            //    return;
        //    //            //var data = Enumerable.From($scope.dataSource).Where('$.ID==' + $scope.dg_upd_selected.ID).FirstOrDefault();
        //    //            //if (!data)
        //    //            //    return;
        //    //            //$scope.scrollGantt(data);
        //    //            //$scope.scrollGrid(data);

        //    //        }


        //    //    }, toolbar: 'bottom'
        //    //},

        //    { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        //],

     

        closeOnOutsideClick: false,

        onShowing: function (e) {

            $scope.selectedDHIds = [];
            $scope.selectedDHItems = [];
        },
        onShown: function (e) {
            //$scope.createGantt();
            $scope.bindFlights();
            $scope.selectedTabIndex = 0;
            $scope.dg_crew_instance.repaint();
            $scope.dg2_instance.repaint();
            $scope.dg3_instance.repaint();
            $scope.tempContainerStyle.height = $(window).height() - 399;
            $scope.tempContainerStyle.padding = '5px';

            $('#xdg_crew').dxDataGrid('columnOption', 'caddcrew', 'visible', true);

        },
        onHiding: function () {
            $scope.updateFlightsDs();
           if ($scope.isGanttOpen)
                $scope.ganttFlightSelectedAll();
            $scope.assignedCrews = [];
            $scope.assignedCrewsDistinct = [];
            $scope.selectedTabIndex = -1;
            $scope.dg_crew_instance.clearSelection();
            $scope.popup_assign_visible = false;

        },
        onHidden: function () {
           
            
           
             
        },

        bindingOptions: {
            visible: 'popup_assign_visible',

            title: 'popup_assign_title',

        }
    };

    //close button
    //$scope.popup_assign.toolbarItems[0].options.onClick = function (e) {

    //    $scope.popup_assign_visible = false;

    //};
    ////////////////////////////////////
    $scope.popup_gantt_visible = false;
    $scope.popup_gantt_title = 'Flights';
    $scope.isGanttOpen=false;
    $scope.popup_gantt = {

        shading: false,
        position: { my: 'left', at: 'left', of: window, offset: '5 5' },
        width: 500,
        height: 450, //function () { return $(window).height() * 0.95 },
        fullScreen: true,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
             {
                 widget: 'dxButton', location: 'after', options: {
                     type: 'default', text: 'Clear',   onClick: function (arg) { $scope.clearSelectionGantt(); }
                 }, toolbar: 'bottom'
             }
            ,{
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Assign Crew',    onClick: function (arg) {
                        //////////////////////////
                        //$scope.selectedIds.push(id);
                        //$scope.selectedItems.push(data);
                        
                       // return;
                        //////////////////////////
                        $scope.selectedFlightIds = Enumerable.From($scope.selectedIds).ToArray();
                        $scope.ds_selected_flights = Enumerable.From($scope.dg_ds).Where(function (x) {
                            
                            return $scope.selectedIds.indexOf(x.ID) != -1;
                            // return $scope.selectedFlightIds.indexOf(x.ID) != -1;
                        }).ToArray();

                        var conflict = $scope.checkConflict($scope.ds_selected_flights);
                        var continuity = $scope.checkContinuity($scope.ds_selected_flights);
                        if (conflict || continuity) {
                            General.ShowNotify('Interuption/Continuity Error', 'error');
                            return;
                        }


                        $scope.assignedCrews = [];
                        $scope.assignedCrewsDistinct = [];
                        var ids = [];
                        var tempAssigned = [];
                        $.each($scope.ds_selected_flights, function (_i, _d) {
                            ids.push(_d.ID);
                           
                            if (_d.DHs) {
                                $.each(_d.DHs, function (_z, _dhs) {
                                    //_d.DHs.push({Id:dhc.Id,Name:dhc.Name,Position:dhc.Position,RosterPosition:dhc.RosterPosition,GroupOrder:dhc.GroupOrder,FlightId:_d.ID,FlightNumber:_d.FlightNumber,FlightTime:_d.FlightTime});
                                    tempAssigned.push({ Key: _dhs.Id.toString() + '*' + _dhs.FlifhtId.toString(), CrewId: _dhs.Id, Position: _dhs.Position, FlightId: _dhs.FlightId, Name: _dhs.Name, No: _dhs.FlightNumber, DH: true, GO: _dhs.GroupOrder, FlightTime: _dhs.FlightTime });
                                });
                              
                            }

                            if (_d.IP1) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.IP1).FirstOrDefault();
                                // $scope.assignedCrews.push({ Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'IP1', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder });
                                tempAssigned.push({ Tab: 'IP', Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'IP1', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });

                               
                            }
                            if (_d.IP2) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.IP2).FirstOrDefault();
                                tempAssigned.push({ Tab: 'IP', Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'IP2', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.P11) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P11).FirstOrDefault();
                                tempAssigned.push({ Tab: 'P1', Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P11', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.P12) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P12).FirstOrDefault();
                                tempAssigned.push({ Tab: 'P1', Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P12', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.P13) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P13).FirstOrDefault();
                                tempAssigned.push({ Tab: 'P1', Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P13', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.P14) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P14).FirstOrDefault();
                                tempAssigned.push({ Tab: 'P1', Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P14', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.P15) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P15).FirstOrDefault();
                                tempAssigned.push({ Tab: 'P1', Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P15', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.P21) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P21).FirstOrDefault();
                                tempAssigned.push({ Tab: 'P2', Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P21', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.P22) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P22).FirstOrDefault();
                                tempAssigned.push({ Tab: 'P2', Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P22', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.P23) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P23).FirstOrDefault();
                                tempAssigned.push({ Tab: 'P2', Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P23', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.P24) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P24).FirstOrDefault();
                                tempAssigned.push({ Tab: 'P2', Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P24', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.P25) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.P25).FirstOrDefault();
                                tempAssigned.push({ Tab: 'P2', Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'P25', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.Safety1) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.Safety1).FirstOrDefault();
                                tempAssigned.push({ Tab: 'Safety', Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'Safety1', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.Safety2) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.Safety2).FirstOrDefault();
                                tempAssigned.push({ Tab: 'Safety', Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'Safety2', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }

                            if (_d.ISCCM1) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.ISCCM1).FirstOrDefault();
                                tempAssigned.push({ Tab: 'ISCCM', Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'ISCCM1', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }

                            if (_d.SCCM1) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.SCCM1).FirstOrDefault();
                                tempAssigned.push({ Tab: 'SCCM', Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'SCCM1', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.SCCM2) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.SCCM2).FirstOrDefault();
                                tempAssigned.push({ Tab: 'SCCM', Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'SCCM2', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.SCCM3) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.SCCM3).FirstOrDefault();
                                tempAssigned.push({ Tab: 'SCCM', Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'SCCM3', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.SCCM4) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.SCCM4).FirstOrDefault();
                                tempAssigned.push({ Tab: 'SCCM', Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'SCCM4', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.SCCM5) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.SCCM5).FirstOrDefault();
                                tempAssigned.push({ Tab: 'SCCM', Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'SCCM5', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }

                            if (_d.CCM1) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.CCM1).FirstOrDefault();
                                tempAssigned.push({ Tab: 'CCM', Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'CCM1', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.CCM2) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.CCM2).FirstOrDefault();
                                tempAssigned.push({ Tab: 'CCM', Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'CCM2', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.CCM3) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.CCM3).FirstOrDefault();
                                tempAssigned.push({ Tab: 'CCM', Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'CCM3', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.CCM4) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.CCM4).FirstOrDefault();
                                tempAssigned.push({ Tab: 'CCM', Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'CCM4', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.CCM5) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.CCM5).FirstOrDefault();
                                tempAssigned.push({ Tab: 'CCM', Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'CCM5', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.OBS1) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.OBS1).FirstOrDefault();
                                tempAssigned.push({ Tab: 'OBS', Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'OBS1', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.OBS2) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.OBS2).FirstOrDefault();
                                tempAssigned.push({ Tab: 'OBS', Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'OBS2', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.CHECK1) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.CHECK1).FirstOrDefault();
                                tempAssigned.push({ Tab: 'CHECK', Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'CHECK1', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }
                            if (_d.CHECK2) {
                                var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + _d.CHECK2).FirstOrDefault();
                                tempAssigned.push({ Tab: 'CHECK', Key: crew.Id.toString() + '*' + _d.ID.toString(), CrewId: crew.Id, Position: 'CHECK2', FlightId: _d.ID, Name: crew.ScheduleName, No: _d.FlightNumber, DH: false, GO: crew.GroupOrder, FlightTime: _d.FlightTime });
                            }

                        });
                        var tempIds = Enumerable.From(ids).Distinct().ToArray();
                        var tempDistinct = Enumerable.From(tempAssigned).Distinct("[$.CrewId, $.FlightId].join(',')").ToArray();
                       

                        var checked = [];
                        $.each(tempDistinct, function (_j, _w) {
                            //  var _ccnt = Enumerable.From(tempDistinct).Where('$.CrewId==' + _w.CrewId).ToArray().length;
                            //  if (_ccnt == tempIds.length)
                            checked.push(_w.CrewId);
                        });

                        $scope.assignedCrewsDistinct = Enumerable.From(tempAssigned).Where(
                        function (x) {


                            return checked.indexOf(x.CrewId) != -1;
                        }
                            )
                        //.Distinct("[$.CrewId, $.Name,$.Position,$.GO].join(',')").OrderBy('$.GO').ToArray();
                        .Distinct("[$.CrewId, $.Name,$.Tab,$.GO].join(',')").OrderBy('$.GO').ToArray();
                        $.each($scope.assignedCrewsDistinct, function (_j, _w) {
                            _w._assignedFlights = $scope.getCrewFlights(_w.CrewId);

                        });
                        $scope.assignedCrews = Enumerable.From(tempAssigned).ToArray();

                        //boob
                        $scope.loadingVisible = true;
                        flightService.getFDPStats(ids.join('_')).then(function (response) {
                            $scope.loadingVisible = false;
                            $scope.FDPStat = response;
                            response.DurationStr = pad(Math.floor(response.Duration / 60)).toString() + ':' + pad(Math.round(response.Duration % 60)).toString();
                            response.FlightStr = pad(Math.floor(response.Flight / 60)).toString() + ':' + pad(Math.round(response.Flight % 60)).toString();
                            response.DutyStr = pad(Math.floor(response.Duty / 60)).toString() + ':' + pad(Math.round(response.Duty % 60)).toString();
                            response.ExtendedStr = pad(Math.floor(response.Extended / 60)).toString() + ':' + pad(Math.round(response.Extended % 60)).toString();
                            response.MaxFDPExtendedStr = pad(Math.floor(response.MaxFDPExtended / 60)).toString() + ':' + pad(Math.round(response.MaxFDPExtended % 60)).toString();
                            response.MaxFDPStr = pad(Math.floor(response.MaxFDP / 60)).toString() + ':' + pad(Math.round(response.MaxFDP % 60)).toString();
                            response.RestTo = moment(new Date(response.RestTo)).format('YY-MM-DD HH:mm');
                            $scope.dg3_ds = [];
                            //$scope.dg3_ds.push({ Title: 'Max FDP', Value: response.MaxFDPStr });
                            $scope.dg3_ds.push({ Title: 'Extended', Value: response.ExtendedStr });
                            $scope.dg3_ds.push({ Title: 'Max Ext. FDP', Value: response.MaxFDPExtendedStr });

                            $scope.dg3_ds.push({ Title: 'FDP', Value: response.DurationStr });
                            $scope.dg3_ds.push({ Title: 'Duty', Value: response.DutyStr });
                            $scope.dg3_ds.push({ Title: 'Flight', Value: response.FlightStr });
                            $scope.dg3_ds.push({ Title: 'Rest Until', Value: response.RestTo });

                            //gigi
                            var dt = new Date($scope.ds_selected_flights[0].STDDay);
                            var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
                            $scope.popup_assign_visible = true;
                            //flightService.getCrewDutyFlight(_dt).then(function (fd) {
                            //    $scope.loadingVisible = false;
                            //    $.each(fd, function (_j, _q) {
                            //        var crw = Enumerable.From($scope.ds_crew).Where('$.Id==' + _q.CrewId).FirstOrDefault();
                            //        if (crw) {
                            //            crw.Flight28 = _q.Flight28;
                            //            crw.Flight28Str = pad(Math.floor(_q.Flight28 / 60)).toString() + ':' + pad(Math.round(_q.Flight28 % 60)).toString();

                            //            crw.FlightYear = _q.FlightYear;
                            //            crw.FlightYearStr = pad(Math.floor(_q.FlightYear / 60)).toString() + ':' + pad(Math.round(_q.FlightYear % 60)).toString();

                            //            crw.FlightCYear = _q.FlightCYear;
                            //            crw.FlightCYearStr = pad(Math.floor(_q.FlightCYear / 60)).toString() + ':' + pad(Math.round(_q.FlightCYear % 60)).toString();

                            //            crw.Duty7 = _q.Duty7;
                            //            crw.Duty7Str = pad(Math.floor(_q.Duty7 / 60)).toString() + ':' + pad(Math.round(_q.Duty7 % 60)).toString();

                            //            crw.Duty14 = _q.Duty14;
                            //            crw.Duty14Str = pad(Math.floor(_q.Duty14 / 60)).toString() + ':' + pad(Math.round(_q.Duty14 % 60)).toString();

                            //            crw.Duty28 = _q.Duty28;
                            //            crw.Duty28Str = pad(Math.floor(_q.Duty28 / 60)).toString() + ':' + pad(Math.round(_q.Duty28 % 60)).toString();


                            //        }
                            //    });
                            //    $scope.popup_assign_visible = true;

                            //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                      ///////////////////////////
                    }


                }, toolbar: 'bottom'
            },

           // { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],



        closeOnOutsideClick: false,

        onShowing: function (e) {


        },
        onShown: function (e) {
            //$scope.createGantt();
            $scope.isGanttOpen=true;
            $scope.bindFlights2();
           

        },
        onHiding: function () {
            $scope.isGanttOpen=false;
            $scope.popup_gantt_visible = false;

        },
        onHidden: function () {



        },

        bindingOptions: {
            visible: 'popup_gantt_visible',

            title: 'popup_gantt_title',

        }
    };
    ////////////////////////////////////
    $scope.bindFlights = function (saveState) {
        var offset = -1 * (new Date()).getTimezoneOffset();
        $scope.dateEnd = $scope.dt_toSearched ? new Date($scope.dt_toSearched) : new Date(2020, 0, 22, 0, 0, 0);
        $scope.datefrom = $scope.dt_fromSearched ? new Date($scope.dt_fromSearched) : new Date(2020, 0, 21, 0, 0, 0);
        // $scope.dateEnd = General.getDayLastHour(new Date(new Date($scope._datefrom).addDays($scope.days_count - 1)));


        var filter = {
            Status: $scope.filterStatus,
            Types: $scope.filterType,
            Registers: $scope.filterAircraft,
            From: $scope.filterFrom,
            To: $scope.filterTo
        };


        //xati

        $scope.loadingVisible = true;
        var ed = (new Date($scope.dateEnd)).toUTCDateTimeDigits(); //(new Date($scope.dateto)).toUTCDateTimeDigits();
        var fids = $scope.selectedFlightIds.join('_');// '17020_17021_17026';
        filter.fids = fids;
        filter.tzoffset = offset;
        flightService.getFlightsGanttByFlights(fids, offset, null, filter).then(function (response) {


            ////////////////////////////////////////
            //took
            $scope.loadingVisible = false;
            $scope.baseDate = (new Date(Date.now())).toUTCString();
            $scope.ganttData = response;
            $scope.baseSum = $scope.ganttData.baseSummary;
            $scope.resourceGroups = response.resourceGroups;
            $scope.resources = response.resources;
           
            //cool
            $scope.dataSource = Flight.proccessDataSource(response.flights);

            
            Flight.activeDatasource = $scope.dataSource;




            $scope.createGantt();





        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    };
    $scope.bindFlights2 = function (saveState) {
        var offset = -1 * (new Date()).getTimezoneOffset();
        $scope.dateEnd = $scope.dt_toSearched ? new Date($scope.dt_toSearched) : new Date(2020, 0, 22, 0, 0, 0);
        $scope.datefrom = $scope.dt_fromSearched ? new Date($scope.dt_fromSearched) : new Date(2020, 0, 21, 0, 0, 0);
       


        var filter = {
            Status: $scope.filterStatus,
            Types: $scope.filterType,
            Registers: $scope.filterAircraft,
            From: $scope.filterFrom,
            To: $scope.filterTo,

        };


        //xati

        $scope.loadingVisible = true;
        var ed = (new Date($scope.dateEnd)).toUTCDateTimeDigits(); //(new Date($scope.dateto)).toUTCDateTimeDigits();
        var fids = Enumerable.From($scope.dg_ds).Select('$.ID').ToArray().join('_');// '17020_17021_17026';
        filter.fids = fids;
        filter.tzoffset = offset;
        flightService.getFlightsGanttByFlights(fids, offset, null, filter).then(function (response) {


            ////////////////////////////////////////
            //took
            $scope.loadingVisible = false;
            $scope.baseDate2 = (new Date(Date.now())).toUTCString();
            $scope.ganttData2 = response;
            $scope.baseSum2 = $scope.ganttData2.baseSummary;
            $scope.resourceGroups2 = response.resourceGroups;
            $scope.resources2 = response.resources;
          
            //cool
            $scope.dataSource2 = Flight.proccessDataSource(response.flights);

            
            Flight.activeDatasource = $scope.dataSource2;




            $scope.createGantt2();





        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    };
    ///////////////////////////////////////
    $scope.resourceGroups = [];
    $scope.resources = [];
    $scope.createGantt = function (_scale) {
        //alert($(window).width());
        var dtstr = (new Date($scope.datefrom)).yyyymmddtimenow(false);
        //  alert(dtstr);
        // alert($(window).width());
        if (!_scale) {
            _scale = $(window).width() * 0.24;
        }
        var scroll_factor = ($(window).width() / 1536);
        var ganttObj = $("#resourceGanttba").data("ejGantt");
        if (ganttObj)
            ganttObj.destroy();

        var h = 170;
        h = h + 'px';

        //var _df = General.getDayFirstHour(new Date($scope.selectedDate));
        //var d1 = (new Date(_df)).addDays(1);
        //var d2 = (new Date(_df)).addDays(-1);
        ////old
        //var _dt = General.getDayLastHour(new Date($scope.selectedDate));

        //var _data = Enumerable.From($scope.dataSource).Where(function (x) {
        //    var _ds = new Date(x.STD);
        //    var _de = new Date(x.STA);
        //    return (_ds >= _df && _ds <= _dt) || (_de >= _df && _de <= _dt);
        //}).ToArray();

        //var nextDayTask = Enumerable.From(_data).Where(function (x) {
        //    //var _ds = new Date(x.STD);
        //    var _dsta = new Date(x.STA);
        //    var _dcin = new Date(x.STA);
        //    var _dland = new Date(x.STA);
        //    if (x.Landing)
        //        _dland = new Date(x.Landing);
        //    if (x.ChocksIn)
        //        _dcin = new Date(x.ChocksIn);
        //    return (_dsta > _dt || _dcin > _dt || _dland > _dt);
        //}).ToArray();



        var showscroll = true;
        //var scrollnextday = true;
        var _scroll = 0;
        //if (nextDayTask && nextDayTask.length > 0) {
        //    _dt = General.getDayLastHour(new Date(d1));
        //    showscroll = true;
        //    _scroll = 400 * scroll_factor;

        //}




        //var linkedExist = Enumerable.From(_data).Where('$.LinkedFlight').FirstOrDefault();
        //noos
        var first = $scope.ds_selected_flights[0].STDDay;
        var last = $scope.ds_selected_flights[$scope.ds_selected_flights.length - 1].STDDay;


        var dt = (new Date(last)).addDays(1);//$scope.dt_to ? new Date($scope.dt_to) : new Date(2020, 0, 22, 0, 0, 0);
        var df = new Date(first); //$scope.dt_from ? new Date($scope.dt_from) : new Date(2020, 0, 21, 0, 0, 0);
        var _data = Enumerable.From($scope.dataSource).Where(function (x) {
            return true;
        }).ToArray();

        $("#resourceGanttba").ejGantt({
            scheduleStartDate: df, //$scope.datefrom,
            scheduleEndDate: dt,//$scope.dateto,

            taskbarBackground: "red",
            selectionMode: ej.Gantt.SelectionMode.Cell,
            selectionType: ej.Gantt.SelectionType.Single,
            taskbarClick: function (args) {
                $scope.addSelectedFlight(args.data.item);
                $("#resourceGanttba").data("ejGantt").clearSelection();
            },
            dataSource: _data, //$scope.dataSource, //self.datasource, //resourceGanttData,
            allowColumnResize: true,
            isResponsive: true,
            taskIdMapping: "taskId",
            taskNameMapping: "taskName",
            fromLocationMapping: "from",
            startDateMapping: "startDate",
            endDateMapping: "endDate",
            progressMapping: "progress",
            durationMapping: "duration",
            groupNameMapping: "Title",
            groupIdMapping: "groupId",
            groupCollection: $scope.resourceGroups,
            resources: $scope.resources, //resourceGanttResources,
            resourceIdMapping: "resourceId",
            resourceNameMapping: "resourceName",
            resourceInfoMapping: "resourceId",
            notesMapping: "notes",

            rightTaskLabelMapping: "taskName",

            baselineStartDateMapping: "BaselineStartDate",
            baselineEndDateMapping: "BaselineEndDate",

            highlightWeekEnds: true,
            includeWeekend: false,
            rowHeight: 30,
            taskbarHeight: 30,





            predecessorMapping: "predecessor",
            allowGanttChartEditing: false,
            allowDragAndDrop: true,
            editSettings: {
                allowEditing: true,
                allowAdding: true,
                allowDeleting: true,

                editMode: "normal",
            },
            splitterSettings: {
                position: 110,
            },

            enableContextMenu: false,
            load: function () {
            
                $scope.ganttCreated = true;
                this.getColumns()[0].width = 110;
                
                var customColumn = {
                    field: "isOverallocated",
                    mappingName: "isOverallocated",
                    allowEditing: false,
                    headerText: "Is Overallocated",
                    isTemplateColumn: true,
                    template: "{{if eResourceTaskType=='resourceTask'}} <span style='padding:10px;'> {{if eOverlapped}} Yes {{else}} No {{/if}} </span> {{/if}}"
                };
                //this.getColumns().push(customColumn);

                var columnFrom = { field: "from", mappingName: "from", headerText: "From" };
                //this.getColumns().push(columnFrom);

                var columnbaseDuration = { field: "baseDuration", mappingName: "baseDuration", headerText: "baseDuration" };





            },
            create: function (args) {
                try {


                    $('.e-ganttviewerbodyContianer').data("ejScroller").scrollX(_scroll);
                    if (!showscroll)
                        $('.e-scrollbar.e-js.e-widget.e-hscrollbar').remove();
                    // $scope.renderTopTimeHeader();
                    // $scope.renderTimeHeader();



                    $('.e-ganttviewerbodyContianer-stripLines').css('z-index', 0);
                    $scope.timeCellWidth = $('.e-schedule-day-headercell-content').width();



                }
                catch (ee) {
                    alert(ee);
                }






            },

            cellSelecting: function (args) {
                if (!args)
                    return;

                if (args.data.eResourceTaskType != "resourceTask")
                    args.cancel = true;
            },
            cellSelected: function (args) {

            },
            //  cellSelected: function (args) { console.log(args); },
            actionBegin: function (args) {


            },
            actionComplete: function (args) {

            },

            workingTimeScale: "TimeScale24Hours",
            durationUnit: ej.Gantt.DurationUnit.Hour,
            scheduleHeaderSettings: {
                //poosk
                scheduleHeaderType: ej.Gantt.ScheduleHeaderType.Day,
                // dayHeaderFormat: "MMM MM ddd dd , yyyy",
                dayHeaderFormat: "dd-MMM-yyyy",
                //dayHeaderFormat: "DAY dd",
                minutesPerInterval: ej.Gantt.minutesPerInterval.Auto,
                timescaleStartDateMode: ej.Gantt.TimescaleRoundMode.Auto,
                timescaleUnitSize: "300" + "%"
            },

            taskbarTemplate: "#taskbarTemplateLightRoster",
            leftTaskLabelTemplate: "#leftlableTemplate",
            viewType: ej.Gantt.ViewType.ResourceView,
            sizeSettings: { height: h },
            groupSettings: {
            },
            showStackedHeader: false,
            taskSchedulingMode: ej.Gantt.TaskSchedulingMode.Manual,
            enableTaskbarTooltip: false,
            // stripLines: [{ day: (new Date($scope.datefrom)).yyyymmddtime(false), lineWidth: "2", lineColor: "Darkblue", lineStyle: "dotted" }]
            //  stripLines: [{ day: dtstr, lineWidth: "2", lineColor: "Darkblue", lineStyle: "dotted" }]
        });
    };
    //////////////////////////////////////////
    //Gantt2
    $scope.addSelectedFlight = function (item) {
    };
    $scope.resourceGroups2 = [];
    $scope.resources2 = [];
    $scope.createGantt2 = function (_scale) {
        //alert($(window).width());
        var dtstr = (new Date($scope.datefrom)).yyyymmddtimenow(false);
        //  alert(dtstr);
        // alert($(window).width());
        if (!_scale) {
            _scale = $(window).width() * 0.6;
        }
        var scroll_factor = ($(window).width() / 1536);
        var ganttObj = $("#resourceGanttba2").data("ejGantt");
        if (ganttObj)
            ganttObj.destroy();

        var h = $(window).height()-120;
        h = h + 'px';
        $('#gantt-crews').height($(window).height() - 150);
        var showscroll = true;
        //var scrollnextday = true;
        var _scroll = 0;
         
        //noos
        //var first = $scope.ds_selected_flights[0].STDDay;
        //var last = $scope.ds_selected_flights[$scope.ds_selected_flights.length - 1].STDDay;
        


       // var dt = (new Date(last)).addDays(1);//$scope.dt_to ? new Date($scope.dt_to) : new Date(2020, 0, 22, 0, 0, 0);
        // var df = new Date(first); //$scope.dt_from ? new Date($scope.dt_from) : new Date(2020, 0, 21, 0, 0, 0);
        var dt = $scope.dt_toSearched ? new Date($scope.dt_toSearched) : new Date(2020, 0, 24, 0, 0, 0);
        var df = $scope.dt_fromSearched ? new Date($scope.dt_fromSearched) : new Date(2020, 0, 21, 0, 0, 0);
        var _data = Enumerable.From($scope.dataSource2).Where(function (x) {
            return true;
        }).ToArray();

        $("#resourceGanttba2").ejGantt({
            scheduleStartDate: df, //$scope.datefrom,
            scheduleEndDate: dt,//$scope.dateto,

            taskbarBackground: "red",
            selectionMode: ej.Gantt.SelectionMode.Cell,
            selectionType: ej.Gantt.SelectionType.Single,
      
            taskbarClick: function (args) {
               
                 $scope.addSelectedFlight(args.data.item);
                 $("#resourceGanttba2").data("ejGantt").clearSelection();
            },
            dataSource: _data, //$scope.dataSource, //self.datasource, //resourceGanttData,
            allowColumnResize: true,
            isResponsive: true,
            taskIdMapping: "taskId",
            taskNameMapping: "taskName",
            fromLocationMapping: "from",
            startDateMapping: "startDate",
            endDateMapping: "endDate",
            progressMapping: "progress",
            durationMapping: "duration",
            groupNameMapping: "Title",
            groupIdMapping: "groupId",
            groupCollection: $scope.resourceGroups2,
            resources: $scope.resources2, //resourceGanttResources,
            resourceIdMapping: "resourceId",
            resourceNameMapping: "resourceName",
            resourceInfoMapping: "resourceId",
            notesMapping: "notes",

            rightTaskLabelMapping: "taskName",

            baselineStartDateMapping: "BaselineStartDate",
            baselineEndDateMapping: "BaselineEndDate",

            highlightWeekEnds: true,
            includeWeekend: false,
            rowHeight: 50,
            taskbarHeight: 50,





            predecessorMapping: "predecessor",
            allowGanttChartEditing: false,
            allowDragAndDrop: true,
            editSettings: {
                allowEditing: true,
                allowAdding: true,
                allowDeleting: true,

                editMode: "normal",
            },
            splitterSettings: {
                position: 110,
            },

            enableContextMenu: false,
            load: function () {
               
                $scope.ganttCreated = true;
                this.getColumns()[0].width = 110;
               
                var customColumn = {
                    field: "isOverallocated",
                    mappingName: "isOverallocated",
                    allowEditing: false,
                    headerText: "Is Overallocated",
                    isTemplateColumn: true,
                    template: "{{if eResourceTaskType=='resourceTask'}} <span style='padding:10px;'> {{if eOverlapped}} Yes {{else}} No {{/if}} </span> {{/if}}"
                };
                //this.getColumns().push(customColumn);

                var columnFrom = { field: "from", mappingName: "from", headerText: "From" };
                //this.getColumns().push(columnFrom);

                var columnbaseDuration = { field: "baseDuration", mappingName: "baseDuration", headerText: "baseDuration" };





            },
            create: function (args) {
                try {


                    $('.e-ganttviewerbodyContianer').data("ejScroller").scrollX(_scroll);
                    if (!showscroll)
                        $('.e-scrollbar.e-js.e-widget.e-hscrollbar').remove();
                    // $scope.renderTopTimeHeader();
                    // $scope.renderTimeHeader();



                    $('.e-ganttviewerbodyContianer-stripLines').css('z-index', 0);
                    $scope.timeCellWidth = $('.e-schedule-day-headercell-content').width();



                }
                catch (ee) {
                    alert(ee);
                }






            },

            //cellSelecting: function (args) {
            //    if (!args)
            //        return;

            //    if (args.data.eResourceTaskType != "resourceTask")
            //        args.cancel = true;
            //},
            //cellSelected: function (args) {

            //},
            cellSelecting: function (args) {
                if (!args)
                    return;

                if (args.data.eResourceTaskType != "resourceTask")
                    args.cancel = true;
            },
            cellSelected: function (args) {
                $('.e-gantt-taskbarSelection').removeClass('e-gantt-taskbarSelection');


                $scope.setSelectedResource(args.data);
            },
            actionBegin: function (args) {


            },
            actionComplete: function (args) {

            },

            workingTimeScale: "TimeScale24Hours",
            durationUnit: ej.Gantt.DurationUnit.Hour,
            scheduleHeaderSettings: {
                //poosk
                scheduleHeaderType: ej.Gantt.ScheduleHeaderType.Day,
                // dayHeaderFormat: "MMM MM ddd dd , yyyy",
                dayHeaderFormat: "dd-MMM-yyyy",
                //dayHeaderFormat: "DAY dd",
                minutesPerInterval: ej.Gantt.minutesPerInterval.Auto,
                timescaleStartDateMode: ej.Gantt.TimescaleRoundMode.Auto,
                timescaleUnitSize: "350" + "%"
            },

            //taskbarTemplate: "#taskbarTemplateLightRoster",
            taskbarTemplate: "#taskbarTemplateLightRosterSelection",
            leftTaskLabelTemplate: "#leftlableTemplate",
            viewType: ej.Gantt.ViewType.ResourceView,
            sizeSettings: { height: h },
            groupSettings: {
            },
            showStackedHeader: false,
            taskSchedulingMode: ej.Gantt.TaskSchedulingMode.Manual,
            enableTaskbarTooltip: false,
            
            // stripLines: [{ day: (new Date($scope.datefrom)).yyyymmddtime(false), lineWidth: "2", lineColor: "Darkblue", lineStyle: "dotted" }]
            //  stripLines: [{ day: dtstr, lineWidth: "2", lineColor: "Darkblue", lineStyle: "dotted" }]
        });
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
    $scope.loadingVisible2 = false;
    $scope.loadPanel2 = {
        message: 'Please wait...',
        position: { of: "#temp-container", my: 'center', at: 'center' },
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
            visible: 'loadingVisible2'
        }
    };
    ////////////////////////////////////

    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Roster';


        $('.roster').fadeIn(400, function () {

        });
    }
    //////////////////////////////////////////
    $scope.bind = function () {
        $scope.btnGanttDisabled=true;
        $scope.dt_fromSearched=new Date($scope.dt_from);
        $scope.dt_toSearched = new Date($scope.dt_to).addDays(0);

        var dt = $scope.dt_toSearched ? new Date($scope.dt_toSearched) : new Date(2020, 0, 24, 0, 0, 0);
        var df = $scope.dt_fromSearched ? new Date($scope.dt_fromSearched) : new Date(2020, 0, 21, 0, 0, 0);


        var diff = Math.abs(General.getDayLastHour(new Date($scope.dt_toSearched)) - General.getDayFirstHour(new Date($scope.dt_fromSearched)));
        var days = ((diff / 1000) / 60/60/24);
        if (days > 7)
        {
            General.ShowNotify('Selected date range is greater than 7-day period.', 'error');
            return;
        }
        $scope.prePostDs = [];
        var _df = moment(df).format('YYYY-MM-DDTHH:mm:ss');
        var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
        //$scope.loadingVisible = true;
        flightService.getRosterSheet(_df, _dt).then(function (response) {
            // $scope.loadingVisible = false;
            //nipple
            //_d.DHs.push({Id:dhc.Id,Name:dhc._Name,Position:dhc._Position,RosterPosition:dhc._RosterPosition,GroupOrder:dhc.GroupOrder,FlightId:_d.ID,FlightNumber:_d.FlightNumber,FlightTime:_d.FlightTime});
            $.each(response, function (_i, flt) {
                flt.cockpit = [];
                flt.cabin = [];
                flt.instructor = [];
                flt.other = [];
                if (flt.DeadHeads)
                {
                    flt.DHs = [];
                    var crws = flt.DeadHeads.split("*");
                    $.each(crws, function (_j, crw) {
                        var parts = crw.split('#');
                        //$scope.getPosition
                        //DABIRCHIAN#309#1157#1
                        var rec = {};
                        rec.Name = parts[0];
                        rec.Id = parts[1];
                       
                        rec.Position = $scope.getPosition(Number( parts[2])) + parts[3];
                        rec.RosterPosition = parts[3];
                        rec.GroupOrder = null;
                        rec.FlightId = flt.ID;
                        rec.FlightNumber = flt.FlightNumber;
                        rec.FlightTime = flt.FlightTime;
                        flt.DHs.push(rec);
                    });
                }
            });
            $scope.dg_ds = response;
           
            $scope.fillCrew();
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    $scope.ds_crew = null;
    $scope.getFilteredCrewDs = function (id) {
        var _ds = null;
        switch (id) {
            case 'IP':
                _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                    return x.JobGroup == 'TRE' || x.JobGroup == 'TRI' || x.JobGroup == 'LTC';
                }).OrderBy('$.FLight28').ThenBy('$.Duty7').ToArray();
                break;
            case 'P1':
                _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                    return x.JobGroup == 'P1' || x.JobGroup == 'TRE' || x.JobGroup == 'TRI' || x.JobGroup == 'LTC';
                }).OrderBy('$.FLight28').ThenBy('$.Duty7').ToArray();
                break;
            case 'P2':
                _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                    return x.JobGroup == 'P2' || x.JobGroup == 'P1' || x.JobGroup == 'TRE';
                }).OrderBy('$.FLight28').ThenBy('$.Duty7').ToArray();
                break;
            case 'Safety':
                _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                    return x.JobGroup == 'TRE' || x.JobGroup == 'TRI' || x.JobGroup == 'LTC' || x.JobGroup == 'P1' || x.JobGroup == 'P2';
                }).OrderBy('$.FLight28').ThenBy('$.Duty7').ToArray();
                break;
            case 'SCCM':
                _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                    return x.JobGroup == 'SCCM';
                }).OrderBy('$.FLight28').ThenBy('$.Duty7').ToArray();
                break;
            case 'ISCCM':
                _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                    return x.JobGroup == 'ISCCM';
                }).OrderBy('$.FLight28').ThenBy('$.Duty7').ToArray();
                break;
            case 'CCM':
                _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                    return x.JobGroup == 'CCM';
                }).OrderBy('$.FLight28').ThenBy('$.Duty7').ToArray();
                break;
            case 'CCM1':
                _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                    return x.JobGroup == 'CCM';
                }).OrderBy('$.FLight28').ThenBy('$.Duty7').ToArray();
                break;
            case 'CCM2':
                _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                    return x.JobGroup == 'CCM';
                }).OrderBy('$.FLight28').ThenBy('$.Duty7').ToArray();
                break;
            case 'CCM3':
                _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                    return x.JobGroup == 'CCM';
                }).OrderBy('$.FLight28').ThenBy('$.Duty7').ToArray();
                break;
            case 'OBS':
                _ds = Enumerable.From($scope.ds_crew).Where(function (x) {
                    return x.JobGroup == 'CCM' || x.JobGroup == 'P1' || x.JobGroup == 'P2';
                }).OrderBy('$.FLight28').ThenBy('$.Duty7').ToArray();
                break;
            default:
                break;
        }

        return _ds;
    };

    ///////////////////////////////////
    $scope.updateFlightsDsInit = function () {
        $scope.dg_instance.beginUpdate();
         
        var flights = Enumerable.From($scope.dg_ds).Where(function (x) {
            return true;
        }).ToArray();

         
        var _ranks = ['IP', 'IP1', 'IP2', 'P1', 'P11', 'P12', 'P13', 'P14', 'P15', 'P2', 'P21', 'P22', 'P23', 'P24', 'P25', 'Safety1', 'Safety2', 'CCM', 'CCM1'
        , 'CCM2', 'CCM3', 'CCM4', 'CCM5', 'SCCM', 'SCCM1', 'SCCM2', 'SCCM3', 'SCCM4', 'SCCM5', 'OBS1', 'OBS2', 'ISCCM', 'ISCCM1', 'CHECK1', 'CHECK2'];
        $.each(flights, function (_i, _d) {
            _d.cockpit = [];
            _d.cabin = [];
            _d.instructor = [];
            _d.other = [];
            
                $.each(_ranks, function (_j, _r) {
                    //$scope.getCrewIdFromAssignedCrews(_r, _d);
                    var x =_d[_r];

                    
                    if (x) {
                        var resu = {};
                        resu.pos = _r;
                        resu.cid = x;
                        resu.name = _d[_r + 'Name'];
                        if (resu.pos.startsWith('ISCCM') || resu.pos.startsWith('SCCM') || resu.pos.startsWith('CCM'))
                            _d.cabin.push(resu);
                        else
                            if (resu.pos.startsWith('IP') || resu.pos.startsWith('P1') || resu.pos.startsWith('P2'))
                                _d.cockpit.push(resu);
                            else
                                _d.other.push(resu);
                    }

                });
                

        });


        $scope.dg_instance.endUpdate();
        
    };

    /////////////////////////////////////
    $scope.crewDuties = [];
    $scope.fillCrew = function () {

        //$scope.loadingVisible = true;
        //5-24
        //6-11
        var _dt = moment($scope.dt_fromSearched).format('YYYY-MM-DDTHH:mm:ss');
        
        var d2 = $scope.dt_toSearched ? new Date($scope.dt_toSearched) : new Date(2020, 0, 21, 0, 0, 0);
        var _d2 = moment(d2).format('YYYY-MM-DDTHH:mm:ss');
       
        flightService.getCrewForRosterByDate(1, _dt).then(function (response) {
            $scope.loadingVisible = false;
            $scope.ds_crew = response;
            $scope.updateFlightsDsInit();
            $.each($scope.ds_crew, function (_i, crw) {
                 
                var _cflts = $scope.getCrewFlightsObj(crw.Id);
                var _cfltsSum = Enumerable.From(_cflts).Sum('$.FlightTime');
                //console.log('        ********* Flights **********');
                //console.log(_cflts);

                //console.log('***********************************')
                
                crw.isFtl = false;
                crw.CurrentFlightsTime = _cfltsSum;
                
                crw.RosterFlights = crw.Flight28 + _cfltsSum;
                crw.RosterFlightsStr = $scope.formatMinutes(crw.RosterFlights);
             
                //crw.Flight28 = 0;


                //crw.FlightYear = 0;


                //crw.FlightCYear = 0;


                //crw.Duty7 = 0;


                //crw.Duty14 = 0;


                //crw.Duty28 = 0;

            });

            $scope.dg_instance.beginUpdate();
            $scope.dg_instance.columnOption('IP1', 'lookup.dataSource', $scope.getFilteredCrewDs('IP'));
            $scope.dg_instance.columnOption('IP2', 'lookup.dataSource', $scope.getFilteredCrewDs('IP'));
            $scope.dg_instance.columnOption('CCM1', 'lookup.dataSource', $scope.getFilteredCrewDs('CCM'));
            $scope.dg_instance.columnOption('CCM2', 'lookup.dataSource', $scope.getFilteredCrewDs('CCM'));
            $scope.dg_instance.columnOption('CCM3', 'lookup.dataSource', $scope.getFilteredCrewDs('CCM'));
            $scope.dg_instance.columnOption('CCM4', 'lookup.dataSource', $scope.getFilteredCrewDs('CCM'));
            $scope.dg_instance.columnOption('CCM5', 'lookup.dataSource', $scope.getFilteredCrewDs('CCM'));
            $scope.dg_instance.columnOption('OBS1', 'lookup.dataSource', $scope.getFilteredCrewDs('OBS'));
            $scope.dg_instance.columnOption('OBS2', 'lookup.dataSource', $scope.getFilteredCrewDs('OBS'));
            $scope.dg_instance.columnOption('SCCM1', 'lookup.dataSource', $scope.getFilteredCrewDs('SCCM'));
            $scope.dg_instance.columnOption('SCCM2', 'lookup.dataSource', $scope.getFilteredCrewDs('SCCM'));
            $scope.dg_instance.columnOption('SCCM3', 'lookup.dataSource', $scope.getFilteredCrewDs('SCCM'));
            $scope.dg_instance.columnOption('SCCM4', 'lookup.dataSource', $scope.getFilteredCrewDs('SCCM'));
            $scope.dg_instance.columnOption('SCCM5', 'lookup.dataSource', $scope.getFilteredCrewDs('SCCM'));

            $scope.dg_instance.columnOption('P11', 'lookup.dataSource', $scope.getFilteredCrewDs('P1'));
            $scope.dg_instance.columnOption('P12', 'lookup.dataSource', $scope.getFilteredCrewDs('P1'));
            $scope.dg_instance.columnOption('P13', 'lookup.dataSource', $scope.getFilteredCrewDs('P1'));
            $scope.dg_instance.columnOption('P14', 'lookup.dataSource', $scope.getFilteredCrewDs('P1'));
            $scope.dg_instance.columnOption('P15', 'lookup.dataSource', $scope.getFilteredCrewDs('P1'));
            $scope.dg_instance.columnOption('P21', 'lookup.dataSource', $scope.getFilteredCrewDs('P2'));
            $scope.dg_instance.columnOption('P22', 'lookup.dataSource', $scope.getFilteredCrewDs('P2'));
            $scope.dg_instance.columnOption('P23', 'lookup.dataSource', $scope.getFilteredCrewDs('P2'));
            $scope.dg_instance.columnOption('P24', 'lookup.dataSource', $scope.getFilteredCrewDs('P2'));
            $scope.dg_instance.columnOption('P25', 'lookup.dataSource', $scope.getFilteredCrewDs('P2'));
            $scope.dg_instance.columnOption('Safety1', 'lookup.dataSource', $scope.getFilteredCrewDs('Safety'));
            $scope.dg_instance.columnOption('Safety2', 'lookup.dataSource', $scope.getFilteredCrewDs('Safety'));

            $scope.dg_instance.columnOption('CHECK1', 'lookup.dataSource', $scope.getFilteredCrewDs('CCM'));
            $scope.dg_instance.columnOption('CHECK2', 'lookup.dataSource', $scope.getFilteredCrewDs('CCM'));

            $scope.dg_instance.columnOption('ISCCM1', 'lookup.dataSource', $scope.getFilteredCrewDs('ISCCM'));

            $scope.dg_instance.endUpdate();
            $scope.crewDuties = [];
            flightService.rosterDuties({},_dt, _d2).then(function (response) {
                $.each(response, function (_k, _o) {
                    var _dty = Enumerable.From($scope.ds_crew).Where('$.Id==' + _o.crewId).FirstOrDefault();
                    if (_dty)
                        _o.ScheduleName = _dty.ScheduleName;
                });
                $scope.crewDuties = (response);
                console.log("Duties");
                console.log($scope.crewDuties);
                $scope.btnGanttDisabled = false;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };


    $scope.getDuties = function (callback) {
        var _dt = moment($scope.dt_fromSearched).format('YYYY-MM-DDTHH:mm:ss');
        var d2 = $scope.dt_toSearched ? new Date($scope.dt_toSearched) : new Date(2020, 0, 21, 0, 0, 0);
        var _d2 = moment(d2).format('YYYY-MM-DDTHH:mm:ss');
        $scope.crewDuties = [];
        flightService.rosterDuties({}, _dt, _d2).then(function (response) {
            $.each(response, function (_k, _o) {
                var _dty = Enumerable.From($scope.ds_crew).Where('$.Id==' + _o.crewId).FirstOrDefault();
                if (_dty)
                    _o.ScheduleName = _dty.ScheduleName;
            });
            $scope.crewDuties = (response);
             

            callback();
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    }
    ////////////////////////////////////////////
    $scope.selectedIds = [];
    $scope.selectedItems = [];

    $scope.selectedDHIds = [];
    $scope.selectedDHItems = [];
    ////////////////////////////////////////////
    $scope.ganttFlightUnSelected = function (fid) {

        $scope.$apply(function () {
            try {
                $scope.ganttFlightCrews = Enumerable.From($scope.ganttFlightCrews).Where('$.ID!=' + fid).ToArray();
               

            }
            catch (e) {
                alert(e)
            }

        });
    };
    $scope.ganttFlightSelected = function (fid) {
       
        $scope.$apply(function () {
            try{
                var flight = Enumerable.From($scope.dg_ds).Where('$.ID==' + fid).FirstOrDefault();
                var rec = { ID: fid, FlightNumber: flight.FlightNumber, Register: flight.Register, FromAirportIATA: flight.FromAirportIATA, ToAirportIATA: flight.ToAirportIATA, STDLocal: flight.STDLocal, STALocal: flight.STALocal };
                rec.Crews = $scope.getFlightCrews(fid);
                $scope.ganttFlightCrews.push(rec);
                
                $scope.ganttFlightCrews = Enumerable.From($scope.ganttFlightCrews).OrderBy('$.STDLocal').ToArray();
                
                 
                 
            }
            catch (e) {
                alert(e)
            }
           
        });
    };
    $scope.ganttFlightSelectedAll = function () {
        $scope.ganttFlightCrews=[];

        
        try {
            $.each($scope.selectedIds,function(_i,fid){
                var flight = Enumerable.From($scope.dg_ds).Where('$.ID==' + fid).FirstOrDefault();
                var rec = { ID: fid, FlightNumber: flight.FlightNumber, Register: flight.Register, FromAirportIATA: flight.FromAirportIATA, ToAirportIATA: flight.ToAirportIATA, STDLocal: flight.STDLocal, STALocal: flight.STALocal };
                rec.Crews = $scope.getFlightCrews(fid);
                $scope.ganttFlightCrews.push(rec);

                $scope.ganttFlightCrews = Enumerable.From($scope.ganttFlightCrews).OrderBy('$.STDLocal').ToArray();

                
            });
               

            }
            catch (e) {
                alert(e)
            }

         
    };
    $scope.refreshStat = function () {
        var ids = [];
        $.each($scope.ds_selected_flights, function (_i, flt) {
            ids.push(flt.ID);
        });
        $scope.loadingVisible = true;
        flightService.getFDPStats(ids.join('_'), $scope.selectedDHIds.length).then(function (response) {
            $scope.loadingVisible = false;
           
            $scope.FDPStat = response;
            response.DurationStr = pad(Math.floor(response.Duration / 60)).toString() + ':' + pad(Math.round(response.Duration % 60)).toString();
            response.FlightStr = pad(Math.floor(response.Flight / 60)).toString() + ':' + pad(Math.round(response.Flight % 60)).toString();
            response.DutyStr = pad(Math.floor(response.Duty / 60)).toString() + ':' + pad(Math.round(response.Duty % 60)).toString();
            response.ExtendedStr = pad(Math.floor(response.Extended / 60)).toString() + ':' + pad(Math.round(response.Extended % 60)).toString();
            response.MaxFDPExtendedStr = pad(Math.floor(response.MaxFDPExtended / 60)).toString() + ':' + pad(Math.round(response.MaxFDPExtended % 60)).toString();
            response.MaxFDPStr = pad(Math.floor(response.MaxFDP / 60)).toString() + ':' + pad(Math.round(response.MaxFDP % 60)).toString();
            response.RestTo = moment(new Date(response.RestTo)).format('YY-MM-DD HH:mm');
            $scope.dg3_ds = [];
            //$scope.dg3_ds.push({ Title: 'Max FDP', Value: response.MaxFDPStr });
            $scope.dg3_ds.push({ Title: 'Extended', Value: response.ExtendedStr });
            $scope.dg3_ds.push({ Title: 'Max Ext. FDP', Value: response.MaxFDPExtendedStr });

            $scope.dg3_ds.push({ Title: 'FDP', Value: response.DurationStr });
            $scope.dg3_ds.push({ Title: 'Duty', Value: response.DutyStr });
            $scope.dg3_ds.push({ Title: 'Flight', Value: response.FlightStr });
            $scope.dg3_ds.push({ Title: 'Rest Until', Value: response.RestTo });
            $scope.getTempDuties();
            //gigi
            //var dt = new Date($scope.ds_selected_flights[0].STDDay);
            //var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
            //flightService.getCrewDutyFlight(_dt).then(function (fd) {
            //    $scope.loadingVisible = false;
            //    $.each(fd, function (_j, _q) {
            //        var crw = Enumerable.From($scope.ds_crew).Where('$.Id==' + _q.CrewId).FirstOrDefault();
            //        if (crw) {
            //            crw.Flight28 = _q.Flight28;
            //            crw.Flight28Str = pad(Math.floor(_q.Flight28 / 60)).toString() + ':' + pad(Math.round(_q.Flight28 % 60)).toString();

            //            crw.FlightYear = _q.FlightYear;
            //            crw.FlightYearStr = pad(Math.floor(_q.FlightYear / 60)).toString() + ':' + pad(Math.round(_q.FlightYear % 60)).toString();

            //            crw.FlightCYear = _q.FlightCYear;
            //            crw.FlightCYearStr = pad(Math.floor(_q.FlightCYear / 60)).toString() + ':' + pad(Math.round(_q.FlightCYear % 60)).toString();

            //            crw.Duty7 = _q.Duty7;
            //            crw.Duty7Str = pad(Math.floor(_q.Duty7 / 60)).toString() + ':' + pad(Math.round(_q.Duty7 % 60)).toString();

            //            crw.Duty14 = _q.Duty14;
            //            crw.Duty14Str = pad(Math.floor(_q.Duty14 / 60)).toString() + ':' + pad(Math.round(_q.Duty14 % 60)).toString();

            //            crw.Duty28 = _q.Duty28;
            //            crw.Duty28Str = pad(Math.floor(_q.Duty28 / 60)).toString() + ':' + pad(Math.round(_q.Duty28 % 60)).toString();


            //        }
            //    });
            //    $scope.popup_assign_visible = true;

            //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    //////////////////////////////////////////////
    $scope.dg_calcrew_columns = [
           // { dataField: 'Selected', caption: '', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width:45},
          { dataField: 'ScheduleName', caption: 'Schedule Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,sortIndex:1,sortOrder:'asc' },
           { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
             { dataField: 'GroupOrder', caption: 'O', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, visible: false,sortIndex:0,sortOrder:'asc' },


    ];
    $scope.dg_calcrew_selected = null;
    $scope.dg_calcrew_instance = null;
    $scope.dg_calcrew_ds = null;
    $scope.dg_calcrew = {
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
        keyExpr:'Id',
        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },
         
        columnAutoWidth: false,
        height: function () {
            return $(window).height() - 114;
        },

        columns: $scope.dg_calcrew_columns,
        onContentReady: function (e) {
            if (!$scope.dg_calcrew_instance)
                $scope.dg_calcrew_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_calcrew_selected = null;

            }
            else {
                $scope.dg_calcrew_selected = data;
                $scope.cal_change();
            }
            var scrollable = e.component.getView('rowsView')._scrollable;
            var selectedRowElements = e.component.element().find('tr.dx-selection');
            scrollable.scrollToElement(selectedRowElements);
        },
        onRowPrepared: function (e) {
            //if (e.data && e.data.AvailabilityId != 1)
            //    e.rowElement.css('background', '#ffcccc');

        },

        bindingOptions: {
            dataSource: 'ds_crew',

        }
    };

    //sima
    $scope.crewFDPs = [];
    $scope.removeDutyCal = function (duty) {
       
        if (duty.dutyType != 1165) {
            if (duty.Id < 0) {
                $scope.crewDuties = Enumerable.From($scope.crewDuties).Where('$.Id!=' + duty.Id).ToArray();
                $scope.cal_crew_instance.deleteAppointment(duty);
            }
            else {
                var dto = { fdp: duty.Id };
                $scope.loadingVisible = true;
                flightService.saveDeleteFDP(dto).then(function (response) {
                    $scope.loadingVisible = false;
                    $scope.prePostDs = Enumerable.From($scope.prePostDs).Where('$.Id!=' + duty.CrewId).ToArray();
                    console.log('$scope.prePostDs');
                    console.log($scope.prePostDs);
                    $scope.cal_crew_instance.deleteAppointment(duty);
                 
                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            }
        }
    };
    $scope.cal_change = function () {
       
        if (!$scope.cal_crew_current)
            return;
        if (!$scope.dg_calcrew_selected)
            return;
        var prts = (new Date($scope.cal_crew_current)).getDatePartArray();
        var crewid = $scope.dg_calcrew_selected.Id;
        $scope.getCrewFDPs(prts[0], prts[1] + 1, crewid, function (data) {

             $scope.cal_crew_ds = data;
        });


    };
    $scope.getCrewFDPs = function (year, month, crewid, callback) {
        //sheler
        $scope.getTempDutiesCalendar(crewid,year, month, function (result) {
            console.log('temp cal');
            console.log(result);
            //var rosterDuties = Enumerable.From($scope.crewDuties).Where('$.crewId==' + crewid).ToArray();
            //$.each(rosterDuties, function (_i,_d) {
            //    result.push(_d);
            //});
            callback(result);
        });

        //if (year, month, crewid) {
        //    var data = Enumerable.From($scope.crewFDPs).Where('$.CrewId==' + crewid + ' && $.DateStartYear==' + year + ' && $.DateStartMonth==' + month).FirstOrDefault();
        //    if (!data) {
        //        $scope.loadingVisible = true;
        //        flightService.getCrewFDPByYearMonth(crewid, year, month).then(function (response) {
        //            $scope.loadingVisible = false;
        //            var row = {
        //                CrewId: crewid,
        //                DateStartYear: year,
        //                DateStartMonth: month,
        //                FDPs: response,
        //            };
        //            $scope.crewFDPs.push(row);
        //            callback(response);

        //        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        //    }
        //    else
        //        callback(data.FDPs);
        //}
        //else callback(null);;
    }


    $scope.nextCrew = function () {
        var keys = $scope.dg_calcrew_instance.getSelectedRowKeys();
        console.log('keys');
        console.log(keys);
        var index = $scope.dg_calcrew_instance.getRowIndexByKey(keys[0]);
        index++;
        if (!$scope.dg_calcrew_instance.getKeyByRowIndex(index))
            return;
        var arr = [];
        arr.push(index);

        $scope.dg_calcrew_instance.selectRowsByIndexes(arr).done(function (e) {
            if ($scope.btn_crewlist_visible)
                $scope.refreshValidFDP();
        });
    }
    $scope.preCrew = function () {
        var keys = $scope.dg_calcrew_instance.getSelectedRowKeys();
        var index = $scope.dg_calcrew_instance.getRowIndexByKey(keys[0]);
        index--;
        if (!$scope.dg_calcrew_instance.getKeyByRowIndex(index))
            return;
        var arr = [];
        arr.push(index);

        $scope.dg_calcrew_instance.selectRowsByIndexes(arr).done(function (e) {
            if ($scope.btn_crewlist_visible)
                $scope.refreshValidFDP();
        });
    }
    ///////
    $scope.xgetDutyClass = function (duty) {
        switch (duty.dutyType) {
            case 1165:
                return 'duty-1165';
            default:
                return 'duty-' + duty.dutyType;
        }
    };
    $scope.xgetCaption = function (duty) {
        switch (duty.DutyType) {
            case 5000:
                return 'TRN';
            case 5001:
                return 'OFC';
            case 1167:
                return 'PM';
            case 1168:
                return 'AM';
            case 10000:
                return 'OFF';
            default:
                return 'DTY';
        }
    };
    $scope.xgetDataCellTemplateClass = function (duty) {
        //kos
        if (!$scope.dg_calcrew_selected)
            return "";
        var cdate = new Date(duty.startDate);
        var bdate = new Date($scope.dg_calcrew_selected.DateInactiveBegin);
        var edate = new Date($scope.dg_calcrew_selected.DateInactiveEnd);
        if (cdate >= bdate && cdate <= edate)
            return 'inactive-cell';
        return "";
    };
    $scope.xgetPosition = function (position) {
        //pati new
        switch (position) {
            case 'Captain':
                return 'CPT';
            case 'Purser':
                return 'PU';
            case 'Purser2':
                return 'PU2';
            case 'Purser3':
                return 'PU3';
            case 'SCCM(i)':
                return 'SCI';
            case 'ISCCM':
                return 'SCI';
            default:
                return position;
        }

    };
    $scope.xcellPositionClicked = function (id) {

        //  alert(id);
        //  $event.stopPropagation();
    };
    $scope.xremoveAssignedFDP = function (duty) {


        var dto = { fdp: duty.Id };
        $scope.loadingVisible = true;
        flightService.saveDeleteFDP(dto).then(function (response) {
            $scope.loadingVisible = false;

            $scope.fdpCrews = [];
            var boxes = Enumerable.From($scope.dataSource).Where('$.IsBox').ToArray();
            $.each(boxes, function (_i, _d) {
                _d.Synced = false;
            });

            $scope.cal_crew_instance.deleteAppointment(duty);
            $scope.cal_crew_instance.hideAppointmentTooltip();
            if ($scope.btn_crewlist_visible)
                $scope.refreshValidFDP();

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    };
    $scope.nextPosition2 = function (duty) {

        var current = duty.Position;
        var positions = Enumerable.From($scope.positions).Where('$.title=="' + $scope.dg_calcrew_selected.JobGroup + '"').FirstOrDefault().ds;
        var index = positions.indexOf(current);
        if (index >= positions.length - 1)
            index = 0;
        else
            index++;
        duty.Position = positions[index];
        var positionId = Enumerable.From($scope.positionIds).Where('$.title=="' + duty.Position + '"').FirstOrDefault().id;
        duty.PositionId = positionId;
        $scope.fdpCrews = [];
        var boxes = Enumerable.From($scope.dataSource).Where('$.IsBox').ToArray();
        $.each(boxes, function (_i, _d) {
            _d.Synced = false;
        });
        if (current != duty.position) {
            var dto = { fdp: duty.Id, position: positionId };
            $scope.loadingVisible = true;

            flightService.saveUpdateFDPPosition(dto).then(function (response) {
                $scope.loadingVisible = false;


            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }
    };
    $scope.prePosition2 = function (duty) {

        var current = duty.Position;
        var positions = Enumerable.From($scope.positions).Where('$.title=="' + $scope.dg_calcrew_selected.JobGroup + '"').FirstOrDefault().ds;
        var index = positions.indexOf(current);
        if (index <= 0)
            index = positions.length - 1;
        else
            index--;
        duty.Position = positions[index];
        var positionId = Enumerable.From($scope.positionIds).Where('$.title=="' + duty.Position + '"').FirstOrDefault().id;
        duty.PositionId = positionId;
        $scope.fdpCrews = [];
        var boxes = Enumerable.From($scope.dataSource).Where('$.IsBox').ToArray();
        $.each(boxes, function (_i, _d) {
            _d.Synced = false;
        });
        if (current != duty.position) {
            var dto = { fdp: duty.Id, position: positionId };
            $scope.loadingVisible = true;
            flightService.saveUpdateFDPPosition(dto).then(function (response) {
                $scope.loadingVisible = false;


            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }
    };
    ////////////////////////////////////////////
    $scope.FromDateEvent = null;
    $scope.ToDateEvent = null;
    $scope.date_from_event = {
        type: "datetime",
        width: '100%',

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'FromDateEvent',

        }
    };
    $scope.date_to_event = {
        type: "datetime",
        width: '100%',

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'ToDateEvent',

        }
    };

    $scope.saveNewDutyCal = function (crewid,callback) {
        var dto = {
            DateStart: new Date($scope.FromDateEvent),
            DateEnd: new Date($scope.ToDateEvent),
            CityId: -1,
            CrewId: crewid,
            DutyType: $scope.event_status,

        }
        $scope.loadingVisible = true;
        flightService.saveDuty(dto).then(function (response) {
            $scope.loadingVisible = false;
            response.dutyTypeTitle = response.DutyTypeTitle;
            response.dutyType = response.DutyType;
          $scope.cal_crew_ds.push(response);
           // $scope.cal_crew_instance.repaint();
            callback();

             

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope._eventId = -1;
    $scope.event_status = null;
    $scope.createEvent = function (_crew, _type, _typeTitle, eventFrom, eventEnd) {
        
        var crewid = _crew.Id; //_crew.data.Id;
        var crew = _crew; //_crew.data;

        //$scope.dg_crew_stby_ds = Enumerable.From($scope.dg_crew_stby_ds).Where('$.Id!=' + crewid).ToArray();
        $scope._eventId = $scope._eventId - 1;
        var offset = 1 * (new Date()).getTimezoneOffset();
        var stby = {
            Id:$scope._eventId, //-($scope.crewDuties.length + 1),
            type: 0,
            JobGroup: crew.JobGroup,
            GroupId: crew.GroupId,
            ScheduleName: crew.ScheduleName,
            //Duty: 180,
        };
        stby.crewId = crewid;
        stby.isPrePost = false;
        stby.LastLocationId = crew.LastLocationId;
         stby.LastLocation = crew.LastLocation;
         stby.FirstLocationId = crew.LastLocationId;
         stby.FirstLocation = crew.LastLocation;
        stby.day = new Date(eventFrom);
        stby.DutyStartLocal = new Date(eventFrom);
        stby.DutyEndLocal = new Date(eventEnd);
        stby.dutyType = _type;
        stby.dutyTypeTitle = _typeTitle;
       

        stby.DutyStart = (new Date(stby.DutyStartLocal)).addMinutes(offset);
        stby.DutyEnd = (new Date(stby.DutyEndLocal)).addMinutes(offset);
        if (_type != 10000) {
            stby.RestToLocal = (new Date(stby.DutyEndLocal)).addMinutes(12 * 60);
            stby.RestTo = (new Date(stby.RestToLocal)).addMinutes(offset);
        }
        else
        {
            stby.RestToLocal = stby.DutyEndLocal;
            stby.RestTo = stby.DutyEnd;
        }
        var diff = Math.abs(new Date(eventEnd) - new Date(eventFrom));
        stby.Duty = Math.floor((diff / 1000) / 60);

        stby.flights = null;
        stby.IsOver = false;
        
        return stby;

    };
    $scope.IsEventOverLapped = function (event) {
        var f = Enumerable.From($scope.cal_crew_ds).Where(function (x) {
            return (new Date(event.DutyStart) >= new Date(x.DutyStart) && new Date(event.DutyStart) <= new Date(x.RestTo))
            ||
                  (new Date(event.RestTo) >= new Date(x.DutyStart) && new Date(event.RestTo) <= new Date(x.RestTo))
            ||
                (new Date(x.DutyStart) >= new Date(event.DutyStart) && new Date(x.DutyStart) <= new Date(event.RestTo))
                 
        }).FirstOrDefault();
        if (f)
            return true;
        return false;
    };
    $scope.popup_event_visible = false;
    $scope.popup_event_title = '';
    $scope.popup_event = {
        width: 300,
        height: 260,
        //position: 'left top',
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Ok', icon: 'check', validationGroup: 'eventadd2', onClick: function (arg) {

                        // console.log($scope.data);
                        //return;
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        var crewid = $scope.dg_calcrew_selected.Id;
                        
                        var eventFrom = new Date($scope.FromDateEvent);
                        var eventEnd = new Date($scope.ToDateEvent);
                        var rosterFrom = General.getDayFirstHour(new Date($scope.dt_fromSearched));
                        //getDayLastHour
                        var rosterTo = General.getDayLastHour(new Date($scope.dt_toSearched));
                        //////////////////////////////
                        if ($scope.event_status == 10000) {
                            //nool
                           
                              //  alert(crewid);
                                var _event = $scope.createEvent($scope.dg_calcrew_selected, 10000, 'RERRP', eventFrom, eventEnd);
                                var check = $scope.IsEventOverLapped(_event);
                                if (check) {
                                    General.ShowNotify('Overlapped Duties Found', 'error');
                                    return;
                                }
                                else
                                {
                                    
                                    if ((eventFrom >= rosterFrom && eventFrom <= rosterTo) || (eventEnd >= rosterFrom && eventEnd <= rosterTo)) {
                                        $scope.cal_crew_ds.push(_event);
                                        $scope.cal_crew_instance.repaint();
                                        $scope.crewDuties.push(_event);
                                        $scope.popup_event_visible = false;
                                    }
                                    else {
                                        $scope.saveNewDutyCal($scope.dg_calcrew_selected.Id, function () { $scope.popup_event_visible = false; });
                                    }

                                    
                                }

                          
                        }
                        ///////////////////////////////////
                        //if ($scope.event_status == 5000 || $scope.event_status == 5001) {
                        //    if ((eventFrom >= rosterFrom && eventFrom <= rosterTo) || (eventEnd >= rosterFrom && eventEnd <= rosterTo)) {
                        //        // alert(crewid);

                        //        var _event = $scope.createEvent($scope.dg_calcrew_selected, $scope.event_status, ($scope.event_status==5000?'Training':'Office'), eventFrom, eventEnd);
                        //        var check = $scope.IsEventOverLapped(_event);
                        //        if (check) {
                        //            General.ShowNotify('Overlapped Duties Found', 'error');
                        //            return;
                        //        }
                        //        else
                        //        {
                        //            $scope.cal_crew_ds.push(_event);
                        //            $scope.cal_crew_instance.repaint();
                        //            $scope.crewDuties.push(_event);
                        //            console.log('event duties');
                        //            console.log($scope.crewDuties);
                        //            $scope.popup_event_visible = false;
                        //        }
                               

                        //    }

                            
                        //}
                        if ($scope.event_status == 5000 || $scope.event_status == 5001) {
                            //nool

                            //  alert(crewid);
                            var _event = $scope.createEvent($scope.dg_calcrew_selected, $scope.event_status, ($scope.event_status == 5000 ? 'Training' : 'Office'), eventFrom, eventEnd);
                            var check = $scope.IsEventOverLapped(_event);
                            if (check) {
                                General.ShowNotify('Overlapped Duties Found', 'error');
                                return;
                            }
                            else {

                                if ((eventFrom >= rosterFrom && eventFrom <= rosterTo) || (eventEnd >= rosterFrom && eventEnd <= rosterTo)) {
                                    $scope.cal_crew_ds.push(_event);
                                    $scope.cal_crew_instance.repaint();
                                    $scope.crewDuties.push(_event);
                                    $scope.popup_event_visible = false;
                                }
                                else {
                                    $scope.saveNewDutyCal($scope.dg_calcrew_selected.Id, function () { $scope.popup_event_visible = false; });
                                }


                            }


                        }

                        //////////////////////////////

                    }
                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {

        },
        onHiding: function () {
            $scope.ToDateEvent = null;
            $scope.FromDateEvent = null;
            $scope.event_status = null;

        },
        bindingOptions: {
            visible: 'popup_event_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            title: 'popup_event_title',

        }
    };

    //close button
    $scope.popup_event.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_event_visible = false;

    };
    ///////////////////////////////////////////////
    $scope.assign10000 = function (e) {
        $scope.event_status = 10000;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(20, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addHours(36);
        $scope.popup_event_title = 'Day Off';
        $scope.popup_event_visible = true;
    };
    $scope.assign5000 = function (e) {
        $scope.event_status = 5000;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(8, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(4 * 60);
        $scope.popup_event_title = 'Training';
        $scope.popup_event_visible = true;
    };
    $scope.assign5001 = function (e) {
        $scope.event_status = 5001;
        $scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(8, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(9 * 60);
        $scope.popup_event_title = 'Office';
        $scope.popup_event_visible = true;
    };
    $scope.cellContextMenuItems = [
            { text: 'Assign Day Off', onItemClick: $scope.assign10000, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-10000' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Assign Day Off</td></tr></table>", },
         // { text: 'Assign Stan By AM', onItemClick: $scope.assign1168, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-1168' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Assign Stand By AM</td></tr></table>", },
         // { text: 'Assign Stan By PM', onItemClick: $scope.assign1167, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-1167' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Assign Stand By PM</td></tr></table>", },

            { text: 'Assign Office', onItemClick: $scope.assign5001, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-5001' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Assign Office</td></tr></table>", },
              { text: 'Assign Training', onItemClick: $scope.assign5000, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-5000' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Assign Training</td></tr></table>", },

    ];
    $scope.cellContextMenuOptions = {
        target: ".dx-scheduler-date-table-cell",
        dataSource: $scope.cellContextMenuItems,
        width: 200,
        onShowing: function (e) {
            if (!$scope.dg_calcrew_selected)
                e.cancel = true;
            //$scope.contextMenuCellData
            var cdate = new Date($scope.contextMenuCellData.startDate);
            var bdate = new Date($scope.dg_calcrew_selected.DateInactiveBegin);
            var edate = new Date($scope.dg_calcrew_selected.DateInactiveEnd);
            if (cdate >= bdate && cdate <= edate)
                e.cancel = true;
        },
        onItemClick: function (e) {
            if (!$scope.dg_calcrew_selected)
                return;
            console.log(e.itemData);
            e.itemData.onItemClick(e.itemData);
        }
    };

    $scope.popup_cal_visible = false;
    $scope.btn_crewlist_visible = false;
    $scope.btn_duties_visible = true;
    var downloads = ["Download Trial For Visual Studio", "Download Trial For All Platforms", "Package Managers"];
    $scope.popup_cal = {
        width: function () {
            //var w = $(window).width() / 3;
            //if (w > 650)
            var w = 1400;
            return w;
        },
        height: function () {
            return $(window).height();
        },
        fullScreen: true,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [

            //{
            //    widget: 'dxButton', location: 'after', options: {

            //        type: 'default', text: 'Day Off', icon: 'card', onClick: function (arg) {
            //            $scope.event_status = 10000;
            //            $scope.popup_event_visible = true;
            //        }
            //    }, toolbar: 'bottom'
            //},
             //{
             //    widget: 'dxButton', location: 'after', options: {

             //        type: 'default', text: 'FDPs', icon: 'airplane', onClick: function (arg) {
             //            $scope.btn_duties_visible = false;
             //            $scope.btn_crewlist_visible = true;
             //            $scope.dg_calfdp_ds = null;
             //            $('.dgcalcrew').fadeOut('200', function () {

             //                $('.dgcalfdp').fadeIn('200', function () {

             //                    var prts = (new Date($scope.cal_crew_current)).getDatePartArray();
             //                    if ($scope.dg_calcrew_selected) {
             //                        var crewid = $scope.dg_calcrew_selected.Id;
             //                        $scope.bindValidFDP(crewid, prts[0], prts[1] + 1);
             //                    }

             //                });
             //            });


             //        }
             //    }, toolbar: 'bottom'
             //},
             //{
             //    widget: 'dxButton', location: 'after', options: {

             //        type: 'default', text: 'Crew List', icon: 'group', onClick: function (arg) {
             //            $scope.btn_crewlist_visible = false;
             //            $scope.btn_duties_visible = true;
             //            $('.dgcalfdp').fadeOut('200', function () {

             //                $('.dgcalcrew').fadeIn('200', function () {

             //                });
             //            });


             //        }
             //    }, toolbar: 'bottom'
             //},

              //{



              //    widget: 'dxDropDownButton', location: 'after', options: {
              //        type: 'default',
              //        text: "Assign Duty",
              //        icon: "save",
              //        dropDownOptions: {
              //            width: 230
              //        },
              //        onItemClick: function (e) {
              //            DevExpress.ui.notify("Download " + e.itemData, "success", 600);
              //        },
              //        items: downloads
              //    }, toolbar: 'bottom'
              //},
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {



                        $scope.popup_cal_visible = false;
                    }
                }, toolbar: 'bottom'
            },


        ],
        //position: 'right',
        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {

            // $scope.dg_crew2_instance.repaint();


        },
        onShown: function (e) {
            if ($scope._calCrewSelected) {
                
                var arr = [];
                arr.push($scope._calCrewSelected);

                $scope.dg_calcrew_instance.selectRows(arr, false);
            }
           // $scope.bind_calcrew();

           // $scope.cal_change();

        },
        onHiding: function () {
             

            

            $scope.cal_crew_ds = [];
            if ($scope.cal_crew_instance) {
                $scope.cal_crew_instance.repaint();
               
            }
            $scope.dg_calcrew_instance.clearSelection();
            // $scope.rebind();
            $scope._calCrewSelected = null;
            $scope.popup_cal_visible = false;

        },
        bindingOptions: {
            visible: 'popup_cal_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            //title: 'FlightsTitle',
            'toolbarItems[0].visible': 'btn_duties_visible',
            'toolbarItems[1].visible': 'btn_crewlist_visible',

        }
    };
    //////////////////////////////////////////////
    $scope.btn_cal = {
        text: 'Calendar',
        type: 'default',
        icon: 'event',
        width: 140,
        bindingOptions: { disabled: 'btnGanttDisabled' },
        onClick: function (e) {
            //sheler
            $scope.cal_crew_current = General.getDayFirstHour(new Date($scope.dt_fromSearched));
            $scope.popup_cal_visible = true;
        }

    };

    $scope.cal_crew_current = new Date();
    $scope.$watch('cal_crew_current', function (newValue, oldValue, scope) {
        //  alert(newValue);
        try {
            $scope.cal_change();
        }
        catch (e) {
            alert('e3');
            alert(e);
        }

    });
    $scope.cal_crew_ds = null;
    $scope.cal_crew_instance = null;
    $scope.cal_crew = {
        //dataSource: data,
        editing: {
            allowAdding: false,
            allowDeleting: false,
            allowDragging: false,
            allowResizing: false,
            allowUpdating: false,
        },
        textExpr: 'Flights',
        startDateExpr: 'DutyStartLocal',
        endDateExpr: 'DutyEndLocal',
        views: ["month", "day"],
        currentView: "month",
        startDayHour: 0,
        appointmentTemplate: 'appointmentTemplate',
        appointmentTooltipTemplate: "tooltip-template",
        dataCellTemplate: 'dataCellTemplate',
        height: function () {
            return $(window).height() - 115 - 31;
        },
        onContentReady: function (e) {
            if (!$scope.cal_crew_instance) {
                $scope.cal_crew_instance = e.component;

                // alert($scope.cal_crew_instance);
            }

        },
        optionChanged: function (e) {
            //alert(e.name + '   ' + e.value);
        },
        onAppointmentClick: function (e) {
            e.cancel = true;
            return;
            var $el = $(e.event.target);
            if ($el.hasClass('cellposition')) {
                e.cancel = true;
                return;
            }
        },
        onAppointmentDblClick: function (e) {
            e.cancel = true;
            return;
        },
        onCellContextMenu: function (e) {


            $scope.contextMenuCellData = e.cellData;
        },
        bindingOptions: {
            currentDate: 'cal_crew_current',
            dataSource: 'cal_crew_ds',
            //currentDate: '_datefromcal',

        }
    };
    ////////////////////////////////////////////////
    $scope.selectedTabDateIndex = -1;
    $scope.selectedTab = null;
    $scope.selectedDate = null;
    $scope.tabsdatefirst = true;
    $scope.$watch("selectedTabDateIndex", function (newValue) {

        try {
           
            if ($scope.selectedTabDateIndex == -1)
                return;
             
            $scope.selectedTab = $scope.tabs_date[newValue];
           
            $scope.selectedDate = new Date($scope.selectedTab.date);
            $scope.checkStbyAdd();
            $scope.setAmPmDs($scope.selectedDate, 'AM');
            $scope.setAmPmDs($scope.selectedDate, 'PM');
            //$scope.StopNowLineTimer();
            //$scope.createGantt();

            
            //$scope.footerfilter = true;
            //$scope.searched = true;

            //if ($scope.autoUpdate)
            //    $scope.StartUTimer();


        }
        catch (e) {
            alert(e);
        }

    });
    $scope.tabs_date = [


    ];
    // $scope.selectedTabDateIndex = 0;
    $scope.tabs_date_options = {
        scrollByContent: true,
        showNavButtons: true,
        //width: 600,
        elementAttr: {
            // id: "elementId",
            class: "tabsdate1"
        },

        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        onItemRendered: function (e) {
            $scope.selectedTabDateIndex = -1;
            $scope.selectedTabDateIndex = 0;
        },
        bindingOptions: {
            
            dataSource: { dataPath: "tabs_date", deep: true },
            selectedIndex: 'selectedTabDateIndex'
        }

    };

    /////////////////////////////////////////////
    $scope.btn_stby = {
        text: 'StandBy',
        type: 'default',
        icon: 'event',
        width: 140,
        bindingOptions: { disabled: 'btnGanttDisabled' },
        onClick: function (e) {


            $scope.popup_stby_visible = true;
        }

    };
    //////////////////////////////////////////////
    $scope.AmDs = [];
    $scope.PmDs = [];
    $scope.setAmPmDs = function (day,type) {
        // $scope.AmDs = $scope.crewDuties;
        var _t = 1168;
        if (type == 'PM')
            _t = 1167;
        var stbyCrews = Enumerable.From($scope.crewDuties).Where(function (x) {

            return   (new Date(x.day)).getDatePart() == (new Date(day)).getDatePart();
        }).Select('$.crewId').ToArray();
        var ds = Enumerable.From($scope.crewDuties).Where(function (x) {
           
            return x.dutyType == _t && (new Date(x.day)).getDatePart() == (new Date(day)).getDatePart();
        }).ToArray();
        
        $scope.dg_crew_stby_ds = Enumerable.From($scope.ds_crew).Where(function (x) {
            return stbyCrews.indexOf(x.Id) == -1;
        }).OrderBy('$.GroupOrder').ToArray();
        //console.log(ds);
        //$scope.dg_crew_stby_ds = ds;


        console.log(ds);
        if (type == 'AM')
            $scope.AmDs = ds;
        else
            $scope.PmDs = ds;
    };
    $scope.IsStbyAMVisible = false;
    $scope.IsStbyPMVisible = false;
    $scope.checkStbyAdd = function () {
        $scope.IsStbyAMVisible = false;
        $scope.IsStbyPMVisible = false;
        //if (!$scope.crewTempFDPs)
        //hodi
        if (!$scope.dg_crew_stby_selected)
            return;
        if (!$scope.selectedDate)
            return;
        var offset = 1 * (new Date()).getTimezoneOffset();
        var am = {};
        var pm = {};
        am.day = new Date($scope.selectedDate);
        pm.day = new Date($scope.selectedDate);
        am.start = (new Date(am.day.getFullYear(), am.day.getMonth(), am.day.getDate(), 0, 0, 0, 0)).addMinutes(offset);
        am.end = (new Date(am.day.getFullYear(), am.day.getMonth(), am.day.getDate()+1, 0, 0, 0, 0)).addMinutes(offset);
        //.addMinutes(offset);
        pm.start = (new Date(pm.day.getFullYear(), pm.day.getMonth(), pm.day.getDate(), 12, 0, 0, 0)).addMinutes(offset);
        pm.end = (new Date(pm.day.getFullYear(), pm.day.getMonth(), pm.day.getDate() + 1, 12, 0, 0, 0)).addMinutes(offset);

      
        var existAM = Enumerable.From($scope.crewTempFDPs).Where(function (x) {
            
            
            var res = (new Date(x.start) >= new Date(am.start) && new Date(x.start) <= new Date(am.end)) || (new Date(x.end) >= new Date(am.start) && new Date(x.end) <= new Date(am.end));
            
            return res;

        }).FirstOrDefault();

        var existPM = Enumerable.From($scope.crewTempFDPs).Where(function (x) {
            return (new Date(x.start) >= new Date(pm.start) && new Date(x.start) <= new Date(pm.end)) || (new Date(x.end) >= new Date(pm.start) && new Date(x.end) <= new Date(pm.end));
        }).FirstOrDefault();
        
        $scope.IsStbyAMVisible = !existAM;
        $scope.IsStbyPMVisible = !existPM;

    };
    $scope.removeStby = function (stby) {
        var crewId = stby.crewId;
        var crewobj = Enumerable.From($scope.ds_crew).Where('$.Id==' + crewId).FirstOrDefault();
        $scope.dg_crew_stby_ds.push(JSON.parse(JSON.stringify(crewobj)));

        $scope.dg_crew_stby_ds = Enumerable.From($scope.dg_crew_stby_ds).OrderBy('$.GroupOrder').ToArray();
        $scope.crewDuties = Enumerable.From($scope.crewDuties).Where(function (x) {

            return (x.dutyType == 1167 || x.dutyType==1168) && x.Id!=stby.Id;
        }).ToArray();
        $scope.setAmPmDs($scope.selectedDate, 'AM');
        $scope.setAmPmDs($scope.selectedDate, 'PM');
    }
    $scope._stbyId = -1;
    $scope.addStby = function (_crew,_type) {
        var crewid = _crew.Id; //_crew.data.Id;
        var crew = _crew; //_crew.data;
         
        //$scope.dg_crew_stby_ds = Enumerable.From($scope.dg_crew_stby_ds).Where('$.Id!=' + crewid).ToArray();
        
        var offset = 1 * (new Date()).getTimezoneOffset();
        $scope._stbyId = $scope._stbyId - 1;
        var stby = {
            Id:$scope._stbyId, //-($scope.crewDuties.length+1),
            type: 0,
            JobGroup: crew.JobGroup,
            GroupId:crew.GroupId,
            ScheduleName: crew.ScheduleName,
            Duty:180,
        };
        stby.crewId = crewid;
        stby.isPrePost = false;
        stby.LastLocationId = crew.LastLocationId;
        stby.LastLocation = crew.LastLocation;
        stby.FirstLocationId = crew.LastLocationId;
        stby.FirstLocation = crew.LastLocation;
        stby.day = new Date($scope.selectedDate);
        stby.DutyStartLocal = new Date(stby.day.getFullYear(), stby.day.getMonth(), stby.day.getDate(), 0, 0, 0, 0);
        stby.DutyEndLocal = new Date(stby.day.getFullYear(), stby.day.getMonth(), stby.day.getDate(), 12, 0, 0, 0);
        stby.dutyType = 1168;
        stby.dutyTypeTitle = 'STBY-AM';
        if (_type=='PM')
        {
            stby.DutyStartLocal = new Date(stby.day.getFullYear(), stby.day.getMonth(), stby.day.getDate(), 12, 0, 0, 0);
            stby.DutyEndLocal = new Date(stby.day.getFullYear(), stby.day.getMonth(), stby.day.getDate()+1, 0, 0, 0, 0);
            stby.dutyType = 1167;
            stby.dutyTypeTitle = 'STBY-PM';
        }

        stby.DutyStart = (new Date(stby.DutyStartLocal)).addMinutes(offset);
        stby.DutyEnd = (new Date(stby.DutyEndLocal)).addMinutes(offset);
        stby.RestToLocal = (new Date(stby.DutyEndLocal)).addMinutes(12*60);
        stby.RestTo = (new Date(stby.RestToLocal)).addMinutes(offset);
       
      
        stby.flights = null;
        stby.IsOver = false;
        $scope.crewDuties.push(stby);
        console.log(stby);
        $scope.setAmPmDs($scope.selectedDate, _type);
      
         
    };
    $scope.dg_crew_stby_columns = [

            { dataField: 'JobGroup', caption: 'RNK', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width:85, },
              { dataField: 'ScheduleName', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },
              { dataField: 'LastLocation', caption: 'Apt', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, },
              
              //{
              //    dataField: "Id", caption: '',
              //    width: 70,
              //    allowFiltering: false,
              //    allowSorting: false,
              //    cellTemplate: 'addStbyAMTemplate',

              //},
              // {
              //     dataField: "Id", caption: '',
              //     width: 70,
              //     allowFiltering: false,
              //     allowSorting: false,
              //     cellTemplate: 'addStbyPMTemplate',

              // },

    ];
    $scope.dg_crew_stby_selected = null;
   
    $scope.dg_crew_stby_instance = null;
    $scope.dg_crew_stby_ds = null;
    $scope.dg_crew_stby = {
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
        height: 685,

        columns: $scope.dg_crew_stby_columns,
        onContentReady: function (e) {
            if (!$scope.dg_crew_stby_instance)
                $scope.dg_crew_stby_instance = e.component;

        },
        onRowPrepared: function (e) {



        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];
            $scope.IsStbyAMVisible = false;
            $scope.IsStbyPMVisible = false;
            if (!data) {
                $scope.dg_crew_stby_selected = null;
                $scope.rowCrew = null;
                $scope.crewTempRow = { Valid: true, Duty7: 0, Duty14: 0, Duty28: 0, Flight28: 0, FlightYear: 0, Duty7Class: '', Duty14Class: '', Duty28Class: '', Flight28Class: '', FlightYearClass: '' };
                $scope.outputTemps = [];
                $scope.crewTempFDPs = [];
            }
            else {
                $scope.dg_crew_stby_selected = data;
                $scope.rowCrew = data;

                $scope.getTempDutiesSTBY();
            }


        },
         


        bindingOptions: {
            dataSource: 'dg_crew_stby_ds'
        }
    };
    //////////////////////////////////////////////
    $scope.popup_stby_visible = false;
    $scope.popup_stby = {
        width: function () {
            //var w = $(window).width() / 3;
            //if (w > 650)
            var w = 1400;
            return w;
        },
        height: function () {
            var h = 800;
            return h;
            //return $(window).height();
        },
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
 
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {



                        $scope.popup_stby_visible = false;
                    }
                }, toolbar: 'bottom'
            },


        ],
        //position: 'right',
        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {
            //6-17
            // $scope.dg_crew2_instance.repaint();
           // $scope.dt_from = new Date();
            // $scope.dt_to = new Date().addDays(1);

            $scope.IsStbyAMVisible = false;
            $scope.IsStbyPMVisible = false;

            $scope.tabs_date = [];
            var i;
            var stdate = new Date($scope.dt_fromSearched);
            while (stdate <= $scope.dt_toSearched) {
                var str = moment(stdate).format("ddd DD-MMM-YYYY");
                $scope.tabs_date.push({ text: str, id: i, date: moment(stdate).format('YYYY/MM/DD') });
                stdate = stdate.addDays(1);
            }
            

        },
        onShown: function (e) {
            //var ds = Enumerable.From($scope.ds_crew).OrderBy('$.GroupOrder').ToArray();
            //console.log(ds);
            //$scope.dg_crew_stby_ds = ds;
            $scope.dg_crew_stby_instance.repaint();
            // $scope.bind_calcrew();

            // $scope.cal_change();
            $scope.tempContainerStyle.height = $(window).height() - 399;
            $scope.tempContainerStyle.padding = '5px';
            $scope.selectedTabDateIndex = 0;
        },
        onHiding: function () {
            $scope.selectedTabDateIndex = -1;
            $scope.popup_cal_visible = false;

        },
        bindingOptions: {
            visible: 'popup_stby_visible',
            

        }
    };
    /////////////////////////////////////////////
    $scope.popup_error_visible = false;
    $scope.popup_error_title = 'Errors';

    $scope.popup_error = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_error"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 800,
        width: 1300,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [
            

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_error_visible = false;

                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            // $(e.titleElement).addClass('vahid');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {




        },
        onShown: function (e) {
            // $scope.getCrewAbs2($scope.flight.ID);
            if ($scope.dg_error_instance)
                $scope.dg_error_instance.refresh();
        },
        onHiding: function () {


            $scope.popup_error_visible = false;

        },
        bindingOptions: {
            visible: 'popup_error_visible',

            title: 'popup_error_title',

        }
    };
    ///////////////////
    $scope.dg_error_columns = [


            
            { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
            { dataField: 'Type', caption: 'Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
              { dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,   },
               { dataField: 'Remark2', caption: '', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
               {
                   dataField: "Id", caption: '',
                   width: 70,
                   allowFiltering: false,
                   allowSorting: false,
                   cellTemplate: 'ecalCrewTemplate',
                   name: 'eccalcrew',
                   // visible: false,

               },
              


    ];
    $scope.dg_error_selected = null;
    $scope.dg_error_instance = null;
    $scope.dg_error_ds = null;
    $scope.dg_error = {
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
        height: 650,

        columns: $scope.dg_error_columns,
        onContentReady: function (e) {
            if (!$scope.dg_error_instance)
                $scope.dg_error_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_error_selected = null;

            }
            else {
                $scope.dg_error_selected = data;

            }
        },
        //onRowPrepared: function (e) {
        //    if (e.data && e.data.IsPositioning)
        //        e.rowElement.css('background', '#ffccff');

        //},

        bindingOptions: {
            dataSource: 'dg_error_ds',

        }
    };
    //////////////////////////////////////////////
    $scope.$on('$viewContentLoaded', function () {
        $(document).on("click", ".roster-assign-task", function () {
            var id = $(this).data("id");
            var $element = $('#task-' + id).parent();
            var $parent = $('.task-' + id);
            var data = Enumerable.From($scope.dataSource).Where('$.Id==' + id).FirstOrDefault();
           // $scope.selectedDHIds = [];
            // $scope.selectedDHItems = [];
            if ($element.hasClass('flight-item-dh')) {
                 
               // $scope.ganttFlightUnSelected(id);
                $scope.selectedDHIds = Enumerable.From($scope.selectedDHIds).Where('$!=' + id).ToArray();
                $scope.selectedDHItems = Enumerable.From($scope.selectedDHItems).Where('$.Id!=' + id).ToArray();
                $parent.removeClass('flight-item-dh');
                $scope.refreshStat();
            }
            else {
                 
                //$scope.ganttFlightSelected(id);
                $scope.selectedDHIds.push(id);
                $scope.selectedDHItems.push(data);
                $parent.addClass('flight-item-dh');
                $scope.refreshStat();
            }
            /////////////////////////////////////////
        });

        $scope.clearSelectionGantt = function () {
            $scope.ganttFlightCrews = [];
            $scope.selectedIds = [];
            $scope.selectedItems = [];
            $('.flight-item-selected').each(function () {
                $(this).removeClass('flight-item-selected');
            });
        }


        $(document).on("click", ".yati", function () {

            var id = $(this).data("id");
           
            
            var $element = $('#task-' + id).parent();
            var $parent = $('.task-' + id);
            //alert($parent.attr('class'));
            var data = Enumerable.From($scope.dataSource2).Where('$.Id==' + id).FirstOrDefault();
            var isBox = data.IsBox;
            var BoxId = data.BoxId;
            if (!isBox) {
                if ($element.hasClass('flight-item-selected')) {
                    // alert('hass');
                    $scope.ganttFlightUnSelected(id);
                    $scope.selectedIds = Enumerable.From($scope.selectedIds).Where('$!=' + id).ToArray();
                    $scope.selectedItems = Enumerable.From($scope.selectedItems).Where('$.Id!=' + id).ToArray();
                    $parent.removeClass('flight-item-selected');
                }
                else {
                    // alert('not hass');
                    $scope.ganttFlightSelected(id);
                    $scope.selectedIds.push(id);
                    $scope.selectedItems.push(data);
                    $parent.addClass('flight-item-selected');
                }
                //$('#task-' + id).parent().toggleClass('nobox2').toggleClass('flight-item-selected');
               // $('#task-' + id).parent().toggleClass('flight-item-selected');
               // $scope.selectedIdsChanged();
               // alert($scope.selectedIds);
            }
            else {
                //  $('#task-' + id).parent().toggleClass('box').toggleClass('flight-item-selected');
                $scope.$apply(function () {
                    $scope.selectedBox = data;
                    $scope.selectedBoxId = data.BoxId;
                });

            }






        });


        ////////////////////////////

    });

    $rootScope.$broadcast('RosterLoaded', null);

}]);