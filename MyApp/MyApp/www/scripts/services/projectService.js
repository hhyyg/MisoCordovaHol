(function () {
    'use strict';

    angular.module('myapp.services').service('projectService', ['guidGenerator', ProjectService]);

    function ProjectService(guidGenerator) {
        var _self = this;
        this.guidGenerator = guidGenerator;

        _self.getAllTask = _getAllTask;
        _self.addTask = _addTask;
        _self.saveAllTask = _saveAllTask;
        _self.getAllProject = _getAllTask;
        _self.addProject = _addProject;
        _self.saveAllProject = _saveAllProject;
    }

    function _getAllTask() {

        var taskString = window.localStorage['tasks'];
        if (taskString) {
            return angular.fromJson(taskString);
        }
        return [];
    }

    function _addTask(newTask) {

        var tasks = _getAllTask();
        tasks.push(newTask);
        window.localStorage['tasks'] = angular.toJson(tasks);
    }

    function _saveAllTask(allTask) {
        window.localStorage['tasks'] = angular.toJson(allTask);

    }

    function _getAllProject() {

        var projectString = window.localStorage['projects'];
        if (projectString) {
            return angular.fromJson(projectString);
        }
        return [];

    }

    function _addProject(newProject) {
        var projects = _getAllProject();
        projects.push(newProject);
        window.localStorage['projects'] = angular.toJson(projects);
    }

    function _saveAllProject(allProject) {
        window.localStorage['projects'] = angular.toJson(allProject);
    }

    ProjectService.prototype.all = function () {
        return _getAllProject();
    };
    
    ProjectService.prototype.save = function (projects) {
        _saveAllProject(projects);
    };

    ProjectService.prototype.newProject = function (projectTitle) {
        var newProject = {
            id: this.guidGenerator.get(),
            title: projectTitle,
            tasks: []
        };

        _addProject(newProject);

        return newProject;
    };

    ProjectService.prototype.getTasks = function (projectId) {
        var allTask = _getAllTask();
        return allTask.filter(function (element, index, array) {
            return (element.projectId == projectId);
        });
    }

    ProjectService.prototype.getTask = function (taskId) {
        var allTasks = _getAllTask();
        return allTasks.find(function (element, index, array) {
            return (element.id == taskId);
        });
    }

    ProjectService.prototype.newTask = function (project, task) {
        var newTask = {
            id: this.guidGenerator.get(),
            projectId: project.id,
            title: task.title,
            done: false
        };

        _addTask(newTask);

        return newTask;
    }

    ProjectService.prototype.updateTask = function (task) {

        var allTask = _getAllTask();

        for (var i = 0; i < allTask.length; i++) {
            if (allTask[i].id === task.id) {
                allTask[i] = task;
                break;
            }
        }

        _saveAllTask(allTask);
    };
    
    ProjectService.prototype.getLastActiveIndex = function () {
        return parseInt(window.localStorage['lastActiveProject']) || 0;
    };

    ProjectService.prototype.setLastActiveIndex = function (index) {
        window.localStorage['lastActiveProject'] = index;
    }

})();