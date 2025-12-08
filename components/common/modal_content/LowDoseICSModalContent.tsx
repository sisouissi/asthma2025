
import React from 'react';
import { AlertTriangle, Info, ShieldCheck, Syringe, Droplets } from '../../../constants/icons';

const LowDoseICSModalContent: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Warning Section */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
        <div className="flex items-start">
          <AlertTriangle className="text-amber-600 mr-3 mt-1 flex-shrink-0" size={20} />
          <div className="text-sm text-amber-800">
            <p className="font-bold mb-1">NOT a Table of Equivalence</p>
            <p>
              These are suggested "low" total daily doses based on safety and effectiveness studies. 
              <strong>Switching between products may change the potency.</strong> Monitor the child closely for stability or side effects after any change.
            </p>
          </div>
        </div>
      </div>

      {/* Dosage Table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 font-semibold text-slate-700 flex items-center">
            <Syringe size={18} className="mr-2"/>
            Low Daily Doses of ICS (Child ≤5 years)
        </div>
        <table className="min-w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="px-4 py-2">Inhaled Corticosteroid</th>
              <th className="px-4 py-2">Low Total Daily Dose (mcg)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-2">BDP (pMDI, standard particle, HFA)</td>
              <td className="px-4 py-2">100</td>
            </tr>
            <tr>
              <td className="px-4 py-2">BDP (pMDI, extrafine particle, HFA)</td>
              <td className="px-4 py-2">50</td>
            </tr>
            <tr>
              <td className="px-4 py-2">Budesonide nebulized</td>
              <td className="px-4 py-2">500</td>
            </tr>
            <tr>
              <td className="px-4 py-2">Fluticasone propionate (pMDI, standard)</td>
              <td className="px-4 py-2">50</td>
            </tr>
            <tr>
              <td className="px-4 py-2">Fluticasone furoate (DPI)</td>
              <td className="px-4 py-2 text-slate-400 italic">Not sufficiently studied</td>
            </tr>
            <tr>
              <td className="px-4 py-2">Mometasone furoate (pMDI, standard)</td>
              <td className="px-4 py-2">100</td>
            </tr>
            <tr>
              <td className="px-4 py-2">Ciclesonide (pMDI, extrafine)</td>
              <td className="px-4 py-2 text-slate-400 italic">Not sufficiently studied</td>
            </tr>
          </tbody>
        </table>
        <div className="bg-slate-50 px-4 py-2 text-xs text-slate-500 border-t border-slate-200">
            BDP = Beclometasone dipropionate.
        </div>
      </div>

      {/* Indications Section */}
      <div className="bg-white border border-violet-200 rounded-lg p-4 shadow-sm">
        <h4 className="font-semibold text-violet-800 mb-3 flex items-center">
            <ShieldCheck size={18} className="mr-2"/>
            Who should be prescribed regular daily ICS?
        </h4>
        <p className="text-sm text-slate-700 mb-2">Daily low-dose ICS is indicated for a child with either:</p>
        <ul className="list-disc list-inside text-sm text-slate-600 space-y-2">
            <li><strong>Symptom Pattern:</strong> Respiratory symptoms not well controlled (e.g., reliever needed &gt;2x/week on average).</li>
            <li><strong>Exacerbation History:</strong> One or more exacerbations or wheezing episodes in the past 12 months requiring acute care, OCS, or hospitalization.</li>
            <li><strong>Recurrent Viral Wheeze:</strong> May also be indicated in children with recurrent viral-induced asthma, particularly if episodes are frequent or severe.</li>
        </ul>
      </div>

      {/* Administration Note */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
         <h4 className="font-semibold text-blue-800 mb-2 text-sm flex items-center">
            <Droplets size={16} className="mr-2"/>
            Administration & Safety
         </h4>
         <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
             <li>In children, pMDI should <strong>always</strong> be used with a spacer (valved holding chamber).</li>
             <li>Use a facemask for children unable to seal their lips around the mouthpiece (usually &lt;3-4 years).</li>
             <li>Clean the face and rinse the mouth (if possible) after inhalation to avoid local side-effects (thrush, steroid rash).</li>
             <li>Monitor growth (height) at least once a year.</li>
         </ul>
      </div>
      
      <p className="text-xs text-center text-slate-500">Reference: GINA 2025 Report, Box 11-3 (p.195)</p>
    </div>
  );
};

export default LowDoseICSModalContent;
