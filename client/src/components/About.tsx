export default function About() {
  const problems = [
    'Market fragmentation between waste generators and off-takers',
    'Lack of transparency on available materials and specifications',
    'Logistics complexity and coordination challenges',
    'Limited tracking and documentation across the value chain',
  ];

  return (
    <section id="about" className="section-rafid bg-white">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">About RAFID</h2>
            <p className="text-lg text-gray-600">
              Transforming industrial waste into valuable resources through digital infrastructure.
            </p>
          </div>

          {/* The Problem */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">The Challenge</h3>
            <p className="text-gray-600 mb-6">
              Saudi Arabia's industrial sector generates significant secondary materials and byproducts. 
              However, the current landscape faces critical barriers to circular economy adoption:
            </p>
            <ul className="space-y-3">
              {problems.map((problem, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0f5a7a] to-[#1fa876] flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-semibold">✓</span>
                  </div>
                  <span className="text-gray-700">{problem}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* RAFID Mission */}
          <div className="mb-12 card-rafid bg-gradient-to-br from-[#0f5a7a]/5 to-[#1fa876]/5">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              RAFID is a digital infrastructure layer connecting industrial players, enabling waste-to-resource flows, 
              and unlocking circular value. We provide a unified platform for material discovery, smart matching, 
              compliance management, and impact tracking—empowering companies to monetize byproducts while supporting 
              Saudi Arabia's circular economy goals.
            </p>
          </div>

          {/* Vision 2030 Alignment */}
          <div className="card-rafid border-l-4 border-[#1fa876]">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Vision 2030 Alignment</h3>
            <p className="text-gray-700 mb-4">
              RAFID supports Saudi Arabia's Vision 2030 objectives to:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Reduce industrial waste and increase recycling rates</li>
              <li>• Enable circular economy and green growth initiatives</li>
              <li>• Support sustainable industrial development</li>
              <li>• Enhance environmental compliance and ESG reporting</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
