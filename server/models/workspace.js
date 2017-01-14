'use strict';

var mongoose = require('mongoose');

var WorkspaceSchema = new mongoose.Schema({
	active: {
		type: Boolean,
		default: true
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: [true, 'UserId required to operate on a workspace.']
	},
	name: {
		type: String,
		minlength: [2, 'Workspace name requires at least 2 characters.'],
		default: 'default'
	}, 
	metadata: [{
		noteId: mongoose.Schema.Types.ObjectId,
		postionX: Number,
		postionY: Number,
		postionZ: Number,
	}]
}, { timestamps: true });

mongoose.model('Workspace', WorkspaceSchema);