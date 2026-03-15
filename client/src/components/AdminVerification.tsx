import { useEffect, useState } from 'react';
import { apiGet, apiPatch } from '../lib/api';

interface AuthData {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    companyId?: string | null;
  };
}

type Company = {
  id: string;
  name: string;
  industry: string;
  city: string;
  verified: boolean;
  createdAt?: string;
};

type Listing = {
  id: string;
  companyId?: string | null;
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
  verified: boolean;
  createdAt: string;
  company?: Company | null;
};

interface AdminVerificationProps {
  auth: AuthData;
}

export default function AdminVerification({ auth }: AdminVerificationProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'companies' | 'listings'>('listings');

  async function loadData() {
    try {
      setLoading(true);
      setError('');
      const [companiesData, listingsData] = await Promise.all([
        apiGet<Company[]>('/companies', auth.token),
        apiGet<Listing[]>('/listings', auth.token),
      ]);
      setCompanies(companiesData);
      setListings(listingsData);
    } catch (err) {
      console.error(err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleCompanyVerification(companyId: string, verified: boolean) {
    try {
      await apiPatch(`/companies/${companyId}/verify`, { verified }, auth.token);
      await loadData();
    } catch (err) {
      console.error(err);
      setError('Failed to update company verification');
    }
  }

  async function handleToggleListingVerification(listingId: string, verified: boolean) {
    try {
      await apiPatch(`/listings/${listingId}/verify`, { verified }, auth.token);
      await loadData();
    } catch (err) {
      console.error(err);
      setError('Failed to update listing verification');
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (auth.user.role !== 'ADMIN') {
    return null;
  }

  return (
    <section className="section-rafid bg-gray-50">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Verification Management</h2>
          <p className="text-lg text-gray-600">
            Review participating organizations and listings to manage trust status across the platform.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setActiveTab('listings')}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                activeTab === 'listings'
                  ? 'bg-[#0f5a7a] text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Listings ({listings.filter(l => !l.verified).length} pending)
            </button>
            <button
              onClick={() => setActiveTab('companies')}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                activeTab === 'companies'
                  ? 'bg-[#0f5a7a] text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Companies ({companies.filter(c => !c.verified).length} pending)
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center text-gray-600">Loading...</div>
        )}

        {error && (
          <div className="text-center text-red-600 mb-6">{error}</div>
        )}

        {!loading && activeTab === 'companies' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {companies.map((company) => (
              <div
                key={company.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex items-start justify-between mb-4 gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{company.name}</h3>
                    <p className="text-sm text-gray-600">{company.industry}</p>
                    <p className="text-sm text-[#0f5a7a] mt-1">{company.city}</p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      company.verified
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {company.verified ? 'Verified' : 'Pending'}
                  </span>
                </div>

                <div className="flex gap-3">
                  {!company.verified ? (
                    <button
                      onClick={() => handleToggleCompanyVerification(company.id, true)}
                      className="flex-1 bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition-all duration-300"
                    >
                      Verify
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleCompanyVerification(company.id, false)}
                      className="flex-1 bg-gray-600 text-white font-semibold py-2 rounded-lg hover:bg-gray-700 transition-all duration-300"
                    >
                      Remove Verification
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && activeTab === 'listings' && (
          <div className="grid grid-cols-1 gap-6">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex items-start justify-between mb-4 gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{listing.material}</h3>
                    <p className="text-sm text-gray-600">{listing.companyName}</p>
                    <p className="text-sm text-[#0f5a7a] mt-1">
                      {listing.quantity} {listing.unit} • {listing.location}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{listing.description}</p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      listing.verified
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {listing.verified ? 'Verified' : 'Pending'}
                  </span>
                </div>

                <div className="flex gap-3">
                  {!listing.verified ? (
                    <button
                      onClick={() => handleToggleListingVerification(listing.id, true)}
                      className="flex-1 bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition-all duration-300"
                    >
                      Verify Listing
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleListingVerification(listing.id, false)}
                      className="flex-1 bg-gray-600 text-white font-semibold py-2 rounded-lg hover:bg-gray-700 transition-all duration-300"
                    >
                      Remove Verification
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}