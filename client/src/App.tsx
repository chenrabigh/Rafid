import { useState } from "react";
import Login from "./components/Login";

/* Public prototype components */
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WhyRafid from "./components/WhyRafid";
import About from "./components/About";
import Services from "./components/Services";
import HowItWorks from "./components/HowItWorks";
import Features from "./components/Features";
import MatchingEngine from "./components/MatchingEngine";
import DemoUseCase from "./components/DemoUseCase";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";

/* Working platform components */
import Marketplace from "./components/Marketplace";
import ImpactDashboard from "./components/ImpactDashboard";
import AdminVerification from "./components/AdminVerification";
import SummaryBar from "./components/SummaryBar";

type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    companyId?: string | null;
    companyName?: string | null;
  };
};

type AppView = "marketplace" | "impact" | "verification";

export default function App() {
  const [auth, setAuth] = useState<LoginResponse | null>(() => {
    const token = localStorage.getItem("rafid_token");
    const user = localStorage.getItem("rafid_user");

    if (token && user) {
      return {
        token,
        user: JSON.parse(user),
      };
    }

    return null;
  });

  const [showLogin, setShowLogin] = useState(false);
  const [activeView, setActiveView] = useState<AppView>("marketplace");
  const [homeSection, setHomeSection] = useState<'home'|'about'|'services'|'howItWorks'|'features'|'impact'|'marketplace'|'matching'|'contact'|'demo'>("home");
  const [matchingMaterial, setMatchingMaterial] = useState<string>('');

  const sectionTitles: Record<string, string> = {
    home: "Home",
    about: "About RAFID",
    services: "Our Services",
    howItWorks: "How It Works",
    features: "Features",
    impact: "Impact Dashboard",
    marketplace: "Marketplace",
    matching: "Matching Engine",
    demo: "Demo Use Case",
    contact: "Contact",
  };

  const currentSectionTitle = sectionTitles[homeSection] || "RAFID";

  function handleLogout() {
    localStorage.removeItem("rafid_token");
    localStorage.removeItem("rafid_user");
    setAuth(null);
    setActiveView("marketplace");
    setShowLogin(false);
  }

  if (!auth && showLogin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-between items-center px-6 py-4 border-b bg-white">
          <div>
            <h1 className="text-2xl font-bold text-[#0f5a7a]">RAFID</h1>
            <p className="text-sm text-gray-600">
              Waste-to-resource transaction platform
            </p>
          </div>

          <button
            onClick={() => setShowLogin(false)}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 text-sm font-semibold hover:bg-gray-300 transition-all duration-300"
          >
            Back to Website
          </button>
        </div>

        <Login
          onLoginSuccess={(data) => {
            setAuth(data);
            setShowLogin(false);
          }}
        />
      </div>
    );
  }

  if (!auth) {
    return (
      <div className="min-h-screen bg-white">
        <div className="fixed top-4 right-4 z-[60]">
          <button
            onClick={() => setShowLogin(true)}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#0f5a7a] to-[#1fa876] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Enter Platform
          </button>
        </div>

                <Navbar
          activeSection={homeSection}
          onSectionChange={(section) => setHomeSection(section as any)}
          onDemoClick={() => setHomeSection("demo")}
        />

        <div className="container mx-auto px-4 py-4">
          <h2 className="text-2xl font-bold text-[#0f5a7a] mb-4">{currentSectionTitle}</h2>
        </div>

        {homeSection === "home" && (
          <Hero
            onViewDemo={() => setHomeSection("demo")}
            onExplorePlatform={() => setShowLogin(true)}
          />
        )}
        {homeSection === "about" && <About />}
        {homeSection === "services" && (
          <Services
            onRunMatching={(material) => {
              setMatchingMaterial(material || '');
              setHomeSection('matching');
            }}
          />
        )}
        {homeSection === "howItWorks" && <HowItWorks />}
        {homeSection === "features" && <Features onOpenMatchEngine={() => setHomeSection("marketplace")} />}
        {homeSection === "impact" && <ImpactDashboard auth={{ token: "", user: { id: "", email: "", role: "GUEST", companyId: null } }} />}
        {homeSection === "marketplace" && <Marketplace auth={{ token: "", user: { id: "", email: "", role: "GUEST", companyId: null } }} />}
        {homeSection === "matching" && <MatchingEngine token="" initialMaterial={matchingMaterial} />}
        {homeSection === "demo" && <DemoUseCase />}
        {homeSection === "contact" && <ContactForm />}
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0f5a7a]">RAFID Platform</h1>
            <p className="text-sm text-gray-600">
              {auth.user.role} • {auth.user.email}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveView("marketplace")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeView === "marketplace"
                  ? "bg-[#0f5a7a] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Marketplace
            </button>

            <button
              onClick={() => setActiveView("impact")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeView === "impact"
                  ? "bg-[#0f5a7a] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Impact
            </button>

            {auth.user.role === "ADMIN" && (
              <button
                onClick={() => setActiveView("verification")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeView === "verification"
                    ? "bg-[#0f5a7a] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Verification
              </button>
            )}

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <SummaryBar auth={auth} />

      <main>
        {activeView === "marketplace" && <Marketplace auth={auth} />}
        {activeView === "impact" && <ImpactDashboard auth={auth} />}
        {activeView === "verification" && auth.user.role === "ADMIN" && (
          <AdminVerification auth={auth} />
        )}
      </main>
    </div>
  );
}