//  import mongoose module
const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
// create group Schema 
const groupSchema = mongoose.Schema({
    name:String,
    courseId: { type:mongoose.Schema.Types.ObjectId,ref:"Course"}, 
    teacherId:{ type:mongoose.Schema.Types.ObjectId,ref:"User"},
    studentsIds:[{ type:mongoose.Schema.Types.ObjectId,ref:"User"}]
});
groupSchema.plugin(uniqueValidator);
// affect group Schema to Model Name Group
const group = mongoose.model("Group", groupSchema);
// Make group exportable
module.exports = group;