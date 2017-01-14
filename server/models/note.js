var mongoose = require('mongoose');

var NoteSchema = new mongoose.Schema({
	active: {
		type: Boolean,
		default: true
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: [true, 'UserId required to operate on a note.']
	},
	workspaces: {
		type: Object,
		default: {}
	},
	title: {
		type: String,
		minlength: [2, 'Note title requires at least 2 characters.'],
		required: [true, 'Title is required to save note.']
	},
	content: {
		type: String,
		minlength: [2, 'Note content requires at least 2 characters.'],
		required: [true, 'Content is required to save note.']
	},
	hashtags: [{
		type: String,
		unique: true
	}]
}, { timestamps: true, minimize: false });

mongoose.model('Note', NoteSchema);
