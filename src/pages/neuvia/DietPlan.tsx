import React, { useState } from "react";
import { Apple, Coffee, Utensils, Droplets, Plus, Minus, ArrowLeft, Star } from "lucide-react";

const DietPlan = () => {
  const [waterIntake, setWaterIntake] = useState(6);
  const [currentView, setCurrentView] = useState("today");
  const targetWater = 8;

  const dailyNutrition = {
    calories: { consumed: 1800, target: 2200 },
    protein: { consumed: 65, target: 80 },
    calcium: { consumed: 800, target: 1200 },
    iron: { consumed: 18, target: 27 }
  };

  const todayMealPlan = [
    { time: "Breakfast", icon: Coffee, foods: ["Fortified cereal with milk", "Sliced banana", "Orange juice"], calories: 420 },
    { time: "Mid-Morning", icon: Apple, foods: ["Greek yogurt", "Mixed berries"], calories: 180 },
    { time: "Lunch", icon: Utensils, foods: ["Grilled salmon", "Quinoa salad", "Steamed broccoli"], calories: 580 },
    { time: "Afternoon", icon: Apple, foods: ["Handful of almonds", "Apple slices"], calories: 220 },
    { time: "Dinner", icon: Utensils, foods: ["Lean chicken breast", "Sweet potato", "Green salad"], calories: 520 }
  ];

  const tomorrowMealPlan = [
    { time: "Breakfast", icon: Coffee, foods: ["Oatmeal with nuts", "Fresh strawberries", "Low-fat milk"], calories: 380 },
    { time: "Mid-Morning", icon: Apple, foods: ["Whole grain crackers", "Cheese slice"], calories: 200 },
    { time: "Lunch", icon: Utensils, foods: ["Grilled chicken salad", "Brown rice", "Steamed vegetables"], calories: 550 },
    { time: "Afternoon", icon: Apple, foods: ["Mixed nuts", "Orange"], calories: 190 },
    { time: "Dinner", icon: Utensils, foods: ["Baked fish", "Quinoa", "Mixed vegetables"], calories: 480 }
  ];

  const dayAfterTomorrowMealPlan = [
    { time: "Breakfast", icon: Coffee, foods: ["Whole grain toast", "Avocado spread", "Fresh orange juice"], calories: 350 },
    { time: "Mid-Morning", icon: Apple, foods: ["Greek yogurt parfait", "Granola"], calories: 210 },
    { time: "Lunch", icon: Utensils, foods: ["Lentil curry", "Brown rice", "Mixed vegetable salad"], calories: 520 },
    { time: "Afternoon", icon: Apple, foods: ["Fruit smoothie", "Whole grain crackers"], calories: 180 },
    { time: "Dinner", icon: Utensils, foods: ["Grilled tofu", "Quinoa pilaf", "Steamed broccoli"], calories: 490 }
  ];

  const supplements = [
    { name: "Prenatal Vitamin", dosage: "1 tablet daily", time: "With breakfast" },
    { name: "Folic Acid", dosage: "400 mcg", time: "Daily" },
    { name: "Iron", dosage: "27 mg", time: "With vitamin C" },
    { name: "Calcium", dosage: "1000 mg", time: "Split throughout day" }
  ];

  const incrementWater = () => {
    if (waterIntake < 12) {
      setWaterIntake(waterIntake + 1);
    }
  };

  const decrementWater = () => {
    if (waterIntake > 0) {
      setWaterIntake(waterIntake - 1);
    }
  };

  const handleNextDayPlan = () => {
    if (currentView === "today") {
      setCurrentView("tomorrow");
    } else if (currentView === "tomorrow") {
      setCurrentView("dayafter");
    } else {
      setCurrentView("today");
    }
  };

  const getCurrentMealPlan = () => {
    switch (currentView) {
      case "today": return { plan: todayMealPlan, title: "Today's Meal Plan" };
      case "tomorrow": return { plan: tomorrowMealPlan, title: "Tomorrow's Meal Plan" };
      case "dayafter": return { plan: dayAfterTomorrowMealPlan, title: "Day After Tomorrow's Meal Plan" };
      default: return { plan: todayMealPlan, title: "Today's Meal Plan" };
    }
  };

  // Navigation handlers - you can replace these with your actual navigation logic
  const handlePremiumClick = () => {
    // In your actual app, use: navigate("/premium")
    window.location.href = "patient/meal-logging";
  };

  const handleMedicineReminderClick = () => {
    // In your actual app, use: navigate("/medicine-reminder")
    window.location.href = "/medicine-reminder";
  };

  const handleBackToDashboard = () => {
    // In your actual app, use: navigate("/dashboard")
    window.location.href = "/patient/dashboard";
  };

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: 'linear-gradient(135deg, #F0EBDB 0%, #F8F4EB 50%, #F0EBDB 100%)' }}>
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #D4B5B0, #C9A6A1)' }}>
            <Apple className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#5D4E47' }}>Personalized Diet Plan</h1>
          <p style={{ color: '#8B7D73' }}>Nutrition guidance for a healthy pregnancy</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Nutrition Summary */}
            <div className="rounded-2xl shadow-xl" style={{ backgroundColor: '#FDFBF7', border: '1px solid #E3D8C8' }}>
              <div className="p-6 border-b" style={{ borderColor: '#E3D8C8' }}>
                <h3 className="text-xl font-semibold" style={{ color: '#5D4E47' }}>Today's Nutrition Progress</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(dailyNutrition).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between font-medium mb-2" style={{ color: '#5D4E47' }}>
                        <span className="capitalize">{key}</span>
                        <span>{value.consumed}/{value.target} {key === 'calories' ? 'kcal' : 'mg'}</span>
                      </div>
                      <div className="w-full rounded-full h-2" style={{ backgroundColor: '#E3D8C8' }}>
                        <div 
                          className="h-2 rounded-full transition-all" 
                          style={{ 
                            width: `${(value.consumed / value.target) * 100}%`,
                            background: 'linear-gradient(to right, #C9A6A1, #B89690)'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Meal Plan */}
            <div className="rounded-2xl shadow-xl" style={{ backgroundColor: '#FDFBF7', border: '1px solid #E3D8C8' }}>
              <div className="p-6 border-b" style={{ borderColor: '#E3D8C8' }}>
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <h3 className="text-xl font-semibold" style={{ color: '#5D4E47' }}>{getCurrentMealPlan().title}</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleNextDayPlan}
                      className="px-4 py-2 rounded-xl text-white font-medium transition-all hover:shadow-lg"
                      style={{ background: 'linear-gradient(to right, #C9A6A1, #B89690)' }}
                    >
                      {currentView === "today" ? "Tomorrow" : currentView === "tomorrow" ? "Day After" : "Today"}
                    </button>
                    <button 
                      onClick={handlePremiumClick}
                      className="px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 hover:bg-opacity-80"
                      style={{ backgroundColor: '#F0EBDB', color: '#5D4E47', border: '1px solid #E3D8C8' }}
                    >
                      <Star className="w-4 h-4" style={{ color: '#C9A6A1' }} />
                      Premium
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {getCurrentMealPlan().plan.map((meal, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-xl shadow-sm" style={{ backgroundColor: '#F8F4EB', border: '1px solid #E3D8C8' }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(to bottom right, #D4B5B0, #C9A6A1)' }}>
                      <meal.icon className="text-white w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between font-medium mb-2" style={{ color: '#5D4E47' }}>
                        <span>{meal.time}</span>
                        <span>{meal.calories} kcal</span>
                      </div>
                      <ul className="text-sm list-disc ml-5" style={{ color: '#8B7D73' }}>
                        {meal.foods.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Water Intake */}
            <div className="rounded-2xl shadow-xl" style={{ backgroundColor: '#FDFBF7', border: '1px solid #E3D8C8' }}>
              <div className="p-6 border-b" style={{ borderColor: '#E3D8C8' }}>
                <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: '#5D4E47' }}>
                  <Droplets className="w-5 h-5" style={{ color: '#B5BFA8' }} />
                  Water Intake
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold" style={{ color: '#5D4E47' }}>{waterIntake}/{targetWater}</div>
                  <p className="text-sm" style={{ color: '#8B7D73' }}>glasses today</p>
                </div>
                <div className="w-full rounded-full h-2" style={{ backgroundColor: '#E3D8C8' }}>
                  <div 
                    className="h-2 rounded-full transition-all" 
                    style={{ 
                      width: `${(waterIntake / targetWater) * 100}%`,
                      background: 'linear-gradient(to right, #B5BFA8, #CDD6C0)'
                    }}
                  ></div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={decrementWater} 
                    disabled={waterIntake <= 0}
                    className="flex-1 py-3 rounded-xl font-medium transition-all disabled:opacity-50 hover:bg-opacity-80"
                    style={{ backgroundColor: '#F0EBDB', color: '#5D4E47', border: '1px solid #E3D8C8' }}
                  >
                    <Minus className="w-4 h-4 mx-auto" />
                  </button>
                  <button 
                    onClick={incrementWater} 
                    disabled={waterIntake >= 12}
                    className="flex-1 py-3 rounded-xl text-white font-medium transition-all disabled:opacity-50 hover:shadow-lg"
                    style={{ background: 'linear-gradient(to right, #B5BFA8, #CDD6C0)' }}
                  >
                    <Plus className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            </div>

            {/* Supplements */}
            <div className="rounded-2xl shadow-xl" style={{ backgroundColor: '#FDFBF7', border: '1px solid #E3D8C8' }}>
              <div className="p-6 border-b" style={{ borderColor: '#E3D8C8' }}>
                <h3 className="text-lg font-semibold" style={{ color: '#5D4E47' }}>Daily Supplements</h3>
              </div>
              <div className="p-6 space-y-3">
                {supplements.map((item, i) => (
                  <div key={i} className="p-3 rounded-xl" style={{ backgroundColor: '#F0EBDB', border: '1px solid #E3D8C8' }}>
                    <p className="font-semibold" style={{ color: '#5D4E47' }}>{item.name}</p>
                    <p className="text-sm" style={{ color: '#8B7D73' }}>{item.dosage}</p>
                    <p className="text-xs" style={{ color: '#A69A8E' }}>{item.time}</p>
                  </div>
                ))}
                <button 
                  onClick={handleMedicineReminderClick}
                  className="w-full py-3 rounded-xl font-medium transition-all hover:bg-opacity-80"
                  style={{ backgroundColor: '#F0EBDB', color: '#5D4E47', border: '1px solid #E3D8C8' }}
                >
                  Set Reminders
                </button>
              </div>
            </div>

            {/* Premium Feature Callout */}
            <div className="rounded-2xl shadow-xl p-6" style={{ background: 'linear-gradient(to bottom right, #D4B5B0, #C9A6A1)' }}>
              <div className="flex items-start gap-3 mb-4">
                <Star className="w-6 h-6 text-white flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Unlock Premium Diet Plans</h4>
                  <p className="text-sm text-white/90">Get Ayur-Nutrigenomics personalized 7-day meal plans</p>
                </div>
              </div>
              <button 
                onClick={handlePremiumClick}
                className="w-full py-3 rounded-xl font-medium transition-all hover:shadow-lg"
                style={{ backgroundColor: 'white', color: '#C9A6A1' }}
              >
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button 
            onClick={handleBackToDashboard}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all hover:bg-opacity-80"
            style={{ backgroundColor: '#F0EBDB', color: '#5D4E47', border: '1px solid #E3D8C8' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default DietPlan;