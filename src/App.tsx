import { useState, useEffect } from 'react';
import { Step1 } from './components/Step1';
import { Step2 } from './components/Step2';
import { Step3 } from './components/Step3';
import { Step4 } from './components/Step4';
import { ProgressBar } from './components/ProgressBar';
import type { ResumeData } from './types';
import { FileText, Download, Sparkles, Settings, ChevronRight, ChevronLeft } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const initialData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: {
    technical: [],
    soft: [],
  },
  settings: {
    primaryColor: '#2563eb',
    fontFamily: 'sans',
    fontSize: 'base',
    template: 'modern',
    language: 'TR',
  },
};

const languages = ['TR', 'EN', 'DE', 'FR', 'ES', 'IT', 'AR', 'RU', 'ZH', 'JP'] as const;
const colors = ['#2563eb', '#16a34a', '#dc2626', '#ca8a04', '#9333ea', '#4f46e5', '#0891b2', '#be123c', '#4338ca', '#1e293b'];
const fonts = ['sans', 'serif', 'mono', 'inter', 'roboto', 'lato', 'poppins'];

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ResumeData>(initialData);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [resumeScore, setResumeScore] = useState(0);
  const [aiFeedback, setAiFeedback] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [textScale, setTextScale] = useState(100);

  const totalSteps = 4;

  useEffect(() => {
    calculateResumeScore();
  }, [formData]);

  const calculateResumeScore = () => {
    let score = 0;
    const { personalInfo, experience, education, skills } = formData;

    if (personalInfo.fullName) score += 5;
    if (personalInfo.email) score += 5;
    if (personalInfo.phone) score += 5;
    if (personalInfo.summary.length > 50) score += 10;
    if (personalInfo.photo) score += 5;

    if (experience.length > 0) score += 15;
    if (experience.length > 1) score += 10;
    if (experience.some(exp => exp.description.length > 50)) score += 10;

    if (education.length > 0) score += 10;
    if (education.some(edu => edu.gpa)) score += 5;

    if (skills.technical.length > 0) score += 10;
    if (skills.soft.length > 0) score += 10;

    setResumeScore(Math.min(100, score));
  };

  const analyzeWithAI = async () => {
    setIsAnalyzing(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setAiFeedback('Gemini API anahtarı bulunamadı. Lütfen .env dosyanızı kontrol edin.');
        setIsAnalyzing(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Bu CV verilerini analiz et ve nasıl geliştirilebileceğine dair 3 kısa, profesyonel öneri sun (Türkçe olarak):
      Ad Soyad: ${formData.personalInfo.fullName}
      Özet: ${formData.personalInfo.summary}
      Deneyim Sayısı: ${formData.experience.length}
      Eğitim Sayısı: ${formData.education.length}
      Yetenekler: ${formData.skills.technical.join(', ')} (Teknik), ${formData.skills.soft.join(', ')} (Kişisel)`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAiFeedback(response.text || 'Analiz tamamlanamadı.');
    } catch (error) {
      console.error('AI Analysis Error:', error);
      setAiFeedback('Yapay zeka analizi sırasında bir hata oluştu.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updatePersonalInfo = (data: Partial<ResumeData['personalInfo']>) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...data },
    }));
  };

  const updateExperience = (data: ResumeData['experience']) => {
    setFormData((prev) => ({ ...prev, experience: data }));
  };

  const updateEducation = (data: ResumeData['education']) => {
    setFormData((prev) => ({ ...prev, education: data }));
  };

  const updateSettings = (data: Partial<ResumeData['settings']>) => {
    setFormData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...data },
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 data={formData.personalInfo} updateData={updatePersonalInfo} />;
      case 2:
        return <Step2 data={formData.experience} updateData={updateExperience} />;
      case 3:
        return <Step3 data={formData.education} updateData={updateEducation} />;
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Ayarlar ve İndirme</h2>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tema Rengi</label>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateSettings({ primaryColor: color })}
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.settings.primaryColor === color ? 'border-gray-900 scale-110' : 'border-transparent'
                      } transition-all`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Şablon</label>
                <div className="flex flex-wrap gap-2">
                  {['modern', 'classic', 'minimal'].map((tpl) => (
                    <button
                      key={tpl}
                      onClick={() => updateSettings({ template: tpl as any })}
                      className={`px-4 py-2 rounded-md border text-sm capitalize ${
                        formData.settings.template === tpl
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {tpl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Yazı Tipi</label>
                <div className="flex flex-wrap gap-2">
                  {fonts.map((font) => (
                    <button
                      key={font}
                      onClick={() => updateSettings({ fontFamily: font })}
                      className={`px-4 py-2 rounded-md border text-sm capitalize ${
                        formData.settings.fontFamily === font
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Metin Ölçeği (%)</label>
                <input
                  type="number"
                  min="50"
                  max="200"
                  value={textScale}
                  onChange={(e) => setTextScale(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dil</label>
                <select
                  value={formData.settings.language}
                  onChange={(e) => updateSettings({ language: e.target.value as any })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">CV Builder Pro</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-full">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">CV Score: {resumeScore}/100</span>
            </div>
            
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">PDF İndir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Split Screen */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 h-[calc(100vh-4rem)]">
        
        {/* Left Panel - Form (40%) */}
        <div className={`w-full lg:w-[40%] flex flex-col h-full ${showMobilePreview ? 'hidden lg:flex' : 'flex'}`}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1 overflow-y-auto custom-scrollbar">
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
            
            <div className="mt-8">
              {renderStep()}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-4 flex justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Geri</span>
            </button>
            
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <span>İleri</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={analyzeWithAI}
                disabled={isAnalyzing}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAnalyzing ? 'Analiz Ediliyor...' : 'Yapay Zeka Analizi'}</span>
              </button>
            )}
          </div>

          {/* AI Feedback Area */}
          {aiFeedback && (
            <div className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-xl">
              <h3 className="text-sm font-bold text-purple-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> AI Önerileri
              </h3>
              <p className="text-sm text-purple-800 whitespace-pre-line">{aiFeedback}</p>
            </div>
          )}
        </div>

        {/* Right Panel - Live Preview (60%) */}
        <div className={`w-full lg:w-[60%] h-full ${!showMobilePreview ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-gray-200 rounded-xl p-4 lg:p-8 h-full overflow-y-auto custom-scrollbar flex items-start justify-center">
            <div className="w-full max-w-[210mm] transition-transform origin-top" style={{ transform: `scale(${textScale / 100})` }}>
              <Step4 data={formData} />
            </div>
          </div>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setShowMobilePreview(!showMobilePreview)}
          className="lg:hidden fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 z-50 flex items-center gap-2"
        >
          {showMobilePreview ? (
            <>
              <Settings className="w-5 h-5" />
              <span className="font-medium">Düzenle</span>
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              <span className="font-medium">Önizleme</span>
            </>
          )}
        </button>
      </main>
    </div>
  );
}

export default App;
