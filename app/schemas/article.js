'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var articleSchema = new Schema({
	name: {type: String, default: '无标题文章'},
	content: {type: String, default: '<p><br/></p>'},
	work: {
		type: ObjectId,
		ref: 'Work'
	},
	publish: {
		type: Boolean,
		default: false
	},
	thumbnail: String,
	text: String,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});

articleSchema.pre('save', function(next) {
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}
	else{
		this.meta.updateAt = Date.now()
	}
	next();
});

module.exports = articleSchema;