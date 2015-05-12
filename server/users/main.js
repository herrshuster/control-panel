// Meteor.methods({
// 	change_restrictions: function(restricting_user_id,restricted_user_id,new_restrictions) {
// 		var restricting_user = Meteor.users.findOne({_id:restricting_user_id}),
// 			restricted_user = Meteor.users.findOne({_id:restricted_user_id});

// 		if(restricting_user._id !== restricted_user._id) {
// 			if(restricting_user.profile.restrictions < restricted_user.profile.restrictions) {
// 				console.log('restricting user restrictions',restricting_user.profile.restrictions,'new',new_restrictions);
// 				if(restricting_user.profile.restrictions <= new_restrictions) {
// 					Meteor.users.update(
// 						{_id:restricted_user_id},
// 						{
// 							$set: {'profile.restrictions':new_restrictions}
// 						}, function(error,id) {
// 							console.log(error,id);
// 							if(!error) {
// 								return true;
// 							} else {
// 								console.log(error);
// 								return 'failure';
// 							}
// 						}
// 					);
// 				} else {
// 					console.log('users may not grant fewer restrictions than their own');
// 					return 'users may not grant fewer restrictions than their own';
// 				}
// 			} else {
// 				console.log('users may not restrict users with fewer restrictions than them');
// 				return 'users may not restrict users with fewer restrictions than them';
// 			}

// 		} else if(restricting_user.profile.restrictions <= new_restrictions) {
// 			var unrestrictedUsers = Meteor.users.find({'profile.restrictions':'0'}).fetch();
// 			if(unrestrictedUsers.length > 1) {
// 				Meteor.users.update(
// 					{_id:restricted_user_id},
// 					{
// 						$set: {'profile.restrictions':new_restrictions}
// 					}, function(error,id) {
// 						console.log(error,id);
// 						return true;
// 					}
// 				);
// 			} else {
// 				console.log("You are the only unrestricted user");

// 				return "You are the only unrestricted user";
// 			}
// 		} else {
// 			console.log("You may not reduce your restrictions");
// 			return "You may not reduce your restrictions";
// 		}

// 	}
// });