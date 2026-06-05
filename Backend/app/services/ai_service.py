import os
import random

def analyze_uploaded_media(file_path: str, file_name: str, description: str) -> dict:
    """
    Simulates a computer vision AI analysis on an uploaded image or video.
    Returns detected crime category, confidence, identified objects, severity level,
    and dispatch recommendation.
    """
    desc_lower = description.lower() if description else ""
    name_lower = file_name.lower() if file_name else ""
    
    # Defaults
    category = "Theft"
    confidence = round(random.uniform(85.0, 98.5), 1)
    objects = ["Person", "Suspicious movement"]
    severity = "Medium"
    recommendation = "Officer dispatch recommended. Secure the area and review local CCTV feeds."
    police_code = "DISPATCH-10-31" # Code for Crime in Progress / Theft
    
    # Pattern matching for simulated AI intelligence
    if any(k in desc_lower or k in name_lower for k in ["fire", "smoke", "burn", "arson"]):
        category = "Arson / Fire"
        objects = ["Smoke plume", "Thermal anomaly", "Open flame", "Gasoline container"]
        severity = "Critical"
        recommendation = "Immediate dispatch of Fire department and police units. Evacuate adjacent structures."
        police_code = "DISPATCH-10-70" # Code for Fire Alarm
        
    elif any(k in desc_lower or k in name_lower for k in ["vandal", "spray", "paint", "graffiti", "damage", "broke"]):
        category = "Vandalism"
        objects = ["Aerosol can", "Wall graffiti", "Broken glass", "Masked individual"]
        severity = "Low"
        recommendation = "Schedule officer patrol. Log for community service cleanup."
        police_code = "DISPATCH-10-54" # Code for Vandalism / Property Damage
        
    elif any(k in desc_lower or k in name_lower for k in ["rob", "steal", "thief", "thiefs", "burglary", "break", "stole", "shoplift"]):
        category = "Theft"
        objects = ["Crowbar", "Backpack", "Forced lock entry", "Hooded suspect"]
        severity = "High"
        recommendation = "Dispatch local precinct patrol. Suspect may be in vicinity. Secure finger-prints at entry point."
        police_code = "DISPATCH-10-15" # Code for Burglary / Breaking & Entering
        
    elif any(k in desc_lower or k in name_lower for k in ["fight", "assault", "hit", "weapon", "gun", "knife", "attack"]):
        category = "Assault"
        objects = ["Bladed weapon / Firearm", "Physical altercation", "Injured person", "Aggressive posture"]
        severity = "Critical"
        recommendation = "URGENT dispatch of armed units and emergency medical services (EMS). Extreme caution advised."
        police_code = "DISPATCH-10-10" # Code for Fight in Progress
        
    elif any(k in desc_lower or k in name_lower for k in ["drug", "weed", "cocaine", "pill", "needle", "inject"]):
        category = "Drug Trafficking"
        objects = ["Substance packaging", "Hand-to-hand exchange", "Syringe", "Unidentified powder"]
        severity = "High"
        recommendation = "Notify narcotics division. Schedule plainclothes surveillance of coordinates."
        police_code = "DISPATCH-10-96" # Code for Narcotics Activity
        
    elif any(k in desc_lower or k in name_lower for k in ["fraud", "card", "scam", "phishing", "computer", "hack"]):
        category = "Fraud / Cyber Crime"
        objects = ["Cloned card reader", "Computer terminal", "Spoofed site", "Ledger logs"]
        severity = "Medium"
        recommendation = "Route to Cyber Crimes Unit. Freeze associated accounts and trace IP coordinates."
        police_code = "DISPATCH-10-82" # Code for Cyber Incident / Financial Fraud

    elif any(k in desc_lower or k in name_lower for k in ["accident", "car", "crash", "collision", "hit and run"]):
        category = "Traffic Incident / Crash"
        objects = ["Debris on road", "Damaged vehicle bumper", "Skid marks", "Airbag deployment"]
        severity = "High"
        recommendation = "Dispatch traffic division and tow services. Check local cameras for vehicle registration plate."
        police_code = "DISPATCH-10-45" # Code for Traffic Accident
        
    return {
        "category": category,
        "confidence": f"{confidence}%",
        "detected_objects": objects,
        "severity": severity,
        "police_code": police_code,
        "dispatch_recommendation": recommendation,
        "media_inspected": os.path.basename(file_path) if file_path else "Not provided"
    }
