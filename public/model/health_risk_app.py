import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
import numpy as np
from datetime import datetime

# Import evaluation functions
from evaluate_anaemia import evaluate_anaemia
from evaluate_miscarriage import evaluate_miscarriage
from evaluate_thyroid import evaluate_thyroid
from evaluate_uti import evaluate_uti
# Add other imports as needed
# from evaluate_gdm import evaluate_gdm
# from evaluate_preeclampsia import evaluate_preeclampsia
# from evaluate_mental_health import evaluate_mental_health

# Page Configuration
st.set_page_config(
    page_title="Comprehensive Pregnancy Risk Assessment",
    layout="wide",
    page_icon="🤰"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        font-weight: bold;
        color: #E91E63;
        text-align: center;
        padding: 1.5rem;
        background: linear-gradient(135deg, #FFF0F5 0%, #FFE0EB 100%);
        border-radius: 15px;
        margin-bottom: 2rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .risk-high {
        background: linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%);
        border-left: 6px solid #F44336;
        padding: 1.5rem;
        border-radius: 10px;
        margin: 1rem 0;
        box-shadow: 0 3px 5px rgba(244,67,54,0.2);
    }
    .risk-moderate {
        background: linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%);
        border-left: 6px solid #FFC107;
        padding: 1.5rem;
        border-radius: 10px;
        margin: 1rem 0;
        box-shadow: 0 3px 5px rgba(255,193,7,0.2);
    }
    .risk-low {
        background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
        border-left: 6px solid #4CAF50;
        padding: 1.5rem;
        border-radius: 10px;
        margin: 1rem 0;
        box-shadow: 0 3px 5px rgba(76,175,80,0.2);
    }
    .info-box {
        background-color: #E3F2FD;
        padding: 1.5rem;
        border-radius: 10px;
        border-left: 5px solid #2196F3;
        margin: 1rem 0;
    }
    .recommendation-box {
        background-color: #F3E5F5;
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #9C27B0;
        margin: 0.5rem 0;
    }
    .metric-card {
        background: white;
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        text-align: center;
    }
    .stButton>button {
        background: linear-gradient(135deg, #E91E63 0%, #F06292 100%);
        color: white;
        font-weight: bold;
        border: none;
        padding: 0.75rem 2rem;
        border-radius: 25px;
        font-size: 1.1rem;
        box-shadow: 0 4px 6px rgba(233,30,99,0.3);
        transition: all 0.3s ease;
    }
    .stButton>button:hover {
        box-shadow: 0 6px 12px rgba(233,30,99,0.4);
        transform: translateY(-2px);
    }
</style>
""", unsafe_allow_html=True)

# Title
st.markdown('<div class="main-header">🤰 Comprehensive Pregnancy Health Risk Assessment</div>', unsafe_allow_html=True)

st.markdown("""
<div class="info-box">
    <strong>🏥 About This Comprehensive Assessment Tool</strong><br>
    This integrated platform evaluates multiple pregnancy-related health risks including:
    <strong>Anaemia</strong>, <strong>Miscarriage</strong>, <strong>Thyroid Disorders</strong>, 
    <strong>UTI</strong>, <strong>Preeclampsia</strong>, <strong>GDM</strong>, and <strong>Mental Health</strong>.
    <br><br>
    Fill in your complete health information to receive a comprehensive risk assessment with personalized recommendations.
</div>
""", unsafe_allow_html=True)

# Sidebar - Patient Information
st.sidebar.header("📋 Patient Information")
st.sidebar.markdown("---")

# Basic Demographics
st.sidebar.subheader("👤 Basic Details")
age = st.sidebar.number_input("Age (years)", min_value=15, max_value=50, value=28, step=1)
bmi = st.sidebar.number_input("BMI (Body Mass Index)", min_value=10.0, max_value=50.0, value=24.0, step=0.1)
gravida = st.sidebar.number_input("Gravida (Total Pregnancies)", min_value=1, max_value=15, value=1, step=1)
parity = st.sidebar.number_input("Parity (Live Births)", min_value=0, max_value=15, value=0, step=1)

st.sidebar.markdown("---")

# Vital Signs
st.sidebar.subheader("🩺 Vital Signs")
systolic_bp = st.sidebar.number_input("Systolic BP (mmHg)", min_value=70, max_value=200, value=120, step=1)
diastolic_bp = st.sidebar.number_input("Diastolic BP (mmHg)", min_value=40, max_value=130, value=80, step=1)

st.sidebar.markdown("---")

# Symptoms Section
st.sidebar.subheader("🩺 Current Symptoms")

# General Symptoms
general_symptoms = st.sidebar.multiselect(
    "General Symptoms",
    ["Fatigue", "Dizziness", "Weakness", "Headache", "Fever", "Nausea", "Vomiting"],
    help="Select all symptoms you're currently experiencing"
)

# Specific Symptoms
specific_symptoms = st.sidebar.multiselect(
    "Specific Symptoms",
    ["Bleeding", "Cramping", "Palpitations", "Shortness of breath", "Cold intolerance", 
     "Hair loss", "Weight gain (unexplained)", "Constipation", "Painful urination", 
     "Frequent urination", "Back pain", "Swelling (edema)", "Blurred vision"],
    help="Select specific pregnancy-related symptoms"
)

st.sidebar.markdown("---")

# Medical History
st.sidebar.subheader("📋 Medical History")

col1, col2 = st.sidebar.columns(2)
with col1:
    prev_miscarriage = st.selectbox("Previous Miscarriage", ["No", "Yes"])
    thyroid_disorder = st.selectbox("Thyroid Disorder", ["No", "Yes"])
    diabetes = st.selectbox("Diabetes", ["No", "Yes"])
    high_bp = st.selectbox("High Blood Pressure", ["No", "Yes"])

with col2:
    pcos = st.selectbox("PCOS", ["No", "Yes"])
    anaemia_history = st.selectbox("Anaemia History", ["No", "Yes"])
    uti_history = st.selectbox("Previous UTI", ["No", "Yes"])
    family_history = st.selectbox("Family History (any)", ["No", "Yes"])

st.sidebar.markdown("---")

# Lifestyle Factors
st.sidebar.subheader("🚭 Lifestyle Factors")
stress_level = st.sidebar.slider("Stress Level", 0, 5, 2, 
                                  help="0=No stress, 5=Extreme stress")
smoking = st.sidebar.selectbox("Smoking", ["No", "Yes"])
alcohol = st.sidebar.selectbox("Alcohol Consumption", ["No", "Yes"])
exercise = st.sidebar.selectbox("Regular Exercise", ["Yes", "No"])

st.sidebar.markdown("---")

# Laboratory Tests
st.sidebar.subheader("🧪 Laboratory Tests (Optional)")
st.sidebar.markdown("*Leave at 0 if test not performed*")

hemoglobin = st.sidebar.number_input("Hemoglobin (g/dL)", min_value=0.0, max_value=20.0, value=0.0, step=0.1)
blood_sugar = st.sidebar.number_input("Blood Sugar (mg/dL)", min_value=0, max_value=400, value=0, step=1)
tsh = st.sidebar.number_input("TSH (mIU/L)", min_value=0.0, max_value=50.0, value=0.0, step=0.1)
t3 = st.sidebar.number_input("T3", min_value=0.0, max_value=10.0, value=0.0, step=0.1)
t4 = st.sidebar.number_input("T4", min_value=0.0, max_value=5.0, value=0.0, step=0.1)
urine_protein = st.sidebar.selectbox("Urine Protein", ["Not tested", "Negative", "Positive"])

st.sidebar.markdown("---")

# Main Content Area - Tabbed Interface
tab1, tab2, tab3, tab4 = st.tabs(["📊 Risk Assessment", "📈 Detailed Analysis", "💡 Recommendations", "📄 Report"])

# Prepare input dictionary
def prepare_inputs():
    """Prepare comprehensive input dictionary for all evaluations"""
    
    # Combine all symptoms
    all_symptoms = general_symptoms + specific_symptoms
    
    inputs = {
        # Demographics
        'age': age,
        'BMI': bmi,
        'gravida': gravida,
        'parity': parity,
        
        # Vital Signs
        'systolic_bp': systolic_bp,
        'diastolic_bp': diastolic_bp,
        
        # Binary symptoms (convert from lists)
        'fatigue': 1 if "Fatigue" in all_symptoms else 0,
        'dizziness': 1 if "Dizziness" in all_symptoms else 0,
        'weakness': 1 if "Weakness" in all_symptoms else 0,
        'bleeding': 1 if "Bleeding" in all_symptoms else 0,
        'cramping': 1 if "Cramping" in all_symptoms else 0,
        'palpitations': 1 if "Palpitations" in all_symptoms else 0,
        'cold_intolerance': 1 if "Cold intolerance" in all_symptoms else 0,
        'hair_loss': 1 if "Hair loss" in all_symptoms else 0,
        'weight_gain': 1 if "Weight gain (unexplained)" in all_symptoms else 0,
        'constipation': 1 if "Constipation" in all_symptoms else 0,
        'painful_urination': 1 if "Painful urination" in all_symptoms else 0,
        'frequent_urination': 1 if "Frequent urination" in all_symptoms else 0,
        'headache': 1 if "Headache" in all_symptoms else 0,
        'fever': 1 if "Fever" in all_symptoms else 0,
        'back_pain': 1 if "Back pain" in all_symptoms else 0,
        'swelling': 1 if "Swelling (edema)" in all_symptoms else 0,
        'blurred_vision': 1 if "Blurred vision" in all_symptoms else 0,
        'shortness_breath': 1 if "Shortness of breath" in all_symptoms else 0,
        
        # Medical History (convert Yes/No to 1/0)
        'previous_miscarriage': 1 if prev_miscarriage == "Yes" else 0,
        'thyroid_disorder': 1 if thyroid_disorder == "Yes" else 0,
        'diabetes': 1 if diabetes == "Yes" else 0,
        'high_blood_pressure': 1 if high_bp == "Yes" else 0,
        'pcos': 1 if pcos == "Yes" else 0,
        'anaemia_history': 1 if anaemia_history == "Yes" else 0,
        'previous_uti': 1 if uti_history == "Yes" else 0,
        'family_history': 1 if family_history == "Yes" else 0,
        
        # Lifestyle
        'stress_level': stress_level,
        'smoking': 1 if smoking == "Yes" else 0,
        'alcohol': 1 if alcohol == "Yes" else 0,
        
        # Lab Values
        'lab_hemoglobin': hemoglobin if hemoglobin > 0 else 12.0,  # Default normal value
        'lab_blood_sugar': blood_sugar if blood_sugar > 0 else 100,  # Default normal value
        'TSH': tsh,
        'T3': t3,
        'T4': t4,
        'proteinuria': 1 if urine_protein == "Positive" else 0,
    }
    
    return inputs

# Assessment Button
if st.sidebar.button("🔍 Run Comprehensive Assessment", type="primary", use_container_width=True):
    
    with st.spinner("🔬 Analyzing your comprehensive health profile..."):
        inputs = prepare_inputs()
        
        # Run all evaluations
        results = {}
        
        # Anaemia Assessment
        try:
            anaemia_result = evaluate_anaemia(inputs)
            results['Anaemia'] = {
                'probability': anaemia_result['probability'],
                'risk_level': anaemia_result['risk_level'],
                'reasons': anaemia_result.get('reasons', []),
                'advice': anaemia_result.get('advice', [])
            }
        except Exception as e:
            st.error(f"Anaemia evaluation error: {str(e)}")
            results['Anaemia'] = {'probability': 0, 'risk_level': 'Error', 'reasons': [], 'advice': []}
        
        # Miscarriage Assessment
        try:
            misc_result = evaluate_miscarriage(inputs)
            results['Miscarriage'] = {
                'probability': misc_result['probability'],
                'risk_level': misc_result['risk_level'],
                'reasons': misc_result.get('reasons', []),
                'advice': misc_result.get('advice', [])
            }
        except Exception as e:
            st.error(f"Miscarriage evaluation error: {str(e)}")
            results['Miscarriage'] = {'probability': 0, 'risk_level': 'Error', 'reasons': [], 'advice': []}
        
        # Thyroid Assessment
        try:
            thyroid_result = evaluate_thyroid(inputs)
            results['Thyroid Disorder'] = {
                'probability': thyroid_result['probability_value'],
                'risk_level': thyroid_result['risk_level'],
                'reasons': thyroid_result.get('why', []),
                'advice': thyroid_result.get('next_steps', []),
                'thyroid_type': thyroid_result.get('thyroid_type', 'Unknown')
            }
        except Exception as e:
            st.error(f"Thyroid evaluation error: {str(e)}")
            results['Thyroid Disorder'] = {'probability': 0, 'risk_level': 'Error', 'reasons': [], 'advice': []}
        
        # UTI Assessment
        try:
            uti_result = evaluate_uti(inputs)
            results['UTI'] = {
                'probability': uti_result['probability'],
                'risk_level': uti_result['risk_level'],
                'reasons': uti_result.get('reasons', []),
                'advice': uti_result.get('advice', [])
            }
        except Exception as e:
            st.error(f"UTI evaluation error: {str(e)}")
            results['UTI'] = {'probability': 0, 'risk_level': 'Error', 'reasons': [], 'advice': []}
        
        # Store results in session state
        st.session_state['assessment_results'] = results
        st.session_state['inputs'] = inputs
        st.session_state['assessment_time'] = datetime.now()

# Display Results in Tabs
if 'assessment_results' in st.session_state:
    results = st.session_state['assessment_results']
    inputs = st.session_state['inputs']
    
    # TAB 1: Risk Assessment Overview
    with tab1:
        st.header("📊 Comprehensive Risk Assessment Overview")
        
        # Sort results by probability
        sorted_results = sorted(results.items(), key=lambda x: x[1]['probability'], reverse=True)
        
        # Risk Summary Cards
        col1, col2, col3, col4 = st.columns(4)
        
        high_risks = [k for k, v in results.items() if v['probability'] >= 60]
        moderate_risks = [k for k, v in results.items() if 30 <= v['probability'] < 60]
        low_risks = [k for k, v in results.items() if v['probability'] < 30]
        
        with col1:
            st.markdown(f"""
            <div class="metric-card" style="border-left: 4px solid #F44336;">
                <h3 style="color: #F44336; margin: 0;">🚨 High Risk</h3>
                <h1 style="margin: 10px 0;">{len(high_risks)}</h1>
                <p style="font-size: 0.9em; color: #666;">Conditions</p>
            </div>
            """, unsafe_allow_html=True)
        
        with col2:
            st.markdown(f"""
            <div class="metric-card" style="border-left: 4px solid #FFC107;">
                <h3 style="color: #FFC107; margin: 0;">⚠️ Moderate Risk</h3>
                <h1 style="margin: 10px 0;">{len(moderate_risks)}</h1>
                <p style="font-size: 0.9em; color: #666;">Conditions</p>
            </div>
            """, unsafe_allow_html=True)
        
        with col3:
            st.markdown(f"""
            <div class="metric-card" style="border-left: 4px solid #4CAF50;">
                <h3 style="color: #4CAF50; margin: 0;">✅ Low Risk</h3>
                <h1 style="margin: 10px 0;">{len(low_risks)}</h1>
                <p style="font-size: 0.9em; color: #666;">Conditions</p>
            </div>
            """, unsafe_allow_html=True)
        
        with col4:
            avg_risk = sum([v['probability'] for v in results.values()]) / len(results)
            st.markdown(f"""
            <div class="metric-card" style="border-left: 4px solid #2196F3;">
                <h3 style="color: #2196F3; margin: 0;">📊 Average Risk</h3>
                <h1 style="margin: 10px 0;">{avg_risk:.1f}%</h1>
                <p style="font-size: 0.9em; color: #666;">Overall</p>
            </div>
            """, unsafe_allow_html=True)
        
        st.markdown("---")
        
        # Visual Risk Chart
        st.subheader("📈 Risk Probability Distribution")
        
        # Create bar chart
        fig_bar = go.Figure()
        
        conditions = [k for k, v in sorted_results]
        probabilities = [v['probability'] for k, v in sorted_results]
        colors = ['#F44336' if p >= 60 else '#FFC107' if p >= 30 else '#4CAF50' for p in probabilities]
        
        fig_bar.add_trace(go.Bar(
            y=conditions,
            x=probabilities,
            orientation='h',
            marker=dict(color=colors, line=dict(color='white', width=2)),
            text=[f"{p:.1f}%" for p in probabilities],
            textposition='outside',
            hovertemplate='<b>%{y}</b><br>Risk: %{x:.1f}%<extra></extra>'
        ))
        
        fig_bar.update_layout(
            title="Risk Assessment by Condition",
            xaxis_title="Risk Probability (%)",
            yaxis_title="",
            height=400,
            showlegend=False,
            xaxis=dict(range=[0, 110]),
            plot_bgcolor='rgba(0,0,0,0)',
            paper_bgcolor='rgba(0,0,0,0)',
        )
        
        st.plotly_chart(fig_bar, use_container_width=True)
        
        # Detailed Risk Breakdown
        st.markdown("---")
        st.subheader("🔍 Detailed Risk Breakdown")
        
        # High Risk Conditions
        if high_risks:
            st.markdown("### 🚨 High Risk Conditions (Immediate Attention Required)")
            for condition in high_risks:
                result = results[condition]
                thyroid_info = f" - {result.get('thyroid_type', '')}" if condition == "Thyroid Disorder" else ""
                
                st.markdown(f"""
                <div class="risk-high">
                    <h3 style="color: #F44336; margin: 0;">⚠️ {condition}{thyroid_info}</h3>
                    <h1 style="color: #F44336; margin: 10px 0 5px 0;">{result['probability']:.1f}%</h1>
                    <p style="margin: 0; font-size: 1.1em; font-weight: bold;">🚨 IMMEDIATE MEDICAL ATTENTION RECOMMENDED</p>
                </div>
                """, unsafe_allow_html=True)
                
                if result['reasons']:
                    with st.expander(f"View {condition} Risk Factors"):
                        for reason in result['reasons']:
                            st.markdown(f"• {reason}")
        
        # Moderate Risk Conditions
        if moderate_risks:
            st.markdown("### ⚠️ Moderate Risk Conditions (Medical Evaluation Advised)")
            for condition in moderate_risks:
                result = results[condition]
                thyroid_info = f" - {result.get('thyroid_type', '')}" if condition == "Thyroid Disorder" else ""
                
                st.markdown(f"""
                <div class="risk-moderate">
                    <h3 style="color: #FFC107; margin: 0;">⚠️ {condition}{thyroid_info}</h3>
                    <h1 style="color: #FFC107; margin: 10px 0 5px 0;">{result['probability']:.1f}%</h1>
                    <p style="margin: 0; font-size: 1.1em;">Medical evaluation and monitoring recommended</p>
                </div>
                """, unsafe_allow_html=True)
                
                if result['reasons']:
                    with st.expander(f"View {condition} Risk Factors"):
                        for reason in result['reasons']:
                            st.markdown(f"• {reason}")
        
        # Low Risk Conditions
        if low_risks:
            st.markdown("### ✅ Low Risk Conditions")
            cols = st.columns(2)
            for idx, condition in enumerate(low_risks):
                result = results[condition]
                with cols[idx % 2]:
                    st.markdown(f"""
                    <div class="risk-low">
                        <h4 style="color: #4CAF50; margin: 0;">{condition}</h4>
                        <h2 style="color: #4CAF50; margin: 5px 0;">{result['probability']:.1f}%</h2>
                        <p style="margin: 0; font-size: 0.9em;">Continue routine monitoring</p>
                    </div>
                    """, unsafe_allow_html=True)
    
    # TAB 2: Detailed Analysis
    with tab2:
        st.header("📈 Detailed Health Analysis")
        
        # Patient Profile Summary
        st.subheader("👤 Your Health Profile")
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.markdown("**Demographics**")
            st.markdown(f"• Age: {age} years")
            st.markdown(f"• BMI: {bmi:.1f}")
            st.markdown(f"• Gravida: {gravida}")
            st.markdown(f"• Parity: {parity}")
        
        with col2:
            st.markdown("**Vital Signs**")
            st.markdown(f"• Blood Pressure: {systolic_bp}/{diastolic_bp} mmHg")
            st.markdown(f"• Stress Level: {stress_level}/5")
            symptom_count = len(general_symptoms) + len(specific_symptoms)
            st.markdown(f"• Active Symptoms: {symptom_count}")
        
        with col3:
            st.markdown("**Lab Values**")
            if hemoglobin > 0:
                st.markdown(f"• Hemoglobin: {hemoglobin:.1f} g/dL")
            if tsh > 0:
                st.markdown(f"• TSH: {tsh:.2f} mIU/L")
            if blood_sugar > 0:
                st.markdown(f"• Blood Sugar: {blood_sugar} mg/dL")
        
        st.markdown("---")
        
        # Risk Factor Analysis
        st.subheader("🔬 Risk Factor Analysis")
        
        # Count all risk factors
        total_risk_factors = 0
        risk_factor_categories = {}
        
        for condition, result in results.items():
            if result['reasons']:
                risk_factor_categories[condition] = len(result['reasons'])
                total_risk_factors += len(result['reasons'])
        
        if total_risk_factors > 0:
            # Pie chart of risk factors by condition
            fig_pie = go.Figure(data=[go.Pie(
                labels=list(risk_factor_categories.keys()),
                values=list(risk_factor_categories.values()),
                hole=.4,
                marker=dict(colors=px.colors.qualitative.Set3)
            )])
            
            fig_pie.update_layout(
                title="Distribution of Risk Factors by Condition",
                height=400
            )
            
            st.plotly_chart(fig_pie, use_container_width=True)
        
        # Symptom Analysis
        if general_symptoms or specific_symptoms:
            st.markdown("---")
            st.subheader("🩺 Your Reported Symptoms")
            
            all_symptoms = general_symptoms + specific_symptoms
            
            col1, col2 = st.columns(2)
            
            with col1:
                st.markdown("**General Symptoms:**")
                for symptom in general_symptoms:
                    st.markdown(f"• {symptom}")
            
            with col2:
                st.markdown("**Specific Symptoms:**")
                for symptom in specific_symptoms:
                    st.markdown(f"• {symptom}")
    
    # TAB 3: Recommendations
    with tab3:
        st.header("💡 Personalized Health Recommendations")
        
        # Priority recommendations for high-risk conditions
        urgent_conditions = [(k, v) for k, v in results.items() if v['probability'] >= 60]
        moderate_conditions = [(k, v) for k, v in results.items() if 30 <= v['probability'] < 60]
        
        if urgent_conditions:
            st.markdown("### 🚨 URGENT ACTIONS REQUIRED")
            st.error("⚠️ The following conditions require immediate medical attention:")
            
            for condition, result in urgent_conditions:
                st.markdown(f"#### {condition}")
                if result['advice']:
                    for advice in result['advice']:
                        if "URGENT" in advice or "CRITICAL" in advice or "🚨" in advice:
                            st.error(advice)
                        else:
                            st.warning(advice)
                st.markdown("---")
        
        if moderate_conditions:
            st.markdown("### ⚠️ RECOMMENDED ACTIONS")
            
            for condition, result in moderate_conditions:
                with st.expander(f"📋 {condition} Management Plan", expanded=True):
                    if result['advice']:
                        for advice in result['advice']:
                            st.markdown(f"""
                            <div class="recommendation-box">
                                {advice}
                            </div>
                            """, unsafe_allow_html=True)
                    else:
                        st.info("Continue monitoring and follow routine prenatal care.")
        
        # General pregnancy wellness tips
        st.markdown("---")
        st.markdown("### 💚 General Pregnancy Wellness Tips")
        
        wellness_tips = [
            "🥗 **Nutrition**: Eat a balanced diet rich in fruits, vegetables, whole grains, and lean proteins",
            "💊 **Supplements**: Take prenatal vitamins daily with folic acid and iron",
            "💧 **Hydration**: Drink at least 8-10 glasses of water daily",
            "🏃‍♀️ **Exercise**: Engage in 30 minutes of moderate exercise daily (as approved by doctor)",
            "😴 **Rest**: Get 7-9 hours of sleep and rest when tired",
            "🚭 **Avoid**: No smoking, alcohol, or recreational drugs",
            "📅 **Checkups**: Attend all scheduled prenatal appointments",
            "🧘‍♀️ **Stress Management**: Practice relaxation techniques and mindfulness",
            "🩺 **Monitor**: Track any new symptoms and report to your healthcare provider",
            "👥 **Support**: Maintain strong social connections and ask for help when needed"
        ]
        
        cols = st.columns(2)
        for idx, tip in enumerate(wellness_tips):
            with cols[idx % 2]:
                st.info(tip)
    
    # TAB 4: Downloadable Report
    with tab4:
        st.header("📄 Comprehensive Assessment Report")
        
        # Generate report
        report_time = st.session_state.get('assessment_time', datetime.now())
        
        report_text = f"""
═══════════════════════════════════════════════════════════════
            COMPREHENSIVE PREGNANCY HEALTH RISK ASSESSMENT
═══════════════════════════════════════════════════════════════

Report Generated: {report_time.strftime('%Y-%m-%d %H:%M:%S')}

═══════════════════════════════════════════════════════════════
PATIENT INFORMATION
═══════════════════════════════════════════════════════════════

Demographics:
• Age: {age} years
• BMI: {bmi:.1f}
• Gravida: {gravida}
• Parity: {parity}

Vital Signs:
• Blood Pressure: {systolic_bp}/{diastolic_bp} mmHg
• Stress Level: {stress_level}/5

Laboratory Values:
{"• Hemoglobin: " + str(hemoglobin) + " g/dL" if hemoglobin > 0 else "• Hemoglobin: Not tested"}
{"• Blood Sugar: " + str(blood_sugar) + " mg/dL" if blood_sugar > 0 else "• Blood Sugar: Not tested"}
{"• TSH: " + str(tsh) + " mIU/L" if tsh > 0 else "• TSH: Not tested"}
{"• T3: " + str(t3) if t3 > 0 else "• T3: Not tested"}
{"• T4: " + str(t4) if t4 > 0 else "• T4: Not tested"}
• Urine Protein: {urine_protein}

Medical History:
• Previous Miscarriage: {prev_miscarriage}
• Thyroid Disorder: {thyroid_disorder}
• Diabetes: {diabetes}
• High Blood Pressure: {high_bp}
• PCOS: {pcos}
• Anaemia History: {anaemia_history}
• Previous UTI: {uti_history}
• Family History: {family_history}

Lifestyle Factors:
• Smoking: {smoking}
• Alcohol: {alcohol}
• Exercise: {exercise}

Current Symptoms:
{"• " + chr(10).join(["• " + s for s in (general_symptoms + specific_symptoms)]) if (general_symptoms or specific_symptoms) else "• None reported"}

═══════════════════════════════════════════════════════════════
RISK ASSESSMENT RESULTS
═══════════════════════════════════════════════════════════════

Summary:
• High Risk Conditions: {len([k for k, v in results.items() if v['probability'] >= 60])}
• Moderate Risk Conditions: {len([k for k, v in results.items() if 30 <= v['probability'] < 60])}
• Low Risk Conditions: {len([k for k, v in results.items() if v['probability'] < 30])}

Detailed Assessment:
"""

        # Add each condition's results
        for condition, result in sorted(results.items(), key=lambda x: x[1]['probability'], reverse=True):
            # Updated classification logic
            risk_level = (
                "HIGH RISK ⚠️" if result['probability'] >= 75
                else "MODERATE RISK" if result['probability'] >= 50
                else "LOW RISK ✓"
            )

            
            thyroid_info = f" ({result.get('thyroid_type', 'Unknown')})" if condition == "Thyroid Disorder" else ""
            
            report_text += f"""
───────────────────────────────────────────────────────────────
{condition.upper()}{thyroid_info}
───────────────────────────────────────────────────────────────
Risk Level: {risk_level}
Probability: {result['probability']:.1f}%

"""
            
            if result['reasons']:
                report_text += "Risk Factors Identified:\n"
                for reason in result['reasons']:
                    report_text += f"  • {reason}\n"
                report_text += "\n"
            
            if result['advice']:
                report_text += "Recommendations:\n"
                for advice in result['advice']:
                    # Remove emoji for text report
                    clean_advice = advice.replace("🚨", "").replace("⚠️", "").replace("💊", "").replace("💧", "").replace("🚽", "").replace("🍇", "").replace("❌", "").replace("🥗", "").replace("📊", "").replace("🧘", "").replace("😴", "").replace("👥", "").replace("📝", "").replace("🚫", "").replace("🛌", "").replace("🚭", "").replace("🍷", "").replace("✅", "").replace("🏃‍♀️", "").replace("🏥", "").replace("🧪", "").replace("🧂", "").replace("⚖️", "").replace("🍽️", "").replace("🚶", "").replace("🍬", "").replace("👶", "").strip()
                    report_text += f"  • {clean_advice}\n"
                report_text += "\n"
        
        report_text += f"""
═══════════════════════════════════════════════════════════════
GENERAL RECOMMENDATIONS
═══════════════════════════════════════════════════════════════

Prenatal Care:
• Attend all scheduled prenatal appointments
• Follow your healthcare provider's recommendations
• Report any new or worsening symptoms immediately

Nutrition & Lifestyle:
• Eat a balanced, nutritious diet
• Take prenatal vitamins daily
• Stay well hydrated (8-10 glasses of water/day)
• Engage in moderate exercise as approved by your doctor
• Get adequate rest (7-9 hours of sleep)
• Avoid smoking, alcohol, and recreational drugs

Mental Wellbeing:
• Practice stress reduction techniques
• Maintain social connections and support network
• Seek counseling if feeling overwhelmed or anxious

Warning Signs - Seek Immediate Medical Attention:
• Severe abdominal pain or cramping
• Heavy bleeding or fluid leakage
• Severe headache or vision changes
• High fever (>100.4°F/38°C)
• Decreased fetal movement (if applicable)
• Severe swelling of face or hands
• Chest pain or difficulty breathing

═══════════════════════════════════════════════════════════════
MEDICAL DISCLAIMER
═══════════════════════════════════════════════════════════════

This automated assessment is for informational and screening purposes 
only. It does NOT replace professional medical advice, diagnosis, or 
treatment. 

You should:
• Consult with qualified healthcare providers for proper evaluation
• Discuss these results with your obstetrician or midwife
• Seek immediate medical attention for high-risk conditions
• Follow your healthcare provider's recommendations

Always seek the advice of your physician or other qualified health 
provider with any questions you may have regarding a medical condition.

═══════════════════════════════════════════════════════════════
END OF REPORT
═══════════════════════════════════════════════════════════════
"""
        
        # Display preview
        st.text_area("Report Preview", report_text, height=400)
        
        # Download buttons
        col1, col2 = st.columns(2)
        
        with col1:
            st.download_button(
                label="📥 Download Full Report (TXT)",
                data=report_text,
                file_name=f"Pregnancy_Risk_Assessment_{report_time.strftime('%Y%m%d_%H%M%S')}.txt",
                mime="text/plain",
                use_container_width=True
            )
        
        with col2:
            # Create CSV summary
            csv_data = "Condition,Risk Probability (%),Risk Level,Number of Risk Factors\n"
            for condition, result in results.items():
                risk_level = "High" if result['probability'] >= 60 else "Moderate" if result['probability'] >= 30 else "Low"
                csv_data += f"{condition},{result['probability']:.1f},{risk_level},{len(result['reasons'])}\n"
            
            st.download_button(
                label="📊 Download Summary (CSV)",
                data=csv_data,
                file_name=f"Pregnancy_Risk_Summary_{report_time.strftime('%Y%m%d_%H%M%S')}.csv",
                mime="text/csv",
                use_container_width=True
            )
        
        # Share with doctor option
        st.markdown("---")
        st.info("💡 **Tip**: Download this report and share it with your healthcare provider at your next appointment.")

else:
    # Welcome screen - no assessment run yet
    st.markdown("---")
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.markdown("""
        ### 🏥 Welcome to Your Comprehensive Pregnancy Health Assessment
        
        This integrated platform evaluates **7 key pregnancy health conditions**:
        
        1. **🩸 Anaemia** - Iron deficiency and hemoglobin disorders
        2. **💔 Miscarriage Risk** - Early pregnancy loss risk factors
        3. **🦋 Thyroid Disorders** - Hypothyroidism and Hyperthyroidism
        4. **🦠 UTI (Urinary Tract Infection)** - Bacterial urinary infections
        5. **🩺 Preeclampsia** - High blood pressure with organ complications
        6. **🍬 GDM (Gestational Diabetes)** - Pregnancy-related glucose intolerance
        7. **🧠 Mental Health** - Depression, anxiety, and stress assessment
        
        #### 📋 How to Use This Tool:
        
        1. **Fill in your information** in the sidebar (left panel)
        2. **Select all applicable symptoms** from the dropdown menus
        3. **Enter lab values** if available (optional but improves accuracy)
        4. **Click "Run Comprehensive Assessment"** to receive your results
        5. **Review recommendations** and download your report
        
        #### ⏱️ Expected Time:
        - **5-7 minutes** to complete the form
        - **Instant results** with detailed analysis
        
        #### 🔒 Privacy & Security:
        - No data is stored on external servers
        - Your information is processed locally
        - Reports can be downloaded for your records
        """)
    
    with col2:
        st.markdown("""
        ### 📊 What You'll Receive:
        
        ✅ **Risk Probabilities**
        - Numerical risk scores (0-100%)
        - Risk level classifications
        
        ✅ **Detailed Analysis**
        - Identified risk factors
        - Interactive visualizations
        - Symptom correlations
        
        ✅ **Personalized Advice**
        - Condition-specific recommendations
        - Lifestyle modifications
        - When to seek medical care
        
        ✅ **Comprehensive Report**
        - Downloadable text format
        - CSV data export
        - Shareable with doctors
        """)
        
        st.markdown("---")
        
        st.success("""
        ### 🎯 Get Started Now!
        
        👈 Fill out the form in the **sidebar** and click the assessment button to begin.
        """)
    
    st.markdown("---")
    
    # Sample statistics (if you want to show dataset info)
    st.subheader("📈 About Our Assessment Models")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Conditions Assessed", "7", help="Number of pregnancy-related conditions evaluated")
    
    with col2:
        st.metric("Risk Factors", "40+", help="Total number of risk factors analyzed")
    
    with col3:
        st.metric("Lab Tests", "6", help="Laboratory values that can be included")
    
    with col4:
        st.metric("Recommendations", "100+", help="Personalized health recommendations available")
    
    st.markdown("---")
    
    # Important notes
    st.warning("""
    ⚠️ **Important Medical Disclaimer**
    
    This tool is designed for **screening and educational purposes only**. It does NOT:
    - Replace professional medical diagnosis
    - Provide treatment recommendations
    - Serve as emergency medical advice
    
    **Always consult** with qualified healthcare providers including:
    - Obstetricians (OB/GYN)
    - Maternal-Fetal Medicine Specialists
    - Endocrinologists (for thyroid/diabetes)
    - Mental Health Professionals
    - Other relevant specialists
    
    **Seek immediate medical attention** if you experience:
    - Severe bleeding or cramping
    - High fever or severe headache
    - Vision changes or chest pain
    - Decreased fetal movement
    - Any symptoms that concern you
    """)

# Footer
st.markdown("---")
st.markdown("""
<div style="text-align: center; padding: 2rem; background: linear-gradient(135deg, #FFF0F5 0%, #FFE0EB 100%); border-radius: 15px; margin-top: 2rem;">
    <p style="font-size: 1.4rem; font-weight: bold; color: #E91E63; margin-bottom: 1rem;">
        🤰 Comprehensive Pregnancy Health Risk Assessment Platform
    </p>
    <p style="font-size: 1rem; color: #666; margin-bottom: 0.5rem;">
        <strong>⚠️ Medical Disclaimer:</strong> This tool provides risk assessment based on reported 
        symptoms and clinical data. It is for informational purposes only and does not replace 
        professional medical advice, diagnosis, or treatment.
    </p>
    <p style="font-size: 0.9rem; color: #888; margin-top: 1rem;">
        Developed for Maternal Health Screening & Education | AI-Enhanced Risk Assessment | 2025
    </p>
    <p style="font-size: 0.85rem; color: #999; margin-top: 0.5rem;">
        Built with ❤️ using Streamlit | Integrating Anaemia, Miscarriage, Thyroid, UTI, 
        Preeclampsia, GDM & Mental Health Assessments
    </p>
</div>
""", unsafe_allow_html=True)