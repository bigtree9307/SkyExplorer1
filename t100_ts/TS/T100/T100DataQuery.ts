﻿module AST {
    export module T100 {
        export class T100DataQuery {
            /*static queryAirport(keyword: any, queryType: QueryAirportType, callback: (airport: any) => any) {
                var onSuccessCallback = function (jsonMsg) {
                    var airport = null;
                    if (jsonMsg != "") {
                        airport = $.parseJSON(jsonMsg);
                    }
                    callback(airport);
                };
                if (queryType == QueryAirportType.Iata) {
                    var params1 = { "airportCode": keyword, "codeType": "IATA", "locale": Localization.locale };
                    DataQuery.ajaxQuery(params1, "QueryAirportInfo", onSuccessCallback);
                } else if (queryType == QueryAirportType.Geometry) {
                    var params2 = { "x1": keyword[0], "y1": keyword[1], "x2": keyword[2], "y2": keyword[3], "locale": Localization.locale };
                    DataQuery.ajaxQuery(params2, "QueryT100AirportByGeometry", onSuccessCallback);
                }

            }*/

            static queryDestByOrigin(year: string, origin: string, airline: string, queryType, callback: (fromAirport: Airport, airports: any) => any) {
                var onSuccessCallback = function (jsonMsg) {
                    setTimeout(function () { DialogUtils.closeBlockingDialog(); }, 150);

                    var airports: Array<T100Dest> = [];
                    if (jsonMsg == "") {
                        callback(null, []);
                        return;
                    }
                    jsonMsg = $.parseJSON(jsonMsg);
                    var fromAirport: Airport = new Airport(jsonMsg["fromAirport"]["Icao"], jsonMsg["fromAirport"]["Iata"],
                        jsonMsg["fromAirport"]["Country"], jsonMsg["fromAirport"]["City"], jsonMsg["fromAirport"]["FullName"],
                        jsonMsg["fromAirport"]["Geometry"]);
                    fromAirport.countryEn = jsonMsg["fromAirport"]["CountryEn"];
                    fromAirport.cityEn = jsonMsg["fromAirport"]["CityEn"];
                    fromAirport.nameEn = jsonMsg["fromAirport"]["FullNameEn"];

                    var lstDestJson = jsonMsg["routes"];
                    for (var i = 0; i < lstDestJson.length; i++) {
                        var dest = new T100Dest();
                        var destPoint = new AST.Point(
                            parseFloat(lstDestJson[i]["Geometry"].split(",")[0]),
                            parseFloat(lstDestJson[i]["Geometry"].split(",")[1])
                            );
                        dest.airport = new Airport(
                            lstDestJson[i]["Icao"],
                            lstDestJson[i]["Iata"],
                            lstDestJson[i]["Country"],
                            lstDestJson[i]["City"],
                            lstDestJson[i]["FullName"],
                            destPoint
                            );
                        dest.airport.countryEn = lstDestJson[i]["CountryEn"];
                        dest.airport.cityEn = lstDestJson[i]["CityEn"];
                        dest.airport.nameEn = lstDestJson[i]["FullNameEn"];

                        dest.sumPax = parseInt(lstDestJson[i]["SUM_PAX"]);
                        dest.sumFreight = parseInt(lstDestJson[i]["SUM_FREIGHT"]);
                        dest.routeGeomS = lstDestJson[i]["GEOM"];
                        dest.dataSource = lstDestJson[i]["DATA_SOURCE"];
                        airports.push(dest);
                    }
                    if (callback != null)
                        callback(fromAirport, airports);

                };
                var params = { "year": year, "origin": origin, "dest": "", "airline": airline, "queryType": queryType, "locale": Localization.locale };
                var http = AST.DataQuery.ajaxQuery(params, "T100QueryDestByOrigin", onSuccessCallback);
                setTimeout(function () {
                    if (http.readyState != 4 || http.status != 200)
                        DialogUtils.loadBlockingDialog(Localization.strings.searchingAirportAndLoadingInfo);
                }, 150);

            }

            static queryRoute(year: string, origin: string, dest: string, callback: (data: any, distInfo: DistInfo) => any) {
                var onSuccessCallback = function (jsonText: string) {
                    var data = [];
                    if (jsonText == "") {
                        return;
                    }
                    var jsonObj: Object = $.parseJSON(jsonText);
                    for (var i = 0; i < jsonObj["routes"].length; i++) {
                        var item: any = {
                            "airline": jsonObj["routes"][i]["AIRLINE_NAME"] + " (" + jsonObj["routes"][i]["AIRLINE"] + ")",
                            "departure": jsonObj["routes"][i]["DEPARTURE"]
                        };
                        item.pax = jsonObj["routes"][i]["PAX"];
                        item.freight = jsonObj["routes"][i]["FREIGHT"];
                        item.montthDeparture = $.parseJSON(jsonObj["routes"][i]["MONTH_DEPARTURE"]);
                        item.monthPax = $.parseJSON(jsonObj["routes"][i]["MONTH_PAX"]);
                        item.monthFreight = $.parseJSON(jsonObj["routes"][i]["MONTH_FREIGHT"]);

                        data.push(item);
                    }
                    var distInfo = new DistInfo(jsonObj["distKm"], jsonObj["distNm"], jsonObj["distMile"]);

                    if (callback != null)
                        callback(data, distInfo);

                };
                var params = { "year": year, "origin": origin, "dest": dest, "locale": Localization.locale };
                DataQuery.ajaxQuery(params, "T100QueryByRoute", onSuccessCallback);
            }

            static queryT100AirportInfo(airport: string, callback: (jsonMsg: any) => any) {
                var onSuccessCallback = function (jsonMsg) {
                    if (jsonMsg == "") {
                        callback(null)
                        return;
                    }
                    jsonMsg = $.parseJSON(jsonMsg);
                    if (callback != null)
                        callback(jsonMsg);

                };
                var params = { "airportCode": airport, "codeType": "", "locale": Localization.locale };
                DataQuery.ajaxQuery(params, "QueryT100AirportInfo", onSuccessCallback);
            }

            static queryAirportTimeSeries(airport: string, callback: (jsonMsg: any) => any) {
                var onSuccessCallback = function (jsonMsg) {
                    if (jsonMsg == "") {
                        return;
                    }
                    jsonMsg = $.parseJSON(jsonMsg);
                    if (callback != null)
                        callback(jsonMsg);

                };
                var params = { "origin": airport, "locale": Localization.locale };
                DataQuery.ajaxQuery(params, "T100QueryAirportTimeSeries", onSuccessCallback);
            }

            static queryRouteTimeSeries(origin, dest, flowType, callback: (jsonMsg: any) => any) {
                var onSuccessCallback = function (jsonMsg) {
                    if (jsonMsg == "") {
                        return;
                    }
                    jsonMsg = $.parseJSON(jsonMsg);
                    if (callback != null)
                        callback(jsonMsg);

                };
                var params = { "origin": origin, "dest": dest, "flowType": flowType, "locale": Localization.locale };
                DataQuery.ajaxQuery(params, "T100QueryRouteTimeSeries", onSuccessCallback);
            }

            static queryAllAirlines(callback: (data: any) => any) {
                var onSuccessCallback = function (jsonMsg) {
                    setTimeout(function () { DialogUtils.closeBlockingDialog(); }, 500);
                    var data: Array<Airline> = [];
                    if (jsonMsg == "") {
                        return;
                    }
                    jsonMsg = $.parseJSON(jsonMsg);
                    for (var i = 0; i < jsonMsg.length; i++) {
                        var item: Airline = new Airline(jsonMsg[i][0],
                            jsonMsg[i][1], jsonMsg[i][2], jsonMsg[i][3],
                            jsonMsg[i][4], jsonMsg[i][5]);
                        data.push(item);
                    }
                    if (callback != null)
                        callback(data);
                };
                var params = { "locale": Localization.locale };
                DataQuery.ajaxQuery(params, "QueryAllAirlines", onSuccessCallback);
                DialogUtils.loadBlockingDialog(Localization.strings.applicationLoadingData);
            }

            static queryAirlineRoute(year, airline, region, callback: (data: any) => any) {
                var onSuccessCallback = function (jsonMsg) {
                    setTimeout(function () { DialogUtils.closeBlockingDialog(); }, 150);
                    if (jsonMsg == "") {
                        return;
                    }
                    var data = <Array<any>>$.parseJSON(jsonMsg);
                    if (callback != null)
                        callback(data);
                };
                var params = { "year": year, "airline": airline, "region": region, "limit": 400, "locale": Localization.locale };
                var http = AST.DataQuery.ajaxQuery(params, "QueryByAirlines", onSuccessCallback);
                setTimeout(function () {
                    if (http.readyState != 4 || http.status != 200)
                        DialogUtils.loadBlockingDialog(Localization.strings.searchingAirlineAndLoadingInfo);
                }, 150);
            }

            static queryRouteAircraftStat(year, origin, dest, callback: (data: any) => any) {
                var onSuccessCallback = function (jsonMsg) {
                    if (jsonMsg == "")
                        return;

                    var data = $.parseJSON(jsonMsg);
                    if (callback != null)
                        callback(data);
                };
                var params = { "year": year, "origin": origin, "dest": dest, "locale": Localization.locale };
                DataQuery.ajaxQuery(params, "QueryRouteAircraftStat", onSuccessCallback);
            }

            static queryAirportStat(year, airport, callback: (data: any) => any) {
                var onSuccessCallback = function (jsonMsg) {
                    var data = [];
                    if (jsonMsg == "") {
                        return;
                    }
                    jsonMsg = $.parseJSON(jsonMsg);
                    if (callback != null)
                        callback(jsonMsg);

                };
                var params = { "year": year, "airport": airport, "locale": Localization.locale };
                AST.DataQuery.ajaxQuery(params, "T100QueryAirportStat", onSuccessCallback);
            }
        }
    }
}