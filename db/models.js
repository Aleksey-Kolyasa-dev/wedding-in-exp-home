var WeddingSchema = require('../db/schema');
//var db = require('../db/db');

var Wedding = db.model("Wedding", WeddingSchema);

/*var test = new Wedding({
    fianceName : "Alex",
    fianceeName : "Kris",
    weddingDate : "2017-09-27T21:00:00.000Z",
    wedBudget : 6000,
    email : "test@test",
    telephone : "+380668840250",
    notes : "this is first test project",
    fianceSideGuests : [],
    fianceeSideGuests : []
});*/

module.exports = Wedding;