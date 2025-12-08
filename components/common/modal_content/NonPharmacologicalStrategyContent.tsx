
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface AccordionSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  content: string;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ title, isOpen, onToggle, content }) => {
  return (
    <div className="border border-slate-200 rounded-lg mb-2">
      <button
        onClick={onToggle}
        className="w-full p-4 text-left bg-slate-50 hover:bg-slate-100 transition-colors duration-200 flex items-center justify-between"
      >
        <span className="font-medium text-slate-800">{title}</span>
        {isOpen ? (
          <ChevronDown size={20} className="text-slate-600" />
        ) : (
          <ChevronRight size={20} className="text-slate-600" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 bg-white border-t border-slate-200">
          <p className="text-slate-700 text-sm leading-relaxed">{content}</p>
        </div>
      )}
    </div>
  );
};

const NonPharmacologicalStrategyContent: React.FC = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const strategies = [
    {
      id: 'smoking-cessation',
      intervention: 'Smoking/Vaping Cessation',
      recommendation: 'Strongly advise quitting and provide support resources including counseling, behavioral interventions, and appropriate pharmacotherapy (nicotine replacement therapy, varenicline, or bupropion). Avoid environmental tobacco smoke exposure. Smoking cessation is the single most important intervention for improving asthma control and preventing disease progression.'
    },
    {
      id: 'physical-activity',
      intervention: 'Physical Activity and Exercise',
      recommendation: 'Encourage regular physical activity as part of a healthy lifestyle. Provide guidance on preventing exercise-induced bronchoconstriction through proper warm-up, pre-exercise bronchodilator use when needed, and choosing appropriate activities. Swimming and other endurance activities are particularly beneficial.'
    },
    {
      id: 'trigger-management',
      intervention: 'Trigger Identification and Avoidance',
      recommendation: 'Systematically identify and help patients avoid confirmed triggers including: allergens (house dust mites, pet dander, pollen, molds), occupational exposures, air pollutants, respiratory infections, medications (aspirin, NSAIDs, beta-blockers), and emotional stress. Provide specific avoidance strategies for each identified trigger.'
    },
    {
      id: 'action-plan',
      intervention: 'Written Asthma Action Plan',
      recommendation: 'Provide every patient with a personalized, written asthma action plan that includes: daily management instructions, how to recognize worsening asthma, specific steps to take during an exacerbation, when to seek emergency care, and emergency contact information. Review and update the plan regularly.'
    },
    {
      id: 'weight-management',
      intervention: 'Weight Management',
      recommendation: 'For overweight or obese patients, provide support for achieving and maintaining a healthy weight through appropriate dietary counseling and physical activity. Weight loss can improve asthma control, reduce medication needs, and improve quality of life in obese patients with asthma.'
    },
    {
      id: 'inhaler-technique',
      intervention: 'Inhaler Technique Training',
      recommendation: 'Provide comprehensive training on proper inhaler technique at every visit. Use physical demonstration, return demonstration by the patient, and provide written instructions. Check technique regularly as it deteriorates over time. Poor inhaler technique is a major cause of treatment failure.'
    },
    {
      id: 'medication-adherence',
      intervention: 'Medication Adherence Support',
      recommendation: 'Assess and address barriers to medication adherence including cost, side effects, complexity of regimen, and patient beliefs about medications. Provide education about the importance of controller medications even when asymptomatic. Consider adherence aids and simplified regimens when appropriate.'
    },
    {
      id: 'environmental-control',
      intervention: 'Indoor Environmental Control',
      recommendation: 'Advise on reducing indoor allergens and irritants: use allergen-impermeable covers for bedding, wash bedding weekly in hot water, maintain low humidity (30-50%), ensure adequate ventilation, avoid carpets in bedrooms, and use HEPA filters. Address mold problems and reduce exposure to volatile organic compounds.'
    },
    {
      id: 'dietary-considerations',
      intervention: 'Dietary and Nutritional Factors',
      recommendation: 'Encourage a balanced diet rich in fruits and vegetables, which may have protective effects. Identify and avoid specific food triggers in patients with confirmed food allergies. Consider vitamin D supplementation in deficient patients. Avoid sulfite-containing foods and beverages in sensitive individuals.'
    },
    {
      id: 'stress-management',
      intervention: 'Stress Management and Psychological Support',
      recommendation: 'Assess for anxiety, depression, and stress-related triggers. Provide stress management techniques including relaxation exercises, breathing techniques, and mindfulness. Consider referral to mental health professionals when indicated. Address any psychological barriers to asthma self-management.'
    },
    {
      id: 'education-selfmanagement',
      intervention: 'Patient Education and Self-Management',
      recommendation: 'Provide comprehensive asthma education covering: disease understanding, treatment goals, medication purposes and proper use, monitoring techniques (peak flow, symptom tracking), trigger recognition and avoidance, and when to seek help. Use culturally appropriate educational materials and check understanding regularly.'
    },
    {
      id: 'occupational-factors',
      intervention: 'Occupational and Environmental Exposures',
      recommendation: 'Identify work-related triggers and exposures. Provide guidance on workplace modifications, use of personal protective equipment, and when to consider job modification or change. Address indoor and outdoor air quality issues. Advise on timing of outdoor activities based on air quality and pollen forecasts.'
    }
  ];

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      <div className="sticky top-0 bg-white pb-2 border-b border-slate-200">
        <p className="text-sm text-slate-600">
          Non-pharmacological interventions are essential components of comprehensive asthma management. 
          These evidence-based strategies complement medication therapy and can significantly improve asthma control, 
          reduce exacerbations, and enhance quality of life.
        </p>
      </div>
      
      <div className="space-y-2">
        {strategies.map((strategy) => (
          <AccordionSection
            key={strategy.id}
            title={strategy.intervention}
            isOpen={openSections[strategy.id] || false}
            onToggle={() => toggleSection(strategy.id)}
            content={strategy.recommendation}
          />
        ))}
      </div>
      
      <div className="mt-6 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-md">
        <p className="text-blue-800 text-sm">
          <strong>Important:</strong> These non-pharmacological strategies should be implemented alongside 
          appropriate pharmacological treatment, not as replacements for necessary medications. The combination 
          of both approaches provides optimal asthma management.
        </p>
      </div>
      
      <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-400 rounded-r-md">
        <p className="text-green-800 text-sm">
          <strong>Implementation:</strong> Prioritize interventions based on individual patient needs, 
          preferences, and identified triggers. Regular follow-up is essential to assess effectiveness 
          and make necessary adjustments.
        </p>
      </div>
      
      <p className="text-xs text-slate-500 text-center mt-4">Reference: GINA 2025 Strategy Report</p>
    </div>
  );
};

export default NonPharmacologicalStrategyContent;
