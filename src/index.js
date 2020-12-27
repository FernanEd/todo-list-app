import { DOM_DISPLAY as DOM } from './dom-interaction.js';

import {
  factoryTask as Task,
  factoryProject as Project,
  USER_MODULE as USER,
} from './data-logic.js';

DOM.updateDisplay();

//Make the menu work for Mobiles

(() => {
  let menuBtn = document.querySelector('#project-mini-menu-btn');
  let returnBtn = document.querySelector('#project-return-btn ');

  let projectMini = document.querySelector('#project-mini');
  let projectSection = document.querySelector('#project-main');
  let listSection = document.querySelector('#list-main');

  menuBtn.addEventListener('click', (e) => {
    projectMini.style.display = 'none';
    listSection.style.display = 'none';

    projectSection.style.display = 'initial';
  });

  returnBtn.addEventListener('click', (e) => {
    projectMini.style.display = 'initial';
    listSection.style.display = 'initial';

    projectSection.style.display = 'none';
  });
})();

/*
let project1 = new Project('first');
let task1 = new Task('test0', '0', 'today');
let task2 = new Task('test1', '1', 'yesterday');
let task3 = new Task('test2', '2', 'tomorrow');
let task4 = new Task('test3', '3', 'sunday');
project1.addTask(task1);
project1.addTask(task2);
project1.addTask(task3);
project1.addTask(task4);
USER.addProject(project1);

let project2 = new Project('second');
let newtask2 = new Task('maybe', 'no', 'tomorrow', true);
project2.addTask(newtask2);
USER.addProject(project2);

let project3 = new Project('third');
let newtask3 = new Task('also', 'yes', 'today');
project3.addTask(newtask3);
USER.addProject(project3);

console.log(USER.getProjects());
*/

/*
document.addEventListener('click', (e) => {
  console.log(USER.getProjects());
  console.log(DOM.getCurrentProject().getObjLiteral());
});
*/
