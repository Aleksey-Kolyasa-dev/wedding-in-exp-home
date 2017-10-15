define(["angular"],function(e){"use strict";function t(e,t,o,n,a){function r(){e.total={planUsd:0,planNat:0,paidUsd:0,paidNat:0,paidTotalUsd:0,paidTotalNat:0,restTotalUsd:0,restTotalNat:0};var t=e.currentProject;e.total.planUsd=t[e.conf.views[0]].total.planUsd+t[e.conf.views[1]].total.planUsd,e.total.planNat=t[e.conf.views[0]].total.planNat+t[e.conf.views[1]].total.planNat,e.total.paidTotalUsd=t[e.conf.views[0]].total.paidTotalUsd+t[e.conf.views[1]].total.paidTotalUsd,e.total.paidTotalNat=t[e.conf.views[0]].total.paidTotalNat+t[e.conf.views[1]].total.paidTotalNat,e.total.restTotalUsd=e.total.planUsd-e.total.paidTotalUsd,e.total.restTotalNat=e.total.restTotalUsd*e.currentProject.budget.currency,e.currentProject[e.conf.mainProp].total=e.total}e.conf={mainProp:"party",title:"ВЕЧЕРИНКИ",ttlBy:"ВЕЧЕРИНКАМ",buttons:["Мальчишник","Девичник"],views:["partyM","partyW"]},e.subViewShift=function(t){switch(t){case e.conf.views[0]:case e.conf.views[1]:e.subView=t}},e.subView=e.conf.views[0],o(function(){r()},300),e.$on(e.conf.mainProp+"ValuesChanged",function(){r()})}function o(t,o,n,a){function r(){t.total={planUsd:0,planNat:0,paidUsd:0,paidNat:0,paidTotalUsd:0,paidTotalNat:0,restTotalUsd:0,restTotalNat:0},e.forEach(t.items,function(e){e.usd&&(t.total.planUsd+=e.toPay,t.total.planNat=t.total.planUsd*t.currentProject.budget.currency,t.total.paidUsd+=e.paid,t.total.paidNat=t.total.paidUsd*t.currentProject.budget.currency),e.usd||(t.total.planNat+=e.toPay,t.total.planUsd=t.total.planNat/t.currentProject.budget.currency,t.total.paidNat+=e.paid,t.total.paidUsd=t.total.paidNat/t.currentProject.budget.currency)}),t.total.paidTotalUsd+=t.total.paidUsd,t.total.paidTotalNat=t.total.paidTotalUsd*t.currentProject.budget.currency,t.total.restTotalUsd=t.total.planUsd-t.total.paidTotalUsd,t.total.restTotalNat=t.total.restTotalUsd*t.currentProject.budget.currency,t.currentProject[t.conf.mainProp].total=t.total,t.$emit(t.conf.parent+"ValuesChanged")}t.conf={mainProp:"partyM",parent:"party",msgNameBg:"PARTY_M",msgNameSm:"PartyM",expTableTitle:"ПО МАЛЬЧИШНИКУ",get addForm(){return"addNew"+this.msgNameSm+"ExpenseForm"},get editForm(){return"edit"+this.msgNameSm+"ExpenseForm"}},t.itemToEdit={},t.newItem={},t.removeTrigger={},t.removeTrigger.status=!1,t.$watch("currentProject.budget.currency",function(){t.currentProject[t.conf.mainProp].expCollection.length&&(r(),_env()._dev&&o.log("Update PROJECT by "+t.conf.msgNameBg+": reason - CURRENCY change EVENT"))}),t.items=t.currentProject[t.conf.mainProp].expCollection,t.total=t.currentProject[t.conf.mainProp].total,t.notes=t.currentProject[t.conf.mainProp+"Notes"],t.addNewExpenseItem=function(i){if(!(""!=i.name&&e.isNumber(i.tariff)&&e.isNumber(i.multiplier)&&e.isNumber(i.paid)))throw n.error("ERROR: "+t.conf.msgNameSm+" expense input check failed"),new Error("ERROR: "+t.conf.msgNameSm+" expense input check failed");""!=i.unit&&null!=i.unit||(i.unit="не указано"),i.multiplier<0&&(i.multiplier=1),0==i.multiplier&&(i.multiplier=1),i.tariff<0&&(i.tariff*=-1),i.paid<0&&(i.paid*=-1),i.toPay=i.tariff*i.multiplier,i.rest=i.toPay-i.paid,i.usd?i.money="USD":i.money=t.currentProject.budget.nationalMoney,t.currentProject[t.conf.mainProp].expCollection.push(i),r(),_env()._dev&&o.log("Update PROJECT by "+t.conf.msgNameBg+": reason - ADD "+t.conf.msgNameBg+" EXP EVENT ");var c={_id:t.currentProject._id,key:t.conf.mainProp,keyURL:"/"+t.conf.mainProp+"DataSave"};c[t.conf.mainProp]=t.currentProject[t.conf.mainProp],a._ajaxRequest("PUT",null,c,c.keyURL).then(function(e){t.newItem={},_env()._dev?n.success("New "+t.conf.msgNameSm+" Item created!"):n.success("OK")},function(e){throw n.error("ERROR: New "+t.conf.msgNameSm+" Item AJAX failed"),new Error("ERROR: New "+t.conf.msgNameSm+" Item AJAX failed")}).catch(function(e){n.error("ERROR: New "+t.conf.msgNameSm+" Item AJAX failed"),o.error("ERROR: New "+t.conf.msgNameSm+" Item AJAX failed",e)})},t.editExpenseItem=function(e){t.itemToEdit=t.items[e],t.removeTrigger.status=!1},t.editExpenseItemSave=function(i){if(!(""!=i.name&&e.isNumber(i.tariff)&&e.isNumber(i.multiplier)&&e.isNumber(i.paid)))throw n.error("ERROR: "+t.conf.msgNameBg+" expense input check failed"),new Error("ERROR: "+t.conf.msgNameBg+" expense input check failed");""!=i.unit&&null!=i.unit||(i.unit="не указано"),i.multiplier<0&&(i.multiplier=1),0==i.multiplier&&(i.multiplier=1),i.tariff<0&&(i.tariff*=-1),i.paid<0&&(i.paid*=-1),i.toPay=i.tariff*i.multiplier,i.rest=i.toPay-i.paid,i.usd?i.money="USD":i.money=t.currentProject.budget.nationalMoney,r(),_env()._dev&&o.log("update PROJECT by "+t.conf.msgNameBg+": reason - EDIT "+t.conf.msgNameBg+" EXP EVENT ");var c={_id:t.currentProject._id,key:t.conf.mainProp,keyURL:"/"+t.conf.mainProp+"DataSave"};c[t.conf.mainProp]=t.currentProject[t.conf.mainProp],a._ajaxRequest("PUT",null,c,c.keyURL).then(function(e){t.itemToEdit={},_env()._dev?n.success(t.conf.msgNameBg+" Expense Item Edited!"):n.success("OK")},function(e){throw n.error("ERROR: "+t.conf.msgNameBg+" Expense Item EditAJAX failed"),new Error("ERROR: "+t.conf.msgNameBg+"Expense Item Edit AJAX failed")}).catch(function(e){n.error("ERROR: "+t.conf.msgNameBg+" Expense Item Edit AJAX failed"),o.error("ERROR: "+t.conf.msgNameBg+" Expense Item Edit AJAX failed")})},t.deleteExpenseItem=function(e){t.currentProject[t.conf.mainProp].expCollection.splice(e,1),r(),_env()._dev&&o.log("Update PROJECT by "+t.conf.msgNameBg+": reason - REMOVE "+t.conf.msgNameBg+" EXP EVENT ");var i={_id:t.currentProject._id,key:t.conf.mainProp,keyURL:"/"+t.conf.mainProp+"DataSave"};i[t.conf.mainProp]=t.currentProject[t.conf.mainProp],a._ajaxRequest("PUT",null,i,i.keyURL).then(function(e){_env()._dev?n.info(t.conf.msgNameBg+" Expense Item removed"):n.info("OK")},function(e){throw n.error("ERROR: "+t.conf.msgNameBg+" Expense Item AJAX failed"),new Error("ERROR: "+t.conf.msgNameBg+" Expense Item AJAX failed")}).catch(function(e){n.error("ERROR: "+t.conf.msgNameBg+" Expense Item Edit AJAX failed"),o.error("ERROR: "+t.conf.msgNameBg+" Expense Item Edit AJAX failed",e)})},t.notesFilter=function(e){if(null==e)return"";var t=e.split("*");return""==t[0]&&t.splice(0,1),t},t.noteSave=function(){var e={_id:t.currentProject._id,key:t.conf.mainProp+"Notes",keyURL:"/"+t.conf.mainProp+"Notes"};e[t.conf.mainProp+"Notes"]=t.currentProject[t.conf.mainProp+"Notes"],a._ajaxRequest("PUT",null,e,e.keyURL).then(function(e){_env()._dev?n.info(t.conf.msgNameBg+" Notes are saved!"):n.info("OK")},function(e){throw n.error("ERROR: "+t.conf.msgNameBg+" Notes AJAX failed"),new Error("ERROR: "+t.conf.msgNameBg+" Notes AJAX failed")}).catch(function(e){n.error("ERROR: "+t.conf.msgNameBg+" Notes AJAX failed"),o.error("ERROR: "+t.conf.msgNameBg+" Notes AJAX failed",e)})}}function n(t,o,n,a){function r(){t.total={planUsd:0,planNat:0,paidUsd:0,paidNat:0,paidTotalUsd:0,paidTotalNat:0,restTotalUsd:0,restTotalNat:0},e.forEach(t.items,function(e){e.usd&&(t.total.planUsd+=e.toPay,t.total.planNat=t.total.planUsd*t.currentProject.budget.currency,t.total.paidUsd+=e.paid,t.total.paidNat=t.total.paidUsd*t.currentProject.budget.currency),e.usd||(t.total.planNat+=e.toPay,t.total.planUsd=t.total.planNat/t.currentProject.budget.currency,t.total.paidNat+=e.paid,t.total.paidUsd=t.total.paidNat/t.currentProject.budget.currency)}),t.total.paidTotalUsd+=t.total.paidUsd,t.total.paidTotalNat=t.total.paidTotalUsd*t.currentProject.budget.currency,t.total.restTotalUsd=t.total.planUsd-t.total.paidTotalUsd,t.total.restTotalNat=t.total.restTotalUsd*t.currentProject.budget.currency,t.currentProject[t.conf.mainProp].total=t.total,t.$emit(t.conf.parent+"ValuesChanged")}t.conf={mainProp:"partyW",parent:"party",msgNameBg:"PARTY_W",msgNameSm:"PartyW",expTableTitle:"ПО ДЕВИЧНИКУ",get addForm(){return"addNew"+this.msgNameSm+"ExpenseForm"},get editForm(){return"edit"+this.msgNameSm+"ExpenseForm"}},t.itemToEdit={},t.newItem={},t.removeTrigger={},t.removeTrigger.status=!1,t.$watch("currentProject.budget.currency",function(){t.currentProject[t.conf.mainProp].expCollection.length&&(r(),_env()._dev&&o.log("Update PROJECT by "+t.conf.msgNameBg+": reason - CURRENCY change EVENT"))}),t.items=t.currentProject[t.conf.mainProp].expCollection,t.total=t.currentProject[t.conf.mainProp].total,t.notes=t.currentProject[t.conf.mainProp+"Notes"],t.addNewExpenseItem=function(i){if(!(""!=i.name&&e.isNumber(i.tariff)&&e.isNumber(i.multiplier)&&e.isNumber(i.paid)))throw n.error("ERROR: "+t.conf.msgNameSm+" expense input check failed"),new Error("ERROR: "+t.conf.msgNameSm+" expense input check failed");""!=i.unit&&null!=i.unit||(i.unit="не указано"),i.multiplier<0&&(i.multiplier=1),0==i.multiplier&&(i.multiplier=1),i.tariff<0&&(i.tariff*=-1),i.paid<0&&(i.paid*=-1),i.toPay=i.tariff*i.multiplier,i.rest=i.toPay-i.paid,i.usd?i.money="USD":i.money=t.currentProject.budget.nationalMoney,t.currentProject[t.conf.mainProp].expCollection.push(i),r(),_env()._dev&&o.log("Update PROJECT by "+t.conf.msgNameBg+": reason - ADD "+t.conf.msgNameBg+" EXP EVENT ");var c={_id:t.currentProject._id,key:t.conf.mainProp,keyURL:"/"+t.conf.mainProp+"DataSave"};c[t.conf.mainProp]=t.currentProject[t.conf.mainProp],a._ajaxRequest("PUT",null,c,c.keyURL).then(function(e){t.newItem={},_env()._dev?n.success("New "+t.conf.msgNameSm+" Item created!"):n.success("OK")},function(e){throw n.error("ERROR: New "+t.conf.msgNameSm+" Item AJAX failed"),new Error("ERROR: New "+t.conf.msgNameSm+" Item AJAX failed")}).catch(function(e){n.error("ERROR: New "+t.conf.msgNameSm+" Item AJAX failed"),o.error("ERROR: New "+t.conf.msgNameSm+" Item AJAX failed",e)})},t.editExpenseItem=function(e){t.itemToEdit=t.items[e],t.removeTrigger.status=!1},t.editExpenseItemSave=function(i){if(!(""!=i.name&&e.isNumber(i.tariff)&&e.isNumber(i.multiplier)&&e.isNumber(i.paid)))throw n.error("ERROR: "+t.conf.msgNameBg+" expense input check failed"),new Error("ERROR: "+t.conf.msgNameBg+" expense input check failed");""!=i.unit&&null!=i.unit||(i.unit="не указано"),i.multiplier<0&&(i.multiplier=1),0==i.multiplier&&(i.multiplier=1),i.tariff<0&&(i.tariff*=-1),i.paid<0&&(i.paid*=-1),i.toPay=i.tariff*i.multiplier,i.rest=i.toPay-i.paid,i.usd?i.money="USD":i.money=t.currentProject.budget.nationalMoney,r(),_env()._dev&&o.log("update PROJECT by "+t.conf.msgNameBg+": reason - EDIT "+t.conf.msgNameBg+" EXP EVENT ");var c={_id:t.currentProject._id,key:t.conf.mainProp,keyURL:"/"+t.conf.mainProp+"DataSave"};c[t.conf.mainProp]=t.currentProject[t.conf.mainProp],a._ajaxRequest("PUT",null,c,c.keyURL).then(function(e){t.itemToEdit={},_env()._dev?n.success(t.conf.msgNameBg+" Expense Item Edited!"):n.success("OK")},function(e){throw n.error("ERROR: "+t.conf.msgNameBg+" Expense Item EditAJAX failed"),new Error("ERROR: "+t.conf.msgNameBg+"Expense Item Edit AJAX failed")}).catch(function(e){n.error("ERROR: "+t.conf.msgNameBg+" Expense Item Edit AJAX failed"),o.error("ERROR: "+t.conf.msgNameBg+" Expense Item Edit AJAX failed")})},t.deleteExpenseItem=function(e){t.currentProject[t.conf.mainProp].expCollection.splice(e,1),r(),_env()._dev&&o.log("Update PROJECT by "+t.conf.msgNameBg+": reason - REMOVE "+t.conf.msgNameBg+" EXP EVENT ");var i={_id:t.currentProject._id,key:t.conf.mainProp,keyURL:"/"+t.conf.mainProp+"DataSave"};i[t.conf.mainProp]=t.currentProject[t.conf.mainProp],a._ajaxRequest("PUT",null,i,i.keyURL).then(function(e){_env()._dev?n.info(t.conf.msgNameBg+" Expense Item removed"):n.info("OK")},function(e){throw n.error("ERROR: "+t.conf.msgNameBg+" Expense Item AJAX failed"),new Error("ERROR: "+t.conf.msgNameBg+" Expense Item AJAX failed")}).catch(function(e){n.error("ERROR: "+t.conf.msgNameBg+" Expense Item Edit AJAX failed"),o.error("ERROR: "+t.conf.msgNameBg+" Expense Item Edit AJAX failed",e)})},t.notesFilter=function(e){if(null==e)return"";var t=e.split("*");return""==t[0]&&t.splice(0,1),t},t.noteSave=function(){var e={_id:t.currentProject._id,key:t.conf.mainProp+"Notes",keyURL:"/"+t.conf.mainProp+"Notes"};e[t.conf.mainProp+"Notes"]=t.currentProject[t.conf.mainProp+"Notes"],a._ajaxRequest("PUT",null,e,e.keyURL).then(function(e){_env()._dev?n.info(t.conf.msgNameBg+" Notes are saved!"):n.info("OK")},function(e){throw n.error("ERROR: "+t.conf.msgNameBg+" Notes AJAX failed"),new Error("ERROR: "+t.conf.msgNameBg+" Notes AJAX failed")}).catch(function(e){n.error("ERROR: "+t.conf.msgNameBg+" Notes AJAX failed"),o.error("ERROR: "+t.conf.msgNameBg+" Notes AJAX failed",e)})}}t.$inject=["$scope","$log","$timeout","toastr","ResourceService"],o.$inject=["$scope","$log","toastr","ResourceService"],n.$inject=["$scope","$log","toastr","ResourceService"];var a=e.module("partyCtrlModule",["wedServices"]);return a.controller("partyMainCtrl",t),a.controller("partyMCtrl",o),a.controller("partyWCtrl",n),a});