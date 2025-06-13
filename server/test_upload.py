import requests
import os

def test_upload():
    # Test the debug endpoint first
    try:
        response = requests.get('http://localhost:5000/api/debug')
        print("Debug info:", response.json())
    except Exception as e:
        print(f"Could not connect to server: {e}")
        return
    
    # Test file upload
    test_image_path = "Test/TestFiles_(5).jpg"  # Adjust this path
    
    if not os.path.exists(test_image_path):
        print(f"Test image not found: {test_image_path}")
        print("Please provide a valid image path")
        return
    
    try:
        with open(test_image_path, 'rb') as f:
            files = {'image': f}
            response = requests.post('http://localhost:5000/api/classify', files=files)
            print(f"Response status: {response.status_code}")
            print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Upload test failed: {e}")

if __name__ == "__main__":
    test_upload()