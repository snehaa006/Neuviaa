import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Camera, Image, MapPin, Calendar, Clock, Heart, MessageCircle, BookOpen, Zap, CheckCircle, AlertCircle, Users, Star, Send } from 'lucide-react';

const AdvancedFeaturesApp = () => {
  const [currentFlow, setCurrentFlow] = useState('onboarding');
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    dueDate: '',
    trimester: 1,
    location: '',
    isFirstPregnancy: true,
    interests: [],
    communicationPreference: 'daily',
    privacy: 'open'
  });
  const [postType, setPostType] = useState('question');
  const [weeklyCheckIn, setWeeklyCheckIn] = useState({
    mood: 0,
    energy: 0,
    symptoms: [],
    gratitude: '',
    concerns: ''
  });

  const interests = [
    { id: 'yoga', name: 'Prenatal Yoga', icon: '🧘‍♀️' },
    { id: 'cooking', name: 'Healthy Cooking', icon: '🥗' },
    { id: 'reading', name: 'Pregnancy Books', icon: '📚' },
    { id: 'fitness', name: 'Safe Exercise', icon: '💪' },
    { id: 'meditation', name: 'Meditation', icon: '🕯️' },
    { id: 'photography', name: 'Bump Photos', icon: '📸' },
    { id: 'crafts', name: 'Baby Crafts', icon: '🧸' },
    { id: 'music', name: 'Baby Music', icon: '🎵' }
  ];

  const symptoms = [
    'Nausea', 'Fatigue', 'Back Pain', 'Heartburn', 'Insomnia', 
    'Mood Swings', 'Food Aversions', 'Frequent Urination'
  ];

  const renderOnboarding = () => {
    if (onboardingStep === 1) {
      return (
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center mb-12">
            <div className="text-8xl mb-6">🤱</div>
            <h1 className="text-4xl font-bold mb-3 text-primary">Welcome to BumpBuddies!</h1>
            <p className="text-secondary text-lg">Your supportive pregnancy community</p>
          </div>

          <div className="bg-warm-white border border-warm rounded-2xl p-8 card-shadow space-y-6">
            <div>
              <label className="block text-base font-semibold mb-3 text-primary">What's your name?</label>
              <input 
                type="text"
                placeholder="Enter your first name"
                className="w-full px-5 py-4 border border-warm rounded-xl focus:outline-none focus:ring-2 focus:ring-dusty-rose text-base"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-base font-semibold mb-3 text-primary">When is your due date?</label>
              <input 
                type="date"
                className="w-full px-5 py-4 border border-warm rounded-xl focus:outline-none focus:ring-2 focus:ring-dusty-rose text-base"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-base font-semibold mb-3 text-primary">Current trimester</label>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map(tri => (
                  <button 
                    key={tri}
                    onClick={() => setFormData({...formData, trimester: tri})}
                    className={`py-4 rounded-xl border-2 transition-all card-shadow-hover ${
                      formData.trimester === tri 
                        ? 'border-dusty-rose bg-blush text-white font-semibold' 
                        : 'border-warm bg-warm-white hover:border-mauve-light text-secondary'
                    }`}
                  >
                    {tri === 1 ? '1st' : tri === 2 ? '2nd' : '3rd'} Trimester
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setOnboardingStep(2)}
              disabled={!formData.name || !formData.dueDate}
              className="w-full bg-dusty-rose text-white py-4 rounded-xl hover:bg-blush disabled:bg-warm-beige disabled:cursor-not-allowed transition-all card-shadow flex items-center justify-center gap-2 text-base font-semibold"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      );
    }

    if (onboardingStep === 2) {
      return (
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => setOnboardingStep(1)}
              className="p-3 hover:bg-cream rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-secondary" />
            </button>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-primary">Tell us about yourself</h2>
              <div className="flex gap-2 mt-3">
                <div className="h-2 bg-dusty-rose rounded-full flex-1"></div>
                <div className="h-2 bg-dusty-rose rounded-full flex-1"></div>
                <div className="h-2 bg-warm-beige rounded-full flex-1"></div>
              </div>
            </div>
          </div>

          <div className="bg-warm-white border border-warm rounded-2xl p-8 card-shadow space-y-6">
            <div>
              <label className="block text-base font-semibold mb-3 text-primary">Your location (for local connections)</label>
              <div className="relative">
                <MapPin className="w-5 h-5 absolute left-4 top-4 text-muted" />
                <input 
                  type="text"
                  placeholder="City, State"
                  className="w-full pl-12 pr-5 py-4 border border-warm rounded-xl focus:outline-none focus:ring-2 focus:ring-dusty-rose text-base"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-base font-semibold mb-4 text-primary">Is this your first pregnancy?</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setFormData({...formData, isFirstPregnancy: true})}
                  className={`py-4 rounded-xl border-2 transition-all card-shadow-hover ${
                    formData.isFirstPregnancy 
                      ? 'border-dusty-rose bg-blush text-white font-semibold' 
                      : 'border-warm bg-warm-white hover:border-mauve-light text-secondary'
                  }`}
                >
                  Yes, first time!
                </button>
                <button 
                  onClick={() => setFormData({...formData, isFirstPregnancy: false})}
                  className={`py-4 rounded-xl border-2 transition-all card-shadow-hover ${
                    !formData.isFirstPregnancy 
                      ? 'border-dusty-rose bg-blush text-white font-semibold' 
                      : 'border-warm bg-warm-white hover:border-mauve-light text-secondary'
                  }`}
                >
                  I've been here before
                </button>
              </div>
            </div>

            <div>
              <label className="block text-base font-semibold mb-4 text-primary">How often would you like to connect?</label>
              <div className="space-y-3">
                {[
                  { value: 'daily', label: 'Daily check-ins', desc: 'Active daily support' },
                  { value: 'weekly', label: 'Weekly catch-ups', desc: 'Regular but relaxed' },
                  { value: 'asneeded', label: 'As needed', desc: 'When I have questions' }
                ].map(option => (
                  <button 
                    key={option.value}
                    onClick={() => setFormData({...formData, communicationPreference: option.value})}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all card-shadow-hover ${
                      formData.communicationPreference === option.value 
                        ? 'border-dusty-rose bg-blush text-white' 
                        : 'border-warm bg-warm-white hover:border-mauve-light'
                    }`}
                  >
                    <div className="font-semibold">{option.label}</div>
                    <div className={`text-sm ${formData.communicationPreference === option.value ? 'text-white opacity-90' : 'text-muted'}`}>{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setOnboardingStep(3)}
              disabled={!formData.location}
              className="w-full bg-dusty-rose text-white py-4 rounded-xl hover:bg-blush disabled:bg-warm-beige disabled:cursor-not-allowed transition-all card-shadow flex items-center justify-center gap-2 text-base font-semibold"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      );
    }

    if (onboardingStep === 3) {
      return (
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => setOnboardingStep(2)}
              className="p-3 hover:bg-cream rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-secondary" />
            </button>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-primary">What interests you?</h2>
              <div className="flex gap-2 mt-3">
                <div className="h-2 bg-dusty-rose rounded-full flex-1"></div>
                <div className="h-2 bg-dusty-rose rounded-full flex-1"></div>
                <div className="h-2 bg-dusty-rose rounded-full flex-1"></div>
              </div>
            </div>
          </div>

          <p className="text-secondary text-lg">Select topics you'd like to discuss with your pregnancy buddies:</p>

          <div className="grid grid-cols-4 gap-4">
            {interests.map(interest => (
              <button 
                key={interest.id}
                onClick={() => {
                  const newInterests = formData.interests.includes(interest.id)
                    ? formData.interests.filter(i => i !== interest.id)
                    : [...formData.interests, interest.id];
                  setFormData({...formData, interests: newInterests});
                }}
                className={`p-6 rounded-xl border-2 transition-all card-shadow-hover ${
                  formData.interests.includes(interest.id)
                    ? 'border-dusty-rose bg-blush text-white' 
                    : 'border-warm bg-warm-white hover:border-mauve-light'
                }`}
              >
                <div className="text-4xl mb-3">{interest.icon}</div>
                <div className="text-sm font-semibold">{interest.name}</div>
              </button>
            ))}
          </div>

          <button 
            onClick={() => setCurrentFlow('main')}
            disabled={formData.interests.length === 0}
            className="w-full bg-dusty-rose text-white py-4 rounded-xl hover:bg-blush disabled:bg-warm-beige disabled:cursor-not-allowed transition-all card-shadow flex items-center justify-center gap-2 text-base font-semibold"
          >
            Join BumpBuddies!
            <CheckCircle className="w-5 h-5" />
          </button>
        </div>
      );
    }
  };

  const renderPostCreation = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setCurrentFlow('main')}
          className="p-3 hover:bg-cream rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-secondary" />
        </button>
        <h2 className="text-3xl font-bold text-primary">Share with Community</h2>
      </div>

      <div className="bg-warm-white border border-warm rounded-2xl p-8 card-shadow">
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { id: 'question', name: 'Ask Question', icon: '❓', color: 'sage' },
            { id: 'tip', name: 'Share Tip', icon: '💡', color: 'sage-light' },
            { id: 'support', name: 'Need Support', icon: '🤗', color: 'mauve' },
            { id: 'celebration', name: 'Celebrate', icon: '🎉', color: 'blush' }
          ].map(type => (
            <button 
              key={type.id}
              onClick={() => setPostType(type.id)}
              className={`p-5 rounded-xl border-2 text-center transition-all card-shadow-hover ${
                postType === type.id 
                  ? `border-dusty-rose bg-${type.color}` 
                  : 'border-warm bg-warm-white hover:border-mauve-light'
              }`}
            >
              <div className="text-3xl mb-2">{type.icon}</div>
              <div className="text-sm font-semibold text-primary">{type.name}</div>
            </button>
          ))}
        </div>

        <div className="space-y-5">
          <input 
            type="text"
            placeholder={
              postType === 'question' ? 'What would you like to ask?' :
              postType === 'tip' ? 'Share your helpful tip...' :
              postType === 'support' ? 'What\'s on your mind?' :
              'What are you celebrating?'
            }
            className="w-full px-5 py-4 border border-warm rounded-xl focus:outline-none focus:ring-2 focus:ring-dusty-rose font-semibold text-base"
          />

          <textarea 
            placeholder="Tell us more..."
            rows="5"
            className="w-full px-5 py-4 border border-warm rounded-xl focus:outline-none focus:ring-2 focus:ring-dusty-rose text-base"
          />

          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-secondary hover:text-primary transition-colors">
              <Camera className="w-5 h-5" />
              <span className="font-medium">Photo</span>
            </button>
            <button className="flex items-center gap-2 text-secondary hover:text-primary transition-colors">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">Location</span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3 text-primary">Category</label>
            <select className="w-full px-5 py-4 border border-warm rounded-xl focus:outline-none focus:ring-2 focus:ring-dusty-rose text-base">
              <option>Home Remedies</option>
              <option>Exercise & Fitness</option>
              <option>Mental Health</option>
              <option>Nutrition</option>
              <option>Baby Preparation</option>
              <option>General Discussion</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="anonymous" className="rounded w-4 h-4" />
            <label htmlFor="anonymous" className="text-base text-secondary">
              Post anonymously
            </label>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button 
            onClick={() => setCurrentFlow('main')}
            className="flex-1 py-4 px-6 border-2 border-warm rounded-xl hover:bg-cream transition-all text-secondary font-semibold"
          >
            Save Draft
          </button>
          <button className="flex-1 bg-dusty-rose text-white py-4 px-6 rounded-xl hover:bg-blush transition-all card-shadow font-semibold">
            Post
          </button>
        </div>
      </div>
    </div>
  );

  const renderWeeklyCheckIn = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setCurrentFlow('main')}
          className="p-3 hover:bg-cream rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-secondary" />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-primary">Weekly Check-in</h2>
          <p className="text-base text-secondary mt-1">Week 23 of your pregnancy</p>
        </div>
      </div>

      <div className="bg-warm-white border border-warm rounded-2xl p-8 card-shadow space-y-8">
        <div>
          <label className="block text-base font-semibold mb-4 text-primary">How's your mood this week?</label>
          <div className="flex justify-between items-center">
            {['😢', '😟', '😐', '😊', '😄'].map((emoji, idx) => (
              <button 
                key={idx}
                onClick={() => setWeeklyCheckIn({...weeklyCheckIn, mood: idx})}
                className={`text-5xl p-4 rounded-full transition-all ${
                  weeklyCheckIn.mood === idx ? 'bg-blush scale-110' : 'hover:bg-cream'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-base font-semibold mb-4 text-primary">Energy levels?</label>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-secondary font-medium">
              <span>Low</span>
              <span>High</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="10" 
              value={weeklyCheckIn.energy}
              onChange={(e) => setWeeklyCheckIn({...weeklyCheckIn, energy: parseInt(e.target.value)})}
              className="w-full h-3 rounded-full"
            />
            <div className="text-center text-base text-dusty-rose font-bold">
              {weeklyCheckIn.energy}/10
            </div>
          </div>
        </div>

        <div>
          <label className="block text-base font-semibold mb-4 text-primary">Any symptoms this week?</label>
          <div className="grid grid-cols-4 gap-3">
            {symptoms.map(symptom => (
              <button 
                key={symptom}
                onClick={() => {
                  const newSymptoms = weeklyCheckIn.symptoms.includes(symptom)
                    ? weeklyCheckIn.symptoms.filter(s => s !== symptom)
                    : [...weeklyCheckIn.symptoms, symptom];
                  setWeeklyCheckIn({...weeklyCheckIn, symptoms: newSymptoms});
                }}
                className={`p-3 text-sm rounded-xl border-2 transition-all card-shadow-hover ${
                  weeklyCheckIn.symptoms.includes(symptom)
                    ? 'border-dusty-rose bg-blush text-white font-semibold' 
                    : 'border-warm bg-warm-white hover:border-mauve-light text-secondary'
                }`}
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-base font-semibold mb-3 text-primary">What are you grateful for this week?</label>
          <textarea 
            placeholder="Share something positive..."
            rows="3"
            className="w-full px-5 py-4 border border-warm rounded-xl focus:outline-none focus:ring-2 focus:ring-dusty-rose text-base"
            value={weeklyCheckIn.gratitude}
            onChange={(e) => setWeeklyCheckIn({...weeklyCheckIn, gratitude: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-base font-semibold mb-3 text-primary">Any concerns or questions?</label>
          <textarea 
            placeholder="What's on your mind? (Optional)"
            rows="3"
            className="w-full px-5 py-4 border border-warm rounded-xl focus:outline-none focus:ring-2 focus:ring-dusty-rose text-base"
            value={weeklyCheckIn.concerns}
            onChange={(e) => setWeeklyCheckIn({...weeklyCheckIn, concerns: e.target.value})}
          />
        </div>

        <button 
          onClick={() => setCurrentFlow('main')}
          className="w-full bg-dusty-rose text-white py-4 rounded-xl hover:bg-blush transition-all card-shadow font-semibold text-base"
        >
          Complete Check-in
        </button>
      </div>
    </div>
  );

  const renderExpertSession = () => (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setCurrentFlow('main')}
          className="p-3 hover:bg-cream rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-secondary" />
        </button>
        <h2 className="text-3xl font-bold text-primary">Expert Q&A Session</h2>
      </div>

      <div className="bg-gradient-to-br from-sage-light to-sage rounded-2xl p-8 card-shadow">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-warm-white rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-4xl">👩‍⚕️</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-2xl text-primary">Dr. Sarah Mitchell</h3>
            <p className="text-secondary text-base font-medium mt-1">OB-GYN • 15 years experience</p>
            <p className="text-base text-primary mt-4 font-medium">
              "Second Trimester Care: What to Expect & How to Thrive"
            </p>
          </div>
          <div className="text-right text-base text-primary">
            <div className="font-bold">Today 3:00 PM</div>
            <div className="text-secondary">45 minutes</div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-6 text-base text-primary font-medium">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span>127 attending</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>Starts in 2 hours</span>
          </div>
        </div>

        <button className="w-full mt-6 bg-dusty-rose text-white py-4 rounded-xl hover:bg-blush transition-all card-shadow font-semibold text-base">
          Join Session
        </button>
      </div>

      <div className="bg-warm-white border border-warm rounded-2xl overflow-hidden card-shadow">
        <div className="p-6 border-b border-warm">
          <h4 className="font-semibold text-lg text-primary">Submit Your Question</h4>
          <p className="text-base text-secondary mt-1">Questions will be answered during the live session</p>
        </div>
        <div className="p-6 space-y-4">
          <textarea 
            placeholder="What would you like to ask Dr. Mitchell?"
            rows="4"
            className="w-full px-5 py-4 border border-warm rounded-xl focus:outline-none focus:ring-2 focus:ring-sage text-base"
          />
          <div className="flex items-center gap-3">
            <input type="checkbox" id="anonymous-question" className="rounded w-4 h-4" />
            <label htmlFor="anonymous-question" className="text-base text-secondary">
              Ask anonymously
            </label>
          </div>
          <button className="w-full bg-sage text-white py-4 rounded-xl hover:bg-sage-light transition-all card-shadow font-semibold text-base">
            Submit Question
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-lg text-primary">Upcoming Sessions</h4>
        <div className="grid grid-cols-2 gap-4">
          {[
            { expert: 'Lactation Consultant Jane Doe', topic: 'Breastfeeding Basics', date: 'Tomorrow 2 PM' },
            { expert: 'Nutritionist Mike Chen', topic: 'Third Trimester Nutrition', date: 'Friday 4 PM' }
          ].map((session, idx) => (
            <div key={idx} className="bg-warm-white border border-warm rounded-xl p-6 card-shadow card-shadow-hover">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-base text-primary">{session.expert}</div>
                  <div className="text-secondary text-sm mt-1">{session.topic}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-secondary">{session.date}</div>
                  <button className="text-dusty-rose text-sm font-semibold hover:text-blush mt-1">
                    Register
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMainMenu = () => (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-3 text-primary">BumpBuddies Features</h2>
        <p className="text-secondary text-lg">Explore different parts of the platform</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <button 
          onClick={() => setCurrentFlow('onboarding')}
          className="bg-warm-white border-2 border-mauve-light rounded-2xl p-10 hover:border-dusty-rose transition-all card-shadow card-shadow-hover"
        >
          <div className="text-6xl mb-4">👋</div>
          <div className="font-bold text-xl text-primary mb-2">Onboarding Flow</div>
          <div className="text-base text-secondary">New user registration</div>
        </button>

        <button 
          onClick={() => setCurrentFlow('post')}
          className="bg-warm-white border-2 border-sage-light rounded-2xl p-10 hover:border-sage transition-all card-shadow card-shadow-hover"
        >
          <div className="text-6xl mb-4">✍️</div>
          <div className="font-bold text-xl text-primary mb-2">Create Post</div>
          <div className="text-base text-secondary">Share with community</div>
        </button>

        <button 
          onClick={() => setCurrentFlow('checkin')}
          className="bg-warm-white border-2 border-blush rounded-2xl p-10 hover:border-dusty-rose transition-all card-shadow card-shadow-hover"
        >
          <div className="text-6xl mb-4">📝</div>
          <div className="font-bold text-xl text-primary mb-2">Weekly Check-in</div>
          <div className="text-base text-secondary">Track your journey</div>
        </button>

        <button 
          onClick={() => setCurrentFlow('expert')}
          className="bg-warm-white border-2 border-warm-beige rounded-2xl p-10 hover:border-mauve transition-all card-shadow card-shadow-hover"
        >
          <div className="text-6xl mb-4">👩‍⚕️</div>
          <div className="font-bold text-xl text-primary mb-2">Expert Sessions</div>
          <div className="text-base text-secondary">Q&A with professionals</div>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-warm">
      <style>{`
        /* Warm Earthy Color Palette - Based on C9A6A1 and F0EBDB */
        :root {
          --cream: #F0EBDB;
          --dusty-rose: #C9A6A1;
          --warm-white: #FDFBF7;
          --soft-beige: #E8E0D0;
          --blush: #D4B5B0;
          --mauve: #B89690;
          --mauve-light: #D2BFB9;
          --terracotta: #C88B84;
          --sage: #B5BFA8;
          --sage-light: #CDD6C0;
          --warm-beige: #DBC9B8;
          
          --text-primary: #5D4E47;
          --text-secondary: #8B7D73;
          --text-muted: #A69A8E;
          
          --border-warm: #E3D8C8;
          --shadow-warm: rgba(201, 166, 161, 0.08);
        }

        .bg-gradient-warm {
          background: linear-gradient(135deg, #F0EBDB 0%, #F8F4EB 50%, #F0EBDB 100%);
        }

        .bg-cream { background-color: var(--cream); }
        .bg-warm-white { background-color: var(--warm-white); }
        .bg-dusty-rose { background-color: var(--dusty-rose); }
        .bg-blush { background-color: var(--blush); }
        .bg-mauve { background-color: var(--mauve); }
        .bg-mauve-light { background-color: var(--mauve-light); }
        .bg-terracotta { background-color: var(--terracotta); }
        .bg-sage { background-color: var(--sage); }
        .bg-sage-light { background-color: var(--sage-light); }
        .bg-warm-beige { background-color: var(--warm-beige); }
        
        .text-primary { color: var(--text-primary); }
        .text-secondary { color: var(--text-secondary); }
        .text-muted { color: var(--text-muted); }
        
        .border-warm { border-color: var(--border-warm); }
        
        .card-shadow {
          box-shadow: 0 2px 12px var(--shadow-warm);
        }
        
        .card-shadow-hover:hover {
          box-shadow: 0 4px 20px rgba(201, 166, 161, 0.15);
        }

        .focus\\:ring-dusty-rose:focus {
          --tw-ring-color: var(--dusty-rose);
        }

        .focus\\:ring-sage:focus {
          --tw-ring-color: var(--sage);
        }

        .hover\\:bg-cream:hover {
          background-color: var(--cream);
        }

        .hover\\:bg-blush:hover {
          background-color: var(--blush);
        }

        .hover\\:bg-sage-light:hover {
          background-color: var(--sage-light);
        }

        .hover\\:border-mauve-light:hover {
          border-color: var(--mauve-light);
        }

        .hover\\:border-dusty-rose:hover {
          border-color: var(--dusty-rose);
        }

        .hover\\:border-sage:hover {
          border-color: var(--sage);
        }

        .hover\\:text-primary:hover {
          color: var(--text-primary);
        }

        .hover\\:text-blush:hover {
          color: var(--blush);
        }

        /* Animations */
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .backdrop-warm {
          backdrop-filter: blur(12px);
          background-color: rgba(253, 251, 247, 0.9);
        }
      `}</style>

      {/* Header */}
      <header className="backdrop-warm border-b border-warm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-dusty-rose flex items-center justify-center card-shadow">
              <span className="text-2xl">🤱</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-primary">BumpBuddies</h1>
              <p className="text-xs text-muted">Community Platform</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setCurrentFlow('main')}
              className="px-4 py-2 bg-mauve-light text-primary hover:bg-mauve border-0 card-shadow rounded-lg transition-all font-medium"
            >
              Main Menu
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {currentFlow === 'main' && renderMainMenu()}
        {currentFlow === 'onboarding' && renderOnboarding()}
        {currentFlow === 'post' && renderPostCreation()}
        {currentFlow === 'checkin' && renderWeeklyCheckIn()}
        {currentFlow === 'expert' && renderExpertSession()}
      </div>
    </div>
  );
};

export default AdvancedFeaturesApp;