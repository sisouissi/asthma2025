

export interface RiskFactor {
  id: string;
  label: string;
  weight: number;
}

export const adultRiskFactorsList: RiskFactor[] = [
  { id: 'intubation_history', label: 'Ever intubated or in ICU for asthma', weight: 3 },
  { id: 'exacerbation_history', label: '1 or more severe exacerbations in the last year', weight: 3 },
  { id: 'saba_overuse', label: 'High SABA use (>1 canister/month)', weight: 3 },
  { id: 'poor_adherence', label: 'Poor adherence with ICS controller medication', weight: 2 },
  { id: 'inhaler_technique', label: 'Incorrect inhaler technique', weight: 2 },
  { id: 'low_fev1', label: 'Low FEV1 (<60% predicted)', weight: 2 },
  { id: 'psychosocial', label: 'Major psychological or socioeconomic problems', weight: 2 },
  { id: 'smoking', label: 'Current smoker or exposure to tobacco smoke', weight: 1 },
  { id: 'exposures', label: 'Significant exposure to allergens or pollutants', weight: 1 },
  { id: 'comorbidities', label: 'Comorbidities (obesity, rhinosinusitis, food allergy)', weight: 1 },
];

export const childRiskFactorsList: RiskFactor[] = [
  { id: 'uncontrolled_asthma', label: 'Currently has uncontrolled asthma symptoms', weight: 3 },
  { id: 'exacerbation_history', label: '1 or more severe exacerbations in the last year', weight: 3 },
  { id: 'food_allergy', label: 'Confirmed food allergy', weight: 2 },
  { id: 'low_fev1', label: 'Low FEV1 (<60% predicted) or high reversibility', weight: 2 },
  { id: 'poor_adherence', label: 'Poor adherence to controller medication', weight: 2 },
  { id: 'inhaler_technique', label: 'Incorrect inhaler technique', weight: 2 },
  { id: 'psychosocial', label: 'Major psychological or socioeconomic problems', weight: 2 },
  { id: 'smoking_exposure', label: 'Exposure to tobacco smoke', weight: 1 },
  { id: 'allergen_exposure', label: 'High exposure to allergens (if sensitized)', weight: 1 },
  { id: 'obesity', label: 'Obesity', weight: 1 },
];

export const youngChildRiskFactorsList: RiskFactor[] = [
  { id: 'yc_exacerbation_history', label: 'One or more severe exacerbations in the last 12 months', weight: 3 },
  { id: 'yc_food_allergy', label: 'Confirmed diagnosis of food allergy', weight: 2 },
  { id: 'yc_inhaler_technique', label: 'Incorrect inhaler technique (parent/carer)', weight: 2 },
  { id: 'yc_adherence', label: 'Poor adherence to controller medication', weight: 2 },
  { id: 'yc_psychosocial', label: 'Major psychological or socioeconomic problems for the family', weight: 2 },
  { id: 'yc_smoking_exposure', label: 'Exposure to tobacco smoke', weight: 1 },
  { id: 'yc_allergen_exposure', label: 'High exposure to allergens (if child is sensitized)', weight: 1 },
  { id: 'yc_comorbidities', label: 'Other comorbidities (e.g., severe atopic dermatitis, obesity)', weight: 1 },
];