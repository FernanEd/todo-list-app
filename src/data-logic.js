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

  const removeProjectAtIndex = (index) => {
    USER_DATA.splice(index, 1);
    //Update
    updateData();
  };

  const getProjects = () => {
    return [...USER_DATA];
  };

  return {
    updateData,
    addProject,
    removeProject,
    removeProjectAtIndex,
    getProjects,
  };
})();

function factoryProject(name) {
  let projectName = name;
  let tasks = [];

  const getObjLiteral = () => {
    return {
      name: projectName,
      tasks: tasks.map((task) => task.getObjLiteral()),
    };
  };

  const getName = () => {
    return projectName;
  };

  const addTask = (task) => {
    task.setIndex(tasks.length);
    tasks.push(task);
  };

  const removeTask = (task) => {
    tasks.splice(tasks.indexOf(task), 1);
  };

  const removeTaskAtIndex = (index) => {
    tasks.splice(index, 1);
  };

  const getTasks = () => {
    return tasks;
  };

  const editProject = (newName) => {
    projectName = newName;
  };

  return {
    getObjLiteral,
    getName,
    addTask,
    removeTask,
    removeTaskAtIndex,
    getTasks,
    editProject,
  };
}

function factoryTask(desc, priority, duedate, done = false) {
  let taskIndex = -1;
  let taskDesc = desc;
  let taskPriority = priority;
  let taskDueDate = duedate;
  let taskIsDone = done;

  const getObjLiteral = () => {
    return {
      index: taskIndex,
      desc: taskDesc,
      priority: taskPriority,
      duedate: taskDueDate,
      done: taskIsDone,
    };
  };

  const isDone = () => {
    return taskIsDone;
  };

  const setDone = (bool) => {
    taskIsDone = bool;
  };

  const editTask = (newDesc, newPriority, newDueDate) => {
    taskDesc = newDesc;
    taskPriority = newPriority;
    taskDueDate = newDueDate;
  };

  const setIndex = (index) => {
    taskIndex = index;
  };

  return { getObjLiteral, isDone, setDone, editTask, setIndex };
}

export { USER_MODULE, factoryProject, factoryTask };
