if (Meteor.isServer) {
	Projects = new Meteor.Collection('projects');
	Employees = new Meteor.Collection('employees');
	
  Meteor.startup(function () {
	Meteor.methods({
		
	})
  });
}
