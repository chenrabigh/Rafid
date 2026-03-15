interface HeroProps {
  onViewDemo: () => void;
  onExplorePlatform: () => void;
}

export default function Hero({ onViewDemo, onExplorePlatform }: HeroProps) {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Background Gradient Accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f5a7a]/5 via-transparent to-[#1fa876]/5 pointer-events-none" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-[#0f5a7a]/10 to-[#1fa876]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-[#1fa876]/10 to-[#0f5a7a]/10 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Where Waste Becomes
            <span className="gradient-text block mt-2">Value</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            RAFID is a digital waste-to-resource and circular economy platform connecting industrial players in Saudi Arabia. 
            Transform byproducts into revenue, reduce disposal costs, and align with Vision 2030's sustainability goals.
          </p>

          {/* Value Propositions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="card-rafid">
              <div className="text-3xl font-bold gradient-text mb-2">↓ 40%</div>
              <p className="text-sm text-gray-600">Cost Reduction through optimized resource use</p>
            </div>
            <div className="card-rafid">
              <div className="text-3xl font-bold gradient-text mb-2">↑ 3x</div>
              <p className="text-sm text-gray-600">New Revenue from monetized byproducts</p>
            </div>
            <div className="card-rafid">
              <div className="text-3xl font-bold gradient-text mb-2">✓ 100%</div>
              <p className="text-sm text-gray-600">Traceability for ESG reporting</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onViewDemo}
              className="btn-gradient text-base px-8 py-4"
            >
              View Demo
            </button>
            <button
              onClick={onExplorePlatform}
              className="px-8 py-4 border-2 border-[#0f5a7a] text-[#0f5a7a] font-semibold rounded-lg hover:bg-[#0f5a7a]/5 transition-colors"
            >
              Explore Platform
            </button>
          </div>

          {/* Trust Indicators */}
          <p className="text-xs text-gray-500 mt-12">
            Trusted by industrial leaders across Saudi Arabia
          </p>
        </div>
      </div>
    </section>
  );
}
