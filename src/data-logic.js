const USER_MODULE = (() => {
  const USER_DATA = rebuildData() || [];

  function rebuildData() {
    let literalData = JSON.parse(localStorage.getItem('user_data'));
    if (!literalData) return null;

    let newData = [];

    for (let project of literalData) {
      //Make an array to hold the new Task objects
      let tasks = [];

      // Populate the array
      for (let task of project.tasks) {
        tasks.push(
          new factoryTask(task.desc, task.priority, task.duedate, task.done)
        );
      }

      //Override project
      project = new factoryProject(project.name);

      //Add tasks to new project obj
      for (let task of tasks) {
        project.addTask(task);
      }

      //Add the full project obj
      newData.push(project);
    }

    return newData;
  }

  const parseData = () => {
    return getProjects().map((project) => project.getObjLiteral());
  };

  const updateData = () => {
    localStorage.setItem('user_data', JSON.stringify(parseData()));
  };

  const addProject = (project) => {
    USER_DATA.push(project);
    //Update
    updateData();
  };

  const removeProject = (project) => {
    USER_DATA.splice(indexOf(project), 1);
    //Update
    updateData();
  };

  const getProjects = () => {
    return [...USER_DATA];
  };

  return { updateData, addProject, removeProject, getProjects };
})();

function factoryProject(name) {
  let projectName = name;
  let tasks = [];

  const getObjLiteral = () => {
    return { name, tasks: tasks.map((task) => task.getObjLiteral()) };
  };

  const getName = () => {
    return projectName;
  };

  const addTask = (task) => {
    tasks.push(task);
    //Update
    //USER_MODULE.updateData();
  };

  const removeTask = (task) => {
    tasks.splice(tasks.indexOf(task), 1);
    //Update
    //USER_MODULE.updateData();
  };

  const removeTaskAtIndex = (index) => {
    tasks.splice(index, 1);
  };

  const getTasks = () => {
    return tasks;
  };

  return {
    getObjLiteral,
    getName,
    addTask,
    removeTask,
    removeTaskAtIndex,
    getTasks,
  };
}

function factoryTask(desc, priority, duedate, done = false) {
  let taskDesc = desc;
  let taskPriority = priority;
  let taskDueDate = duedate;
  let taskIsDone = done;

  const getObjLiteral = () => {
    return { desc, priority, duedate, done };
  };

  const isDone = () => {
    return taskIsDone;
  };

  const markAsDone = () => {
    taskIsDone = true;
  };

  const editTask = (newDesc, newPriority, newDueDate) => {
    taskDesc = newDesc;
    taskPriority = newPriority;
    taskDueDate = newDueDate;
  };

  return { getObjLiteral, isDone, markAsDone, editTask };
}

export { USER_MODULE, factoryProject, factoryTask };
