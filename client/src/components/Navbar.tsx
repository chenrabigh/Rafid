import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onDemoClick: () => void;
  onSectionChange: (section: string) => void;
  activeSection: string;
}

export default function Navbar({ onDemoClick, onSectionChange, activeSection }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'Home', section: 'home' },
    { label: 'About', section: 'about' },
    { label: 'Services', section: 'services' },
    { label: 'How It Works', section: 'howItWorks' },
    { label: 'Features', section: 'features' },
    { label: 'Impact', section: 'impact' },
    { label: 'Marketplace', section: 'marketplace' },
    { label: 'Contact', section: 'contact' },
  ];

  const handleNavClick = (section: string) => {
    setIsOpen(false);
    onSectionChange(section);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/rafid-logo.png" alt="RAFID" className="h-10 w-auto" />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.section}
              onClick={() => handleNavClick(link.section)}
              className={`text-sm font-medium transition-colors ${
                activeSection === link.section ? 'text-[#0f5a7a]' : 'text-gray-700 hover:text-[#0f5a7a]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Demo Button */}
        <div className="hidden lg:block">
          <button
            onClick={onDemoClick}
            className="btn-gradient text-sm"
          >
            Demo
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="container py-4 space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.section}
                onClick={() => handleNavClick(link.section)}
                className={`block w-full text-left px-4 py-2 text-sm font-medium transition-colors rounded-lg ${activeSection === link.section ? 'bg-gray-100 text-[#0f5a7a]' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={onDemoClick}
              className="w-full btn-gradient text-sm mt-4"
            >
              View Demo
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
