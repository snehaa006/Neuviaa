def evaluate_thyroid(today_symptoms, symptom_weights=None):
    """
    Evaluate Thyroid disorder risk based on symptoms and lab values.
    
    Args:
        today_symptoms (dict): Dictionary containing symptom values and lab results
        symptom_weights (dict, optional): Custom weights for symptoms
    
    Returns:
        dict: Risk assessment with probability, reasons, and advice
    """
    score = 0
    reasons = []
    advice = []
    contributions = []

    if symptom_weights is None:
        symptom_weights = {
            "fatigue": 2.0,
            "weight_gain": 1.5,
            "cold_intolerance": 2.0,
            "constipation": 1.2,
            "hair_loss": 1.5,
            "palpitations": 1.3,
            "menstrual_irregularity": 1.5,
            "TSH": 3.0,           # Lab value - highest weight
            "T3": 2.0,            # Lab value
            "T4": 2.0,            # Lab value
            "family_history": 1.8,
            "bmi": 1.0
        }

    # Priority color map for visualization
    color_map = {
        "fatigue": "#B22222",          # Firebrick
        "weight_gain": "#A0522D",      # Sienna
        "cold_intolerance": "#4682B4", # Steel Blue
        "constipation": "#8B4513",     # Saddle Brown
        "hair_loss": "#DAA520",        # Goldenrod
        "palpitations": "#DC143C",     # Crimson
        "menstrual_irregularity": "#FF69B4", # Hot Pink
        "TSH": "#8B0000",              # Dark Red (most important)
        "T3": "#CD5C5C",               # Indian Red
        "T4": "#FF6347",               # Tomato
        "family_history": "#9370DB",   # Medium Purple
        "bmi": "#D2B48C"               # Tan
    }

    def add_contribution(symptom, label):
        contributions.append({
            "symptom": symptom,
            "weight": symptom_weights[symptom],
            "label": label,
            "color": color_map[symptom]
        })

    # --- Clinical Symptom Checks ---
    if today_symptoms.get('fatigue', 0) == 1:
        score += symptom_weights['fatigue']
        reasons.append("Persistent fatigue reported")
        advice.append("→ Ensure adequate rest and consider thyroid function testing")
        add_contribution("fatigue", "Fatigue")

    if today_symptoms.get('weight_gain', 0) == 1:
        score += symptom_weights['weight_gain']
        reasons.append("Unexplained weight gain observed")
        advice.append("→ Monitor weight regularly and maintain balanced diet")
        add_contribution("weight_gain", "Weight Gain")

    if today_symptoms.get('cold_intolerance', 0) == 1:
        score += symptom_weights['cold_intolerance']
        reasons.append("Cold intolerance - classic hypothyroid symptom")
        advice.append("→ Keep warm and track body temperature regularly")
        add_contribution("cold_intolerance", "Cold Intolerance")

    if today_symptoms.get('constipation', 0) == 1:
        score += symptom_weights['constipation']
        reasons.append("Constipation present - may indicate low thyroid")
        advice.append("→ Increase fiber intake and stay hydrated")
        add_contribution("constipation", "Constipation")

    if today_symptoms.get('hair_loss', 0) == 1:
        score += symptom_weights['hair_loss']
        reasons.append("Hair loss or thinning observed")
        advice.append("→ Hair changes often accompany thyroid disorders")
        add_contribution("hair_loss", "Hair Loss")

    if today_symptoms.get('palpitations', 0) == 1:
        score += symptom_weights['palpitations']
        reasons.append("Heart palpitations detected")
        advice.append("→ May indicate hyperthyroidism; monitor heart rate")
        add_contribution("palpitations", "Palpitations")

    if today_symptoms.get('menstrual_irregularity', 0) == 1:
        score += symptom_weights['menstrual_irregularity']
        reasons.append("Menstrual irregularity reported")
        advice.append("→ Thyroid hormones affect reproductive cycle")
        add_contribution("menstrual_irregularity", "Menstrual Issues")

    # --- Critical Lab Values Analysis ---
    # TSH (Thyroid Stimulating Hormone) - Most important marker
    tsh = today_symptoms.get('TSH', None)
    if tsh is not None:
        if tsh > 4.0:  # Hypothyroidism (underactive)
            score += symptom_weights['TSH'] * min((tsh - 4.0) / 2.0, 2.0)  # Scale up to 2x weight
            reasons.append(f"Elevated TSH level ({tsh:.2f} mIU/L) - indicates hypothyroidism")
            advice.append("→ URGENT: Consult endocrinologist for thyroid hormone therapy")
            add_contribution("TSH", "High TSH")
        elif tsh < 0.4:  # Hyperthyroidism (overactive)
            score += symptom_weights['TSH'] * min((0.4 - tsh) / 0.3, 2.0)
            reasons.append(f"Low TSH level ({tsh:.2f} mIU/L) - indicates hyperthyroidism")
            advice.append("→ URGENT: Medical evaluation needed for hyperthyroidism")
            add_contribution("TSH", "Low TSH")

    # T3 (Triiodothyronine) - Active thyroid hormone
    t3 = today_symptoms.get('T3', None)
    if t3 is not None:
        if t3 < 1.2:  # Low T3
            score += symptom_weights['T3']
            reasons.append(f"Low T3 level ({t3:.2f}) detected")
            advice.append("→ Low T3 reduces metabolism and energy")
            add_contribution("T3", "Low T3")
        elif t3 > 4.0:  # High T3
            score += symptom_weights['T3']
            reasons.append(f"Elevated T3 level ({t3:.2f}) detected")
            advice.append("→ High T3 may cause anxiety and rapid heartbeat")
            add_contribution("T3", "High T3")

    # T4 (Thyroxine) - Main thyroid hormone
    t4 = today_symptoms.get('T4', None)
    if t4 is not None:
        if t4 < 0.8:  # Low T4
            score += symptom_weights['T4']
            reasons.append(f"Low T4 level ({t4:.2f}) detected")
            advice.append("→ Low T4 confirms hypothyroidism diagnosis")
            add_contribution("T4", "Low T4")
        elif t4 > 2.5:  # High T4
            score += symptom_weights['T4']
            reasons.append(f"Elevated T4 level ({t4:.2f}) detected")
            advice.append("→ High T4 requires immediate medical attention")
            add_contribution("T4", "High T4")

    # --- Risk Factors ---
    if today_symptoms.get('family_history', 0) == 1:
        score += symptom_weights['family_history']
        reasons.append("Family history of thyroid disorders")
        advice.append("→ Genetic predisposition increases risk - regular screening advised")
        add_contribution("family_history", "Family History")

    # BMI Analysis
    bmi = today_symptoms.get('bmi', None)
    if bmi is not None:
        if bmi >= 30:  # Obesity linked to thyroid issues
            score += symptom_weights['bmi']
            reasons.append(f"High BMI ({bmi:.1f}) - associated with thyroid dysfunction")
            advice.append("→ Weight management important for thyroid health")
            add_contribution("bmi", "High BMI")

    # --- Scoring ---
    max_score = sum(symptom_weights.values())
    probability = round((score / max_score) * 100) if max_score else 0

    # Determine label based on dataset (0=Normal, 1=Hypothyroid, 2=Hyperthyroid)
    # For simplicity, we'll use risk levels
    if not reasons:
        risk = "Low Risk"
        probability = 0
        advice = [
            "✅ No major thyroid disorder symptoms detected.",
            "→ Maintain healthy lifestyle and balanced diet",
            "→ Include iodine-rich foods (fish, dairy, eggs)",
            "→ Schedule routine thyroid screening annually"
        ]
        contributions = []
    else:
        risk = "High Risk" if probability >= 70 else "Moderate Risk" if probability >= 40 else "Low Risk"

    # Additional advice based on risk level
    if risk == "High Risk":
        advice.extend([
            "→ CRITICAL: Schedule endocrinologist appointment immediately",
            "→ Request complete thyroid panel (TSH, Free T3, Free T4, TPO antibodies)",
            "→ Avoid self-medication with thyroid supplements",
            "→ Monitor symptoms daily until medical consultation"
        ])
    elif risk == "Moderate Risk":
        advice.extend([
            "→ Schedule thyroid function test within 2 weeks",
            "→ Track symptoms in a diary (fatigue, weight, temperature)",
            "→ Reduce goitrogenic foods if hypothyroid symptoms present",
            "→ Maintain regular sleep schedule and stress management"
        ])

    # Determine specific thyroid condition based on lab values
    thyroid_type = "Unknown"
    if tsh is not None:
        if tsh > 4.0:
            thyroid_type = "Hypothyroidism (Underactive)"
        elif tsh < 0.4:
            thyroid_type = "Hyperthyroidism (Overactive)"
        else:
            thyroid_type = "Normal TSH Range"

    return {
        "risk": risk,
        "probability": f"{probability}%",
        "probability_value": probability,
        "why": reasons,
        "next_steps": advice,
        "symptom_contributions": contributions,
        "risk_level": risk,  # For consistency with other apps
        "thyroid_type": thyroid_type  # Additional info
    }