"use strict";
var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
 content: {
           type: String,
           required: [true, "Content text is Required!"],
           trim: true
         },
 week: {
           type: String,
           required: [true, "Week is Required!"]
         },
 userId: {
           type: String,
           required: [true, "User_id is Required!"],
         },
 userName: {
           type: String,
           required: [true, "UserName is Required!"],
         },
 active:{
	 				 type: Number,
					 default: 2
 			   },
 _item: {type: mongoose.Schema.Types.ObjectId, ref: 'Item'}
},{ timestamps: true});

mongoose.model('Comment', CommentSchema);
