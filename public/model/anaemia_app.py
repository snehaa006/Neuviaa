import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from evaluate_anaemia import evaluate_anaemia

st.set_page_config(page_title="Anaemia Risk Predictor", layout="centered")
st.title("🤰 Pregnancy Anaemia Risk Predictor")

st.markdown("""
This tool helps assess anaemia risk during pregnancy based on symptoms and medical history.
**Note:** This is for informational purposes only and does NOT replace medical consultation.
""")

@st.cache_data
def load_data():
    """Load and prepare the dataset"""
    try:
        df = pd.read_csv("anaemia_data.csv")
        return df.dropna()
    except FileNotFoundError:
        st.error("Dataset file 'anaemia_data.csv' not found. Please ensure it's in the same directory.")
        return None

df = load_data()

# Define input fields
symptom_fields = {
    "Fatigue": "Unusual tiredness or weakness",
    "Pale_Skin": "Pale or yellowish skin",
    "Dizziness": "Frequent dizziness or lightheadedness",
    "Shortness_of_Breath": "Difficulty breathing or breathlessness",
    "Headache": "Frequent headaches",
    "Cold_Hands_Feet": "Cold hands and feet"
}

# Sidebar inputs
st.sidebar.header("📝 Enter Your Health Details")
st.sidebar.markdown("---")

user_inputs = {}

# Age input
st.sidebar.subheader("👤 Basic Information")
user_inputs['Age'] = st.sidebar.number_input(
    "Age (years)",
    min_value=18,
    max_value=50,
    value=28,
    step=1
)

# Trimester selection
user_inputs['Trimester'] = st.sidebar.selectbox(
    "Current Trimester",
    ["First", "Second", "Third"]
)

# Medical history
st.sidebar.markdown("---")
st.sidebar.subheader("🏥 Medical History")
history_selection = st.sidebar.selectbox(
    "Previous History of Anaemia",
    ["No", "Yes"]
)
user_inputs['History_of_Anaemia'] = 1 if history_selection == "Yes" else 0

# Symptoms
st.sidebar.markdown("---")
st.sidebar.subheader("🩺 Current Symptoms")
st.sidebar.markdown("*Select all symptoms you're experiencing*")

for field, label in symptom_fields.items():
    selection = st.sidebar.checkbox(label, key=field)
    user_inputs[field] = 1 if selection else 0

# Predict button
st.sidebar.markdown("---")
predict_button = st.sidebar.button("🔍 Assess Anaemia Risk", type="primary", use_container_width=True)

# Main content area
if predict_button:
    # Run evaluation
    result = evaluate_anaemia(user_inputs)
    
    # Display results
    st.header("📊 Risk Assessment Results")
    
    # Risk level with colored background
    risk_level = result['risk_level']
    probability = result['probability']
    
    col1, col2 = st.columns(2)
    
    with col1:
        if risk_level == "High Risk":
            st.error(f"### 🚨 {risk_level}")
        elif risk_level == "Moderate Risk":
            st.warning(f"### ⚠️ {risk_level}")
        else:
            st.success(f"### ✅ {risk_level}")
    
    with col2:
        st.metric("Risk Score", f"{probability}%")
    
    # Alert message
    st.markdown("---")
    if risk_level == "High Risk":
        st.error("⚠️ **HIGH RISK DETECTED** - Please consult your healthcare provider immediately for blood tests and iron supplementation.")
    elif risk_level == "Moderate Risk":
        st.warning("⚠️ **MODERATE RISK** - Schedule an appointment with your doctor for hemoglobin testing.")
    else:
        st.success("✅ **LOW RISK** - Continue with regular prenatal care and maintain iron-rich diet.")
    
    # Symptom summary
    st.markdown("---")
    col1, col2, col3 = st.columns(3)
    
    with col1:
        symptom_count = sum([v for k, v in user_inputs.items() if k in symptom_fields.keys()])
        st.metric("Symptoms Present", symptom_count)
    
    with col2:
        st.metric("Age", user_inputs['Age'])
    
    with col3:
        st.metric("Trimester", user_inputs['Trimester'])
    
    # Risk factors
    st.markdown("---")
    st.subheader("🔍 Identified Risk Factors")
    if result["reasons"]:
        risk_factor_display = [r.replace("_", " ").title() for r in result["reasons"]]
        
        # Create a nice visual display
        cols = st.columns(2)
        for i, factor in enumerate(risk_factor_display):
            with cols[i % 2]:
                st.markdown(f"- 🔴 **{factor}**")
    else:
        st.write("✅ No major risk factors detected.")
    
    # Personalized advice
    st.markdown("---")
    st.subheader("💡 Personalized Recommendations")
    for tip in result["advice"]:
        st.markdown(f"- {tip}")
    
    # Iron-rich foods info
    with st.expander("🍽️ View Iron-Rich Food Guide"):
        st.markdown("""
        **Heme Iron Sources (Better Absorbed):**
        - Red meat (beef, lamb)
        - Poultry (chicken, turkey)
        - Fish (salmon, tuna)
        - Organ meats (liver - consult doctor first during pregnancy)
        
        **Non-Heme Iron Sources:**
        - Dark leafy greens (spinach, kale)
        - Legumes (lentils, chickpeas, beans)
        - Fortified cereals and bread
        - Dried fruits (raisins, apricots)
        - Nuts and seeds
        
        **Pro Tips:**
        - ✅ Pair iron-rich foods with Vitamin C sources
        - ❌ Avoid calcium supplements with iron-rich meals
        - ❌ Don't drink tea/coffee with meals
        """)
    
    # Visualizations (only if dataset loaded)
    if df is not None:
        st.markdown("---")
        st.header("📈 Data Visualizations")
        
        # Your symptom profile
        st.subheader("📊 Your Symptom Profile")
        symptom_data = {k.replace('_', ' '): v for k, v in user_inputs.items() if k in symptom_fields.keys()}
        symptom_df = pd.DataFrame({
            'Symptom': list(symptom_data.keys()),
            'Present': list(symptom_data.values())
        })
        
        fig, ax = plt.subplots(figsize=(10, 4))
        colors = ['#FF6B6B' if x == 1 else '#95E1D3' for x in symptom_df['Present']]
        ax.barh(symptom_df['Symptom'], symptom_df['Present'], color=colors)
        ax.set_xlabel('Status (0=Absent, 1=Present)')
        ax.set_title('Your Current Symptoms')
        ax.set_xlim(0, 1.2)
        st.pyplot(fig)
        
        # Age distribution
        st.subheader("📊 Age Distribution in Dataset")
        fig, ax = plt.subplots(figsize=(10, 4))
        ax.hist(df['Age'], bins=15, color='skyblue', edgecolor='black', alpha=0.7)
        ax.axvline(user_inputs['Age'], color='red', linestyle='--', linewidth=2, label=f'Your Age: {user_inputs["Age"]}')
        ax.set_xlabel('Age')
        ax.set_ylabel('Frequency')
        ax.set_title('Age Distribution of Pregnant Women in Dataset')
        ax.legend()
        st.pyplot(fig)
        
        # Risk distribution by trimester
        st.subheader("📊 Anaemia Risk by Trimester")
        fig, ax = plt.subplots(figsize=(10, 5))
        trimester_risk = df.groupby(['Trimester', 'Anaemia_Risk']).size().unstack(fill_value=0)
        trimester_risk.plot(kind='bar', ax=ax, color=['#90EE90', '#FFB6C1'])
        ax.set_xlabel('Trimester')
        ax.set_ylabel('Number of Cases')
        ax.set_title('Anaemia Risk Distribution by Trimester')
        ax.legend(['Low Risk', 'High Risk'])
        ax.set_xticklabels(ax.get_xticklabels(), rotation=0)
        st.pyplot(fig)
        
        # Symptom correlation heatmap
        st.subheader("🌡️ Symptom Correlation Heatmap")
        fig, ax = plt.subplots(figsize=(10, 8))
        
        # Select only symptom columns for correlation
        symptom_cols = ['Fatigue', 'Pale_Skin', 'Dizziness', 'Shortness_of_Breath', 
                        'Headache', 'Cold_Hands_Feet', 'History_of_Anaemia', 'Anaemia_Risk']
        correlation_matrix = df[symptom_cols].corr()
        
        sns.heatmap(correlation_matrix, annot=True, cmap="coolwarm", fmt=".2f", 
                    ax=ax, center=0, square=True, linewidths=1, cbar_kws={"shrink": 0.8})
        plt.title("Correlation Between Symptoms and Anaemia Risk")
        plt.tight_layout()
        st.pyplot(fig)
        
        # Most common symptoms
        st.subheader("📊 Most Common Symptoms")
        symptom_prevalence = df[list(symptom_fields.keys())].sum().sort_values(ascending=False)
        fig, ax = plt.subplots(figsize=(10, 5))
        symptom_prevalence.plot(kind='bar', ax=ax, color='coral')
        ax.set_xlabel('Symptoms')
        ax.set_ylabel('Frequency')
        ax.set_title('Prevalence of Symptoms in Dataset')
        ax.set_xticklabels([s.replace('_', ' ') for s in symptom_prevalence.index], rotation=45, ha='right')
        plt.tight_layout()
        st.pyplot(fig)
        
        # Sample data
        st.subheader("📂 Sample Training Data")
        st.dataframe(df.head(10), use_container_width=True)
        
        # Dataset statistics
        with st.expander("📊 View Dataset Statistics"):
            st.write(df.describe())
            
            st.markdown("---")
            st.markdown("**Anaemia Risk Distribution:**")
            risk_dist = df['Anaemia_Risk'].value_counts()
            col1, col2 = st.columns(2)
            with col1:
                st.metric("Low Risk (0)", risk_dist.get(0, 0))
            with col2:
                st.metric("High Risk (1)", risk_dist.get(1, 0))

else:
    # Initial page content
    st.info("👈 Please fill in all your health details in the sidebar and click **'Assess Anaemia Risk'** to get your personalized risk assessment.")
    
    st.markdown("---")
    st.subheader("ℹ️ About Anaemia in Pregnancy")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        **What is Anaemia?**
        
        Anaemia during pregnancy occurs when you don't have enough healthy red blood cells to carry adequate oxygen to your tissues and your baby.
        
        **Common Causes:**
        - Iron deficiency
        - Folate deficiency
        - Vitamin B12 deficiency
        - Blood loss
        - Increased blood volume during pregnancy
        """)
    
    with col2:
        st.markdown("""
        **Risk Factors Evaluated:**
        
        - ✅ Age (very young or advanced)
        - ✅ Pregnancy trimester
        - ✅ Previous anaemia history
        - ✅ Current symptoms
        - ✅ Multiple symptom combinations
        
        **Why It Matters:**
        
        Untreated anaemia can lead to premature birth, low birth weight, and postpartum complications.
        """)
    
    st.markdown("---")
    st.subheader("🩺 Common Symptoms of Anaemia")
    
    symptom_cols = st.columns(3)
    symptoms_list = [
        ("💤", "Fatigue", "Unusual tiredness"),
        ("🤍", "Pale Skin", "Loss of color"),
        ("💫", "Dizziness", "Lightheadedness"),
        ("🫁", "Breathlessness", "Difficulty breathing"),
        ("🤕", "Headaches", "Frequent headaches"),
        ("🥶", "Cold Extremities", "Cold hands/feet")
    ]
    
    for i, (emoji, title, desc) in enumerate(symptoms_list):
        with symptom_cols[i % 3]:
            st.markdown(f"### {emoji} {title}")
            st.markdown(f"*{desc}*")
    
    st.warning("⚠️ **Disclaimer**: This tool is for educational purposes only and should not replace professional medical advice. Always consult with your healthcare provider for proper diagnosis and treatment.")

# Footer
st.markdown("---")
st.markdown("""
<div style='text-align: center; color: gray; padding: 20px;'>
    <small>Anaemia affects 38% of pregnant women worldwide according to WHO.<br>
    Early detection and treatment are crucial for maternal and fetal health.</small>
</div>
""", unsafe_allow_html=True)


# ============================================================================
# INSTRUCTIONS FOR CREATING anaemia_data.csv
# ============================================================================
"""
Save your dataset as 'anaemia_data.csv' with the following columns:
Age, Trimester, Fatigue, Pale_Skin, Dizziness, Shortness_of_Breath, 
Headache, Cold_Hands_Feet, History_of_Anaemia, Anaemia_Risk

The data from your document should be copied directly into a CSV file.
"""