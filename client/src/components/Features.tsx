import { Layers, Zap, Lock, MapPin, Users, FileText } from 'lucide-react';

interface FeaturesProps {
  onOpenMatchEngine?: () => void;
}

export default function Features({ onOpenMatchEngine }: FeaturesProps) {
  const features = [
    {
      icon: Layers,
      title: 'Unified Material Classification',
      description: 'Standardized taxonomy for industrial materials enabling seamless discovery.',
    },
    {
      icon: Zap,
      title: 'Smart Match Engine',
      description: 'Configurable rules and scoring for better matches based on your criteria.',
    },
    {
      icon: Lock,
      title: 'Deal Room',
      description: 'Secure collaboration space for terms, documents, and approvals.',
    },
    {
      icon: MapPin,
      title: 'Compliance Gate',
      description: 'Guardrail checks for compliance requirements and documentation.',
    },
    {
      icon: Users,
      title: 'Impact Dashboard',
      description: 'Real-time view of waste diversion, emissions, and economic value.',
    },
    {
      icon: FileText,
      title: 'Audit Trail',
      description: 'Immutable activity logs for complete traceability and compliance.',
    },
  ];

  return (
    <section id="features" className="section-rafid bg-gradient-to-b from-gray-50 to-white">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Platform Features</h2>
          <p className="text-lg text-gray-600">
            Powerful capabilities designed for industrial waste-to-resource transformation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="card-rafid group hover:border-[#0f5a7a] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0f5a7a]/10 to-[#1fa876]/10 flex items-center justify-center mb-4 group-hover:bg-gradient-to-br group-hover:from-[#0f5a7a] group-hover:to-[#1fa876] transition-all">
                  <Icon size={24} className="text-[#0f5a7a] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                {feature.title === 'Smart Match Engine' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenMatchEngine) {
                        onOpenMatchEngine();
                        return;
                      }
                      const target = document.getElementById('marketplace');
                      if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      } else {
                        window.location.hash = '#marketplace';
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="mt-3 inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#0f5a7a] to-[#1fa876] text-white hover:opacity-90"
                  >
                    Open Match Engine
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Partner Network Highlight */}
        <div className="mt-12 max-w-3xl mx-auto card-rafid bg-gradient-to-r from-[#0f5a7a]/5 to-[#1fa876]/5 border-l-4 border-[#1fa876]">
          <div className="flex items-start gap-4">
            <Users size={32} className="text-[#0f5a7a] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Partner Network</h3>
              <p className="text-gray-700">
                Access a curated network of logistics providers, quality verification labs, recyclers, and off-takers—all vetted and integrated into RAFID.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
