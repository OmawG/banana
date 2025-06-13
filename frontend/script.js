const uploadInput = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const classifyBtn = document.getElementById('classifyBtn');
const predictionText = document.getElementById('prediction');
const clearBtn = document.getElementById('clearBtn');

let uploadedFile = null;

// ===== Image Preview =====
uploadInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
      console.log('File selected:', file.name, 'Type:', file.type, 'Size:', file.size);
      
      // Check if it's an image file
      if (!file.type.startsWith('image/')) {
          alert('Please select a valid image file');
          return;
      }
      
      uploadedFile = file;
      const reader = new FileReader();
      reader.onload = function(e) {
          imagePreview.src = e.target.result;
          imagePreview.style.display = 'block';
          clearBtn.style.display = 'block';
          classifyBtn.disabled = false;
          predictionText.textContent = '';
          predictionText.style.display = 'block';
      };
      reader.onerror = function(e) {
          console.error('FileReader error:', e);
          alert('Error reading file');
      };
      reader.readAsDataURL(file);
  }
});

// ===== Clear Button =====
clearBtn.addEventListener('click', function() {
  console.log('Clear button clicked');
  imagePreview.src = '';
  imagePreview.style.display = 'none';
  clearBtn.style.display = 'none';
  uploadInput.value = '';
  uploadedFile = null;
  classifyBtn.disabled = true;
  predictionText.textContent = '';
  predictionText.style.display = 'none';
});

// ===== Classification Handler =====
classifyBtn.addEventListener('click', async function(e) {
  e.preventDefault(); // Prevent any default behavior
  
  console.log('Classify button clicked');
  console.log('Uploaded file:', uploadedFile);
  
  if (!uploadedFile) {
      console.error('No file uploaded');
      alert('Please upload an image first');
      return;
  }

  console.log('Starting classification for file:', uploadedFile.name);

  // Show loading state
  classifyBtn.textContent = 'Classifying...';
  classifyBtn.disabled = true;
  predictionText.textContent = 'Processing image...';
  predictionText.style.display = 'block';
  predictionText.style.color = '#333';

  try {
      // Create FormData to send file
      const formData = new FormData();
      formData.append('image', uploadedFile);

      console.log('FormData created, sending request...');
      console.log('Request URL: http://localhost:5000/api/classify');

      // Send request to Flask server with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch('http://localhost:5000/api/classify', {
          method: 'POST',
          body: formData,
          signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('Response received:', response.status, response.statusText);

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Response data:', result);

      if (response.ok) {
          // Display prediction result
          if (result.error) {
              predictionText.innerHTML = `<span style="color: #ff6b6b;"><strong>Error: ${result.error}</strong></span>`;
          } else if (result.prediction === "No banana detected") {
              predictionText.innerHTML = `
                  <span style="color: #ff6b6b;">
                      <strong>No banana detected in the image</strong>
                  </span>
              `;
          } else {
              const confidenceColor = result.confidence > 70 ? '#4ecdc4' : 
                                    result.confidence > 50 ? '#ffe66d' : '#ff6b6b';
                
              predictionText.innerHTML = `
                  <div style="text-align: center;">
                      <div style="font-size: 1.2em; margin-bottom: 10px;">
                          <strong>Prediction: <span style="color: ${confidenceColor};">${result.prediction}</span></strong>
                      </div>
                      <div style="font-size: 1em;">
                          <strong>Confidence: ${result.confidence}%</strong>
                      </div>
                  </div>
              `;
          }
      } else {
          predictionText.innerHTML = `<span style="color: #ff6b6b;">Error: ${result.error}</span>`;
      }
  } catch (error) {
      console.error('Fetch error:', error);
      
      if (error.name === 'AbortError') {
          predictionText.innerHTML = `<span style="color: #ff6b6b;"><strong>Request timeout. Please try again.</strong></span>`;
      } else if (error.message.includes('Failed to fetch')) {
          predictionText.innerHTML = `<span style="color: #ff6b6b;"><strong>Cannot connect to server. Make sure Flask server is running on http://localhost:5000</strong></span>`;
      } else {
          predictionText.innerHTML = `<span style="color: #ff6b6b;"><strong>Error: ${error.message}</strong></span>`;
      }
  } finally {
      // Reset button state
      console.log('Resetting button state');
      classifyBtn.textContent = 'Classify';
      classifyBtn.disabled = false;
  }
});

// Initialize button state
classifyBtn.disabled = true;

// Add some debugging for page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    console.log('Elements found:', {
        imageUpload: !!uploadInput,
        imagePreview: !!imagePreview,
        classifyBtn: !!classifyBtn,
        clearBtn: !!clearBtn,
        prediction: !!predictionText
    });
});

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
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
