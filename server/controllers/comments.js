"use strict";

var mongoose = require('mongoose'),
    moment = require('moment'),
    Comment = mongoose.model('Comment'),
    Item = mongoose.model('Item'),
    User = mongoose.model('User');


function CommentsController() {

  var week = 	moment().week().toString() + moment().year().toString();

    this.create = function(req,res){
      if(!req.session.user){
  			res.json({errors: ['User is not allowed to create a comment...']})
  			return;
  		}

      Item.findOne({_id: req.params.item_id }, function(err, item){
        if(!item){
          res.json({errors: ['Cannot find the item the user is trying to comment to.']});
          return;
        }

        var comment = new Comment(req.body);
        comment._item = item._id;
        comment.week = week;
        comment.userName = req.session.user.name;
        comment.userId = req.session.user._id;

        comment.save(function(err){
          if(err){
            console.log('err->',err);
            res.json({errors: err});
            // res.json({errors: ['Failed to save comment']});
            return;
          }
          //incrementing user numberOfCommentsCreated count up by one.
          User.update({_id:req.session.user._id}, {$inc:{numberOfCommentsCreated:1}}, function(err, updateInfo){
            if(err){
              console.log(err);
            };
          });

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
      if(!req.session.user){
        res.json({errors: ['User is not allowed to create a comment...']})
        return;
      }

      Comment.findOne({_id: req.params.comment_id}, function(err, comment) {
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
      if(!req.session.user){
  			res.json({errors: ['User is not allowed to create a comment...']})
  			return;
  		}

      Comment.findOne({_id: req.params.comment_id}, function(err, comment) {
        if(comment.userId==req.session.user._id|| req.session.user.adminLvl>8){
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
      if(!req.session.user){
        res.json({errors: ['User is not allowed to retrieve this data...']})
        return;
      }

      Comment.find({active: 1, week: week }, function(err, comments) {
        if(err){
          res.json({errors: ['Flagged comments cannot be retrieved']});
        }else{
          res.json(comments);
        }
      })
    };

}

module.exports = new CommentsController();
