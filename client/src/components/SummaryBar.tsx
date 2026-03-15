import { useEffect, useState } from 'react';
import { apiGet } from '../lib/api';

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

interface SummaryBarProps {
  auth: AuthData;
}

export default function SummaryBar({ auth }: SummaryBarProps) {
  const [summary, setSummary] = useState<ImpactSummary | null>(null);

  useEffect(() => {
    async function loadSummary() {
      try {
        const data = await apiGet<ImpactSummary>('/impact/summary', auth.token);
        setSummary(data);
      } catch (error) {
        console.error('Failed to load summary bar:', error);
      }
    }

    loadSummary();
  }, [auth.token]);

  if (!summary) {
    return null;
  }

  const cards = [
    {
      label: 'Active Listings',
      value: summary.activeListings,
      color: 'text-[#0f5a7a]',
    },
    {
      label: 'Verified Transactions',
      value: summary.verifiedTransactions,
      color: 'text-[#1fa876]',
    },
    {
      label: 'Tons Diverted',
      value: summary.tonsDiverted,
      color: 'text-[#0f5a7a]',
    },
    {
      label: 'Acceptance Rate',
      value: `${summary.acceptanceRate}%`,
      color: 'text-[#1fa876]',
    },
  ];

  return (
    <section className="bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 shadow-sm"
            >
              <p className="text-xs text-gray-500 mb-1">{card.label}</p>
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}