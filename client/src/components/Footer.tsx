import { Linkedin, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Demo', href: '#demo-use-case' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <img src="/rafid-logo.png" alt="RAFID" className="h-8 w-auto mb-4" />
            <p className="text-sm text-gray-600">
              RAFID is a waste-to-resource platform prototype built for demonstration purposes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="text-sm text-gray-600 hover:text-[#0f5a7a] transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-[#0f5a7a] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-[#0f5a7a] transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-[#0f5a7a] transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Connect</h4>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/company/rafid" target="_blank" rel="noreferrer"
                className="p-2 bg-white border border-gray-200 rounded-lg hover:border-[#0f5a7a] hover:text-[#0f5a7a] transition-colors"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://twitter.com/rafid" target="_blank" rel="noreferrer"
                className="p-2 bg-white border border-gray-200 rounded-lg hover:border-[#0f5a7a] hover:text-[#0f5a7a] transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a
                href="mailto:info@rafid.com"
                className="p-2 bg-white border border-gray-200 rounded-lg hover:border-[#0f5a7a] hover:text-[#0f5a7a] transition-colors"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 pt-8">
          <p className="text-xs text-gray-500 text-center">
            © 2026 RAFID. Demo prototype – not a live service. All data is illustrative for demonstration purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
