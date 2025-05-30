const uploadInput = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const classifyBtn = document.getElementById('classifyBtn');
const predictionText = document.getElementById('prediction');
const clearBtn = document.getElementById('clearBtn');

// ===== Image Preview =====
uploadInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
      imagePreview.style.display = 'block';
      predictionText.textContent = '';
      predictionText.style.color = '#4b3f29';
      clearBtn.style.display = 'inline-block'; // Show clear button
    };
    reader.readAsDataURL(file);
  }
});

// ===== Clear Button =====
clearBtn.addEventListener('click', function () {
  uploadInput.value = '';
  imagePreview.src = '';
  imagePreview.style.display = 'none';
  predictionText.textContent = '';
  clearBtn.style.display = 'none'; // Hide clear button
});

// ===== Classification Handler =====
classifyBtn.addEventListener('click', function () {
  if (!uploadInput.files.length) {
    predictionText.textContent = '❌ Please upload an image first.';
    predictionText.style.color = 'red';
    return;
  }

  try {
    // Simulate backend error
    throw new Error('Model is not connected');

    // If working: send image to backend and get prediction
    // const prediction = "Ripe";
    // predictionText.textContent = `✅ Prediction: ${prediction}`;
    // predictionText.style.color = '#4b3f29';
    // addToHistory(uploadInput.files[0].name, prediction);

  } catch (err) {
    predictionText.textContent = `⚠️ Unable to classify image. ${err.message}`;
    predictionText.style.color = 'red';
    // Optionally, save to localStorage for history page
    addToHistory(uploadInput.files[0].name, `❌ Error: ${err.message}`);
  }
});

// ===== Add to History List (save to localStorage) =====
function addToHistory(fileName, prediction) {
  const date = new Date().toLocaleString();
  const entry = `${date} — ${fileName} ➜ ${prediction}`;
  let history = JSON.parse(localStorage.getItem('bananaHistory') || '[]');
  history.unshift(entry);
  localStorage.setItem('bananaHistory', JSON.stringify(history));
}


// ===== Navbar Link Handlers =====
dashboardLink.addEventListener('click', () => {
  dashboardSection.style.display = 'block';
  historyModal.style.display = 'none';
});

historyLink.addEventListener('click', () => {
  dashboardSection.style.display = 'none';
  historyModal.style.display = 'block';
});

// ===== History Modal Close Button =====
historyClose.addEventListener('click', () => {
  historyModal.style.display = 'none';
});

// Optional: Close history modal when clicking outside it
window.addEventListener('click', function (event) {
  if (event.target === historyModal) {
    historyModal.style.display = 'none';
  }
});
