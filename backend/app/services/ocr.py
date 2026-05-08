import cv2
import pytesseract
import numpy as np

def process_image_ocr(file_bytes: bytes) -> str:
    """
    Performs OCR on an image using Tesseract, with OpenCV for preprocessing.
    """
    try:
        # Convert bytes to numpy array for OpenCV
        nparr = np.frombuffer(file_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Preprocessing: convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Preprocessing: apply thresholding (Adaptive thresholding can be better for handwritten text)
        # Using simple thresholding + slight blur as a baseline for printed text
        blur = cv2.GaussianBlur(gray, (3,3), 0)
        thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
        
        # Perform OCR
        # We can configure tesseract layout (psm) if needed
        custom_config = r'--oem 3 --psm 6'
        text = pytesseract.image_to_string(thresh, config=custom_config)
        
        return text
    except Exception as e:
        print(f"Error processing image OCR: {e}")
        return f"Error: Could not extract text from image. Detail: {str(e)}"
