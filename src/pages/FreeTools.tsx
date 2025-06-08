
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Calculator, Code, Palette, FileText, Smartphone, Zap, Brain, Download } from 'lucide-react';

const FreeTools = () => {
  const [activeTab, setActiveTab] = useState('calculator');

  const tools = [
    {
      id: 'calculator',
      name: 'Startup Cost Calculator',
      icon: Calculator,
      description: 'Calculate your startup development costs',
      component: <StartupCalculator />
    },
    {
      id: 'generator',
      name: 'API Documentation Generator',
      icon: Code,
      description: 'Generate professional API docs instantly',
      component: <APIDocGenerator />
    },
    {
      id: 'palette',
      name: 'Brand Color Palette Generator',
      icon: Palette,
      description: 'Create beautiful color schemes for your brand',
      component: <ColorPaletteGenerator />
    },
    {
      id: 'requirements',
      name: 'Project Requirements Template',
      icon: FileText,
      description: 'Download professional project requirement templates',
      component: <RequirementsTemplate />
    }
  ];

  return (
    <>
      <Helmet>
        <title>Free Developer Tools - Hunter Mussel</title>
        <meta name="description" content="Free tools for startups and developers. Calculate development costs, generate API docs, create color palettes, and download project templates." />
        <meta name="keywords" content="free tools, startup calculator, API generator, color palette, project templates, developer tools" />
      </Helmet>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Free Tools for Startups
              </h1>
              <p className="text-xl text-green-100 mb-8">
                Professional-grade tools to help you plan, design, and develop your next project. 
                Completely free, no registration required.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="bg-white/20 px-4 py-2 rounded-full">✨ No Signup Required</div>
                <div className="bg-white/20 px-4 py-2 rounded-full">🚀 Instant Results</div>
                <div className="bg-white/20 px-4 py-2 rounded-full">💼 Professional Quality</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Tools Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Tool Navigation */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTab(tool.id)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all ${
                      activeTab === tool.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="hidden sm:inline">{tool.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Tool */}
            <div className="max-w-4xl mx-auto">
              {tools.find(tool => tool.id === activeTab)?.component}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Need Custom Development?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              These tools gave you a taste of what we can build. Let's discuss your custom project requirements.
            </p>
            <a
              href="/contact"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Custom Quote
            </a>
          </div>
        </section>
      </main>
    </>
  );
};

// Startup Cost Calculator Component
const StartupCalculator = () => {
  const [formData, setFormData] = useState({
    projectType: 'web',
    complexity: 'medium',
    features: [],
    timeline: '3-6'
  });
  const [estimate, setEstimate] = useState(null);

  const projectTypes = {
    web: { base: 8000, name: 'Web Application' },
    mobile: { base: 12000, name: 'Mobile App' },
    enterprise: { base: 25000, name: 'Enterprise Solution' },
    ecommerce: { base: 15000, name: 'E-commerce Platform' }
  };

  const complexityMultipliers = {
    simple: 0.7,
    medium: 1.0,
    complex: 1.5,
    enterprise: 2.0
  };

  const featuresCosts = {
    auth: 2000,
    payments: 3000,
    api: 2500,
    dashboard: 3500,
    chat: 4000,
    ai: 8000,
    automation: 5000
  };

  const calculateEstimate = () => {
    const basePrice = projectTypes[formData.projectType].base;
    const complexityMultiplier = complexityMultipliers[formData.complexity];
    const featuresTotal = formData.features.reduce((sum, feature) => sum + featuresCosts[feature], 0);
    
    const total = (basePrice * complexityMultiplier) + featuresTotal;
    const min = Math.round(total * 0.8);
    const max = Math.round(total * 1.2);
    
    setEstimate({ min, max, timeline: formData.timeline });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-2xl font-bold mb-6 text-center">Startup Development Cost Calculator</h3>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Project Type</label>
            <select
              value={formData.projectType}
              onChange={(e) => setFormData({...formData, projectType: e.target.value})}
              className="w-full p-3 border rounded-lg"
            >
              {Object.entries(projectTypes).map(([key, value]) => (
                <option key={key} value={key}>{value.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Complexity</label>
            <select
              value={formData.complexity}
              onChange={(e) => setFormData({...formData, complexity: e.target.value})}
              className="w-full p-3 border rounded-lg"
            >
              <option value="simple">Simple (MVP)</option>
              <option value="medium">Medium (Standard)</option>
              <option value="complex">Complex (Advanced)</option>
              <option value="enterprise">Enterprise (Full-scale)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Additional Features</label>
            <div className="space-y-2">
              {Object.entries(featuresCosts).map(([key, cost]) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.features.includes(key)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({...formData, features: [...formData.features, key]});
                      } else {
                        setFormData({...formData, features: formData.features.filter(f => f !== key)});
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="capitalize">{key.replace('_', ' ')} (+${cost.toLocaleString()})</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={calculateEstimate}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Calculate Estimate
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          {estimate ? (
            <div className="text-center">
              <h4 className="text-xl font-semibold mb-4">Estimated Cost</h4>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                ${estimate.min.toLocaleString()} - ${estimate.max.toLocaleString()}
              </div>
              <p className="text-gray-600 mb-4">Development Timeline: {estimate.timeline} months</p>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  This estimate includes planning, design, development, testing, and deployment. 
                  Contact us for a detailed breakdown and custom quote.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <Calculator className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Fill out the form to get your estimate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// API Documentation Generator Component
const APIDocGenerator = () => {
  const [apiData, setApiData] = useState({
    name: '',
    version: '1.0.0',
    description: '',
    baseUrl: '',
    endpoints: []
  });

  const addEndpoint = () => {
    setApiData({
      ...apiData,
      endpoints: [...apiData.endpoints, {
        method: 'GET',
        path: '',
        description: '',
        parameters: [],
        response: ''
      }]
    });
  };

  const generateDocs = () => {
    const docs = `# ${apiData.name} API Documentation

Version: ${apiData.version}
Base URL: ${apiData.baseUrl}

## Description
${apiData.description}

## Endpoints

${apiData.endpoints.map(endpoint => `
### ${endpoint.method} ${endpoint.path}
${endpoint.description}

**Response:**
\`\`\`json
${endpoint.response}
\`\`\`
`).join('\n')}
`;

    const blob = new Blob([docs], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${apiData.name || 'api'}-docs.md`;
    a.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-2xl font-bold mb-6 text-center">API Documentation Generator</h3>
      
      <div className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="API Name"
          value={apiData.name}
          onChange={(e) => setApiData({...apiData, name: e.target.value})}
          className="w-full p-3 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Base URL (e.g., https://api.example.com)"
          value={apiData.baseUrl}
          onChange={(e) => setApiData({...apiData, baseUrl: e.target.value})}
          className="w-full p-3 border rounded-lg"
        />
        <textarea
          placeholder="API Description"
          value={apiData.description}
          onChange={(e) => setApiData({...apiData, description: e.target.value})}
          className="w-full p-3 border rounded-lg h-24"
        />
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={addEndpoint}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Add Endpoint
        </button>
        <button
          onClick={generateDocs}
          disabled={!apiData.name}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Generate Docs
        </button>
      </div>

      <div className="text-center text-gray-600">
        <Code className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p>Create professional API documentation in minutes</p>
      </div>
    </div>
  );
};

// Color Palette Generator Component
const ColorPaletteGenerator = () => {
  const [palette, setPalette] = useState([]);
  const [baseColor, setBaseColor] = useState('#3B82F6');

  const generatePalette = () => {
    const hsl = hexToHsl(baseColor);
    const newPalette = [
      { name: 'Primary', color: baseColor },
      { name: 'Secondary', color: hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l) },
      { name: 'Accent', color: hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l) },
      { name: 'Light', color: hslToHex(hsl.h, hsl.s * 0.5, Math.min(hsl.l * 1.3, 90)) },
      { name: 'Dark', color: hslToHex(hsl.h, hsl.s * 1.2, hsl.l * 0.7) }
    ];
    setPalette(newPalette);
  };

  const hexToHsl = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-2xl font-bold mb-6 text-center">Brand Color Palette Generator</h3>
      
      <div className="text-center mb-8">
        <input
          type="color"
          value={baseColor}
          onChange={(e) => setBaseColor(e.target.value)}
          className="w-20 h-20 rounded-lg border-4 border-gray-200 cursor-pointer mx-auto mb-4"
        />
        <button
          onClick={generatePalette}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Generate Palette
        </button>
      </div>

      {palette.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {palette.map((color, index) => (
            <div key={index} className="text-center">
              <div
                className="w-full h-24 rounded-lg mb-2 cursor-pointer"
                style={{ backgroundColor: color.color }}
                onClick={() => navigator.clipboard.writeText(color.color)}
              />
              <p className="font-medium">{color.name}</p>
              <p className="text-sm text-gray-600">{color.color}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Requirements Template Component
const RequirementsTemplate = () => {
  const templates = [
    {
      name: 'Web Application Requirements',
      description: 'Complete template for web app development projects',
      filename: 'web-app-requirements.docx'
    },
    {
      name: 'Mobile App Requirements',
      description: 'Comprehensive mobile application specification template',
      filename: 'mobile-app-requirements.docx'
    },
    {
      name: 'E-commerce Platform Requirements',
      description: 'Detailed requirements for online store development',
      filename: 'ecommerce-requirements.docx'
    },
    {
      name: 'API Development Requirements',
      description: 'Technical specifications for API development',
      filename: 'api-requirements.docx'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-2xl font-bold mb-6 text-center">Project Requirements Templates</h3>
      
      <div className="grid gap-4">
        {templates.map((template, index) => (
          <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold">{template.name}</h4>
                <p className="text-gray-600 text-sm">{template.description}</p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Pro Tip:</strong> These templates include sections for functional requirements, 
          technical specifications, user stories, acceptance criteria, and project timelines.
        </p>
      </div>
    </div>
  );
};

export default FreeTools;
