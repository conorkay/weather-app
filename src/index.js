import './style.css';
import { displayController, todoManager } from './todoFunctions';

// Element selectors
// Button that opens form for adding new task/project
const openFormBtn = document.getElementById('openFormBtn');
// New todo form
const newTodoForm = document.getElementById('newTodoForm');
// New project form
const newProjectForm = document.getElementById('newProjectForm');
// Edit todo form
const editForm = document.getElementById('editForm');
// Form x's
const todoCross = document.getElementById('todoCross');
const detailCross = document.getElementById('detailCross');
const editCross = document.getElementById('editCross');
// Form text fields
const inputFields = document.querySelectorAll('.textInput, .dateInput');
// Container for list of todo elements
const listContainer = document.getElementById('list-container');
// Dialog that contains the new item form
const newItemDialog = document.getElementById('newItemDialog');
// Dialog that displays details
const detailDialog = document.getElementById('detailDialog');
// Dialog that displays edit form
const editDialog = document.getElementById('editDialog');
// Button that displays create todo
const projectBtn = document.getElementById('newProjectBtn');
// Button that displays create project
const todoBtn = document.getElementById('newTodoBtn');
// Wrapper for the project form
const projectFormWrapper = document.getElementById('projectFormWrapper');
// Wrapper for the todo form
const todoFormWrapper = document.getElementById('todoFormWrapper');
// Button for 'home' project
const homeBtn = document.getElementById('homeBtn');
// Button for 'day' project
const dayBtn = document.getElementById('dayBtn');
// Button for 'week' project
const weekBtn = document.getElementById('weekBtn');
// Button for 'overdue' project
const overdueBtn = document.getElementById('overdueBtn');
// List that contains project buttons
const projectList = document.getElementById('projectList');

// Listener for the 'home' project button
homeBtn.addEventListener('click', function (e) {
  todoManager.setCurrentProject('home');
  displayController.removeSelected(projectList.childNodes);
  homeBtn.classList.toggle('selected');
  displayController.disableButton(homeBtn);
  displayController.enableButtonList(homeBtn, projectList.childNodes);
  todoManager.renderProjectList();
});

// Listener for the 'day' project button
dayBtn.addEventListener('click', function (e) {
  todoManager.setCurrentProject('today');
  displayController.removeSelected(projectList.childNodes);
  dayBtn.classList.toggle('selected');
  displayController.disableButton(dayBtn);
  displayController.enableButtonList(dayBtn, projectList.childNodes);
  todoManager.renderProjectList();
});

// Listener for the 'week' project button
weekBtn.addEventListener('click', function (e) {
  todoManager.setCurrentProject('thisweek');
  displayController.removeSelected(projectList.childNodes);
  weekBtn.classList.toggle('selected');
  displayController.disableButton(weekBtn);
  displayController.enableButtonList(weekBtn, projectList.childNodes);
  todoManager.renderProjectList();
});

// Listener for the 'overdue' button
overdueBtn.addEventListener('click', function (e) {
  todoManager.setCurrentProject('overdue');
  displayController.removeSelected(projectList.childNodes);
  overdueBtn.classList.toggle('selected');
  displayController.disableButton(overdueBtn);
  displayController.enableButtonList(overdueBtn, projectList.childNodes);
  todoManager.renderProjectList();
});

// Listener for the 'project' button, displays the project form in the dialog
projectBtn.addEventListener('click', function (e) {
  projectFormWrapper.style.display = 'flex';
  todoFormWrapper.style.display = 'none';
});

// Listener for the 'todo' button, displays the todo form in the dialog
todoBtn.addEventListener('click', function (e) {
  todoFormWrapper.style.display = 'flex';
  projectFormWrapper.style.display = 'none';
});

// Listener for the 'new task' button
openFormBtn.addEventListener('click', function (e) {
  todoFormWrapper.style.display = 'flex';
  projectFormWrapper.style.display = 'none';
  displayController.openDialog(newItemDialog);
});

// Apply listen to all 'cross' elements
todoCross.addEventListener('click', function () {
  displayController.closeDialog(todoCross.parentNode.parentNode);
  displayController.clearInput(inputFields);
});

detailCross.addEventListener('click', function () {
  displayController.closeDialog(detailCross.parentNode.parentNode);
  displayController.clearDetail();
});

editCross.addEventListener('click', function (e) {
  displayController.closeDialog(editCross.parentNode.parentNode);
  displayController.clearInput(inputFields);
});

// Listener for the 'create todo' button on the todo form
newTodoForm.addEventListener('submit', (event) => {
  event.preventDefault();

  let todoProject = todoManager.getCurrentProject();
  if (
    todoProject === 'day' ||
    todoProject === 'week' ||
    todoProject === 'overdue'
  ) {
    todoProject = 'home';
  }

  let newTodo = new todoManager.todo(
    event.currentTarget.title.value,
    event.currentTarget.details.value,
    event.currentTarget.date.value,
    event.currentTarget.priority.value,
    todoProject,
    false
  );

  console.log(newTodo);

  todoManager.createNewNode(newTodo);
  console.log(todoManager.getCurrentProject());
  todoManager.renderProjectList();

  displayController.closeDialog(newItemDialog);
  displayController.clearInput(inputFields);
});

// Listener for the 'create project' button on the project form
newProjectForm.addEventListener('submit', (event) => {
  console.log('click');
  event.preventDefault();

  let newProject = new todoManager.project(
    event.currentTarget.projectTitle.value
  );
  console.log(newProject);

  if (todoManager.checkProjectDupe(newProject)) {
    console.log(
      "'" +
        newProject.title +
        "' is already a project. Changing folder to '" +
        newProject.title +
        "'."
    );
    todoManager.setCurrentProject(
      newProject.title.toLowerCase().replace(/\s/g, '')
    );
    console.log(newProject.title);
    displayController.toggleSelectButton(newProject.title);
    todoManager.renderProjectList();
  } else {
    todoManager.createNewProjectNode(newProject);
    console.log('here');
    displayController.createProjectElem(newProject, false);
  }

  displayController.closeDialog(newItemDialog);
  displayController.clearInput(inputFields);
});

// Listener for the edit form
editForm.addEventListener('submit', (event) => {
  event.preventDefault();

  let todo = displayController.getEditTodo();
  let todoProject = todo.project;
  let checked = todo.checked;

  let newTodo = new todoManager.todo(
    event.currentTarget.editTitle.value,
    event.currentTarget.editDetails.value,
    event.currentTarget.editDate.value,
    event.currentTarget.priority.value,
    todoProject,
    checked
  );

  todoManager.deleteTodoNode(todo);
  todoManager.createNewNode(newTodo);
  todoManager.renderProjectList();

  displayController.closeDialog(editDialog);
  displayController.clearInput(inputFields);
});

// Checks local storage and retrieves lists if they exist
todoManager.checkStorage();

// On page exit, assign current lists to local storage
window.onbeforeunload = function () {
  console.log('unload');
  todoManager.populateStorage();
};
