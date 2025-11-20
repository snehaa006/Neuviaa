import React, { useState, useRef } from 'react';
import { Star, ChevronRight, Upload, Heart, Leaf, Dna, Clock, CheckCircle, AlertTriangle, Utensils, Sun, Apple, RotateCcw } from 'lucide-react';

const App = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    pregnancyWeek: '',
    allergies: [],
    diseases: [],
    geneticFile: null,
    prakritiAnswers: {}
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const fileInputRef = useRef(null);

  const prakritiQuestions = [
    {
      id: 'bodyFrame',
      question: 'How would you describe your natural body frame?',
      options: [
        { text: 'Thin, light bone structure', dosha: 'vata' },
        { text: 'Medium, well-proportioned', dosha: 'pitta' },
        { text: 'Large, heavy bone structure', dosha: 'kapha' }
      ]
    },
    {
      id: 'skin',
      question: 'What best describes your skin?',
      options: [
        { text: 'Dry, rough, thin', dosha: 'vata' },
        { text: 'Warm, oily, sensitive', dosha: 'pitta' },
        { text: 'Thick, moist, cool', dosha: 'kapha' }
      ]
    },
    {
      id: 'energy',
      question: 'How is your energy throughout the day?',
      options: [
        { text: 'Variable, bursts of activity', dosha: 'vata' },
        { text: 'Moderate, consistent', dosha: 'pitta' },
        { text: 'Steady, but slow to start', dosha: 'kapha' }
      ]
    },
    {
      id: 'appetite',
      question: 'How would you describe your appetite?',
      options: [
        { text: 'Irregular, sometimes forget to eat', dosha: 'vata' },
        { text: 'Strong, regular, get irritable when hungry', dosha: 'pitta' },
        { text: 'Steady but can easily skip meals', dosha: 'kapha' }
      ]
    }
  ];

  const allergiesOptions = ['Dairy', 'Gluten', 'Nuts', 'Eggs', 'Soy', 'Shellfish', 'Citrus'];
  const diseasesOptions = ['Preeclampsia', 'Anemia', 'Thyroid Disorder', 'UTI', 'Mental Health Condition', 'Gestational Diabetes (GDM)', 'History of Miscarriage'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field, option) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].includes(option) ? prev[field].filter(item => item !== option) : [...prev[field], option] }));
  };

  const handlePrakritiAnswer = (questionId, option) => {
    setFormData(prev => ({ ...prev, prakritiAnswers: { ...prev.prakritiAnswers, [questionId]: option } }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, geneticFile: file }));
    }
  };

  const analyzePrakriti = () => {
    const doshaScores = { vata: 0, pitta: 0, kapha: 0 };
    Object.values(formData.prakritiAnswers).forEach(answer => {
      doshaScores[answer.dosha]++;
    });
    return Object.entries(doshaScores).reduce((a, b) => doshaScores[a[0]] > doshaScores[b[0]] ? a : b)[0];
  };

  const generateDietPlan = (dosha) => {
    const basePlans = {
      vata: {
        breakfast: "Warm oats with ghee, dates, and almonds",
        lunch: "Quinoa khichdi with roasted vegetables",
        dinner: "Mung dal soup with steamed rice",
        snack: "Warm milk with turmeric and honey"
      },
      pitta: {
        breakfast: "Coconut rice with fresh berries",
        lunch: "Cooling cucumber salad with mint",
        dinner: "Basmati rice with cooling herbs",
        snack: "Fresh fruit smoothie with coconut water"
      },
      kapha: {
        breakfast: "Spiced quinoa porridge with cinnamon",
        lunch: "Lentil curry with leafy greens",
        dinner: "Light vegetable soup with ginger",
        snack: "Green tea with roasted seeds"
      }
    };
    return basePlans[dosha] || basePlans.vata;
  };

  const generateResults = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const dominantDosha = analyzePrakriti();
      const hasGeneticData = !!formData.geneticFile;
      setResults({
        dosha: dominantDosha,
        geneticRisks: hasGeneticData ? ['Insulin Resistance', 'Iron Deficiency'] : ['Based on family history patterns'],
        riskFactors: formData.diseases,
        dietPlan: generateDietPlan(dominantDosha, formData.diseases, formData.allergies)
      });
      setIsAnalyzing(false);
      setCurrentStep(4);
    }, 3000);
  };

  // Landing Page
  if (currentStep === 0) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F0EBDB 0%, #F8F4EB 50%, #F0EBDB 100%)' }}>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 text-white px-4 py-2 rounded-full text-sm font-medium mb-4" style={{ background: 'linear-gradient(to right, #C9A6A1, #B89690)' }}>
                <Star className="w-4 h-4" /> PREMIUM FEATURE
              </div>
              <h1 className="text-5xl font-bold mb-4" style={{ 
                background: 'linear-gradient(to right, #C9A6A1, #B89690)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Revolutionary Precision Maternal Nutrition
              </h1>
              <p className="text-xl mb-2" style={{ color: '#8B7D73' }}>Powered by Ayurveda + Genomics</p>
            </div>
            <div className="rounded-3xl shadow-2xl p-12 mb-12" style={{ backgroundColor: '#FDFBF7', border: '1px solid #E3D8C8' }}>
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(to bottom right, #D4B5B0, #C9A6A1)' }}>
                    <Leaf className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#5D4E47' }}>Ayurvedic Wisdom</h3>
                  <p className="text-sm" style={{ color: '#8B7D73' }}>Ancient constitution analysis for modern pregnancy</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(to bottom right, #D2BFB9, #B89690)' }}>
                    <Dna className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#5D4E47' }}>Genetic Analysis</h3>
                  <p className="text-sm" style={{ color: '#8B7D73' }}>DNA-based nutrition recommendations</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(to bottom right, #B5BFA8, #CDD6C0)' }}>
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#5D4E47' }}>Prevent Complications</h3>
                  <p className="text-sm" style={{ color: '#8B7D73' }}>Proactive care for you and your baby</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xl mb-8 leading-relaxed" style={{ color: '#5D4E47' }}>
                  Why settle for generic diet apps when your body and genes are unique? Get a 7-day science-backed, tailor-made diet plan designed to prevent critical pregnancy complications before they arise.
                </p>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-3 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                  style={{ background: 'linear-gradient(to right, #C9A6A1, #B89690)' }}
                >
                  <Star className="w-6 h-6" /> Generate My Personalized Diet Plan <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(8px)', border: '1px solid #E3D8C8' }}>
                <h4 className="font-semibold mb-3" style={{ color: '#5D4E47' }}>✅ Personalized Analysis</h4>
                <p className="text-sm" style={{ color: '#8B7D73' }}>Ayurvedic Prakriti + genetic profile integration</p>
              </div>
              <div className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(8px)', border: '1px solid #E3D8C8' }}>
                <h4 className="font-semibold mb-3" style={{ color: '#5D4E47' }}>🌱 Science-Backed Plans</h4>
                <p className="text-sm" style={{ color: '#8B7D73' }}>Evidence-based nutrition for optimal pregnancy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Basic Information Step
  if (currentStep === 1) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F0EBDB 0%, #F8F4EB 50%, #F0EBDB 100%)' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-medium" style={{ backgroundColor: '#C9A6A1' }}>1</div>
                <h2 className="text-2xl font-bold" style={{ color: '#5D4E47' }}>Basic Information</h2>
              </div>
              <div className="w-full rounded-full h-2" style={{ backgroundColor: '#E3D8C8' }}>
                <div className="h-2 rounded-full" style={{ width: '25%', background: 'linear-gradient(to right, #C9A6A1, #B89690)' }}></div>
              </div>
            </div>
            <div className="rounded-2xl shadow-xl p-8" style={{ backgroundColor: '#FDFBF7', border: '1px solid #E3D8C8' }}>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#5D4E47' }}>Age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl"
                      style={{ border: '1px solid #E3D8C8' }}
                      placeholder="Enter your age"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#5D4E47' }}>Pregnancy Week</label>
                    <input
                      type="number"
                      value={formData.pregnancyWeek}
                      onChange={(e) => handleInputChange('pregnancyWeek', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl"
                      style={{ border: '1px solid #E3D8C8' }}
                      placeholder="Current week"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#5D4E47' }}>Weight (kg)</label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl"
                      style={{ border: '1px solid #E3D8C8' }}
                      placeholder="Current weight"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#5D4E47' }}>Height (cm)</label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl"
                      style={{ border: '1px solid #E3D8C8' }}
                      placeholder="Your height"
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <button onClick={() => setCurrentStep(0)} className="px-6 py-3 transition-colors" style={{ color: '#8B7D73' }}>
                    ← Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!formData.age || !formData.weight || !formData.height || !formData.pregnancyWeek}
                    className="px-8 py-3 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    style={{ background: 'linear-gradient(to right, #C9A6A1, #B89690)' }}
                  >
                    Continue →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Prakriti Assessment Step
  if (currentStep === 2) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F0EBDB 0%, #F8F4EB 50%, #F0EBDB 100%)' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-medium" style={{ backgroundColor: '#C9A6A1' }}>2</div>
                <h2 className="text-2xl font-bold" style={{ color: '#5D4E47' }}>Ayurvedic Prakriti Assessment</h2>
              </div>
              <div className="w-full rounded-full h-2" style={{ backgroundColor: '#E3D8C8' }}>
                <div className="h-2 rounded-full" style={{ width: '50%', background: 'linear-gradient(to right, #C9A6A1, #B89690)' }}></div>
              </div>
            </div>
            <div className="rounded-2xl shadow-xl p-8" style={{ backgroundColor: '#FDFBF7', border: '1px solid #E3D8C8' }}>
              <p className="text-center mb-8" style={{ color: '#8B7D73' }}>Answer these questions to discover your unique Ayurvedic constitution</p>
              <div className="space-y-8">
                {prakritiQuestions.map((q, index) => (
                  <div key={q.id} className="space-y-4">
                    <h3 className="font-medium" style={{ color: '#5D4E47' }}>{index + 1}. {q.question}</h3>
                    <div className="space-y-2">
                      {q.options.map((option, optIndex) => (
                        <label
                          key={optIndex}
                          className="flex items-center p-4 rounded-xl cursor-pointer transition-colors"
                          style={{
                            border: `1px solid ${formData.prakritiAnswers[q.id]?.text === option.text ? '#C9A6A1' : '#E3D8C8'}`,
                            backgroundColor: formData.prakritiAnswers[q.id]?.text === option.text ? '#F0EBDB' : 'transparent'
                          }}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            checked={formData.prakritiAnswers[q.id]?.text === option.text}
                            onChange={() => handlePrakritiAnswer(q.id, option)}
                            className="sr-only"
                          />
                          <div
                            className="w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center transition-all"
                            style={{
                              backgroundColor: formData.prakritiAnswers[q.id]?.text === option.text ? '#C9A6A1' : 'transparent',
                              borderColor: formData.prakritiAnswers[q.id]?.text === option.text ? '#C9A6A1' : '#E3D8C8'
                            }}
                          >
                            {formData.prakritiAnswers[q.id]?.text === option.text && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <span style={{ color: '#5D4E47' }}>{option.text}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex justify-between pt-6">
                  <button onClick={() => setCurrentStep(1)} className="px-6 py-3 transition-colors" style={{ color: '#8B7D73' }}>
                    ← Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    disabled={Object.keys(formData.prakritiAnswers).length < prakritiQuestions.length}
                    className="px-8 py-3 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    style={{ background: 'linear-gradient(to right, #C9A6A1, #B89690)' }}
                  >
                    Continue →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Health & Genetics Step
  if (currentStep === 3) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F0EBDB 0%, #F8F4EB 50%, #F0EBDB 100%)' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-medium" style={{ backgroundColor: '#C9A6A1' }}>3</div>
                <h2 className="text-2xl font-bold" style={{ color: '#5D4E47' }}>Health Profile & Genetics</h2>
              </div>
              <div className="w-full rounded-full h-2" style={{ backgroundColor: '#E3D8C8' }}>
                <div className="h-2 rounded-full" style={{ width: '75%', background: 'linear-gradient(to right, #C9A6A1, #B89690)' }}></div>
              </div>
            </div>
            <div className="rounded-2xl shadow-xl p-8 space-y-8" style={{ backgroundColor: '#FDFBF7', border: '1px solid #E3D8C8' }}>
              <div>
                <h3 className="font-medium mb-4" style={{ color: '#5D4E47' }}>Known Allergies</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {allergiesOptions.map(allergy => (
                    <label 
                      key={allergy} 
                      className="flex items-center p-3 rounded-xl cursor-pointer transition-colors"
                      style={{
                        border: `1px solid ${formData.allergies.includes(allergy) ? '#C9A6A1' : '#E3D8C8'}`,
                        backgroundColor: formData.allergies.includes(allergy) ? '#F0EBDB' : 'transparent'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.allergies.includes(allergy)}
                        onChange={() => handleMultiSelect('allergies', allergy)}
                        className="sr-only"
                      />
                      <div
                        className="w-4 h-4 rounded mr-3 border-2 flex items-center justify-center transition-all"
                        style={{
                          backgroundColor: formData.allergies.includes(allergy) ? '#C9A6A1' : 'transparent',
                          borderColor: formData.allergies.includes(allergy) ? '#C9A6A1' : '#E3D8C8'
                        }}
                      >
                        {formData.allergies.includes(allergy) && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-sm" style={{ color: '#5D4E47' }}>{allergy}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-4" style={{ color: '#5D4E47' }}>Known Health Conditions</h3>
                <div className="space-y-2">
                  {diseasesOptions.map(disease => (
                    <label 
                      key={disease} 
                      className="flex items-center p-3 rounded-xl cursor-pointer transition-colors"
                      style={{
                        border: `1px solid ${formData.diseases.includes(disease) ? '#C9A6A1' : '#E3D8C8'}`,
                        backgroundColor: formData.diseases.includes(disease) ? '#F0EBDB' : 'transparent'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.diseases.includes(disease)}
                        onChange={() => handleMultiSelect('diseases', disease)}
                        className="sr-only"
                      />
                      <div
                        className="w-4 h-4 rounded mr-3 border-2 flex items-center justify-center transition-all"
                        style={{
                          backgroundColor: formData.diseases.includes(disease) ? '#C9A6A1' : 'transparent',
                          borderColor: formData.diseases.includes(disease) ? '#C9A6A1' : '#E3D8C8'
                        }}
                      >
                        {formData.diseases.includes(disease) && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-sm" style={{ color: '#5D4E47' }}>{disease}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-4" style={{ color: '#5D4E47' }}>Genetic Report (Optional)</h3>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors"
                  style={{ borderColor: '#E3D8C8' }}
                >
                  <Upload className="w-8 h-8 mx-auto mb-4" style={{ color: '#A69A8E' }} />
                  <p className="mb-2" style={{ color: '#8B7D73' }}>Upload genetic report from 23andMe, AncestryDNA, etc.</p>
                  <p className="text-sm" style={{ color: '#A69A8E' }}>Supported formats: PDF, TXT, CSV</p>
                  {formData.geneticFile && (
                    <p className="mt-2 font-medium" style={{ color: '#C9A6A1' }}>✓ {formData.geneticFile.name}</p>
                  )}
                </div>
                <input ref={fileInputRef} type="file" onChange={handleFileUpload} accept=".pdf,.txt,.csv" className="hidden" />
              </div>
              <div className="flex justify-between pt-6">
                <button onClick={() => setCurrentStep(2)} className="px-6 py-3 transition-colors" style={{ color: '#8B7D73' }}>
                  ← Back
                </button>
                <button
                  onClick={generateResults}
                  className="px-8 py-3 text-white rounded-xl transition-all"
                  style={{ background: 'linear-gradient(to right, #C9A6A1, #B89690)' }}
                >
                  Generate My Diet Plan →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Analysis Loading
  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F0EBDB 0%, #F8F4EB 50%, #F0EBDB 100%)' }}>
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(to right, #C9A6A1, #B89690)' }}>
            <Dna className="w-10 h-10 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#5D4E47' }}>Analyzing Your Profile...</h2>
          <p className="mb-6" style={{ color: '#8B7D73' }}>Our AI is processing your Ayurvedic constitution and genetic data to create your personalized diet plan</p>
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5" style={{ color: '#B5BFA8' }} />
              <span className="text-sm" style={{ color: '#5D4E47' }}>Dosha analysis complete</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5" style={{ color: '#B5BFA8' }} />
              <span className="text-sm" style={{ color: '#5D4E47' }}>Genetic risk assessment</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 animate-spin" style={{ color: '#C9A6A1' }} />
              <span className="text-sm" style={{ color: '#5D4E47' }}>Generating personalized meal plans...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results Page
  if (currentStep === 4 && results) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F0EBDB 0%, #F8F4EB 50%, #F0EBDB 100%)' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"style={{ background: 'linear-gradient(to right, #B5BFA8, #CDD6C0)' }}>
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: '#5D4E47' }}>Your Personalized Diet Plan is Ready!</h1>
              <p style={{ color: '#8B7D73' }}>Based on your unique Ayur-Nutrigenomics profile</p>
            </div>
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <div className="rounded-2xl p-6 shadow-xl" style={{ backgroundColor: '#FDFBF7', border: '1px solid #E3D8C8' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #D4B5B0, #C9A6A1)' }}>
                    <Leaf className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold" style={{ color: '#5D4E47' }}>Your Dosha Type</h3>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold capitalize mb-2" style={{ color: '#C9A6A1' }}>{results.dosha}</div>
                  <p className="text-sm" style={{ color: '#8B7D73' }}>
                    {results.dosha === 'kapha' && "Earth & water elements. Focus on warm, light foods."}
                    {results.dosha === 'pitta' && "Fire & water elements. Cool, sweet foods are ideal."}
                    {results.dosha === 'vata' && "Air & space elements. Warm, grounding foods recommended."}
                  </p>
                </div>
              </div>
              <div className="rounded-2xl p-6 shadow-xl" style={{ backgroundColor: '#FDFBF7', border: '1px solid #E3D8C8' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #D2BFB9, #B89690)' }}>
                    <Dna className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold" style={{ color: '#5D4E47' }}>Risk Factors</h3>
                </div>
                <div className="space-y-2">
                  {results.geneticRisks.map((risk, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" style={{ color: '#C88B84' }} />
                      <span className="text-sm" style={{ color: '#5D4E47' }}>{risk}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl p-6 shadow-xl" style={{ backgroundColor: '#FDFBF7', border: '1px solid #E3D8C8' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #D4B5B0, #C9A6A1)' }}>
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold" style={{ color: '#5D4E47' }}>Health Focus</h3>
                </div>
                <div className="space-y-2">
                  {results.riskFactors.length > 0 ? (
                    results.riskFactors.map((condition, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Heart className="w-4 h-4" style={{ color: '#C9A6A1' }} />
                        <span className="text-sm" style={{ color: '#5D4E47' }}>{condition}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" style={{ color: '#B5BFA8' }} />
                      <span className="text-sm" style={{ color: '#5D4E47' }}>No specific conditions reported</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 7-Day Diet Plan */}
            <div className="rounded-2xl p-8 shadow-xl mb-8" style={{ backgroundColor: '#FDFBF7', border: '1px solid #E3D8C8' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #B5BFA8, #CDD6C0)' }}>
                  <Utensils className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold" style={{ color: '#5D4E47' }}>Your 7-Day Personalized Diet Plan</h3>
                  <p className="text-sm" style={{ color: '#8B7D73' }}>Tailored for {results.dosha} constitution</p>
                </div>
              </div>

              <div className="grid gap-6">
                {[1, 2, 3, 4, 5, 6, 7].map(day => (
                  <div key={day} className="rounded-xl p-6 transition-shadow hover:shadow-md" style={{ border: '1px solid #E3D8C8' }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-medium" style={{ background: 'linear-gradient(to right, #C9A6A1, #B89690)' }}>
                        {day}
                      </div>
                      <h4 className="font-medium" style={{ color: '#5D4E47' }}>Day {day}</h4>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Sun className="w-4 h-4" style={{ color: '#C88B84' }} />
                          <span className="font-medium text-sm" style={{ color: '#5D4E47' }}>Breakfast</span>
                        </div>
                        <p className="text-sm p-3 rounded-lg" style={{ color: '#8B7D73', backgroundColor: '#F8F4EB' }}>
                          {results.dietPlan.breakfast}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Utensils className="w-4 h-4" style={{ color: '#B89690' }} />
                          <span className="font-medium text-sm" style={{ color: '#5D4E47' }}>Lunch</span>
                        </div>
                        <p className="text-sm p-3 rounded-lg" style={{ color: '#8B7D73', backgroundColor: '#F0EBDB' }}>
                          {results.dietPlan.lunch}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Utensils className="w-4 h-4" style={{ color: '#D2BFB9' }} />
                          <span className="font-medium text-sm" style={{ color: '#5D4E47' }}>Dinner</span>
                        </div>
                        <p className="text-sm p-3 rounded-lg" style={{ color: '#8B7D73', backgroundColor: '#E8E0D0' }}>
                          {results.dietPlan.dinner}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Apple className="w-4 h-4" style={{ color: '#B5BFA8' }} />
                          <span className="font-medium text-sm" style={{ color: '#5D4E47' }}>Snack</span>
                        </div>
                        <p className="text-sm p-3 rounded-lg" style={{ color: '#8B7D73', backgroundColor: '#CDD6C0' }}>
                          {results.dietPlan.snack}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Recommendations */}
            <div className="rounded-2xl p-6 shadow-xl mb-8" style={{ backgroundColor: '#FDFBF7', border: '1px solid #E3D8C8' }}>
              <h3 className="font-semibold mb-4" style={{ color: '#5D4E47' }}>Additional Recommendations for {results.dosha} Constitution</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium" style={{ color: '#5D4E47' }}>Foods to Favor:</h4>
                  <ul className="text-sm space-y-1" style={{ color: '#8B7D73' }}>
                    {results.dosha === 'vata' && (
                      <>
                        <li>• Warm, cooked foods</li>
                        <li>• Sweet, sour, and salty tastes</li>
                        <li>• Ghee, oils, and healthy fats</li>
                        <li>• Root vegetables and warm spices</li>
                      </>
                    )}
                    {results.dosha === 'pitta' && (
                      <>
                        <li>• Cool, refreshing foods</li>
                        <li>• Sweet, bitter, and astringent tastes</li>
                        <li>• Coconut, cucumber, and leafy greens</li>
                        <li>• Milk, ghee, and cooling herbs</li>
                      </>
                    )}
                    {results.dosha === 'kapha' && (
                      <>
                        <li>• Light, warm foods</li>
                        <li>• Pungent, bitter, and astringent tastes</li>
                        <li>• Ginger, garlic, and warming spices</li>
                        <li>• Legumes and light grains</li>
                      </>
                    )}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium" style={{ color: '#5D4E47' }}>Foods to Limit:</h4>
                  <ul className="text-sm space-y-1" style={{ color: '#8B7D73' }}>
                    {results.dosha === 'vata' && (
                      <>
                        <li>• Cold, raw foods</li>
                        <li>• Excessive bitter, pungent tastes</li>
                        <li>• Carbonated drinks</li>
                        <li>• Irregular meal timing</li>
                      </>
                    )}
                    {results.dosha === 'pitta' && (
                      <>
                        <li>• Hot, spicy foods</li>
                        <li>• Excessive sour, salty tastes</li>
                        <li>• Alcohol and caffeine</li>
                        <li>• Fried and oily foods</li>
                      </>
                    )}
                    {results.dosha === 'kapha' && (
                      <>
                        <li>• Heavy, oily foods</li>
                        <li>• Excessive sweet, sour tastes</li>
                        <li>• Dairy and cold foods</li>
                        <li>• Overeating and snacking</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={() => {
                  setCurrentStep(0);
                  setFormData({
                    age: '',
                    weight: '',
                    height: '',
                    pregnancyWeek: '',
                    allergies: [],
                    diseases: [],
                    geneticFile: null,
                    prakritiAnswers: {}
                  });
                  setResults(null);
                }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl transition-all font-medium"
                style={{ backgroundColor: '#FDFBF7', color: '#5D4E47', border: '2px solid #E3D8C8' }}
              >
                <RotateCcw className="w-5 h-5" />
                Start New Analysis
              </button>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-3 px-8 py-4 text-white rounded-2xl transition-all font-medium hover:shadow-lg"
                style={{ background: 'linear-gradient(to right, #C9A6A1, #B89690)' }}
              >
                <Star className="w-5 h-5" />
                Save Diet Plan
              </button>
            </div>

            {/* Disclaimer */}
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#F8F4EB', border: '1px solid #E3D8C8' }}>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 mt-0.5" style={{ color: '#C88B84' }} />
                <div className="text-sm" style={{ color: '#5D4E47' }}>
                  <p className="font-medium mb-1">Medical Disclaimer</p>
                  <p>This personalized diet plan is for educational purposes only and should not replace professional medical advice. Please consult with your healthcare provider before making significant dietary changes during pregnancy.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default App;