import { ICON } from './icons.js';

import {
  factoryTask as Task,
  factoryProject as Project,
  USER_MODULE as USER,
} from './data-logic.js';

import { factoryFormElement as Form, launchForm } from './form-components.js';

import { format, compareAsc, parse, differenceInMinutes } from 'date-fns';

const FORMS = {
  addProjectForm: {
    title: 'New Project',
    fields: [
      {
        id: 'name',
        name: 'Project name',
        type: 'text',
        required: true,
      },
    ],
    button: 'Create project',
  },
  editProjectForm: {
    title: 'Edit Project',
    fields: [
      {
        id: 'name',
        name: 'Project name',
        type: 'text',
        required: true,
      },
    ],
    button: 'Update project',
  },
  deleteProjectForm: {
    title: 'Are you sure you want to delete this project?',
    fields: [],
    button: 'Remove project',
  },
  addTaskForm: {
    title: 'Add new Task',
    fields: [
      {
        id: 'desc',
        name: 'Description',
        type: 'textarea',
        required: true,
      },
      {
        id: 'date',
        name: 'Due date',
        type: 'date',
        required: true,
        minrange: format(new Date(), 'yyyy-MM-dd'),
        maxrange: '9999-12-31',
      },
      {
        id: 'priority',
        name: 'Priority (0 low - 3 max)',
        type: 'number',
        required: true,
        minrange: 0,
        maxrange: 3,
      },
    ],
    button: 'Submit',
  },

  editTaskForm: {
    title: 'Edit Task',
    fields: [
      {
        id: 'desc',
        name: 'Description',
        type: 'textarea',
        required: true,
      },
      {
        id: 'date',
        name: 'Due date',
        type: 'date',
        required: true,
      },
      {
        id: 'priority',
        name: 'Priority (0 low - 3 max)',
        type: 'number',
        required: true,
        minrange: 0,
        maxrange: 3,
      },
    ],
    button: 'Update',
  },

  deleteTaskForm: {
    title: 'Delete this task?',
    fields: [],
    button: 'Remove',
  },
};

const DOM_DISPLAY = (() => {
  const _projectWrapper = document.querySelector('#project-wrapper');
  const _tasksWrapper = document.querySelector('#list-wrapper');

  let currentProject = undefined;
  const _mobileProjectTitle = document.querySelector('#project-mini-title');

  let currentFilter = 0; // 0 - Pending tasks | 1 - Close due dates | 2 - Top Priority |  3 - Done

  // For mobiles
  _mobileProjectTitle.innerText = getCurrentProject().getName();

  const setFilter = (filter) => {
    currentFilter = filter;
  };

  function getCurrentProject() {
    return currentProject || new Project(' No project ');
  }

  const displayProjects = () => {
    //Wipe anything before the function call
    _projectWrapper.innerHTML = '';

    let projects = USER.getProjects();

    if (projects.length === 0) {
      _projectWrapper.innerText = 'You have no projects.';
    }

    projects.forEach((project) => {
      let projectItem = factoryProjectElement(project.getObjLiteral());

      let projectIndex = projects.indexOf(project);
      let currentProjectIndex = USER.getProjects().indexOf(getCurrentProject());

      //If this is the current project-item, select it
      if (projectIndex === currentProjectIndex) {
        projectItem.classList.add('project-item-selected');
      }

      _projectWrapper.appendChild(projectItem);
    });
  };

  const selectProject = (index) => {
    updateDisplay();

    let project = Array.from(_projectWrapper.childNodes)[index];

    //If project doesn't exist. don't even bother (should return error thoe)
    if (!project) {
      currentProject = undefined;
    } else {
      currentProject = USER.getProjects()[index];
    }

    //Update mobile title
    _mobileProjectTitle.innerText = getCurrentProject().getName();

    updateDisplay();
  };

  const updateDisplay = () => {
    displayProjects();
    displayTasks(getCurrentProject().getTasks());
  };

  const displayTasks = (tasks) => {
    //Wipe anything before the function call
    _tasksWrapper.innerHTML = '';

    let filteredTasks = tasks;

    //Apply filter
    switch (currentFilter) {
      default:
      case 0:
        filteredTasks = tasks.filter((task) => !task.isDone());
        break;
      case 1:
        filteredTasks = [...tasks]
          .sort((a, b) => {
            //Get their diferences from today to the due date
            let aDiff = differenceInMinutes(
              parse(a.getObjLiteral().duedate, 'yyyy-MM-dd', new Date()),
              new Date()
            );
            let bDiff = differenceInMinutes(
              parse(b.getObjLiteral().duedate, 'yyyy-MM-dd', new Date()),
              new Date()
            );

            return aDiff > bDiff ? 1 : -1;
          })
          .filter((task) => !task.isDone());
        break;
      case 2:
        filteredTasks = [...tasks]
          .sort((a, b) =>
            a.getObjLiteral().priority < b.getObjLiteral().priority ? 1 : -1
          )
          .filter((task) => !task.isDone());
        break;
      case 3:
        filteredTasks = tasks.filter((task) => task.isDone());
        break;
    }

    if (filteredTasks.length === 0) {
      _tasksWrapper.innerText = 'No tasks to show.';
    }

    filteredTasks.forEach((task) => {
      let taskItem = factoryTaskElement(task.getObjLiteral());
      _tasksWrapper.appendChild(taskItem);
    });
  };

  function factoryProjectElement({ id, name, tasks }) {
    let projectElement = document.createElement('div');
    projectElement.classList.add('project-item');
    projectElement.setAttribute('data-id', id);

    let content = document.createElement('div');
    content.classList.add('project-item-content');

    // HEADER

    let header = document.createElement('div');
    header.classList.add('project-item-header');

    let icon = document.createElement('div');
    icon.classList.add('project-item-icon');
    icon.innerHTML = ICON.folder;

    let title = document.createElement('p');
    title.classList.add('project-item-title');
    title.innerText = name;

    header.append(icon);
    header.append(title);

    // BODY

    let desc = document.createElement('small');
    desc.classList.add('project-item-desc');
    desc.innerText =
      tasks.length > 1
        ? `(${tasks.length}) tasks on project.`
        : tasks.length > 0
        ? '(1) task on project.'
        : 'No tasks on project.';

    content.append(header);
    content.append(desc);

    let controls = document.createElement('div');
    controls.classList.add('project-item-controls');

    let editBtn = document.createElement('button');
    editBtn.classList.add('btn-edit', 'btn', 'btn-light', 'btn-circle');
    editBtn.innerHTML = ICON.pencil;

    let deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn-delete', 'btn', 'btn-light', 'btn-circle');
    deleteBtn.innerHTML = ICON.trashcan;

    controls.append(editBtn);
    controls.append(deleteBtn);

    projectElement.append(content);
    projectElement.append(controls);

    // ADD EVENT LISTENERS TO BUTTONS

    content.addEventListener('click', (e) => {
      displaySelectedProject(projectElement);
    });

    editBtn.addEventListener('click', (e) => {
      editProject(projectElement);
    });

    deleteBtn.addEventListener('click', (e) => {
      deleteProject(projectElement);
    });

    return projectElement;
  }

  const displaySelectedProject = (projectElement) => {
    let projectArr = [..._projectWrapper.children];
    let projectIndex = projectArr.indexOf(projectElement);
    selectProject(projectIndex);
  };

  const editProject = (projectElement) => {
    launchForm(FORMS.editProjectForm, (formElement) => {
      let projectID = projectElement.getAttribute('data-id');
      let projectIndex = USER.getProjectIndexFromProjectID(projectID);
      let project = USER.getProjects()[projectIndex];
      project.editProject(formElement.querySelector('#name').value);

      //Update display
      USER.updateData();
      DOM_DISPLAY.selectProject(projectIndex);
    });
  };

  const deleteProject = (projectElement) => {
    launchForm(FORMS.deleteProjectForm, (formElement) => {
      let projectID = projectElement.getAttribute('data-id');
      let projectIndex = USER.getProjectIndexFromProjectID(projectID);
      USER.removeProjectAtIndex(projectIndex);

      //Update display
      USER.updateData();
      DOM_DISPLAY.selectProject(-1);
    });
  };

  function factoryTaskElement({ id, desc, priority, duedate, done }) {
    let taskElement = document.createElement('div');
    taskElement.classList.add('list-item');
    taskElement.setAttribute('data-id', id);
    taskElement.setAttribute('data-done', done);

    if (done) {
      taskElement.classList.add('list-item-done');
    }

    // HEADER
    let headerElement = document.createElement('div');
    headerElement.classList.add('list-item-header');

    let infoElement = document.createElement('div');
    infoElement.classList.add('list-item-info');

    let duedateElement = document.createElement('p');
    duedateElement.classList.add('list-item-duedate', 'text-secondary');
    duedateElement.innerText = `Due date: ${duedate}`;

    let priorityElement = document.createElement('p');
    priorityElement.classList.add('list-item-priority', 'text-primary');
    priorityElement.innerText =
      priority == 3
        ? 'Urgent'
        : priority == 2
        ? 'Important'
        : priority == 1
        ? 'Should Do'
        : 'Optional';

    infoElement.append(duedateElement);
    infoElement.append(priorityElement);

    let controlsElement = document.createElement('div');
    controlsElement.classList.add('list-item-controls');

    let doneBtn = document.createElement('button');
    doneBtn.classList.add('btn-done', 'btn', 'btn-primary', 'btn-circle');
    doneBtn.innerHTML = ICON.ribbonCheckmark;

    let editBtn = document.createElement('button');
    editBtn.classList.add('btn-edit', 'btn', 'btn-secondary', 'btn-circle');
    editBtn.innerHTML = ICON.pencil;

    let deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn-delete', 'btn', 'btn-secondary', 'btn-circle');
    deleteBtn.innerHTML = ICON.trashcan;

    controlsElement.append(doneBtn);
    controlsElement.append(editBtn);
    controlsElement.append(deleteBtn);

    headerElement.append(infoElement);
    headerElement.append(controlsElement);

    // BODY
    let bodyElement = document.createElement('div');
    bodyElement.classList.add('list-item-body');

    let descElement = document.createElement('p');
    descElement.classList.add('list-item-desc');
    descElement.innerText = desc;

    bodyElement.append(descElement);

    taskElement.append(headerElement);
    taskElement.append(bodyElement);

    // ADD EVENT LISTENERS TO BUTTONS

    doneBtn.addEventListener(
      'click',
      (e) => {
        markAsDone(taskElement);
      },
      { once: true }
    );
    editBtn.addEventListener('click', (e) => {
      editTask(taskElement);
    });
    deleteBtn.addEventListener('click', (e) => {
      deleteTask(taskElement);
    });

    return taskElement;
  }

  const markAsDone = (taskElement) => {
    let taskID = taskElement.getAttribute('data-id');
    let project = DOM_DISPLAY.getCurrentProject();
    let taskIndex = project.getTaskIndexFromTaskID(taskID);
    let currentTask = project.getTasks()[taskIndex];

    if (!currentTask.isDone()) currentTask.setDone(true);
    else currentTask.setDone(false);

    //Update display
    USER.updateData();
    DOM_DISPLAY.updateDisplay();
  };

  const editTask = (taskElement) => {
    launchForm(FORMS.editTaskForm, (formElement) => {
      let taskID = taskElement.getAttribute('data-id');
      let project = DOM_DISPLAY.getCurrentProject();
      let taskIndex = project.getTaskIndexFromTaskID(taskID);
      let currentTask = project.getTasks()[taskIndex];

      currentTask.editTask(
        formElement.querySelector('#desc').value,
        formElement.querySelector('#priority').value,
        formElement.querySelector('#date').value
      );

      //Update display
      USER.updateData();
      DOM_DISPLAY.updateDisplay();
    });
  };

  const deleteTask = (taskElement) => {
    launchForm(FORMS.deleteTaskForm, (formElement) => {
      let taskID = taskElement.getAttribute('data-id');
      let project = DOM_DISPLAY.getCurrentProject();
      let taskIndex = project.getTaskIndexFromTaskID(taskID);

      project.removeTaskAtIndex(taskIndex);

      //Update display
      USER.updateData();
      DOM_DISPLAY.updateDisplay();
    });
  };

  return {
    getCurrentProject,
    displayProjects,
    selectProject,
    updateDisplay,
    setFilter,
  };
})();

// ADD PROJECT BTN
(() => {
  let addProjectBtn = document.querySelector('#project-add-btn');

  addProjectBtn.addEventListener('click', (e) => {
    launchForm(FORMS.addProjectForm, (formElement) => {
      let newProject = new Project(formElement.querySelector('#name').value);
      USER.addProject(newProject);

      //Get index of new project
      let projectIndex = USER.getProjects().indexOf(newProject);

      //Update display
      USER.updateData();
      DOM_DISPLAY.selectProject(projectIndex);
    });
  });
})();

// ADD TASK BTN
(() => {
  let addTaskBtn = document.querySelector('#list-add-btn');

  addTaskBtn.addEventListener('click', (e) => {
    launchForm(FORMS.addTaskForm, (formElement) => {
      let newTask = new Task(
        formElement.querySelector('#desc').value,
        formElement.querySelector('#priority').value,
        formElement.querySelector('#date').value
      );

      let project = DOM_DISPLAY.getCurrentProject();
      project.addTask(newTask);

      USER.updateData();
      DOM_DISPLAY.updateDisplay();
    });
  });
})();

// DISPLAY TABS
(() => {
  const TABS = document.querySelectorAll('.link-nav-item');

  TABS.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      DOM_DISPLAY.setFilter([...TABS].indexOf(tab));
      DOM_DISPLAY.updateDisplay();

      deselectTabs(TABS);
      selectTab(tab);
    });
  });

  function selectTab(tab) {
    tab.classList.add('list-nav-item-selected');
  }

  function deselectTabs(tabs) {
    tabs.forEach((tab) => tab.classList.remove('list-nav-item-selected'));
  }
})();

export { DOM_DISPLAY };
