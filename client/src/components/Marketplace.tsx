import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../lib/api';
import type { Listing, Request } from '../types';

interface AuthData {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    companyId?: string | null;
    companyName?: string | null;
  };
}

interface MarketplaceProps {
  onFindMatches?: (item: Listing | Request) => void;
  auth: AuthData;
}

type ApiCompany = {
  id: string;
  name: string;
  industry: string;
  city: string;
  verified: boolean;
};

type ApiListing = {
  id: string;
  companyId: string | null;
  companyName: string;
  material: string;
  grade?: string | null;
  purity?: string | null;
  quantity: number;
  unit: string;
  frequency?: string | null;
  description: string;
  compliance?: string | null;
  location: string;
  createdAt: string;
  company?: ApiCompany;
};

type ApiRequest = {
  id: string;
  listingId: string;
  buyerId: string;
  buyerCompanyName?: string;
  material?: string;
  unit?: string;
  quantity: number;
  price: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  listing?: ApiListing;
  buyer?: ApiCompany;
};

function mapListings(apiListings: ApiListing[]): Listing[] {
  return apiListings.map((listing: ApiListing) => ({
    id: listing.id,
    materialType: listing.material,
    quantity: listing.quantity,
    unit: listing.unit,
    frequency: listing.frequency || 'One-time',
    location: listing.location,
    region: listing.location, // Use location as region fallback
    specs: [
      listing.grade ? `Grade: ${listing.grade}` : 'Grade: Standard',
      listing.purity ? `Purity: ${listing.purity}` : 'Purity: Not specified',
      listing.description,
    ],
    compliance: listing.company?.verified
      ? `${listing.compliance || 'Verified'} • Verified company`
      : `${listing.compliance || 'Pending review'} • Verification pending`,
    companyName: listing.companyName,
    postedDate: new Date(listing.createdAt).toLocaleDateString(),
  }));
}

function mapRequests(apiRequests: ApiRequest[]): Request[] {
  return apiRequests.map((request: ApiRequest) => ({
    id: request.id,
    materialType: request.listing?.material || request.material || 'Requested Material',
    quantity: request.quantity,
    unit: request.unit || request.listing?.unit || 'units',
    frequency: 'One-time',
    location: request.buyer?.city || 'Unknown',
    region: request.buyer?.city || 'Unknown',
    specs: [
      `Request status: ${request.status}`,
      `Linked listing: ${request.listing?.material || 'N/A'}`,
    ],
    budget: `SAR ${request.price}`,
    compliance: request.buyer?.verified
      ? 'Verified buyer'
      : 'Buyer verification pending',
    companyName: request.buyerCompanyName || request.buyer?.name || 'Unknown Company',
    postedDate: new Date(request.createdAt).toLocaleDateString(),
  }));
}

export default function Marketplace({ onFindMatches, auth }: MarketplaceProps) {
  const [activeTab, setActiveTab] = useState<'supply' | 'demand'>('supply');
  const [listings, setListings] = useState<Listing[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [material, setMaterial] = useState('');
  const [grade, setGrade] = useState('');
  const [purity, setPurity] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('tons');
  const [frequency, setFrequency] = useState('One-time');
  const [description, setDescription] = useState('');
  const [compliance, setCompliance] = useState('Verified internal handling');
  const [location, setLocation] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [selectedListingId, setSelectedListingId] = useState('');
  const [newRequestMaterial, setNewRequestMaterial] = useState('');
  const [newRequestUnit, setNewRequestUnit] = useState('tons');
  const [buyerCompanyName, setBuyerCompanyName] = useState(auth.user.companyName || '');
  const [buyerLocation, setBuyerLocation] = useState('');
  const [requestQuantity, setRequestQuantity] = useState('');
  const [requestPrice, setRequestPrice] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState('');

  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    if (auth.user.companyName) {
      setBuyerCompanyName(auth.user.companyName);
    }
  }, [auth.user.companyName]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [matchesError, setMatchesError] = useState('');
  const [selectedMatchItem, setSelectedMatchItem] = useState<Listing | Request | null>(null);

  const handleFindMatches = async (item: Listing | Request) => {
    try {
      setMatchesLoading(true);
      setMatchesError('');
      setSelectedMatchItem(item);

      const itemType = activeTab === 'supply' ? 'listing' : 'request';

      const result = await apiGet<any[]>(
        `/matches?type=${itemType}&id=${item.id}`,
        auth.token
      );

      setMatches(result);
      onFindMatches?.(item);
    } catch (err) {
      console.error(err);
      setMatchesError('Failed to load matches');
      setMatches([]);
    } finally {
      setMatchesLoading(false);
    }
  };

  async function loadMarketplaceData() {
    try {
      setLoading(true);
      setError('');

      const [apiListings, apiRequests] = await Promise.all([
        apiGet<ApiListing[]>('/listings'),
        apiGet<ApiRequest[]>('/requests'),
      ]);

      const mappedListings = mapListings(apiListings);
      setListings(mappedListings);
      setRequests(mapRequests(apiRequests));
      if (mappedListings.length === 0) {
        setSelectedListingId('new');
      }
    } catch (err) {
      console.error('Failed to load marketplace data:', err);
      setError('Failed to load marketplace data');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateListing(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSubmitLoading(true);
      setSubmitError('');

      await apiPost(
        '/listings',
        {
          companyId: auth.user.companyId || null,
          companyName,
          material,
          grade,
          purity,
          quantity: Number(quantity),
          unit,
          frequency,
          description,
          compliance,
          location,
        },
        auth.token
      );

      const apiListings = await apiGet<ApiListing[]>('/listings', auth.token);
      setListings(mapListings(apiListings));

      setMaterial('');
      setGrade('');
      setPurity('');
      setQuantity('');
      setUnit('tons');
      setFrequency('One-time');
      setDescription('');
      setCompliance('Verified internal handling');
      setLocation('');
      setCompanyName('');
      setActiveTab('supply');
    } catch (err) {
      console.error(err);
      setSubmitError('Failed to create listing');
    } finally {
      setSubmitLoading(false);
    }
  }

  async function handleCreateRequest(e: React.FormEvent) {
    e.preventDefault();

    try {
      setRequestLoading(true);
      setRequestError('');

      if (!auth.user.companyId) {
        setRequestError('Your account is not linked to a company');
        return;
      }

      if (!selectedListingId) {
        setRequestError('Select an existing supply listing or choose New item option');
        return;
      }

      if (selectedListingId === 'new' && (!newRequestMaterial.trim() || !newRequestUnit.trim())) {
        setRequestError('Please provide material and unit for a new demand item');
        return;
      }

      await apiPost(
        '/requests',
        {
            listingId: selectedListingId !== 'new' ? selectedListingId : null,
            buyerId: auth.user.companyId,
            buyerCompanyName,
            location: buyerLocation,
            material: selectedListingId === 'new' ? newRequestMaterial : undefined,
            unit: selectedListingId === 'new' ? newRequestUnit : undefined,
            quantity: Number(requestQuantity),
            price: Number(requestPrice),
          },
        auth.token
      );

      const apiRequests = await apiGet<ApiRequest[]>('/requests', auth.token);
      setRequests(mapRequests(apiRequests));

      setSelectedListingId('');
      setNewRequestMaterial('');
      setNewRequestUnit('tons');
      setBuyerCompanyName(auth.user.companyName || '');
      setBuyerLocation('');
      setRequestQuantity('');
      setRequestPrice('');
      setActiveTab('demand');
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setRequestError(err.message);
      } else {
        setRequestError('Failed to create request');
      }
    } finally {
      setRequestLoading(false);
    }
  }

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  return (
    <section id="marketplace" className="section-rafid bg-gray-50">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Marketplace Preview</h2>
          <p className="text-lg text-gray-600">
            Browse available materials and demand requests from industrial partners across Saudi Arabia.
          </p>
        </div>

        {loading && (
          <div className="text-center text-gray-600 mb-8">Loading marketplace data...</div>
        )}

        {error && (
          <div className="text-center text-red-600 mb-8">{error}</div>
        )}

        {auth.user.role === 'SUPPLIER' && (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6 mb-10">
            <h3 className="text-2xl font-bold mb-4">Create New Listing</h3>

            <form onSubmit={handleCreateListing} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Material"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3"
                required
              />

              <input
                type="text"
                placeholder="Grade / Category"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3"
              />

              <input
                type="text"
                placeholder="Purity (e.g. 95%)"
                value={purity}
                onChange={(e) => setPurity(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3"
              />

              <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3"
                required
              />

              <input
                type="text"
                placeholder="Unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3"
                required
              />

              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3"
              >
                <option value="One-time">One-time</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Recurring">Recurring</option>
              </select>

              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3"
                required
              />

              <input
                type="text"
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3"
                required
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 md:col-span-2"
                rows={4}
                required
              />

              <input
                type="text"
                placeholder="Compliance / Documentation"
                value={compliance}
                onChange={(e) => setCompliance(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 md:col-span-2"
              />

              {submitError && (
                <div className="text-red-600 text-sm md:col-span-2">{submitError}</div>
              )}

              <button
                type="submit"
                disabled={submitLoading}
                className="md:col-span-2 bg-gradient-to-r from-[#0f5a7a] to-[#1fa876] text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {submitLoading ? 'Creating...' : 'Create Listing'}
              </button>
            </form>
          </div>
        )}

        {auth.user.role === 'BUYER' && (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6 mb-10">
            <h3 className="text-2xl font-bold mb-4">Create Demand Request</h3>

            <form onSubmit={handleCreateRequest} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={selectedListingId}
                onChange={(e) => setSelectedListingId(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 md:col-span-2"
                required
              >
                <option value="">Select a supply listing</option>
                {listings.length > 0 ? (
                  listings.map((listing) => (
                    <option key={listing.id} value={listing.id}>
                      {listing.materialType} - {listing.quantity} {listing.unit} - {listing.companyName}
                    </option>
                  ))
                ) : (
                  <option value="disabled" disabled>No supply listings available</option>
                )}
                <option value="new">New demand item (create custom request)</option>
              </select>

              <input
                type="text"
                placeholder="Buyer Company Name"
                value={buyerCompanyName}
                onChange={(e) => setBuyerCompanyName(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 md:col-span-2"
                required
              />

              {selectedListingId === 'new' && (
                <>
                  <input
                    type="text"
                    placeholder="Demand Material"
                    value={newRequestMaterial}
                    onChange={(e) => setNewRequestMaterial(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-3 md:col-span-2"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Demand Unit"
                    value={newRequestUnit}
                    onChange={(e) => setNewRequestUnit(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-3 md:col-span-2"
                    required
                  />
                </>
              )}

                      <input
                type="text"
                placeholder="Location"
                value={buyerLocation}
                onChange={(e) => setBuyerLocation(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 md:col-span-2"
                required
              />

              <input
                type="number"
                placeholder="Requested Quantity"
                value={requestQuantity}
                onChange={(e) => setRequestQuantity(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3"
                required
              />

              <input
                type="number"
                placeholder="Offered Price (SAR)"
                value={requestPrice}
                onChange={(e) => setRequestPrice(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3"
                required
              />

              {requestError && (
                <div className="text-red-600 text-sm md:col-span-2">{requestError}</div>
              )}

              <button
                type="submit"
                disabled={requestLoading}
                className="md:col-span-2 bg-gradient-to-r from-[#0f5a7a] to-[#1fa876] text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {requestLoading ? 'Submitting...' : 'Create Request'}
              </button>
            </form>
          </div>
        )}

        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('supply')}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'supply'
                ? 'border-[#0f5a7a] text-[#0f5a7a]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Supply Listings ({listings.length})
          </button>
          <button
            onClick={() => setActiveTab('demand')}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'demand'
                ? 'border-[#0f5a7a] text-[#0f5a7a]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Demand Requests ({requests.length})
          </button>
        </div>

        {(matchesLoading || matchesError || matches.length > 0) && (
          <div className="mb-10 bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-2xl font-bold mb-2">Smart Matching Results</h3>
<p className="text-sm text-gray-600 mb-4">
  Matches are ranked based on material fit, quantity compatibility, location proximity, and counterparty trust.
</p>

            {selectedMatchItem && (
              <p className="text-sm text-gray-600 mb-4">
                Showing matches for:{' '}
                <span className="font-semibold">
                  {'materialType' in selectedMatchItem
                    ? selectedMatchItem.materialType
                    : 'Selected item'}
                </span>
              </p>
            )}

            {matchesLoading && (
              <div className="text-gray-600">Loading matches...</div>
            )}

            {matchesError && (
              <div className="text-red-600">{matchesError}</div>
            )}

            {!matchesLoading && !matchesError && matches.length === 0 && selectedMatchItem && (
              <div className="text-gray-600">No matches found.</div>
            )}

            {!matchesLoading && matches.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matches.map((match) => (
                  <div
                    key={match.id}
                    className="border border-gray-200 rounded-xl p-4 bg-gray-50"
                  >
                                        <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg">
                        {match.data?.listing?.material || match.data?.material || 'Match'}
                      </h4>
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-[#0f5a7a] text-sm font-bold">
                        {match.score}% Match
                      </span>
                    </div>

                    <div className="text-sm text-gray-700 mb-4 space-y-1">
                      {match.matchType === 'request' ? (
                        <>
                          <p><span className="font-medium">Buyer:</span> {match.data?.buyer?.name || 'Unknown Company'}</p>
                          <p><span className="font-medium">Quantity:</span> {match.data?.quantity} {match.data?.listing?.unit || ''}</p>
                          <p><span className="font-medium">Offer:</span> SAR {match.data?.price}</p>
                          <p><span className="font-medium">City:</span> {match.data?.buyer?.city || 'Unknown'}</p>
                        </>
                      ) : (
                        <>
                          <p><span className="font-medium">Supplier:</span> {match.data?.company?.name || 'Unknown Company'}</p>
                          <p><span className="font-medium">Quantity:</span> {match.data?.quantity} {match.data?.unit}</p>
                          <p><span className="font-medium">Location:</span> {match.data?.location}</p>
                          <p><span className="font-medium">City:</span> {match.data?.company?.city || 'Unknown'}</p>
                        </>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="rounded-lg bg-gray-100 p-3">
                        <p className="text-xs text-gray-500">Fit</p>
                        <p className="font-semibold">{match.breakdown?.fit || 0}/50</p>
                      </div>
                      <div className="rounded-lg bg-gray-100 p-3">
                        <p className="text-xs text-gray-500">Quantity</p>
                        <p className="font-semibold">{match.breakdown?.quantity || 0}/25</p>
                      </div>
                      <div className="rounded-lg bg-gray-100 p-3">
                        <p className="text-xs text-gray-500">Distance</p>
                        <p className="font-semibold">{match.breakdown?.distance || 0}/15</p>
                      </div>
                      <div className="rounded-lg bg-gray-100 p-3">
                        <p className="text-xs text-gray-500">Trust</p>
                        <p className="font-semibold">{match.breakdown?.trust || 0}/10</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        Why this match works
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {match.reasons.map((reason: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#1fa876] mt-0.5">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'supply' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="card-rafid hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="mb-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{listing.materialType}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <span className="font-medium">
                      {listing.quantity} {listing.unit}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span>{listing.frequency}</span>
                  </div>
                  <p className="text-sm text-[#0f5a7a] font-medium mb-3">
                    {listing.location}, {listing.region}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>{listing.companyName}</span>
                    <span>{listing.postedDate}</span>
                  </div>
                </div>

                <div className="mb-4 flex-grow">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Specifications:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {listing.specs.map((spec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#1fa876] mt-0.5">•</span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-800">{listing.compliance}</p>
                </div>

                <button
                  onClick={() => handleFindMatches(listing)}
                  className="w-full bg-gradient-to-r from-[#0f5a7a] to-[#1fa876] text-white font-semibold py-2 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Find Matches
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'demand' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request) => (
              <div
                key={request.id}
                className="card-rafid hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="mb-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{request.materialType}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <span className="font-medium">
                      {request.quantity} {request.unit}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span>{request.frequency}</span>
                  </div>
                  <p className="text-sm text-[#0f5a7a] font-medium mb-3">
                    {request.location}, {request.region}
                  </p>
                  <div className="text-xs text-gray-500 mb-2">
                    Buyer: {request.companyName}
                  </div>
                </div>

                <div className="mb-4 flex-grow">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Requirements:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {request.specs.map((spec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#1fa876] mt-0.5">•</span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-xs font-semibold text-green-800 mb-1">Budget</p>
                  <p className="text-xs text-green-800">{request.budget}</p>
                </div>

                <button
                  onClick={() => handleFindMatches(request)}
                  className="w-full bg-gradient-to-r from-[#0f5a7a] to-[#1fa876] text-white font-semibold py-2 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Find Matches
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}