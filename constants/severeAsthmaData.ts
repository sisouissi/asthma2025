import { PatientData } from "../types";

export const comorbidityOptions = [
  "Chronic rhinosinusitis with nasal polyps (CRSwNP)",
  "Chronic rhinosinusitis without nasal polyps (CRSsNP)",
  "Allergic rhinitis",
  "GERD (Gastroesophageal reflux disease)",
  "Obstructive sleep apnea (OSA)",
  "Obesity",
  "Anxiety/Depression",
  "COPD",
  "Bronchiectasis",
  "Vocal cord dysfunction (VCD)",
  "Inducible laryngeal obstruction (ILO)",
  "Atopic dermatitis",
  "ABPA (Allergic bronchopulmonary aspergillosis)",
  "AERD (Aspirin-exacerbated respiratory disease)",
  "Cardiac disease",
  "Osteoporosis/Kyphosis",
  "Food allergies/Anaphylaxis history"
];

export const riskFactorOptions = [
  "Smoking/Vaping",
  "Environmental tobacco exposure",
  "Occupational allergen exposure",
  "Indoor air pollution",
  "Outdoor air pollution",
  "Beta-blockers (including eye drops)",
  "NSAIDs",
  "Incorrect inhaler technique (up to 80% of patients)",
  "Poor adherence (up to 75% of patients)",
  "SABA overuse (3 or more canisters/year increases risk, 12 or more/year increases mortality risk)",
  "Environmental allergen exposure",
  "Molds and noxious chemicals",
  "Respiratory virus exposure",
  "P450 inhibitors (e.g., itraconazole)"
];

export const biologicOptions = [
  {
    name: "Omalizumab (Anti-IgE)",
    indication: "Severe allergic asthma",
    criteria: "Sensitization to inhaled allergens, Total IgE in dosing range, Exacerbations in last year",
    predictors: "Childhood-onset asthma, Allergen-driven symptoms, High FeNO",
    mechanism: "Binds free IgE, prevents FcεR1 binding",
    administration: "SC every 2-4 weeks, weight/IgE-based dosing",
    efficacy: "44% ↓ severe exacerbations, ↑ QoL",
    benefits: "Nasal polyps, chronic urticaria",
    safety: "Injection site reactions, anaphylaxis 0.2%"
  },
  {
    name: "Mepolizumab (Anti-IL5)",
    indication: "Severe eosinophilic asthma",
    criteria: "Blood eosinophils 150-300/μL or more, Exacerbations in last year",
    predictors: "Higher blood eosinophils, Adult-onset asthma, Nasal polyps",
    mechanism: "Binds circulating IL-5",
    administration: "100mg SC every 4 weeks (>=12y), 40mg (6-11y)",
    efficacy: "47-54% ↓ severe exacerbations, 50% ↓ OCS",
    benefits: "Nasal polyps, EGPA, hypereosinophilia",
    safety: "Generally well tolerated, rare anaphylaxis"
  },
  {
    name: "Reslizumab (Anti-IL5)",
    indication: "Severe eosinophilic asthma (IV only)",
    criteria: "Blood eosinophils >= 400/μL, Exacerbations in last year",
    predictors: "Higher blood eosinophils, Adult-onset asthma",
    mechanism: "Binds circulating IL-5",
    administration: "3mg/kg IV every 4 weeks",
    efficacy: "50-59% ↓ severe exacerbations, 75% ↓ OCS",
    benefits: "None",
    safety: "Myalgia, increased creatinine phosphokinase, rare anaphylaxis"
  },
  {
    name: "Benralizumab (Anti-IL5Rα)",
    indication: "Severe eosinophilic asthma",
    criteria: "Blood eosinophils 150-300/μL or more, Exacerbations in last year",
    predictors: "Higher blood eosinophils, Adult-onset asthma, Nasal polyps",
    mechanism: "Binds IL-5Rα, causes eosinophil apoptosis",
    administration: "30mg SC every 4w x3, then every 8w",
    efficacy: "47-54% ↓ severe exacerbations, 50% ↓ OCS",
    benefits: "Nasal polyps, EGPA, hypereosinophilia",
    safety: "Generally well tolerated, rare anaphylaxis"
  },
  {
    name: "Dupilumab (Anti-IL4Rα)",
    indication: "Severe eosinophilic/Type 2 asthma or OCS-dependent",
    criteria: "Blood eosinophils 150/μL or more OR FeNO 25 ppb or more OR maintenance OCS",
    predictors: "Higher blood eosinophils, Higher FeNO",
    mechanism: "Blocks IL-4 and IL-13 signaling",
    administration: "200-300mg SC every 2 weeks",
    efficacy: "56% ↓ severe exacerbations, 50% ↓ OCS",
    benefits: "Atopic dermatitis, nasal polyps, COPD",
    safety: "Injection site reactions, transient eosinophilia 4-13%"
  },
  {
    name: "Tezepelumab (Anti-TSLP)",
    indication: "Severe asthma (all phenotypes)",
    criteria: "Severe exacerbations in last year",
    predictors: "Higher blood eosinophils, Higher FeNO",
    mechanism: "Binds circulating TSLP alarmin",
    administration: "210mg SC every 4 weeks",
    efficacy: "30-70% ↓ severe exacerbations",
    benefits: "Effective regardless of allergic status or biomarker levels",
    safety: "Generally well tolerated, similar to placebo"
  }
];

export function getBiologicRecommendation(patientData: PatientData) {
  const { severeAsthma: data } = patientData;

  // Ensure we have valid numbers for comparison
  const eosinophils = parseInt(data.biomarkers.bloodEosinophils) || 0;
  const feNo = parseInt(data.biomarkers.feNo) || 0;
  const totalIgE = parseInt(data.biomarkers.totalIgE) || 0;
  const exacerbations = parseInt(data.basicInfo.exacerbationsLastYear) || 0;

  // Derived Flags
  const hasNasalPolyps = data.comorbidities.includes("Chronic rhinosinusitis with nasal polyps (CRSwNP)");
  const hasAtopicDermatitis = data.comorbidities.includes("Atopic dermatitis");
  const isOnOCS = data.medications.ocs || data.medications.maintenanceOcs;
  const hasAllergenSensitization = data.biomarkers.specificIgE || data.biomarkers.skinPrickTest;

  // Onset
  const isChildhoodOnset = data.basicInfo.asthmaOnset === 'childhood';
  const isAdultOnset = data.basicInfo.asthmaOnset === 'adult';

  let recommendations = [];

  // --- GINA 2025 PRIORITIZATION LOGIC ---
  // Primary Eligibility: Eosinophils >= 300 OR FeNO >= 50 (Strong T2 signal)
  // Secondary Eligibility: Eosinophils >= 150 OR FeNO >= 25 OR OCS-dependent (Possible T2)

  const isStrongT2 = eosinophils >= 300 || feNo >= 50;
  const isModerateT2 = eosinophils >= 150 || feNo >= 25 || isOnOCS;

  // 1. Anti-IgE (Omalizumab)
  // Indication: Severe Allergic Asthma
  if (totalIgE >= 30 && hasAllergenSensitization) {
    let score = 50;

    // Boosters
    if (exacerbations >= 1) score += 15;
    if (isChildhoodOnset) score += 15;
    if (data.symptoms.allergenDriven) score += 20;

    // If Eos/FeNO are very high, Anti-IL5/4 may be superior, but Omalizumab is still valid
    if (isStrongT2) score -= 5;

    recommendations.push({
      drug: "Omalizumab (Anti-IgE)",
      score: Math.min(score, 100),
      reason: `Sensitized with IgE ${totalIgE} IU/mL. ${isChildhoodOnset ? 'Childhood onset.' : ''}`,
      strength: score >= 80 ? "Strongly Recommended" : "Recommended",
      eligibility: "✓ Sensitization + IgE Range",
      trialDuration: "4 months"
    });
  }

  // 2. Anti-IL5 (Mepolizumab, Benralizumab, Reslizumab)
  // Indication: Severe Eosinophilic Asthma
  // Criteria: Eos >= 300 (Strong) OR Eos >= 150 (Moderate)
  if (eosinophils >= 150) {
    let il5Score = 60;

    if (eosinophils >= 300) il5Score += 25; // Primary Criterion!
    if (exacerbations >= 2) il5Score += 10;
    if (hasNasalPolyps) il5Score += 15; // Strong predictor
    if (isOnOCS) il5Score += 10; // OCS sparing effect

    if (isAdultOnset) il5Score += 5;

    const strength = eosinophils >= 300 ? "Strongly Recommended (Prioritized)" : "Recommended";

    recommendations.push({
      drug: "Mepolizumab (Anti-IL5)",
      score: Math.min(il5Score, 100),
      reason: `Eosinophils ${eosinophils}/μL${hasNasalPolyps ? ' + Polyps' : ''}.`,
      strength: strength,
      eligibility: `✓ Eos ≥ 150 (Current: ${eosinophils})`,
      trialDuration: "4 months"
    });

    recommendations.push({
      drug: "Benralizumab (Anti-IL5Rα)",
      score: Math.min(il5Score, 100),
      reason: `Eosinophils ${eosinophils}/μL${hasNasalPolyps ? ' + Polyps' : ''}.`,
      strength: strength,
      eligibility: `✓ Eos ≥ 150 (Current: ${eosinophils})`,
      trialDuration: "4 months"
    });
  }

  // 3. Anti-IL4Rα (Dupilumab)
  // Indication: Severe Eosinophilic/Type 2 Asthma
  // Criteria: Eos >= 150 OR FeNO >= 25 OR OCS-dependent
  if (eosinophils >= 150 || feNo >= 25 || isOnOCS) {
    let dupiScore = 60;

    if (eosinophils >= 150 && eosinophils < 1500) dupiScore += 10; // Valid range (avoid >1500 for exclusion risk, though rare)
    if (feNo >= 25) dupiScore += 10;
    if (feNo >= 50) dupiScore += 15; // Strong T2 signal

    if (hasAtopicDermatitis) dupiScore += 20; // Specific indication
    if (hasNasalPolyps) dupiScore += 20; // Specific indication
    if (isOnOCS) dupiScore += 15; // Strong OCS sparing

    const strength = (feNo >= 50 || eosinophils >= 300 || isOnOCS) ? "Strongly Recommended (Prioritized)" : "Recommended";

    recommendations.push({
      drug: "Dupilumab (Anti-IL4Rα)",
      score: Math.min(dupiScore, 100),
      reason: `Type 2 markers${feNo >= 25 ? ` (FeNO ${feNo})` : ''}${hasAtopicDermatitis ? ', Dermatitis' : ''}${hasNasalPolyps ? ', Polyps' : ''}`,
      strength: strength,
      eligibility: "✓ Eos ≥150 or FeNO ≥25 or OCS",
      trialDuration: "4 months"
    });
  }

  // 4. Anti-TSLP (Tezepelumab)
  // Indication: Severe Asthma (Broad)
  if (exacerbations >= 1 || isOnOCS) {
    let tezeScore = 55;

    // Higher score if biomarkers are low (Non-T2 niche)
    if (eosinophils < 150 && feNo < 25) {
      tezeScore += 30; // Strongest candidate for Non-T2
    } else {
      // Also effective in T2, but others might be specific
      if (exacerbations >= 2) tezeScore += 10;
      if (feNo >= 25) tezeScore += 5;
    }

    recommendations.push({
      drug: "Tezepelumab (Anti-TSLP)",
      score: Math.min(tezeScore, 100),
      reason: `Exacerbation prevention (Broad efficacy).`,
      strength: (eosinophils < 150 && feNo < 25) ? "Strongly Recommended (Non-T2)" : "Recommended",
      eligibility: "✓ Severe Asthma (Exacerbations)",
      trialDuration: "4 months"
    });
  }

  return recommendations.sort((a, b) => b.score - a.score);
}