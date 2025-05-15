import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, Users, PieChart, Settings, Shield, Cloud, Code2, FileText, Wallet, Building, Baby, Clock, TrendingUp, ShieldCheck, Heart, ClipboardList, UserPlus, ArrowRight } from 'lucide-react';

// Imagens reais do produto
const mockupImage = '/assets/images/odontomaster/dashboard.jpg';
const featureImage1 = '/assets/images/odontomaster/electronic-records.jpg';
const featureImage2 = '/assets/images/odontomaster/smart-scheduling.jpg';

const OdontoMaster = () => {
  const features = [
    {
      icon: Users,
      title: 'Patient Management',
      description: 'Complete registration with medical and dental history, allergies, medications, and emergency contacts.'
    },
    {
      icon: Calendar,
      title: 'Smart Online Scheduling',
      description: 'Clear view of schedules, easy appointment booking, and automatic reminders via SMS or WhatsApp.'
    },
    {
      icon: FileText,
      title: 'Electronic Dental Records',
      description: 'Digital clinical evolution, interactive dental chart, procedure recording, and treatment history.'
    },
    {
      icon: Wallet,
      title: 'Financial Management',
      description: 'Account control, cash flow, payment recording, and simple receipt issuance.'
    },
    {
      icon: Settings,
      title: 'Procedure Management',
      description: 'Registration with values, association with insurance plans, and treatment plans with approval control.'
    },
    {
      icon: PieChart,
      title: 'Management Reports',
      description: 'Reports on appointments, billing by period/procedure, and cash flow.'
    },
  ];

  const specialFeatures = [
    'Multi-tenant architecture with secure data isolation',
    'Automatic centralized updates',
    'Intuitive and responsive interface for any device',
    'Scalability to grow with your clinic',
    'Security and compliance with data protection regulations',
    'Specialized technical support'
  ];
  
  const plans = [
    {
      name: 'Office',
      description: 'Ideal for independent practitioners and small offices',
      price: '$89',
      period: '/month',
      highlighted: false,
      features: [
        'Patient Management',
        'Smart Online Scheduling',
        'Basic Electronic Records',
        'Basic Financial Module',
        'Up to 2 Users',
        'Email Support'
      ]
    },
    {
      name: 'Essential Clinic',
      description: 'For medium-sized clinics',
      price: '$250',
      period: '/month',
      highlighted: true,
      features: [
        'All Office Plan features',
        'Complete Financial Management',
        'Procedure/Insurance Control',
        'Basic Reports',
        'Up to 7 Users',
        'Email and Phone Support'
      ]
    },
    {
      name: 'Premium Clinic',
      description: 'For large clinics',
      price: '$500',
      period: '/month',
      highlighted: false,
      features: [
        'All Essential Clinic Plan features',
        'Advanced Management Reports',
        'Custom Specific Functionalities',
        'Unlimited Users',
        'Priority Support',
        'Team Training'
      ]
    }
  ];

  return (
    <div className="bg-white">
      <Helmet>
        <title>OdontoMaster | White-Label Dental Practice Management Solution</title>
        <meta 
          name="description" 
          content="OdontoMaster offers a comprehensive white-label dental management platform for software providers and dental groups seeking a customizable solution."
        />
        <meta name="keywords" content="white-label dental software, dental practice management, electronic dental records, customizable dental platform, dental software resellers" />
        <link rel="canonical" href="https://odontomaster.vercel.app" />
        
        {/* Open Graph / Social Media Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="OdontoMaster | White-Label Dental Management Platform" />
        <meta property="og:description" content="Powerful white-label dental practice management software you can rebrand, customize and scale to your clients' needs." />
        <meta property="og:image" content="https://odontomaster.vercel.app/images/odontomaster-social.jpg" />
        <meta property="og:url" content="https://odontomaster.vercel.app" />
        
        {/* Structured Data for Rich Results */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "OdontoMaster",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "89.00",
              "priceCurrency": "USD"
            },
            "description": "White-label dental practice management software for providers and resellers."
          })}
        </script>
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-blue-500 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">
                Launch Your Own Branded Dental Software With Our White-Label Solution
              </h1>
              <p className="text-xl text-indigo-100 mb-8">
                Provide your clients with a state-of-the-art dental management system under your own brand. Our white-label platform offers complete customization, seamless integration, and enterprise-grade scalability.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#request-demo"
                  className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
                >
                  Partner With Us
                </a>
                <a
                  href="#plans"
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
                >
                  Reseller Plans
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="rounded-lg shadow-2xl overflow-hidden"
            >
              <img 
                src={mockupImage} 
                alt="OdontoMaster Dashboard" 
                className="w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Complete Features for Your Clinic
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to manage your practice in a single integrated platform.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <feature.icon className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Product Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Transform Your Dental Practice Management
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                OdontoMaster delivers tangible benefits that improve clinical outcomes, operational efficiency, and patient satisfaction.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">
            {/* Left column */}
            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-16 w-16 rounded-md bg-indigo-600 text-white">
                    <Clock className="h-8 w-8" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900">40% Time Savings on Administrative Tasks</h3>
                  <p className="mt-2 text-gray-600">
                    Automated appointment scheduling, digital record-keeping, and intelligent workflows reduce admin time by 40%, allowing staff to focus on patient care instead of paperwork.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-16 w-16 rounded-md bg-indigo-600 text-white">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900">27% Increase in Revenue</h3>
                  <p className="mt-2 text-gray-600">
                    Improved scheduling efficiency, reduced no-shows, and better financial tracking help practices increase their revenue by an average of 27% within the first year.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-16 w-16 rounded-md bg-indigo-600 text-white">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900">99.9% Data Security Compliance</h3>
                  <p className="mt-2 text-gray-600">
                    Enterprise-grade security protocols, HIPAA compliance features, and automated backups ensure patient data remains protected with 99.9% uptime and reliability.
                  </p>
                </div>
              </motion.div>
            </div>
            
            {/* Right column */}
            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-16 w-16 rounded-md bg-indigo-600 text-white">
                    <Heart className="h-8 w-8" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900">92% Patient Satisfaction Rate</h3>
                  <p className="mt-2 text-gray-600">
                    Digital appointment reminders, online booking options, and streamlined check-in processes result in a 92% patient satisfaction rate and increased loyalty.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-16 w-16 rounded-md bg-indigo-600 text-white">
                    <ClipboardList className="h-8 w-8" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900">35% Reduction in Treatment Planning Time</h3>
                  <p className="mt-2 text-gray-600">
                    Interactive dental charts, treatment plan templates, and digital imaging integration reduce treatment planning time by 35%, letting dentists treat more patients.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-16 w-16 rounded-md bg-indigo-600 text-white">
                    <UserPlus className="h-8 w-8" />
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900">60% Less Training Time</h3>
                  <p className="mt-2 text-gray-600">
                    Intuitive user interface and guided workflows require 60% less staff training time compared to legacy systems, with most users proficient within just 2 days.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 text-center"
          >
            <a
              href="#request-demo"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              See OdontoMaster in Action <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </motion.div>
        </div>
      </section>
      
      {/* Pediatric Dentistry Section */}
      <section className="py-20 bg-gray-50" id="pediatric-dentistry">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full mb-4">
                <Baby className="h-5 w-5 mr-2" />
                <span className="font-medium">Specialized in Pediatric Dentistry</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Solution for Pediatric Dental Clinics
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                OdontoMaster was developed with specific features for pediatric care, making your pediatric dental clinic management more efficient.
              </p>
              
              <ul className="space-y-4">
                <motion.li
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="flex items-start"
                >
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Tracking of each child's history</span>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex items-start"
                >
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Specific dental chart for primary and mixed dentition</span>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex items-start"
                >
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Parent management and family history</span>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start"
                >
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Special control for preventive programs</span>
                </motion.li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white p-6 rounded-lg shadow-xl"
            >
              <div className="rounded-lg overflow-hidden mb-6">
                <img
                  src={featureImage1}
                  alt="Pediatric Electronic Records"
                  className="w-full h-auto"
                />
              </div>
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center mb-4">
                  <Code2 className="h-5 w-5 text-indigo-600 mr-2" />
                  <h3 className="text-lg font-semibold">User-Friendly Interface</h3>
                </div>
                <p className="text-gray-600">
                  Intuitive design that makes information recording and tracking of young patients easier.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Multi-Clinic Management Section */}
      <section className="py-20" id="technology">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img
                  src={featureImage2}
                  alt="Multi-Clinic Dashboard"
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-4">
                <Building className="h-5 w-5 mr-2" />
                <span className="font-medium">Unified Clinic Management</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Manage Multiple Clinics with One Account
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                OdontoMaster allows dental groups to seamlessly manage multiple locations from a single user account, providing centralized control while maintaining separate clinic data.
              </p>
              
              <ul className="space-y-4">
                <motion.li
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="flex items-start"
                >
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Switch between different clinic locations with one click</span>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex items-start"
                >
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Unified patient database with location-specific records</span>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex items-start"
                >
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Consolidated reporting across all locations</span>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start"
                >
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Customizable permissions by location and role</span>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="flex items-start"
                >
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Transfer patients between locations with complete history</span>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="flex items-start"
                >
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Cross-location staff scheduling and resource management</span>
                </motion.li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-20 bg-gray-50" id="plans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Plans Tailored to Your Business
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose the ideal plan for your clinic's size and only pay for what you actually use.
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white rounded-lg shadow-lg overflow-hidden border ${
                  plan.highlighted ? 'border-2 border-indigo-500 transform scale-105 z-10' : 'border-gray-200'
                }`}
              >
                {plan.highlighted && (
                  <div className="bg-indigo-500 text-white text-center py-2">
                    <span className="font-semibold">Most Popular</span>
                  </div>
                )}
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <p key={featureIndex} className="text-gray-700 flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </p>
                  ))}
                </div>
                <div className="p-6">
                  <a
                    href="#request-demo"
                    className="block w-full text-center bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Get Started Now
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Demo Request Section */}
      <section className="py-20" id="request-demo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-lg overflow-hidden"
            >
              <img 
                src={featureImage2} 
                alt="OdontoMaster Demo" 
                className="w-full h-auto"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Try OdontoMaster
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Request a free demonstration and discover how OdontoMaster can transform your dental clinic management.
              </p>
              
              <form className="space-y-4">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-sm font-semibold leading-6 text-gray-900">
                    Name
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Your full name"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
                    Email
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="phone" className="block text-sm font-semibold leading-6 text-gray-900">
                    Phone
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="company" className="block text-sm font-semibold leading-6 text-gray-900">
                    Clinic Name
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      id="company"
                      name="company"
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Your clinic or company name"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
                    Message
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="What are the main challenges you face in managing your clinic?"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Request Demo
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-6">
              Ready to transform your clinic management?
            </h2>
            <p className="text-xl mb-8 text-indigo-100">
              Join hundreds of dental clinics already using OdontoMaster and experience all the benefits of efficient management.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#plans"
                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                View Plans
              </a>
              <a
                href="#request-demo"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
              >
                Schedule Demo
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default OdontoMaster; 