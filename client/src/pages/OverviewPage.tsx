import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Search,
  Home,
  Users,
  MapPin,
  TrendingUp,
  Star,
  Play,
  ChevronDown,
  Building,
  Shield,
  Zap,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/user/userSlice";

const Overview = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector(selectCurrentUser);
  const [scrollY, setScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const heroRef = useRef<HTMLDivElement>(null);
  const estateRef = useRef<HTMLSpanElement>(null);
  const xRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parallax effects
  const parallaxOffset = scrollY * 0.5;
  const titleScale = Math.max(0.5, 1 - scrollY * 0.001);
  const titleOpacity = Math.max(0, 1 - scrollY * 0.003);

  // Color transition effect for text
  const getTextColor = (scrollProgress: number) => {
    if (scrollProgress < 0.3) {
      return { estate: "text-gray-600", x: "text-amber-500" };
    } else if (scrollProgress < 0.6) {
      return { estate: "text-orange-500", x: "text-gray-600" };
    } else {
      return { estate: "text-orange-600", x: "text-gray-400" };
    }
  };

  const scrollProgress = Math.min(scrollY / 1000, 1);
  const textColors = getTextColor(scrollProgress);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?location=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const stats = [
    {
      icon: Home,
      label: "Properties Listed",
      value: "10,000+",
      color: "text-blue-500",
    },
    {
      icon: Users,
      label: "Happy Clients",
      value: "5,000+",
      color: "text-green-500",
    },
    {
      icon: MapPin,
      label: "Cities Covered",
      value: "50+",
      color: "text-purple-500",
    },
    {
      icon: TrendingUp,
      label: "Properties Sold",
      value: "2,500+",
      color: "text-orange-500",
    },
  ];

  const features = [
    {
      icon: Search,
      title: "Smart Search",
      description:
        "Find your perfect property with our AI-powered search engine",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "Your investments are protected with bank-level security",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Zap,
      title: "Instant Notifications",
      description:
        "Get notified immediately when properties match your criteria",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: Building,
      title: "Premium Listings",
      description: "Access to exclusive properties from top developers",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  const testimonials = [
    {
      name: "Teja Nadella",
      role: "Property Investor",
      image:
        "https://ui-avatars.com/api/?name=Priya+Sharma&background=f97316&color=fff",
      text: "EstateX helped me find my dream home in Mumbai. The process was seamless and transparent.",
      rating: 5,
    },
    {
      name: "Pavan Vanapalli",
      role: "First-time Buyer",
      image:
        "https://ui-avatars.com/api/?name=Rajesh+Kumar&background=3b82f6&color=fff",
      text: "Amazing platform! Found the perfect apartment within my budget. Highly recommended!",
      rating: 5,
    },
    {
      name: "Srikanth Tadinada",
      role: "Real Estate Agent",
      image:
        "https://ui-avatars.com/api/?name=Anita+Patel&background=10b981&color=fff",
      text: "As an agent, EstateX has revolutionized how I connect with potential buyers.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-main overflow-x-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section with Parallax */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
        style={{
          transform: `translateY(${parallaxOffset}px)`,
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-20 left-10 w-72 h-72 bg-orange-200 dark:bg-yellow-600/20 rounded-full opacity-20 animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          />
          <div
            className="absolute bottom-32 right-16 w-96 h-96 bg-amber-200 dark:bg-green-900 rounded-full opacity-15 animate-pulse delay-1000"
            style={{ transform: `translateY(${scrollY * -0.2}px)` }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-200 dark:bg-green-900 rounded-full opacity-10 animate-pulse delay-500"
            style={{
              transform: `translate(-50%, -50%) translateY(${scrollY * 0.1}px)`,
            }}
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          {/* Main Title with Color Transition */}
          <div
            className="mb-8"
            style={{
              transform: `scale(${titleScale})`,
              opacity: titleOpacity,
            }}
          >
            <h1
              className="font-extrabold text-6xl sm:text-7xl md:text-8xl lg:text-9xl flex items-center justify-center"
              style={{ fontFamily: "Xtradex" }}
            >
              <span
                ref={estateRef}
                className={`transition-colors duration-1000 ${textColors.estate}`}
              >
                Estate
              </span>
              <span
                ref={xRef}
                className={`ml-2 transition-colors duration-1000 ${textColors.x}`}
              >
                X
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover your perfect property with India's most trusted real estate
            platform
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <form
              onSubmit={handleSearch}
              className="relative group hero-search"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-orange-200 dark:border-gray-700">
                <div className="flex items-center p-2">
                  <Search className="w-6 h-6 text-gray-400 ml-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by location, property type, or price..."
                    className="flex-1 px-4 py-4 bg-transparent text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none text-lg border-none"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </form>
          </div>
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {currentUser ? (
              <>
                <Link
                  to="/home"
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Home className="w-5 h-5" />
                  <span>Browse Properties</span>
                </Link>
                <Link
                  to="/create-listing"
                  className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-2 border-orange-500 hover:bg-orange-50 dark:hover:bg-gray-700 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>List Property</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/sign-up"
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/home"
                  className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-2 border-orange-500 hover:bg-orange-50 dark:hover:bg-gray-700 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>Browse Properties</span>
                  <Play className="w-5 h-5" />
                </Link>
              </>
            )}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-15 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-gray-900 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Our numbers speak for themselves
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group hover:transform hover:scale-110 transition-all duration-300"
                style={{
                  transform: `translateY(${
                    Math.sin((scrollY + index * 100) * 0.01) * 10
                  }px)`,
                }}
              >
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-amber-500 transition-all duration-300`}
                >
                  <stat.icon
                    className={`w-8 h-8 ${stat.color} group-hover:text-white transition-colors duration-300`}
                  />
                </div>
                <div className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Why Choose EstateX?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're revolutionizing the real estate experience with cutting-edge
              technology and unmatched service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative"
                style={{
                  transform: `translateY(${
                    Math.sin((scrollY + index * 200) * 0.005) * 15
                  }px)`,
                }}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur"
                  style={{
                    background: `linear-gradient(135deg, ${feature.gradient})`,
                  }}
                />
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group-hover:border-transparent">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3
                    className="text-xl font-semibold text-gray-800 dark:text-white mb-3 group-hover:bg-gradient-to-r group-hover:bg-clip-text"
                    style={{
                      background: `linear-gradient(135deg, ${feature.gradient})`,
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Elements */}
        <div
          className="absolute top-20 right-10 w-32 h-32 bg-orange-200 dark:bg-orange-900/20 rounded-full opacity-20"
          style={{
            transform: `translateY(${scrollY * 0.1}px) rotate(${
              scrollY * 0.1
            }deg)`,
          }}
        />
        <div
          className="absolute bottom-20 left-16 w-24 h-24 bg-amber-200 dark:bg-amber-900/20 rounded-full opacity-20"
          style={{
            transform: `translateY(${scrollY * -0.15}px) rotate(${
              scrollY * -0.1
            }deg)`,
          }}
        />
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Real stories from real people
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group relative"
                style={{
                  transform: `translateY(${
                    Math.sin((scrollY + index * 300) * 0.008) * 20
                  }px)`,
                }}
              >
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-orange-200 dark:border-gray-600 group-hover:border-orange-300 dark:group-hover:border-orange-500">
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-amber-500 relative overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute top-0 left-0 w-full h-full opacity-10"
            style={{
              background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              transform: `translateY(${scrollY * 0.2}px)`,
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect
            property with EstateX
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {currentUser ? (
              <Link
                to="/home"
                className="bg-white text-orange-500 hover:bg-orange-50 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Home className="w-5 h-5" />
                <span>Start Browsing</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/sign-up"
                  className="bg-white text-orange-500 hover:bg-orange-50 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>Sign Up Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/sign-in"
                  className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-orange-500 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Sign In</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Overview;
