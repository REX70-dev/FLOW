import fitz  # PyMuPDF
import io

def process_pdf(file_bytes: bytes) -> str:
    """
    Extracts text from a PDF file using PyMuPDF.
    """
    try:
        pdf_document = fitz.open(stream=file_bytes, filetype="pdf")
        text_content = []
        
        for page_num in range(pdf_document.page_count):
            page = pdf_document.load_page(page_num)
            text_content.append(page.get_text("text"))
            
        pdf_document.close()
        
        # Join all pages with a clear separator
        return "\n--- PAGE BREAK ---\n".join(text_content)
    except Exception as e:
        print(f"Error processing PDF: {e}")
        return f"Error: Could not extract text from PDF. Detail: {str(e)}"
