const imageInput = document.getElementById("image-input");
const imagePreview = document.getElementById("image-preview");
const resultDiv = document.getElementById("result");

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      imagePreview.src = reader.result;
      imagePreview.style.display = "block";
      resultDiv.textContent = "";
    };
    reader.readAsDataURL(file);
  }
});

function classifyBanana() {
  if (!imageInput.files.length) {
    alert("Please upload a banana image first.");
    return;
  }

  const classes = ["Overripe", "Ripe", "Rotten", "Unripe"];
  const prediction = classes[Math.floor(Math.random() * classes.length)];
  resultDiv.textContent = `Prediction: ${prediction}`;
}
