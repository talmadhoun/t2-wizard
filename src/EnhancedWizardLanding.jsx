import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, CheckCircle, AlertTriangle, ExternalLink, FileText, Shield, 
  HelpCircle, Info, X, Zap, ArrowRight, ChevronLeft, RefreshCw
} from 'lucide-react';

// Import the actual T2Wizard component
import T2Wizard from './t2-wizard-v3-full.js';

const EnhancedWizardLanding = () => {
  const [showWizard, setShowWizard] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set active section based on scroll position
  useEffect(() => {
    const handleSectionDetection = () => {
      const sections = ['features', 'how-it-works', 'compatibility'];
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
      
      // If at the top, set to home
      if (window.scrollY < 100) {
        setActiveSection('home');
      }
    };
    
    window.addEventListener('scroll', handleSectionDetection);
    return () => window.removeEventListener('scroll', handleSectionDetection);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/40">
      {/* Enhanced Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <Shield className="text-blue-600 h-8 w-8" />
              <span className="font-bold text-blue-900 text-xl">T2Wizard</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" onClick={() => setActiveSection('features')} className={`text-sm font-medium transition ${activeSection === 'features' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>Features</a>
              <a href="#how-it-works" onClick={() => setActiveSection('how-it-works')} className={`text-sm font-medium transition ${activeSection === 'how-it-works' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>How It Works</a>
              <a href="#compatibility" onClick={() => setActiveSection('compatibility')} className={`text-sm font-medium transition ${activeSection === 'compatibility' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>Compatibility</a>
            </div>
            
            <div>
              <button 
                onClick={() => setShowWizard(true)}
                className={`px-5 py-2.5 rounded-lg font-medium text-sm flex items-center transition ${
                  scrolled 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Start Filing
                <ChevronRight size={16} className="ml-1.5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {showWizard ? (
        // Wizard Integration Section
        <div className="min-h-screen bg-white pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">T2 & T5 Filing Wizard</h1>
                <p className="mt-2 text-gray-600">Complete your corporate tax filing with this step-by-step guide</p>
              </div>
              <button 
                onClick={() => setShowWizard(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center hover:bg-gray-200 transition"
              >
                <ChevronLeft size={16} className="mr-1.5" />
                Back to Overview
              </button>
            </div>
            
            {/* Integrate the actual T2Wizard component */}
            <T2Wizard />
          </div>
        </div>
      ) : (
        // Landing Page Content
        <>
          {/* Vibrant Hero Section */}
          <div className="relative pt-24 pb-20 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 z-0">
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-purple-300/30 rounded-full filter blur-3xl"></div>
              <div className="absolute top-20 right-20 w-24 h-24 bg-yellow-300/30 rounded-full filter blur-xl"></div>
              <div className="absolute -bottom-40 -left-10 w-80 h-80 bg-blue-300/30 rounded-full filter blur-3xl"></div>
              <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-green-300/20 rounded-full filter blur-xl"></div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
                <div className="lg:col-span-3">
                  <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 mb-4">
                    <Zap size={16} className="mr-1.5 text-blue-600" /> Designed for Canadian Small Businesses
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
                    Simplify your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">corporate tax filing</span> in minutes
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    A beautiful, step-by-step wizard for small Canadian business owners to prepare T2 Corporate Tax Returns and T5 Slips without the complexity.
                  </p>
                  <div className="mt-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
                    <button 
                      onClick={() => setShowWizard(true)}
                      className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium flex items-center justify-center hover:from-blue-700 hover:to-indigo-700 transition shadow-md hover:shadow-lg"
                    >
                      Start Filing Now
                      <ChevronRight size={20} className="ml-2" />
                    </button>
                    <a 
                      href="#how-it-works"
                      className="w-full sm:w-auto px-6 py-3.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium flex items-center justify-center hover:bg-gray-50 transition shadow-sm"
                    >
                      How It Works
                    </a>
                  </div>
                  <div className="mt-8 grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-100">
                      <div className="text-blue-600 font-bold text-xl">5 min</div>
                      <div className="text-gray-600 text-sm">Average Setup</div>
                    </div>
                    <div className="flex flex-col items-center px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-100">
                      <div className="text-blue-600 font-bold text-xl">100%</div>
                      <div className="text-gray-600 text-sm">CRA Compliant</div>
                    </div>
                    <div className="flex flex-col items-center px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-100">
                      <div className="text-blue-600 font-bold text-xl">$0</div>
                      <div className="text-gray-600 text-sm">No Subscription</div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-2 relative">
                  <div className="aspect-[4/3] bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl border border-blue-100/50 shadow-xl overflow-hidden backdrop-blur-sm">
                    <div className="p-6">
                      {/* Preview of the wizard form fields */}
                      <div className="flex items-center text-lg font-semibold text-gray-800 mb-5">
                        <FileText size={20} className="text-blue-600 mr-2" />
                        Corporation Information
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Business Number (BN)</label>
                          <input 
                            type="text" 
                            className="w-full p-3 bg-white border border-gray-300 rounded-lg"
                            placeholder="123456789RC0001"
                            disabled
                          />
                          <p className="text-xs text-gray-500">Format: 9 digits + RC + 4 digits</p>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Corporation Name</label>
                          <input 
                            type="text" 
                            className="w-full p-3 bg-white border border-gray-300 rounded-lg"
                            placeholder="Your Corporation Inc."
                            disabled
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Tax Year</label>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Start Date</div>
                              <input 
                                type="date" 
                                className="w-full p-2 bg-white border border-gray-300 rounded-lg"
                                disabled
                              />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">End Date</div>
                              <input 
                                type="date" 
                                className="w-full p-2 bg-white border border-gray-300 rounded-lg"
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute top-5 -right-10 sm:right-5 p-3 bg-white rounded-lg shadow-lg border border-blue-100 transform rotate-3 flex items-center">
                    <Zap size={18} className="text-amber-500 mr-2" />
                    <span className="text-sm font-medium">T2 & T5 Support</span>
                  </div>
                  <div className="absolute -bottom-6 left-12 p-3 bg-white rounded-lg shadow-lg border border-green-100 transform -rotate-3 flex items-center">
                    <CheckCircle size={18} className="text-green-500 mr-2" />
                    <span className="text-sm font-medium">CRA Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section with Gradients */}
          <div id="features" className="py-16 relative">
            <div className="absolute inset-0 z-0">
              <div className="absolute top-40 left-20 w-96 h-96 bg-blue-100/50 rounded-full filter blur-3xl opacity-50"></div>
              <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-100/30 rounded-full filter blur-3xl opacity-70"></div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Built for Simple Canadian Corporations</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our wizard streamlines tax preparation so you can spend less time on paperwork and more time growing your business.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {[
                  {
                    title: "Complete T2 Support",
                    description: "Covers all key sections including identification, income, deductions, and tax calculations.",
                    icon: <FileText size={24} className="text-white" />,
                    color: "from-blue-500 to-blue-600"
                  },
                  {
                    title: "T5 Slip Generation",
                    description: "Automatically creates T5 slips with proper calculations for dividend tax credits.",
                    icon: <FileText size={24} className="text-white" />,
                    color: "from-purple-500 to-purple-600"
                  },
                  {
                    title: "CRA Compliant",
                    description: "Follows all CRA requirements with built-in validation and tax credit formulas.",
                    icon: <Shield size={24} className="text-white" />,
                    color: "from-green-500 to-green-600"
                  },
                  {
                    title: "Auto-Save Technology",
                    description: "Never lose your work with automatic local saving to your browser.",
                    icon: <RefreshCw size={24} className="text-white" />,
                    color: "from-amber-500 to-amber-600"
                  },
                  {
                    title: "Step-by-Step Guidance",
                    description: "Clear explanations for every field with helpful tooltips and validations.",
                    icon: <HelpCircle size={24} className="text-white" />,
                    color: "from-rose-500 to-rose-600"
                  },
                  {
                    title: "FutureTax Integration",
                    description: "Designed to work seamlessly with FutureTax for final filing.",
                    icon: <ExternalLink size={24} className="text-white" />,
                    color: "from-indigo-500 to-indigo-600"
                  }
                ].map((feature, index) => (
                  <div key={index} className="group relative">
                    <div className="absolute inset-0 bg-white rounded-xl shadow-lg transform transition-all duration-300 group-hover:scale-[0.98]"></div>
                    <div className="relative p-8 rounded-xl overflow-hidden">
                      <div className={`w-12 h-12 mb-6 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-md`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 md:p-10 mb-12 border border-blue-100 shadow-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full text-white flex-shrink-0">
                    <CheckCircle size={36} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Perfect For Simple Corporate Structures</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                      {[
                        'Canadian-Controlled Private Corporations',
                        'Single shareholder companies',
                        'Corporations with dividend distributions',
                        'No employees or payroll',
                        'No foreign assets or income',
                        'No investment income',
                        'No subsidiaries',
                        'Not part of any partnerships',
                        'No intercompany relationships'
                      ].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 mr-2" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div id="how-it-works" className="py-16 bg-gradient-to-b from-white to-blue-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 mb-4">
                  <ArrowRight size={16} className="mr-1.5 text-blue-600" /> Simple Process
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  A streamlined approach to corporate tax filing without the usual complexity
                </p>
              </div>
              
              <div className="relative">
                {/* Progress line */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-indigo-300 -translate-x-1/2"></div>
                
                <div className="space-y-16 relative">
                  {[
                    {
                      title: "Enter Corporate Information",
                      description: "Start with basic information about your corporation including business number, legal name, address, and tax year dates.",
                      icon: <FileText size={24} className="text-white" />,
                      color: "from-blue-500 to-blue-600"
                    },
                    {
                      title: "Add Financial Details",
                      description: "Enter revenue, expenses, and dividends. The wizard automatically calculates all necessary amounts including dividend tax credits.",
                      icon: <FileText size={24} className="text-white" />,
                      color: "from-green-500 to-green-600"
                    },
                    {
                      title: "Generate T5 Slips",
                      description: "If you've paid dividends, the wizard will guide you through creating compliant T5 slips with all required information.",
                      icon: <FileText size={24} className="text-white" />,
                      color: "from-purple-500 to-purple-600"
                    },
                    {
                      title: "Review & Complete",
                      description: "Review all information, verify calculations, and use the summary to enter data into FutureTax for final filing.",
                      icon: <CheckCircle size={24} className="text-white" />,
                      color: "from-indigo-500 to-indigo-600"
                    }
                  ].map((step, index) => (
                    <div key={index} className="relative flex flex-col md:flex-row gap-8 items-center">
                      <div className="md:w-5/12 md:text-right order-2 md:order-1">
                        {index % 2 === 0 ? (
                          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:ml-auto md:mr-8 transform transition-transform duration-300 hover:scale-105">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                            <p className="text-gray-600">{step.description}</p>
                          </div>
                        ) : <div className="hidden md:block" />}
                      </div>
                      
                      <div className="relative md:absolute md:left-1/2 md:-translate-x-1/2 z-10 order-1 md:order-2">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-md`}>
                          {step.icon}
                        </div>
                        <div className="absolute top-0 left-0 w-16 h-16 rounded-full bg-gradient-to-br from-white/40 to-transparent animate-pulse"></div>
                      </div>
                      
                      <div className="md:w-5/12 order-3">
                        {index % 2 === 1 ? (
                          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:ml-8 transform transition-transform duration-300 hover:scale-105">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                            <p className="text-gray-600">{step.description}</p>
                          </div>
                        ) : <div className="hidden md:block" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Compatibility Section */}
          <div id="compatibility" className="py-16 bg-white relative">
            <div className="absolute inset-0 z-0">
              <div className="absolute -bottom-10 -right-20 w-96 h-96 bg-blue-100/30 rounded-full filter blur-3xl"></div>
              <div className="absolute top-40 -left-20 w-80 h-80 bg-purple-100/20 rounded-full filter blur-3xl"></div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Using with FutureTax</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  This wizard works seamlessly with your existing tax software
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 overflow-hidden border border-indigo-100/50 shadow-xl relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-bl-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-tr-2xl"></div>
                
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="md:w-1/2">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Integration Steps</h3>
                      <p className="text-gray-700 mb-6">
                        This wizard helps you prepare all the information needed for your corporate tax filing. 
                        Here's how to use it with FutureTax:
                      </p>
                      
                      <ul className="space-y-4">
                        {[
                          "Complete all wizard sections for accurate calculations",
                          "Use the summary view to see field mappings to T2 form lines",
                          "Manually enter data into FutureTax following the same structure",
                          "Verify all entries in FutureTax before submitting to CRA",
                          "Reference the T5 slip preview when entering dividend information"
                        ].map((item, index) => (
                          <li key={index} className="flex items-start">
                            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                              {index + 1}
                            </div>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="md:w-1/2">
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
                        <div className="space-y-4 mb-6">
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <div className="flex items-start">
                              <Info size={20} className="text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                              <div>
                                <h4 className="font-medium text-blue-900 mb-1">Data Privacy</h4>
                                <p className="text-sm text-blue-800">
                                  All information is stored locally in your browser. No data is sent to any servers.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                            <div className="flex items-start">
                              <AlertTriangle size={20} className="text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                              <div>
                                <h4 className="font-medium text-amber-900 mb-1">Not a Filing Tool</h4>
                                <p className="text-sm text-amber-800">
                                  This wizard does not submit forms to CRA. It's a preparation assistant only.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-center">
                          <button 
                            onClick={() => setShowWizard(true)}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium flex items-center transition shadow-md"
                          >
                            Start Using Now
                            <ChevronRight size={20} className="ml-2" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer Section */}
          <div className="py-12 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ4MCIgaGVpZ2h0PSI2NTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+ICAgIDxwYXRoIGQ9Ik03MzEuMjA3IDY0OS44MDJDOTM1LjQ4NCA2NDkuODAyIDExMDIuNjMgNTY1LjkyNiAxMTAyLjYzIDQ0NC4xNzFDMTEwMi42MyAzMjIuNDE3IDkzNS40ODQgMjM4LjU0MSA3MzEuMjA3IDIzOC41NDFDNTI2LjkzIDIzOC41NDEgMzU5Ljc4NCAzMjIuNDE3IDM1OS43ODQgNDQ0LjE3MUMzNTkuNzg0IDU2NS45MjYgNTI2LjkzIDY0OS44MDIgNzMxLjIwNyA2NDkuODAyWiIgZmlsbD0iIzMzMzc0RCIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+ICAgIDxwYXRoIGQ9Ik0xMDk3LjQyIDIzOC41NDFDMTMwMS43IDIzOC41NDEgMTQ2OC44NSAxNTQuNjY1IDE0NjguODUgMzIuOTEwN0MxNDY4Ljg1IC04OC44NDM4IDEzMDEuNyAtMTcyLjcyIDEwOTcuNDIgLTE3Mi43MkM4OTMuMTQ1IC0xNzIuNzIgNzI2IC04OC44NDM4IDcyNiAzMi45MTA3QzcyNiAxNTQuNjY1IDg5My4xNDUgMjM4LjU0MSAxMDk3LjQyIDIzOC41NDFaIiBmaWxsPSIjMzMzNzREIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4gICAgPHBhdGggZD0iTTM2NC44NTUgMjM4LjU0MUM1NjkuMTMyIDIzOC41NDEgNzM2LjI3NyAxNTQuNjY1IDczNi4yNzcgMzIuOTEwN0M3MzYuMjc3IC04OC44NDM4IDU2OS4xMzIgLTE3Mi43MiAzNjQuODU1IC0xNzIuNzJDMTYwLjU3OCAtMTcyLjcyIC02LjU2NzM4IC04OC44NDM4IC02LjU2NzM4IDMyLjkxMDdDLTYuNTY3MzggMTU0LjY2NSAxNjAuNTc4IDIzOC41NDEgMzY0Ljg1NSAyMzguNTQxWiIgZmlsbD0iIzMzMzc0RCIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')]"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="col-span-2">
                  <h2 className="text-2xl font-semibold mb-6">Important Disclaimers</h2>
                  <div className="space-y-4 text-gray-300">
                    <p className="flex items-start">
                      <AlertTriangle size={20} className="text-amber-400 mr-3 mt-1 flex-shrink-0" />
                      <span>This tool is a companion for tax preparation only. All data must be verified before submission to CRA.</span>
                    </p>
                    <p className="flex items-start">
                      <AlertTriangle size={20} className="text-amber-400 mr-3 mt-1 flex-shrink-0" />
                      <span>While we strive for accuracy, tax rules and regulations change frequently. Always consult with a qualified tax professional.</span>
                    </p>
                    <p className="flex items-start">
                      <AlertTriangle size={20} className="text-amber-400 mr-3 mt-1 flex-shrink-0" />
                      <span>This wizard will not file your taxes. You must enter the data into FutureTax or your preferred tax software for actual filing.</span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Get Started</h2>
                  <p className="text-gray-300 mb-8">
                    Ready to simplify your corporate tax preparation? Start using our T2/T5 Wizard today.
                  </p>
                  <button 
                    onClick={() => setShowWizard(true)}
                    className="px-6 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium w-full flex items-center justify-center transition shadow-lg"
                  >
                    Begin Tax Preparation
                    <ChevronRight size={20} className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <footer className="py-6 bg-gray-800 text-gray-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <p className="text-sm">
                  T2/T5 Wizard - A companion tool for simple corporate tax preparation. © {new Date().getFullYear()} All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default EnhancedWizardLanding;