let form = document.querySelector("form");
let input = document.querySelector("#fname");
let container = document.querySelector(".storyboard");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let value = input.value;

  fetch(`http://localhost:3000/data/${value}`)
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      container.src = data.url;
    });
});
