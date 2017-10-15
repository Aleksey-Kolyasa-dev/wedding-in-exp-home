define(["angular"],function(e){"use strict";var r=e.module("wedServices",["toastr","ngAnimate"]);return r.service("ResourceService",["toastr","$http","$q","$log","$location",function(r,o,t,R,n,a){return{baseURL:_env()._apiURL,_ajaxRequest:function(n,a,i,s){var c=this,d=t.defer();return Promise.resolve().then(function(){switch(n){case"GET":a||o({url:c.baseURL}).success(function(e){d.resolve(e)}).error(function(e){throw r.error("ERROR: GET method failed"),d.reject("ERROR: GET method failed"),new Error("ERROR: GET method failed: "+e)}),a&&o({url:c.baseURL+a}).success(function(e){d.resolve(e)}).error(function(e){throw r.error("ERROR: GET method failed"),d.reject("ERROR: GET method failed"),new Error("ERROR: GET method failed: "+e)});break;case"POST":s||o({method:"POST",url:c.baseURL,data:i}).success(function(e){d.resolve(e)}).error(function(e){throw r.error("ERROR: POST method failed"),d.reject("ERROR: POST method failed"),new Error("ERROR: POST method failed: "+e)}),s&&o({method:"POST",url:c.baseURL+s,data:i}).success(function(e){d.resolve(e)}).error(function(e){throw r.error("ERROR: POST method failed"),d.reject("ERROR: POST method failed"),new Error("ERROR: POST method failed: "+e)});break;case"PUT":s||a||o({method:"PUT",url:c.baseURL+i._id,data:i}).success(function(e){d.resolve(e)}).error(function(e){throw r.error("ERROR: PUT method failed"),d.reject("ERROR: PUT method failed"),new Error("ERROR: PUT method failed: "+e)}),s&&!a&&e.isString(s)&&o({method:"PUT",url:c.baseURL+i._id+s,data:i}).success(function(e){d.resolve(e)}).error(function(e){throw r.error("ERROR: PUT method failed"),d.reject("ERROR: PUT method failed"),new Error("ERROR: PUT method failed: "+e)});break;case"DELETE":o({method:"DELETE",url:c.baseURL+a}).success(function(e){d.resolve(e)}).error(function(e){throw r.error("ERROR: DELETE method failed"),d.reject("ERROR: DELETE method failed"),new Error("ERROR: DELETE method failed: "+e)})}}).catch(function(e){r.error("ERROR: AJAX ops faild"),R.warn(e)}),d.promise}}}]),r.service("AppService",["toastr","$window",function(r,o){return{_dateStringToObject:function(o){if(e.isString(o)){var t=o.split(".");return new Date(t[2],t[1]-1,t[0])}throw r.error("ERROR: Date transformation error"),new Error("ERROR: Date transformation error")},_objectToDateString:function(o){if(e.isString(o)){var t=new Date(o),R=[t.getDate(),t.getMonth()+1,t.getFullYear()];return R[0]<10&&(R[0]="0"+R[1]),R[1]<10&&(R[1]="0"+R[1]),R.join(".")}throw r.error("ERROR: Date transformation error"),new Error("ERROR: Date transformation error")}}}]),r});