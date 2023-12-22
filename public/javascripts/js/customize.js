const input = document.querySelector("input");
const output = document.querySelector("output");
let imagesArray = [];

function deleteImage(index) {
  imagesArray.splice(index, 1);
  displayImages();
}

function displayImages() {
  let images = "";
  imagesArray.forEach((image, index) => {
    images += `<div class="image">
                  <img src="${URL.createObjectURL(image)}" alt="image">
                  <span onclick="deleteImage(${index})">&times;</span>
                </div>`;
  });
  output.innerHTML = images;
}

input.addEventListener("change", () => {
  const file = input.files;
  imagesArray.push(file[0]);
  displayImages();
});
