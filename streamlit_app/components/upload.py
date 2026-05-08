import streamlit as st
import requests
import time

from config import API_BASE_URL

def poll_status(task_id):
    with st.spinner("Extracting Intelligence... This may take a minute."):
        while True:
            try:
                response = requests.get(f"{API_BASE_URL}/ingest/status/{task_id}")
                if response.status_code == 200:
                    data = response.json()
                    if data["status"] == "completed":
                        st.session_state["study_material"] = data["study_material"]
                        st.success("Successfully extracted study material!")
                        st.balloons()
                        return
                time.sleep(3)
            except Exception as e:
                st.error(f"Polling error: {e}")
                return

def render_upload():
    st.title("📤 Ingest New Material")
    st.write("Upload a PDF, Image, or paste a YouTube link to generate AI study material.")
    
    tab1, tab2, tab3 = st.tabs(["🎥 YouTube", "📄 PDF Document", "📸 Image Notes"])
    
    with tab1:
        st.subheader("Process YouTube Video")
        url = st.text_input("YouTube URL", placeholder="https://youtube.com/watch?v=...")
        if st.button("Generate Study Material", key="yt_btn"):
            if not url:
                st.error("Please enter a valid URL.")
            else:
                task_id = f"task_{int(time.time())}"
                try:
                    response = requests.post(f"{API_BASE_URL}/ingest/youtube", json={"url": url, "task_id": task_id})
                    if response.status_code == 200:
                        poll_status(task_id)
                    else:
                        st.error("Failed to initiate processing.")
                except Exception as e:
                    st.error(f"Connection error: {e}")
                    
    with tab2:
        st.subheader("Process PDF")
        pdf_file = st.file_uploader("Upload PDF file", type=["pdf"])
        if st.button("Generate Study Material", key="pdf_btn") and pdf_file:
            task_id = f"task_{int(time.time())}"
            files = {"file": (pdf_file.name, pdf_file, "application/pdf")}
            try:
                # FastAPI expects task_id as query param for this endpoint design
                response = requests.post(f"{API_BASE_URL}/ingest/pdf?task_id={task_id}", files=files)
                if response.status_code == 200:
                    poll_status(task_id)
            except Exception as e:
                st.error(f"Error: {e}")

    with tab3:
        st.subheader("Process Image Notes")
        image_file = st.file_uploader("Upload Image", type=["png", "jpg", "jpeg"])
        if st.button("Generate Study Material", key="img_btn") and image_file:
            task_id = f"task_{int(time.time())}"
            files = {"file": (image_file.name, image_file, image_file.type)}
            try:
                response = requests.post(f"{API_BASE_URL}/ingest/image?task_id={task_id}", files=files)
                if response.status_code == 200:
                    poll_status(task_id)
            except Exception as e:
                st.error(f"Error: {e}")
