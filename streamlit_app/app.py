import streamlit as st
from components import upload, study, test, revision

st.set_page_config(page_title="AI Learning Platform", page_icon="🧠", layout="wide")

def main():
    st.sidebar.title("🧠 AI Learning")
    
    pages = {
        "Dashboard": study.render_dashboard, # Default view of recent stuff
        "Upload & Ingest": upload.render_upload,
        "Assessments": test.render_test,
        "Daily Revision": revision.render_revision
    }
    
    st.sidebar.markdown("---")
    selection = st.sidebar.radio("Navigation", list(pages.keys()))
    
    st.sidebar.markdown("---")
    st.sidebar.info("Connected to FastAPI Backend")
    
    # Render the selected page
    pages[selection]()

if __name__ == "__main__":
    main()
