//  import mongoose module
const mongoose = require("mongoose");

// create bulletin Schema 
const bulletinSchema = mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    note: String,
    evaluation: String,
});

// affect bulletin Schema to Model Name Bulletin
const bulletin = mongoose.model("Bulletin", bulletinSchema);
// Make bulletin exportable
module.exports = bulletin;