# thyroid_app.py

import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from evaluate_thyroid import evaluate_thyroid

st.set_page_config(page_title="Thyroid Risk Predictor", layout="centered", page_icon="🦋")

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        font-weight: bold;
        color: #4682B4;
        text-align: center;
        padding: 1rem;
        background: linear-gradient(90deg, #E0F2F7 0%, #B3E5FC 100%);
        border-radius: 10px;
        margin-bottom: 2rem;
    }
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
    .info-box {
        background-color: #E3F2FD;
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #2196F3;
        margin: 1rem 0;
    }
    .lab-box {
        background-color: #F3E5F5;
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #9C27B0;
        margin: 1rem 0;
    }
</style>
""", unsafe_allow_html=True)

st.markdown('<div class="main-header">🦋 Smart Thyroid Disorder Predictor</div>', unsafe_allow_html=True)

st.markdown("""
<div class="info-box">
    <strong>🔬 About This Tool</strong><br>
    This app predicts thyroid disorder risk (Hypothyroidism/Hyperthyroidism) based on your symptoms, 
    clinical signs, and laboratory values. Fill in the form below for a comprehensive assessment.
</div>
""", unsafe_allow_html=True)

@st.cache_data
def load_data():
    """Load and prepare thyroid dataset"""
    try:
        df = pd.read_csv("thyroid_dataset.csv")
        return df.dropna()
    except FileNotFoundError:
        st.error("❌ Dataset file 'thyroid_dataset.csv' not found. Please ensure the file is in the same directory.")
        st.stop()

df = load_data()

# Display dataset info
with st.expander("📊 View Dataset Statistics"):
    st.write(f"**Total Records:** {len(df)}")
    st.write(f"**Features:** {', '.join(df.columns.tolist())}")
    
    col1, col2, col3 = st.columns(3)
    with col1:
        normal_cases = len(df[df['label'] == 0])
        st.metric("Normal", normal_cases, f"{(normal_cases/len(df)*100):.1f}%")
    with col2:
        hypo_cases = len(df[df['label'] == 1])
        st.metric("Hypothyroid", hypo_cases, f"{(hypo_cases/len(df)*100):.1f}%")
    with col3:
        hyper_cases = len(df[df['label'] == 2])
        st.metric("Hyperthyroid", hyper_cases, f"{(hyper_cases/len(df)*100):.1f}%")

# Sidebar inputs
st.sidebar.header("📝 Enter Your Health Information")
st.sidebar.markdown("---")

# Personal Information
st.sidebar.subheader("👤 Personal Details")
age = st.sidebar.number_input("Age (years)", min_value=18, max_value=45, value=30, step=1)
bmi = st.sidebar.number_input("BMI", min_value=10.0, max_value=45.0, value=23.0, step=0.1,
                                help="Body Mass Index = Weight(kg) / Height(m)²")

st.sidebar.markdown("---")
st.sidebar.subheader("🩺 Clinical Symptoms")

# Symptom inputs (binary)
symptom_inputs = {}

symptoms_config = [
    ("fatigue", "Persistent fatigue or tiredness", "Do you feel constantly tired despite adequate rest?"),
    ("weight_gain", "Unexplained weight gain", "Have you gained weight without changes in diet/exercise?"),
    ("cold_intolerance", "Cold intolerance", "Do you feel unusually cold compared to others?"),
    ("constipation", "Constipation", "Are you experiencing chronic constipation?"),
    ("hair_loss", "Hair loss or thinning", "Have you noticed increased hair fall or thinning?"),
    ("palpitations", "Heart palpitations", "Do you experience rapid or irregular heartbeat?"),
    ("menstrual_irregularity", "Menstrual irregularity", "Are your periods irregular or heavy?"),
    ("family_history", "Family history of thyroid disorders", "Does thyroid disease run in your family?")
]

for key, label, help_text in symptoms_config:
    symptom_inputs[key] = st.sidebar.selectbox(
        label,
        ["", "Yes", "No"],
        help=help_text
    )

st.sidebar.markdown("---")
st.sidebar.subheader("🔬 Laboratory Values (Optional)")

st.sidebar.markdown("""
<div class="lab-box">
    <strong>💡 Lab Reference Ranges:</strong><br>
    • TSH: 0.4-4.0 mIU/L (Normal)<br>
    • T3: 1.2-4.0 (Normal)<br>
    • T4: 0.8-2.5 (Normal)
</div>
""", unsafe_allow_html=True)

tsh_input = st.sidebar.text_input("TSH (mIU/L)", placeholder="e.g., 2.5", help="Leave empty if not tested")
t3_input = st.sidebar.text_input("T3", placeholder="e.g., 2.0", help="Leave empty if not tested")
t4_input = st.sidebar.text_input("T4", placeholder="e.g., 1.5", help="Leave empty if not tested")

# Add personal details to inputs
symptom_inputs['age'] = age
symptom_inputs['bmi'] = bmi

# Add lab values if provided
if tsh_input.strip():
    try:
        symptom_inputs['TSH'] = float(tsh_input)
    except ValueError:
        st.sidebar.error("⚠️ Invalid TSH value. Please enter a number.")

if t3_input.strip():
    try:
        symptom_inputs['T3'] = float(t3_input)
    except ValueError:
        st.sidebar.error("⚠️ Invalid T3 value. Please enter a number.")

if t4_input.strip():
    try:
        symptom_inputs['T4'] = float(t4_input)
    except ValueError:
        st.sidebar.error("⚠️ Invalid T4 value. Please enter a number.")

st.sidebar.markdown("---")

# Predict button with validation
predict_button = st.sidebar.button("🔍 Predict Thyroid Risk", use_container_width=True, type="primary")

if predict_button:
    # Validate inputs
    missing_fields = [label for key, label, _ in symptoms_config if symptom_inputs[key] == ""]
    
    if missing_fields:
        st.warning(f"⚠️ Please answer all symptom questions. Missing: {', '.join(missing_fields)}")
        st.stop()

    # Convert Yes/No to 1/0
    for key, _, _ in symptoms_config:
        val = symptom_inputs[key]
        symptom_inputs[key] = 1 if val.lower() == "yes" else 0

    # Run evaluation
    with st.spinner("🔬 Analyzing your thyroid health..."):
        result = evaluate_thyroid(symptom_inputs)

    # Display Results
    st.markdown("---")
    st.header("📊 Your Thyroid Health Assessment")

    # Risk Level Display
    risk_level = result['risk_level']
    probability = result['probability_value']
    thyroid_type = result.get('thyroid_type', 'Unknown')

    if risk_level == "High Risk":
        st.markdown(f"""
        <div class="risk-high">
            <h2 style="color: #F44336; margin: 0;">⚠️ HIGH RISK</h2>
            <h1 style="color: #F44336; margin: 10px 0;">{result['probability']}</h1>
            <p style="margin: 0;">Immediate medical attention recommended</p>
            <p style="margin: 5px 0; font-weight: bold;">{thyroid_type}</p>
        </div>
        """, unsafe_allow_html=True)
    elif risk_level == "Moderate Risk":
        st.markdown(f"""
        <div class="risk-moderate">
            <h2 style="color: #FFC107; margin: 0;">⚠️ MODERATE RISK</h2>
            <h1 style="color: #FFC107; margin: 10px 0;">{result['probability']}</h1>
            <p style="margin: 0;">Medical evaluation advised</p>
            <p style="margin: 5px 0; font-weight: bold;">{thyroid_type}</p>
        </div>
        """, unsafe_allow_html=True)
    else:
        st.markdown(f"""
        <div class="risk-low">
            <h2 style="color: #4CAF50; margin: 0;">✅ LOW RISK</h2>
            <h1 style="color: #4CAF50; margin: 10px 0;">{result['probability']}</h1>
            <p style="margin: 0;">No immediate concern, maintain healthy habits</p>
            <p style="margin: 5px 0; font-weight: bold;">{thyroid_type}</p>
        </div>
        """, unsafe_allow_html=True)

    # Risk gauge visualization
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        fig, ax = plt.subplots(figsize=(8, 2))
        colors = ['#4CAF50', '#FFC107', '#F44336']
        ax.barh([0], [40], left=[0], height=0.5, color=colors[0], alpha=0.3)
        ax.barh([0], [30], left=[40], height=0.5, color=colors[1], alpha=0.3)
        ax.barh([0], [30], left=[70], height=0.5, color=colors[2], alpha=0.3)
        ax.scatter([probability], [0], s=500, c='black', marker='v', zorder=10)
        ax.set_xlim(0, 100)
        ax.set_ylim(-0.5, 0.5)
        ax.set_xticks([0, 40, 70, 100])
        ax.set_xticklabels(['0%', '40%', '70%', '100%'])
        ax.set_yticks([])
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.spines['left'].set_visible(False)
        plt.title('Risk Score Gauge', fontweight='bold', pad=10)
        st.pyplot(fig)
        plt.close()

    st.markdown("---")

    # Detected Risk Factors
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("🔎 Detected Risk Factors")
        if result["why"]:
            for reason in result["why"]:
                st.markdown(f"- {reason}")
        else:
            st.success("No major thyroid disorder symptoms detected")

    with col2:
        st.subheader("💊 Your Profile Summary")
        st.markdown(f"**Age:** {age} years")
        st.markdown(f"**BMI:** {bmi:.1f}")
        symptoms_count = sum([1 for key, _, _ in symptoms_config if symptom_inputs[key] == 1])
        st.markdown(f"**Symptoms Count:** {symptoms_count}/8")
        
        # Display lab values if provided
        if 'TSH' in symptom_inputs:
            st.markdown(f"**TSH:** {symptom_inputs['TSH']:.2f} mIU/L")
        if 'T3' in symptom_inputs:
            st.markdown(f"**T3:** {symptom_inputs['T3']:.2f}")
        if 'T4' in symptom_inputs:
            st.markdown(f"**T4:** {symptom_inputs['T4']:.2f}")

    st.markdown("---")

    # Personalized Advice
    st.subheader("💡 Personalized Recommendations")
    for tip in result["next_steps"]:
        if "URGENT" in tip or "CRITICAL" in tip:
            st.error(tip)
        else:
            st.info(tip)

    # Symptom Contribution Chart (if symptoms present)
    if result["symptom_contributions"]:
        st.markdown("---")
        st.subheader("📈 Risk Factor Contribution Analysis")
        
        contrib_data = result["symptom_contributions"]
        labels = [c['label'] for c in contrib_data]
        weights = [c['weight'] for c in contrib_data]
        colors_list = [c['color'] for c in contrib_data]

        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
        
        # Pie chart
        ax1.pie(weights, labels=labels, autopct='%1.1f%%', startangle=90, colors=colors_list)
        ax1.set_title('Risk Factor Weight Distribution', fontweight='bold', fontsize=14)
        
        # Bar chart
        ax2.barh(labels, weights, color=colors_list)
        ax2.set_xlabel('Weight Score', fontweight='bold')
        ax2.set_title('Individual Risk Factor Weights', fontweight='bold', fontsize=14)
        ax2.grid(axis='x', alpha=0.3)
        
        plt.tight_layout()
        st.pyplot(fig)
        plt.close()

    st.markdown("---")

    # Statistical Comparison
    st.subheader("📊 Your Profile vs Dataset Statistics")
    
    # Create comparison for binary symptoms
    your_symptoms = {key: symptom_inputs[key] for key, _, _ in symptoms_config}
    dataset_avg = {key: df[key].mean() for key, _, _ in symptoms_config if key in df.columns}
    
    comparison_df = pd.DataFrame({
        'Your Input': your_symptoms,
        'Dataset Average': dataset_avg
    })
    
    fig, ax = plt.subplots(figsize=(12, 6))
    comparison_df.plot(kind='bar', ax=ax, color=['#4682B4', '#90CAF9'], width=0.7)
    ax.set_ylabel('Presence (0=No, 1=Yes)', fontweight='bold')
    ax.set_xlabel('Symptoms', fontweight='bold')
    ax.set_title('Your Symptoms vs Average Dataset Profile', fontweight='bold', fontsize=14)
    ax.legend(['Your Input', 'Dataset Average'], loc='upper right')
    ax.grid(axis='y', alpha=0.3)
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    st.pyplot(fig)
    plt.close()

    # Lab Values Comparison (if available)
    if any(key in symptom_inputs for key in ['TSH', 'T3', 'T4']):
        st.markdown("---")
        st.subheader("🧪 Your Lab Values vs Normal Ranges")
        
        lab_comparison = []
        
        if 'TSH' in symptom_inputs:
            lab_comparison.append({
                'Test': 'TSH',
                'Your Value': symptom_inputs['TSH'],
                'Normal Min': 0.4,
                'Normal Max': 4.0,
                'Status': '✅ Normal' if 0.4 <= symptom_inputs['TSH'] <= 4.0 else '⚠️ Abnormal'
            })
        
        if 'T3' in symptom_inputs:
            lab_comparison.append({
                'Test': 'T3',
                'Your Value': symptom_inputs['T3'],
                'Normal Min': 1.2,
                'Normal Max': 4.0,
                'Status': '✅ Normal' if 1.2 <= symptom_inputs['T3'] <= 4.0 else '⚠️ Abnormal'
            })
        
        if 'T4' in symptom_inputs:
            lab_comparison.append({
                'Test': 'T4',
                'Your Value': symptom_inputs['T4'],
                'Normal Min': 0.8,
                'Normal Max': 2.5,
                'Status': '✅ Normal' if 0.8 <= symptom_inputs['T4'] <= 2.5 else '⚠️ Abnormal'
            })
        
        if lab_comparison:
            lab_df = pd.DataFrame(lab_comparison)
            st.dataframe(lab_df, use_container_width=True)
            
            # Visual representation of lab values
            fig, ax = plt.subplots(figsize=(12, 4))
            tests = [item['Test'] for item in lab_comparison]
            values = [item['Your Value'] for item in lab_comparison]
            min_vals = [item['Normal Min'] for item in lab_comparison]
            max_vals = [item['Normal Max'] for item in lab_comparison]
            
            x = np.arange(len(tests))
            ax.bar(x, values, color=['#4682B4' if item['Status'] == '✅ Normal' else '#F44336' for item in lab_comparison], alpha=0.7, label='Your Value')
            ax.errorbar(x, [(min_v + max_v) / 2 for min_v, max_v in zip(min_vals, max_vals)],
                       yerr=[[(max_v - min_v) / 2 for min_v, max_v in zip(min_vals, max_vals)],
                             [(max_v - min_v) / 2 for min_v, max_v in zip(min_vals, max_vals)]],
                       fmt='none', ecolor='green', elinewidth=3, capsize=10, label='Normal Range')
            
            ax.set_xticks(x)
            ax.set_xticklabels(tests)
            ax.set_ylabel('Value', fontweight='bold')
            ax.set_title('Your Lab Values vs Normal Ranges', fontweight='bold', fontsize=14)
            ax.legend()
            ax.grid(axis='y', alpha=0.3)
            plt.tight_layout()
            st.pyplot(fig)
            plt.close()

    # Correlation Heatmap
    st.markdown("---")
    st.subheader("🌡️ Dataset Feature Correlation Heatmap")
    
    # Select numeric columns for correlation
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    correlation_matrix = df[numeric_cols].corr()
    
    fig, ax = plt.subplots(figsize=(12, 10))
    sns.heatmap(correlation_matrix, annot=True, cmap="coolwarm", fmt=".2f", 
                ax=ax, cbar_kws={'label': 'Correlation Coefficient'},
                linewidths=0.5, linecolor='white')
    ax.set_title('Feature Correlation Analysis', fontweight='bold', fontsize=14, pad=20)
    plt.tight_layout()
    st.pyplot(fig)
    plt.close()

    # Dataset Sample
    st.markdown("---")
    st.subheader("📂 Sample Training Data (First 10 Records)")
    st.dataframe(df.head(10), use_container_width=True)

    # Download results
    st.markdown("---")
    result_text = f"""
THYROID DISORDER RISK ASSESSMENT REPORT
========================================
Date: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')}

PATIENT INFORMATION
- Age: {age} years
- BMI: {bmi:.1f}

LABORATORY VALUES
- TSH: {symptom_inputs.get('TSH', 'Not tested')} mIU/L
- T3: {symptom_inputs.get('T3', 'Not tested')}
- T4: {symptom_inputs.get('T4', 'Not tested')}

RISK ASSESSMENT
- Risk Level: {result['risk_level']}
- Probability Score: {result['probability']}
- Thyroid Type: {thyroid_type}

DETECTED RISK FACTORS
{chr(10).join(['- ' + r for r in result['why']])}

RECOMMENDATIONS
{chr(10).join(['- ' + a for a in result['next_steps']])}

========================================
This is an automated assessment. Please consult an endocrinologist for proper diagnosis.
"""
    
    st.download_button(
        label="📥 Download Assessment Report",
        data=result_text,
        file_name=f"Thyroid_Risk_Report_{pd.Timestamp.now().strftime('%Y%m%d_%H%M%S')}.txt",
        mime="text/plain",
        use_container_width=True
    )

else:
    # Welcome screen when no prediction yet
    st.markdown("---")
    st.info("👈 **Get Started:** Fill in your symptoms and lab values in the sidebar, then click 'Predict Thyroid Risk' to see your personalized assessment.")
    
    # Show some dataset insights
    st.subheader("📊 Dataset Overview")
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Total Cases", len(df))
    with col2:
        st.metric("Hypothyroid", len(df[df['label'] == 1]))
    with col3:
        st.metric("Hyperthyroid", len(df[df['label'] == 2]))
    
    # Show symptom distribution
    st.subheader("📈 Symptom Distribution in Dataset")
    symptom_cols = ['fatigue', 'weight_gain', 'cold_intolerance', 'constipation', 
                    'hair_loss', 'palpitations', 'menstrual_irregularity', 'family_history']
    
    symptom_counts = df[symptom_cols].sum().sort_values(ascending=False)
    
    fig, ax = plt.subplots(figsize=(12, 6))
    symptom_counts.plot(kind='bar', ax=ax, color='#4682B4')
    ax.set_ylabel('Number of Cases', fontweight='bold')
    ax.set_xlabel('Symptoms', fontweight='bold')
    ax.set_title('Symptom Frequency in Dataset', fontweight='bold', fontsize=14)
    ax.grid(axis='y', alpha=0.3)
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    st.pyplot(fig)
    plt.close()
    
    # Show TSH distribution
    st.subheader("📈 TSH Level Distribution")
    
    fig, ax = plt.subplots(figsize=(12, 6))
    ax.hist(df['TSH'], bins=50, color='#4682B4', edgecolor='white', alpha=0.7)
    ax.axvline(x=0.4, color='green', linestyle='--', linewidth=2, label='Normal Min (0.4)')
    ax.axvline(x=4.0, color='red', linestyle='--', linewidth=2, label='Normal Max (4.0)')
    ax.set_xlabel('TSH Level (mIU/L)', fontweight='bold')
    ax.set_ylabel('Frequency', fontweight='bold')
    ax.set_title('TSH Distribution in Dataset', fontweight='bold', fontsize=14)
    ax.legend()
    ax.grid(axis='y', alpha=0.3)
    plt.tight_layout()
    st.pyplot(fig)
    plt.close()

# Footer
st.markdown("---")
st.markdown("""
<div style="text-align: center; padding: 2rem; background-color: #F5F5F5; border-radius: 10px;">
    <p style="font-size: 1.2rem; font-weight: bold; color: #4682B4;">🦋 Smart Thyroid Disorder Predictor</p>
    <p style="font-size: 0.9rem; color: #666;">
        ⚠️ <strong>Medical Disclaimer:</strong> This tool is for informational purposes only and does not replace professional medical advice.
        Always consult with a qualified endocrinologist for proper diagnosis and treatment.
    </p>
    <p style="font-size: 0.85rem; color: #888; margin-top: 1rem;">
        Built with ❤️ using Streamlit | Women's Health Analytics
    </p>
</div>
""", unsafe_allow_html=True)