# ============================================================================
# FILE 1: evaluate_miscarriage.py
# Save this as: evaluate_miscarriage.py
# ============================================================================

import pandas as pd
import numpy as np

def evaluate_miscarriage(inputs):
    """
    Evaluate miscarriage risk based on input symptoms and clinical data.
    
    Args:
        inputs (dict): Dictionary containing all health parameters
    
    Returns:
        dict: Contains risk_level, probability, reasons, and advice
    """
    
    risk_score = 0
    risk_factors = []
    
    # Age risk (optimal 20-35)
    age = inputs.get('age', 0)
    if age < 20:
        risk_score += 15
        risk_factors.append("very_young_age")
    elif age >= 35 and age < 40:
        risk_score += 20
        risk_factors.append("advanced_maternal_age")
    elif age >= 40:
        risk_score += 35
        risk_factors.append("high_maternal_age")
    
    # High blood pressure (major risk)
    if inputs.get('high_blood_pressure', 0) == 1:
        risk_score += 25
        risk_factors.append("high_blood_pressure")
    
    # Bleeding (critical symptom)
    if inputs.get('bleeding', 0) == 1:
        risk_score += 30
        risk_factors.append("bleeding")
    
    # Cramping (warning sign)
    if inputs.get('cramping', 0) == 1:
        risk_score += 20
        risk_factors.append("cramping")
    
    # Stress level (0-5 scale)
    stress = inputs.get('stress_level', 0)
    if stress >= 4:
        risk_score += 15
        risk_factors.append("high_stress")
    elif stress == 3:
        risk_score += 8
    
    # Previous miscarriage (strong predictor)
    if inputs.get('previous_miscarriage', 0) == 1:
        risk_score += 25
        risk_factors.append("previous_miscarriage")
    
    # Thyroid disorder
    if inputs.get('thyroid_disorder', 0) == 1:
        risk_score += 18
        risk_factors.append("thyroid_disorder")
    
    # Diabetes
    if inputs.get('diabetes', 0) == 1:
        risk_score += 20
        risk_factors.append("diabetes")
    
    # BMI risk
    bmi = inputs.get('BMI', 0)
    if bmi < 18.5:
        risk_score += 12
        risk_factors.append("underweight")
    elif bmi >= 30:
        risk_score += 18
        risk_factors.append("obesity")
    elif bmi >= 25:
        risk_score += 8
    
    # Smoking (major risk)
    if inputs.get('smoking', 0) == 1:
        risk_score += 22
        risk_factors.append("smoking")
    
    # Alcohol (significant risk)
    if inputs.get('alcohol', 0) == 1:
        risk_score += 20
        risk_factors.append("alcohol_consumption")
    
    # Lab hemoglobin (anemia risk)
    hemoglobin = inputs.get('lab_hemoglobin', 12.0)
    if hemoglobin < 10:
        risk_score += 20
        risk_factors.append("severe_anemia")
    elif hemoglobin < 11:
        risk_score += 12
        risk_factors.append("mild_anemia")
    
    # Lab blood sugar
    blood_sugar = inputs.get('lab_blood_sugar', 100)
    if blood_sugar >= 140:
        risk_score += 18
        risk_factors.append("high_blood_sugar")
    elif blood_sugar >= 126:
        risk_score += 10
    
    # Cap risk score at 100
    risk_score = min(risk_score, 100)
    
    # Determine risk level
    if risk_score >= 60:
        risk_level = "High Risk"
    elif risk_score >= 30:
        risk_level = "Moderate Risk"
    else:
        risk_level = "Low Risk"
    
    # Generate personalized advice
    advice = generate_advice(risk_factors, inputs)
    
    return {
        "risk_level": risk_level,
        "probability": round(risk_score, 1),
        "reasons": risk_factors,
        "advice": advice
    }


def generate_advice(risk_factors, inputs):
    """Generate personalized health advice based on risk factors."""
    
    advice_list = []
    
    if "bleeding" in risk_factors or "cramping" in risk_factors:
        advice_list.append("⚠️ URGENT: Contact your healthcare provider immediately about bleeding/cramping")
    
    if "high_blood_pressure" in risk_factors:
        advice_list.append("Monitor blood pressure daily and follow prescribed medications")
    
    if "high_stress" in risk_factors:
        advice_list.append("Practice stress reduction: meditation, prenatal yoga, or counseling")
    
    if "previous_miscarriage" in risk_factors:
        advice_list.append("Request early ultrasound monitoring and progesterone supplementation if appropriate")
    
    if "thyroid_disorder" in risk_factors:
        advice_list.append("Ensure thyroid levels are optimized with regular TSH monitoring")
    
    if "diabetes" in risk_factors or "high_blood_sugar" in risk_factors:
        advice_list.append("Maintain tight blood sugar control through diet, exercise, and medication")
    
    if "smoking" in risk_factors:
        advice_list.append("🚭 Quit smoking immediately - seek smoking cessation support")
    
    if "alcohol_consumption" in risk_factors:
        advice_list.append("🍷 Completely avoid alcohol during pregnancy")
    
    if "severe_anemia" in risk_factors or "mild_anemia" in risk_factors:
        advice_list.append("Take iron supplements and eat iron-rich foods (spinach, red meat, beans)")
    
    if "underweight" in risk_factors or "obesity" in risk_factors:
        advice_list.append("Work with a nutritionist for appropriate pregnancy weight management")
    
    if "advanced_maternal_age" in risk_factors or "high_maternal_age" in risk_factors:
        advice_list.append("Discuss additional monitoring options with your obstetrician")
    
    # General advice
    if not advice_list:
        advice_list.append("✅ Continue regular prenatal care and healthy lifestyle habits")
    
    advice_list.append("💊 Take prenatal vitamins with folic acid daily")
    advice_list.append("🏃‍♀️ Engage in moderate exercise as approved by your doctor")
    advice_list.append("😴 Get adequate rest and maintain a healthy sleep schedule")
    
    return advice_list


# ============================================================================
# FILE 2: app.py
# Save this as: app.py
# ============================================================================

import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from evaluate_miscarriage import evaluate_miscarriage

st.set_page_config(page_title="Miscarriage Risk Predictor", layout="centered")
st.title("🤰 Smart Miscarriage Risk Predictor")

st.markdown("""
This tool helps assess miscarriage risk based on medical history and current health indicators.
**Note:** This is for informational purposes only and does NOT replace medical consultation.
""")

@st.cache_data
def load_data():
    """Load and prepare the dataset"""
    try:
        df = pd.read_csv("miscarriage_data.csv")
        return df.dropna()
    except FileNotFoundError:
        st.error("Dataset file 'miscarriage_data.csv' not found. Please ensure it's in the same directory.")
        return None

df = load_data()

# Define input fields
binary_fields = {
    "high_blood_pressure": "High Blood Pressure",
    "bleeding": "Vaginal Bleeding",
    "cramping": "Abdominal Cramping",
    "previous_miscarriage": "Previous Miscarriage",
    "thyroid_disorder": "Thyroid Disorder",
    "diabetes": "Diabetes",
    "smoking": "Current Smoking",
    "alcohol": "Alcohol Consumption"
}

numeric_fields = {
    "age": {"label": "Age (years)", "min": 18, "max": 50, "value": 28},
    "stress_level": {"label": "Stress Level (0-5)", "min": 0, "max": 5, "value": 2, "step": 1},
    "BMI": {"label": "BMI (Body Mass Index)", "min": 15.0, "max": 45.0, "value": 24.0, "step": 0.1},
    "lab_hemoglobin": {"label": "Hemoglobin (g/dL)", "min": 7.0, "max": 18.0, "value": 12.5, "step": 0.1},
    "lab_blood_sugar": {"label": "Blood Sugar (mg/dL)", "min": 60, "max": 200, "value": 100, "step": 1}
}

# Sidebar inputs
st.sidebar.header("📝 Enter Your Health Details")
st.sidebar.markdown("---")

user_inputs = {}

# Numeric inputs
st.sidebar.subheader("📊 Basic Information")
for field, config in numeric_fields.items():
    if field == "stress_level":
        user_inputs[field] = st.sidebar.slider(
            config["label"],
            min_value=config["min"],
            max_value=config["max"],
            value=config["value"],
            step=config.get("step", 1)
        )
    else:
        user_inputs[field] = st.sidebar.number_input(
            config["label"],
            min_value=float(config["min"]),
            max_value=float(config["max"]),
            value=float(config["value"]),
            step=config.get("step", 1.0)
        )

# Binary inputs
st.sidebar.markdown("---")
st.sidebar.subheader("🏥 Medical History & Symptoms")
for field, label in binary_fields.items():
    selection = st.sidebar.selectbox(f"{label}", ["No", "Yes"], key=field)
    user_inputs[field] = 1 if selection == "Yes" else 0

# Predict button
st.sidebar.markdown("---")
predict_button = st.sidebar.button("🔍 Assess Risk", type="primary", use_container_width=True)

# Main content area
if predict_button:
    # Run evaluation
    result = evaluate_miscarriage(user_inputs)
    
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
        st.error("⚠️ **HIGH RISK DETECTED** - Please consult your healthcare provider immediately, especially if experiencing bleeding or cramping.")
    elif risk_level == "Moderate Risk":
        st.warning("⚠️ **MODERATE RISK** - Schedule an appointment with your doctor to discuss these risk factors.")
    else:
        st.success("✅ **LOW RISK** - Continue with regular prenatal care and maintain healthy habits.")
    
    # Risk factors
    st.markdown("---")
    st.subheader("🔍 Identified Risk Factors")
    if result["reasons"]:
        risk_factor_display = [r.replace("_", " ").title() for r in result["reasons"]]
        for i, factor in enumerate(risk_factor_display, 1):
            st.markdown(f"{i}. **{factor}**")
    else:
        st.write("✅ No major risk factors detected.")
    
    # Personalized advice
    st.markdown("---")
    st.subheader("💡 Personalized Recommendations")
    for tip in result["advice"]:
        st.markdown(f"- {tip}")
    
    # Visualizations (only if dataset loaded)
    if df is not None:
        st.markdown("---")
        st.header("📈 Data Visualizations")
        
        # Comparison chart
        st.subheader("📊 Your Values vs Dataset Average")
        numeric_only = {k: v for k, v in user_inputs.items() if isinstance(v, (int, float))}
        user_series = pd.Series(numeric_only)
        
        # Calculate average from dataset
        available_cols = [col for col in user_series.index if col in df.columns]
        if available_cols:
            average_series = df[available_cols].mean()
            comparison_df = pd.DataFrame({
                "Your Values": user_series[available_cols],
                "Dataset Average": average_series
            })
            st.bar_chart(comparison_df)
        
        # Your profile
        st.subheader("📈 Your Health Profile")
        st.line_chart(user_series)
        
        # Distribution of miscarriage risk in dataset
        st.subheader("📊 Risk Distribution in Dataset")
        fig, ax = plt.subplots(figsize=(8, 4))
        risk_counts = df['miscarriage_risk'].value_counts()
        colors = ['#90EE90', '#FFB6C1']
        ax.bar(['Low Risk', 'High Risk'], 
               [risk_counts.get(0, 0), risk_counts.get(1, 0)],
               color=colors)
        ax.set_ylabel('Number of Cases')
        ax.set_title('Dataset Risk Distribution')
        st.pyplot(fig)
        
        # Correlation heatmap
        st.subheader("🌡️ Feature Correlation Heatmap")
        fig, ax = plt.subplots(figsize=(10, 8))
        correlation_matrix = df.corr()
        sns.heatmap(correlation_matrix, annot=True, cmap="coolwarm", fmt=".2f", 
                    ax=ax, center=0, square=True, linewidths=1)
        plt.title("Correlation Between Features")
        st.pyplot(fig)
        
        # Sample data
        st.subheader("📂 Sample Training Data")
        st.dataframe(df.head(10), use_container_width=True)
        
        # Dataset statistics
        with st.expander("📊 View Dataset Statistics"):
            st.write(df.describe())

else:
    # Initial page content
    st.info("👈 Please fill in all your health details in the sidebar and click **'Assess Risk'** to get your personalized risk assessment.")
    
    st.markdown("---")
    st.subheader("ℹ️ About This Tool")
    st.markdown("""
    This risk predictor evaluates multiple factors including:
    - **Demographic factors**: Age, BMI
    - **Medical history**: Previous miscarriage, chronic conditions
    - **Current symptoms**: Bleeding, cramping
    - **Lifestyle factors**: Smoking, alcohol consumption
    - **Lab values**: Hemoglobin, blood sugar levels
    - **Psychological factors**: Stress levels
    
    The assessment provides:
    - ✅ Risk level classification
    - 📊 Numerical risk score
    - 🔍 Specific risk factors identified
    - 💡 Personalized health recommendations
    """)
    
    st.warning("⚠️ **Disclaimer**: This tool is for educational purposes only and should not replace professional medical advice. Always consult with your healthcare provider for proper diagnosis and treatment.")

# Footer
st.markdown("---")
st.markdown("""
<div style='text-align: center; color: gray; padding: 20px;'>
    <small>This tool uses evidence-based risk factors for miscarriage prediction.<br>
    Always seek immediate medical attention for concerning symptoms.</small>
</div>
""", unsafe_allow_html=True)


# ============================================================================
# FILE 3: miscarriage_data.csv
# Save this as: miscarriage_data.csv
# ============================================================================

# Copy your dataset and save it as miscarriage_data.csv
# Here's the sample data format:
"""
age,high_blood_pressure,bleeding,cramping,stress_level,previous_miscarriage,thyroid_disorder,diabetes,BMI,smoking,alcohol,lab_hemoglobin,lab_blood_sugar,miscarriage_risk
22,0,0,0,2,0,0,0,22.5,0,0,12.5,90,0
28,1,1,1,4,0,0,1,30.2,1,1,11.0,140,1
34,0,0,0,3,1,1,0,27.4,0,0,12.0,110,0
30,1,1,1,5,0,0,0,29.0,0,0,10.8,135,1
40,1,1,1,5,1,1,1,32.1,1,1,9.5,160,1
25,0,0,0,2,0,0,0,21.8,0,0,13.0,85,0
29,0,0,1,3,0,0,0,24.5,0,0,12.2,100,0
35,1,1,1,4,1,1,1,31.2,1,1,10.5,145,1
31,0,1,0,2,0,0,0,26.9,0,0,11.8,120,0
38,1,1,1,5,1,1,1,33.0,1,1,9.0,170,1
"""