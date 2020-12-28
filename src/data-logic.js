let lastID = Number(localStorage.getItem('last_id')) || 0;

function assignID() {
  let currentID = lastID;
  lastID++;
  localStorage.setItem('last_id', currentID);
  return currentID;
}

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

      //Add the full project obj AND asign it an ID
      project.setID(assignID());
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
    //Set ID on push
    project.setID(assignID());
    USER_DATA.push(project);
  };

  const removeProject = (project) => {
    USER_DATA.splice(indexOf(project), 1);
  };

  const removeProjectAtIndex = (index) => {
    USER_DATA.splice(index, 1);
  };

  const getProjects = () => {
    return [...USER_DATA];
  };

  const getProjectIndexFromProjectID = (id) => {
    //Check in the task array for the one the id matches
    let projectsIDArr = USER_DATA.map((project) => project.getObjLiteral().id);

    //Return index
    return projectsIDArr.indexOf(Number(id));
  };

  return {
    updateData,
    addProject,
    removeProject,
    removeProjectAtIndex,
    getProjects,
    getProjectIndexFromProjectID,
  };
})();

function factoryProject(name) {
  let projectID = -1;
  let projectName = name;
  let tasks = [];

  const getObjLiteral = () => {
    return {
      id: projectID,
      name: projectName,
      tasks: tasks.map((task) => task.getObjLiteral()),
    };
  };

  const getName = () => {
    return projectName;
  };

  const addTask = (task) => {
    task.setID(assignID());
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

  const getTaskIndexFromTaskID = (id) => {
    //Check in the task array for the one the id matches
    let tasksIDArr = tasks.map((task) => task.getObjLiteral().id);

    //Return index
    return tasksIDArr.indexOf(Number(id));
  };

  const setID = (ID) => {
    projectID = ID;
  };

  return {
    getObjLiteral,
    getName,
    addTask,
    removeTask,
    removeTaskAtIndex,
    getTasks,
    editProject,
    getTaskIndexFromTaskID,
    setID,
  };
}

function factoryTask(desc, priority, duedate, done = false) {
  let taskID = -1;
  let taskDesc = desc;
  let taskPriority = priority;
  let taskDueDate = duedate;
  let taskIsDone = done;

  const getObjLiteral = () => {
    return {
      id: taskID,
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

  const setID = (ID) => {
    taskID = ID;
  };

  return { getObjLiteral, isDone, setDone, editTask, setID };
}

export { USER_MODULE, factoryProject, factoryTask };
