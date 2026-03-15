import { useEffect, useMemo, useState } from 'react';
import { Sliders } from 'lucide-react';
import { apiGet } from '../lib/api';

type ApiCompany = {
  id: string;
  name: string;
  industry: string;
  city: string;
  verified: boolean;
};

type ApiListing = {
  id: string;
  companyId: string;
  material: string;
  grade?: string | null;
  purity?: string | null;
  quantity: number;
  unit: string;
  frequency?: string | null;
  description: string;
  compliance?: string | null;
  location: string;
  region?: string | null;
  verified?: boolean;
  createdAt: string;
  company?: ApiCompany;
};

type ApiRequest = {
  id: string;
  listingId: string | null;
  buyerId: string;
  material?: string | null;
  unit?: string | null;
  quantity: number;
  price: number;
  status: 'PENDING' | 'ACCEPTED' | 'READY_FOR_PICKUP' | 'COMPLETED' | 'REJECTED';
  createdAt: string;
  listing?: ApiListing;
  buyer?: ApiCompany;
};

type MatchResult = {
  id: string;
  materialType: string;
  location: string;
  matchScore: number;
  reasons: string[];
  potentialValue: string;
  estimatedCO2Avoided: string;
  supplierName: string;
  buyerName: string;
  quantity: string;
  verification: string;
};

interface MatchingEngineProps {
  token?: string;
  initialMaterial?: string;
}

export default function MatchingEngine({ token, initialMaterial }: MatchingEngineProps) {
  const [filters, setFilters] = useState({
    materialType: initialMaterial || '',
    distance: 500,
    minQuantity: 0,
    maxQuantity: 1000,
    verifiedOnly: false,
  });

  useEffect(() => {
    if (initialMaterial) {
      setFilters((prev) => ({ ...prev, materialType: initialMaterial }));
    }
  }, [initialMaterial]);

  const [listings, setListings] = useState<ApiListing[]>([]);
  const [requests, setRequests] = useState<ApiRequest[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError('');

        const [liveListings, liveRequests] = await Promise.all([
          apiGet<ApiListing[]>('/listings', token),
          apiGet<ApiRequest[]>('/requests', token),
        ]);

        setListings(liveListings);
        setRequests(liveRequests);
      } catch (err) {
        console.error(err);
        setError('Failed to load matching data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [token]);

  const materialTypes = useMemo(() => {
    return Array.from(new Set(listings.map((l) => l.material).filter(Boolean)));
  }, [listings]);

  const computedMatches = useMemo(() => {
    const results: MatchResult[] = [];

    const allowedMaterial = filters.materialType.trim().toLowerCase();

    const addMatchForRequest = (request: ApiRequest) => {
      if (request.status === 'REJECTED') return;

      const requestMaterial = request.listing?.material || request.material;
      const requestQuantity = request.quantity;

      if (!requestMaterial) return;
      if (allowedMaterial && requestMaterial.toLowerCase() !== allowedMaterial) return;
      if (requestQuantity < filters.minQuantity || requestQuantity > filters.maxQuantity) return;

      const matchWithListing = (listing: ApiListing) => {
        if (!listing.material) return;
        if (allowedMaterial && listing.material.toLowerCase() !== allowedMaterial) return;
        if (requestQuantity > listing.quantity) return;
        if (filters.verifiedOnly && !(request.buyer?.verified && listing.company?.verified)) return;

        let score = 40;
        const reasons: string[] = ['Material match'];

        const quantityPct = Math.min(requestQuantity / listing.quantity, 1);
        const quantityScore = Math.round(quantityPct * 30);
        score += quantityScore;
        reasons.push(`Quantity fit: ${Math.round(quantityPct * 100)}%`);

        if (request.buyer?.city && listing.company?.city && request.buyer.city === listing.company.city) {
          score += 15;
          reasons.push('Same city');
        } else {
          score += 5;
          reasons.push('Regional match');
        }

        if (request.buyer?.verified) {
          score += 8;
          reasons.push('Verified buyer');
        }
        if (listing.company?.verified) {
          score += 7;
          reasons.push('Verified supplier');
        }
        if (request.price > 0) {
          score += 5;
          reasons.push('Price provided');
        }

        score = Math.min(score, 100);

        results.push({
          id: `${request.id}-${listing.id}`,
          materialType: listing.material,
          location: listing.location,
          matchScore: score,
          reasons,
          potentialValue: `SAR ${request.price.toLocaleString()}`,
          estimatedCO2Avoided: `${(requestQuantity * 1.8).toFixed(1)} tCO₂e`,
          supplierName: listing.company?.name || 'Supplier',
          buyerName: request.buyer?.name || 'Buyer',
          quantity: `${requestQuantity} ${listing.unit}`,
          verification:
            request.buyer?.verified && listing.verified
              ? 'Both verified'
              : request.buyer?.verified
              ? 'Buyer verified'
              : listing.verified
              ? 'Listing verified'
              : 'Pending',
        });
      };

      if (request.listing) {
        matchWithListing(request.listing);
      } else {
        for (const listing of listings) {
          matchWithListing(listing);
        }
      }
    };

    const addMatchForListing = (listing: ApiListing) => {
      if (allowedMaterial && listing.material.toLowerCase() !== allowedMaterial) return;
      if (listing.quantity < filters.minQuantity || listing.quantity > filters.maxQuantity) return;
      if (filters.verifiedOnly && !listing.company?.verified) return;

      let score = 50;
      const reasons: string[] = ['Listing available'];
      score += 20;
      reasons.push('Strong supply quantity');
      if (listing.company?.verified) {
        score += 20;
        reasons.push('Verified supplier');
      }
      if (filters.distance >= 300) {
        score += 5;
        reasons.push('Wide logistics radius');
      }
      score = Math.min(score, 100);

      results.push({
        id: listing.id,
        materialType: listing.material,
        location: listing.location,
        matchScore: score,
        reasons,
        potentialValue: `SAR ${Math.round(listing.quantity * 50).toLocaleString()}`,
        estimatedCO2Avoided: `${(listing.quantity * 1.5).toFixed(1)} tCO₂e`,
        supplierName: listing.company?.name || 'Supplier',
        buyerName: 'Any buyer',
        quantity: `${listing.quantity} ${listing.unit}`,
        verification: listing.verified ? 'Verified listing' : 'Unverified listing',
      });
    };

    if (requests.length > 0) {
      for (const request of requests) {
        addMatchForRequest(request);
      }
    }

    if (results.length === 0) {
      for (const listing of listings) {
        addMatchForListing(listing);
      }
    }

    return results.sort((a, b) => b.matchScore - a.matchScore);
  }, [listings, requests, filters]);

  const handleRunMatching = () => {
    setShowResults(true);
  };

  return (
    <section className="section-rafid bg-white">
      <div className="container max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-gray-900">Matching Engine</h2>
          <p className="text-gray-600">
            Configure filters to find the best matches for your materials or requirements.
          </p>
        </div>

        <div className="card-rafid mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Sliders size={20} className="text-[#0f5a7a]" />
            <h3 className="font-semibold text-lg text-gray-900">Filters</h3>
          </div>

          {loading && <p className="text-sm text-gray-600 mb-4">Loading live marketplace data...</p>}
          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Material Type</label>
              <select
                value={filters.materialType}
                onChange={(e) => setFilters({ ...filters, materialType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f5a7a] focus:border-transparent"
              >
                <option value="">All Materials</option>
                {materialTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logistics Radius: {filters.distance} km
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                value={filters.distance}
                onChange={(e) => setFilters({ ...filters, distance: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0f5a7a]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Quantity</label>
              <input
                type="number"
                value={filters.minQuantity}
                onChange={(e) => setFilters({ ...filters, minQuantity: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f5a7a] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Quantity</label>
              <input
                type="number"
                value={filters.maxQuantity}
                onChange={(e) => setFilters({ ...filters, maxQuantity: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f5a7a] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <input
              type="checkbox"
              id="verified"
              checked={filters.verifiedOnly}
              onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-[#0f5a7a] focus:ring-[#0f5a7a]"
            />
            <label htmlFor="verified" className="text-sm font-medium text-gray-700">
              Show only verified counterparties
            </label>
          </div>

          <button onClick={handleRunMatching} className="w-full btn-gradient">
            Run Matching
          </button>
        </div>

        {showResults && (
          <div className="card-rafid">
            <h3 className="font-semibold text-lg text-gray-900 mb-6">
              Top Matches ({computedMatches.length})
            </h3>

            {computedMatches.length === 0 ? (
              <p className="text-sm text-gray-600">
                No matches found for the current filters.
              </p>
            ) : (
              <div className="space-y-4">
                {computedMatches.map((match) => (
                  <div
                    key={match.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-[#0f5a7a] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{match.materialType}</h4>
                        <p className="text-sm text-gray-600">{match.location}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {match.supplierName} → {match.buyerName}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold gradient-text">{match.matchScore}%</div>
                        <p className="text-xs text-gray-500">Match Score</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">Quantity</p>
                        <p className="font-semibold text-gray-900">{match.quantity}</p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">Potential Value</p>
                        <p className="font-semibold text-gray-900">{match.potentialValue}</p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">CO₂ Avoided</p>
                        <p className="font-semibold text-gray-900">{match.estimatedCO2Avoided}</p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">Trust</p>
                        <p className="font-semibold text-gray-900">{match.verification}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Why this match:</p>
                      <ul className="space-y-1">
                        {match.reasons.map((reason, idx) => (
                          <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                            <span className="text-[#1fa876] mt-0.5">✓</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button className="w-full mt-4 px-4 py-2 border-2 border-[#0f5a7a] text-[#0f5a7a] font-semibold rounded-lg hover:bg-[#0f5a7a]/5 transition-colors">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}