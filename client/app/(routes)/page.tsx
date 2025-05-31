import Header from "../_components/header";
import Footer from "../_components/footer";
import ButtonDisplayWhenNotLoggedIn from "../_components/client/buttonDisplayWhenNotLoggedIn";

export default function Home() {
  return (
    <>
      <Header />
      <div className="hero mt-24">
        <div className="hero-content text-center">
          <div className="max-w-xl">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Smart Home Automation on Your Terms
            </h1>
            <p className="py-6 text-lg">
              Transform your living space with ControlX's smart device rental platform. 
              Get premium automation devices like smart bulbs, ACs, and more without the hefty upfront costs. 
              One platform to rent and control all your smart devices.
            </p>
            <ButtonDisplayWhenNotLoggedIn />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose ControlX?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-full w-full text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="card-title">Smart Device Rentals</h3>
                <p>
                  Access premium automation devices without buying. Rent smart bulbs,
                  ACs, and more at affordable monthly rates.
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-full w-full text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                    />
                  </svg>
                </div>
                <h3 className="card-title">Energy Monitoring</h3>
                <p>
                  Track and optimize your energy usage in real-time with smart analytics.
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-full w-full text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <h3 className="card-title">Smart Automation</h3>
                <p>
                  Automate your devices for optimal energy efficiency and comfort.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <div className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="stat bg-base-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="stat-value text-4xl font-bold text-primary">250K</div>
                <div className="stat-title text-xl font-semibold">Energy Saved</div>
                <div className="stat-desc text-base-content/70">kWh This Year</div>
              </div>
            </div>

            <div className="stat bg-base-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="stat-value text-4xl font-bold text-primary">2,500+</div>
                <div className="stat-title text-xl font-semibold">Smart Homes</div>
                <div className="stat-desc text-base-content/70">Active Users</div>
              </div>
            </div>

            <div className="stat bg-base-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="stat-value text-4xl font-bold text-primary">$500K</div>
                <div className="stat-title text-xl font-semibold">Cost Savings</div>
                <div className="stat-desc text-base-content/70">For Our Users</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
