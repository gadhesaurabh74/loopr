import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, TrendingUp, Shield, Download } from 'lucide-react';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BarChart3,
      title: 'Interactive Dashboard',
      description: 'Visualize your financial data with beautiful charts and real-time analytics.'
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Get deep insights into your spending patterns and financial trends.'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Your financial data is protected with enterprise-grade security.'
    },
    {
      icon: Download,
      title: 'Export Data',
      description: 'Download your transaction data in CSV format for external analysis.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1605902711622-cfb43c4437d1?auto=format&fit=crop&w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 py-4">
          <nav className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-8 h-8 text-indigo-500" />
              <span className="text-2xl font-bold text-white">FinanceX</span>
            </div>
            <div className="space-x-4">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="primary" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </div>
          </nav>
        </header>

        {/* Hero */}
        <main className="px-6 py-20">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Shape Your 
              <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent"> Financial Future</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Experience next-gen analytics and insightful dashboards to gain full control over your finances.
            </p>
            <div className="space-x-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/signup')}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="text-lg px-8 py-4"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/login')}
                className="text-lg px-8 py-4"
              >
                Learn More
              </Button>
            </div>
          </div>
        </main>

        {/* Features */}
        <section className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Powerful Tools at Your Fingertips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-indigo-800/40 backdrop-blur-sm border border-indigo-700 rounded-xl p-6 hover:bg-indigo-800/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                >
                  <div className="bg-indigo-600/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600/40 transition-colors">
                    <feature.icon className="w-6 h-6 text-indigo-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-indigo-100">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Upgrade Your Financial Game?
            </h2>
            <p className="text-indigo-100 mb-8 text-lg">
              Join a community that's redefining how we track, manage, and plan finances.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/signup')}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="text-lg px-10 py-4"
            >
              Start Your Journey
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
