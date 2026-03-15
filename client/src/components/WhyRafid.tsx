import { Shield, Network, BarChart3, Leaf } from 'lucide-react';

export default function WhyRafid() {
  const reasons = [
    {
      icon: Network,
      title: 'Trusted Network',
      description: 'Connect with verified industrial partners and off-takers across Saudi Arabia.',
    },
    {
      icon: Shield,
      title: 'Compliance-Ready',
      description: 'Built-in workflows for permits, certifications, and regulatory documentation.',
    },
    {
      icon: BarChart3,
      title: 'Unified View',
      description: 'Real-time visibility into available materials, demand, and market opportunities.',
    },
    {
      icon: Leaf,
      title: 'Vision 2030 Aligned',
      description: 'Support Saudi Arabia\'s circular economy and sustainability goals.',
    },
  ];

  return (
    <section className="section-rafid bg-gradient-to-b from-white to-gray-50">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why RAFID?</h2>
          <p className="text-lg text-gray-600">
            Industrial players choose RAFID to unlock circular value and competitive advantage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <div
                key={index}
                className="card-rafid hover:scale-105 transition-transform duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0f5a7a] to-[#1fa876] flex items-center justify-center mb-4">
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{reason.title}</h3>
                <p className="text-sm text-gray-600">{reason.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
