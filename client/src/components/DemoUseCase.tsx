import { CheckCircle, TrendingUp } from 'lucide-react';

export default function DemoUseCase() {
  const demoSteps = [
    {
      number: 1,
      title: 'Aramco Lists Secondary Resource',
      description: 'A processed fuel-grade byproduct from industrial operations is listed on the platform.',
      demo: 'Demo example data',
    },
    {
      number: 2,
      title: 'Yanbu Cement Posts Demand',
      description: 'Yanbu Cement specifies demand for alternative fuel with specific quality parameters.',
      demo: 'Generic specifications',
    },
    {
      number: 3,
      title: 'RAFID Smart Match',
      description: 'The platform suggests partnership with match score and compatibility reasons.',
      reasons: [
        'Material calorific value compatible (demo)',
        'Distance within agreed radius',
        'Meets basic environmental compliance requirements (demo)',
      ],
    },
    {
      number: 4,
      title: 'Deal Room Agreement',
      description: 'Parties negotiate and agree on specs, pricing, and supply schedule.',
      details: [
        'Price range (demo)',
        'Incoterms (demo)',
        'Pilot duration: 3 months',
      ],
    },
    {
      number: 5,
      title: 'Logistics & Tracking',
      description: 'Shipment is created, tracked, and updated through delivery and verification.',
      statuses: [
        'Pilot shipment created',
        'In transit',
        'Delivered',
        'Verified',
        'Recurring supply scheduled',
      ],
    },
    {
      number: 6,
      title: 'Impact Report',
      description: 'Environmental and economic impact is calculated and reported.',
      kpis: [
        { label: 'Waste Diverted', value: '500 tonnes', note: 'illustrative' },
        { label: 'CO2 Avoided', value: '250 tonnes CO2e', note: 'illustrated estimate' },
        { label: 'Economic Value', value: 'SAR 1.5M', note: 'demo' },
        { label: 'Transactions', value: '1 pilot deal', note: 'demo' },
      ],
    },
  ];

  const beforeAfter = [
    {
      before: 'Landfill disposal of byproducts',
      after: 'Circular supply to Yanbu Cement (demo)',
    },
    {
      before: 'Unmonetized byproduct',
      after: 'New revenue stream (illustrative)',
    },
    {
      before: 'Fragmented communications',
      after: 'Traceable and reported impact',
    },
    {
      before: 'Limited compliance tracking',
      after: 'Full audit trail and documentation',
    },
  ];

  return (
    <section id="demo-use-case" className="section-rafid bg-gradient-to-b from-white to-gray-50">
      <div className="container max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Demo Use Case</h2>
          <p className="text-lg text-gray-600 mb-2">Aramco × Yanbu Cement</p>
          <p className="text-sm text-gray-500 italic">
            All data is illustrative for demo purposes. Not actual Aramco or Yanbu Cement figures.
          </p>
        </div>

        {/* Timeline Steps */}
        <div className="mb-16">
          <div className="space-y-8">
            {demoSteps.map((step, index) => (
              <div key={index} className="flex gap-6">
                {/* Left: Number Circle */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0f5a7a] to-[#1fa876] flex items-center justify-center text-white font-bold text-lg">
                    {step.number}
                  </div>
                  {index < demoSteps.length - 1 && (
                    <div className="w-1 h-24 bg-gradient-to-b from-[#0f5a7a] to-[#1fa876] mt-4" />
                  )}
                </div>

                {/* Right: Content */}
                <div className="flex-grow pt-1 pb-8">
                  <div className="card-rafid">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 mb-4">{step.description}</p>

                    {step.demo && (
                      <p className="text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg mb-4">
                        {step.demo}
                      </p>
                    )}

                    {step.reasons && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Match Reasons:</p>
                        <ul className="space-y-1">
                          {step.reasons.map((reason, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                              <CheckCircle size={16} className="text-[#1fa876] flex-shrink-0 mt-0.5" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {step.details && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Deal Terms:</p>
                        <ul className="space-y-1">
                          {step.details.map((detail, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-[#0f5a7a] font-bold">•</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {step.statuses && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Shipment Status:</p>
                        <div className="flex flex-wrap gap-2">
                          {step.statuses.map((status, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                            >
                              {status}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {step.kpis && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {step.kpis.map((kpi, idx) => (
                          <div key={idx} className="bg-gradient-to-br from-[#0f5a7a]/5 to-[#1fa876]/5 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">{kpi.label}</p>
                            <p className="font-bold text-gray-900">{kpi.value}</p>
                            <p className="text-xs text-gray-500">{kpi.note}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Before vs After */}
        <div className="card-rafid border-t-4 border-gradient-to-r from-[#0f5a7a] to-[#1fa876]">
          <h3 className="font-semibold text-lg text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp size={24} className="text-[#0f5a7a]" />
            Before vs After RAFID
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {beforeAfter.map((item, index) => (
              <div key={index} className="space-y-4">
                <div className="bg-red-50 border border-red-100 p-4 rounded-lg">
                  <p className="text-xs font-semibold text-red-700 mb-2">Before</p>
                  <p className="text-sm text-red-800">{item.before}</p>
                </div>
                <div className="flex justify-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#0f5a7a] to-[#1fa876] flex items-center justify-center text-white">
                    →
                  </div>
                </div>
                <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                  <p className="text-xs font-semibold text-green-700 mb-2">After</p>
                  <p className="text-sm text-green-800">{item.after}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
