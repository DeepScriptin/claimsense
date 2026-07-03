// ClaimSense AI - Mock Claims Data
window.ClaimSenseData = {
  claims: [
    {
      id: "CS-2026-0814",
      date: "2026-07-02",
      patient: "Aarav Sharma",
      age: 48,
      gender: "Male",
      hospital: "Apollo Specialty Hospitals",
      city: "Chennai",
      procedure: "Coronary Angioplasty (PTCA)",
      amount: 385000,
      riskScore: 89,
      status: "Flagged",
      leakageType: "Inflated Billing",
      explanation: "Room rent and consumables charges are 2.8x higher than the standard pre-agreed tariff for PTCA at this provider. Same provider has submitted 4 similar inflated claims this week.",
      shapValues: {
        "Provider Tariff Deviation": 35,
        "Provider Historical Claim Vol": 22,
        "Consumables anomalies": 18,
        "Procedure vs Age matching": 5,
        "Patient Historical Risk": -5,
        "Other factors": 14
      },
      billingLines: [
        { item: "Room Rent (ICU - 3 Days)", claimed: 75000, standard: 30000, variance: 45000 },
        { item: "Stent (Drug Eluting)", claimed: 120000, standard: 120000, variance: 0 },
        { item: "OT & Surgeon Charges", claimed: 110000, standard: 90000, variance: 20000 },
        { item: "Consumables (Syringes, Catheters)", claimed: 55000, standard: 15000, variance: 40000 },
        { item: "Pharmacy & Labs", claimed: 25000, standard: 20000, variance: 5000 }
      ]
    },
    {
      id: "CS-2026-0792",
      date: "2026-07-01",
      patient: "Priya Patel",
      age: 32,
      gender: "Female",
      hospital: "Fortis Memorial Research Institute",
      city: "Gurugram",
      procedure: "Laparoscopic Cholecystectomy",
      amount: 195000,
      riskScore: 78,
      status: "Flagged",
      leakageType: "Upcoding",
      explanation: "Claimed complex acute gangrenous cholecystectomy, but ultrasound reports and patient history indicate routine chronic cholecystitis. Upcoding suspected to bypass standard package limits.",
      shapValues: {
        "Clinical Document Mismatch": 40,
        "Package Override Flag": 20,
        "Provider Cost Index": 12,
        "Procedure Frequency": 8,
        "Patient Co-morbidities": -4,
        "Other factors": 2
      },
      billingLines: [
        { item: "ICU Day Charges (Unjustified)", claimed: 45000, standard: 0, variance: 45000 },
        { item: "Laparoscopic Package", claimed: 110000, standard: 110000, variance: 0 },
        { item: "OT Consumables & Extra Port", claimed: 25000, standard: 10000, variance: 15000 },
        { item: "Medications & Pharmacy", claimed: 15000, standard: 15000, variance: 0 }
      ]
    },
    {
      id: "CS-2026-0901",
      date: "2026-07-03",
      patient: "Rajesh Iyer",
      age: 67,
      gender: "Male",
      hospital: "Manipal Hospital",
      city: "Bengaluru",
      procedure: "Total Knee Replacement (Unilateral)",
      amount: 280000,
      riskScore: 34,
      status: "Approved",
      leakageType: "None",
      explanation: "Claim aligns fully with patient demographics, pre-authorization details, and standard hospital package pricing. Low risk score.",
      shapValues: {
        "Provider Tariff Deviation": 2,
        "Consumables anomalies": 5,
        "Clinical Document Mismatch": -8,
        "Patient Age Group Risk": 4,
        "Patient Historical Risk": -10,
        "Other factors": 41
      },
      billingLines: [
        { item: "Room Rent (Semi-Private - 5 Days)", claimed: 35000, standard: 35000, variance: 0 },
        { item: "Knee Implant Package", claimed: 150000, standard: 150000, variance: 0 },
        { item: "Surgeon & OT Charges", claimed: 65000, standard: 65000, variance: 0 },
        { item: "Physiotherapy & Consumables", claimed: 20000, standard: 20000, variance: 0 },
        { item: "Pharmacy", claimed: 10000, standard: 10000, variance: 0 }
      ]
    },
    {
      id: "CS-2026-0845",
      date: "2026-07-02",
      patient: "Ananya Deshmukh",
      age: 29,
      gender: "Female",
      hospital: "Max Super Speciality Hospital",
      city: "New Delhi",
      procedure: "Maternity - Cesarean Section",
      amount: 220000,
      riskScore: 82,
      status: "Flagged",
      leakageType: "Unbundled Services",
      explanation: "Separate billing of OT gown, suture kit, and basic surgical gloves detected. These items are strictly unbundled and should be included in the base C-section surgical package.",
      shapValues: {
        "Unbundled Service Charges": 42,
        "Tariff Package Abuse": 18,
        "Provider Claim Density": 10,
        "Patient Age Factor": -3,
        "Prior Claim History": -2,
        "Other factors": 17
      },
      billingLines: [
        { item: "C-Section Package", claimed: 140000, standard: 140000, variance: 0 },
        { item: "Room Rent (Deluxe - 3 Days)", claimed: 45000, standard: 45000, variance: 0 },
        { item: "OT Disposables & Gown (Unbundled)", claimed: 12000, standard: 0, variance: 12000 },
        { item: "Surgical Sutures & Drapes (Unbundled)", claimed: 15000, standard: 0, variance: 15000 },
        { item: "Neonatal Care Consumables", claimed: 8000, standard: 5000, variance: 3000 }
      ]
    },
    {
      id: "CS-2026-0731",
      date: "2026-06-30",
      patient: "Vikram Malhotra",
      age: 55,
      gender: "Male",
      hospital: "Kokilaben Dhirubhai Ambani Hospital",
      city: "Mumbai",
      procedure: "Double Stent Angioplasty",
      amount: 540000,
      riskScore: 92,
      status: "Flagged",
      leakageType: "Duplicate Claim",
      explanation: "Exact matching claim submitted for stent serial numbers and OT timings. A claim for this procedure was already paid to the same provider on 2026-06-15.",
      shapValues: {
        "Duplicate Serial Number Match": 55,
        "Time Interval Frequency": 20,
        "Provider Flagged History": 12,
        "Claim Amount Magnitude": 8,
        "Patient Profile Congruence": -5,
        "Other factors": 2
      },
      billingLines: [
        { item: "Double Stent Implant Package", claimed: 340000, standard: 340000, variance: 0 },
        { item: "ICU & Room Rent (4 Days)", claimed: 80000, standard: 80000, variance: 0 },
        { item: "OT & Surgeon Charges", claimed: 90000, standard: 90000, variance: 0 },
        { item: "Pharmacy & Materials", claimed: 30000, standard: 30000, variance: 0 }
      ]
    },
    {
      id: "CS-2026-0810",
      date: "2026-07-02",
      patient: "Amit Verma",
      age: 41,
      gender: "Male",
      hospital: "Apollo Specialty Hospitals",
      city: "Chennai",
      procedure: "Dengue Fever Inpatient Care",
      amount: 85000,
      riskScore: 68,
      status: "Pending",
      leakageType: "Unjustified Stay",
      explanation: "Patient admitted for 5 days with mild dengue. Lab records show platelet count remained stable above 1,30,000/µL throughout. Clinical guidelines suggest outpatient care or maximum 2-day monitoring.",
      shapValues: {
        "Length of Stay (LOS) Excess": 28,
        "Lab Test Congruence": 22,
        "Provider Cost Index": 8,
        "Patient Age Group Risk": -4,
        "First-time Admission": -2,
        "Other factors": 16
      },
      billingLines: [
        { item: "Room Rent (Semi-Private - 5 Days)", claimed: 40000, standard: 16000, variance: 24000 },
        { item: "IV Fluids & Injectables", claimed: 15000, standard: 8000, variance: 7000 },
        { item: "Diagnostics & Daily CBC Labs", claimed: 18000, standard: 10000, variance: 8000 },
        { item: "Doctor Consultation Fees", claimed: 12000, standard: 6000, variance: 6000 }
      ]
    },
    {
      id: "CS-2026-0912",
      date: "2026-07-03",
      patient: "Sunita Kulkarni",
      age: 59,
      gender: "Female",
      hospital: "Ruby Hall Clinic",
      city: "Pune",
      procedure: "Cataract Surgery with Foldable IOL",
      amount: 65000,
      riskScore: 21,
      status: "Approved",
      leakageType: "None",
      explanation: "Claim features match typical profiles for standard cataract operations. Package rate is within pre-negotiated limits for this provider.",
      shapValues: {
        "Provider Tariff Deviation": -5,
        "Consumables anomalies": 1,
        "Length of Stay (LOS) Excess": -10,
        "Patient Profile Congruence": -12,
        "Other factors": 47
      },
      billingLines: [
        { item: "Cataract Package (Foldable IOL)", claimed: 55000, standard: 55000, variance: 0 },
        { item: "Diagnostics & Scans", claimed: 6000, standard: 6000, variance: 0 },
        { item: "Post-op Meds & Eye Drops", claimed: 4000, standard: 4000, variance: 0 }
      ]
    },
    {
      id: "CS-2026-0750",
      date: "2026-07-01",
      patient: "Deepak Gupta",
      age: 45,
      gender: "Male",
      hospital: "Medanta - The Medicity",
      city: "Gurugram",
      procedure: "Inguinal Hernia Repair (Open)",
      amount: 145000,
      riskScore: 71,
      status: "Pending",
      leakageType: "Upcoding",
      explanation: "Billed under complex bilateral mesh hernia repair package, but surgical notes and imaging reveal a simple, routine unilateral inguinal hernia repair.",
      shapValues: {
        "Clinical Document Mismatch": 33,
        "Package Tariff Deviation": 21,
        "Provider Historical Claim Vol": 10,
        "Patient Age Factor": -2,
        "Other factors": 9
      },
      billingLines: [
        { item: "Bilateral Hernia Package Rate", claimed: 110000, standard: 80000, variance: 30000 },
        { item: "Room Rent (3 Days)", claimed: 21000, standard: 21000, variance: 0 },
        { item: "Mesh Implant Premium Upgrade", claimed: 14000, standard: 5000, variance: 9000 }
      ]
    },
    {
      id: "CS-2026-0689",
      date: "2026-06-29",
      patient: "Meera Nair",
      age: 72,
      gender: "Female",
      hospital: "Amrita Hospital",
      city: "Kochi",
      procedure: "Chemotherapy Session (Single)",
      amount: 125000,
      riskScore: 18,
      status: "Approved",
      leakageType: "None",
      explanation: "Chemotherapy claim matches oncology protocol, dosage levels, and drugs approved during pre-auth. Perfect mapping with provider standards.",
      shapValues: {
        "Drug Dosage Deviation": -6,
        "Oncology Protocol Check": -15,
        "Length of Stay (LOS) Excess": -5,
        "Patient Age Group Risk": 5,
        "Other factors": 39
      },
      billingLines: [
        { item: "Chemotherapy Drug (Trastuzumab)", claimed: 95000, standard: 95000, variance: 0 },
        { item: "Day Care Bed Charges (1 Day)", claimed: 5000, standard: 5000, variance: 0 },
        { item: "Infusion & Nursing Charges", claimed: 15000, standard: 15000, variance: 0 },
        { item: "Consumables & Lab Tests", claimed: 10000, standard: 10000, variance: 0 }
      ]
    },
    {
      id: "CS-2026-0888",
      date: "2026-07-02",
      patient: "Rahul Verma",
      age: 36,
      gender: "Male",
      hospital: "Fortis Hospital",
      city: "Bengaluru",
      procedure: "Acute Appendectomy (Laparoscopic)",
      amount: 175000,
      riskScore: 76,
      status: "Flagged",
      leakageType: "Inflated Billing",
      explanation: "Billed 6 hours of Operating Theater (OT) usage and 4 separate recovery room charges for a routine appendectomy which typically averages 1.5 hours of OT time.",
      shapValues: {
        "OT Hours Discrepancy": 38,
        "Recovery Room Double Billing": 24,
        "Provider Tariff Deviation": 8,
        "Patient Profile Congruence": -4,
        "Other factors": 10
      },
      billingLines: [
        { item: "Laparoscopic Appendectomy Package", claimed: 90000, standard: 90000, variance: 0 },
        { item: "Operating Theater Fee (6 Hours)", claimed: 45000, standard: 15000, variance: 30000 },
        { item: "Recovery Room Rent (4 Units)", claimed: 24000, standard: 6000, variance: 18000 },
        { item: "Consumables & Drugs", claimed: 16000, standard: 10000, variance: 6000 }
      ]
    },
    {
      id: "CS-2026-0701",
      date: "2026-06-30",
      patient: "Geeta Sen",
      age: 50,
      gender: "Female",
      hospital: "Peerless Hospital",
      city: "Kolkata",
      procedure: "Hysterectomy (Abdominal)",
      amount: 140000,
      riskScore: 45,
      status: "Pending",
      leakageType: "Unbundled Services",
      explanation: "Surgical suture kits and abdominal drapes billed separately from the primary package. Minor unbundling detected, requiring TPA adjustment.",
      shapValues: {
        "Unbundled Service Charges": 22,
        "Provider Claim Density": 8,
        "Length of Stay (LOS) Excess": 2,
        "Clinical Document Mismatch": -5,
        "Other factors": 18
      },
      billingLines: [
        { item: "Hysterectomy Package", claimed: 110000, standard: 110000, variance: 0 },
        { item: "Room Rent (3 Days)", claimed: 18000, standard: 18000, variance: 0 },
        { item: "Surgical Sutures & Disposables", claimed: 8000, standard: 0, variance: 8000 },
        { item: "Drapes & Sterile Packs", claimed: 4000, standard: 0, variance: 4000 }
      ]
    },
    {
      id: "CS-2026-0925",
      date: "2026-07-03",
      patient: "Harish Rao",
      age: 62,
      gender: "Male",
      hospital: "Narayana Health City",
      city: "Bengaluru",
      procedure: "Coronary Artery Bypass Graft (CABG)",
      amount: 480000,
      riskScore: 29,
      status: "Approved",
      leakageType: "None",
      explanation: "CABG pricing and ICU stay length conform perfectly to high-risk cardiac package standards. Pre-auth authorization matched without discrepancies.",
      shapValues: {
        "Provider Tariff Deviation": -8,
        "ICU Stay Length Justified": -12,
        "Consumables anomalies": 4,
        "Patient Profile Congruence": -6,
        "Other factors": 51
      },
      billingLines: [
        { item: "CABG Surgery Package", claimed: 320000, standard: 320000, variance: 0 },
        { item: "ICU Charges (5 Days)", claimed: 100000, standard: 100000, variance: 0 },
        { item: "OT & Consumables Fee", claimed: 45000, standard: 45000, variance: 0 },
        { item: "Pharmacy & Dischargemed", claimed: 15000, standard: 15000, variance: 0 }
      ]
    }
  ],
  
  // Available values to generate new simulated claims in real-time
  simOptions: {
    firstNames: ["Karan", "Nisha", "Aditya", "Rohan", "Pooja", "Sanjay", "Neha", "Divya", "Vijay", "Jyoti"],
    lastNames: ["Gupta", "Rao", "Joshi", "Menon", "Reddy", "Choudhury", "Bose", "Saxena", "Kapoor", "Nair"],
    hospitals: [
      { name: "Apollo Specialty Hospitals", city: "Chennai" },
      { name: "Fortis Memorial Research Institute", city: "Gurugram" },
      { name: "Manipal Hospital", city: "Bengaluru" },
      { name: "Max Super Speciality Hospital", city: "New Delhi" },
      { name: "Kokilaben Dhirubhai Ambani Hospital", city: "Mumbai" },
      { name: "Ruby Hall Clinic", city: "Pune" },
      { name: "Medanta - The Medicity", city: "Gurugram" },
      { name: "Narayana Health City", city: "Bengaluru" }
    ],
    procedures: [
      { name: "Dengue Fever Inpatient Care", minAmt: 50000, maxAmt: 120000, riskChance: 0.4 },
      { name: "Cataract Surgery with Foldable IOL", minAmt: 45000, maxAmt: 80000, riskChance: 0.15 },
      { name: "Laparoscopic Appendectomy", minAmt: 120000, maxAmt: 220000, riskChance: 0.5 },
      { name: "Coronary Angioplasty (PTCA)", minAmt: 250000, maxAmt: 450000, riskChance: 0.7 },
      { name: "Maternity - Cesarean Section", minAmt: 100000, maxAmt: 250000, riskChance: 0.45 },
      { name: "Inguinal Hernia Repair (Open)", minAmt: 80000, maxAmt: 160000, riskChance: 0.3 }
    ],
    leakageTypes: ["Inflated Billing", "Upcoding", "Unbundled Services", "Unjustified Stay", "Duplicate Claim"]
  }
};
