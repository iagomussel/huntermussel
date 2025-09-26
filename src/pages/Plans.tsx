
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Smartphone, Brain, Cog, Calculator, FileText } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import type { LucideIcon } from 'lucide-react';

type CategoryId = 'platforms' | 'mobile' | 'automation' | 'ai';

interface BaseProduct {
  name: string;
  description: string;
  features: string[];
  category: string;
}

interface SubscriptionProduct extends BaseProduct {
  monthlyPrice: number;
  yearlyPrice: number;
  setup?: number;
  popular?: boolean;
}

interface ProjectProduct extends BaseProduct {
  price: string;
  timeline?: string;
}

type Product = SubscriptionProduct | ProjectProduct;

interface Category {
  id: CategoryId;
  name: string;
  icon: LucideIcon;
  products: Product[];
}

const isSubscriptionProduct = (product: Product): product is SubscriptionProduct =>
  'monthlyPrice' in product && 'yearlyPrice' in product;

const Plans = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('platforms');

  const platformProducts: SubscriptionProduct[] = [
    {
      name: 'OdontoMaster Pro',
      description: 'Complete dental practice management',
      monthlyPrice: 299,
      yearlyPrice: 2990,
      setup: 2500,
      features: [
        'Patient management system',
        'Appointment scheduling',
        'Electronic dental charts',
        'Billing & insurance',
        'Treatment planning',
        'Reporting & analytics',
        'Multi-location support',
        'API integrations'
      ],
      popular: true,
      category: 'Healthcare'
    },
    {
      name: 'VetMaster Platform',
      description: 'Veterinary clinic management system',
      monthlyPrice: 249,
      yearlyPrice: 2490,
      setup: 2000,
      features: [
        'Pet medical records',
        'Vaccination tracking',
        'Inventory management',
        'Appointment scheduling',
        'Billing system',
        'Client communication',
        'Prescription management',
        'Health reminders'
      ],
      category: 'Healthcare'
    },
    {
      name: 'EduMaster LMS',
      description: 'Educational management platform',
      monthlyPrice: 199,
      yearlyPrice: 1990,
      setup: 1500,
      features: [
        'Student information system',
        'Course management',
        'Grade tracking',
        'Parent portal',
        'Teacher dashboard',
        'Assignment submission',
        'Communication tools',
        'Progress reporting'
      ],
      category: 'Education'
    }
  ];

  const mobileApps: ProjectProduct[] = [
    {
      name: 'Android App Development',
      description: 'Native Android applications',
      price: 'From $8,000',
      timeline: '3-4 months',
      features: [
        'Native Android development',
        'Material Design UI',
        'Google Play Store optimization',
        'Push notifications',
        'Offline functionality',
        'Payment integration',
        'Analytics tracking',
        'Backend API development'
      ],
      category: 'Mobile'
    },
    {
      name: 'iOS App Development',
      description: 'Native iOS applications',
      price: 'From $9,000',
      timeline: '3-4 months',
      features: [
        'Native iOS development',
        'Human Interface Guidelines',
        'App Store optimization',
        'Push notifications',
        'Core Data integration',
        'Apple Pay integration',
        'TestFlight deployment',
        'Backend API development'
      ],
      category: 'Mobile'
    },
    {
      name: 'Cross-Platform App',
      description: 'React Native or Flutter apps',
      price: 'From $12,000',
      timeline: '4-5 months',
      features: [
        'Single codebase for both platforms',
        'Native performance',
        'Platform-specific UI',
        'Code sharing up to 80%',
        'Hot reload development',
        'Third-party integrations',
        'Both app stores deployment',
        'Maintenance included (3 months)'
      ],
      category: 'Mobile'
    }
  ];

  const automationServices: ProjectProduct[] = [
    {
      name: 'Business Process Automation',
      description: 'Streamline your workflows',
      price: 'From $5,000',
      timeline: '2-3 months',
      features: [
        'Workflow analysis & optimization',
        'Custom automation scripts',
        'Data synchronization',
        'Report generation',
        'Email automation',
        'CRM integration',
        'Performance monitoring',
        'Training & documentation'
      ],
      category: 'Automation'
    },
    {
      name: 'E-commerce Automation',
      description: 'Automate your online store',
      price: 'From $3,500',
      timeline: '1-2 months',
      features: [
        'Inventory management automation',
        'Order processing workflows',
        'Customer communication',
        'Price monitoring',
        'Social media posting',
        'Review management',
        'Analytics automation',
        'Multi-platform sync'
      ],
      category: 'Automation'
    },
    {
      name: 'Marketing Automation Suite',
      description: 'Automated marketing campaigns',
      price: 'From $4,000',
      timeline: '2-3 months',
      features: [
        'Lead nurturing workflows',
        'Email campaign automation',
        'Social media scheduling',
        'Customer segmentation',
        'A/B testing automation',
        'Performance tracking',
        'Integration with CRM',
        'ROI reporting'
      ],
      category: 'Automation'
    }
  ];

  const aiServices: ProjectProduct[] = [
    {
      name: 'AI Chatbot Development',
      description: 'Intelligent customer service bots',
      price: 'From $7,500',
      timeline: '2-3 months',
      features: [
        'Natural language processing',
        'Multi-platform deployment',
        'Learning capabilities',
        'Integration with existing systems',
        'Analytics dashboard',
        '24/7 customer support',
        'Multilingual support',
        'Continuous improvement'
      ],
      category: 'AI'
    },
    {
      name: 'Predictive Analytics Platform',
      description: 'AI-powered business insights',
      price: 'From $12,000',
      timeline: '3-4 months',
      features: [
        'Custom ML models',
        'Real-time predictions',
        'Data visualization',
        'Historical analysis',
        'Trend forecasting',
        'Risk assessment',
        'Performance optimization',
        'API access'
      ],
      category: 'AI'
    },
    {
      name: 'Computer Vision Solution',
      description: 'Image and video analysis AI',
      price: 'From $15,000',
      timeline: '4-5 months',
      features: [
        'Object detection & recognition',
        'Image classification',
        'Quality control automation',
        'Real-time processing',
        'Custom model training',
        'Edge deployment',
        'Performance monitoring',
        'Integration support'
      ],
      category: 'AI'
    }
  ];

  const categories: Category[] = [
    { id: 'platforms', name: 'SaaS Platforms', icon: Cog, products: platformProducts },
    { id: 'mobile', name: 'Mobile Apps', icon: Smartphone, products: mobileApps },
    { id: 'automation', name: 'Automation', icon: Zap, products: automationServices },
    { id: 'ai', name: 'AI Solutions', icon: Brain, products: aiServices }
  ];

  const selectedProducts: Product[] = categories.find(cat => cat.id === selectedCategory)?.products || [];

  return (
    <>
      <Helmet>
        <title>Pricing & Products - Hunter Mussel</title>
        <meta name="description" content="Explore our comprehensive pricing for SaaS platforms, mobile apps, automation services, and AI solutions. Custom development packages for every business need." />
        <meta name="keywords" content="pricing, software development, mobile apps, AI solutions, automation, SaaS platforms" />
      </Helmet>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Choose Your Perfect Solution
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                From ready-to-deploy platforms to custom AI solutions. 
                Transparent pricing, professional quality, guaranteed results.
              </p>
              <div className="flex justify-center items-center gap-4 mb-8">
                <span className="text-blue-200">Monthly</span>
                <button
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    billingCycle === 'yearly' ? 'bg-green-500' : 'bg-blue-400'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-blue-200">Yearly</span>
                {billingCycle === 'yearly' && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Save 20%
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Category Navigation */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-3">
              {selectedProducts.map((product, index) => (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden relative ${
                    isSubscriptionProduct(product) && product.popular ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  {isSubscriptionProduct(product) && product.popular && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                      <Star className="inline h-4 w-4 mr-1" />
                      Popular
                    </div>
                  )}
                  
                  <div className="p-8">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-600">{product.description}</p>
                      {product.category && (
                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mt-2">
                          {product.category}
                        </span>
                      )}
                    </div>

                    <div className="mb-6">
                      {isSubscriptionProduct(product) ? (
                        <>
                          <div className="text-4xl font-bold text-gray-900 mb-2">
                            ${billingCycle === 'monthly' ? product.monthlyPrice : Math.round(product.yearlyPrice / 12)}
                            <span className="text-lg text-gray-600 font-normal">/month</span>
                          </div>
                          {product.setup && (
                            <p className="text-gray-600">Setup fee: ${product.setup.toLocaleString()}</p>
                          )}
                          {billingCycle === 'yearly' && (
                            <p className="text-green-600 text-sm">
                              Billed yearly: ${product.yearlyPrice.toLocaleString()}
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="text-3xl font-bold text-gray-900 mb-2">{product.price}</div>
                          {product.timeline && (
                            <p className="text-gray-600">Timeline: {product.timeline}</p>
                          )}
                        </>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8">
                      {product.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="ml-3 text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                        isSubscriptionProduct(product) && product.popular
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {isSubscriptionProduct(product) ? 'Start Free Trial' : 'Get Quote'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Custom Development CTA */}
        <section className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Need Something Custom?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Don't see exactly what you need? We specialize in custom development solutions 
              tailored to your specific business requirements.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-white/10 px-4 py-2 rounded-lg">Enterprise Software</div>
              <div className="bg-white/10 px-4 py-2 rounded-lg">API Development</div>
              <div className="bg-white/10 px-4 py-2 rounded-lg">System Integration</div>
              <div className="bg-white/10 px-4 py-2 rounded-lg">Legacy Modernization</div>
            </div>
            <a
              href="/contact"
              className="inline-block bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Discuss Your Project
            </a>
          </div>
        </section>

        {/* Free Tools Promotion */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Try Our Free Tools First</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get a taste of our quality with professional-grade tools, completely free. 
              No registration required.
            </p>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <Calculator className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Cost Calculator</h3>
                <p className="text-sm text-gray-600">Estimate your project costs</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">API Docs Generator</h3>
                <p className="text-sm text-gray-600">Create professional documentation</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <Star className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Color Palette Tool</h3>
                <p className="text-sm text-gray-600">Generate brand colors</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <Zap className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Project Templates</h3>
                <p className="text-sm text-gray-600">Download requirement docs</p>
              </div>
            </div>
            <a
              href="/free-tools"
              className="inline-block bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Access Free Tools
            </a>
          </div>
        </section>
      </main>
    </>
  );
};

export default Plans;
