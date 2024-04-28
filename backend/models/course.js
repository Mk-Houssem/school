//  import mongoose module
const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
// create Course Schema 
const courseSchema = mongoose.Schema({
    name: String,
    description: String,
    duration: String, 
    id_teacher:String,
});
courseSchema.plugin(uniqueValidator);
// affect course Schema to Model Name course
const course = mongoose.model("Course", courseSchema);
// Make course exportable
module.exports = course;