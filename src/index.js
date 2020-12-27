import {
  factoryTask as Task,
  factoryProject as Project,
  USER_MODULE as USER,
} from './data-logic.js';

import { factoryFormElement as Form, launchForm } from './form-components.js';

import { ICON } from './icons.js';

/*
let project1 = new Project('first');
let task1 = new Task('yes', 'no', 'tomorrow');
project1.addTask(task1);


let project2 = new Project('second');
let task2 = new Task('maybe', 'no', 'tomorrow', true);
project2.addTask(task2);

let project3 = new Project('third');
let task3 = new Task('also', 'yes', 'today');
project3.addTask(task3);

USER.addProject(project1);
USER.addProject(project2);
USER.addProject(project3);
*/

console.log(USER.getProjects());

// FORMS AND DATA HANDLING

const addForm = new Form(
  'Add new Task',
  {
    name: 'Description',
    type: 'textarea',
    required: true,
  },
  {
    name: 'Due date',
    type: 'date',
    required: true,
  },
  {
    name: 'Priority (0 low - 3 max)',
    type: 'number',
    required: true,
    minrange: 0,
    maxrange: 3,
  }
);

(() => {
  let addTaskBtn = document.querySelector('#list-add-btn');

  addTaskBtn.addEventListener('click', (e) => {
    launchForm(addForm, () => {
      console.log('yes');
    });
  });
})();

const DOM_DISPLAY = (() => {
  const _projectWrapper = document.querySelector('#project-wrapper');
  const _tasksWrapper = document.querySelector('#list-wrapper');

  let currentProject = USER.getProjects()[0];

  const displayProjects = () => {
    //Wipe anything before the function call
    _projectWrapper.innerHTML = '';

    let projects = USER.getProjects();

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

    tasks.forEach((task) => {
      let taskItem = factoryTaskElement(task.getObjLiteral());
      _tasksWrapper.appendChild(taskItem);
    });
  };

  const factoryTaskElement = ({ desc, priority, duedate, done }) => {
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
    priorityElement.innerText = priority;

    infoElement.append(duedateElement);
    infoElement.append(priorityElement);

    let controllersElement = document.createElement('div');
    controllersElement.classList.add('list-item-controllers');

    let doneBtn = document.createElement('button');
    doneBtn.classList.add('btn', 'btn-primary', 'btn-circle');
    doneBtn.innerHTML = ICON.ribbonCheckmark;

    let editBtn = document.createElement('button');
    editBtn.classList.add('btn-edit', 'btn', 'btn-secondary', 'btn-circle');
    editBtn.innerHTML = ICON.pencil;

    let deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn-delete', 'btn', 'btn-secondary', 'btn-circle');
    deleteBtn.innerHTML = ICON.trashcan;

    controllersElement.append(doneBtn);
    controllersElement.append(editBtn);
    controllersElement.append(deleteBtn);

    headerElement.append(infoElement);
    headerElement.append(controllersElement);

    // BODY
    let bodyElement = document.createElement('div');
    bodyElement.classList.add('list-item-body');

    let descElement = document.createElement('p');
    descElement.classList.add('list-item-desc');
    descElement.innerText = desc;

    bodyElement.append(descElement);

    taskElement.append(headerElement);
    taskElement.append(bodyElement);

    return taskElement;
  };

  const factoryProjectElement = ({ name, tasks }) => {
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

    return projectElement;
  };

  return { displayProjects, selectProject };
})();

DOM_DISPLAY.displayProjects();
DOM_DISPLAY.selectProject(0);
