let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  const form = document.querySelector(".add-toy-form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameInput = document.querySelector(".input-text[name='name']");
    const imageInput = document.querySelector(".input-text[name='image']");

    const newName = nameInput.value;
    const newImage = imageInput.value;

    nameInput.value = "";
    imageInput.value = "";

    // Call the function to create a new toy element
    createToyElement(newName, newImage, 0);

    // Sending a POST request to the local db server
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newName,
        image: newImage,
        likes: 0,
      }),
    })
      //ensuring the data is sent
      .then((response) => response.json())
      .then((data) => {
        console.log("POST request successful:", data);
      })
      .catch((error) => {
        console.error("Error sending POST request:", error);
      });
  });

  fetch("http://localhost:3000/toys")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((toy) => {
        const newName = toy.name;
        const newImage = toy.image;
        const likes = toy.likes;
        const toyId = toy.id;

        // Calling the function to create a new toy element
        createToyElement(newName, newImage, likes, toyId);
      });
    });
});

function createToyElement(newName, newImage, likes, toyId) {
  const toyCollection = document.querySelector("#toy-collection");

  const newElms = document.createElement("div");
  newElms.classList = "card";

  newElms.innerHTML = `
    <h2>${newName}</h2>
    <img src="${newImage}" class="toy-avatar" />
    <p>Likes: <span class="likes-count">${likes}</span></p>
    <button class="like-btn" data-toy-id="${toyId}">Like </button>
  `;

  toyCollection.appendChild(newElms);

  // Attaching the like button click event to the new element
  const likeButton = newElms.querySelector(".like-btn");
  likeButton.addEventListener("click", () => {
    updateLikes(newElms, toyId);
  });
}

// Function to update the likes count
function updateLikes(element, toyId) {
  const likesElement = element.querySelector(".likes-count");
  const currentLikes = parseInt(likesElement.textContent);
  likesElement.textContent = currentLikes + 1;

  // Send a PATCH request to update the likes count on the local db server
  fetch(`http://localhost:3000/toys/${toyId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      likes: currentLikes + 1,
    }),
  })
    //making sure the patck request is succesful
    .then((response) => response.json())
    .then((data) => {
      console.log("PATCH request successful:", data);
    })
    .catch((error) => {
      console.error("Error sending PATCH request:", error);
    });
}
