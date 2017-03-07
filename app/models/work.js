var mongoose = require('mongoose');
var workSchema = require('../schemas/work');
var Work = mongoose.model('Work', workSchema);

module.exports = Work;