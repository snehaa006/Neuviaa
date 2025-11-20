import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, User, Bot, AlertTriangle, Heart, Baby } from 'lucide-react';

const PregnancyChatbot = () => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hello! 👋 I\'m your pregnancy wellness assistant. I can help you with common pregnancy symptoms and provide gentle home remedies. Please describe any symptoms you\'re experiencing, and I\'ll do my best to help!',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Define severe symptoms that require medical attention
  const severeSymptoms = {
    anemia: ['severe fatigue', 'extreme tiredness', 'pale skin', 'shortness of breath', 'dizziness', 'cold hands', 'brittle nails', 'chest pain', 'rapid heartbeat'],
    preeclampsia: ['severe headache', 'vision changes', 'blurred vision', 'upper abdominal pain', 'sudden weight gain', 'swelling face', 'protein in urine', 'high blood pressure'],
    gestationalDiabetes: ['excessive thirst', 'frequent urination', 'extreme hunger', 'fatigue with eating', 'blurred vision', 'recurring infections'],
    miscarriageRisk: ['severe cramping', 'heavy bleeding', 'passing clots', 'severe back pain', 'sudden loss of pregnancy symptoms', 'tissue passing'],
    mentalHealth: ['severe depression', 'anxiety attacks', 'panic attacks', 'thoughts of self harm', 'unable to function', 'severe mood swings', 'hopelessness'],
    uti: ['burning urination', 'frequent urination', 'blood in urine', 'pelvic pain', 'fever with urination', 'strong smelling urine'],
    thyroidIssues: ['extreme fatigue', 'rapid weight gain', 'rapid weight loss', 'heart palpitations', 'severe mood changes', 'hair loss', 'intolerance to cold or heat']
  };

  // Define home remedies for common symptoms
  const homeRemedies = {
    'morning sickness': {
      remedies: [
        'Eat small, frequent meals throughout the day',
        'Try ginger tea or ginger candies',
        'Keep crackers by your bedside and eat a few before getting up',
        'Stay hydrated with small sips of water',
        'Avoid strong smells and spicy foods',
        'Get plenty of rest and fresh air'
      ],
      tips: 'Morning sickness typically improves after the first trimester.'
    },
    'nausea': {
      remedies: [
        'Sip on ginger tea or chew fresh ginger',
        'Try peppermint tea or peppermint candies',
        'Eat bland foods like toast, rice, or bananas',
        'Avoid empty stomach - eat small frequent meals',
        'Stay hydrated with clear fluids',
        'Take prenatal vitamins with food'
      ],
      tips: 'If nausea is severe and preventing you from keeping food down, consult your doctor.'
    },
    'heartburn': {
      remedies: [
        'Eat smaller, more frequent meals',
        'Avoid spicy, fatty, or acidic foods',
        'Sit upright for at least an hour after eating',
        'Sleep with your head elevated',
        'Try drinking milk or eating yogurt',
        'Chew gum to increase saliva production'
      ],
      tips: 'Heartburn is common in pregnancy due to hormonal changes and baby\'s growth.'
    },
    'constipation': {
      remedies: [
        'Increase fiber intake with fruits and vegetables',
        'Drink plenty of water throughout the day',
        'Try gentle exercise like walking',
        'Eat prunes or drink prune juice',
        'Establish a regular bathroom routine',
        'Consider a warm bath to help relax'
      ],
      tips: 'Avoid laxatives unless approved by your doctor. Iron supplements can worsen constipation.'
    },
    'back pain': {
      remedies: [
        'Apply warm compress to the affected area',
        'Practice good posture when sitting and standing',
        'Wear supportive, low-heeled shoes',
        'Try prenatal yoga or gentle stretching',
        'Sleep on your side with a pillow between knees',
        'Consider a maternity support belt'
      ],
      tips: 'Avoid lifting heavy objects and ask for help when needed.'
    },
    'swelling': {
      remedies: [
        'Elevate your feet when sitting or lying down',
        'Wear comfortable, supportive shoes',
        'Avoid standing for long periods',
        'Stay hydrated and reduce sodium intake',
        'Try gentle leg exercises or walking',
        'Wear compression socks if recommended'
      ],
      tips: 'Some swelling is normal, but sudden or severe swelling needs medical attention.'
    },
    'fatigue': {
      remedies: [
        'Get adequate sleep (7-9 hours per night)',
        'Take short naps during the day if needed',
        'Eat iron-rich foods and balanced meals',
        'Stay hydrated throughout the day',
        'Do light exercise like walking',
        'Ask for help with daily tasks'
      ],
      tips: 'Fatigue is common, especially in first and third trimesters.'
    },
    'leg cramps': {
      remedies: [
        'Stretch your calf muscles before bed',
        'Stay hydrated throughout the day',
        'Take warm baths before bedtime',
        'Gently massage the cramped muscle',
        'Apply heat or cold to the affected area',
        'Ensure adequate calcium and magnesium intake'
      ],
      tips: 'Leg cramps often occur at night and are common in the second and third trimesters.'
    }
  };

  const checkForSevereSymptoms = (message) => {
    const lowerMessage = message.toLowerCase();
    const foundConditions = [];

    Object.entries(severeSymptoms).forEach(([condition, symptoms]) => {
      const foundSymptoms = symptoms.filter(symptom => 
        lowerMessage.includes(symptom.toLowerCase())
      );
      if (foundSymptoms.length > 0) {
        foundConditions.push({
          condition: condition.replace(/([A-Z])/g, ' $1').toLowerCase(),
          symptoms: foundSymptoms
        });
      }
    });

    return foundConditions;
  };

  const findRelevantRemedies = (message) => {
    const lowerMessage = message.toLowerCase();
    const relevantRemedies = [];

    Object.entries(homeRemedies).forEach(([symptom, data]) => {
      if (lowerMessage.includes(symptom) || 
          (symptom === 'morning sickness' && (lowerMessage.includes('morning') || lowerMessage.includes('sick'))) ||
          (symptom === 'back pain' && lowerMessage.includes('back')) ||
          (symptom === 'leg cramps' && (lowerMessage.includes('leg') || lowerMessage.includes('cramp')))) {
        relevantRemedies.push({ symptom, ...data });
      }
    });

    return relevantRemedies;
  };

  const generateResponse = (userMessage) => {
    const severeConditions = checkForSevereSymptoms(userMessage);
    const remedies = findRelevantRemedies(userMessage);

    if (severeConditions.length > 0) {
      return {
        type: 'alert',
        content: `⚠️ **IMPORTANT MEDICAL ALERT** ⚠️\n\nBased on your symptoms, you may be experiencing signs of: **${severeConditions.map(c => c.condition).join(', ')}**\n\n**Please consult your doctor immediately or log in your symptoms for detailed analysis.**\n\nYour health and your baby's health are the top priority. Don't hesitate to seek professional medical care.`,
        severe: true
      };
    }

    if (remedies.length > 0) {
      let response = `I understand you're experiencing ${remedies.map(r => r.symptom).join(' and ')}. Here are some safe home remedies that may help:\n\n`;
      
      remedies.forEach((remedy, index) => {
        response += `**For ${remedy.symptom}:**\n`;
        remedy.remedies.forEach((r, i) => {
          response += `${i + 1}. ${r}\n`;
        });
        response += `\n💡 *${remedy.tips}*\n\n`;
      });

      response += `**Important:** These are general suggestions. Always consult with your healthcare provider before trying new remedies, especially if symptoms persist or worsen.\n\nIs there anything specific about these symptoms you'd like to know more about?`;
      
      return {
        type: 'remedy',
        content: response
      };
    }

    // General response for unrecognized symptoms
    return {
      type: 'general',
      content: `I want to help you with your pregnancy concerns. Could you please describe your symptoms more specifically? I can provide guidance for common pregnancy symptoms like:\n\n• Morning sickness/nausea\n• Heartburn\n• Constipation\n• Back pain\n• Swelling\n• Fatigue\n• Leg cramps\n\nRemember, if you're experiencing any severe or concerning symptoms, it's always best to consult with your healthcare provider. Your well-being is most important! 💗`
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateResponse(inputMessage);
      const botMessage = {
        type: 'bot',
        content: botResponse.content,
        timestamp: new Date(),
        isAlert: botResponse.type === 'alert',
        isRemedy: botResponse.type === 'remedy'
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col" style={{background: 'linear-gradient(135deg, #F0EBDB 0%, #F8F4EB 50%, #F0EBDB 100%)'}}>
      <style>{`
        :root {
          --cream: #F0EBDB;
          --dusty-rose: #C9A6A1;
          --warm-white: #FDFBF7;
          --blush: #D4B5B0;
          --mauve: #B89690;
          --mauve-light: #D2BFB9;
          --sage: #B5BFA8;
          --sage-light: #CDD6C0;
          --text-primary: #5D4E47;
          --text-secondary: #8B7D73;
        }
      `}</style>
      
      {/* Header */}
      <div className="bg-white shadow-lg p-4 flex items-center" style={{borderBottom: '4px solid #D2BFB9'}}>
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full" style={{backgroundColor: '#D2BFB9'}}>
            <Baby className="h-6 w-6" style={{color: '#5D4E47'}} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{color: '#5D4E47'}}>Pregnancy Wellness Assistant</h1>
            <p className="text-sm" style={{color: '#8B7D73'}}>Your caring companion for pregnancy symptoms</p>
          </div>
        </div>
        <div className="ml-auto flex items-center">
          <Heart className="h-5 w-5 mr-2" style={{color: '#C9A6A1'}} />
          <span className="text-sm" style={{color: '#8B7D73'}}>Always here to help</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 ${
              message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.type === 'bot' && (
              <div className="p-2 rounded-full flex-shrink-0" style={{backgroundColor: '#D2BFB9'}}>
                <Bot className="h-5 w-5" style={{color: '#5D4E47'}} />
              </div>
            )}
            
            <div
              className={`max-w-lg p-4 rounded-lg ${
                message.type === 'user'
                  ? 'text-white'
                  : message.isAlert
                  ? 'bg-red-50 border-2 border-red-200 text-red-800'
                  : message.isRemedy
                  ? 'border'
                  : 'bg-white border'
              }`}
              style={
                message.type === 'user' 
                  ? {backgroundColor: '#C9A6A1'} 
                  : message.isRemedy
                  ? {backgroundColor: '#CDD6C0', borderColor: '#B5BFA8', color: '#5D4E47'}
                  : {borderColor: '#E3D8C8', color: '#5D4E47'}
              }
            >
              {message.isAlert && (
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="font-semibold text-red-600">Medical Alert</span>
                </div>
              )}
              
              <div className="whitespace-pre-line">
                {message.content.split('\n').map((line, i) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <div key={i} className="font-bold my-1">{line.slice(2, -2)}</div>;
                  }
                  if (line.startsWith('*') && line.endsWith('*')) {
                    return <div key={i} className="italic text-sm opacity-80 my-1">{line.slice(1, -1)}</div>;
                  }
                  if (line.startsWith('•')) {
                    return <div key={i} className="ml-4 my-1">{line}</div>;
                  }
                  return <div key={i} className="my-1">{line}</div>;
                })}
              </div>
              
              <div className="text-xs opacity-60 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>

            {message.type === 'user' && (
              <div className="p-2 rounded-full flex-shrink-0" style={{backgroundColor: '#D2BFB9'}}>
                <User className="h-5 w-5" style={{color: '#5D4E47'}} />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-full" style={{backgroundColor: '#D2BFB9'}}>
              <Bot className="h-5 w-5" style={{color: '#5D4E47'}} />
            </div>
            <div className="bg-white border rounded-lg p-4" style={{borderColor: '#E3D8C8'}}>
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full animate-bounce" style={{backgroundColor: '#B89690'}}></div>
                <div className="w-2 h-2 rounded-full animate-bounce" style={{backgroundColor: '#B89690', animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 rounded-full animate-bounce" style={{backgroundColor: '#B89690', animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4" style={{borderTop: '1px solid #E3D8C8'}}>
        <div className="flex space-x-3">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your symptoms or concerns here..."
            className="flex-1 border rounded-lg p-3 resize-none focus:ring-2 focus:border-transparent"
            style={{borderColor: '#E3D8C8'}}
            rows="2"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="hover:opacity-90 disabled:bg-gray-300 text-white p-3 rounded-lg transition-colors"
            style={{backgroundColor: '#C9A6A1'}}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mt-2 text-xs text-center" style={{color: '#8B7D73'}}>
          💡 Example: "I'm having morning sickness" or "I feel dizzy and have severe headaches"
        </div>
      </div>
    </div>
  );
};

export default PregnancyChatbot;