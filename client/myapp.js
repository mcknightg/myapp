Projects = new Meteor.Collection('projects');
Employees = new Meteor.Collection('employees');
if (Meteor.isClient) {
 	Session.setDefault('appName', 'Project Manager');
	Session.setDefault('showProjectDialog', false);
	Session.setDefault('showAddEmployee', false);
	Session.setDefault('editing_project', null);
	Session.setDefault('editing_employee', null);
 Meteor.Router.add({
 	'/':'homepage',
	'/projects':'projects',
	'/employees':'employees'
 })
Handlebars.registerHelper("formatDate", function(datetime) {
	  if (moment) {
	    return moment(datetime).format("MM/DD/YYYY");
	  }
	  else {
	    return datetime;
	  }
	});
Template.employeeForm.employee = function(){
	if(Session.get('editing_employee')){
		return Employees.findOne({_id:Session.get('editing_employee')});
	}
}
Template.projectForm.employees = function(){
	return Employees.find();
}
Template.employeeRow.events({
	'dblclick .employeeRow':function(evt,tmpl){
		Session.set('editing_employee',tmpl.data._id);
		Session.set('showAddEmployee',true);
	}
})
Template.menu.appName = function(){
	return Session.get('appName');
}
Template.projects.projectList = function(){
	return Projects.find();
}
Template.employees.employeeList = function(){
	return Employees.find();
}
Template.projectForm.events({
	'click .save':function(evt,tmpl){
		var name = tmpl.find('.name').value;
		var client = tmpl.find('.client').value;
		var status = tmpl.find('.status').value;
		var owner = tmpl.find('.owner').value;
		var datedue = tmpl.find('.datedue').value;
		if(Session.get('editing_project')){
			updateProject(name,client,status,owner,datedue);
		} else{
			addProject(name,client,status,owner,datedue);	
		}
		Session.set('showProjectDialog',false);
		Session.set('editing_project',null);
	},
	'click .cancel':function(evt,tmpl){
		Session.set('showProjectDialog',false);
		Session.set('editing_project',null);
	},
	'click .remove':function(evt,tmpl){
		removeProject();	
		Session.set('showProjectDialog',false);
		Session.set('editing_project',null);
	}
})
Template.employeeForm.events({
	'click .save':function(evt,tmpl){
		var name = tmpl.find('.name').value;
		if(Session.get('editing_employee')){
			updateEmployee(Session.get('editing_employee'),name);
		} else{
			addEmployee(name);
		}
		Session.set('showAddEmployee',false);
	},
	'click .cancel':function(evt,tmpl){
		Session.set('showAddEmployee',false);
	}
})
Template.projects.events({
	'click .addProject':function(evt,tmpl){
		Session.set('showProjectDialog',true);
	}
})
Template.projectForm.rendered = function(){
	var project = Projects.findOne({_id:Session.get('editing_project')});
	if(project.status)
	$('.status').val(project.status);
}
Template.projectRow.events({
	'dblclick .projectRow':function(evt,tmpl){
		Session.set('editing_project',tmpl.data._id);
		Session.set('showProjectDialog',true);
	}
})
Template.projectForm.project = function(){
	return Projects.findOne({_id:Session.get('editing_project')});
}
Template.projectForm.editing_project = function(){
	return Session.get('editing_project');
}
Template.projects.showProjectDialog = function(){
	return Session.get('showProjectDialog');
}
Template.projects.editing_project = function(){
	return Session.get('editing_project');
}
Template.employees.editing_employee = function(){
	return Session.get('editing_employee');
}
Template.employees.showAddEmployee = function(){
	return Session.get('showAddEmployee');
}
Template.employees.events({
	'click .addEmployee':function(evt,tmpl){
		Session.set('showAddEmployee',true);
	}
})
var addProject = function(name,client,status,ownerid,datedue){
	if(ownerid){
		owner = Employees.findOne({_id:ownerid});
	} else{
		owner = null;
	}
	Projects.insert({name:name,client:client,status:status,owner:owner,datedue:datedue});
}
var updateProject = function(name,client,status,ownerid,datedue){
	if(ownerid){
		owner = Employees.findOne({_id:ownerid});
	} else{
		owner = null;
	}
	Projects.update(Session.get('editing_project'), {$set: {name:name,client:client,status:status,owner:owner,datedue:datedue}});
	return true;
}
var removeProject = function(){
	Projects.remove({_id:Session.get('editing_project')});
}
var addEmployee = function(name){
	Employees.insert({name:name});
	return true;
}
var updateEmployee = function(id,name){
	Employees.update(id, {$set: {name:name}});
	return true;
}
}

