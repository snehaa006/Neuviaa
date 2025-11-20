# ============================================================================
# FILE 1: evaluate_anaemia.py
# Save this as: evaluate_anaemia.py
# ============================================================================

import pandas as pd
import numpy as np

def evaluate_anaemia(inputs):
    """
    Evaluate anaemia risk during pregnancy based on symptoms and risk factors.
    
    Args:
        inputs (dict): Dictionary containing all health parameters
    
    Returns:
        dict: Contains risk_level, probability, reasons, and advice
    """
    
    risk_score = 0
    risk_factors = []
    
    # Age risk (very young or older mothers)
    age = inputs.get('Age', 25)
    if age < 20:
        risk_score += 12
        risk_factors.append("young_maternal_age")
    elif age >= 35:
        risk_score += 10
        risk_factors.append("advanced_maternal_age")
    
    # Trimester analysis
    trimester = inputs.get('Trimester', 'Second')
    if trimester == 'Third':
        risk_score += 15
        risk_factors.append("third_trimester")
    elif trimester == 'Second':
        risk_score += 8
    
    # Fatigue (major symptom)
    if inputs.get('Fatigue', 0) == 1:
        risk_score += 20
        risk_factors.append("fatigue")
    
    # Pale Skin (key visual indicator)
    if inputs.get('Pale_Skin', 0) == 1:
        risk_score += 22
        risk_factors.append("pale_skin")
    
    # Dizziness (common symptom)
    if inputs.get('Dizziness', 0) == 1:
        risk_score += 18
        risk_factors.append("dizziness")
    
    # Shortness of Breath (significant symptom)
    if inputs.get('Shortness_of_Breath', 0) == 1:
        risk_score += 20
        risk_factors.append("shortness_of_breath")
    
    # Headache
    if inputs.get('Headache', 0) == 1:
        risk_score += 15
        risk_factors.append("headache")
    
    # Cold Hands and Feet (circulation issue)
    if inputs.get('Cold_Hands_Feet', 0) == 1:
        risk_score += 16
        risk_factors.append("cold_hands_feet")
    
    # History of Anaemia (strong predictor)
    if inputs.get('History_of_Anaemia', 0) == 1:
        risk_score += 25
        risk_factors.append("history_of_anaemia")
    
    # Multiple symptoms increase risk exponentially
    symptom_count = sum([
        inputs.get('Fatigue', 0),
        inputs.get('Pale_Skin', 0),
        inputs.get('Dizziness', 0),
        inputs.get('Shortness_of_Breath', 0),
        inputs.get('Headache', 0),
        inputs.get('Cold_Hands_Feet', 0)
    ])
    
    if symptom_count >= 5:
        risk_score += 15
        risk_factors.append("multiple_symptoms")
    elif symptom_count >= 4:
        risk_score += 10
    elif symptom_count >= 3:
        risk_score += 5
    
    # Cap risk score at 100
    risk_score = min(risk_score, 100)
    
    # Determine risk level
    if risk_score >= 60:
        risk_level = "High Risk"
    elif risk_score >= 35:
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
    
    # Critical symptoms requiring immediate attention
    if "pale_skin" in risk_factors and "shortness_of_breath" in risk_factors:
        advice_list.append("⚠️ URGENT: Severe symptoms detected. Contact your healthcare provider immediately")
    
    if "history_of_anaemia" in risk_factors:
        advice_list.append("Schedule regular hemoglobin checks (every 4-6 weeks) due to previous anaemia")
    
    if "fatigue" in risk_factors or "dizziness" in risk_factors:
        advice_list.append("Get adequate rest, avoid sudden position changes to prevent dizziness")
    
    if "pale_skin" in risk_factors:
        advice_list.append("Monitor for worsening pallor, especially in nail beds and inner eyelids")
    
    if "shortness_of_breath" in risk_factors:
        advice_list.append("Avoid strenuous activities and rest when experiencing breathlessness")
    
    if "cold_hands_feet" in risk_factors:
        advice_list.append("Keep extremities warm, wear warm socks and gloves in cold weather")
    
    if "headache" in risk_factors:
        advice_list.append("Stay hydrated and maintain regular meal times to prevent headaches")
    
    if "third_trimester" in risk_factors:
        advice_list.append("Third trimester requires extra iron - discuss supplementation with your doctor")
    
    if "multiple_symptoms" in risk_factors:
        advice_list.append("Multiple symptoms present - comprehensive blood work recommended")
    
    # General iron-rich diet advice
    advice_list.append("🥩 Eat iron-rich foods: red meat, spinach, lentils, beans, fortified cereals")
    advice_list.append("🍊 Consume Vitamin C with iron sources (citrus fruits, tomatoes) for better absorption")
    advice_list.append("💊 Take prescribed iron supplements (typically 30-60mg daily during pregnancy)")
    advice_list.append("☕ Avoid tea/coffee with meals as they inhibit iron absorption")
    advice_list.append("🍳 Cook in iron cookware to increase iron content in food")
    
    # Monitoring advice
    advice_list.append("📊 Request Complete Blood Count (CBC) test to check hemoglobin levels")
    advice_list.append("📅 Attend all prenatal appointments for regular monitoring")
    
    # Lifestyle advice
    if not advice_list or len(advice_list) < 3:
        advice_list.append("✅ Continue healthy pregnancy practices and balanced nutrition")
    
    return advice_list