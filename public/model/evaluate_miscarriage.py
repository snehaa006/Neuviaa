# evaluate_miscarriage.py

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