import streamlit as st
import requests
import time

from config import API_BASE_URL

def render_test():
    st.title("🧠 Assessments")
    
    if "assessment" not in st.session_state:
        if "raw_text_for_test" in st.session_state:
            st.write("Generating your assessment based on recent study material...")
            with st.spinner("LLM is crafting questions..."):
                try:
                    payload = {
                        "study_material": st.session_state["raw_text_for_test"],
                        "topic": "Recent Material",
                        "difficulty": "medium",
                        "types": ["MCQ"],
                        "count": 3
                    }
                    res = requests.post(f"{API_BASE_URL}/tests/generate", json=payload)
                    if res.status_code == 200:
                        st.session_state["assessment"] = res.json()
                        st.rerun()
                    else:
                        st.error("Failed to generate assessment.")
                except Exception as e:
                    st.error(f"API Error: {e}")
        else:
            st.info("No pending assessments. Generate a study material first!")
            return
            
    assessment = st.session_state["assessment"]
    st.subheader(f"Topic: {assessment['topic']}")
    
    if "current_q" not in st.session_state:
        st.session_state.current_q = 0
        
    questions = assessment.get("questions", [])
    if not questions:
        st.warning("No questions generated.")
        return
        
    q_index = st.session_state.current_q
    if q_index >= len(questions):
        st.success("Assessment Complete! Excellent work.")
        if st.button("Reset"):
            del st.session_state["assessment"]
            st.session_state.current_q = 0
            st.rerun()
        return

    q = questions[q_index]
    
    st.progress((q_index) / len(questions))
    st.write(f"**Question {q_index + 1} of {len(questions)}**")
    
    with st.container(border=True):
        st.markdown(f"### {q['content']}")
        
        if q["question_type"] == "MCQ":
            options = q.get("options", [])
            selected = st.radio("Select an answer:", options, index=None)
            
            if st.button("Submit Answer"):
                if not selected:
                    st.warning("Please select an option.")
                else:
                    if selected == q["correct_answer"]:
                        st.success("✅ Correct!")
                        # Simulate sending to spaced repetition engine
                        try:
                            requests.post(f"{API_BASE_URL}/revision/review", json={"question_id": q["id"], "quality": 5})
                        except: pass
                    else:
                        st.error(f"❌ Incorrect. The correct answer was: {q['correct_answer']}")
                        try:
                            requests.post(f"{API_BASE_URL}/revision/review", json={"question_id": q["id"], "quality": 1})
                        except: pass
                        
                    st.session_state.current_q += 1
                    time.sleep(1.5) # Give user time to see result
                    st.rerun()
