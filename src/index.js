const apiUrl = 'http://localhost:3000/dogs';
let localCache;

document.addEventListener('DOMContentLoaded', () => {
    const dogForm = document.getElementById('dog-form');

    getDataFromApi(apiUrl);

    dogForm.addEventListener('submit', () => {
        event.preventDefault();
        const dogId = document.getElementById('dog-id-hidden').value;
        editDog(dogId);
    });
});

function getDataFromApi(url) {
    fetch(url)
    .then( resp => resp.json() )
    .then( json => {
        savedLocalCache(json);
        generateRows(json);
    })
    .catch( error => console.error(error.message));
}

function savedLocalCache(json) {
    localCache = json;
    return localCache;
}

function generateRows(json) { 
    const tbody = document.getElementById('table-body');

    // this json is an array of objects
    json.forEach((dog) => {
        tbody.innerHTML += createRow(dog);
    });

    function createRow(itemObj) {
        return `
        <tr id="dog-${itemObj.id}" class='dog-info'>
            <td class="dog-name">${itemObj.name}</td>
            <td class="dog-breed">${itemObj.breed}</td>
            <td class="dog-sex">${itemObj.sex}</td>
            <td class="dog-buttons">
                <button onclick="populateDogForm(${itemObj.id})" class="edit-dog-button">Edit Dog</button> 
            </td>
        </tr> 
        `
    }
}
function editDog(dogId) {
    // event.preventDefault();

    // const dog = getDogById(dogId);
    const inputDogName = document.querySelector('#dog-form input[type="name"]');
    const inputDogBreed = document.querySelector('#dog-form input[type="breed"]');
    const inputDogSex = document.querySelector('#dog-form input[type="sex"]');

    const updatedDogObj = {
        id: dogId,
        name: inputDogName.value,
        breed: inputDogBreed.value,
        sex: inputDogSex.value,
    } 

    updateDogApi(updatedDogObj);

    function updateDogApi(dogObj) {
        fetch(`${apiUrl}/${dogObj.id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Accepts' : 'application/json'
            },
            body: JSON.stringify(dogObj)
        });
    }


}

function populateDogForm(dogId) {
    const dog = getDogById(dogId - 1);

    const dogForm = document.getElementById('dog-form');
    const inputDogName = document.querySelector('#dog-form input[type="name"]');
    const inputDogBreed = document.querySelector('#dog-form input[type="breed"]');
    const inputDogSex = document.querySelector('#dog-form input[type="sex"]');

    if (document.getElementById('dog-id-hidden')) {
        dogForm.removeChild(document.getElementById('dog-id-hidden'));
    }
    const inputDogId = document.createElement('input') ;
    inputDogId.setAttribute('id', 'dog-id-hidden');
    inputDogId.setAttribute('type', 'hidden');
    inputDogId.setAttribute('value', dog.id);
    dogForm.appendChild(inputDogId);


    inputDogName.value = dog.name;
    inputDogBreed.value = dog.breed;
    inputDogSex.value = dog.sex;
}

function getDogById(dogId) {
    return localCache[dogId];
}

// get data from API
// generate rows
// append rows to table body