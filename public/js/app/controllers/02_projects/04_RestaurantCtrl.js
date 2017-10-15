define(["angular"],function(e){"use strict";function t(t,r,a,n){function u(){t.currentProject.restaurant.generalData.sumCheckNat=t.currentProject.restaurant.guestsQty*t.currentProject.restaurant.generalData.generalCheck,t.currentProject.restaurant.generalData.sumPercentNat=t.currentProject.restaurant.generalData.sumCheckNat/100*t.currentProject.restaurant.generalData.generalPercent,t.currentProject.restaurant.generalData.sumPlugsNat=t.currentProject.restaurant.guestsQty*t.currentProject.restaurant.generalData.generalPlugs,t.currentProject.restaurant.total.planNat=t.currentProject.restaurant.generalData.sumCheckNat+t.currentProject.restaurant.generalData.sumPercentNat+t.currentProject.restaurant.generalData.sumPlugsNat,t.currentProject.restaurant.total.planUsd=t.currentProject.restaurant.total.planNat/t.currentProject.budget.currency,t.currentProject.restaurant.generalData.fullCheckNat=t.currentProject.restaurant.total.planNat/t.currentProject.restaurant.guestsQty,t.currentProject.restaurant.total.paidUsd=t.currentProject.restaurant.total.paidNat/t.currentProject.budget.currency,t.currentProject.restaurant.total.restNat=t.currentProject.restaurant.total.planNat-t.currentProject.restaurant.total.paidNat,t.currentProject.restaurant.total.restUsd=t.currentProject.restaurant.total.restNat/t.currentProject.budget.currency,t.currentProject.restaurant.total.planTotalNat=t.currentProject.restaurant.total.planNat+t.currentProject.restaurantPlus.total.planNat+t.currentProject.restaurantCakes.total.planNat,t.currentProject.restaurant.total.planTotalUsd=t.currentProject.restaurant.total.planUsd+t.currentProject.restaurantPlus.total.planUsd+t.currentProject.restaurantCakes.total.planUsd,t.currentProject.restaurant.total.paidTotalNat=t.currentProject.restaurant.total.paidNat+t.currentProject.restaurantPlus.total.paidTotalNat+t.currentProject.restaurantCakes.total.paidTotalNat,t.currentProject.restaurant.total.paidTotalUsd=t.currentProject.restaurant.total.paidUsd+t.currentProject.restaurantPlus.total.paidTotalUsd+t.currentProject.restaurantCakes.total.paidTotalUsd,t.currentProject.restaurant.total.restTotalNat=t.currentProject.restaurant.total.planTotalNat-t.currentProject.restaurant.total.paidTotalNat,t.currentProject.restaurant.total.restTotalUsd=t.currentProject.restaurant.total.planTotalUsd-t.currentProject.restaurant.total.paidTotalUsd,_env()._dev&&t.count++}function o(){t.tablesCollection.length=0,t.tablesCollection=[[]];var r=0;e.forEach(t.currentProject.fianceSideGuests,function(e){r<e.table&&(r=e.table)}),e.forEach(t.currentProject.fianceeSideGuests,function(e){r<e.table&&(r=e.table)});for(var a=new Array(r),n=0;n<r;n++)a[n]=n;var u=t.currentProject.fianceSideGuests.concat(t.currentProject.fianceeSideGuests);e.forEach(a,function(r,a){var n=[];e.forEach(u,function(e){e.table==a+1&&e.guestWillBe&&n.push(e)}),t.tablesCollection[a]=n}),t.tablesCollection[0].unshift({name:t.currentProject.fianceeName,relation:"невеста",side:"W"}),t.tablesCollection[0].unshift({name:t.currentProject.fianceName,relation:"жених",side:"M"})}_env()._dev&&(t.count=0),t.subView="restaurant",t.currentProject.restaurant.quickView=!1,t.checkboxDisabled=!_env()._dev,t.guest={},t.tablesCollection=[[]],t.$on("totalValuesChanged",function(){u()}),t.subViewShift=function(e){switch(e){case"guests":case"tables":case"restaurantMenu":case"restaurantCakes":case"restaurant":case"restaurantPlus":t.subView=e}};var c=t.currentProject.restaurant.generalData.generalCheck;t.menuCheck=function(){t.currentProject.useMenuCheck?t.currentProject.restaurant.generalData.generalCheck=t.currentProject.restaurantMenu.total.calculatedCheck:t.currentProject.restaurant.generalData.generalCheck=c;var e={_id:t.currentProject._id,key:"useMenuCheck",keyURL:"/useMenuCheckDataSave",useMenuCheck:t.currentProject.useMenuCheck};n._ajaxRequest("PUT",null,e,e.keyURL).then(function(e){_env()._dev?a.success("useMenuCheck changed"):a.success("OK")},function(e){throw a.error("ERROR: useMenuCheck edit AJAX failed"),new Error("ERROR: useMenuCheck edit AJAX failed"+e)}).catch(function(e){a.error("ERROR: useMenuCheck edit AJAX failed"),r.error("ERROR: useMenuCheck edit AJAX failed",e)})},o(),t.guests={side:null,sortByTable_M:!1,sortByTable_W:!1,drinks_M:!1,notes_M:!1,rinks_W:!1,notes_W:!1,guestSide:function(e){this.side=e},guestUnderEdit:{},_clear:function(){t.guest={},this.guestUnderEdit={},"M"==arguments[0]&&(this.drinks_M=!1,this.notes_M=!1),"W"==arguments[0]&&(this.drinks_W=!1,this.notes_W=!1)},addNewGuest:function(u){var c=this;if(u.name&&u.relation&&e.isNumber(u.group)&&e.isNumber(u.table)){switch(u.guestWillBe=!0,u.table=Math.floor(u.table),this.side){case"M":u.side="M",t.currentProject.fianceSideGuests.push(u);var s={_id:t.currentProject._id,key:"fianceSideGuests",keyURL:"/fianceSideGuests",data:t.currentProject.fianceSideGuests};n._ajaxRequest("PUT",null,s,s.keyURL).then(function(e){c._clear(),_env()._dev?a.success("GUEST ADD SUCCESS"):a.success("OK")},function(e){throw a.error("ERROR: Guest_M add AJAX failed"),new Error("ERROR: Guest_M add AJAX failed"+e)});break;case"W":u.side="W",t.currentProject.fianceeSideGuests.push(u);var i={_id:t.currentProject._id,key:"fianceeSideGuests",keyURL:"/fianceeSideGuests",data:t.currentProject.fianceeSideGuests};n._ajaxRequest("PUT",null,i,i.keyURL).then(function(e){c._clear(),_env()._dev?a.success("GUEST ADD SUCCESS"):a.success("OK")},function(e){throw a.error("ERROR: Guest_W add AJAX failed"),new Error("ERROR: Guest_W add AJAX failed"+e)})}o()}else c._clear(),r.log("ERROR: Guest side "+this.side+" VALIDATION Failed!"),a.error("ERROR: Guest side "+this.side+" VALIDATION Failed!")},guestEdit:function(e,r){switch(r){case"M":this.guestUnderEdit=t.currentProject.fianceSideGuests[e],this.guestUnderEdit.side="M";break;case"W":this.guestUnderEdit=t.currentProject.fianceeSideGuests[e],this.guestUnderEdit.side="W"}},guestEditDone:function(e){var r=this;switch(e){case"M":t.currentProject.fianceSideGuests.map(function(e){e.table=Math.floor(e.table)});var u={_id:t.currentProject._id,key:"fianceSideGuests",keyURL:"/fianceSideGuests",data:t.currentProject.fianceSideGuests};n._ajaxRequest("PUT",null,u,u.keyURL).then(function(e){r._clear(),_env()._dev?a.success("GUEST EDIT SUCCESS"):a.success("OK")},function(e){throw a.error("ERROR: Guest_M edit AJAX failed"),new Error("ERROR: Guest_M edit AJAX failed"+e)});break;case"W":t.currentProject.fianceeSideGuests.map(function(e){e.table=Math.floor(e.table)});var c={_id:t.currentProject._id,key:"fianceeSideGuests",keyURL:"/fianceeSideGuests",data:t.currentProject.fianceeSideGuests};n._ajaxRequest("PUT",null,c,c.keyURL).then(function(e){r._clear(),_env()._dev?a.success("GUEST EDIT SUCCESS"):a.success("OK")},function(e){throw a.error("ERROR: Guest_W edit AJAX failed"),new Error("ERROR: Guest_W edit AJAX failed"+e)})}o()},guestDelete:function(e){var r=this;switch(e.side){case"M":t.currentProject.fianceSideGuests.splice(t.currentProject.fianceSideGuests.indexOf(e),1);var u={_id:t.currentProject._id,key:"fianceSideGuests",keyURL:"/fianceSideGuests",data:t.currentProject.fianceSideGuests};n._ajaxRequest("PUT",null,u,u.keyURL).then(function(e){r._clear(),_env()._dev?a.success("GUEST DELETED SUCCESS"):a.success("OK")},function(e){throw a.error("ERROR: Guest_M delete AJAX failed"),new Error("ERROR: Guest_M delete AJAX failed"+e)});break;case"W":t.currentProject.fianceeSideGuests.splice(t.currentProject.fianceeSideGuests.indexOf(e),1);var c={_id:t.currentProject._id,key:"fianceeSideGuests",keyURL:"/fianceeSideGuests",data:t.currentProject.fianceeSideGuests};n._ajaxRequest("PUT",null,c,c.keyURL).then(function(e){r._clear(),_env()._dev?a.success("GUEST DELETED SUCCESS"):a.success("OK")},function(e){throw a.error("ERROR: Guest_W delete AJAX failed"),new Error("ERROR: Guest_W delete AJAX failed"+e)})}o()}},t.guestsQty=function(e){if(t.currentProject.restaurant.quickView){var r=t.currentProject.restaurant.quickData.quickGuestsQty*t.currentProject.restaurant.quickData.quickCheck;return t.currentProject.restaurant.quickData.planNat=r+r/100*t.currentProject.restaurant.quickData.quickPercent+t.currentProject.restaurant.quickData.quickGuestsQty*t.currentProject.restaurant.quickData.quickPlugs,t.currentProject.restaurant.quickData.planUsd=t.currentProject.restaurant.quickData.planNat/t.currentProject.budget.currency,t.currentProject.restaurant.quickData.quickGuestsQty}var a=e.fianceSideGuests.filter(function(e){return 1==e.guestWillBe}),n=e.fianceeSideGuests.filter(function(e){return 1==e.guestWillBe}),u=a.length+n.length+2;return t.currentProject.restaurant.guestsQty=u,u},t.quickView=function(e){e.restaurant.quickView=!e.restaurant.quickView},t.restDataSave=function(o){if(arguments.length){if(!(e.isNumber(o.quickGuestsQty)&&e.isNumber(o.quickCheck)&&e.isNumber(o.quickPercent)))throw a.error("ERROR: generalData or quickData number input failed"),new Error("ERROR: generalData or quickData number input failed"+err);var c={_id:t.currentProject._id,key:"quickData",keyURL:"/quickDataSave",data:t.currentProject.restaurant.quickData};n._ajaxRequest("PUT",null,c,c.keyURL).then(function(e){t.saveHide=!0,_env()._dev?a.success("quickData changed"):a.success("OK")},function(e){throw a.error("ERROR: quickData edit AJAX failed"),new Error("ERROR: quickData edit AJAX failed"+e)})}else{u(),_env()._dev&&r.log("UPDATE: reason - RESTAURANT DATA SAVE EVENT",t.count);var s={_id:t.currentProject._id,key:"generalData",keyURL:"/generalDataSave",data:t.currentProject.restaurant};n._ajaxRequest("PUT",null,s,s.keyURL).then(function(e){t.saveHide=!0,_env()._dev?a.success("generalData changed"):a.success("OK")},function(e){throw a.error("ERROR: generalData edit AJAX failed"),new Error("ERROR: generalData edit AJAX failed"+e)}).catch(function(e){a.error("ERROR: generalData edit AJAX failed"),r.error("ERROR: generalData edit AJAX failed",e)})}},t.saveHideTrigger=function(){t.saveHide=!1},t.restGeneralDataDisplayCheck=function(t,r){return e.isNumber(t)?0==t?"нет":t+" "+r:""!=t&&e.isString(t)?t:""==t?"не указано":""},t.notesFilter=function(e){if(null==e)return"";var t=e.split("*");return""==t[0]&&t.splice(0,1),t},t.noteSave=function(){var e={_id:t.currentProject._id,key:"guestsNotes",keyURL:"/guestsNotes",data:t.currentProject.guestsNotes};n._ajaxRequest("PUT",null,e,e.keyURL).then(function(e){_env()._dev?a.info("Notes are saved!"):a.info("OK")},function(e){throw a.error("ERROR: Notes AJAX failed"),new Error("ERROR: Notes AJAX failed"+e)}).catch(function(e){a.error("ERROR: Notes AJAX failed"),r.error("ERROR: Notes AJAX failed",e)})},t.noteRestSave=function(){var e={_id:t.currentProject._id,key:"restNotes",keyURL:"/restNotes",data:t.currentProject.restNotes};n._ajaxRequest("PUT",null,e,e.keyURL).then(function(e){_env()._dev?a.info("Notes are saved!"):a.info("OK")},function(e){throw a.error("ERROR: Notes AJAX failed"),new Error("ERROR: Notes AJAX failed"+e)}).catch(function(e){a.error("ERROR: Notes AJAX failed"),r.error("ERROR: Notes AJAX failed",e)})}}function r(t,r,a,n){function u(){t.dispalyCategotries={},e.forEach(t.currentProject.restaurantMenu.expCollection,function(e){"Холодные закуски"==e.category&&(t.dispalyCategotries.coldDishes=!0),"Салаты"==e.category&&(t.dispalyCategotries.salads=!0),"Горячие закуски"==e.category&&(t.dispalyCategotries.hotDishes=!0),"Основные блюда"==e.category&&(t.dispalyCategotries.mainDishes=!0),"Десерт"==e.category&&(t.dispalyCategotries.disetrs=!0),"Напитки А"==e.category&&(t.dispalyCategotries.drinksA=!0),"Напитки Б/А"==e.category&&(t.dispalyCategotries.drinksBA=!0),"Фуршет"==e.category&&(t.dispalyCategotries.furshet=!0),"Иное"==e.category&&(t.dispalyCategotries.other=!0)})}function o(){t.total={totalMenuPriceNat:0,totalMenuWeight:0,calculatedCheck:0,weightPerGuest:0},e.forEach(t.items,function(e){t.total.totalMenuPriceNat+=e.toPay,t.total.totalMenuWeight+=e.totalWeight}),t.total.calculatedCheck=t.total.totalMenuPriceNat/t.currentProject.restaurant.guestsQty,t.total.weightPerGuest=t.total.totalMenuWeight/t.currentProject.restaurant.guestsQty,t.currentProject.restaurantMenu.total=t.total,t.$emit("totalValuesChanged")}t.itemToEdit={},t.newItem={},t.removeTrigger={},t.removeTrigger.status=!1,t.items=t.currentProject.restaurantMenu.expCollection,t.total=t.currentProject.restaurantMenu.total,t.categories=t.currentProject.restaurantMenu.categories,t.dispalyCategotries={},u(),t.$watch("currentProject.restaurant.guestsQty",function(){o(),_env()._dev&&r.log("update by MENU: reason - GUEST QTY EVENT ",t.count)}),t.$watch("currentProject.restaurantMenu.total.calculatedCheck",function(){t.currentProject.useMenuCheck&&(t.currentProject.restaurant.generalData.generalCheck=t.currentProject.restaurantMenu.total.calculatedCheck,t.$emit("totalValuesChanged"),_env()._dev&&r.log("update by MENU: reason - MENU CHECK CHANGED",t.count))}),t.addNewExpenseItem=function(c){if(!(""!=c.name&&e.isNumber(c.portionWeight)&&e.isNumber(c.portionPrice)&&e.isNumber(c.portionQty)&&t.categories.some(function(e){return c.category==e})))throw a.error("ERROR: Menu input check failed"),new Error("ERROR: Menu input check failed");c.portionWeight<0&&(c.grPerGuest*=-1),c.portionPrice<0&&(c.kgPrice*=-1),c.portionQty<0&&(c.portionQty*=-1),c.toPay=c.portionPrice*c.portionQty,c.totalWeight=c.portionWeight*c.portionQty,t.currentProject.restaurantMenu.expCollection.push(c),o(),_env()._dev&&r.log("update by MENU: reason - ADD MENU ITEM EVENT ",t.count),u();var s={_id:t.currentProject._id,key:"restaurantMenu",keyURL:"/restaurantMenuDataSave",data:t.currentProject.restaurantMenu};n._ajaxRequest("PUT",null,s,s.keyURL).then(function(e){t.newItem={},_env()._dev?a.success("Menu Item created!"):a.success("OK")},function(e){throw a.error("ERROR: Menu Item AJAX failed"),new Error("ERROR: Menu Item AJAX failed")}).catch(function(e){a.error("ERROR: Menu Item AJAX failed"),r.error("ERROR: Menu Item AJAX failed",e)})},t.editExpenseItem=function(e){t.itemToEdit=t.items[e],t.removeTrigger.status=!1},t.editExpenseItemSave=function(c){if(!(""!=c.name&&e.isNumber(c.portionWeight)&&e.isNumber(c.portionPrice)&&e.isNumber(c.portionQty)&&t.categories.some(function(e){return c.category==e})))throw a.error("ERROR: Menu input check failed"),new Error("ERROR: Menu input check failed");c.portionWeight<0&&(c.grPerGuest*=-1),c.portionPrice<0&&(c.kgPrice*=-1),c.portionQty<0&&(c.portionQty*=-1),c.toPay=c.portionPrice*c.portionQty,c.totalWeight=c.portionWeight*c.portionQty,o(),_env()._dev&&r.log("update by MENU: reason - EDIT MENU EVENT ",t.count),u();var s={_id:t.currentProject._id,key:"restaurantMenu",keyURL:"/restaurantMenuDataSave",data:t.currentProject.restaurantMenu};n._ajaxRequest("PUT",null,s,s.keyURL).then(function(e){t.itemToEdit={},_env()._dev?a.success("Menu Item Edited!"):a.success("OK")},function(e){throw a.error("ERROR: Menu Edit Item AJAX failed"),new Error("ERROR: Menu Edit Item AJAX failed"+e)}).catch(function(e){a.error("ERROR: Menu Edit Edit AJAX failed"),r.error("ERROR: Menu Edit Edit AJAX failed",e)})},t.deleteExpenseItem=function(e){t.currentProject.restaurantMenu.expCollection.splice(e,1),o(),_env()._dev&&r.log("update by MENU: reason - REMOVE MENU ITEM EVENT ",t.count),u();var c={_id:t.currentProject._id,key:"restaurantMenu",keyURL:"/restaurantMenuDataSave",data:t.currentProject.restaurantMenu};n._ajaxRequest("PUT",null,c,c.keyURL).then(function(e){t.itemToEdit={},_env()._dev&&a.warning("Menu Item removed")},function(e){throw a.error("ERROR: New Expense Item AJAX failed"),new Error("ERROR: New Expense Item AJAX failed"+e)}).catch(function(e){a.error("ERROR: Menu Item Remove AJAX failed"),r.error("ERROR: Menu Item Remove AJAX failed",e)})},t.notesFilter=function(e){if(null==e)return"";var t=e.split("*");return""==t[0]&&t.splice(0,1),t},t.noteSave=function(){var e={_id:t.currentProject._id,key:"menuNotes",keyURL:"/menuNotes",data:t.currentProject.menuNotes};n._ajaxRequest("PUT",null,e,e.keyURL).then(function(e){_env()._dev?a.info("MENU Notes are saved!"):a.info("OK")},function(e){throw a.error("ERROR: Notes AJAX failed"),new Error("ERROR: MENU Notes AJAX failed")}).catch(function(e){a.error("ERROR: Notes AJAX failed"),r.error("ERROR: Notes AJAX failed",e)})}}function a(t,r,a,n){function u(){t.total={planUsd:0,planNat:0,paidUsd:0,paidNat:0,paidTotalUsd:0,paidTotalNat:0,restTotalUsd:0,restTotalNat:0},e.forEach(t.items,function(e){e.usd&&(t.total.planUsd+=e.toPai,t.total.planNat=t.total.planUsd*t.currentProject.budget.currency,t.total.paidUsd+=e.paid,t.total.paidNat=t.total.paidUsd*t.currentProject.budget.currency),e.usd||(t.total.planNat+=e.toPai,t.total.planUsd=t.total.planNat/t.currentProject.budget.currency,t.total.paidNat+=e.paid,t.total.paidUsd=t.total.paidNat/t.currentProject.budget.currency)}),t.total.paidTotalUsd+=t.total.paidUsd,t.total.paidTotalNat=t.total.paidTotalUsd*t.currentProject.budget.currency,t.total.restTotalUsd=t.total.planUsd-t.total.paidTotalUsd,t.total.restTotalNat=t.total.restTotalUsd*t.currentProject.budget.currency,t.currentProject.restaurantCakes.total=t.total,t.$emit("totalValuesChanged")}t.itemToEdit={},t.newItem={},t.removeTrigger={},t.removeTrigger.status=!1,t.items=t.currentProject.restaurantCakes.expCollection,t.total=t.currentProject.restaurantCakes.total,t.$watch("currentProject.restaurant.guestsQty",function(){e.forEach(t.currentProject.restaurantCakes.expCollection,function(e){e.totalKg=e.grPerGuest/1e3*t.currentProject.restaurant.guestsQty,e.toPai=e.totalKg*e.kgPrice,e.rest=e.toPai-e.paid}),u(),_env()._dev&&r.log("update by CAKE: reason - GUEST QTY EVENT ",t.count)}),t.$watch("currentProject.budget.currency",function(){t.currentProject.restaurantCakes.expCollection.length&&(u(),_env()._dev&&r.log("update by CAKE: reason - CURRENCY change EVENT",t.count))}),u(),t.addNewExpenseItem=function(o){if(!(""!=o.name&&e.isNumber(o.grPerGuest)&&e.isNumber(o.kgPrice)&&e.isNumber(o.paid)))throw a.error("ERROR: CAKES input check failed"),new Error("ERROR: CAKES input check failed");o.grPerGuest<0&&(o.grPerGuest*=-1),o.kgPrice<0&&(o.kgPrice*=-1),o.paid<0&&(o.paid*=-1),o.totalKg=o.grPerGuest/1e3*t.currentProject.restaurant.guestsQty,o.toPai=o.totalKg*o.kgPrice,o.rest=o.toPai-o.paid,o.usd?o.money="USD":o.money=t.currentProject.budget.nationalMoney,t.currentProject.restaurantCakes.expCollection.push(o),u(),_env()._dev&&r.log("update by CAKE: reason - ADD CAKE EVENT ",t.count);var c={_id:t.currentProject._id,key:"restaurantCakes",keyURL:"/restaurantCakesDataSave",data:t.currentProject.restaurantCakes};n._ajaxRequest("PUT",null,c,c.keyURL).then(function(e){t.newItem={},_env()._dev?a.success("CAKES Item created!"):a.success("OK")},function(e){throw a.error("ERROR: CAKES Item AJAX failed"),new Error("ERROR: CAKES Item AJAX failed")}).catch(function(e){a.error("ERROR: CAKES Item AJAX failed"),r.error("ERROR: CAKES Item AJAX failed",e)})},t.editExpenseItem=function(e){t.itemToEdit=t.items[e],t.removeTrigger.status=!1},t.editExpenseItemSave=function(o){if(!(""!=o.name&&e.isNumber(o.grPerGuest)&&e.isNumber(o.kgPrice)&&e.isNumber(o.paid)))throw a.error("ERROR: CAKE input check failed"),new Error("ERROR: CAKE input check failed");o.grPerGuest<0&&(o.grPerGuest*=-1),o.kgPrice<0&&(o.kgPrice*=-1),o.paid<0&&(o.paid*=-1),o.totalKg=o.grPerGuest/1e3*t.currentProject.restaurant.guestsQty,o.toPai=o.totalKg*o.kgPrice,o.rest=o.toPai-o.paid,o.usd?o.money="USD":o.money=t.currentProject.budget.nationalMoney,u(),_env()._dev&&r.log("update by CAKES: reason - EDIT CAKES EVENT ",t.count);var c={_id:t.currentProject._id,key:"restaurantCakes",keyURL:"/restaurantCakesDataSave",data:t.currentProject.restaurantCakes};n._ajaxRequest("PUT",null,c,c.keyURL).then(function(e){t.itemToEdit={},_env()._dev?a.success("CAKE Expense Item Edited!"):a.success("OK")},function(e){throw a.error("ERROR: CAKE Edit Item AJAX failed"),new Error("ERROR: CAKE Edit Item AJAX failed")}).catch(function(e){a.error("ERROR: CAKE Edit Item AJAX failed"),r.error("ERROR: CAKE Edit Item AJAX failed",e)})},t.deleteExpenseItem=function(e){t.currentProject.restaurantCakes.expCollection.splice(e,1),u(),_env()._dev&&r.log("update by CAKES: reason - REMOVE CAKES EVENT ",t.count);var o={_id:t.currentProject._id,key:"restaurantCakes",keyURL:"/restaurantCakesDataSave",data:t.currentProject.restaurantCakes};n._ajaxRequest("PUT",null,o,o.keyURL).then(function(e){t.itemToEdit={},_env()._dev?a.info("CAKES Item removed"):a.info("OK")},function(e){throw a.error("ERROR: New Expense Item AJAX failed"),new Error("ERROR: New Expense Item AJAX failed"+e)}).catch(function(e){a.error("ERROR: CAKES Item Remove AJAX failed"),r.error("ERROR: CAKES Item Remove AJAX failed",e)})},t.notesFilter=function(e){if(null==e)return"";var t=e.split("*");return""==t[0]&&t.splice(0,1),t},t.noteSave=function(){var e={_id:t.currentProject._id,key:"cakesNotes",keyURL:"/cakesNotes",data:t.currentProject.cakesNotes};n._ajaxRequest("PUT",null,e,e.keyURL).then(function(e){_env()._dev?a.info("CAKES Notes are saved!"):a.info("OK")},function(e){throw a.error("ERROR: CAKES Notes AJAX failed"),new Error("ERROR: CAKES Notes AJAX failed")}).catch(function(e){a.error("ERROR: CAKES Notes AJAX failed"),r.error("ERROR: CAKES Notes AJAX failed",e)})}}function n(t,r,a,n){function u(){t.total={planUsd:0,planNat:0,paidUsd:0,paidNat:0,paidTotalUsd:0,paidTotalNat:0,restTotalUsd:0,restTotalNat:0},e.forEach(t.items,function(e){e.usd&&(t.total.planUsd+=e.toPai,t.total.planNat=t.total.planUsd*t.currentProject.budget.currency,t.total.paidUsd+=e.paid,t.total.paidNat=t.total.paidUsd*t.currentProject.budget.currency),e.usd||(t.total.planNat+=e.toPai,t.total.planUsd=t.total.planNat/t.currentProject.budget.currency,t.total.paidNat+=e.paid,t.total.paidUsd=t.total.paidNat/t.currentProject.budget.currency)}),t.total.paidTotalUsd+=t.total.paidUsd,t.total.paidTotalNat=t.total.paidTotalUsd*t.currentProject.budget.currency,t.total.restTotalUsd=t.total.planUsd-t.total.paidTotalUsd,t.total.restTotalNat=t.total.restTotalUsd*t.currentProject.budget.currency,t.currentProject.restaurantPlus.total=t.total,t.$emit("totalValuesChanged")}t.itemToEdit={},t.newItem={},t.removeTrigger={},t.removeTrigger.status=!1,t.$watch("currentProject.budget.currency",function(){t.currentProject.restaurantPlus.expCollection.length&&(u(),_env()._dev&&r.log("update by PLUS: reason - CURRENCY change EVENT",t.count))}),t.items=t.currentProject.restaurantPlus.expCollection,t.total=t.currentProject.restaurantPlus.total,t.addNewExpenseItem=function(o){if(!(""!=o.name&&e.isNumber(o.tariff)&&e.isNumber(o.multiplier)&&e.isNumber(o.paid)))throw a.error("ERROR: PLUS expense input check failed"),new Error("ERROR: PLUS expense input check failed");""!=o.unit&&null!=o.unit||(o.unit="не указано"),o.multiplier<0&&(o.multiplier=1),0==o.multiplier&&(o.multiplier=1),o.tariff<0&&(o.tariff*=-1),o.paid<0&&(o.paid*=-1),o.toPai=o.tariff*o.multiplier,o.rest=o.toPai-o.paid,o.usd?o.money="USD":o.money=t.currentProject.budget.nationalMoney,t.currentProject.restaurantPlus.expCollection.push(o),u(),_env()._dev&&r.log("update by PLUS: reason - ADD PLUS EXP EVENT ",t.count);var c={_id:t.currentProject._id,key:"restaurantPlus",keyURL:"/restaurantPlusDataSave",data:t.currentProject.restaurantPlus};n._ajaxRequest("PUT",null,c,c.keyURL).then(function(e){t.newItem={},_env()._dev?a.success("PLUS Expense Item created!"):a.success("OK")},function(e){throw a.error("ERROR: PLUS Expense Item AJAX failed"),new Error("ERROR: PLUS Expense Item AJAX failed")}).catch(function(e){a.error("ERROR: PLUS Expense Item AJAX failed"),r.error("ERROR: PLUS Expense Item AJAX failed",e)})},t.editExpenseItem=function(e){t.itemToEdit=t.items[e],t.removeTrigger.status=!1},t.editExpenseItemSave=function(o){if(!(""!=o.name&&e.isNumber(o.tariff)&&e.isNumber(o.multiplier)&&e.isNumber(o.paid)))throw a.error("ERROR: PLUS expense input check failed"),new Error("ERROR: PLUS expense input check failed");""!=o.unit&&null!=o.unit||(o.unit="не указано"),o.multiplier<0&&(o.multiplier=1),0==o.multiplier&&(o.multiplier=1),o.tariff<0&&(o.tariff*=-1),o.paid<0&&(o.paid*=-1),o.toPai=o.tariff*o.multiplier,o.rest=o.toPai-o.paid,o.usd?o.money="USD":o.money=t.currentProject.budget.nationalMoney,u(),_env()._dev&&r.log("update by PLUS: reason - EDIT PLUS EXP EVENT ",t.count);var c={_id:t.currentProject._id,key:"restaurantPlus",keyURL:"/restaurantPlusDataSave",data:t.currentProject.restaurantPlus};n._ajaxRequest("PUT",null,c,c.keyURL).then(function(e){t.itemToEdit={},_env()._dev?a.success("PLUS Expense Item Edited!"):a.success("OK")},function(e){throw a.error("ERROR: PLUS Expense Item AJAX failed"),new Error("ERROR: PLUS Expense Item AJAX failed")}).catch(function(e){a.error("ERROR: PLUS Expense Item Edit AJAX failed"),r.error("ERROR: PLUS Expense Item Edit AJAX failed",e)})},t.deleteExpenseItem=function(e){t.currentProject.restaurantPlus.expCollection.splice(e,1),u(),_env()._dev&&r.log("update by PLUS: reason - REMOVE PLUS EXP EVENT ",t.count);var o={_id:t.currentProject._id,key:"restaurantPlus",keyURL:"/restaurantPlusDataSave",data:t.currentProject.restaurantPlus};n._ajaxRequest("PUT",null,o,o.keyURL).then(function(e){t.itemToEdit={},_env()._dev?a.info("PLUS Expense Item removed"):a.info("OK")},function(e){throw a.error("ERROR: PLUS Expense Item AJAX failed"),new Error("ERROR: PLUS Expense Item AJAX failed")}).catch(function(e){a.error("ERROR: PLUS Expense Item Edit AJAX failed"),r.error("ERROR: PLUS Expense Item Edit AJAX failed",e)})},t.notesFilter=function(e){if(null==e)return"";var t=e.split("*");return""==t[0]&&t.splice(0,1),t},t.noteSave=function(){var e={_id:t.currentProject._id,key:"plusNotes",keyURL:"/plusNotes",data:t.currentProject.plusNotes};n._ajaxRequest("PUT",null,e,e.keyURL).then(function(e){_env()._dev?a.info("PLUS Notes are saved!"):a.info("OK")},function(e){throw a.error("ERROR: PLUS Notes AJAX failed"),new Error("ERROR: PLUS Notes AJAX failed")}).catch(function(e){a.error("ERROR: PLUS Notes AJAX failed"),r.error("ERROR: PLUS Notes AJAX failed",e)})}}t.$inject=["$scope","$log","toastr","ResourceService"],r.$inject=["$scope","$log","toastr","ResourceService"],a.$inject=["$scope","$log","toastr","ResourceService"],n.$inject=["$scope","$log","toastr","ResourceService"];var u=e.module("restaurantCtrlModule",["wedServices"]);return u.controller("restaurantMainCtrl",t),u.controller("restaurantMenuMainCtrl",r),u.controller("restaurantCakesMainCtrl",a),u.controller("restaurantPlusMainCtrl",n),u});