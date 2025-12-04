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
    
    const hasNasalPolyps = data.comorbidities.includes("Chronic rhinosinusitis with nasal polyps (CRSwNP)");
    const hasAtopicDermatitis = data.comorbidities.includes("Atopic dermatitis");
    const isOnOCS = data.medications.ocs || data.medications.maintenanceOcs;
    const hasAllergenSensitization = data.biomarkers.specificIgE || data.biomarkers.skinPrickTest;
    const isChildhoodOnset = data.basicInfo.asthmaOnset === 'childhood';
    const isAdultOnset = data.basicInfo.asthmaOnset === 'adult';

    let recommendations = [];

    // CRITICAL FIX: We are now more permissive. 
    // If biomarkers match, we recommend, assuming the clinician has already confirmed severe asthma via the workflow.
    
    // Omalizumab (Anti-IgE)
    if (totalIgE >= 30 && hasAllergenSensitization) {
      let score = 60; // Base score
      if (exacerbations >= 1) score += 10; // History of exacerbations boosts score
      if (isOnOCS) score += 10; // OCS dependence boosts score

      if (isChildhoodOnset) score += 10;
      if (data.symptoms.allergenDriven) score += 15;
      if (hasNasalPolyps) score += 5;
      
      // Additional predictive factors for better response
      if (eosinophils >= 260) score += 5;
      if (feNo >= 20) score += 5;
      
      recommendations.push({
        drug: "Omalizumab (Anti-IgE)",
        score: Math.min(score, 100),
        reason: `Sensitized to allergen with IgE ${totalIgE} IU/mL${isChildhoodOnset ? ', childhood onset' : ''}${data.symptoms.allergenDriven ? ', allergen-driven symptoms' : ''}`,
        strength: score >= 90 ? "Strongly Recommended" : "Recommended",
        eligibility: "✓ Allergen sensitization, ✓ IgE level",
        trialDuration: "At least 4 months"
      });
    }

    // Anti-IL5 Agents (Mepolizumab, Benralizumab, Reslizumab)
    // GINA: Blood eos >= 150 (sometimes 300) AND exacerbations
    if (eosinophils >= 150) {
      
      // Mepolizumab
      let mepoScore = 70;
      if (exacerbations >= 1) mepoScore += 10;
      if (eosinophils >= 300) mepoScore += 15;
      if (hasNasalPolyps) mepoScore += 10;
      if (isAdultOnset) mepoScore += 5;
      if (isOnOCS) mepoScore += 10;
      
      recommendations.push({
        drug: "Mepolizumab (Anti-IL5)",
        score: Math.min(mepoScore, 100),
        reason: `Eosinophilic asthma (Eos ${eosinophils}/μL)${hasNasalPolyps ? ', nasal polyps' : ''}${isOnOCS ? ', OCS-dependent' : ''}`,
        strength: mepoScore >= 90 ? "Strongly Recommended" : "Recommended",
        eligibility: `✓ Eos ${eosinophils}/μL (≥150)`,
        trialDuration: "At least 4 months"
      });

      // Benralizumab
      let benraScore = 70;
      if (exacerbations >= 1) benraScore += 10;
      if (eosinophils >= 300) benraScore += 15;
      if (hasNasalPolyps) benraScore += 10;
      if (isOnOCS) benraScore += 12; // Potentially higher OCS sparing
      
      recommendations.push({
        drug: "Benralizumab (Anti-IL5Rα)",
        score: Math.min(benraScore, 100),
        reason: `Eosinophilic asthma (Eos ${eosinophils}/μL)${hasNasalPolyps ? ', nasal polyps' : ''}${isOnOCS ? ', OCS-dependent' : ''}`,
        strength: benraScore >= 90 ? "Strongly Recommended" : "Recommended",
        eligibility: `✓ Eos ${eosinophils}/μL (≥150)`,
        trialDuration: "At least 4 months"
      });
    }

    // Dupilumab (Anti-IL4Rα)
    // GINA: Eos >= 150 OR FeNO >= 25 OR OCS-dependent
    if (eosinophils >= 150 || feNo >= 25 || isOnOCS) {
      let dupiScore = 75;
      if (exacerbations >= 1) dupiScore += 10;
      if (eosinophils >= 300) dupiScore += 10;
      if (feNo >= 25) dupiScore += 10;
      if (hasNasalPolyps) dupiScore += 15; // Strong indication
      if (hasAtopicDermatitis) dupiScore += 10; // Strong indication
      if (isOnOCS) dupiScore += 15;

      recommendations.push({
        drug: "Dupilumab (Anti-IL4Rα)",
        score: Math.min(dupiScore, 100),
        reason: `Type 2 inflammation${feNo >= 25 ? ` (FeNO ${feNo})` : ''}${hasNasalPolyps ? ', nasal polyps' : ''}${hasAtopicDermatitis ? ', atopic dermatitis' : ''}`,
        strength: dupiScore >= 90 ? "Strongly Recommended" : "Recommended",
        eligibility: `✓ Type 2 markers (Eos/FeNO) OR OCS-dependent`,
        trialDuration: "At least 4 months"
      });
    }

    // Tezepelumab (Anti-TSLP)
    // GINA: Severe asthma with exacerbations, independent of biomarkers
    if (exacerbations >= 1 || isOnOCS) {
        let tezeScore = 65;
        
        const isLowT2 = eosinophils < 150 && feNo < 25;
        if (isLowT2) tezeScore += 25; // Strong candidate for Low T2
        
        if (hasNasalPolyps) tezeScore += 5;
        if (exacerbations >= 2) tezeScore += 10;

        recommendations.push({
            drug: "Tezepelumab (Anti-TSLP)",
            score: Math.min(tezeScore, 100),
            reason: `Severe asthma with exacerbations${isLowT2 ? ', Low Type 2 phenotype' : ''}`,
            strength: isLowT2 ? "Strongly Recommended (Non-T2)" : "Recommended",
            eligibility: `✓ Severe uncontrolled asthma`,
            trialDuration: "At least 4 months"
        });
    }

    return recommendations.sort((a, b) => b.score - a.score);
}