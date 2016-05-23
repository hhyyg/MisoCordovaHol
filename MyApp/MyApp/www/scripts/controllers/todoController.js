(function () {
    'use strict';

    //myapp.controllers モジュールは ionic モジュールに依存する(ionicModal等使うため)
    angular.module("myapp.controllers", ['ionic'])
        .controller('TodoController', ['$scope', '$timeout', '$ionicModal', 'projectService', '$ionicSideMenuDelegate', TodoController]);
        
    function TodoController($scope, $timeout, $ionicModal, projectService, $ionicSideMenuDelegate) {
        var _self = this;
        this.ionicModal = $ionicModal;
        this.projectService = projectService;
        this.ionicSideMenuDelegate = $ionicSideMenuDelegate;

        this.projects = this.projectService.all();
        this.activeProject = this.projects[this.projectService.getLastActiveIndex()];
        if (this.activeProject) {
            this.tasks = this.projectService.getTasks(this.activeProject.id);
        }
        this.detailsTask = null;
        
        // Create our modal
        $ionicModal.fromTemplateUrl('new-task.html', function (modal) {
            _self.taskModal = modal;
        }, {
            scope: $scope
        });

        $ionicModal.fromTemplateUrl('details.html', function (modal) {
            _self.editTaskModal = modal;
        }, {
            scope: $scope
        });
    }
    
    // A utility function for creating a new project
    // with the given projectTitle
    TodoController.prototype.createProject = function (projectTitle) {
        var newProject = this.projectService.newProject(projectTitle);
        this.projects.push(newProject);
        this.selectProject(newProject, this.projects.length - 1);
    }
       
    // Called to create a new project
    TodoController.prototype.newProject = function () {
        var projectTitle = prompt('Project name');
        if (projectTitle) {
            this.createProject(projectTitle);
        }
    };

    // Called to select the given project
    TodoController.prototype.selectProject = function (project, index) {
        this.activeProject = project;
        this.projectService.setLastActiveIndex(index);
        this.tasks = this.projectService.getTasks(project.id);
        this.ionicSideMenuDelegate.toggleLeft(false);
    };
    
    TodoController.prototype.createTask = function (task) {
        if (!this.activeProject || !task) {
            return;
        }

        var addTask = this.projectService.newTask(this.activeProject, task);
        this.tasks.push(addTask);

        this.taskModal.hide();

        // Inefficient, but save all the projects
        //this.projectService.save(this.projects);

        task.title = "";
    };

    TodoController.prototype.doneTask = function (task) {
        if (!this.activeProject || !task) {
            return;
        }
        //task.done = !task.done;
        this.projectService.updateTask(task);
    }

    TodoController.prototype.startEditTask = function (task) {
        this.detailsTask = task;
        this.editTaskModal.show();
    }

    TodoController.prototype.closeEditTask = function () {
        this.detailsTask = null;
        this.editTaskModal.hide();
    }

    TodoController.prototype.newTask = function () {
        this.taskModal.show();
    };

    TodoController.prototype.closeNewTask = function () {
        this.taskModal.hide();
    }

    TodoController.prototype.toggleProjects = function () {
        this.ionicSideMenuDelegate.toggleLeft();
    };


    // Try to create the first project, make sure to defer
    // this by using $timeout so everything is initialized
    // properly
    /*
    this.timeout(function () {
        if (this.projects.length == 0) {
            while (true) {
                var projectTitle = prompt('Your first project title:');
                if (projectTitle) {
                    this.createProject(projectTitle);
                    break;
                }
            }
        }
    }, 1000);
    */

})();