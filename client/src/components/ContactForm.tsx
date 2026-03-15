import { useState } from 'react';
import { Send } from 'lucide-react';
import Toast from './Toast';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.email || !formData.company || !formData.message) {
      setToastMessage('Please fill in all fields.');
      setShowToast(true);
      return;
    }

    // Simulate submission
    setToastMessage('Thank you for your interest! Our team will contact you about a pilot opportunity. (Demo only)');
    setShowToast(true);

    // Reset form
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  return (
    <section id="contact" className="section-rafid bg-white">
      <div className="container max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-600">
            Interested in a pilot? Let's discuss how RAFID can transform your waste into value.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="card-rafid">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f5a7a] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f5a7a] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your company"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f5a7a] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your waste streams or requirements..."
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f5a7a] focus:border-transparent resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-gradient flex items-center justify-center gap-2"
              >
                <Send size={20} />
                Request a Pilot
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div className="card-rafid">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Why Partner with RAFID?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0f5a7a] to-[#1fa876] flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-semibold">✓</span>
                  </div>
                  <span className="text-gray-700">Unlock new revenue from byproducts</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0f5a7a] to-[#1fa876] flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-semibold">✓</span>
                  </div>
                  <span className="text-gray-700">Reduce disposal costs significantly</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0f5a7a] to-[#1fa876] flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-semibold">✓</span>
                  </div>
                  <span className="text-gray-700">Enhance ESG reporting and compliance</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0f5a7a] to-[#1fa876] flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-semibold">✓</span>
                  </div>
                  <span className="text-gray-700">Support Vision 2030 sustainability goals</span>
                </li>
              </ul>
            </div>

            <div className="card-rafid bg-gradient-to-br from-[#0f5a7a]/5 to-[#1fa876]/5">
              <h3 className="font-semibold text-gray-900 mb-2">Demo Information</h3>
              <p className="text-sm text-gray-600">
                This is a prototype demonstration. In a production environment, your inquiry would be routed to our team for pilot scheduling and implementation planning.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastMessage.includes('fill') ? 'error' : 'success'}
          duration={4000}
          onClose={() => setShowToast(false)}
        />
      )}
    </section>
  );
}
