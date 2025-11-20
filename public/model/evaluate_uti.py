def evaluate_uti(today_symptoms, symptom_weights=None):
    """
    Evaluate UTI (Urinary Tract Infection) risk based on symptoms and history.
    
    Args:
        today_symptoms (dict): Dictionary containing symptom values
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
            "Frequent_Urination": 2.0,
            "Burning_Sensation": 2.5,
            "Lower_Abdominal_Pain": 2.0,
            "Fever": 2.0,
            "Cloudy_Urine": 1.5,
            "Blood_in_Urine": 2.5,
            "History_of_UTI": 1.5
        }

    # Priority color map for visualization
    color_map = {
        "Frequent_Urination": "#FFA500",      # Orange
        "Burning_Sensation": "#FF4500",       # Orange Red
        "Lower_Abdominal_Pain": "#B22222",    # Firebrick
        "Cloudy_Urine": "#BDB76B",            # Dark Khaki
        "Fever": "#DC143C",                   # Crimson
        "Blood_in_Urine": "#8B0000",          # Dark Red
        "History_of_UTI": "#DAA520"           # Goldenrod
    }

    def add_contribution(symptom, label):
        contributions.append({
            "symptom": symptom,
            "weight": symptom_weights[symptom],
            "label": label,
            "color": color_map[symptom]
        })

    # --- Symptom Checks ---
    if today_symptoms.get('Frequent_Urination', 0) == 1:
        score += symptom_weights['Frequent_Urination']
        reasons.append("Frequent urination detected")
        advice.append("→ Track urination frequency throughout the day")
        add_contribution("Frequent_Urination", "Frequent Urination")

    if today_symptoms.get('Burning_Sensation', 0) == 1:
        score += symptom_weights['Burning_Sensation']
        reasons.append("Burning sensation while urinating")
        advice.append("→ Increase water intake to help flush out bacteria")
        add_contribution("Burning_Sensation", "Burning Sensation")

    if today_symptoms.get('Lower_Abdominal_Pain', 0) == 1:
        score += symptom_weights['Lower_Abdominal_Pain']
        reasons.append("Lower abdominal pain present")
        advice.append("→ Apply warm compress to lower abdomen for relief")
        add_contribution("Lower_Abdominal_Pain", "Abdominal Pain")

    if today_symptoms.get('Fever', 0) == 1:
        score += symptom_weights['Fever']
        reasons.append("Fever detected - possible infection spreading")
        advice.append("→ Monitor temperature regularly; seek medical attention if fever persists")
        add_contribution("Fever", "Fever")

    if today_symptoms.get('Cloudy_Urine', 0) == 1:
        score += symptom_weights['Cloudy_Urine']
        reasons.append("Cloudy or foul-smelling urine observed")
        advice.append("→ Maintain good hygiene and drink more fluids")
        add_contribution("Cloudy_Urine", "Cloudy Urine")

    if today_symptoms.get('Blood_in_Urine', 0) == 1:
        score += symptom_weights['Blood_in_Urine']
        reasons.append("Blood in urine - indicates severe UTI")
        advice.append("→ URGENT: Consult doctor immediately for urine culture test")
        add_contribution("Blood_in_Urine", "Blood in Urine")

    if today_symptoms.get('History_of_UTI', 0) == 1:
        score += symptom_weights['History_of_UTI']
        reasons.append("Previous history of UTI increases recurrence risk")
        advice.append("→ Consider preventive measures and regular check-ups")
        add_contribution("History_of_UTI", "UTI History")

    # --- Scoring ---
    max_score = sum(symptom_weights.values())
    probability = round((score / max_score) * 100) if max_score else 0

    if not reasons:
        risk = "Low Risk"
        probability = 0
        advice = [
            "✅ No major symptoms of UTI detected today.",
            "→ Stay hydrated (8-10 glasses of water daily)",
            "→ Maintain proper hygiene practices",
            "→ Urinate regularly and don't hold urine for long periods"
        ]
        contributions = []  # No pie chart for low risk
    else:
        risk = "High Risk" if probability >= 70 else "Moderate Risk" if probability >= 40 else "Low Risk"

    # Additional advice based on risk level
    if risk == "High Risk":
        advice.extend([
            "→ URGENT: Schedule appointment with healthcare provider",
            "→ Request urine culture and sensitivity test",
            "→ Complete full course of antibiotics if prescribed"
        ])
    elif risk == "Moderate Risk":
        advice.extend([
            "→ Monitor symptoms closely for next 24-48 hours",
            "→ Increase fluid intake significantly",
            "→ Consider over-the-counter urinary pain relief (consult pharmacist)"
        ])

    return {
        "risk": risk,
        "probability": f"{probability}%",
        "probability_value": probability,
        "why": reasons,
        "next_steps": advice,
        "symptom_contributions": contributions,
        "risk_level": risk  # For consistency with GDM app
    }