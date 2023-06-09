let section = document.querySelector("section");
let add = document.querySelector("form button");
add.addEventListener("click", (e) => {
  //prevent form from being submitted
  e.preventDefault();

  //get the input values
  let form = e.target.parentElement;
  let todoText = form.children[0].value;
  let todoMonth = form.children[1].value;
  let todoDate = form.children[2].value;

  //check the todo event
  if (todoText === "") {
    alert("Todo event can not be empty.");
    return;
  } else if (
    Number(todoMonth) == 1 ||
    Number(todoMonth) == 3 ||
    Number(todoMonth) == 5 ||
    Number(todoMonth) == 7 ||
    Number(todoMonth) == 8 ||
    Number(todoMonth) == 10 ||
    Number(todoMonth) == 12
  ) {
    if (Number(todoDate) > 31) {
      alert("Todo date is invalid. Date should between 1 and 31.");
      return;
    }
  } else if (Number(todoMonth) == 2 && Number(todoDate) > 28) {
    alert("Todo date is invalid. Date should between 1 and 28.");
    return;
  } else if (
    Number(todoMonth) == 4 ||
    Number(todoMonth) == 6 ||
    Number(todoMonth) == 9 ||
    Number(todoMonth) == 11
  ) {
    if (Number(todoDate) > 30) {
      alert("Todo date is invalid. Date should between 1 and 30.");
      return;
    }
  } else if (Number(todoMonth) > 12) {
    alert("Todo date is invalid. Month must between 1 and 12.");
    return;
  }

  //create a todo
  let todo = document.createElement("div");
  todo.classList.add("todo");
  let text = document.createElement("p");
  text.classList.add("todo-text");
  text.innerText = todoText;
  let time = document.createElement("p");
  time.classList.add("todo-time");
  time.innerText = todoMonth + " / " + todoDate;
  todo.appendChild(text);
  todo.appendChild(time);

  //create check and trash icon
  let completeButton = document.createElement("button");
  completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
  completeButton.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    todoItem.classList.toggle("done");
  });

  let trashButton = document.createElement("button");
  trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
  trashButton.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    todo.style.animation = "scaleDown 0.3s forwards";
    todoItem.addEventListener("animationend", () => {
      //remove from localStorage
      let text = todoItem.children[0].innerText;
      let myListArray = JSON.parse(localStorage.getItem("list"));
      myListArray.forEach((item, index) => {
        if (item.todoText == text) {
          myListArray.splice(index, 1);
          localStorage.setItem("list", JSON.stringify(myListArray));
        }
      });
      todoItem.remove();
    });
  });

  todo.appendChild(completeButton);
  todo.appendChild(trashButton);

  todo.style.animation = "scaleUp 0.3s forwards";

  //create an object
  let myTodo = {
    todoText: todoText,
    todoMonth: todoMonth,
    todoDate: todoDate,
  };

  //store data into an array of objects
  let myList = localStorage.getItem("list");
  if (myList == null) {
    localStorage.setItem("list", JSON.stringify([myTodo]));
  } else {
    let myListArray = JSON.parse(myList);
    myListArray.push(myTodo);
    localStorage.setItem("list", JSON.stringify(myListArray));
  }

  form.children[0].value = "";
  form.children[1].value = "";
  form.children[2].value = "";
  section.appendChild(todo);
});

loadData();

function loadData() {
  let myList = localStorage.getItem("list");
  if (myList !== null) {
    let myListArray = JSON.parse(myList);
    myListArray.forEach((item) => {
      let todo = document.createElement("div");
      todo.classList.add("todo");
      let text = document.createElement("p");
      text.classList.add("todo-text");
      text.innerText = item.todoText;
      let time = document.createElement("p");
      time.classList.add("todo-time");
      time.innerText = item.todoMonth + " / " + item.todoDate;
      todo.appendChild(text);
      todo.appendChild(time);

      //create check and trash icon
      let completeButton = document.createElement("button");
      completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
      completeButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done");
      });

      let trashButton = document.createElement("button");
      trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
      trashButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        todo.style.animation = "scaleDown 0.3s forwards";
        todoItem.addEventListener("animationend", () => {
          //remove from localStorage
          let text = todoItem.children[0].innerText;
          let myListArray = JSON.parse(localStorage.getItem("list"));
          myListArray.forEach((item, index) => {
            if (item.todoText == text) {
              myListArray.splice(index, 1);
              localStorage.setItem("list", JSON.stringify(myListArray));
            }
          });
          todoItem.remove();
        });
      });

      todo.appendChild(completeButton);
      todo.appendChild(trashButton);

      section.appendChild(todo);
    });
  }
}
//sort by time function(through merge sort)
function mergeTime(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
      result.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
      result.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
      if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
        result.push(arr2[j]);
        j++;
      } else {
        result.push(arr1[i]);
        i++;
      }
    }
  }

  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }

  return result;
}

function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let right = arr.slice(0, middle);
    let left = arr.slice(middle, arr.length);
    return mergeTime(mergeSort(right), mergeSort(left));
  }
}

let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
  //sort todo
  let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
  localStorage.setItem("list", JSON.stringify(sortedArray));

  //remove todo
  let len = section.children.length;
  for (let i = 0; i < len; i++) {
    section.children[0].remove();
  }

  //load todo
  loadData();
});
