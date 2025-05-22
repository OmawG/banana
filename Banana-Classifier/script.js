const uploadInput = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const classifyBtn = document.getElementById('classifyBtn');
const predictionText = document.getElementById('prediction');

// Handle image preview
uploadInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
      imagePreview.style.display = 'block';
      predictionText.textContent = ''; // Clear previous prediction
      predictionText.style.color = '#4b3f29';
    };
    reader.readAsDataURL(file);
  }
});

// Handle classification
classifyBtn.addEventListener('click', function () {
  if (!uploadInput.files.length) {
    predictionText.textContent = '❌ Please upload an image first.';
    predictionText.style.color = 'red';
    return;
  }

  try {
    // Simulate backend error
    throw new Error('Model is not connected');
    // Normally: send the image to backend and show response
    // predictionText.textContent = 'Prediction: Ripe';
  } catch (err) {
    predictionText.textContent = `⚠️ Unable to classify image. ${err.message}`;
    predictionText.style.color = 'red';
  }
});
