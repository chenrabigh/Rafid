import { UserPlus, ListPlus, Zap, Handshake, Truck, BarChart3 } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      icon: UserPlus,
      title: 'Register',
      description: 'Industrial companies and partners sign up and complete onboarding.',
    },
    {
      number: 2,
      icon: ListPlus,
      title: 'List Supply/Demand',
      description: 'Users post available secondary materials or specify what they need.',
    },
    {
      number: 3,
      icon: Zap,
      title: 'Smart Match',
      description: 'RAFID surfaces relevant matches with contextual information and scores.',
    },
    {
      number: 4,
      icon: Handshake,
      title: 'Negotiate & Contract',
      description: 'Parties use Deal Room to align on specs, price, and terms.',
    },
    {
      number: 5,
      icon: Truck,
      title: 'Logistics & Tracking',
      description: 'Shipments are scheduled, tracked, and updated in the platform.',
    },
    {
      number: 6,
      icon: BarChart3,
      title: 'Impact Report',
      description: 'Impact metrics are summarized for ESG, audit, and internal reporting.',
    },
  ];

  return (
    <section id="how-it-works" className="section-rafid bg-white">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-gray-600">
            A six-step process to transform industrial waste into valuable resources.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-5xl mx-auto">
          {/* Desktop Timeline */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-[#0f5a7a] to-[#1fa876]" />

              {/* Steps */}
              <div className="grid grid-cols-6 gap-4 relative z-10">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex flex-col items-center">
                      {/* Circle */}
                      <div className="w-32 h-32 rounded-full bg-white border-4 border-gradient-to-r from-[#0f5a7a] to-[#1fa876] flex flex-col items-center justify-center mb-4 shadow-lg">
                        <Icon size={28} className="text-[#0f5a7a] mb-1" />
                        <span className="text-2xl font-bold gradient-text">{step.number}</span>
                      </div>
                      {/* Content */}
                      <h3 className="font-semibold text-center text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-xs text-center text-gray-600 leading-tight">{step.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="md:hidden space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex gap-4">
                  {/* Left Line and Circle */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0f5a7a] to-[#1fa876] flex items-center justify-center text-white font-bold">
                      {step.number}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-1 h-16 bg-gradient-to-b from-[#0f5a7a] to-[#1fa876] mt-2" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pt-1 pb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={20} className="text-[#0f5a7a]" />
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
