from flask import Flask, jsonify, request
from flask_cors import CORS
from ultralytics import YOLO
import os
from werkzeug.utils import secure_filename
import cv2
import numpy as np
from PIL import Image
import io
import base64
import time

app = Flask(__name__)
CORS(app)

# Configure upload settings
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff', 'tif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Get absolute path for upload folder
UPLOAD_FOLDER_ABS = os.path.abspath(UPLOAD_FOLDER)
print(f"Upload folder absolute path: {UPLOAD_FOLDER_ABS}")

# Create upload directory if it doesn't exist
try:
    os.makedirs(UPLOAD_FOLDER_ABS, exist_ok=True)
    print(f"Upload directory created/verified: {UPLOAD_FOLDER_ABS}")
    print(f"Upload directory exists: {os.path.exists(UPLOAD_FOLDER_ABS)}")
    print(f"Upload directory is writable: {os.access(UPLOAD_FOLDER_ABS, os.W_OK)}")
except Exception as e:
    print(f"Error creating upload directory: {e}")

# Load the YOLO model once when the server starts
try:
    model_path = "Banana_yolo.onnx"
    if os.path.exists(model_path):
        model = YOLO(model_path)
        print("YOLO model loaded successfully")
    else:
        print(f"YOLO model file not found: {model_path}")
        print(f"Current directory: {os.getcwd()}")
        print(f"Files in current directory: {os.listdir('.')}")
        model = None
except Exception as e:
    print(f"Error loading YOLO model: {e}")
    model = None

def allowed_file(filename):
    if '.' not in filename:
        return False
    extension = filename.rsplit('.', 1)[1].lower()
    print(f"File extension: {extension}")
    return extension in ALLOWED_EXTENSIONS

def is_image_file(file):
    """Check if the uploaded file is actually an image by trying to open it with PIL"""
    try:
        file.seek(0)
        img = Image.open(file)
        img.verify()
        file.seek(0)
        return True
    except Exception as e:
        print(f"Image verification failed: {e}")
        file.seek(0)
        return False

@app.route('/api/home', methods=['GET'])
def home():
    return jsonify({"message": "Hello, World!"})

@app.route('/api/classify', methods=['POST'])
def classify_banana():
    print("\n" + "="*50)
    print("CLASSIFY ENDPOINT CALLED")
    print("="*50)
    
    # Debug request info
    print(f"Request method: {request.method}")
    print(f"Request content type: {request.content_type}")
    print(f"Request files keys: {list(request.files.keys())}")
    print(f"Request form keys: {list(request.form.keys())}")
    
    if model is None:
        print("ERROR: YOLO model not loaded")
        return jsonify({"error": "YOLO model not loaded"}), 500
    
    # Check if file is present in request
    if 'image' not in request.files:
        print("ERROR: No 'image' key in request.files")
        return jsonify({"error": "No image file provided"}), 400
    
    file = request.files['image']
    print(f"File object: {file}")
    print(f"File filename: {file.filename}")
    print(f"File content type: {file.content_type}")
    
    # Check if file is selected
    if not file or file.filename == '':
        print("ERROR: No file selected or empty filename")
        return jsonify({"error": "No file selected"}), 400
    
    # Check file size
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)
    print(f"File size: {file_size} bytes")
    
    if file_size == 0:
        print("ERROR: File is empty")
        return jsonify({"error": "File is empty"}), 400
    
    # Check if it's actually an image file
    if not is_image_file(file):
        print("ERROR: File is not a valid image")
        return jsonify({"error": "File is not a valid image"}), 400
    
    # Check file extension
    if not allowed_file(file.filename):
        print(f"ERROR: File type not allowed: {file.filename}")
        return jsonify({"error": "Invalid file type. Please upload a valid image file (PNG, JPG, JPEG, GIF, BMP, WEBP, TIFF)"}), 400
    
    try:
        # Generate a unique filename to avoid conflicts
        timestamp = str(int(time.time() * 1000))  # Use milliseconds for more uniqueness
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        filename = f"upload_{timestamp}.{file_extension}"
        filepath = os.path.join(UPLOAD_FOLDER_ABS, filename)
        
        print(f"Generated filename: {filename}")
        print(f"Full filepath: {filepath}")
        print(f"Upload folder exists: {os.path.exists(UPLOAD_FOLDER_ABS)}")
        print(f"Upload folder writable: {os.access(UPLOAD_FOLDER_ABS, os.W_OK)}")
        
        # Save the uploaded file
        print("Attempting to save file...")
        file.save(filepath)
        print("File.save() completed")
        
        # Verify file was saved
        if os.path.exists(filepath):
            file_size_saved = os.path.getsize(filepath)
            print(f"SUCCESS: File saved successfully!")
            print(f"File size on disk: {file_size_saved} bytes")
            print(f"Files in upload directory: {os.listdir(UPLOAD_FOLDER_ABS)}")
        else:
            print("ERROR: File was not saved to disk")
            return jsonify({"error": "Failed to save uploaded file"}), 500
        
        # Run YOLO inference
        print("Running YOLO inference...")
        results = model(filepath)
        print("YOLO inference completed")
        
        # Process results
        predictions = []
        confidence_scores = []
        
        for result in results:
            boxes = result.boxes
            if boxes is not None:
                print(f"Found {len(boxes)} detections")
                for box in boxes:
                    class_id = int(box.cls[0])
                    confidence = float(box.conf[0])
                    class_name = result.names[class_id]
                    
                    predictions.append(class_name)
                    confidence_scores.append(confidence)
                    print(f"Detected: {class_name} with confidence {confidence:.4f}")
            else:
                print("No detections found")
        
        # Clean up - remove uploaded file
        try:
            os.remove(filepath)
            print("Temporary file cleaned up successfully")
        except Exception as e:
            print(f"Warning: Could not remove temporary file: {e}")
        
        # Prepare response
        if predictions:
            best_idx = confidence_scores.index(max(confidence_scores))
            best_prediction = predictions[best_idx]
            best_confidence = confidence_scores[best_idx]
            
            response_data = {
                "prediction": best_prediction,
                "confidence": round(best_confidence * 100, 2),
                "all_predictions": [
                    {"class": pred, "confidence": round(conf * 100, 2)} 
                    for pred, conf in zip(predictions, confidence_scores)
                ]
            }
            print(f"Returning successful prediction: {response_data}")
            return jsonify(response_data)
        else:
            response_data = {
                "prediction": "No banana detected",
                "confidence": 0,
                "all_predictions": []
            }
            print(f"Returning no detection: {response_data}")
            return jsonify(response_data)
            
    except Exception as e:
        print(f"EXCEPTION occurred: {str(e)}")
        print(f"Exception type: {type(e).__name__}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        
        # Clean up file if it exists
        if 'filepath' in locals() and os.path.exists(filepath):
            try:
                os.remove(filepath)
                print("Cleaned up file after exception")
            except:
                print("Could not clean up file after exception")
        
        return jsonify({"error": f"Error processing image: {str(e)}"}), 500

@app.route('/api/debug', methods=['GET'])
def debug_info():
    """Debug endpoint to check server status"""
    return jsonify({
        "upload_folder": UPLOAD_FOLDER_ABS,
        "upload_folder_exists": os.path.exists(UPLOAD_FOLDER_ABS),
        "upload_folder_writable": os.access(UPLOAD_FOLDER_ABS, os.W_OK),
        "current_directory": os.getcwd(),
        "model_loaded": model is not None,
        "files_in_upload": os.listdir(UPLOAD_FOLDER_ABS) if os.path.exists(UPLOAD_FOLDER_ABS) else []
    })

if __name__ == '__main__':
    print(f"Starting Flask server...")
    print(f"Current working directory: {os.getcwd()}")
    print(f"Upload folder: {UPLOAD_FOLDER_ABS}")
    app.run(debug=True, port=5000)
