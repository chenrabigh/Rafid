import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { apiGet } from '../lib/api';
import Toast from './Toast';
import Modal from './Modal';

interface AuthData {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    companyId?: string | null;
  };
}

interface ImpactSummary {
  activeListings: number;
  matchedOpportunities: number;
  verifiedListings: number;
  verifiedTransactions: number;
  tonsDiverted: number;
  estimatedCO2Saved: number;
  acceptanceRate: number;
}

interface ImpactDashboardProps {
  auth: AuthData;
}

export default function ImpactDashboard({ auth }: ImpactDashboardProps) {
  const [summary, setSummary] = useState<ImpactSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleDownloadReport = () => {
    setShowPdfModal(true);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  useEffect(() => {
    async function loadImpactSummary() {
      try {
        setLoading(true);
        setError('');

        const data = await apiGet<ImpactSummary>('/impact/summary', auth.token);
        setSummary(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load impact dashboard');
      } finally {
        setLoading(false);
      }
    }

    loadImpactSummary();
  }, [auth.token]);

  const kpis = summary
    ? [
        {
          label: 'Total Waste Diverted',
          value: formatNumber(summary.tonsDiverted),
          unit: 'tons',
          change: 'Derived from accepted transactions',
        },
        {
          label: 'Estimated CO2 Avoided',
          value: formatNumber(summary.estimatedCO2Saved),
          unit: 'tCO2e (illustrative)',
          change: 'Demo estimate based on diverted material',
        },
        {
          label: 'Verified Transactions',
          value: formatNumber(summary.verifiedTransactions),
          unit: 'transactions',
          change: 'Accepted requests in RAFID workflow',
        },
        {
          label: 'Active Listings',
          value: formatNumber(summary.activeListings),
          unit: 'live listings',
          change: `${summary.verifiedListings} verified listings`,
        },
      ]
    : [];

  if (loading) {
    return (
      <section id="impact" className="section-rafid bg-white">
        <div className="container">
          <div className="text-center text-gray-600">Loading impact dashboard...</div>
        </div>
      </section>
    );
  }

  if (error || !summary) {
    return (
      <section id="impact" className="section-rafid bg-white">
        <div className="container">
          <div className="text-center text-red-600">
            {error || 'Failed to load impact dashboard'}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="impact" className="section-rafid bg-white">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Impact Dashboard</h2>
          <p className="text-lg text-gray-600">
            Track circular economy outcomes, verified transactions, and measurable resource recovery impact.
          </p>
          <p className="text-sm text-gray-500 mt-4 italic">
            Demo metrics are generated from live platform activity and illustrative impact factors.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {kpis.map((kpi, index) => (
            <div key={index} className="card-rafid border-t-4 border-[#1fa876]">
              <p className="text-sm text-gray-600 mb-2">{kpi.label}</p>
              <p className="text-3xl font-bold gradient-text mb-1">{kpi.value}</p>
              <p className="text-xs text-gray-500 mb-3">{kpi.unit}</p>
              <p className="text-xs font-medium text-[#1fa876]">{kpi.change}</p>
            </div>
          ))}
        </div>

        {/* Summary Blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="card-rafid">
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Marketplace Activity</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Matched Opportunities</span>
                <span className="font-semibold text-[#0f5a7a]">{summary.matchedOpportunities}</span>
              </div>
              <div className="flex justify-between">
                <span>Acceptance Rate</span>
                <span className="font-semibold text-[#1fa876]">{summary.acceptanceRate}%</span>
              </div>
              <div className="flex justify-between">
                <span>Verified Listings</span>
                <span className="font-semibold text-[#0f5a7a]">{summary.verifiedListings}</span>
              </div>
            </div>
          </div>

          <div className="card-rafid">
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Circular Recovery View</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Tons Diverted</span>
                <span className="font-semibold text-[#0f5a7a]">{summary.tonsDiverted}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated CO2 Saved</span>
                <span className="font-semibold text-[#1fa876]">{summary.estimatedCO2Saved}</span>
              </div>
              <div className="flex justify-between">
                <span>Verified Transactions</span>
                <span className="font-semibold text-[#0f5a7a]">{summary.verifiedTransactions}</span>
              </div>
            </div>
          </div>

          <div className="card-rafid">
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Stakeholder Snapshot</h3>
            <p className="text-sm text-gray-700 leading-6">
              RAFID converts industrial surplus into structured, trackable circular transactions by combining
              standardized listings, verified counterparties, smart matching, and measurable impact reporting.
            </p>
          </div>
        </div>

        {/* Recent Transactions Style Section */}
        <div className="card-rafid mb-8">
          <h3 className="font-semibold text-lg mb-6 text-gray-900">Operational Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Metric</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Value</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Meaning</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-700">Active Listings</td>
                  <td className="py-3 px-4 text-gray-700">{summary.activeListings}</td>
                  <td className="py-3 px-4 text-gray-700">Structured material opportunities currently visible in RAFID</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-700">Matched Opportunities</td>
                  <td className="py-3 px-4 text-gray-700">{summary.matchedOpportunities}</td>
                  <td className="py-3 px-4 text-gray-700">Buyer-side demand linked to available industrial supply</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-700">Verified Transactions</td>
                  <td className="py-3 px-4 text-gray-700">{summary.verifiedTransactions}</td>
                  <td className="py-3 px-4 text-gray-700">Accepted exchanges progressing through RAFID workflow</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-700">Acceptance Rate</td>
                  <td className="py-3 px-4 text-gray-700">{summary.acceptanceRate}%</td>
                  <td className="py-3 px-4 text-gray-700">Share of requests that convert into accepted transactions</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Download Report Button */}
        <div className="flex justify-center">
          <button
            onClick={handleDownloadReport}
            className="btn-gradient flex items-center gap-2"
          >
            <Download size={20} />
            Download ESG Report (PDF)
          </button>
        </div>
      </div>

      <Modal
        isOpen={showPdfModal}
        title="ESG Report Download"
        onClose={() => setShowPdfModal(false)}
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            In a full production version, this would generate and download a comprehensive ESG report in PDF format.
          </p>
          <p className="text-sm text-gray-600">
            For this demo, the report would include:
          </p>
          <ul className="text-sm text-gray-600 space-y-2 ml-4 list-disc">
            <li>Waste diversion metrics and trends</li>
            <li>Illustrative CO2 emissions avoided calculations</li>
            <li>Verified transaction counts and marketplace activity</li>
            <li>Matching performance and acceptance rates</li>
            <li>Compliance and audit trail visibility</li>
          </ul>
          <button
            onClick={() => {
              setShowPdfModal(false);
              setShowToast(true);
            }}
            className="w-full btn-gradient mt-4"
          >
            Simulate Download
          </button>
        </div>
      </Modal>

      {showToast && (
        <Toast
          message="Demo: ESG Report download simulated. In production, a PDF would be generated."
          type="info"
          duration={4000}
          onClose={() => setShowToast(false)}
        />
      )}
    </section>
  );
}