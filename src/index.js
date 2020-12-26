import {
  factoryTask as Task,
  factoryProject as Project,
  USER_MODULE as User,
} from './data-logic.js';

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

User.addProject(project1);
User.addProject(project2);
User.addProject(project3);
*/

console.log(User.getProjects());
