var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
    "fianceName": {
        "name": "fianceName",
        "type": "string",
        "typeLabel": "string",
        "required": true,
        "id": "fianceName",
        "order": 0
    },
    "fianceeName": {
        "name": "fianceeName",
        "type": "string",
        "typeLabel": "string",
        "required": true,
        "id": "fianceeName",
        "order": 1
    },
    "weddingDate": {
        "name": "weddingDate",
        "type": "date",
        "typeLabel": "date",
        "required": true,
        "id": "weddingDate",
        "order": 2
    },
    "wedBudget": {
        "name": "wedBudget",
        "type": "number",
        "typeLabel": "number",
        "required": true,
        "id": "wedBudget",
        "order": 3
    },
    "email": {
        "name": "email",
        "type": "string",
        "typeLabel": "string",
        "required": true,
        "id": "email",
        "order": 4
    },
    "telephones": {
        "name": "telephones",
        "type": "string",
        "typeLabel": "string",
        "required": true,
        "id": "telephones",
        "order": 5
    },
    "notes": {
        "name": "notes",
        "type": "string",
        "typeLabel": "string",
        "required": false,
        "id": "notes",
        "order": 6
    },
    "fianceSideGuests": {
        "name": "fianceSideGuests",
        "type": "array",
        "typeLabel": "array",
        "required": false,
        "id": "fianceSideGuests",
        "order": 7
    },
    "fianceeSideGuests": {
        "name": "fianceeSideGuests",
        "type": "array",
        "typeLabel": "array",
        "required": false,
        "id": "fianceeSideGuests",
        "order": 8
    }
});

var UserSchema = new mongoose.Schema({
    "userName": {
        "name": "userName",
        "type": "string",
        "typeLabel": "string",
        "required": true,
        "id": "userName",
        "order": 0
    },
    "fianceeName": {
        "name": "fianceeName",
        "type": "string",
        "typeLabel": "string",
        "required": true,
        "id": "fianceeName",
        "order": 1
    },
    "weddingDate": {
        "name": "weddingDate",
        "type": "date",
        "typeLabel": "date",
        "required": true,
        "id": "weddingDate",
        "order": 2
    },
    "wedBudget": {
        "name": "wedBudget",
        "type": "number",
        "typeLabel": "number",
        "required": true,
        "id": "wedBudget",
        "order": 3
    },
    "email": {
        "name": "email",
        "type": "string",
        "typeLabel": "string",
        "required": true,
        "id": "email",
        "order": 4
    },
    "telephones": {
        "name": "telephones",
        "type": "string",
        "typeLabel": "string",
        "required": true,
        "id": "telephones",
        "order": 5
    },
    "notes": {
        "name": "notes",
        "type": "string",
        "typeLabel": "string",
        "required": false,
        "id": "notes",
        "order": 6
    },
    "fianceSideGuests": {
        "name": "fianceSideGuests",
        "type": "array",
        "typeLabel": "array",
        "required": false,
        "id": "fianceSideGuests",
        "order": 7
    },
    "fianceeSideGuests": {
        "name": "fianceeSideGuests",
        "type": "array",
        "typeLabel": "array",
        "required": false,
        "id": "fianceeSideGuests",
        "order": 8
    }
});

module.exports = projectSchema;