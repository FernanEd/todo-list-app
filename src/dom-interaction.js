import { ICON } from './icons.js';

import {
  factoryTask as Task,
  factoryProject as Project,
  USER_MODULE as USER,
} from './data-logic.js';

import { factoryFormElement as Form, launchForm } from './form-components.js';

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
  editProjectForm: {},
  deleteProjectForm: {},
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

  let currentProject = USER.getProjects()[0];

  const getCurrentProject = () => {
    return currentProject;
  };

  const displayProjects = () => {
    //Wipe anything before the function call
    _projectWrapper.innerHTML = '';

    let projects = USER.getProjects();

    if (projects.length === 0) {
      _projectWrapper.innerText = 'You have no projects.';
    }

    projects.forEach((project) => {
      let projectItem = factoryProjectElement(project.getObjLiteral());
      _projectWrapper.appendChild(projectItem);
    });
  };

  const selectProject = (index) => {
    let project = Array.from(_projectWrapper.childNodes)[index];
    project.classList.add('project-item-selected');

    currentProject = USER.getProjects()[index];
    displayTasks(currentProject.getTasks());
  };

  const displayTasks = (tasks) => {
    //Wipe anything before the function call
    _tasksWrapper.innerHTML = '';

    if (tasks.length === 0) {
      _tasksWrapper.innerText = 'No tasks to show.';
    }

    tasks.forEach((task) => {
      let taskItem = factoryTaskElement(task.getObjLiteral());
      _tasksWrapper.appendChild(taskItem);
    });
  };

  function factoryProjectElement({ name, tasks }) {
    let projectElement = document.createElement('div');
    projectElement.classList.add('project-item');

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
      displayProject(projectElement);
    });

    editBtn.addEventListener('click', (e) => {
      editProject(projectElement);
    });

    deleteBtn.addEventListener('click', (e) => {
      deleteProject(projectElement);
    });

    return projectElement;
  }

  const displayProject = (projectElement) => {
    console.log('yes');
  };

  const editProject = (projectElement) => {
    console.log('maybe');
  };

  const deleteProject = (projectElement) => {
    console.log('no');
  };

  function factoryTaskElement({ desc, priority, duedate, done }) {
    let taskElement = document.createElement('div');
    taskElement.classList.add('list-item');

    // HEADER
    let headerElement = document.createElement('div');
    headerElement.classList.add('list-item-header');

    let infoElement = document.createElement('div');
    infoElement.classList.add('list-item-info');

    let duedateElement = document.createElement('p');
    duedateElement.classList.add('list-item-duedate', 'text-secondary');
    duedateElement.innerText = duedate;

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
    console.log('done');
  };

  const editTask = (taskElement) => {
    launchForm(FORMS.editTaskForm, (formElement) => {
      let project = DOM_DISPLAY.getCurrentProject();
      let projectIndex = USER.getProjects().indexOf(project);

      let taskArr = [..._tasksWrapper.children];
      let taskIndex = taskArr.indexOf(taskElement);

      let currentTask = project.getTasks()[taskIndex];

      currentTask.editTask(
        formElement.querySelector('#desc').value,
        formElement.querySelector('#priority').value,
        formElement.querySelector('#date').value
      );

      //Update display
      USER.updateData();
      DOM_DISPLAY.displayProjects();
      DOM_DISPLAY.selectProject(projectIndex);
    });
  };

  const deleteTask = (taskElement) => {
    launchForm(FORMS.deleteTaskForm, (formElement) => {
      let project = DOM_DISPLAY.getCurrentProject();
      let projectIndex = USER.getProjects().indexOf(project);

      let taskArr = [..._tasksWrapper.children];
      let taskIndex = taskArr.indexOf(taskElement);

      project.removeTaskAtIndex(taskIndex);

      //Update display
      USER.updateData();
      DOM_DISPLAY.displayProjects();
      DOM_DISPLAY.selectProject(projectIndex);
    });
  };

  return { getCurrentProject, displayProjects, selectProject };
})();

// ADD PROJECT BTN
(() => {
  let addProjectBtn = document.querySelector('#project-add-btn');

  addProjectBtn.addEventListener('click', (e) => {
    launchForm(FORMS.addProjectForm, (formElement) => {
      /*
      let newTask = new Task(
        formElement.querySelector('#desc').value,
        formElement.querySelector('#priority').value,
        formElement.querySelector('#date').value
      );

      let project = DOM_DISPLAY.getCurrentProject();
      let projectIndex = USER.getProjects().indexOf(project);

      project.addTask(newTask);
*/

      let newProject = new Project(formElement.querySelector('#name').value);
      USER.addProject(newProject);

      //Get index of new project
      let projectIndex = USER.getProjects().indexOf(newProject);

      //Update display
      USER.updateData();
      DOM_DISPLAY.displayProjects();
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
      let projectIndex = USER.getProjects().indexOf(project);

      project.addTask(newTask);

      //Update display
      USER.updateData();
      DOM_DISPLAY.displayProjects();
      DOM_DISPLAY.selectProject(projectIndex);
    });
  });
})();

// DISPLAY TABS

(() => {
  const TABS = document.querySelectorAll('.link-nav-item');

  TABS.forEach((tabs) => {
    tabs.addEventListener('click', (e) => {
      console.log(tabs.innerText);
      console.log([...TABS].indexOf(tabs));
    });
  });
  return;
})();

export { DOM_DISPLAY };
