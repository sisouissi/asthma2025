
import { AdultTreatmentOptions, ChildTreatmentOptions, YoungChildTreatmentOptions, TreatmentDetail } from '../types';

export const adultTreatments: AdultTreatmentOptions = {
  pathway1: { // Preferred: ICS-formoterol as reliever
    1: { 
      name: "As-needed low-dose ICS-formoterol (AIR therapy)",
      reliever: "Low dose ICS-formoterol (e.g., budesonide/formoterol 200/6 mcg) as needed for symptoms.",
      controller: "The reliever provides the anti-inflammatory treatment. No daily controller is prescribed.",
      keyPoints: ["This is Anti-Inflammatory Reliever (AIR) therapy.", "Significantly reduces the risk of severe exacerbations compared to SABA alone.", "A single inhaler simplifies treatment."],
      notes: ["Maximum recommended total daily dose is 12 inhalations (72 mcg of formoterol).", "Patient education on this new strategy is crucial."]
    },
    2: { 
      name: "As-needed low-dose ICS-formoterol (AIR therapy)",
      reliever: "Low dose ICS-formoterol as needed for symptoms.",
      controller: "The reliever provides the anti-inflammatory treatment. No daily controller is prescribed.",
      keyPoints: ["This strategy is for patients who would otherwise be on daily low-dose ICS.", "Still reduces exacerbation risk compared to SABA-based regimens."],
      notes: ["Maximum recommended total daily dose is 12 inhalations (72 mcg of formoterol)."]
    },
    3: { 
      name: "Low-dose ICS-formoterol MART",
      reliever: "Low dose ICS-formoterol as needed.",
      controller: "Low dose ICS-formoterol as Maintenance And Reliever Therapy (MART).",
      keyPoints: ["Uses a single inhaler for both daily maintenance (e.g., 1 puff BID) and symptom relief.", "Reduces severe exacerbations compared to fixed-dose ICS-LABA + SABA."],
      notes: ["Ensure patient understands MART is for both scheduled and as-needed use. Maximum 12 total inhalations/day."]
    },
    4: { 
      name: "Medium-dose ICS-formoterol MART",
      reliever: "Low dose ICS-formoterol as needed (as part of MART).",
      controller: "Medium dose ICS-formoterol as MART (e.g., 2 inhalations BID).",
      keyPoints: ["For patients uncontrolled on low-dose MART despite good adherence.", "Keeps the benefits of single inhaler MART regimen."],
      additional: ["Consider adding on LAMA (e.g., tiotropium) for further symptom control if needed before stepping up to Step 5."],
      referral: "Refer for specialist assessment to consider Step 5 options if control is not achieved."
    },
    5: { 
      name: "Step 5: Specialist Assessment and Add-on Treatments",
      reliever: "Low dose ICS-formoterol as needed (if MART is continued).",
      controller: "High dose ICS-formoterol MART, plus add-on therapies.",
      additional: [
        "Add LAMA (Long-Acting Muscarinic Antagonist).",
        "Targeted biologic therapies (anti-IgE, anti-IL5/5R, anti-IL4R, anti-TSLP) after phenotyping.",
        "Consider bronchial thermoplasty for selected patients.",
        "As a last resort, add low-dose oral corticosteroids (OCS), with strategies to minimize long-term risks."
      ],
      keyPoints: ["This step requires specialist assessment and management for phenotyping and biologic selection.", "Goal is to improve control and minimize OCS need."],
      referral: "Essential for in-depth assessment, phenotyping, and initiation of Step 5 treatments.",
    }
  },
  pathway2: { // Alternative: SABA reliever + other controller(s)
    1: { 
      name: "ICS taken whenever SABA is taken",
      reliever: "SABA as needed.",
      controller: "Take low dose ICS whenever SABA is taken.",
      keyPoints: ["For patients with infrequent symptoms (less than twice a month) AND no exacerbation risk factors.", "Reduces risk of severe exacerbations compared to SABA alone."],
      notes: ["Requires patient to carry and use two separate inhalers, or a combination product if available."]
    },
    2: { 
      name: "Daily low dose ICS + SABA as needed",
      reliever: "SABA as needed.",
      controller: "Daily low dose ICS maintenance.",
      additional: ["Daily LTRA is an alternative, but less effective than ICS for preventing exacerbations."],
      keyPoints: ["The cornerstone of maintenance therapy. Adherence is critical."],
    },
    3: { 
      name: "Daily low dose ICS-LABA + SABA as needed",
      reliever: "SABA as needed.",
      controller: "Daily low dose ICS-LABA combination inhaler.",
      additional: ["Alternatively, increase to medium dose ICS alone (less effective for many patients).", "Low dose ICS + LTRA is another less effective alternative."],
      keyPoints: ["Adding a LABA improves symptoms and lung function, and reduces exacerbations compared to increasing ICS dose alone for most patients."],
    },
    4: { 
      name: "Daily medium dose ICS-LABA + SABA as needed",
      reliever: "SABA as needed.",
      controller: "Daily medium dose ICS-LABA.",
      additional: ["Consider adding on LAMA (e.g., tiotropium in a separate inhaler or as part of a triple therapy inhaler)."],
      referral: "Refer for specialist assessment if control is not achieved or to consider Step 5 options."
    },
    5: { 
      name: "Specialist referral + High dose ICS-LABA +/- options",
      reliever: "SABA as needed.",
      controller: "High dose ICS-LABA.",
      additional: [
        "Add on LAMA.",
        "Add on targeted biologic therapies (anti-IgE, anti-IL5/5R, anti-IL4R, anti-TSLP) after phenotyping.",
        "Add on low-dose OCS as a last resort, managing side-effects."
      ],
      referral: "Essential for phenotypic assessment and initiation of advanced therapies."
    }
  }
};

export const childTreatments: ChildTreatmentOptions = { // For children 6-11 years
  track1: { // Track 1: MART with ICS-formoterol (Budesonide/Formoterol 100/6, 80/4.5 delivered dose)
    3: { 
      name: "Low dose ICS-formoterol MART",
      reliever: "Low dose ICS-formoterol (e.g., Bud/Form 100/6) 1 inhalation as needed.",
      controller: "Low dose ICS-formoterol maintenance (1 inhalation once or twice daily) plus as-needed (MART).",
      keyPoints: ["MART is a preferred option at Step 3.", "Simplifies treatment to a single inhaler."],
      notes: ["Maximum 8 total inhalations per day of Bud/Form 100/6 (GINA 2025, Box 4-8)."]
    },
    4: { 
      name: "Medium dose ICS-formoterol MART",
      reliever: "Low dose ICS-formoterol (e.g., Bud/Form 100/6) 1 inhalation as needed.",
      controller: "Increased maintenance dose: Bud/Form 100/6, 2 inhalations twice daily, plus as-needed (MART). This is a medium dose of ICS.",
      referral: "Referral for expert advice is an alternative to increasing the dose.",
      notes: ["Maximum 8 total inhalations per day. Specialist consultation is strongly advised."]
    }
  },
  track2: { // Track 2: SABA reliever + other controller
    1: { 
      name: "ICS taken whenever SABA is taken",
      reliever: "SABA as needed (pMDI + spacer).",
      controller: "Low dose ICS taken whenever SABA is used.",
      keyPoints: ["This is the preferred controller at Step 1.", "Reduces the risk of severe exacerbations compared to SABA alone."]
    },
    2: { 
      name: "Daily low dose ICS",
      reliever: "SABA as needed (pMDI + spacer).",
      controller: "Daily low dose ICS maintenance.",
      keyPoints: ["This is the preferred controller at Step 2."],
      additional: ["Daily LTRA is an alternative, but is less effective."]
    },
    3: { 
      name: "Medium dose ICS OR Low dose ICS-LABA",
      reliever: "SABA as needed (pMDI + spacer).",
      controller: "Increase to medium dose ICS, OR add a LABA to maintain low dose ICS.",
      keyPoints: ["Choose based on patient assessment and preference. ICS-LABA may provide better symptom control for some."]
    },
    4: { 
      name: "Referral, or Medium dose ICS-LABA",
      reliever: "SABA as needed (pMDI + spacer).",
      controller: "Medium dose ICS-LABA.",
      additional: ["Add-on tiotropium (for ages 6 years or older) can be considered by specialists."],
      referral: "Referral to a pediatric specialist is the preferred option at this step."
    }
  }
};

export const youngChildTreatments: YoungChildTreatmentOptions = {
  1: {
    stepDescription: "Step 1: Preferred option: as-needed inhaled short-acting beta2-agonist (SABA)",
    preferred: {
      name: "As-needed inhaled SABA",
      reliever: "Inhaled SABA via pMDI + valved holding chamber (spacer) with facemask.",
      keyPoints: [
        "Indicated for children with infrequent viral wheeze and NO interval symptoms (symptoms < twice a week on average).",
        "SABA should be used for relief of symptoms."
      ],
      notes: [
        "Oral bronchodilator therapy is not recommended due to slower onset and higher side-effects.",
        "Symptoms > twice a week indicate need for Step 2 (Daily ICS)."
      ]
    },
    alternatives: [
      {
        id: 'INTERMITTENT_ICS_STEP1',
        name: "Intermittent short course ICS",
        controller: "Consider intermittent short course ICS at onset of viral illness.",
        keyPoints: [
          "Consider for children with intermittent viral-induced asthma and no interval symptoms.",
          "Particularly if underlying atopy is present (positive mAPI)."
        ],
        notes: ["Requires physician confidence that treatment will be used appropriately."]
      }
    ]
  },
  2: {
    stepDescription: "Step 2: Preferred option: daily low-dose ICS plus as-needed SABA",
    preferred: {
      name: "Daily low-dose ICS + SABA as needed",
      reliever: "Inhaled SABA as needed.",
      controller: "Regular daily low-dose ICS (see Box 11-3).",
      keyPoints: [
        "Recommended for children with symptom patterns suggesting persistent asthma (symptoms not well controlled, > twice a week).",
        "Also for children with >= 1 severe exacerbations/year requiring OCS or hospitalization."
      ],
      notes: ["Initial trial for at least 3 months. Most effective option for reducing symptoms and exacerbations."]
    },
    alternatives: [
      {
        id: 'DAILY_LTRA',
        name: "Daily LTRA",
        controller: "Daily Leukotriene Receptor Antagonist (LTRA).",
        keyPoints: [
          "Reduces symptoms and need for OCS compared with placebo.",
          "Less effective than daily ICS for preventing exacerbations."
        ],
        notes: ["Counsel parents about potential neuropsychiatric side effects."]
      },
      {
        id: 'INTERMITTENT_ICS_STEP2',
        name: "Intermittent short course ICS",
        controller: "Intermittent short course of ICS at onset of respiratory illness.",
        keyPoints: [
          "May be considered for frequent viral-induced wheezing with interval symptoms, but a trial of regular daily low-dose ICS should be prioritized."
        ]
      }
    ]
  },
  3: {
    stepDescription: "Step 3: Preferred option: double 'low' daily ICS dose",
    preferred: {
      name: "Double 'low dose' ICS",
      reliever: "Inhaled SABA as needed.",
      controller: "Increase to medium dose ICS (typically double the 'low' dose).",
      keyPoints: [
        "Indicated if asthma is not controlled on low-dose ICS (Step 2).",
        "First check: Inhaler technique, adherence, and environmental exposures."
      ],
      referral: "Referral to a specialist is strongly recommended if control is poor."
    },
    alternatives: [
      {
        id: 'CONSIDER_REFERRAL_S3',
        name: "Consider Specialist Referral",
        controller: "Referral for expert advice.",
        keyPoints: ["As per GINA 2025, specialist referral is the listed alternative for Step 3.", "Consider for assessing comorbidities and alternative diagnoses."],
        referral: "Consider Referral"
      },
      {
        id: 'ADD_LTRA',
        name: "Low dose ICS + LTRA",
        controller: "Continue low dose ICS and add LTRA.",
        keyPoints: ["Additional option mentioned in main text for some patients.", "Monitor for response."]
      }
    ]
  },
  4: {
    stepDescription: "Step 4: Continue controller and refer for specialist assessment",
    preferred: {
      name: "Continue controller & refer for specialist assessment",
      reliever: "Inhaled SABA as needed.",
      controller: "Continue controller medication.",
      additional: ["Specialist may consider adding LTRA, or other advanced therapies."],
      keyPoints: [
        "Referral is essential for expert assessment.",
        "Investigate for alternative diagnoses and comorbidities."
      ],
      referral: "Required. Do not escalate treatment further without specialist advice."
    }
  }
};


export const exacerbationPlanDetails = {
  adult: {
    mildModerateAtHome: {
      title: "Management of Mild-Moderate Exacerbation (Adults)",
      steps: [
        "Reliever: Increase frequency. For SABA, take 2-4 puffs every 20 minutes for 1 hour. For ICS-formoterol AIR/MART, take 1 extra puff as needed (up to a max total of 12 puffs/day).",
        "Systemic Corticosteroids: Start promptly. Typical dose: Prednisone 40-50mg daily for 5-7 days. Tapering is not generally needed for courses of this duration.",
        "Assess Response: If symptoms improve and relief lasts for at least 3-4 hours, continue increased reliever use and review controller medication.",
        "Controller: Review and consider stepping up long-term controller therapy. An exacerbation signals a failure of current management."
      ],
      whenToSeekUrgentHelp: [
        "Symptoms worsen rapidly despite increased reliever use.",
        "Difficulty speaking in full sentences or breathlessness at rest.",
        "Drowsiness, confusion, or cyanosis (blue lips/nails).",
        "PEF less than 60% of personal best or predicted."
      ],
      notes: "Self-management should follow the patient's written asthma action plan. Refer to GINA 2025, Box 9-2 for detailed guidance."
    },
    severeInER: {
      title: "Management of Severe Exacerbation - Emergency Care (Adults)",
      keyTreatments: [
        "Oxygen: Titrate to maintain SaO2 93-95%.",
        "Bronchodilators: High-dose inhaled SABA plus ipratropium bromide, given repeatedly for the first hour via pMDI with spacer or nebulizer.",
        "Systemic Corticosteroids: Administer within 1 hour. Oral prednisone (1mg/kg, max 50mg) is effective. Use IV hydrocortisone if patient cannot take oral medication.",
        "Consider IV magnesium sulfate (2g IV over 20 mins) for patients with FEV1 less than 25-30% predicted or those with poor response to initial therapy."
      ],
      monitoring: ["Frequent assessment of clinical signs (respiratory rate, accessory muscle use, speech), SaO2, and lung function (PEF or FEV1) to gauge response."],
      notes: "Admission criteria include poor/transient response to treatment, persistent low lung function (PEF less than 60%), drowsiness, or confusion. See GINA 2025, Box 9-4."
    }
  },
  child: { // 6-11 years
     mildModerateAtHome: {
      title: "Management of Mild-Moderate Exacerbation (Child 6-11y)",
      steps: [
        "Reliever: Give 2-4 puffs of SABA (pMDI + spacer) every 20 minutes for up to 1 hour.",
        "Oral Corticosteroids: Contact doctor promptly. A short course of oral prednisolone (1-2 mg/kg, max 40mg, for 3-5 days) is usually needed.",
        "Controller: Review controller medication. A temporary increase may be advised as part of the action plan.",
        "Assess Response: If symptoms are not relieved, or reliever is needed more often than every 3-4 hours, seek urgent medical care."
      ],
      whenToSeekUrgentHelp: [
        "Reliever needed more often than every 3-4 hours.",
        "Child is too breathless to talk, eat, or play.",
        "Ribs pulling in with each breath (retractions).",
        "Child is very drowsy, confused or agitated."
      ],
      notes: "All reliever medication should be administered via pMDI with a valved holding chamber (spacer). See GINA 2025, Box 9-3."
    },
    severeInER: {
      title: "Management of Severe Exacerbation - Emergency Care (Child 6-11y)",
       keyTreatments: [
        "Oxygen: Titrate to maintain SaO2 greater than 94%.",
        "Bronchodilators: Inhaled SABA (4-10 puffs via spacer) + Ipratropium Bromide (2-4 puffs), which can be repeated every 20 minutes for the first hour.",
        "Systemic Corticosteroids: Administer oral prednisolone promptly (1-2 mg/kg, max 40mg). IV is generally not superior if child can take oral.",
        "Consider IV magnesium for severe cases with poor initial response. IV SABA is for ICU setting only."
      ],
       monitoring: ["Continuous monitoring of oxygen saturation, respiratory rate, heart rate, and work of breathing (retractions)."],
       notes: "Hospital admission is required if there is poor or transient response to initial treatment. See GINA 2025, Box 9-4."
    }
  },
  youngChild: { // <= 5 years
    mildModerateAtHome: {
      title: "Management of Mild-Moderate Wheezing Episode (Child <=5y)",
      steps: [
        "Reliever: Give 2 puffs of SABA (pMDI + spacer + facemask). Can be repeated every 20 minutes for up to 3 doses (total 6 puffs in 1 hour).",
        "Assess Response: If symptoms improve and relief lasts more than 3 hours, continue SABA 2 puffs every 4-6 hours as needed for 1-2 days. If response is poor, seek urgent care.",
        "Contact Doctor: Parents should inform their doctor of the episode. OCS are not usually initiated by parents at home but may be prescribed after assessment."
      ],
       whenToSeekUrgentHelp: [
        "Symptoms worsen or do not improve after 1 hour of initial SABA treatment.",
        "Child is too breathless to feed, talk or cry.",
        "Shows signs of severe respiratory distress (retractions, nasal flaring, grunting).",
        "Child becomes drowsy, confused, or has blue lips."
      ],
      notes: "The key is early recognition and intervention based on the child's written action plan. See GINA 2025, Box 11-4."
    },
    severeInER: {
      title: "Management of Severe Wheezing Episode - Emergency Care (Child <=5y)",
       keyTreatments: [
        "Oxygen: Administer to maintain SaO2 greater than 94%.",
        "Bronchodilators: Inhaled SABA (4-6 puffs via spacer) repeated every 20 minutes, with ipratropium bromide for moderate/severe episodes.",
        "Systemic Corticosteroids: Prednisolone 1-2 mg/kg (max 20mg for 0-2y; 30mg for 3-5y) for 3-5 days is recommended for most episodes treated in emergency care."
      ],
      monitoring: ["Continuous assessment of oxygen saturation, heart rate, respiratory rate, and work of breathing."],
      notes: "Severe exacerbations in this age group require prompt emergency department evaluation. See GINA 2025, Box 11-5."
    }
  }
};
