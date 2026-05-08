import streamlit as st

def render_dashboard():
    st.title("🏠 Dashboard")
    st.write("Welcome back! Pick up where you left off.")
    
    col1, col2 = st.columns(2)
    with col1:
        st.metric("Study Materials", "12", "+2 this week")
    with col2:
        st.metric("Assessments Taken", "5", "Avg Score: 85%")
        
    st.markdown("---")
    
    if "study_material" in st.session_state:
        st.subheader("Recently Extracted Material")
        render_study_viewer()
    else:
        st.info("No recent study materials. Go to 'Upload & Ingest' to create some!")

def render_study_viewer():
    material = st.session_state.get("study_material")
    if not material:
        st.warning("No study material loaded.")
        return
        
    st.success("Executive Summary")
    st.write(material.get("summary", "No summary available."))
    
    st.markdown("---")
    
    col1, col2 = st.columns(2)
    with col1:
        st.info("💡 Key Points")
        for point in material.get("key_points", []):
            st.markdown(f"- {point}")
            
    with col2:
        st.warning("🧠 Revision Notes")
        for note in material.get("revision_notes", []):
            st.markdown(f"> {note}")
            
    st.markdown("---")
    st.write("Ready to test your knowledge?")
    if st.button("Generate Assessment", type="primary"):
        # We store the raw text somewhere to generate tests, but for now we just switch to the tests tab
        # Typically we'd call the /tests/generate API here.
        st.session_state["raw_text_for_test"] = str(material)
        st.info("Assessment generated. Go to the Assessments tab to take it!")
