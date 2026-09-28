import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, Search, PhoneCall, ShieldCheck, MapPin, ArrowRight, Star, ChevronRight } from 'lucide-react';

const VEHICLE_CATEGORIES = [
  { type: 'car', name: 'Car', emoji: '🚗', desc: 'Hatchback, Sedan & SUVs' },
  { type: 'auto', name: 'Auto', emoji: '🛺', desc: 'Auto Rickshaws for city trips' },
  { type: 'tata_ace', name: 'Tata Ace', emoji: '🚚', desc: 'Mini goods trucks' },
  { type: 'van', name: 'Van', emoji: '🚐', desc: 'Passenger & goods vans' },
  { type: 'mini_truck', name: 'Mini Truck', emoji: '🚛', desc: 'Commercial heavy loads' },
  { type: 'pickup_truck', name: 'Pickup Truck', emoji: '🛻', desc: 'Bolero & pickup trucks' },
  { type: 'goods_auto', name: 'Goods Auto', emoji: '🚐', desc: '3-Wheeler cargo autos' },
];

const LandingPage = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryType) => {
    navigate(`/search?type=${categoryType}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background Overlay Graphic */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              🇮🇳 India's Direct Vehicle Marketplace
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Find the Right Vehicle <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">
                For Your Journey
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
              Cars, Autos, Tata Ace and more — connect directly with vehicle owners across India with zero middleman fees.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/search"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 active:scale-95 transition-all rounded-2xl shadow-xl shadow-emerald-400/20"
              >
                <Search className="w-5 h-5" />
                <span>Find a Vehicle</span>
              </Link>
              <Link
                to="/driver/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 active:scale-95 transition-all rounded-2xl"
              >
                <Truck className="w-5 h-5 text-emerald-400" />
                <span>Register Your Vehicle</span>
              </Link>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative bg-slate-800/60 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl">
                    🚚
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Tata Ace Gold CNG</h3>
                    <p className="text-xs text-slate-400">Available in Mangalagiri & nearby</p>
                  </div>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                  🟢 Available
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                  <span className="text-slate-400 block">Driver</span>
                  <strong className="text-white text-sm">Raja Sekhar</strong> ⭐ 4.9
                </div>
                <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                  <span className="text-slate-400 block">Vehicle No.</span>
                  <strong className="text-emerald-300 text-sm font-mono">AP 16 TE 4521</strong>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/search"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <span>Explore All Available Drivers</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Vehicles Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Popular Vehicles</h2>
          <p className="text-slate-600 mt-2 text-base">
            Select your preferred vehicle type to instantly locate verified drivers across India.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {VEHICLE_CATEGORIES.map((cat) => (
            <button
              key={cat.type}
              onClick={() => handleCategoryClick(cat.type)}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md hover:shadow-xl hover:border-emerald-300 transition-all text-left flex flex-col justify-between group cursor-pointer"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">
                {cat.emoji}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">{cat.desc}</p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                <span>View Drivers</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-100 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">How It Works</h2>
            <p className="text-slate-600 mt-2 text-base">
              Book any vehicle in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg mb-4">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Choose your vehicle</h3>
              <p className="text-sm text-slate-600">
                Select from Cars, Autos, Tata Ace, Vans, Mini Trucks, Pickup Trucks, or Goods Autos.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg mb-4">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Select pickup & destination</h3>
              <p className="text-sm text-slate-600">
                Use interactive Google Maps or location search to pinpoint your exact journey.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg mb-4">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Find available drivers</h3>
              <p className="text-sm text-slate-600">
                Browse real-time available drivers with ratings, photos, and vehicle specs.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg mb-4">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Call or request booking</h3>
              <p className="text-sm text-slate-600">
                Connect directly via phone dialer or send an instant booking request.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Owners Promo Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-r from-emerald-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center lg:text-left max-w-xl">
            <span className="bg-emerald-500/30 text-emerald-200 text-xs font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full border border-emerald-400/30">
              For Drivers & Vehicle Owners
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Have a vehicle? <br />
              Connect with customers.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Register your vehicle for free, list multiple vehicles, get direct customer phone calls, and expand your business nationwide across India.
            </p>
          </div>

          <div className="flex-shrink-0 w-full sm:w-auto">
            <Link
              to="/driver/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-base rounded-2xl shadow-xl transition-all"
            >
              <span>Register Your Vehicle</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 text-center text-xs text-slate-500 mt-auto">
        <p>© 2026 Local Vehicle Connect India. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
