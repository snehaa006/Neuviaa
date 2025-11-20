import streamlit as st
import json
from datetime import datetime
import os

# Page configuration
st.set_page_config(
    page_title="🧠 Neuvia AI",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS with FIXED text visibility - darker backgrounds, better contrast
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
    
    * {
        font-family: 'Poppins', sans-serif;
    }
    
    .stApp {
        background: linear-gradient(135deg, #d4c4b0 0%, #b89a8f 100%);
    }
    
    .main-title {
        font-size: 2.8rem;
        font-weight: 700;
        color: #0d0604;
        text-align: center;
        padding: 1.5rem;
        background: linear-gradient(90deg, #e8d7c3 0%, #d9c4ae 100%);
        border-radius: 15px;
        margin-bottom: 2rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        text-shadow: 1px 1px 2px rgba(255,255,255,0.5);
    }
    
    .section-header {
        font-size: 1.6rem;
        font-weight: 600;
        color: #0d0604;
        margin-top: 2rem;
        margin-bottom: 1rem;
        padding: 0.8rem;
        background: #e8d7c3;
        border-left: 5px solid #6F5647;
        border-radius: 8px;
        text-shadow: 1px 1px 2px rgba(255,255,255,0.4);
    }
    
    .stButton>button {
        background: linear-gradient(135deg, #8B6F5C 0%, #6F5647 100%);
        color: white !important;
        font-weight: 600;
        border-radius: 25px;
        padding: 0.8rem 2rem;
        border: none;
        font-size: 1.1rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
    }
    
    .stButton>button:hover {
        background: linear-gradient(135deg, #6F5647 0%, #5A4537 100%);
        transform: translateY(-2px);
        box-shadow: 0 6px 8px rgba(0,0,0,0.25);
    }
    
    .result-box {
        background: #e8d7c3;
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        margin: 1.5rem 0;
        border: 2px solid #d9c4ae;
    }
    
    .insight-box {
        background: #e8d7c3;
        padding: 1.5rem;
        border-radius: 12px;
        border-left: 5px solid #6F5647;
        margin: 1.5rem 0;
        font-size: 1.05rem;
        line-height: 1.8;
        color: #0d0604;
        text-shadow: 1px 1px 1px rgba(255,255,255,0.4);
        border: 2px solid #d9c4ae;
    }
    
    .risk-label {
        font-size: 1.2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: #0d0604;
        text-shadow: 1px 1px 2px rgba(255,255,255,0.5);
    }
    
    .stProgress > div > div > div > div {
        background-color: #6F5647;
    }
    
    div[data-testid="stSidebar"] {
        background: linear-gradient(180deg, #e8d7c3 0%, #d9c4ae 100%);
    }
    
    .info-badge {
        background: #d9c4ae;
        padding: 0.8rem;
        border-radius: 8px;
        border-left: 4px solid #6F5647;
        margin: 1rem 0;
        font-size: 0.95rem;
        color: #0d0604;
        text-shadow: 1px 1px 1px rgba(255,255,255,0.4);
        border: 1px solid #c9b49f;
    }
    
    .methodology-box {
        background: #d9c4ae;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
        font-size: 0.85rem;
        color: #0d0604;
        text-shadow: 1px 1px 1px rgba(255,255,255,0.4);
    }
    
    /* CRITICAL: Force dark text on ALL elements */
    p, span, div, label, h1, h2, h3, h4, h5, h6, li, td, th {
        color: #1a0f08 !important;
    }
    
    /* Extra strong emphasis for headings and labels */
    strong, b, label, h1, h2, h3, h4, h5, h6 {
        color: #0d0604 !important;
        font-weight: 700 !important;
    }
    
    /* Streamlit specific elements - MAXIMUM contrast */
    .stMarkdown, .stMarkdown *, .stMarkdown p, .stMarkdown div {
        color: #1a0f08 !important;
    }
    
    /* All input labels with maximum visibility */
    label, .stSlider label, .stNumberInput label, .stRadio label, 
    .stCheckbox label, .stTextInput label, .stSelectbox label {
        color: #0d0604 !important;
        font-weight: 600 !important;
        text-shadow: 1px 1px 2px rgba(255,255,255,0.5);
        font-size: 1rem !important;
    }
    
    /* Slider values and text */
    .stSlider [data-baseweb="slider"], .stSlider div, .stSlider span {
        color: #0d0604 !important;
        font-weight: 600 !important;
    }
    
    /* Number input fields */
    input[type="number"], .stNumberInput input {
        color: #0d0604 !important;
        font-weight: 600 !important;
        background-color: #f5ede3 !important;
    }
    
    /* Radio and checkbox options */
    .stRadio [role="radiogroup"] label, .stCheckbox label {
        color: #0d0604 !important;
        font-weight: 600 !important;
    }
    
    /* Expander headers */
    .streamlit-expanderHeader, .streamlit-expanderHeader * {
        color: #0d0604 !important;
        font-weight: 700 !important;
        text-shadow: 1px 1px 2px rgba(255,255,255,0.5);
        background-color: #e8d7c3 !important;
    }
    
    /* Info/warning/success boxes */
    .stAlert {
        background-color: #e8d7c3 !important;
        color: #0d0604 !important;
        border: 2px solid #6F5647 !important;
    }
    
    .stAlert p, .stAlert div, .stAlert span {
        color: #0d0604 !important;
        font-weight: 600 !important;
    }
    
    /* Button text stays white with strong shadow */
    button, button *, .stButton button, .stButton button * {
        color: white !important;
        text-shadow: 1px 2px 3px rgba(0,0,0,0.5) !important;
        font-weight: 700 !important;
    }
    
    /* Sidebar - all text dark and bold */
    [data-testid="stSidebar"] *, [data-testid="stSidebar"] p, 
    [data-testid="stSidebar"] div, [data-testid="stSidebar"] span,
    [data-testid="stSidebar"] label {
        color: #0d0604 !important;
        text-shadow: 1px 1px 1px rgba(255,255,255,0.4);
        font-weight: 500 !important;
    }
    
    [data-testid="stSidebar"] label, [data-testid="stSidebar"] h3 {
        color: #0d0604 !important;
        font-weight: 700 !important;
        font-size: 1.1rem !important;
    }
    
    [data-testid="stSidebar"] button * {
        color: white !important;
        text-shadow: 1px 2px 3px rgba(0,0,0,0.5) !important;
    }
    
    /* Markdown headings - maximum contrast */
    .stMarkdown h1, .stMarkdown h2, .stMarkdown h3, 
    .stMarkdown h4, .stMarkdown h5, .stMarkdown h6 {
        color: #0d0604 !important;
        font-weight: 800 !important;
        text-shadow: 1px 1px 3px rgba(255,255,255,0.6);
    }
    
    /* Help text */
    .stTextInput small, .stNumberInput small, .stSlider small {
        color: #1a0f08 !important;
        font-weight: 500 !important;
        opacity: 1 !important;
    }
    
    /* Widget containers */
    .stSlider, .stNumberInput, .stRadio, .stCheckbox, .stTextInput {
        background-color: rgba(232, 215, 195, 0.3);
        padding: 0.5rem;
        border-radius: 8px;
    }
    
    /* Text areas and inputs */
    textarea, input {
        background-color: #f5ede3 !important;
        color: #0d0604 !important;
        font-weight: 600 !important;
    }
    
    /* Spinner text */
    .stSpinner > div {
        color: #0d0604 !important;
        font-weight: 600 !important;
    }
    
    /* Success/info/warning/error messages */
    .stSuccess, .stInfo, .stWarning, .stError {
        background-color: #e8d7c3 !important;
        color: #0d0604 !important;
        border: 2px solid #6F5647 !important;
    }
    
    .stSuccess *, .stInfo *, .stWarning *, .stError * {
        color: #0d0604 !important;
        font-weight: 600 !important;
    }
    
    /* Download button */
    .stDownloadButton button {
        background: linear-gradient(135deg, #8B6F5C 0%, #6F5647 100%);
        color: white !important;
        font-weight: 700 !important;
    }
    
    /* Ensure all text in columns is visible */
    .css-1kyxreq, .css-12oz5g7, [data-testid="column"] {
        color: #0d0604 !important;
    }
    
    [data-testid="column"] * {
        color: #1a0f08 !important;
    }
    
    [data-testid="column"] label, [data-testid="column"] strong {
        color: #0d0604 !important;
        font-weight: 700 !important;
    }
</style>
""", unsafe_allow_html=True)

# Clinical Reference Ranges (Evidence-Based Standards)
CLINICAL_RANGES = {
    'hemoglobin': {'optimal': (12, 16), 'unit': 'g/dL', 'critical_low': 8, 'critical_high': 18},
    'platelets': {'optimal': (150, 400), 'unit': '×10⁹/L', 'critical_low': 100, 'critical_high': 450},
    'wbc': {'optimal': (4, 11), 'unit': '×10⁹/L', 'critical_low': 3, 'critical_high': 12},
    'b12': {'optimal': (200, 900), 'unit': 'pg/mL', 'critical_low': 200, 'critical_high': 1000},
    'tsh': {'optimal': (0.4, 4.0), 'unit': 'mIU/L', 'critical_low': 0.2, 'critical_high': 10},
    'glucose': {'optimal': (70, 100), 'unit': 'mg/dL', 'critical_low': 70, 'critical_high': 200},
    'ferritin': {'optimal': (15, 150), 'unit': 'ng/mL', 'critical_low': 10, 'critical_high': 300},
    'rbc': {'optimal': (4.0, 5.5), 'unit': '×10⁶/μL', 'critical_low': 3.5, 'critical_high': 6.0},
    'mcv': {'optimal': (80, 100), 'unit': 'fL', 'critical_low': 70, 'critical_high': 100}
}

# Initialize session state
if 'analyzed' not in st.session_state:
    st.session_state.analyzed = False
if 'show_results' not in st.session_state:
    st.session_state.show_results = False

def calculate_scores(inputs):
    """
    Calculate neurological, hematological, and overall risk scores
    
    Methodology:
    - Neurological: Weighted symptom scoring + sleep/stress modifiers
    - Hematological: Deviation from clinical optimal ranges
    - Overall: Composite score with age/lifestyle adjustments
    
    Returns: (neuro_risk, hema_risk, overall_risk) all 0-100%
    """
    
    # === NEUROLOGICAL COMPUTATION ===
    # Each symptom scored 0-10, weighted by clinical significance
    neuro_symptoms = {
        'headache': 1.2,        # Higher weight - common neurological sign
        'dizziness': 1.3,       # High weight - vascular/vestibular
        'tremors': 1.1,         # Moderate - motor system
        'forgetfulness': 1.0,   # Cognitive decline marker
        'concentration': 1.0,   # Executive function
        'tingling': 1.2,        # Peripheral neuropathy sign
        'mood': 0.9,            # Neurohormonal
        'eyestrain': 0.8,       # Lower weight - common issue
        'fatigue': 1.1,         # Overlaps with hematological
        'balance': 1.3,         # High weight - cerebellar/vestibular
        'sensitivity': 1.0      # Migraine/neurovascular marker
    }
    
    neuro_raw = sum(
        inputs.get(key, 0) * weight 
        for key, weight in neuro_symptoms.items()
    )
    
    # Sleep penalty: Poor sleep dramatically affects neural health
    sleep_quality = inputs.get('sleep_quality', 5)
    sleep_penalty = max(0, (7 - sleep_quality)) * 2.5  # Exponential effect
    
    # Stress amplifier: Cortisol impacts neural inflammation
    stress_level = inputs.get('stress', 5)
    stress_boost = stress_level * 1.8
    
    # Age adjustment: Neural decline accelerates after 40
    age = inputs.get('age', 30)
    age_factor = max(0, (age - 40)) * 0.3
    
    neuro_risk = min(100, (neuro_raw + sleep_penalty + stress_boost + age_factor) * 1.5)
    
    # === HEMATOLOGICAL COMPUTATION ===
    if inputs.get('mode') == 'Lab Mode':
        hema_score = 0
        
        # Hemoglobin - Critical for oxygen transport
        hb = inputs.get('hemoglobin', 12)
        if hb < 11:
            hema_score += (11 - hb) * 8  # Severe penalty for anemia
        elif hb < 12:
            hema_score += (12 - hb) * 4
        elif hb > 16:
            hema_score += (hb - 16) * 2  # Polycythemia risk
        
        # Platelets - Bleeding/clotting disorders
        platelets = inputs.get('platelets', 250)
        plat_dev = abs(platelets - 250)
        if platelets < 150:
            hema_score += (150 - platelets) / 5
        elif platelets > 400:
            hema_score += (platelets - 400) / 10
        
        # WBC - Immune function
        wbc = inputs.get('wbc', 7)
        wbc_dev = abs(wbc - 7)
        hema_score += wbc_dev * 3
        
        # TSH - Thyroid (affects metabolism + energy)
        tsh = inputs.get('tsh', 3)
        if tsh > 4:
            hema_score += (tsh - 4) * 6  # Hypothyroidism
        elif tsh < 0.4:
            hema_score += (0.4 - tsh) * 8  # Hyperthyroidism
        
        # B12 - Neural + hematological
        b12 = inputs.get('b12', 500)
        if b12 < 300:
            hema_score += (300 - b12) / 15
        
        # Glucose - Metabolic health
        glucose = inputs.get('glucose', 100)
        if glucose > 125:
            hema_score += (glucose - 125) / 5  # Diabetes risk
        elif glucose < 70:
            hema_score += (70 - glucose) / 3  # Hypoglycemia
        
        # Iron/Ferritin - Anemia marker
        ferritin = inputs.get('ferritin', 50)
        if ferritin < 30:
            hema_score += (30 - ferritin) / 3
        
        # RBC Count
        rbc = inputs.get('rbc', 4.5)
        hema_score += abs(rbc - 4.5) * 8
        
        # MCV - Cell size (macrocytic/microcytic anemia)
        mcv = inputs.get('mcv', 85)
        hema_score += abs(mcv - 85) / 1.5
        
    else:  # Symptom Mode - Proxy scoring
        symptom_weights = {
            'pale_fatigue': 4.0,      # Strong anemia indicator
            'bruising': 2.5,          # Platelet function
            'infections': 3.5,        # WBC/immune
            'tingling_b12': 3.0,      # B12 deficiency
            'cold_tired': 3.5,        # Thyroid
            'thirst': 2.5,            # Glucose/diabetes
            'iron_diet': -3.0,        # Inverse - good diet reduces risk
            'breathless': 4.0,        # Anemia/cardiopulmonary
            'tired_well_fed': 2.5     # Anemia despite nutrition
        }
        
        hema_score = sum(
            inputs.get(key, 5) * weight 
            for key, weight in symptom_weights.items()
        )
        hema_score = max(0, hema_score)  # Can't be negative
    
    hema_risk = min(100, hema_score)
    
    # === OVERALL HEALTH COMPOSITE ===
    # Blood pressure impact
    bp_sys = inputs.get('bp_sys', 120)
    bp_score = 0
    if bp_sys > 140:
        bp_score += (bp_sys - 140) / 2  # Hypertension
    elif bp_sys < 90:
        bp_score += (90 - bp_sys) / 2  # Hypotension
    
    # Lifestyle factors
    activity = inputs.get('activity', 60)
    activity_penalty = max(0, (60 - activity)) / 5  # Sedentary risk
    
    water = inputs.get('water', 2.5)
    water_penalty = max(0, (2.5 - water)) * 4  # Dehydration
    
    # BMI adjustment
    bmi = inputs.get('bmi', 22)
    bmi_penalty = 0
    if bmi < 18.5:
        bmi_penalty = (18.5 - bmi) * 2  # Underweight
    elif bmi > 25:
        bmi_penalty = (bmi - 25) * 1.5  # Overweight
    
    # Diet quality modifier
    diet = inputs.get('diet_quality', 6)
    diet_penalty = (10 - diet) * 1.2
    
    # Composite calculation
    overall = min(100, (
        neuro_risk * 0.35 +           # Neural health most critical
        hema_risk * 0.35 +            # Blood health equally critical
        bp_score * 1.5 +              # Cardiovascular
        activity_penalty * 1.2 +      # Exercise
        water_penalty * 0.8 +         # Hydration
        bmi_penalty * 0.6 +           # Body composition
        diet_penalty * 0.5            # Nutrition
    ))
    
    return round(neuro_risk), round(hema_risk), round(overall)

def generate_insight(neuro, hema, overall, inputs, use_ai=False, api_key=None):
    """Generate health insights - AI or local heuristic"""
    
    if use_ai and api_key:
        try:
            # Try to use OpenAI for enhanced insights
            import openai
            openai.api_key = api_key
            
            # Build comprehensive context
            mode = inputs.get('mode', 'Symptom Mode')
            
            if mode == 'Lab Mode':
                lab_data = f"""
Lab Values:
- Hemoglobin: {inputs.get('hemoglobin', 'N/A')} g/dL (normal: 12-16)
- TSH: {inputs.get('tsh', 'N/A')} mIU/L (normal: 0.4-4.0)
- B12: {inputs.get('b12', 'N/A')} pg/mL (normal: 200-900)
- Glucose: {inputs.get('glucose', 'N/A')} mg/dL (normal: 70-100)
"""
            else:
                lab_data = "No lab values available - analysis based on symptoms."
            
            prompt = f"""You are a compassionate AI health advisor specializing in women's neurological and hematological wellness.

ANALYSIS RESULTS:
- Neurological Risk Score: {neuro}%
- Hematological Risk Score: {hema}%
- Overall Health Score: {overall}%

PATIENT PROFILE:
- Age: {inputs.get('age', 'N/A')}
- Mode: {mode}
{lab_data}

KEY SYMPTOMS:
- Sleep Quality: {inputs.get('sleep_quality', 'N/A')}/10
- Stress Level: {inputs.get('stress', 'N/A')}/10
- Headache Frequency: {inputs.get('headache', 'N/A')}/10
- Dizziness: {inputs.get('dizziness', 'N/A')}/10
- Fatigue: {inputs.get('fatigue', 'N/A')}/10
- Physical Activity: {inputs.get('activity', 'N/A')} min/day
- Water Intake: {inputs.get('water', 'N/A')} L/day

TASK:
Provide a warm, empowering analysis including:
1. What these scores mean in simple terms
2. Possible underlying causes (be specific but not alarming)
3. Three actionable lifestyle improvements (prioritized)
4. When/why to consult a healthcare provider

Keep tone supportive, evidence-based, and empowering. Avoid medical jargon."""

            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an empathetic AI health advisor focused on women's neurological and hematological wellness. Provide clear, actionable, science-based insights."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=600,
                temperature=0.7
            )
            
            return "🤖 **AI-Enhanced Analysis**\n\n" + response.choices[0].message.content
            
        except Exception as e:
            st.warning(f"⚠️ AI analysis unavailable: {str(e)}\nUsing local clinical heuristics instead.")
            return generate_local_insight(neuro, hema, overall, inputs)
    else:
        return generate_local_insight(neuro, hema, overall, inputs)

def generate_local_insight(neuro, hema, overall, inputs):
    """
    Generate evidence-based local insights using clinical heuristics
    No AI required - based on medical reference standards
    """
    
    insight = "📊 **Clinical Heuristic Analysis** (No AI Required)\n\n"
    
    # === OVERALL ASSESSMENT ===
    if overall < 30:
        insight += "✨ **Excellent Health Balance**: Your neurological and hematological systems show strong stability across all measured parameters. "
    elif overall < 50:
        insight += "✅ **Good Health with Minor Concerns**: Most indicators are healthy, with a few areas that could benefit from optimization. "
    elif overall < 70:
        insight += "⚠️ **Moderate Health Imbalance**: Several indicators suggest your body is under stress. Focused lifestyle changes are recommended. "
    else:
        insight += "🚨 **Significant Health Concerns Detected**: Multiple risk factors are present. We strongly recommend consulting a healthcare provider for comprehensive evaluation. "
    
    # === NEUROLOGICAL ANALYSIS ===
    insight += "\n\n### 🧠 **Neurological Assessment**\n"
    
    if neuro < 40:
        insight += f"**Score: {neuro}% (Low Risk)**\n"
        insight += "Your neurological system appears resilient with minimal stress markers. "
    elif neuro < 70:
        insight += f"**Score: {neuro}% (Moderate Risk)**\n"
        insight += "Some neurological stress indicators are elevated. "
    else:
        insight += f"**Score: {neuro}% (High Risk)**\n"
        insight += "Multiple neurological symptoms suggest significant stress or potential underlying conditions. "
    
    # Specific neurological concerns
    concerns = []
    if inputs.get('headache', 0) > 7:
        concerns.append("- **Frequent Headaches**: May indicate vascular tension, dehydration, hormonal changes, or stress. Consider tracking triggers.")
    
    if inputs.get('sleep_quality', 5) < 4:
        concerns.append("- **Poor Sleep Quality**: Sleep is critical for neural repair. Chronic sleep deprivation increases dementia risk by 30%.")
    
    if inputs.get('stress', 5) > 7:
        concerns.append("- **High Stress Levels**: Chronic cortisol elevation can damage hippocampal neurons and impair memory formation.")
    
    if inputs.get('dizziness', 0) > 6:
        concerns.append("- **Frequent Dizziness**: Could relate to blood pressure, inner ear issues, anemia, or vestibular problems.")
    
    if inputs.get('forgetfulness', 0) > 6 or inputs.get('concentration', 0) > 6:
        concerns.append("- **Cognitive Symptoms**: May stem from sleep deprivation, stress, thyroid issues, or B12 deficiency.")
    
    if inputs.get('tingling', 0) > 6:
        concerns.append("- **Tingling/Numbness**: Often indicates peripheral neuropathy from B12 deficiency, diabetes, or nerve compression.")
    
    if concerns:
        insight += "\n\n**Key Concerns:**\n" + "\n".join(concerns)
    
    # === HEMATOLOGICAL ANALYSIS ===
    insight += "\n\n### 🩸 **Hematological Assessment**\n"
    
    if hema < 40:
        insight += f"**Score: {hema}% (Low Risk)**\n"
        insight += "Your blood health markers are within healthy ranges. "
    elif hema < 70:
        insight += f"**Score: {hema}% (Moderate Risk)**\n"
        insight += "Some blood health indicators show deviation from optimal ranges. "
    else:
        insight += f"**Score: {hema}% (High Risk)**\n"
        insight += "Multiple hematological markers are concerning and warrant medical evaluation. "
    
    # Specific hematological concerns
    if inputs.get('mode') == 'Lab Mode':
        hb = inputs.get('hemoglobin', 12)
        if hb < 11:
            insight += "\n- **Anemia Detected**: Hemoglobin {:.1f} g/dL is below normal. This reduces oxygen delivery to tissues including the brain.".format(hb)
        
        tsh = inputs.get('tsh', 3)
        if tsh > 4:
            insight += "\n- **Elevated TSH**: Level {:.1f} suggests hypothyroidism (underactive thyroid), causing fatigue, weight gain, and cognitive fog.".format(tsh)
        
        b12 = inputs.get('b12', 500)
        if b12 < 300:
            insight += "\n- **Low B12**: Level {} pg/mL can cause neurological symptoms (tingling, memory issues) and megaloblastic anemia.".format(b12)
        
        glucose = inputs.get('glucose', 100)
        if glucose > 125:
            insight += "\n- **Elevated Glucose**: Level {} mg/dL suggests prediabetes or diabetes. High blood sugar damages nerves and blood vessels.".format(glucose)
        elif glucose < 70:
            insight += "\n- **Low Glucose**: Level {} mg/dL can cause dizziness, confusion, and weakness. May indicate reactive hypoglycemia.".format(glucose)
    else:
        if inputs.get('pale_fatigue', 5) > 6:
            insight += "\n- **Anemia Symptoms**: Pallor and fatigue suggest low hemoglobin. Consider iron supplementation and iron-rich foods."
        
        if inputs.get('iron_diet', 5) < 4:
            insight += "\n- **Low Iron Intake**: Inadequate dietary iron can lead to iron-deficiency anemia over time."
        
        if inputs.get('cold_tired', 5) > 6:
            insight += "\n- **Thyroid Symptoms**: Feeling cold, tired, and gaining weight are classic hypothyroid signs. TSH testing recommended."
    
    # === ACTIONABLE RECOMMENDATIONS ===
    insight += "\n\n### 💡 **Evidence-Based Recommendations**\n"
    
    recommendations = []
    priority_count = 0
    
    # Sleep priority
    if inputs.get('sleep_quality', 5) < 6:
        priority_count += 1
        recommendations.append(f"**{priority_count}. Optimize Sleep (HIGH PRIORITY)**\n   - Target: 7-9 hours per night\n   - Sleep debt impairs cognitive function by 40% and increases inflammation\n   - Maintain consistent sleep/wake times, dark cool room, no screens 1hr before bed")
    
    # Hydration priority
    if inputs.get('water', 2.5) < 2:
        priority_count += 1
        recommendations.append(f"**{priority_count}. Increase Hydration**\n   - Target: 2-3 liters daily\n   - Even mild dehydration (2%) impairs cognitive performance and causes headaches\n   - Drink water first thing in morning and before meals")
    
    # Iron/nutrition priority
    if hema > 60 or inputs.get('iron_diet', 5) < 5:
        priority_count += 1
        recommendations.append(f"**{priority_count}. Boost Iron & B12 Intake**\n   - Iron-rich foods: red meat, spinach, lentils, fortified cereals\n   - B12 sources: eggs, dairy, fish, nutritional yeast\n   - Pair iron with vitamin C (citrus) for better absorption")
    
    # Stress management
    if inputs.get('stress', 5) > 6:
        priority_count += 1
        recommendations.append(f"**{priority_count}. Stress Management (CRITICAL)**\n   - Chronic stress shrinks the hippocampus and impairs immune function\n   - Daily practice: 10min meditation, deep breathing (4-7-8 technique), or yoga\n   - Consider counseling if stress feels overwhelming")
    
    # Exercise
    if inputs.get('activity', 60) < 30:
        priority_count += 1
        recommendations.append(f"**{priority_count}. Increase Physical Activity**\n   - Target: 30min moderate exercise daily (walking counts!)\n   - Exercise increases BDNF (brain growth factor) and improves circulation\n   - Start small: 10min walks after meals")
    
    # Diet quality
    if inputs.get('diet_quality', 6) < 5:
        priority_count += 1
        recommendations.append(f"**{priority_count}. Improve Diet Quality**\n   - Focus on whole foods: vegetables, fruits, whole grains, lean protein\n   - Mediterranean diet pattern reduces neurological disease risk by 35%\n   - Limit processed foods, excess sugar, and alcohol")
    
    if recommendations:
        insight += "\n" + "\n\n".join(recommendations[:4])  # Top 4 priorities
    
    # === WHEN TO SEEK MEDICAL CARE ===
    insight += "\n\n### 👨‍⚕️ **When to Consult a Healthcare Provider**\n"
    
    urgent_reasons = []
    if overall > 70:
        urgent_reasons.append("- **High overall risk score** suggests multiple systems under stress")
    
    if inputs.get('headache', 0) > 8:
        urgent_reasons.append("- **Severe/frequent headaches** warrant neurological evaluation")
    
    if inputs.get('mode') == 'Lab Mode':
        if inputs.get('hemoglobin', 12) < 10:
            urgent_reasons.append("- **Severe anemia** (Hb < 10) requires immediate treatment")
        if inputs.get('glucose', 100) > 140:
            urgent_reasons.append("- **Elevated glucose** needs diabetes screening")
    
    if urgent_reasons:
        insight += "**Seek care if you have:**\n" + "\n".join(urgent_reasons)
        insight += "\n\n**Recommended tests**: Complete Blood Count (CBC), Comprehensive Metabolic Panel (CMP), TSH, B12, Ferritin"
    else:
        insight += "Schedule a routine check-up to discuss your symptoms and consider basic screening tests (CBC, metabolic panel, thyroid function)."
    
    # === METHODOLOGY NOTE ===
    insight += "\n\n---\n*📚 Methodology: Scores calculated using evidence-based clinical reference ranges and weighted symptom correlations. This tool uses heuristic algorithms, not machine learning, ensuring transparent and reliable analysis without requiring datasets.*"
    
    return insight

def get_risk_color(score):
    """Return color based on risk score"""
    if score < 40:
        return "#2e7d32"  # Darker green
    elif score < 70:
        return "#f57c00"  # Darker orange
    else:
        return "#c62828"  # Darker red

def get_risk_emoji(score):
    """Return emoji based on risk level"""
    if score < 40:
        return "🟢"
    elif score < 70:
        return "🟠"
    else:
        return "🔴"

# ============================================
# MAIN APPLICATION
# ============================================

st.markdown('<h1 class="main-title">🧠 Neuvia AI — Neurological & Hematological Health Analyzer</h1>', unsafe_allow_html=True)

# Sidebar
with st.sidebar:
    st.markdown("### ⚙️ Configuration")
    
    mode = st.radio(
        "Select Input Mode:",
        ["Symptom Mode", "Lab Mode"],
        help="Choose Symptom Mode if you don't have lab results"
    )
    
    st.markdown("---")
    
    st.markdown("### 🤖 AI Enhancement (Optional)")
    st.markdown('<div class="info-badge">💡 <strong>Works Offline!</strong><br>AI is optional. App uses clinical heuristics by default.</div>', unsafe_allow_html=True)
    
    use_ai = st.checkbox("Enable OpenAI Enhanced Insights", value=False)
    
    api_key = None
    if use_ai:
        api_key = st.text_input(
            "OpenAI API Key:",
            type="password",
            help="Optional - enhances insights with GPT-4"
        )
        if not api_key:
            st.warning("⚠️ No API key entered. Using local analysis.")
    
    st.markdown("---")
    
    st.markdown("### 🔬 Methodology")
    with st.expander("How It Works"):
        st.markdown("""
        **No Dataset Required!**
        
        This app uses **clinical heuristics** based on:
        - Evidence-based medical reference ranges
        - Weighted symptom correlations
        - Established risk factor algorithms
        
        **Why No Machine Learning?**
        - More transparent & explainable
        - Works offline without training data
        - Based on validated clinical standards
        - Reliable for hackathon demo
        """)
    
    st.markdown("---")
    st.markdown("### 📊 About")
    st.info("Neuvia AI analyzes neurological and hematological health using evidence-based medical heuristics. No external data or ML models required.")

# Main content
inputs = {'mode': mode}

# Section A: Neurological Indicators
st.markdown('<div class="section-header">🧠 A. Neurological Indicators</div>', unsafe_allow_html=True)
st.markdown("Rate each symptom from 0 (never/none) to 10 (constant/severe)")

col1, col2 = st.columns(2)

with col1:
    inputs['headache'] = st.slider(
        "Headache Frequency",
        0, 10, 5,
        help="How often do you experience headaches?"
    )
    
    inputs['dizziness'] = st.slider(
        "Dizziness / Lightheadedness",
        0, 10, 5,
        help="Do you feel dizzy or faint often?"
    )
    
    inputs['tremors'] = st.slider(
        "Tremors / Shaking",
        0, 10, 5,
        help="Do your hands or body tremble?"
    )
    
    inputs['forgetfulness'] = st.slider(
        "Forgetfulness",
        0, 10, 5,
        help="Do you forget tasks or words often?"
    )
    
    inputs['concentration'] = st.slider(
        "Concentration Difficulty",
        0, 10, 5,
        help="Rate your ability to focus (0=excellent, 10=very poor)"
    )
    
    inputs['tingling'] = st.slider(
        "Tingling / Numbness",
        0, 10, 5,
        help="Do you feel tingling in hands/feet?"
    )

with col2:
    inputs['sleep_quality'] = st.slider(
        "Sleep Quality",
        0, 10, 5,
        help="Rate your sleep quality (0=terrible, 10=excellent)"
    )
    
    inputs['mood'] = st.slider(
        "Mood Swings / Anxiety",
        0, 10, 5,
        help="Do you feel moody or anxious often?"
    )
    
    inputs['eyestrain'] = st.slider(
        "Eye Strain / Vision Blur",
        0, 10, 5,
        help="Do you get blurry vision or strain?"
    )
    
    inputs['fatigue'] = st.slider(
        "Fatigue / Weakness",
        0, 10, 5,
        help="Do you feel tired most days?"
    )
    
    inputs['balance'] = st.slider(
        "Balance / Coordination Issues",
        0, 10, 5,
        help="Do you lose balance while walking?"
    )
    
    inputs['sensitivity'] = st.slider(
        "Sensitivity to Noise / Light",
        0, 10, 5,
        help="Do you get headaches from bright light or loud noise?"
    )

# Section B: Hematological Indicators
st.markdown('<div class="section-header">🩸 B. Hematological Indicators</div>', unsafe_allow_html=True)

if mode == "Lab Mode":
    st.markdown("Enter your lab values (if available)")
    st.markdown('<div class="info-badge">💡 Reference ranges shown are for adult women. Values are from standard clinical guidelines.</div>', unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        inputs['hemoglobin'] = st.number_input(
            "Hemoglobin (g/dL)",
            6.0, 18.0, 12.0, 0.1,
            help="Normal: 12-16 g/dL for women"
        )
        
        inputs['platelets'] = st.number_input(
            "Platelet Count (×10⁹/L)",
            50, 500, 250, 10,
            help="Normal: 150-400"
        )
        
        inputs['wbc'] = st.number_input(
            "WBC Count (×10⁹/L)",
            2.0, 15.0, 7.0, 0.1,
            help="Normal: 4-11"
        )
    
    with col2:
        inputs['b12'] = st.number_input(
            "Vitamin B12 (pg/mL)",
            100, 1000, 500, 10,
            help="Normal: 200-900"
        )
        
        inputs['tsh'] = st.number_input(
            "TSH (mIU/L)",
            0.2, 10.0, 3.0, 0.1,
            help="Normal: 0.4-4.0"
        )
        
        inputs['glucose'] = st.number_input(
            "Glucose (mg/dL)",
            70, 200, 100, 1,
            help="Normal fasting: 70-100"
        )
    
    with col3:
        inputs['ferritin'] = st.number_input(
            "Ferritin (ng/mL)",
            10, 300, 50, 5,
            help="Normal: 15-150 for women"
        )
        
        inputs['rbc'] = st.number_input(
            "RBC Count (×10⁶/μL)",
            3.5, 6.0, 4.5, 0.1,
            help="Normal: 4.0-5.5 for women"
        )
        
        inputs['mcv'] = st.number_input(
            "MCV (fL)",
            70, 100, 85, 1,
            help="Normal: 80-100"
        )

else:  # Symptom Mode
    st.markdown("Rate these symptoms (used as proxies for lab values)")
    st.markdown('<div class="info-badge">💡 These symptoms correlate with specific blood markers when labs aren\'t available.</div>', unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    
    with col1:
        inputs['pale_fatigue'] = st.slider(
            "Paleness / Fatigue Level",
            0, 10, 5,
            help="Correlates with hemoglobin levels"
        )
        
        inputs['bruising'] = st.slider(
            "Easy Bruising / Bleeding",
            0, 10, 5,
            help="Do you bruise easily or bleed from gums/nose?"
        )
        
        inputs['infections'] = st.slider(
            "Frequent Infections",
            0, 10, 5,
            help="Do you catch infections often?"
        )
        
        inputs['tingling_b12'] = st.slider(
            "Tingling / Burning Sensation",
            0, 10, 5,
            help="Do you feel tingling or burning in extremities?"
        )
        
        inputs['cold_tired'] = st.slider(
            "Feeling Cold / Sleepy / Weight Gain",
            0, 10, 5,
            help="Thyroid-related symptoms"
        )
    
    with col2:
        inputs['thirst'] = st.slider(
            "Excessive Thirst / Fatigue",
            0, 10, 5,
            help="Blood sugar related symptoms"
        )
        
        inputs['iron_diet'] = st.slider(
            "Iron-Rich Food Intake",
            0, 10, 5,
            help="Rate your intake of iron-rich foods (0=none, 10=excellent)"
        )
        
        inputs['breathless'] = st.slider(
            "Shortness of Breath",
            0, 10, 5,
            help="Do you feel short of breath on exertion?"
        )
        
        inputs['tired_well_fed'] = st.slider(
            "Tired Despite Good Diet",
            0, 10, 5,
            help="Do you feel tired but eat well?"
        )

# Section C: Vital & General Health Parameters
st.markdown('<div class="section-header">⚕️ C. Vital & General Health Parameters</div>', unsafe_allow_html=True)

col1, col2, col3 = st.columns(3)

with col1:
    inputs['age'] = st.number_input("Age", 18, 80, 30, 1)
    inputs['bmi'] = st.number_input("BMI", 15.0, 40.0, 22.0, 0.1, help="Weight(kg) / Height(m)²")
    inputs['bp_sys'] = st.number_input("Blood Pressure - Systolic", 90, 180, 120, 1, help="Normal: 90-120")
    inputs['bp_dia'] = st.number_input("Blood Pressure - Diastolic", 60, 120, 80, 1, help="Normal: 60-80")

with col2:
    inputs['heart_rate'] = st.number_input("Heart Rate (bpm)", 50, 120, 72, 1, help="Normal resting: 60-100")
    inputs['oxygen'] = st.number_input("Oxygen Saturation (%)", 85, 100, 98, 1, help="Normal: 95-100%")
    inputs['temperature'] = st.number_input("Body Temperature (°F)", 95.0, 103.0, 98.6, 0.1, help="Normal: 97-99°F")
    inputs['stress'] = st.slider("Stress Level", 0, 10, 5, help="0=no stress, 10=severe stress")

with col3:
    inputs['sleep_hours'] = st.slider("Sleep Hours per Night", 0, 12, 7, help="Recommended: 7-9 hours")
    inputs['activity'] = st.slider("Physical Activity (min/day)", 0, 120, 30, help="WHO recommends 150min/week")
    inputs['water'] = st.slider("Water Intake (liters/day)", 0.0, 5.0, 2.5, 0.1, help="Recommended: 2-3 liters")
    inputs['diet_quality'] = st.slider("Diet Quality", 0, 10, 6, help="Overall nutrition quality")

# Analysis Button in Sidebar
st.sidebar.markdown("---")
st.sidebar.markdown("### 🔍 Ready to Analyze?")
if st.sidebar.button("🔍 Analyze Health", use_container_width=True, type="primary"):
    st.session_state.analyzed = True
    st.session_state.show_results = True
    st.rerun()

# Results Display
if st.session_state.get('show_results', False):
    with st.spinner("🔬 Analyzing your health data using clinical heuristics..."):
        # Calculate scores
        neuro_risk, hema_risk, overall_risk = calculate_scores(inputs)
        
        # Display results
        st.markdown("---")
        st.markdown('<div class="section-header">📊 Your Health Analysis Results</div>', unsafe_allow_html=True)
        
        st.markdown('<div class="result-box">', unsafe_allow_html=True)
        
        # Create three columns for results
        res_col1, res_col2, res_col3 = st.columns(3)
        
        with res_col1:
            st.markdown(f'<div class="risk-label">{get_risk_emoji(neuro_risk)} Neurological Risk</div>', unsafe_allow_html=True)
            st.progress(neuro_risk / 100)
            st.markdown(f'<h1 style="color: {get_risk_color(neuro_risk)}; margin-top: 0.5rem; text-align: center;">{neuro_risk}%</h1>', unsafe_allow_html=True)
        
        with res_col2:
            st.markdown(f'<div class="risk-label">{get_risk_emoji(hema_risk)} Hematological Risk</div>', unsafe_allow_html=True)
            st.progress(hema_risk / 100)
            st.markdown(f'<h1 style="color: {get_risk_color(hema_risk)}; margin-top: 0.5rem; text-align: center;">{hema_risk}%</h1>', unsafe_allow_html=True)
        
        with res_col3:
            st.markdown(f'<div class="risk-label">{get_risk_emoji(overall_risk)} Overall Health Risk</div>', unsafe_allow_html=True)
            st.progress(overall_risk / 100)
            st.markdown(f'<h1 style="color: {get_risk_color(overall_risk)}; margin-top: 0.5rem; text-align: center;">{overall_risk}%</h1>', unsafe_allow_html=True)
        
        st.markdown('</div>', unsafe_allow_html=True)
        
        # Color Legend
        st.markdown("---")
        legend_col1, legend_col2, legend_col3 = st.columns(3)
        with legend_col1:
            st.markdown("🟢 **Low Risk**: < 40% - Excellent health indicators")
        with legend_col2:
            st.markdown("🟠 **Moderate Risk**: 40-70% - Some areas need attention")
        with legend_col3:
            st.markdown("🔴 **High Risk**: > 70% - Medical consultation recommended")
        
        # Generate insights
        st.markdown("---")
        st.markdown('<div class="section-header">💡 Personalized Health Insights & Recommendations</div>', unsafe_allow_html=True)
        
        with st.spinner("Generating comprehensive health insights..."):
            insight = generate_insight(
                neuro_risk, 
                hema_risk, 
                overall_risk, 
                inputs,
                use_ai=use_ai and api_key is not None,
                api_key=api_key
            )
        
        st.markdown(f'<div class="insight-box">{insight}</div>', unsafe_allow_html=True)
        
        # Action buttons
        st.markdown("---")
        action_col1, action_col2, action_col3 = st.columns(3)
        
        with action_col1:
            if st.button("📄 Generate PDF Report", use_container_width=True):
                st.info("📄 PDF generation feature coming soon! For now, you can screenshot or download JSON results below.")
        
        with action_col2:
            # Save results as JSON
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            results_data = {
                "timestamp": timestamp,
                "mode": mode,
                "scores": {
                    "neurological_risk": neuro_risk,
                    "hematological_risk": hema_risk,
                    "overall_risk": overall_risk
                },
                "risk_levels": {
                    "neurological": "Low" if neuro_risk < 40 else ("Moderate" if neuro_risk < 70 else "High"),
                    "hematological": "Low" if hema_risk < 40 else ("Moderate" if hema_risk < 70 else "High"),
                    "overall": "Low" if overall_risk < 40 else ("Moderate" if overall_risk < 70 else "High")
                },
                "inputs": {k: v for k, v in inputs.items() if k != 'mode'},
                "insights": insight
            }
            
            results_json = json.dumps(results_data, indent=2)
            
            st.download_button(
                label="💾 Download Results (JSON)",
                data=results_json,
                file_name=f"neuvia_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
                mime="application/json",
                use_container_width=True
            )
        
        with action_col3:
            if st.button("🔄 New Analysis", use_container_width=True):
                st.session_state.show_results = False
                st.session_state.analyzed = False
                st.rerun()
        
        # Additional resources
        st.markdown("---")
        st.markdown("### 📚 Additional Resources")
        
        resource_col1, resource_col2 = st.columns(2)
        
        with resource_col1:
            st.markdown("""
            **Understanding Your Scores:**
            - Scores are calculated using clinical reference ranges
            - Higher scores indicate greater deviation from optimal health
            - Multiple factors contribute to each score
            """)
        
        with resource_col2:
            st.markdown("""
            **Next Steps:**
            - Save your results for tracking over time
            - Share with your healthcare provider
            - Implement recommended lifestyle changes
            - Retest in 4-6 weeks to track progress
            """)

else:
    # Welcome message when no analysis yet
    st.markdown("---")
    st.markdown('<div class="info-badge">👆 <strong>Get Started:</strong> Fill in all the health indicators above, then click "Analyze Health" in the sidebar to see your personalized results.</div>', unsafe_allow_html=True)
    
    # Sample data for demo
    with st.expander("🎯 Quick Demo - Load Sample Data"):
        st.markdown("**Try these sample scenarios:**")
        
        demo_col1, demo_col2 = st.columns(2)
        
        with demo_col1:
            if st.button("📊 Load Healthy Profile", use_container_width=True):
                st.info("💡 Tip: Manually set values or use this as reference. Auto-fill coming in next version!")
                st.markdown("""
                **Suggested Values for Healthy Profile:**
                - All neurological sliders: 2-3
                - Sleep quality: 8
                - Stress: 3
                - Hemoglobin: 13.5 g/dL
                - All vitals: Normal ranges
                """)
        
        with demo_col2:
            if st.button("⚠️ Load At-Risk Profile", use_container_width=True):
                st.info("💡 This demonstrates a profile with multiple risk factors.")
                st.markdown("""
                **Suggested Values for At-Risk Profile:**
                - Headache: 8, Dizziness: 7, Fatigue: 8
                - Sleep quality: 3
                - Stress: 9
                - Hemoglobin: 9.5 g/dL
                - TSH: 6.5
                - Water intake: 1.0 L
                """)

# Footer
st.markdown("---")
st.markdown("""
<div style="text-align: center; padding: 2rem; background: rgba(232, 215, 195, 0.4); border-radius: 15px;">
    <p style="font-size: 1.2rem; color: #0d0604; font-weight: 700;"><strong>🧠 Neuvia AI</strong> - Empowering Women's Neurological & Hematological Wellness</p>
    
    <p style="font-size: 0.95rem; margin-top: 1rem; color: #1a0f08; font-weight: 600;">
        <strong>✨ Key Features:</strong><br>
        ✅ Works 100% Offline - No Dataset Required<br>
        ✅ Evidence-Based Clinical Heuristics<br>
        ✅ Optional AI Enhancement with OpenAI<br>
        ✅ Transparent & Explainable Analysis
    </p>
    
    <p style="font-size: 0.85rem; font-style: italic; margin-top: 1.5rem; color: #1a0f08; font-weight: 600;">
        ⚠️ <strong>Medical Disclaimer:</strong> This tool is for informational and educational purposes only. 
        It does not provide medical advice, diagnosis, or treatment. Always consult with a qualified 
        healthcare provider for medical concerns. Results are based on heuristic algorithms and 
        should not replace professional medical evaluation.
    </p>
    
    <p style="font-size: 0.8rem; margin-top: 1rem; color: #1a0f08; font-weight: 600;">
        Built with ❤️ using Streamlit | Hackathon Project 2025
    </p>
</div>
""", unsafe_allow_html=True)