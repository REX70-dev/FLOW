import streamlit as st
import requests

API_BASE_URL = "http://127.0.0.1:8000/api/v1"

def render_revision():
    st.title("🔁 Daily Revision")
    st.write("Powered by Spaced Repetition (SM-2)")
    
    try:
        res = requests.get(f"{API_BASE_URL}/revision/due")
        if res.status_code == 200:
            due_items = res.json()
            
            if not due_items:
                st.success("You're all caught up for today! 🎉")
                st.balloons()
                return
                
            st.info(f"You have {len(due_items)} items due for review.")
            
            item = due_items[0]
            question = item["question"]
            
            with st.container(border=True):
                st.markdown(f"### {question['content']}")
                
                if question["question_type"] == "MCQ":
                    st.write("Options:")
                    for opt in question["options"]:
                        st.write(f"- {opt}")
                
                with st.expander("Show Answer"):
                    st.success(question["correct_answer"])
                    st.write("How well did you remember this?")
                    
                    col1, col2, col3, col4 = st.columns(4)
                    quality = None
                    with col1:
                        if st.button("0 - Blackout", key="q0"): quality = 0
                    with col2:
                        if st.button("2 - Hard", key="q2"): quality = 2
                    with col3:
                        if st.button("4 - Good", key="q4"): quality = 4
                    with col4:
                        if st.button("5 - Perfect", key="q5"): quality = 5
                        
                    if quality is not None:
                        # Submit review
                        rev_res = requests.post(f"{API_BASE_URL}/revision/review", json={"question_id": question["id"], "quality": quality})
                        if rev_res.status_code == 200:
                            st.rerun()
                        else:
                            st.error("Failed to record review.")
        else:
            st.error("Failed to fetch due revisions.")
    except Exception as e:
        st.error(f"API Error: {e}")
