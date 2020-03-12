// Get indexedDB ------------------------------------------------------------
// window.indexedDB =
//   window.indexedDB ||
//   window.mozIndexedDB ||
//   window.webkitIndexedDB ||
//   window.msIndexedDB;

// window.IDBTransaction =
//   window.IDBTransaction ||
//   window.webkitIDBTransaction ||
//   window.msIDBTransaction;
// window.IDBKeyRange =
//   window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

// var db;
// var request = window.indexedDB.open("todo", 1);

// request.onupgradeneeded = function(event) {
//   event.target.result.createObjectStore("tasks", {
//     keyPath: "id",
//     autoIncrement: true
//   });
// };

// request.onerror = function(event) {
//   console.log("error opening db");
// };

// request.onsuccess = function(event) {
//   db = request.result;
// };

// -----------------------------------------------------------------------------

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

  // Using LocalStorage --------------------------------------------------------

  window.localStorage.setItem("tasks", JSON.stringify(tasks));

  // Using WebSQL --------------------------------------------------------------
  // var db = window.openDatabase(
  //   "todo.app",
  //   "1.0",
  //   "Cordova Demo with simple ToDo App",
  //   5 * 1024 * 1024
  // );

  // db.transaction(function(t) {
  //   t.executeSql(
  //     "DELETE FROM todo",
  //     [],
  //     function() {},
  //     function(_, e) {
  //       console.log("There has been an error: " + e.message);
  //     }
  //   );
  // });

  // db.transaction(function(t) {
  //   for (var task of Object.values(tasks)) {
  //     t.executeSql(
  //       "INSERT INTO todo(`check`, text) VALUES (?,?)",
  //       [task.check, task.text],
  //       function() {},
  //       function(_, e) {
  //         console.log("There has been an error: " + e.message);
  //       }
  //     );
  //   }
  // });

  // Using IndexedDB ----------------------------------------------------------------
  // db.transaction(["tasks"], "readwrite")
  //   .objectStore("tasks")
  //   .clear();

  // for (var task of Object.values(tasks)) {
  //   var request = db
  //     .transaction(["tasks"], "readwrite")
  //     .objectStore("tasks")
  //     .add({
  //       check: task.check,
  //       text: task.text
  //     });

  //   request.onerror = function(event) {
  //     alert("Unable to add data\r\n");
  //   };
  // }
}

function load() {
  // Using localStorage --------------------------------------------------------------
  var toLoad = JSON.parse(localStorage.getItem("tasks", null));
  if (toLoad) {
    var count = 0;
    for (var obj in toLoad) {
      count++;
    }
    for (var i = 0; i < count; i++) {
      addTableRow(toLoad["row" + i]);
    }
  }
  // Using WebSQL --------------------------------------------------------------------
  // var db = window.openDatabase(
  //   "todo.app",
  //   "1.0",
  //   "Cordova Demo with simple ToDo App",
  //   5 * 1024 * 1024
  // );
  // db.transaction(function(t) {
  //   t.executeSql(
  //     "CREATE TABLE IF NOT EXISTS todo(`check` INTEGER, text TEXT)",
  //     [],
  //     function() {},
  //     function(tx, e) {
  //       console.log("There has been an error: " + e.message);
  //     }
  //   );
  // });
  // db.transaction(function(t) {
  //   t.executeSql(
  //     "SELECT * FROM todo",
  //     [],
  //     function(_, results) {
  //       console.log(results);
  //       for (var i = 0; i < results.rows.length; i++) {
  //         addTableRow(results.rows[i]);
  //       }
  //     },
  //     function(_, e) {
  //       console.log("There has been an error: " + e.message);
  //     }
  //   );
  // });
  // Using IndexedDB ----------------------------------------------------------------------

  // var transaction = db.transaction(["tasks"]);
  // var objectStore = transaction.objectStore("tasks");

  // objectStore.openCursor().onerror = function(event) {
  //   alert("Unable to retrieve data from database!");
  // };

  // objectStore.openCursor().onsuccess = function(event) {
  //   var cursor = event.target.result;
  //   if (cursor) {
  //     addTableRow({ check: cursor.value.check, text: cursor.value.text });
  //     cursor.continue();
  //   }
  // };
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
  elm2.style.setProperty("width", "100%");
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

// Screen orientation

// document.addEventListener("deviceready", function() {
//   screen.orientation.lock("landscape-secondary"); // any
// });

// // window.addEventListener("orientationchange", function() {
// screen.orientation.onchange = function() {
//   alert("Orientation changed: " + screen.orientation.type);
// };
// });

// Status bar

// window.addEventListener("statusTap", function() {
//   window.scrollTo(0, 0);
// });

// var overlays = true;

// document.addEventListener("deviceready", function() {
//   document
//     .querySelector("button#togglesttb")
//     .addEventListener("click", function() {
//       if (StatusBar.isVisible) StatusBar.hide();
//       else StatusBar.show();
//     });
//   document
//     .querySelector("button#toggleOverlays")
//     .addEventListener("click", function() {
//       StatusBar.overlaysWebView((overlays = !overlays));
//     });
//   document
//     .querySelector("button#sttbColor")
//     .addEventListener("click", function() {
//       var color = prompt("Color name");
//       if (color) StatusBar.backgroundColorByName(color);
//     });
//   document
//     .querySelector("button#sttbColorHex")
//     .addEventListener("click", function() {
//       var color = prompt("Hex string");
//       if (color) StatusBar.backgroundColorByHexString(color);
//     });
//   document
//     .querySelector("button#sttbDefault")
//     .addEventListener("click", StatusBar.styleDefault);
//   document
//     .querySelector("button#sttbLight")
//     .addEventListener("click", StatusBar.styleLightContent);
//   document
//     .querySelector("button#sttbBlackO")
//     .addEventListener("click", StatusBar.styleBlackOpaque);
//   document
//     .querySelector("button#sttbBlackT")
//     .addEventListener("click", StatusBar.styleBlackTranslucent);
// });
