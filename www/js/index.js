rowId = 0;

document.querySelector("button#addTaskBtn").addEventListener("click", addTask);

document
  .querySelector("button#removeTaskBtn")
  .addEventListener("click", removeTask);

function addTask() {
  var task = prompt("Task", "");
  if (task) {
    addTableRow({
      check: 0,
      text: task
    });
  }
}

function removeTask() {
  var table = document.getElementById("taskTable");
  var rowCount = table.rows.length;

  for (var i = 0; i < rowCount; i++) {
    var row = table.rows[i];
    var check = row.cells[0].childNodes[0];
    if (check != null && check.checked) {
      table.deleteRow(i);
      rowCount--;
      i--;
    }
  }

  save();
}

function checkTask() {
  var table = document.getElementById("taskTable");
  var rowCount = table.rows.length;

  for (var i = 0; i < rowCount; i++) {
    var row = table.rows[i];
    var check = row.cells[0].childNodes[0];
    var text = row.cells[1].childNodes[0];

    if (check != null && check.checked) {
      text.style.setProperty("text-decoration", "line-through");
    } else {
      text.style.setProperty("text-decoration", "none");
    }
  }

  save();
}

function deleteTask(e) {
  var p = e.srcElement.parentNode.parentNode;
  p.parentNode.removeChild(p);
  save();
}

function save() {
  var tasks = {};
  var checkValue = 0;

  var table = document.getElementById("taskTable");
  var rowCount = table.rows.length;

  if (rowCount > 0) {
    for (var i = 0; i < rowCount; i++) {
      var row = table.rows[i];

      var check = row.cells[0].childNodes[0];

      if (check != null && check.checked) {
        checkValue = 1;
      } else {
        checkValue = 0;
      }

      tasks["row" + i] = {
        check: checkValue,
        text: row.cells[1].childNodes[0].value
      };
    }
  }

  // Using LocalStorage

  // window.localStorage.setItem("tasks", JSON.stringify(tasks));

  // Using WebSQL
  var db = window.openDatabase(
    "todo.app",
    "1.0",
    "Cordova Demo with simple ToDo App",
    5 * 1024 * 1024
  );

  db.transaction(function(t) {
    t.executeSql(
      "DELETE FROM todo",
      [],
      function() {},
      function(_, e) {
        console.log("There has been an error: " + e.message);
      }
    );
  });

  db.transaction(function(t) {
    for (var task of Object.values(tasks)) {
      t.executeSql(
        "INSERT INTO todo(`check`, text) VALUES (?,?)",
        [task.check, task.text],
        function() {},
        function(_, e) {
          console.log("There has been an error: " + e.message);
        }
      );
    }
  });
}

function load() {
  // Using localStorage
  // var toLoad = JSON.parse(localStorage.getItem("tasks", null));
  // if (toLoad) {
  //   var count = 0;
  //   for (var obj in toLoad) {
  //     count++;
  //   }
  //   for (var i = 0; i < count; i++) {
  //     addTableRow(toLoad["row" + i]);
  //   }
  // }
  // Using WebSQL
  var db = window.openDatabase(
    "todo.app",
    "1.0",
    "Cordova Demo with simple ToDo App",
    5 * 1024 * 1024
  );
  db.transaction(function(t) {
    t.executeSql(
      "CREATE TABLE IF NOT EXISTS todo(`check` INTEGER, text TEXT)",
      [],
      function() {},
      function(tx, e) {
        console.log("There has been an error: " + e.message);
      }
    );
  });
  db.transaction(function(t) {
    t.executeSql(
      "SELECT * FROM todo",
      [],
      function(_, results) {
        console.log(results);
        for (var i = 0; i < results.rows.length; i++) {
          console.log(results.rows[i]);
          addTableRow(results.rows[i]);
        }
      },
      function(_, e) {
        console.log("There has been an error: " + e.message);
      }
    );
  });
}

function addTableRow(task) {
  rowId += 1;
  var table = document.getElementById("taskTable");
  var rowCount = table.rows.length;
  var row = table.insertRow(rowCount);

  var cell1 = row.insertCell(0);
  var elm1 = document.createElement("input");
  elm1.type = "checkbox";
  elm1.name = "task[]";
  elm1.checked = task.check == 1;
  elm1.addEventListener("click", checkTask);
  cell1.appendChild(elm1);

  var cell2 = row.insertCell(1);
  var elm2 = document.createElement("input");
  elm2.type = "text";
  elm2.name = "taskText[]";
  elm2.id = "text" + rowId;
  elm2.value = task.text;
  if (task.check == 1)
    elm2.style.setProperty("text-decoration", "line-through");
  elm2.addEventListener("change", save);
  cell2.appendChild(elm2);

  var cell3 = row.insertCell(2);
  var elm3 = document.createElement("input");
  elm3.type = "button";
  elm3.id = rowId;
  elm3.value = "Delete";
  elm3.addEventListener("click", deleteTask);
  cell3.appendChild(elm3);

  save();
}

document.addEventListener("deviceready", load, false);

// Screen orientation API

// document.addEventListener("deviceready", function() {
//   screen.orientation.lock("landscape-primary");
// });

// // window.addEventListener("orientationchange", function() {
// screen.orientation.onchange = function() {
//   alert("Orientation changed: " + screen.orientation.type);
// };
// // });
