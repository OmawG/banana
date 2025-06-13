<?php


?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Banana Classifier</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="background"></div>

  <div class="main-content">
    <!-- Navbar -->
     <nav>
      <?php include 'navbar.php'; ?>
     </nav>

<!-- Dashboard Section -->
<div id="dashboardSection" class="dashboard-container">
  <!-- Upload & classify UI -->
</div>



    <!-- Main Container -->
    <div class="container">
      <h2>Classify a Banana</h2>

      <label class="upload-btn">
        Upload Image
        <input type="file" id="imageUpload" accept="image/*" hidden />
      </label>

      <div class="image-box">
  <button id="clearBtn" class="clear-btn" style="display: none;">&times;</button>
  <img id="imagePreview" src="" alt="" style="display: none;" />
</div>


      <button id="classifyBtn" class="classify-btn" type="button">Classify</button>
      <div id="prediction" style="display: none; margin-top: 20px; padding: 15px; border-radius: 5px; background-color: #f8f9fa;"></div>

      

    </div>



    <!-- Footer -->
    <footer class="footer">
      <p>&copy; 2025 Banana Classifier. All rights reserved.</p>
    </footer>
  </div>

  <script src="script.js"></script>
</body>
</html>
