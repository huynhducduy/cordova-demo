rowId = 0;

document.querySelector("button#addTaskBtn").addEventListener("click", addTask);

document
  .querySelector("button#removeTaskBtn")
  .addEventListener("click", removeTask);

function addTask() {
  var task = prompt("Task", "");
  if (task) {
    addTableRow(
      {
        check: 0,
        text: task
      },
      false
    );
  }
}

function removeTask() {}

function checkTask() {}

function saveTask() {}

function deleteTask() {}

function addTableRow(task, appIsLoading) {
  rowId += 1;
  var table = document.getElementById("taskTable");
  var rowCount = table.rows.length;
  var row = table.insertRow(rowCount);

  var cell1 = row.insertCell(0);
  var elm1 = document.createElement("input");
  elm1.type = "checkbox";
  elm1.name = "task[]";
  elm1.addEventListener("click", checkTask);
  cell1.appendChild(elm1);

  var cell2 = row.insertCell(1);
  var elm2 = document.createElement("input");
  elm2.type = "text";
  elm2.name = "taskText[]";
  elm2.id = "text" + rowId;
  elm2.value = task.text;
  elm2.addEventListener("change", saveTask);
  cell2.appendChild(elm2);

  var cell3 = row.insertCell(2);
  var elm3 = document.createElement("input");
  elm3.type = "button";
  elm3.id = rowId;
  elm3.value = "Delete";
  elm3.addEventListener("click", deleteTask);
  cell3.appendChild(elm3);

  alert("Task added!");
}
