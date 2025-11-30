
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
    const { severeAsthma: data, severeAsthmaAssessment: assessmentResults } = patientData;
    
    if (!assessmentResults.eligibleForBiologics) {
      return null;
    }

    const eosinophils = parseInt(data.biomarkers.bloodEosinophils) || 0;
    const feNo = parseInt(data.biomarkers.feNo) || 0;
    const totalIgE = parseInt(data.biomarkers.totalIgE) || 0;
    const fev1 = parseInt(data.biomarkers.fev1Predicted) || 100;
    const exacerbations = parseInt(data.basicInfo.exacerbationsLastYear) || 0;
    const hasNasalPolyps = data.comorbidities.includes("Chronic rhinosinusitis with nasal polyps (CRSwNP)");
    const hasAtopicDermatitis = data.comorbidities.includes("Atopic dermatitis");
    const hasAERD = data.comorbidities.includes("AERD (Aspirin-exacerbated respiratory disease)");
    const isOnOCS = data.medications.ocs || data.medications.maintenanceOcs;
    const hasAllergenSensitization = data.biomarkers.specificIgE || data.biomarkers.skinPrickTest;
    const isChildhoodOnset = data.basicInfo.asthmaOnset === 'childhood';
    const isAdultOnset = data.basicInfo.asthmaOnset === 'adult';

    let recommendations = [];

    // Omalizumab (Anti-IgE) - Severe Allergic Phenotype
    if (totalIgE >= 30 && totalIgE <= 1500 && hasAllergenSensitization && exacerbations >= 1) {
      let score = 80;
      if (isChildhoodOnset) score += 10;
      if (data.symptoms.allergenDriven) score += 10;
      if (hasNasalPolyps) score += 5;
      if (eosinophils >= 260) score += 5;
      if (feNo >= 19.5) score += 5;
      
      recommendations.push({
        drug: "Omalizumab (Anti-IgE)",
        score: Math.min(score, 100),
        reason: `Severe allergic asthma with IgE ${totalIgE} IU/mL (range 30-1500)${isChildhoodOnset ? ', childhood onset' : ''}${data.symptoms.allergenDriven ? ', allergen-driven symptoms' : ''}`,
        strength: score >= 90 ? "Strongly Recommended" : "Recommended",
        eligibility: "✓ Allergen sensitization, ✓ IgE in dosing range, ✓ Recent exacerbations",
        trialDuration: "At least 4 months",
        monitoring: "Monitor for hypersensitivity reactions (0.2% anaphylaxis)"
      });
    }

    // Mepolizumab (Anti-IL5) - Eosinophilic Phenotype
    if (eosinophils >= 150 && exacerbations >= 1) {
      let score = 75;
      if (eosinophils >= 300) score += 15; // Strongly predictive
      if (hasNasalPolyps) score += 10;
      if (isAdultOnset) score += 8;
      if (isOnOCS) score += 10;
      if (exacerbations >= 3) score += 8; // Strongly predictive
      if (fev1 < 65) score += 5;
      
      recommendations.push({
        drug: "Mepolizumab (Anti-IL5)",
        score: Math.min(score, 100),
        reason: `Eosinophilic asthma with ${eosinophils}/μL eosinophils${hasNasalPolyps ? ', nasal polyps' : ''}${isAdultOnset ? ', adult onset' : ''}${isOnOCS ? ', OCS-dependent' : ''}`,
        strength: score >= 90 ? "Strongly Recommended" : "Recommended",
        eligibility: `✓ Eos ${eosinophils}/μL (150/μL or more), ✓ 1+ exacerbation/year`,
        trialDuration: "At least 4 months",
        monitoring: "OCS reduction of ~50% if applicable, monitor lung function"
      });
    }

    // Benralizumab (Anti-IL5Rα) - Eosinophilic Phenotype (complete depletion)
    if (eosinophils >= 150 && exacerbations >= 1) {
      let score = 78; // Slightly higher than mepolizumab for complete depletion
      if (eosinophils >= 300) score += 15;
      if (hasNasalPolyps) score += 10;
      if (isAdultOnset) score += 8;
      if (isOnOCS) score += 10;
      if (exacerbations >= 3) score += 8;
      if (fev1 < 65) score += 5;
      
      recommendations.push({
        drug: "Benralizumab (Anti-IL5Rα)",
        score: Math.min(score, 100),
        reason: `Eosinophilic asthma with ${eosinophils}/μL, provides complete eosinophil depletion${hasNasalPolyps ? ', nasal polyps' : ''}`,
        strength: score >= 90 ? "Strongly Recommended" : "Recommended",
        eligibility: `✓ Eos ${eosinophils}/μL (150/μL or more), ✓ 1+ exacerbation/year`,
        trialDuration: "At least 4 months",
        monitoring: "Near-complete eosinophil depletion, OCS reduction of ~50%"
      });
    }

    // Dupilumab (Anti-IL4Rα) - Type 2 or OCS-dependent
    if ((eosinophils >= 150 && eosinophils <= 1500) || feNo >= 25 || isOnOCS) {
      let score = 82;
      if (eosinophils >= 300) score += 12; // Strongly predictive
      if (feNo >= 50) score += 12; // Strongly predictive
      if (hasNasalPolyps) score += 15; // Excellent for polyps
      if (hasAtopicDermatitis) score += 10;
      if (isOnOCS) score += 20; // Excellent OCS-sparing effect
      if (hasAERD) score += 8;
      
      recommendations.push({
        drug: "Dupilumab (Anti-IL4Rα)",
        score: Math.min(score, 100),
        reason: `Type 2 inflammation${isOnOCS ? ', OCS-dependent' : ''}${hasNasalPolyps ? ', nasal polyps' : ''}${hasAtopicDermatitis ? ', atopic dermatitis' : ''}`,
        strength: (isOnOCS || hasNasalPolyps || hasAtopicDermatitis) ? "Strongly Recommended" : "Recommended",
        eligibility: `✓ Eos 150/μL or more OR FeNO 25 ppb or more OR OCS-dependent`,
        trialDuration: "At least 4 months",
        monitoring: "OCS reduction of 50%, monitor for transient eosinophilia (4-13%)"
      });
    }

    // Tezepelumab (Anti-TSLP) - All severe asthma phenotypes
    if (assessmentResults.severeAsthma && exacerbations >= 1) {
      let score = 70;
      if (eosinophils >= 300) score += 12; // Strongly predictive
      if (feNo >= 50) score += 12; // Strongly predictive
      if (eosinophils < 150 && feNo < 25) score += 25; // Excellent for Non-Type 2 phenotype
      if (exacerbations >= 3) score += 8;
      
      recommendations.push({
        drug: "Tezepelumab (Anti-TSLP)",
        score: Math.min(score, 100),
        reason: `Severe asthma${(eosinophils < 150 && feNo < 25) ? ', Non-Type 2 phenotype' : ', all phenotypes'}, ${exacerbations} exacerbations/year`,
        strength: (eosinophils < 150 && feNo < 25) ? "Strongly Recommended (Non-Type 2)" : "Recommended",
        eligibility: `✓ Severe asthma, ✓ 1 or more exacerbations/year`,
        trialDuration: "At least 4 months",
        monitoring: "Effective regardless of allergic status, monitor for infections"
      });
    }

    return recommendations.sort((a, b) => b.score - a.score);
}
