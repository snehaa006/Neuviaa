import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import numpy as np

# ----------------------------
# PAGE CONFIG
# ----------------------------
st.set_page_config(page_title="Pregnancy Multi-Disease Risk Predictor", layout="wide")

# Custom CSS for better styling
st.markdown("""
<style>
    .risk-high {
        background-color: #FFEBEE;
        border-left: 5px solid #F44336;
        padding: 1rem;
        border-radius: 5px;
        margin: 1rem 0;
    }
    .risk-moderate {
        background-color: #FFF8E1;
        border-left: 5px solid #FFC107;
        padding: 1rem;
        border-radius: 5px;
        margin: 1rem 0;
    }
    .risk-low {
        background-color: #E8F5E9;
        border-left: 5px solid #4CAF50;
        padding: 1rem;
        border-radius: 5px;
        margin: 1rem 0;
    }
    .recommendation-box {
        background-color: #E3F2FD;
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #2196F3;
        margin: 0.5rem 0;
    }
</style>
""", unsafe_allow_html=True)

# ----------------------------
# TITLE
# ----------------------------
st.title("🤰 Pregnancy Multi-Disease Risk Predictor")
st.markdown("Comprehensive maternal health risk assessment based on symptoms, clinical signs, and laboratory values.")

# ----------------------------
# BASIC INFO SECTION
# ----------------------------
st.subheader("📋 Basic Information")
col1, col2, col3 = st.columns(3)
with col1:
    age = st.number_input("Age", min_value=15, max_value=50, value=26, key="age")
with col2:
    trimester = st.selectbox("Trimester", ["Unknown", "First", "Second", "Third"], key="trimester")
with col3:
    bmi = st.number_input("BMI", min_value=10.0, max_value=60.0, value=26.82, step=0.01, key="bmi")

col4, col5, col6 = st.columns(3)
with col4:
    gravida = st.number_input("No. of Pregnancies (Gravida)", min_value=0, max_value=20, value=1, key="gravida")
with col5:
    parity = st.number_input("Parity (births)", min_value=0, max_value=20, value=0, key="parity")
with col6:
    bp_sys = st.number_input("Systolic BP", min_value=60, max_value=200, value=110, key="bp_sys")

bp_dia = st.number_input("Diastolic BP", min_value=40, max_value=130, value=75, key="bp_dia")

# ----------------------------
# RISK FACTORS SECTION
# ----------------------------
st.subheader("⚠️ Risk Factors")
col1, col2, col3 = st.columns(3)
with col1:
    fhx = st.selectbox("Family history (any)", ["No", "Yes"], key="fhx")
with col2:
    pcos = st.selectbox("PCOS", ["No", "Yes"], key="pcos")
with col3:
    prev_miscarriage = st.selectbox("Previous miscarriage", ["No", "Yes"], key="prev_miscarriage")

col4, col5, col6 = st.columns(3)
with col4:
    sedentary = st.selectbox("Sedentary lifestyle", ["No", "Yes"], key="sedentary")
with col5:
    anaemia_hist = st.selectbox("Anaemia history", ["No", "Yes"], key="anaemia_hist")
with col6:
    prev_complications = st.selectbox("Previous pregnancy complications", ["No", "Yes"], key="prev_complications")

# ----------------------------
# SYMPTOMS / SIGNS SECTION
# ----------------------------
st.subheader("🩺 Symptoms / Signs")
symptoms_options = [
    "Fatigue/dizziness", "Painful/burning urination", "Lower abdominal pain",
    "Back pain", "Fever", "Blurred vision", "Fatigue", "Palpitations",
    "Shortness of breath", "Headache", "Cold hands/feet", "Swelling", "Frequent urination"
]

col1, col2 = st.columns(2)
with col1:
    symptoms_1 = st.multiselect("Select symptoms (Part 1)", symptoms_options[:7], key="symptoms_1")
with col2:
    symptoms_2 = st.multiselect("Select symptoms (Part 2)", symptoms_options[7:], key="symptoms_2")

symptoms = symptoms_1 + symptoms_2

col7, col8 = st.columns(2)
with col7:
    sys_bp_confirmed = st.number_input("Systolic BP (if confirmed high)", min_value=0, max_value=300, value=0, key="sys_bp_conf")
with col8:
    dia_bp_confirmed = st.number_input("Diastolic BP (if confirmed high)", min_value=0, max_value=200, value=0, key="dia_bp_conf")

proteinuria_select = st.selectbox("Proteinuria", ["Unknown", "Positive", "Negative"], key="proteinuria")

# ----------------------------
# THYROID & OTHER SYMPTOM SPECIFICS
# ----------------------------
st.subheader("🦋 Thyroid & Other Clinical Signs")
col1, col2, col3 = st.columns(3)
with col1:
    weight_gain = st.selectbox("Unexplained weight gain", ["No", "Yes"], key="weight_gain")
with col2:
    hair_loss = st.selectbox("Hair loss", ["No", "Yes"], key="hair_loss")
with col3:
    anaemia_history = st.selectbox("History of anaemia", ["No", "Yes"], key="anaemia_history2")

col4, col5, col6 = st.columns(3)
with col4:
    cold_intolerance = st.selectbox("Cold intolerance", ["No", "Yes"], key="cold_intolerance")
with col5:
    palpitations = st.selectbox("Palpitations", ["No", "Yes"], key="palpitations")
with col6:
    previous_uti = st.selectbox("Previous UTI", ["No", "Yes"], key="previous_uti")

col7, col8, col9 = st.columns(3)
with col7:
    constipation = st.selectbox("Constipation", ["No", "Yes"], key="constipation")
with col8:
    menstrual_irregularity = st.selectbox("Menstrual irregularity (pre-pregnancy)", ["No", "Yes"], key="menstrual_irregularity")
with col9:
    sexual_activity = st.selectbox("Sexual activity (recent)", ["No", "Yes"], key="sexual_activity")

# ----------------------------
# MENTAL HEALTH / PSYCHOSOCIAL
# ----------------------------
st.subheader("🧠 Mental Health / Psychosocial")
col1, col2 = st.columns(2)
with col1:
    stress_level = st.selectbox("Stress level", 
                                ["0 - Minimal", "1 - Low", "2 - Moderate", "3 - Severe"], key="stress_level")
with col2:
    sleep_disturbance = st.selectbox("Sleep disturbance", 
                                    ["0 - None", "1 - Mild", "2 - Moderate", "3 - Severe"], key="sleep_disturbance")

col3, col4 = st.columns(2)
with col3:
    mood_symptoms_scale = st.slider("Mood symptoms (0=None, 7=Severe)", 0, 7, 0, key="mood_symptoms")
with col4:
    social_support_scale = st.slider("Social support (0=Low, 5=High)", 0, 5, 3, key="social_support")

col5, col6 = st.columns(2)
with col5:
    edinburgh_depression = st.slider("Edinburgh Postnatal Depression Scale (0–30)", 0, 30, 0, key="edinburgh")
with col6:
    phq9_anxiety = st.slider("PHQ-9 Anxiety (0–27)", 0, 27, 0, key="phq9")

history_depression = st.selectbox("History of Depression", ["0 - No", "1 - Yes"], key="history_depression")

# ----------------------------
# GDM-SPECIFIC ADDITIONAL ITEMS
# ----------------------------
st.subheader("🍬 GDM-Specific Information")
col1, col2, col3 = st.columns(3)
with col1:
    gestational_previous = st.selectbox("Gestational diabetes in previous pregnancies", 
                                       ["0 - No", "1 - Yes"], key="gestational_previous")
with col2:
    unexplained_prenatal = st.selectbox("Unexplained prenatal loss", ["No", "Yes"], key="unexplained_prenatal")
with col3:
    excessive_thirst = st.selectbox("Excessive thirst", ["No", "Yes"], key="excessive_thirst")

col4, col5 = st.columns(2)
with col4:
    hba1c_perc = st.number_input("HbA1c % (if available)", min_value=0.0, max_value=20.0, value=0.0, step=0.1, key="hba1c")
with col5:
    large_child = st.selectbox("Large baby in previous birth", ["No", "Yes"], key="large_child")

# ----------------------------
# OPTIONAL LAB TESTS
# ----------------------------
st.subheader("🧪 Optional Laboratory Tests")
st.markdown("*Leave at 0 or select 'Unknown' if test not performed*")

col1, col2, col3 = st.columns(3)
with col1:
    ogtt_1hr = st.number_input("OGTT (1-hour) mg/dL", min_value=0.0, max_value=500.0, value=0.0, step=0.1, key="ogtt_1hr")
with col2:
    urine_wbc = st.number_input("Urine WBC count", min_value=0, max_value=1000, value=0, key="urine_wbc")
with col3:
    tsh = st.number_input("TSH mIU/L", min_value=0.0, max_value=50.0, value=0.0, step=0.1, key="tsh")

col4, col5, col6 = st.columns(3)
with col4:
    hb_val = st.number_input("Hemoglobin g/dL", min_value=0.0, max_value=20.0, value=0.0, step=0.1, key="hb_val")
with col5:
    urine_nitrite = st.selectbox("Urine Nitrite", ["Unknown", "Positive", "Negative"], key="urine_nitrite")
with col6:
    t3 = st.number_input("T3", min_value=0.0, max_value=500.0, value=0.0, step=0.1, key="t3")

col7, col8, col9 = st.columns(3)
with col7:
    hemoglobin = st.number_input("Hemoglobin (alternate) g/dL", min_value=0.0, max_value=20.0, value=0.0, step=0.1, key="hemoglobin")
with col8:
    hydration_sufficient = st.selectbox("Hydration status", ["Good", "Poor"], key="hydration")
with col9:
    t4 = st.number_input("T4", min_value=0.0, max_value=20.0, value=0.0, step=0.1, key="t4")

# ----------------------------
# EVALUATION FUNCTIONS
# ----------------------------
def calculate_risk_probabilities(inputs):
    """Calculate risk probabilities for different conditions with proper scaling"""
    risks = {}
    risk_factors = {}
    
    # UTI Risk Calculation (0-100%)
    uti_score = 0
    uti_reasons = []
    if "Painful/burning urination" in symptoms or "Frequent urination" in symptoms:
        uti_score += 35
        uti_reasons.append("Urinary symptoms present")
    if inputs['urine_wbc'] > 10:
        uti_score += 25
        uti_reasons.append(f"Elevated urine WBC count ({inputs['urine_wbc']})")
    if inputs['urine_wbc'] > 50:
        uti_score += 15
        uti_reasons.append("Very high urine WBC count")
    if inputs['urine_nitrite'] == "Positive":
        uti_score += 15
        uti_reasons.append("Positive urine nitrite")
    if inputs['previous_uti'] == "Yes":
        uti_score += 10
        uti_reasons.append("History of UTI")
    if "Fever" in symptoms:
        uti_score += 10
        uti_reasons.append("Fever present")
    if "Lower abdominal pain" in symptoms or "Back pain" in symptoms:
        uti_score += 5
        uti_reasons.append("Abdominal/back pain")
    
    risks['UTI'] = min(uti_score, 100)
    risk_factors['UTI'] = uti_reasons
    
    # Thyroid Risk Calculation (0-100%)
    thyroid_score = 0
    thyroid_reasons = []
    thyroid_type = "Normal"
    
    if inputs['tsh'] > 0:  # TSH provided
        if inputs['tsh'] > 4.5:
            thyroid_score += 40
            thyroid_reasons.append(f"Elevated TSH ({inputs['tsh']:.2f} mIU/L) - Hypothyroidism suspected")
            thyroid_type = "Hypothyroidism"
        elif inputs['tsh'] < 0.4:
            thyroid_score += 35
            thyroid_reasons.append(f"Low TSH ({inputs['tsh']:.2f} mIU/L) - Hyperthyroidism suspected")
            thyroid_type = "Hyperthyroidism"
        
        if inputs['t3'] > 0 and inputs['t3'] > 4.0:
            thyroid_score += 15
            thyroid_reasons.append(f"Elevated T3 ({inputs['t3']:.2f})")
        elif inputs['t3'] > 0 and inputs['t3'] < 1.2:
            thyroid_score += 10
            thyroid_reasons.append(f"Low T3 ({inputs['t3']:.2f})")
            
        if inputs['t4'] > 0 and inputs['t4'] > 2.5:
            thyroid_score += 15
            thyroid_reasons.append(f"Elevated T4 ({inputs['t4']:.2f})")
        elif inputs['t4'] > 0 and inputs['t4'] < 0.8:
            thyroid_score += 10
            thyroid_reasons.append(f"Low T4 ({inputs['t4']:.2f})")
    
    if inputs['palpitations'] == "Yes":
        thyroid_score += 8
        thyroid_reasons.append("Palpitations")
    if inputs['weight_gain'] == "Yes":
        thyroid_score += 7
        thyroid_reasons.append("Unexplained weight gain")
    if inputs['hair_loss'] == "Yes":
        thyroid_score += 6
        thyroid_reasons.append("Hair loss")
    if inputs['cold_intolerance'] == "Yes":
        thyroid_score += 6
        thyroid_reasons.append("Cold intolerance")
    if "Fatigue" in symptoms:
        thyroid_score += 5
        thyroid_reasons.append("Fatigue")
    if inputs['constipation'] == "Yes":
        thyroid_score += 5
        thyroid_reasons.append("Constipation")
    if inputs['menstrual_irregularity'] == "Yes":
        thyroid_score += 4
        thyroid_reasons.append("Menstrual irregularity")
    if inputs['fhx'] == "Yes":
        thyroid_score += 5
        thyroid_reasons.append("Family history")
    
    risks['Thyroid'] = min(thyroid_score, 100)
    risk_factors['Thyroid'] = thyroid_reasons
    risk_factors['Thyroid_Type'] = thyroid_type
    
    # Mental Health Risk Calculation (0-100%)
    mental_score = 0
    mental_reasons = []
    stress_val = int(inputs['stress_level'][0])
    sleep_val = int(inputs['sleep_disturbance'][0])
    
    mental_score += stress_val * 8
    if stress_val >= 2:
        mental_reasons.append(f"Moderate to severe stress (Level {stress_val})")
    
    mental_score += sleep_val * 6
    if sleep_val >= 2:
        mental_reasons.append(f"Significant sleep disturbance (Level {sleep_val})")
    
    if inputs['edinburgh'] > 13:
        mental_score += 20
        mental_reasons.append(f"High Edinburgh score ({inputs['edinburgh']}) - Depression risk")
    elif inputs['edinburgh'] > 9:
        mental_score += 10
        mental_reasons.append(f"Moderate Edinburgh score ({inputs['edinburgh']})")
    
    if inputs['phq9'] > 15:
        mental_score += 15
        mental_reasons.append(f"High PHQ-9 score ({inputs['phq9']}) - Severe anxiety")
    elif inputs['phq9'] > 10:
        mental_score += 8
        mental_reasons.append(f"Moderate PHQ-9 score ({inputs['phq9']})")
    
    mental_score += inputs['mood_symptoms'] * 3
    if inputs['mood_symptoms'] >= 5:
        mental_reasons.append(f"Significant mood symptoms (Score: {inputs['mood_symptoms']})")
    
    if inputs['social_support'] <= 2:
        mental_score += 10
        mental_reasons.append(f"Low social support (Score: {inputs['social_support']})")
    
    if inputs['history_depression'] == "1 - Yes":
        mental_score += 8
        mental_reasons.append("History of depression")
    
    risks['Mental Health'] = min(mental_score, 100)
    risk_factors['Mental Health'] = mental_reasons
    
    # Miscarriage Risk Calculation (0-100%)
    misc_score = 0
    misc_reasons = []
    if inputs['prev_miscarriage'] == "Yes":
        misc_score += 25
        misc_reasons.append("Previous miscarriage history")
    if inputs['pcos'] == "Yes":
        misc_score += 15
        misc_reasons.append("PCOS diagnosis")
    if inputs['age'] > 35:
        misc_score += 15
        misc_reasons.append(f"Advanced maternal age ({inputs['age']} years)")
    elif inputs['age'] > 40:
        misc_score += 10
        misc_reasons.append(f"Very advanced maternal age ({inputs['age']} years)")
    if inputs['unexplained_prenatal'] == "Yes":
        misc_score += 12
        misc_reasons.append("Unexplained prenatal loss")
    if inputs['prev_complications'] == "Yes":
        misc_score += 10
        misc_reasons.append("Previous pregnancy complications")
    if inputs['bmi'] < 18.5:
        misc_score += 8
        misc_reasons.append(f"Underweight (BMI: {inputs['bmi']:.1f})")
    elif inputs['bmi'] > 35:
        misc_score += 8
        misc_reasons.append(f"Obesity (BMI: {inputs['bmi']:.1f})")
    if inputs['fhx'] == "Yes":
        misc_score += 5
        misc_reasons.append("Family history")
    
    risks['Miscarriage'] = min(misc_score, 100)
    risk_factors['Miscarriage'] = misc_reasons
    
    # Anaemia Risk Calculation (0-100%)
    anaemia_score = 0
    anaemia_reasons = []
    
    # Use either hemoglobin value
    hb_value = inputs['hemoglobin'] if inputs['hemoglobin'] > 0 else inputs['hb_val']
    
    if hb_value > 0:
        if hb_value < 7:
            anaemia_score += 40
            anaemia_reasons.append(f"Severe anaemia (Hb: {hb_value:.1f} g/dL)")
        elif hb_value < 10:
            anaemia_score += 30
            anaemia_reasons.append(f"Moderate anaemia (Hb: {hb_value:.1f} g/dL)")
        elif hb_value < 11:
            anaemia_score += 20
            anaemia_reasons.append(f"Mild anaemia (Hb: {hb_value:.1f} g/dL)")
    
    if inputs['anaemia_hist'] == "Yes":
        anaemia_score += 15
        anaemia_reasons.append("History of anaemia")
    if "Fatigue/dizziness" in symptoms or "Fatigue" in symptoms:
        anaemia_score += 10
        anaemia_reasons.append("Fatigue/dizziness present")
    if "Cold hands/feet" in symptoms:
        anaemia_score += 8
        anaemia_reasons.append("Cold extremities")
    if "Shortness of breath" in symptoms:
        anaemia_score += 8
        anaemia_reasons.append("Shortness of breath")
    if "Palpitations" in symptoms:
        anaemia_score += 7
        anaemia_reasons.append("Palpitations")
    if inputs['gravida'] >= 3:
        anaemia_score += 5
        anaemia_reasons.append(f"Multiple pregnancies (Gravida: {inputs['gravida']})")
    
    risks['Anaemia'] = min(anaemia_score, 100)
    risk_factors['Anaemia'] = anaemia_reasons
    
    # Preeclampsia Risk Calculation (0-100%)
    preeclampsia_score = 0
    preeclampsia_reasons = []
    
    # Use confirmed BP if provided, otherwise use regular BP
    sys_bp = inputs['sys_bp_confirmed'] if inputs['sys_bp_confirmed'] > 0 else inputs['bp_sys']
    dia_bp = inputs['dia_bp_confirmed'] if inputs['dia_bp_confirmed'] > 0 else inputs['bp_dia']
    
    if sys_bp >= 160 or dia_bp >= 110:
        preeclampsia_score += 40
        preeclampsia_reasons.append(f"Severe hypertension (BP: {sys_bp}/{dia_bp})")
    elif sys_bp >= 140 or dia_bp >= 90:
        preeclampsia_score += 25
        preeclampsia_reasons.append(f"Hypertension (BP: {sys_bp}/{dia_bp})")
    elif sys_bp >= 130:
        preeclampsia_score += 10
        preeclampsia_reasons.append(f"Elevated BP (BP: {sys_bp}/{dia_bp})")
    
    if inputs['proteinuria'] == "Positive":
        preeclampsia_score += 25
        preeclampsia_reasons.append("Proteinuria positive")
    
    if "Blurred vision" in symptoms:
        preeclampsia_score += 10
        preeclampsia_reasons.append("Blurred vision")
    if "Headache" in symptoms:
        preeclampsia_score += 10
        preeclampsia_reasons.append("Severe headache")
    if "Swelling" in symptoms:
        preeclampsia_score += 8
        preeclampsia_reasons.append("Edema/swelling")
    if "Lower abdominal pain" in symptoms:
        preeclampsia_score += 7
        preeclampsia_reasons.append("Abdominal pain")
    
    if inputs['age'] > 35:
        preeclampsia_score += 8
        preeclampsia_reasons.append(f"Advanced maternal age ({inputs['age']})")
    if inputs['bmi'] > 30:
        preeclampsia_score += 8
        preeclampsia_reasons.append(f"Obesity (BMI: {inputs['bmi']:.1f})")
    if inputs['gravida'] == 1:
        preeclampsia_score += 5
        preeclampsia_reasons.append("First pregnancy")
    if inputs['fhx'] == "Yes":
        preeclampsia_score += 7
        preeclampsia_reasons.append("Family history")
    if inputs['prev_complications'] == "Yes":
        preeclampsia_score += 8
        preeclampsia_reasons.append("Previous complications")
    
    risks['Preeclampsia'] = min(preeclampsia_score, 100)
    risk_factors['Preeclampsia'] = preeclampsia_reasons
    
    # GDM Risk Calculation (0-100%)
    gdm_score = 0
    gdm_reasons = []
    
    if inputs['bmi'] > 30:
        gdm_score += 20
        gdm_reasons.append(f"Obesity (BMI: {inputs['bmi']:.1f})")
    elif inputs['bmi'] > 25:
        gdm_score += 10
        gdm_reasons.append(f"Overweight (BMI: {inputs['bmi']:.1f})")
    
    if inputs['gestational_previous'] == "1 - Yes":
        gdm_score += 30
        gdm_reasons.append("Previous gestational diabetes")
    
    if inputs['hba1c_perc'] > 0:
        if inputs['hba1c_perc'] >= 6.5:
            gdm_score += 35
            gdm_reasons.append(f"Elevated HbA1c ({inputs['hba1c_perc']:.1f}%) - Diabetes range")
        elif inputs['hba1c_perc'] >= 5.7:
            gdm_score += 20
            gdm_reasons.append(f"Elevated HbA1c ({inputs['hba1c_perc']:.1f}%) - Prediabetes range")
    
    if inputs['ogtt_1hr'] > 0:
        if inputs['ogtt_1hr'] >= 180:
            gdm_score += 25
            gdm_reasons.append(f"High OGTT ({inputs['ogtt_1hr']:.0f} mg/dL)")
        elif inputs['ogtt_1hr'] >= 140:
            gdm_score += 15
            gdm_reasons.append(f"Elevated OGTT ({inputs['ogtt_1hr']:.0f} mg/dL)")
    
    if inputs['excessive_thirst'] == "Yes":
        gdm_score += 10
        gdm_reasons.append("Excessive thirst (polydipsia)")
    if inputs['large_child'] == "Yes":
        gdm_score += 12
        gdm_reasons.append("History of large baby (macrosomia)")
    if inputs['unexplained_prenatal'] == "Yes":
        gdm_score += 8
        gdm_reasons.append("Unexplained prenatal loss")
    if inputs['pcos'] == "Yes":
        gdm_score += 10
        gdm_reasons.append("PCOS diagnosis")
    if inputs['fhx'] == "Yes":
        gdm_score += 10
        gdm_reasons.append("Family history of diabetes")
    if inputs['age'] > 35:
        gdm_score += 8
        gdm_reasons.append(f"Advanced maternal age ({inputs['age']})")
    if inputs['sedentary'] == "Yes":
        gdm_score += 5
        gdm_reasons.append("Sedentary lifestyle")
    
    risks['GDM'] = min(gdm_score, 100)
    risk_factors['GDM'] = gdm_reasons
    
    return risks, risk_factors

def get_recommendations(condition, probability, reasons):
    """Generate personalized recommendations based on risk level"""
    recommendations = []
    
    if probability >= 60:
        risk_level = "High"
    elif probability >= 30:
        risk_level = "Moderate"
    else:
        risk_level = "Low"
    
    # Condition-specific recommendations
    if condition == "UTI":
        if risk_level == "High":
            recommendations.append("🚨 URGENT: Consult your obstetrician immediately for urine culture and antibiotic treatment")
            recommendations.append("💊 Untreated UTI during pregnancy can lead to serious complications")
        elif risk_level == "Moderate":
            recommendations.append("⚠️ Schedule an appointment with your healthcare provider for urine analysis")
        recommendations.append("💧 Increase water intake to at least 8-10 glasses per day")
        recommendations.append("🚽 Practice proper hygiene and urinate frequently")
        recommendations.append("🍇 Consider cranberry supplements (after consulting your doctor)")
        recommendations.append("❌ Avoid holding urine for long periods")
        
    elif condition == "Thyroid":
        if risk_level == "High":
            recommendations.append("🚨 URGENT: Schedule endocrinology consultation for thyroid function tests")
            recommendations.append("💊 Thyroid disorders can affect fetal development if untreated")
        elif risk_level == "Moderate":
            recommendations.append("⚠️ Request thyroid panel (TSH, T3, T4) from your obstetrician")
        recommendations.append("🥗 Ensure adequate iodine intake through iodized salt and dairy")
        recommendations.append("💊 Consider prenatal vitamins with selenium and zinc")
        recommendations.append("📊 Monitor thyroid levels regularly throughout pregnancy")
        recommendations.append("⚖️ Maintain healthy weight through balanced diet")
        
    elif condition == "Mental Health":
        if risk_level == "High":
            recommendations.append("🚨 CRITICAL: Seek immediate mental health support - contact your healthcare provider")
            recommendations.append("📞 Consider calling a maternal mental health hotline")
            recommendations.append("👥 Involve your support system and inform family members")
        elif risk_level == "Moderate":
            recommendations.append("⚠️ Schedule consultation with a perinatal mental health specialist")
        recommendations.append("🧘 Practice stress reduction techniques (meditation, prenatal yoga)")
        recommendations.append("😴 Prioritize sleep hygiene and rest")
        recommendations.append("👥 Build and maintain strong social support network")
        recommendations.append("📝 Consider cognitive behavioral therapy (CBT) or counseling")
        recommendations.append("🚫 Avoid isolation - stay connected with loved ones")
        
    elif condition == "Miscarriage":
        if risk_level == "High":
            recommendations.append("🚨 URGENT: Discuss high-risk pregnancy management with maternal-fetal medicine specialist")
            recommendations.append("📊 Request early ultrasound monitoring and hormone level checks")
        elif risk_level == "Moderate":
            recommendations.append("⚠️ Inform your obstetrician about risk factors for closer monitoring")
        recommendations.append("🛌 Get adequate rest and avoid strenuous activities")
        recommendations.append("🚭 Avoid smoking, alcohol, and recreational drugs completely")
        recommendations.append("💊 Take prenatal vitamins with folic acid daily")
        recommendations.append("⚖️ Maintain healthy weight and avoid extreme diets")
        recommendations.append("☕ Limit caffeine intake to less than 200mg per day")
        recommendations.append("🧘 Manage stress through relaxation techniques")
        
    elif condition == "Anaemia":
        if risk_level == "High":
            recommendations.append("🚨 URGENT: Immediate iron supplementation and follow-up hemoglobin testing required")
            recommendations.append("💉 Severe anaemia may require IV iron therapy or blood transfusion")
        elif risk_level == "Moderate":
            recommendations.append("⚠️ Start oral iron supplements as prescribed by your doctor")
        recommendations.append("🥩 Increase iron-rich foods: red meat, spinach, lentils, fortified cereals")
        recommendations.append("🍊 Take iron supplements with vitamin C for better absorption")
        recommendations.append("☕ Avoid tea/coffee with meals as they inhibit iron absorption")
        recommendations.append("🥗 Include folate-rich foods: leafy greens, beans, citrus fruits")
        recommendations.append("📊 Regular hemoglobin monitoring throughout pregnancy")
        
    elif condition == "Preeclampsia":
        if risk_level == "High":
            recommendations.append("🚨 CRITICAL: Immediate obstetric evaluation required - potential hospitalization")
            recommendations.append("💊 May require antihypertensive medication and close fetal monitoring")
            recommendations.append("🏥 Be prepared for possible early delivery if condition worsens")
        elif risk_level == "Moderate":
            recommendations.append("⚠️ Schedule frequent prenatal visits for blood pressure monitoring")
            recommendations.append("🧪 Regular urine protein and blood work monitoring needed")
        recommendations.append("🧂 Reduce sodium intake and maintain balanced diet")
        recommendations.append("⚖️ Monitor weight gain and watch for sudden swelling")
        recommendations.append("📊 Check blood pressure regularly at home if possible")
        recommendations.append("🚨 Watch for warning signs: severe headache, vision changes, upper abdominal pain")
        recommendations.append("🛌 Get adequate rest and elevate legs when resting")
        recommendations.append("💧 Stay well hydrated")
        
    elif condition == "GDM":
        if risk_level == "High":
            recommendations.append("🚨 URGENT: Schedule glucose tolerance test and endocrinology consultation")
            recommendations.append("📊 May require insulin therapy or medication management")
        elif risk_level == "Moderate":
            recommendations.append("⚠️ Request glucose screening test from your obstetrician")
        recommendations.append("🍽️ Follow diabetic diet: limit simple carbs, focus on complex carbs and fiber")
        recommendations.append("🚶 Exercise regularly: 30 minutes of moderate activity daily (after doctor approval)")
        recommendations.append("📊 Monitor blood glucose levels as directed")
        recommendations.append("⚖️ Maintain healthy weight gain during pregnancy")
        recommendations.append("🥗 Eat smaller, frequent meals throughout the day")
        recommendations.append("🍬 Avoid sugary drinks and processed foods")
        recommendations.append("👶 Regular fetal monitoring for macrosomia (large baby)")
    
    return recommendations, risk_level

def create_risk_chart(risks):
    """Create horizontal bar chart for risk probabilities"""
    conditions = list(risks.keys())
    probabilities = [risks[c] for c in conditions]
    
    # Sort by probability
    sorted_data = sorted(zip(conditions, probabilities), key=lambda x: x[1], reverse=True)
    conditions, probabilities = zip(*sorted_data)
    
    # Create color scale
    colors = ['#F44336' if p >= 60 else '#FFC107' if p >= 30 else '#4CAF50' for p in probabilities]
    
    fig = go.Figure(go.Bar(
        x=probabilities,
        y=conditions,
        orientation='h',
        marker=dict(color=colors),
        text=[f"{p:.1f}%" for p in probabilities],
        textposition='outside',
    ))
    
    fig.update_layout(
        title="Risk Probability Assessment",
        xaxis_title="Risk Probability (%)",
        yaxis_title="",
        height=400,
        showlegend=False,
        xaxis=dict(range=[0, 105]),
        margin=dict(l=150, r=50, t=50, b=50)
    )
    
    return fig

# ----------------------------
# PREDICTION BUTTON
# ----------------------------
if st.button("🔍 Predict Risk Assessment", 
             use_container_width=True, type="primary"):
    
    # Collect all inputs
    inputs = {
        'age': age,
        'trimester': trimester,
        'bmi': bmi,
        'gravida': gravida,
        'parity': parity,
        'bp_sys': bp_sys,
        'bp_dia': bp_dia,
        'fhx': fhx,
        'pcos': pcos,
        'prev_miscarriage': prev_miscarriage,
        'sedentary': sedentary,
        'anaemia_hist': anaemia_hist,
        'prev_complications': prev_complications,
        'sys_bp_confirmed': sys_bp_confirmed,
        'dia_bp_confirmed': dia_bp_confirmed,
        'proteinuria': proteinuria_select,
        'urine_wbc': urine_wbc,
        'urine_nitrite': urine_nitrite,
        'tsh': tsh,
        'hemoglobin': hemoglobin,
        'hb_val': hb_val,
        'palpitations': palpitations,
        'weight_gain': weight_gain,
        'hair_loss': hair_loss,
        'cold_intolerance': cold_intolerance,
        'previous_uti': previous_uti,
        'gestational_previous': gestational_previous,
        'excessive_thirst': excessive_thirst,
        'unexplained_prenatal': unexplained_prenatal,
        'large_child': large_child,
        'stress_level': stress_level,
        'sleep_disturbance': sleep_disturbance,
        'mood_symptoms': mood_symptoms_scale,
        'social_support': social_support_scale,
        'edinburgh': edinburgh_depression,
        'phq9': phq9_anxiety,
        'history_depression': history_depression,
        'constipation': constipation,
        'menstrual_irregularity': menstrual_irregularity,
        'hba1c_perc': hba1c_perc,
        'ogtt_1hr': ogtt_1hr,
        't3': t3,
        't4': t4
    }
    
    # Calculate risks
    with st.spinner("🔬 Analyzing maternal health indicators..."):
        risks, risk_factors = calculate_risk_probabilities(inputs)
    
    st.success("✅ Risk Assessment Complete")
    
    st.markdown("---")
    st.header("📊 Your Maternal Health Risk Assessment")
    
    # Display high-risk alerts first
    high_risks = [(k, v) for k, v in risks.items() if v >= 60]
    moderate_risks = [(k, v) for k, v in risks.items() if 30 <= v < 60]
    low_risks = [(k, v) for k, v in risks.items() if v < 30]
    
    if high_risks:
        st.markdown("### 🚨 High Risk Conditions")
        for condition, prob in high_risks:
            recs, level = get_recommendations(condition, prob, risk_factors[condition])
            thyroid_type = ""
            if condition == "Thyroid" and 'Thyroid_Type' in risk_factors:
                thyroid_type = f" ({risk_factors['Thyroid_Type']})"
            
            st.markdown(f"""
            <div class="risk-high">
                <h3 style="color: #F44336; margin: 0;">⚠️ {condition}{thyroid_type}</h3>
                <h2 style="color: #F44336; margin: 10px 0;">{prob:.1f}% Risk Probability</h2>
                <p style="margin: 0; font-weight: bold;">IMMEDIATE MEDICAL ATTENTION RECOMMENDED</p>
            </div>
            """, unsafe_allow_html=True)
            
            if risk_factors[condition]:
                st.markdown("**🔎 Detected Risk Factors:**")
                for reason in risk_factors[condition]:
                    st.markdown(f"- {reason}")
    
    if moderate_risks:
        st.markdown("### ⚠️ Moderate Risk Conditions")
        for condition, prob in moderate_risks:
            recs, level = get_recommendations(condition, prob, risk_factors[condition])
            thyroid_type = ""
            if condition == "Thyroid" and 'Thyroid_Type' in risk_factors:
                thyroid_type = f" ({risk_factors['Thyroid_Type']})"
            
            st.markdown(f"""
            <div class="risk-moderate">
                <h3 style="color: #FFC107; margin: 0;">⚠️ {condition}{thyroid_type}</h3>
                <h2 style="color: #FFC107; margin: 10px 0;">{prob:.1f}% Risk Probability</h2>
                <p style="margin: 0;">Medical evaluation advised</p>
            </div>
            """, unsafe_allow_html=True)
            
            if risk_factors[condition]:
                st.markdown("**🔎 Detected Risk Factors:**")
                for reason in risk_factors[condition]:
                    st.markdown(f"- {reason}")
    
    if low_risks:
        st.markdown("### ✅ Low Risk Conditions")
        for condition, prob in low_risks:
            st.markdown(f"""
            <div class="risk-low">
                <h4 style="color: #4CAF50; margin: 0;">{condition}: {prob:.1f}%</h4>
                <p style="margin: 5px 0; font-size: 0.9em;">No immediate concern - continue routine monitoring</p>
            </div>
            """, unsafe_allow_html=True)
    
    # Create and display chart
    st.markdown("---")
    st.markdown("### 📊 Risk Probability Visualization")
    fig = create_risk_chart(risks)
    st.plotly_chart(fig, use_container_width=True)
    
    # Personalized Recommendations
    st.markdown("---")
    st.markdown("## 💡 Personalized Recommendations")
    
    # Show recommendations for high and moderate risk conditions
    all_risk_conditions = high_risks + moderate_risks
    
    if all_risk_conditions:
        for condition, prob in all_risk_conditions:
            st.markdown(f"### {condition} Management")
            recs, level = get_recommendations(condition, prob, risk_factors[condition])
            
            for rec in recs:
                if "URGENT" in rec or "CRITICAL" in rec:
                    st.error(rec)
                elif "⚠️" in rec:
                    st.warning(rec)
                else:
                    st.markdown(f"""
                    <div class="recommendation-box">
                        {rec}
                    </div>
                    """, unsafe_allow_html=True)
    else:
        st.success("✅ No high or moderate risk factors detected. Continue routine prenatal care.")
        st.info("💡 **General Pregnancy Health Tips:**\n- Attend all scheduled prenatal appointments\n- Take prenatal vitamins daily\n- Maintain balanced diet and healthy weight\n- Stay physically active with approved exercises\n- Get adequate rest and manage stress\n- Avoid alcohol, smoking, and recreational drugs")
    
    # Profile Summary
    st.markdown("---")
    st.markdown("## 👤 Your Profile Summary")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("**Basic Information**")
        st.markdown(f"- Age: {age} years")
        st.markdown(f"- BMI: {bmi:.1f}")
        st.markdown(f"- Trimester: {trimester}")
        st.markdown(f"- Gravida: {gravida}")
        st.markdown(f"- Parity: {parity}")
    
    with col2:
        st.markdown("**Vital Signs**")
        st.markdown(f"- Blood Pressure: {bp_sys}/{bp_dia} mmHg")
        symptom_count = len(symptoms)
        st.markdown(f"- Symptoms Reported: {symptom_count}")
        
        # Count risk factors
        risk_factor_count = sum([
            1 for val in [fhx, pcos, prev_miscarriage, sedentary, 
                         anaemia_hist, prev_complications] if val == "Yes"
        ])
        st.markdown(f"- Risk Factors: {risk_factor_count}")
    
    with col3:
        st.markdown("**Laboratory Values**")
        if tsh > 0:
            st.markdown(f"- TSH: {tsh:.2f} mIU/L")
        if hemoglobin > 0 or hb_val > 0:
            hb = hemoglobin if hemoglobin > 0 else hb_val
            st.markdown(f"- Hemoglobin: {hb:.1f} g/dL")
        if hba1c_perc > 0:
            st.markdown(f"- HbA1c: {hba1c_perc:.1f}%")
        if ogtt_1hr > 0:
            st.markdown(f"- OGTT (1hr): {ogtt_1hr:.0f} mg/dL")
        if urine_wbc > 0:
            st.markdown(f"- Urine WBC: {urine_wbc}")
    
    # Mental Health Summary
    st.markdown("---")
    st.markdown("## 🧠 Mental Health & Wellbeing")
    
    col1, col2 = st.columns(2)
    
    with col1:
        stress_val = int(stress_level[0])
        sleep_val = int(sleep_disturbance[0])
        
        st.markdown(f"**Stress Level:** {stress_level}")
        st.markdown(f"**Sleep Quality:** {sleep_disturbance}")
        st.markdown(f"**Mood Symptoms Score:** {mood_symptoms_scale}/7")
    
    with col2:
        st.markdown(f"**Social Support:** {social_support_scale}/5")
        st.markdown(f"**Edinburgh Depression Scale:** {edinburgh_depression}/30")
        st.markdown(f"**PHQ-9 Anxiety:** {phq9_anxiety}/27")
    
    # Download report
    st.markdown("---")
    
    report_text = f"""
PREGNANCY MULTI-DISEASE RISK ASSESSMENT REPORT
==============================================
Date: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')}

PATIENT INFORMATION
-------------------
Age: {age} years
BMI: {bmi:.1f}
Trimester: {trimester}
Gravida: {gravida}
Parity: {parity}
Blood Pressure: {bp_sys}/{bp_dia} mmHg

RISK ASSESSMENT RESULTS
-----------------------
"""
    
    for condition, prob in sorted(risks.items(), key=lambda x: x[1], reverse=True):
        if prob >= 60:
            level = "HIGH RISK"
        elif prob >= 30:
            level = "MODERATE RISK"
        else:
            level = "LOW RISK"
        
        report_text += f"\n{condition}: {prob:.1f}% - {level}\n"
        
        if risk_factors[condition]:
            report_text += "Risk Factors:\n"
            for reason in risk_factors[condition]:
                report_text += f"  - {reason}\n"
        
        if prob >= 30:
            recs, _ = get_recommendations(condition, prob, risk_factors[condition])
            report_text += "Recommendations:\n"
            for rec in recs:
                clean_rec = rec.replace("🚨", "").replace("⚠️", "").replace("💊", "").replace("💧", "").replace("🚽", "").replace("🍇", "").replace("❌", "").strip()
                report_text += f"  - {clean_rec}\n"
    
    report_text += f"""

MENTAL HEALTH ASSESSMENT
-------------------------
Stress Level: {stress_level}
Sleep Disturbance: {sleep_disturbance}
Mood Symptoms: {mood_symptoms_scale}/7
Social Support: {social_support_scale}/5
Edinburgh Depression Scale: {edinburgh_depression}/30
PHQ-9 Anxiety: {phq9_anxiety}/27
History of Depression: {history_depression}

LABORATORY VALUES
-----------------
"""
    
    if tsh > 0:
        report_text += f"TSH: {tsh:.2f} mIU/L\n"
    if t3 > 0:
        report_text += f"T3: {t3:.2f}\n"
    if t4 > 0:
        report_text += f"T4: {t4:.2f}\n"
    if hemoglobin > 0 or hb_val > 0:
        hb = hemoglobin if hemoglobin > 0 else hb_val
        report_text += f"Hemoglobin: {hb:.1f} g/dL\n"
    if hba1c_perc > 0:
        report_text += f"HbA1c: {hba1c_perc:.1f}%\n"
    if ogtt_1hr > 0:
        report_text += f"OGTT (1-hour): {ogtt_1hr:.0f} mg/dL\n"
    if urine_wbc > 0:
        report_text += f"Urine WBC: {urine_wbc}\n"
    
    report_text += """

==============================================
MEDICAL DISCLAIMER: This is an automated risk assessment tool for 
informational purposes only. It does not replace professional medical 
advice, diagnosis, or treatment. Always consult with qualified healthcare 
providers for proper evaluation and management.
==============================================
"""
    
    st.download_button(
        label="📥 Download Complete Assessment Report",
        data=report_text,
        file_name=f"Pregnancy_Risk_Report_{pd.Timestamp.now().strftime('%Y%m%d_%H%M%S')}.txt",
        mime="text/plain",
        use_container_width=True
    )

else:
    # Welcome screen
    st.markdown("---")
    st.info("👉 **Get Started:** Fill in your health information above, then click 'Predict Risk Assessment' to receive your personalized maternal health evaluation.")
    
    st.markdown("### 🏥 About This Tool")
    st.markdown("""
    This comprehensive risk predictor evaluates multiple pregnancy-related conditions:
    
    - **UTI (Urinary Tract Infection)** - Bacterial infection of urinary system
    - **Thyroid Disorders** - Hypothyroidism and Hyperthyroidism
    - **Mental Health** - Depression, anxiety, and stress assessment
    - **Miscarriage Risk** - Early pregnancy loss risk factors
    - **Anaemia** - Low hemoglobin levels
    - **Preeclampsia** - High blood pressure with organ damage
    - **GDM (Gestational Diabetes)** - Pregnancy-related diabetes
    
    The tool uses clinical symptoms, vital signs, laboratory values, and risk factors 
    to provide probability-based risk assessment with personalized recommendations.
    """)
    
    st.markdown("### ⚕️ Clinical Guidelines")
    st.markdown("""
    **Risk Levels:**
    - 🔴 **High Risk (60-100%)**: Immediate medical attention required
    - 🟡 **Moderate Risk (30-59%)**: Medical evaluation advised
    - 🟢 **Low Risk (0-29%)**: Continue routine prenatal care
    """)

# Footer
st.markdown("---")
st.markdown("""
<div style="text-align: center; padding: 2rem; background-color: #F5F5F5; border-radius: 10px;">
    <p style="font-size: 1.2rem; font-weight: bold; color: #E91E63;">🤰 Pregnancy Multi-Disease Risk Predictor</p>
    <p style="font-size: 0.9rem; color: #666;">
        ⚠️ <strong>Medical Disclaimer:</strong> This tool is for informational and screening purposes only. 
        It does not replace professional medical advice, diagnosis, or treatment. Always consult with 
        qualified healthcare providers including obstetricians, maternal-fetal medicine specialists, 
        and other relevant specialists for proper diagnosis and management.
    </p>
    <p style="font-size: 0.85rem; color: #888; margin-top: 1rem;">
        Developed for Maternal Health Risk Assessment | AI-Enhanced Screening | 2025
    </p>
</div>
""", unsafe_allow_html=True)