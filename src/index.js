const tableHead = document.querySelector(".blue");
const formName = document.querySelector("[type='name']");
const formBreed = document.querySelector("[type='breed']");
const formSex = document.querySelector("[type='sex']");
const formSubmit = document.querySelector("[type='submit']")
const form = document.querySelector("#dog-form");

function getDogData(){
  fetch("http://localhost:3000/dogs")
    .then(res => res.json())
    .then(dogs => {
      createDogTable(dogs);
    })
}


function createDogTable(dogs) {
  let rows = Array.from(tableHead.querySelectorAll("tr.padding.center"))
  rows.forEach(row => row.remove())
  for (dog of dogs) {
    tr = document.createElement("tr");
    tdName = document.createElement("td");
    tdBreed = document.createElement("td");
    tdSex = document.createElement("td");
    tdButton = document.createElement("td");
    buttonEdit = document.createElement("button");
    tr.className = "padding center"
    tr.style.backgroundColor = "white";
    tr.dataset.id = dog.id;
    tdName.innerHTML = dog.name;
    tdBreed.innerHTML = dog.breed;
    tdSex.innerHTML = dog.sex;
    buttonEdit.innerHTML = "Edit";
    tdButton.append(buttonEdit)
    tr.append(tdName, tdBreed, tdSex, tdButton)
    tableHead.appendChild(tr)
  }
}

function edit() {
  if (event.target.tagName === "BUTTON") {
    editFill(event.target)
  }
}

function editFill(row) {
  rowElements = row.parentElement.parentElement.children;
  id = row.parentElement.parentElement.dataset.id;
  name = rowElements[0].innerHTML;
  breed = rowElements[1].innerHTML;
  sex = rowElements[2].innerHTML;
  formName.value = name;
  formBreed.value = breed;
  formSex.value = sex;
  form.dataset.id = id;
}

function patchChanges() {
  event.preventDefault()
  removeError()
  if (form.dataset.id && formName.value && formSex.value && formBreed.value) {
    fetch(`http://localhost:3000/dogs/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": 'application/json',
        "Accept": 'application/json'
      },
      body: JSON.stringify( {
        name: formName.value,
        breed: formBreed.value,
        sex: formSex.value
      })
    })
      .then(res => res.json())
      .then(res => getDogData());
      form.reset()
  } else {
    createError();
  }
}

function createError() {
  if (!document.querySelector("[data-error]")) {
    p = document.createElement("p")
    p.dataset.error = "no-edit";
    p.style.color = "red";
    p.innerHTML = "Please Select a Dog to Edit"
    document.querySelector(".margin.flex").appendChild(p);
  }
}


function removeError() {
  if (document.querySelector("[data-error]")) {
    document.querySelector("[data-error]").remove();
  }
}

/// CALLED METHODS ///
getDogData();


/// EVENT LISTENERS ///
tableHead.addEventListener("click", edit)
formSubmit.addEventListener("click", patchChanges)
