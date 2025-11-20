import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Utensils,
  Heart,
  Zap,
  Activity,
  Sun,
  Moon,
  Coffee,
  Search,
  RefreshCw,
  User,
  Calendar,
  AlertCircle,
  ChefHat
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
// Firebase imports
import { collection, query, orderBy, getDocs, doc, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Meal = {
  id: string;
  type: "breakfast" | "lunch" | "snack" | "dinner";
  name: string;
  time: string;
  calories: number;
  status: "eaten" | "skipped" | "pending";
  notes?: string;
  preparation?: string;
  benefits?: string;
  doshaBalance?: string;
  quantity?: string;
};

type RecipeInfo = {
  loading: boolean;
  recipe?: string;
  youtube?: string;
  error?: string;
};

type SavedDietPlan = {
  id: string;
  patientName: string;
  planDuration: string;
  planType: string;
  meals: any;
  createdAt: Timestamp;
  totalMeals: number;
  activeFilter?: string;
};

const MealLogging = () => {
  const navigate = useNavigate();
  
  // Patient search and diet plan state
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [savedPlans, setSavedPlans] = useState<SavedDietPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SavedDietPlan | null>(null);
  const [loadingPlans, setLoadingPlans] = useState(false);
  
  // Meal logging state
  const [todaysMeals, setTodaysMeals] = useState<Meal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [digestionRating, setDigestionRating] = useState([3]);
  const [moodRating, setMoodRating] = useState([3]);
  const [energyRating, setEnergyRating] = useState([3]);
  const [feedbackNotes, setFeedbackNotes] = useState("");

  // Recipe search state
  const [searchFood, setSearchFood] = useState("");
  const [recipeData, setRecipeData] = useState<RecipeInfo>({ loading: false });

  // Mock recipes for fallback
  const mockRecipes: Record<string, { recipe: string; youtube?: string }> = {
    "oatmeal": { recipe: "Boil oats in milk, add honey and almonds." },
    "quinoa": { recipe: "Cook quinoa, mix with vegetables, and drizzle olive oil.", youtube: "https://www.youtube.com/watch?v=abc123" },
    "fruit salad": { recipe: "Chop seasonal fruits and mix with honey and lemon juice." }
  };

  // Convert Firebase meal plans to Meal format
  const convertDietPlanToMeals = (mealPlans: any, activeFilter: string = "Daily"): Meal[] => {
    const meals: Meal[] = [];
    let mealCounter = 1;

    const timeSlotMappings: { [key: string]: string } = {
      "Breakfast": "08:00 AM",
      "Lunch": "12:30 PM", 
      "Dinner": "07:00 PM",
      "Snack": "04:00 PM",
      "Early Morning": "06:30 AM",
      "Mid Morning": "10:00 AM",
      "Afternoon Snack": "03:00 PM",
      "Evening Snack": "05:30 PM",
      "Before Bed": "09:30 PM"
    };

    const mealTypeMapping: { [key: string]: "breakfast" | "lunch" | "snack" | "dinner" } = {
      "Breakfast": "breakfast",
      "Early Morning": "breakfast",
      "Lunch": "lunch",
      "Snack": "snack",
      "Mid Morning": "snack",
      "Afternoon Snack": "snack",
      "Evening Snack": "snack",
      "Dinner": "dinner",
      "Before Bed": "dinner"
    };

    if (activeFilter === "Daily" && mealPlans.Daily) {
      Object.entries(mealPlans.Daily).forEach(([mealType, foods]: [string, any]) => {
        if (Array.isArray(foods)) {
          foods.forEach((food: any) => {
            meals.push({
              id: `${mealCounter++}`,
              type: mealTypeMapping[mealType] || "snack",
              name: food.Food_Item || "Unknown Food",
              time: timeSlotMappings[mealType] || "09:00 AM",
              calories: parseInt(food.Calories) || 0,
              status: "pending",
              preparation: food.preparation || `Prepare ${food.Food_Item} as recommended by your Ayurvedic practitioner`,
              benefits: food.benefits || `Nutritional content: ${food.Protein || 0}g protein, ${food.Fat || 0}g fat, ${food.Carbs || 0}g carbs`,
              doshaBalance: food.Dosha_Vata === "Pacifying" ? "Vata Balancing" : 
                           food.Dosha_Pitta === "Pacifying" ? "Pitta Balancing" : 
                           food.Dosha_Kapha === "Pacifying" ? "Kapha Balancing" : "Tridoshic",
              quantity: food.quantity || "1 serving"
            });
          });
        }
      });
    }

    return meals;
  };

  // Fetch saved diet plans for a patient
  const fetchDietPlans = async () => {
    if (!patientId.trim()) {
      toast.error("Please enter a patient ID");
      return;
    }

    setLoadingPlans(true);
    try {
      const q = query(
        collection(db, "patients", patientId, "dietPlans"),
        orderBy("createdAt", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      const plans: SavedDietPlan[] = [];
      
      querySnapshot.forEach((doc) => {
        plans.push({
          id: doc.id,
          ...doc.data(),
        } as SavedDietPlan);
      });

      setSavedPlans(plans);
      
      if (plans.length === 0) {
        toast.info("No diet plans found for this patient");
        setTodaysMeals([]); // Clear meals if no plans found
      } else {
        toast.success(`Found ${plans.length} diet plan(s)`);
        // Auto-load the most recent plan
        if (plans[0]) {
          loadDietPlan(plans[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching diet plans:", error);
      toast.error("Failed to fetch diet plans. Please try again.");
      setTodaysMeals([]); // Clear meals on error
    } finally {
      setLoadingPlans(false);
    }
  };

  // Load a specific diet plan
  const loadDietPlan = (plan: SavedDietPlan) => {
    setSelectedPlan(plan);
    setPatientName(plan.patientName);
    
    const meals = convertDietPlanToMeals(plan.meals, plan.activeFilter);
    setTodaysMeals(meals);
    
    toast.success(`Loaded diet plan from ${plan.createdAt.toDate().toLocaleDateString()}`);
  };

  // Update meal status
  const updateMealStatus = (mealId: string, status: "eaten" | "skipped" | "pending", notes?: string) => {
    setTodaysMeals(prev => 
      prev.map(meal => 
        meal.id === mealId 
          ? { ...meal, status, notes: notes || meal.notes }
          : meal
      )
    );
    toast.success(`Meal marked as ${status}`);
  };

  // Save feedback to Firebase
  const saveFeedback = async () => {
    if (!patientId.trim() || !selectedMeal) {
      toast.error("Please select a meal first");
      return;
    }

    try {
      const feedbackData = {
        patientId,
        patientName,
        mealId: selectedMeal,
        mealName: todaysMeals.find(m => m.id === selectedMeal)?.name || "Unknown",
        digestionRating: digestionRating[0],
        moodRating: moodRating[0],
        energyRating: energyRating[0],
        notes: feedbackNotes,
        createdAt: Timestamp.now(),
        date: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
      };

      await addDoc(collection(db, "patients", patientId, "mealFeedback"), feedbackData);
      
      toast.success("Feedback saved successfully!");
      
      // Reset feedback form
      setSelectedMeal(null);
      setDigestionRating([3]);
      setMoodRating([3]);
      setEnergyRating([3]);
      setFeedbackNotes("");
      
    } catch (error) {
      console.error("Error saving feedback:", error);
      toast.error("Failed to save feedback. Please try again.");
    }
  };

  const getMealIcon = (type: Meal["type"]) => {
    switch (type) {
      case 'breakfast': return Sun;
      case 'lunch': return Utensils;
      case 'snack': return Coffee;
      case 'dinner': return Moon;
      default: return Utensils;
    }
  };

  const getStatusIcon = (status: Meal["status"]) => {
    switch (status) {
      case 'eaten': return <CheckCircle className="w-5 h-5 text-[#B5BFA8]" />;
      case 'skipped': return <XCircle className="w-5 h-5 text-[#C88B84]" />;
      case 'pending': return <Clock className="w-5 h-5 text-[#B89690]" />;
      default: return <Clock className="w-5 h-5 text-[#A69A8E]" />;
    }
  };

  const getStatusColor = (status: Meal["status"]) => {
    switch (status) {
      case 'eaten': return 'bg-[#CDD6C0] border-[#B5BFA8]';
      case 'skipped': return 'bg-[#F0EBDB] border-[#C88B84]';
      case 'pending': return 'bg-[#E8E0D0] border-[#D4B5B0]';
      default: return 'bg-[#FDFBF7] border-[#E3D8C8]';
    }
  };

  const getEmojiForRating = (rating: number, type: 'digestion' | 'mood' | 'energy') => {
    if (type === 'digestion') return ['😰', '😕', '😐', '😊', '😄'][rating - 1] || '😐';
    if (type === 'mood') return ['😢', '😟', '😐', '🙂', '😊'][rating - 1] || '😐';
    if (type === 'energy') return ['😴', '🥱', '😐', '⚡', '🚀'][rating - 1] || '😐';
    return '😐';
  };

  // Mock fetch function for recipes
  const fetchRecipe = async () => {
    if (!searchFood) return;
    setRecipeData({ loading: true });
    setTimeout(() => {
      const key = searchFood.toLowerCase();
      if (mockRecipes[key]) {
        setRecipeData({ loading: false, ...mockRecipes[key] });
      } else {
        setRecipeData({ 
          loading: false, 
          error: "Recipe not found", 
          youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(searchFood)}` 
        });
      }
    }, 1000);
  };

  const selectedMealData = selectedMeal ? todaysMeals.find(m => m.id === selectedMeal) : null;

  return (
    <div className="flex-1 space-y-6 p-6 bg-[#F0EBDB]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#5D4E47]">Meal Logging & Feedback</h1>
          <p className="text-[#8B7D73]">Track your personalized Ayurvedic meals and how they make you feel</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/patient/dashboard')} className="border-[#E3D8C8] text-[#5D4E47] hover:bg-[#E8E0D0]">
          Back to Dashboard
        </Button>
      </div>

      {/* Patient Search Section */}
      <Card className="bg-[#FDFBF7] border-[#E3D8C8]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#5D4E47]">
            <User className="w-5 h-5 text-[#C9A6A1]" />
            Load Patient Diet Plan
          </CardTitle>
          <CardDescription className="text-[#8B7D73]">
            Enter patient details to load their personalized Ayurvedic diet plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="patient-id" className="text-[#5D4E47]">Patient ID *</Label>
              <Input
                id="patient-id"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="Enter patient ID"
                className="border-[#E3D8C8] focus:border-[#C9A6A1]"
              />
            </div>
            <div>
              <Label htmlFor="patient-name-display" className="text-[#5D4E47]">Patient Name</Label>
              <Input
                id="patient-name-display"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Will be loaded from plan"
                disabled={!!selectedPlan}
                className="border-[#E3D8C8] focus:border-[#C9A6A1]"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={fetchDietPlans} 
                disabled={loadingPlans || !patientId.trim()} 
                className="w-full gap-2 bg-[#B89690] hover:bg-[#C9A6A1] text-white"
              >
                {loadingPlans ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Load Diet Plan
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Available Plans */}
          {savedPlans.length > 0 && (
            <div className="mt-4 space-y-2">
              <Label className="text-[#5D4E47]">Available Diet Plans:</Label>
              <div className="flex flex-wrap gap-2">
                {savedPlans.map((plan) => (
                  <Button
                    key={plan.id}
                    size="sm"
                    variant={selectedPlan?.id === plan.id ? "default" : "outline"}
                    onClick={() => loadDietPlan(plan)}
                    className={selectedPlan?.id === plan.id ? "gap-1 bg-[#B89690] text-white" : "gap-1 border-[#E3D8C8] text-[#5D4E47] hover:bg-[#E8E0D0]"}
                  >
                    <Calendar className="w-3 h-3" />
                    {plan.createdAt.toDate().toLocaleDateString()} • {plan.planType}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Current Plan Info */}
          {selectedPlan && (
            <div className="mt-4 p-3 bg-[#CDD6C0] border border-[#B5BFA8] rounded-lg">
              <div className="flex items-center gap-2 text-[#5D4E47]">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Loaded Plan:</span>
              </div>
              <p className="text-sm text-[#5D4E47] mt-1">
                {selectedPlan.patientName} • {selectedPlan.planDuration} • {selectedPlan.planType.replace('-', ' ')} 
                • Created: {selectedPlan.createdAt.toDate().toLocaleDateString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Meals Section */}
        <Card className="bg-[#FDFBF7] border-[#E3D8C8]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#5D4E47]">
              <ChefHat className="w-5 h-5 text-[#C9A6A1]" />
              Today's Ayurvedic Meals
            </CardTitle>
            <CardDescription className="text-[#8B7D73]">
              {todaysMeals.length > 0 
                ? `${todaysMeals.length} personalized meals from your diet plan` 
                : "Load a patient's diet plan to see their meals"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todaysMeals.length === 0 ? (
              <div className="text-center py-8 text-[#8B7D73]">
                <Utensils className="w-12 h-12 mx-auto mb-2 opacity-50 text-[#C9A6A1]" />
                <p className="font-medium">No meals loaded</p>
                <p className="text-sm">Enter a patient ID above to load their personalized diet plan</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todaysMeals.map((meal) => {
                  const MealIcon = getMealIcon(meal.type);
                  return (
                    <div 
                      key={meal.id} 
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${getStatusColor(meal.status)} ${selectedMeal === meal.id ? 'ring-2 ring-[#C9A6A1]' : ''}`} 
                      onClick={() => setSelectedMeal(meal.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <MealIcon className="w-5 h-5 text-[#C9A6A1]" />
                          <div>
                            <h3 className="font-semibold text-[#5D4E47]">{meal.name}</h3>
                            <p className="text-sm text-[#8B7D73]">
                              {meal.time} • {meal.calories} calories
                            </p>
                            {meal.doshaBalance && (
                              <Badge variant="outline" className="text-xs mt-1 border-[#E3D8C8] text-[#5D4E47]">
                                {meal.doshaBalance}
                              </Badge>
                            )}
                          </div>
                        </div>
                        {getStatusIcon(meal.status)}
                      </div>
                      
                      {/* Meal Details */}
                      {selectedMeal === meal.id && (
                        <div className="mt-3 pt-3 border-t border-[#E3D8C8] space-y-2">
                          {meal.quantity && (
                            <p className="text-sm text-[#5D4E47]"><strong>Quantity:</strong> {meal.quantity}</p>
                          )}
                          {meal.preparation && (
                            <p className="text-sm text-[#5D4E47]"><strong>Preparation:</strong> {meal.preparation}</p>
                          )}
                          {meal.benefits && (
                            <p className="text-sm text-[#5D4E47]"><strong>Benefits:</strong> {meal.benefits}</p>
                          )}
                          
                          {/* Status Update Buttons */}
                          <div className="flex gap-2 mt-3">
                            <Button 
                              size="sm" 
                              variant={meal.status === 'eaten' ? 'default' : 'outline'}
                              onClick={(e) => {
                                e.stopPropagation();
                                updateMealStatus(meal.id, 'eaten');
                              }}
                              className={meal.status === 'eaten' ? 'gap-1 bg-[#B5BFA8] text-white hover:bg-[#A5AF98]' : 'gap-1 border-[#E3D8C8] text-[#5D4E47] hover:bg-[#E8E0D0]'}
                            >
                              <CheckCircle className="w-3 h-3" />
                              Eaten
                            </Button>
                            <Button 
                              size="sm" 
                              variant={meal.status === 'skipped' ? 'destructive' : 'outline'}
                              onClick={(e) => {
                                e.stopPropagation();
                                updateMealStatus(meal.id, 'skipped');
                              }}
                              className={meal.status === 'skipped' ? 'gap-1 bg-[#C88B84] text-white hover:bg-[#B87B74]' : 'gap-1 border-[#E3D8C8] text-[#5D4E47] hover:bg-[#E8E0D0]'}
                            >
                              <XCircle className="w-3 h-3" />
                              Skip
                            </Button>
                            <Button 
                              size="sm" 
                              variant={meal.status === 'pending' ? 'secondary' : 'outline'}
                              onClick={(e) => {
                                e.stopPropagation();
                                updateMealStatus(meal.id, 'pending');
                              }}
                              className={meal.status === 'pending' ? 'gap-1 bg-[#D4B5B0] text-white hover:bg-[#C4A5A0]' : 'gap-1 border-[#E3D8C8] text-[#5D4E47] hover:bg-[#E8E0D0]'}
                            >
                              <Clock className="w-3 h-3" />
                              Pending
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feedback Section */}
        <Card className="bg-[#FDFBF7] border-[#E3D8C8]">
          <CardHeader>
            <CardTitle className="text-[#5D4E47]">Post-Meal Feedback</CardTitle>
            <CardDescription className="text-[#8B7D73]">
              {selectedMealData 
                ? `Rate how "${selectedMealData.name}" made you feel`
                : "Select a meal to provide feedback"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!selectedMealData ? (
              <div className="text-center py-8 text-[#8B7D73]">
                <Heart className="w-12 h-12 mx-auto mb-2 opacity-50 text-[#C9A6A1]" />
                <p>Select a meal above to provide feedback</p>
              </div>
            ) : (
              <>
                {/* Selected Meal Info */}
                <div className="p-3 bg-[#E8E0D0] rounded-lg">
                  <h4 className="font-medium text-[#5D4E47]">{selectedMealData.name}</h4>
                  <p className="text-sm text-[#8B7D73]">
                    {selectedMealData.time} • Status: {selectedMealData.status}
                  </p>
                </div>

                {/* Digestion Rating */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2 text-[#5D4E47]">
                      <Activity className="w-4 h-4 text-[#C9A6A1]" /> 
                      Digestion
                    </label>
                    <span className="text-2xl">{getEmojiForRating(digestionRating[0], 'digestion')}</span>
                  </div>
                  <Slider 
                    value={digestionRating} 
                    onValueChange={setDigestionRating} 
                    max={5} 
                    min={1} 
                    step={1} 
                    className="w-full" 
                  />
                  <div className="flex justify-between text-xs text-[#A69A8E]">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>

                {/* Mood Rating */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2 text-[#5D4E47]">
                      <Heart className="w-4 h-4 text-[#C9A6A1]" /> 
                      Mood
                    </label>
                    <span className="text-2xl">{getEmojiForRating(moodRating[0], 'mood')}</span>
                  </div>
                  <Slider 
                    value={moodRating} 
                    onValueChange={setMoodRating} 
                    max={5} 
                    min={1} 
                    step={1} 
                    className="w-full" 
                  />
                  <div className="flex justify-between text-xs text-[#A69A8E]">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>

                {/* Energy Rating */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2 text-[#5D4E47]">
                      <Zap className="w-4 h-4 text-[#C9A6A1]" /> 
                      Energy Level
                    </label>
                    <span className="text-2xl">{getEmojiForRating(energyRating[0], 'energy')}</span>
                  </div>
                  <Slider 
                    value={energyRating} 
                    onValueChange={setEnergyRating} 
                    max={5} 
                    min={1} 
                    step={1} 
                    className="w-full" 
                  />
                  <div className="flex justify-between text-xs text-[#A69A8E]">
                    <span>Tired</span>
                    <span>Energetic</span>
                  </div>
                </div>

                <Textarea 
                  placeholder="Additional notes about how this meal made you feel..." 
                  value={feedbackNotes} 
                  onChange={(e) => setFeedbackNotes(e.target.value)} 
                  rows={3}
                  className="border-[#E3D8C8] focus:border-[#C9A6A1]"
                />
                
                <Button 
                  className="w-full bg-[#B89690] hover:bg-[#C9A6A1] text-white" 
                  onClick={saveFeedback}
                  disabled={!patientId || !selectedMeal}
                >
                  Save Feedback to Patient Record
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Recipe Search Section */}
        <Card className="lg:col-span-2 bg-[#FDFBF7] border-[#E3D8C8]">
          <CardHeader>
            <CardTitle className="text-[#5D4E47]">Recipe & Preparation Guide</CardTitle>
            <CardDescription className="text-[#8B7D73]">Search for cooking instructions for your Ayurvedic meals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter food name (e.g., quinoa, oatmeal)..."
                value={searchFood}
                onChange={(e) => setSearchFood(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchRecipe()}
                className="border-[#E3D8C8] focus:border-[#C9A6A1]"
              />
              <Button onClick={fetchRecipe} className="gap-2 bg-[#B89690] hover:bg-[#C9A6A1] text-white">
                <Search className="w-4 h-4" />
                Search Recipe
              </Button>
            </div>

            {recipeData.loading && (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin text-[#C9A6A1]" />
              </div>
            )}

            {recipeData.recipe && (
              <div className="space-y-3">
                <div className="p-4 bg-[#E8E0D0] rounded-lg border border-[#E3D8C8]">
                  <h4 className="font-semibold text-[#5D4E47] mb-2">Preparation Instructions:</h4>
                  <p className="text-[#5D4E47]">{recipeData.recipe}</p>
                </div>
                {recipeData.youtube && (
                  <Button 
                    variant="outline" 
                    className="w-full gap-2 border-[#E3D8C8] text-[#5D4E47] hover:bg-[#E8E0D0]"
                    onClick={() => window.open(recipeData.youtube, '_blank')}
                  >
                    <Activity className="w-4 h-4" />
                    Watch Video Tutorial
                  </Button>
                )}
              </div>
            )}

            {recipeData.error && (
              <div className="p-4 bg-[#F0EBDB] rounded-lg border border-[#C88B84]">
                <p className="text-[#5D4E47] mb-2">{recipeData.error}</p>
                {recipeData.youtube && (
                  <Button 
                    variant="outline" 
                    className="gap-2 border-[#E3D8C8] text-[#5D4E47] hover:bg-[#E8E0D0]"
                    onClick={() => window.open(recipeData.youtube, '_blank')}
                  >
                    <Search className="w-4 h-4" />
                    Search on YouTube
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MealLogging;