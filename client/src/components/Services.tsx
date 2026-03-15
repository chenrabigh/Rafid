import { useEffect, useState } from 'react';
import { Package, Zap, CheckCircle, Truck, Users, TrendingUp } from 'lucide-react';
import { apiGet } from '../lib/api';

interface ServicesProps {
  onRunMatching?: (material?: string) => void;
}

export default function Services({ onRunMatching }: ServicesProps) {
  const [materials, setMaterials] = useState<string[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState('');

  useEffect(() => {
    async function loadMaterials() {
      try {
        const listings = await apiGet<any[]>('/listings');
        const uniqueMaterials = Array.from(new Set(listings.map((l) => l.material).filter(Boolean)));
        setMaterials(uniqueMaterials);
        if (uniqueMaterials.length > 0) {
          setSelectedMaterial(uniqueMaterials[0]);
        }
      } catch (error) {
        console.error('Failed to load listing materials:', error);
      }
    }
    loadMaterials();
  }, []);

  const services = [
    {
      icon: Package,
      title: 'Material Listings',
      description: 'Structured listings for secondary resources and byproducts with detailed specifications.',
    },
    {
      icon: Zap,
      title: 'Smart Matching',
      description: 'Algorithmic matching of supply and demand based on material, specs, location, and compliance.',
    },
    {
      icon: CheckCircle,
      title: 'Compliance & Documentation',
      description: 'Workflows for permits, certifications, and documentation uploads with audit trails.',
    },
    {
      icon: Truck,
      title: 'Logistics Tracking',
      description: 'Basic tracking views for shipments, pickups, and delivery milestones.',
    },
    {
      icon: Users,
      title: 'Quality Verification Partners',
      description: 'Network of third-party labs and verification providers for quality assurance.',
    },
    {
      icon: TrendingUp,
      title: 'ESG/Impact Reporting',
      description: 'Dashboards and exportable summaries for environmental and economic impact.',
    },
  ];

  const [distance, setDistance] = useState(500);
  const [minQuantity, setMinQuantity] = useState(0);
  const [maxQuantity, setMaxQuantity] = useState(1000);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  return (
    <section id="services" className="section-rafid bg-gray-50">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h2>
          <p className="text-lg text-gray-600">
            Comprehensive platform modules designed for industrial waste-to-resource workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="card-rafid hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#0f5a7a] to-[#1fa876] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon size={28} className="text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{service.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 max-w-4xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#0f5a7a] font-bold">Matching Engine</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">Smart demand-supply matching</h3>
              <p className="text-gray-600 mt-2">Configure quick matching filters and run the engine to find opportunities instantly.</p>
            </div>
            <div className="px-3 py-1 rounded-full bg-[#0f5a7a] text-white text-xs font-semibold">Live demo</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-xs font-semibold text-gray-700">Material Type</label>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 mt-1 text-sm"
              >
                <option value="">All materials</option>
                {materials.map((material) => (
                  <option key={material} value={material}>
                    {material}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700">Distance Radius ({distance} km)</label>
              <input
                type="range"
                min="0"
                max="1000"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-xs font-semibold text-gray-700">Min Quantity</label>
              <input
                type="number"
                value={minQuantity}
                onChange={(e) => setMinQuantity(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 mt-1 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700">Max Quantity</label>
              <input
                type="number"
                value={maxQuantity}
                onChange={(e) => setMaxQuantity(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 mt-1 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id="verified-only"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-[#0f5a7a] focus:ring-[#0f5a7a]"
            />
            <label htmlFor="verified-only" className="text-sm text-gray-700">Show only verified counterparties</label>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => onRunMatching?.(selectedMaterial)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#0f5a7a] to-[#1fa876] text-white font-semibold hover:shadow-lg transition-all"
            >
              Run Matching
            </button>
            <a
              href="https://www.linkedin.com/company/rafid"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg border border-gray-300 hover:border-[#0f5a7a] hover:text-[#0f5a7a] text-sm font-semibold"
            >
              LinkedIn
            </a>
            <a
              href="https://twitter.com/rafid"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg border border-gray-300 hover:border-[#0f5a7a] hover:text-[#0f5a7a] text-sm font-semibold"
            >
              Twitter
            </a>
            <a
              href="mailto:info@rafid.com"
              className="px-4 py-2 rounded-lg border border-gray-300 hover:border-[#0f5a7a] hover:text-[#0f5a7a] text-sm font-semibold"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
