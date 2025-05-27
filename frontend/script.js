const uploadInput = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const classifyBtn = document.getElementById('classifyBtn');
const predictionText = document.getElementById('prediction');

const dashboardSection = document.getElementById('dashboardSection');
const dashboardLink = document.getElementById('dashboardLink');

const historyLink = document.getElementById('historyLink');
const historyModal = document.getElementById('historyModal');
const historyClose = document.getElementById('historyClose');
const historyList = document.getElementById('historyList');


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
    addToHistory(uploadInput.files[0].name, `❌ Error: ${err.message}`);
  }
});

// ===== Add to History List =====
function addToHistory(fileName, prediction) {
  const date = new Date().toLocaleString();
  const entry = document.createElement('li');
  entry.textContent = `${date} — ${fileName} ➜ ${prediction}`;
  historyList.prepend(entry);
}

// ===== Welcome Modal on First Visit =====
window.addEventListener('load', function () {
  const modal = document.getElementById('infoModal');
  const closeBtn = modal.querySelector('.close');

  if (!sessionStorage.getItem('seenModal')) {
    modal.style.display = 'block';
    sessionStorage.setItem('seenModal', 'true');
  }

  closeBtn.onclick = () => (modal.style.display = 'none');

  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});

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
