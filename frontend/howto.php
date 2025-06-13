<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>How to Use - Banana Classifier</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="background"></div>
  <div class="main-content">
    <!-- Navbar -->
     <nav>
      <?php include 'navbar.php'; ?>
     </nav>

    <div class="container">
      <h2>How to Use</h2>
      <p>This system classifies bananas into four categories:</p>
      <ul class="banana-reference-list">
        <li>
          <strong>Unripe</strong> – Green bananas, not ready yet.<br>
          <img src="asset/unripe.jpg" alt="Unripe Banana" class="banana-ref-img">
        </li>
        <li>
          <strong>Ripe</strong> – Perfect yellow for eating.<br>
          <img src="asset/ripe.jpg" alt="Ripe Banana" class="banana-ref-img">
        </li>
        <li>
          <strong>Overripe</strong> – Very soft, still edible.<br>
          <img src="asset/overripe.jpg" alt="Overripe Banana" class="banana-ref-img">
        </li>
        <li>
          <strong>Rotten</strong> – Discard banana.<br>
          <img src="asset/rotten.jpg" alt="Rotten Banana" class="banana-ref-img">
        </li>
      </ul>
      <p><strong>Instructions:</strong></p>
      <ol>
        <li>Click “Upload Image” and select a photo of a banana.</li>
        <li>Click “Classify” to get the prediction.</li>
        <li>Check your classification history on the History page.</li>
      </ol>
      <p>Make sure the image is clear and shows the banana properly.</p>
    </div>

    <footer class="footer">
      <p>&copy; 2025 Banana Classifier. All rights reserved.</p>
    </footer>
  </div>
</body>
</html>