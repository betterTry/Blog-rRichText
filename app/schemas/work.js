'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var workSchema = new Schema({
	name: String,
	articles: [{ type: ObjectId, ref: 'Article'}],
	meta : {
		createAt : {
			type : Date,
			default : Date.now()
		},
		updateAt : {
			type : Date,
			default : Date.now()
		}
	}
});

workSchema.pre('save' , function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}
	else{
		this.meta.updateAt = Date.now()
	}
	next();
})

module.exports = workSchema;

