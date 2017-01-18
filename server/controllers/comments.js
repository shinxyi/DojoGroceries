"use strict";

var mongoose = require('mongoose'),
    moment = require('moment'),
    Comment = mongoose.model('Comment'),
    Item = mongoose.model('Item');

console.log('comments controller');

function CommentsController() {

  var lastSunday = function(){
		var s = moment().format('YYYYMMDD');
		var d = new Date(s.substring(0,4), s.substring(4,6) - 1, s.substring(6));
	  d.setDate(d.getDate() - d.getDay());
	  return d.toString().split(' ').join('');
	}

    this.create = function(req,res){

      Item.findOne({_id: req.params.item_id }, function(err, item){
        if(!item){
          res.json({errors: ['Cannot find the item the user is trying to comment to.']});
          return;
        }

        console.log('checking user->', req.session.user);
        var comment = new Comment(req.body);
        comment._item = item._id;
        comment.week = lastSunday();
        comment.userName = req.session.user.name;
        comment.userId = req.session.user._id;
        console.log('comment is being created!!!', req.body);

        comment.save(function(err){
          console.log('comment is being created22', req.body);
          if(err){
            console.log('err->',err);
            res.json({errors: err});
            // res.json({errors: ['Failed to save comment']});
            return;
          }

          if(!err){
            item.comments.push(comment);
            item.save(function(err){
              if(err){
                res.json({errors: ['Failed to save comment to item']});
              }else{
                res.json(comment);
              }
            })
          }
        })
      })
    };

    this.flag = function(req, res) {
      Comment.findOne({_id: req.params.comment_id}, function(err, comment) {
        console.log('trying to update this comment, ->', comment);
        comment.active = comment.active==2 ? 1 : 2;
        comment.save(function(err){
          if(err){
            res.json({errors: ['Comment active status cannot be changed']});
          }else{
            res.json(comment);
          }
        })
      });
    };

    this.destroy = function(req, res) {

      Comment.findOne({_id: req.params.comment_id}, function(err, comment) {
        if(comment.userId==req.session.user._id|| req.session.user.adminLvl==9){
          comment.active = 0;
          comment.save(function(err){
            if(err){
              res.json({errors: ['Comment active status cannot be changed']});
            }else{
              res.json(comment);
            }
          })
        }else{
            res.json({errors:['Cannot delete comment of another user...']});
            return;
        }
      });
    };

    this.indexFlagged = function(req, res) {
      Comment.find({active: 1, week: lastSunday() }, function(err, comments) {
        if(err){
          res.json({errors: ['Flagged comments cannot be retrieved']});
        }else{
          res.json(comments);
        }
      })
    };

}

module.exports = new CommentsController();
