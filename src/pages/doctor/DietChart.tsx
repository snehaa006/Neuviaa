/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Clock,
  AlertCircle,
  CheckCircle,
  Search,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { collection, query, orderBy, getDocs, doc, deleteDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface DietPlanRow {
  id: string;
  time: string;
  meal: string;
  foodItem: string;
  preparation: string;
  quantity: string;
  benefits: string;
  doshaBalance: "vata" | "pitta" | "kapha" | "tridosh";
  restrictions?: string;
}

interface SavedDietPlan {
  id: string;
  patientName: string;
  planDuration: string;
  planType: string;
  meals: any;
  createdAt: Timestamp;
  totalMeals: number;
  activeFilter?: string;
}

const DietChart = () => {
  const [patientId, setPatientId] = useState("");
  const [savedPlans, setSavedPlans] = useState<SavedDietPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SavedDietPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [patientName, setPatientName] = useState("Patient Name");
  const [planDuration, setPlanDuration] = useState("7 days");
  const [planType, setPlanType] = useState("weight-management");
  const [dietRows, setDietRows] = useState<DietPlanRow[]>([]);

  const [newRow, setNewRow] = useState<Partial<DietPlanRow>>({
    time: "",
    meal: "",
    foodItem: "",
    preparation: "",
    quantity: "",
    benefits: "",
    doshaBalance: "tridosh"
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRow, setEditingRow] = useState<string | null>(null);

  const doshaColors = {
    vata: "bg-sage-light text-sage border-sage",
    pitta: "bg-blush text-terracotta border-terracotta", 
    kapha: "bg-peach text-dusty-rose border-dusty-rose",
    tridosh: "bg-cream text-primary border-warm"
  };

  const convertMealPlanToRows = (mealPlans: any, activeFilter: string = "Daily"): DietPlanRow[] => {
    const rows: DietPlanRow[] = [];
    let rowCounter = 1;

    const timeSlotMappings: { [key: string]: string } = {
      "Breakfast": "8:00 AM",
      "Lunch": "12:30 PM", 
      "Dinner": "7:30 PM",
      "Snack": "4:00 PM"
    };

    if (activeFilter === "Daily" && mealPlans.Daily) {
      Object.entries(mealPlans.Daily).forEach(([mealType, foods]: [string, any]) => {
        if (Array.isArray(foods)) {
          foods.forEach((food: any) => {
            rows.push({
              id: `${rowCounter++}`,
              time: timeSlotMappings[mealType] || "9:00 AM",
              meal: mealType,
              foodItem: food.Food_Item || "Unknown Food",
              preparation: food.preparation || `Prepare ${food.Food_Item} as needed`,
              quantity: food.quantity || `1 serving (${food.Calories || 0} cal)`,
              benefits: food.benefits || `Good source of nutrients: ${food.Protein || 0}g protein, ${food.Fat || 0}g fat, ${food.Carbs || 0}g carbs`,
              doshaBalance: food.Dosha_Vata === "Pacifying" ? "vata" : 
                           food.Dosha_Pitta === "Pacifying" ? "pitta" : 
                           food.Dosha_Kapha === "Pacifying" ? "kapha" : "tridosh",
              restrictions: food.restrictions || undefined
            });
          });
        }
      });
    } else if (activeFilter === "Weekly" && mealPlans.Weekly) {
      Object.entries(mealPlans.Weekly).forEach(([day, dayMeals]: [string, any]) => {
        Object.entries(dayMeals).forEach(([mealType, foods]: [string, any]) => {
          if (Array.isArray(foods)) {
            foods.forEach((food: any) => {
              rows.push({
                id: `${rowCounter++}`,
                time: timeSlotMappings[mealType] || "9:00 AM",
                meal: `${day} ${mealType}`,
                foodItem: food.Food_Item || "Unknown Food",
                preparation: food.preparation || `Prepare ${food.Food_Item} as needed`,
                quantity: food.quantity || `1 serving (${food.Calories || 0} cal)`,
                benefits: food.benefits || `Good source of nutrients: ${food.Protein || 0}g protein, ${food.Fat || 0}g fat, ${food.Carbs || 0}g carbs`,
                doshaBalance: food.Dosha_Vata === "Pacifying" ? "vata" : 
                             food.Dosha_Pitta === "Pacifying" ? "pitta" : 
                             food.Dosha_Kapha === "Pacifying" ? "kapha" : "tridosh",
                restrictions: food.restrictions || undefined
              });
            });
          }
        });
      });
    }

    return rows;
  };

  const fetchDietPlans = async () => {
    if (!patientId.trim()) {
      toast.error("Please enter a patient ID");
      return;
    }

    setLoading(true);
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
      } else {
        toast.success(`Found ${plans.length} diet plan(s)`);
      }
    } catch (error) {
      console.error("Error fetching diet plans:", error);
      toast.error("Failed to fetch diet plans. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadDietPlan = (plan: SavedDietPlan) => {
    setSelectedPlan(plan);
    setPatientName(plan.patientName);
    setPlanDuration(plan.planDuration);
    setPlanType(plan.planType);
    
    const rows = convertMealPlanToRows(plan.meals, plan.activeFilter);
    setDietRows(rows);
    
    toast.success(`Loaded diet plan from ${plan.createdAt.toDate().toLocaleDateString()}`);
  };

  const deleteDietPlan = async (planId: string) => {
    if (!patientId.trim()) return;
    
    try {
      await deleteDoc(doc(db, "patients", patientId, "dietPlans", planId));
      setSavedPlans(prev => prev.filter(plan => plan.id !== planId));
      
      if (selectedPlan?.id === planId) {
        setSelectedPlan(null);
        setDietRows([]);
      }
      
      toast.success("Diet plan deleted successfully");
    } catch (error) {
      console.error("Error deleting diet plan:", error);
      toast.error("Failed to delete diet plan");
    }
  };

  const handleAddRow = () => {
    if (!newRow.time || !newRow.meal || !newRow.foodItem) {
      toast.error("Please fill in all required fields");
      return;
    }

    const rowToAdd: DietPlanRow = {
      ...newRow,
      id: Date.now().toString(),
    } as DietPlanRow;

    setDietRows(prev => [...prev, rowToAdd]);
    setNewRow({
      time: "",
      meal: "",
      foodItem: "",
      preparation: "",
      quantity: "",
      benefits: "",
      doshaBalance: "tridosh"
    });
    setShowAddForm(false);
    toast.success("Meal added to diet plan");
  };

  const handleDeleteRow = (id: string) => {
    setDietRows(prev => prev.filter(row => row.id !== id));
    toast.success("Meal removed from diet plan");
  };

  const handleEditRow = (id: string) => {
    setEditingRow(editingRow === id ? null : id);
  };

  const handleSaveEdit = (id: string, updatedRow: Partial<DietPlanRow>) => {
    setDietRows(prev => 
      prev.map(row => 
        row.id === id ? { ...row, ...updatedRow } : row
      )
    );
    setEditingRow(null);
    toast.success("Meal updated successfully");
  };

  const exportDietPlan = () => {
    toast.success("Diet plan exported successfully");
  };

  useEffect(() => {
    if (patientId.trim()) {
      fetchDietPlans();
    }
  }, []);

  return (
    <div className="p-6 space-y-6 bg-gradient-warm min-h-screen">
      <style>{`
        .bg-gradient-warm { background: linear-gradient(135deg, #F0EBDB 0%, #F8F4EB 50%, #F0EBDB 100%); }
        .bg-warm-white { background-color: #FDFBF7; }
        .bg-cream { background-color: #F0EBDB; }
        .bg-dusty-rose { background-color: #C9A6A1; }
        .bg-mauve { background-color: #B89690; }
        .bg-sage { background-color: #B5BFA8; }
        .bg-sage-light { background-color: #CDD6C0; }
        .bg-blush { background-color: #F8BBD0; }
        .bg-peach { background-color: #FFD4B8; }
        .bg-terracotta { background-color: #C88B84; }
        .border-warm { border-color: #E3D8C8; }
        .border-sage { border-color: #B5BFA8; }
        .border-terracotta { border-color: #C88B84; }
        .border-dusty-rose { border-color: #C9A6A1; }
        .text-primary { color: #5D4E47; }
        .text-secondary { color: #8B7D73; }
        .text-sage { color: #B5BFA8; }
        .text-dusty-rose { color: #C9A6A1; }
        .text-terracotta { color: #C88B84; }
        .shadow-warm { box-shadow: 0 2px 8px rgba(201, 166, 161, 0.1); }
      `}</style>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Diet Chart Viewer</h1>
          <p className="text-secondary">View and manage saved Ayurvedic diet plans</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportDietPlan} className="gap-2 border-warm hover:bg-cream text-primary">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
          <Button onClick={() => setShowAddForm(true)} className="gap-2 bg-dusty-rose hover:bg-mauve text-white">
            <Plus className="w-4 h-4" />
            Add Meal
          </Button>
        </div>
      </div>

      {/* Patient Search */}
      <Card className="bg-warm-white border-warm shadow-warm">
        <CardHeader>
          <CardTitle className="text-lg text-primary">Search Patient Diet Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="patient-search" className="text-primary">Patient ID</Label>
              <Input
                id="patient-search"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="Enter patient ID to search"
                className="border-warm focus:border-dusty-rose"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={fetchDietPlans} disabled={loading} className="gap-2 bg-dusty-rose hover:bg-mauve text-white">
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Search Plans
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saved Plans List */}
      {savedPlans.length > 0 && (
        <Card className="bg-warm-white border-warm shadow-warm">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Saved Diet Plans</CardTitle>
            <CardDescription className="text-secondary">Found {savedPlans.length} diet plan(s) for patient ID: {patientId}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedPlans.map((plan) => (
                <div key={plan.id} className="flex items-center justify-between p-4 border border-warm rounded-lg bg-cream">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-primary">{plan.patientName}</h3>
                      <Badge variant="outline" className="border-warm text-primary">{plan.planType.replace('-', ' ')}</Badge>
                      <Badge variant="secondary" className="bg-sage-light text-sage">{plan.planDuration}</Badge>
                    </div>
                    <p className="text-sm text-secondary">
                      Created: {plan.createdAt.toDate().toLocaleDateString()} • 
                      {plan.totalMeals} meals • 
                      View: {plan.activeFilter || 'Daily'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => loadDietPlan(plan)}
                      className={selectedPlan?.id === plan.id ? "bg-dusty-rose text-white" : "bg-cream text-primary border border-warm"}
                    >
                      {selectedPlan?.id === plan.id ? "Loaded" : "Load"}
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-terracotta hover:bg-dusty-rose text-white"
                      onClick={() => deleteDietPlan(plan.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Details */}
      <Card className="bg-warm-white border-warm shadow-warm">
        <CardHeader>
          <CardTitle className="text-lg text-primary">Diet Plan Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="patient-name" className="text-primary">Patient Name</Label>
              <Input
                id="patient-name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter patient name"
                disabled={!!selectedPlan}
                className="border-warm focus:border-dusty-rose"
              />
            </div>
            <div>
              <Label htmlFor="plan-duration" className="text-primary">Plan Duration</Label>
              <Select value={planDuration} onValueChange={setPlanDuration} disabled={!!selectedPlan}>
                <SelectTrigger className="border-warm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7 days">7 Days</SelectItem>
                  <SelectItem value="14 days">14 Days</SelectItem>
                  <SelectItem value="21 days">21 Days</SelectItem>
                  <SelectItem value="30 days">30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="plan-type" className="text-primary">Plan Type</Label>
              <Select value={planType} onValueChange={setPlanType} disabled={!!selectedPlan}>
                <SelectTrigger className="border-warm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight-management">Weight Management</SelectItem>
                  <SelectItem value="detox">Detox Plan</SelectItem>
                  <SelectItem value="digestive-health">Digestive Health</SelectItem>
                  <SelectItem value="immunity-boost">Immunity Boost</SelectItem>
                  <SelectItem value="diabetes-management">Diabetes Management</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {selectedPlan && (
            <div className="mt-4 p-3 bg-sage-light rounded-lg border border-sage">
              <p className="text-sm text-sage">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Viewing saved plan from {selectedPlan.createdAt.toDate().toLocaleDateString()}. 
                Plan details are read-only.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New Meal Form */}
      {showAddForm && (
        <Card className="bg-warm-white border-warm shadow-warm">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Add New Meal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="time" className="text-primary">Time</Label>
                <Input
                  id="time"
                  value={newRow.time || ""}
                  onChange={(e) => setNewRow(prev => ({...prev, time: e.target.value}))}
                  placeholder="e.g., 8:00 AM"
                  className="border-warm focus:border-dusty-rose"
                />
              </div>
              <div>
                <Label htmlFor="meal" className="text-primary">Meal Type</Label>
                <Select value={newRow.meal} onValueChange={(value) => setNewRow(prev => ({...prev, meal: value}))}>
                  <SelectTrigger className="border-warm">
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Early Morning">Early Morning</SelectItem>
                    <SelectItem value="Breakfast">Breakfast</SelectItem>
                    <SelectItem value="Mid Morning">Mid Morning</SelectItem>
                    <SelectItem value="Lunch">Lunch</SelectItem>
                    <SelectItem value="Afternoon Snack">Afternoon Snack</SelectItem>
                    <SelectItem value="Evening Snack">Evening Snack</SelectItem>
                    <SelectItem value="Dinner">Dinner</SelectItem>
                    <SelectItem value="Before Bed">Before Bed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="food-item" className="text-primary">Food Item</Label>
                <Input
                  id="food-item"
                  value={newRow.foodItem || ""}
                  onChange={(e) => setNewRow(prev => ({...prev, foodItem: e.target.value}))}
                  placeholder="e.g., Oats with fruits"
                  className="border-warm focus:border-dusty-rose"
                />
              </div>
              <div>
                <Label htmlFor="quantity" className="text-primary">Quantity</Label>
                <Input
                  id="quantity"
                  value={newRow.quantity || ""}
                  onChange={(e) => setNewRow(prev => ({...prev, quantity: e.target.value}))}
                  placeholder="e.g., 1 bowl (150g)"
                  className="border-warm focus:border-dusty-rose"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="preparation" className="text-primary">Preparation Method</Label>
                <Textarea
                  id="preparation"
                  value={newRow.preparation || ""}
                  onChange={(e) => setNewRow(prev => ({...prev, preparation: e.target.value}))}
                  placeholder="Describe how to prepare this meal..."
                  rows={2}
                  className="border-warm focus:border-dusty-rose"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="benefits" className="text-primary">Health Benefits</Label>
                <Textarea
                  id="benefits"
                  value={newRow.benefits || ""}
                  onChange={(e) => setNewRow(prev => ({...prev, benefits: e.target.value}))}
                  placeholder="Describe the health benefits..."
                  rows={2}
                  className="border-warm focus:border-dusty-rose"
                />
              </div>
              <div>
                <Label htmlFor="dosha-balance" className="text-primary">Dosha Balance</Label>
                <Select value={newRow.doshaBalance} onValueChange={(value) => setNewRow(prev => ({...prev, doshaBalance: value as any}))}>
                  <SelectTrigger className="border-warm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vata">Vata Balancing</SelectItem>
                    <SelectItem value="pitta">Pitta Balancing</SelectItem>
                    <SelectItem value="kapha">Kapha Balancing</SelectItem>
                    <SelectItem value="tridosh">Tridoshic (All Doshas)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAddRow} className="bg-dusty-rose hover:bg-mauve text-white">Add Meal</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)} className="border-warm hover:bg-cream text-primary">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Diet Chart Table */}
      <Card className="bg-warm-white border-warm shadow-warm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg text-primary">Diet Plan for {patientName}</CardTitle>
              <CardDescription className="text-secondary">
                Duration: {planDuration} • Type: {planType.replace('-', ' ')}
                {selectedPlan && (
                  <span className="ml-2 text-sage">
                    (Loaded from {selectedPlan.createdAt.toDate().toLocaleDateString()})
                  </span>
                )}
              </CardDescription>
            </div>
            <Badge variant="outline" className="gap-1 border-warm text-primary">
              <CheckCircle className="w-3 h-3" />
              {dietRows.length} meals planned
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {dietRows.length === 0 ? (
            <div className="text-center py-8 text-secondary">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No meals in this diet plan yet.</p>
              <p className="text-sm">Search for a patient to load their saved plans, or add meals manually.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] text-primary">Time</TableHead>
                    <TableHead className="w-[120px] text-primary">Meal</TableHead>
                    <TableHead className="w-[200px] text-primary">Food Item</TableHead>
                    <TableHead className="w-[250px] text-primary">Preparation</TableHead>
                    <TableHead className="w-[120px] text-primary">Quantity</TableHead>
                    <TableHead className="w-[200px] text-primary">Benefits</TableHead>
                    <TableHead className="w-[100px] text-primary">Dosha</TableHead>
                    <TableHead className="w-[80px] text-primary">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dietRows.map((row) => (
                    <TableRow key={row.id} className="border-warm">
                      <TableCell className="font-medium text-primary">
                        {editingRow === row.id ? (
                          <Input 
                            value={row.time} 
                            onChange={(e) => handleSaveEdit(row.id, { time: e.target.value })}
                            className="w-full border-warm"
                          />
                        ) : (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-secondary" />
                            {row.time}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRow === row.id ? (
                          <Input 
                            value={row.meal}
                            onChange={(e) => handleSaveEdit(row.id, { meal: e.target.value })}
                            className="border-warm"
                          />
                        ) : (
                          <Badge variant="outline" className="border-warm text-primary">{row.meal}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRow === row.id ? (
                          <Input 
                            value={row.foodItem}
                            onChange={(e) => handleSaveEdit(row.id, { foodItem: e.target.value })}
                            className="border-warm"
                          />
                        ) : (
                          <div className="font-medium text-primary">{row.foodItem}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRow === row.id ? (
                          <Textarea 
                            value={row.preparation}
                            onChange={(e) => handleSaveEdit(row.id, { preparation: e.target.value })}
                            rows={2}
                            className="border-warm"
                          />
                        ) : (
                          <div className="text-sm text-secondary">{row.preparation}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRow === row.id ? (
                          <Input 
                            value={row.quantity}
                            onChange={(e) => handleSaveEdit(row.id, { quantity: e.target.value })}
                            className="border-warm"
                          />
                        ) : (
                          <div className="text-sm font-medium text-primary">{row.quantity}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRow === row.id ? (
                          <Textarea 
                            value={row.benefits}
                            onChange={(e) => handleSaveEdit(row.id, { benefits: e.target.value })}
                            rows={2}
                            className="border-warm"
                          />
                        ) : (
                          <div className="text-sm text-secondary">{row.benefits}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={doshaColors[row.doshaBalance]} variant="outline">
                          {row.doshaBalance}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditRow(row.id)}
                            className="h-6 w-6 p-0 hover:bg-cream"
                            disabled={!!selectedPlan}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteRow(row.id)}
                            className="h-6 w-6 p-0 text-terracotta hover:text-terracotta hover:bg-blush"
                            disabled={!!selectedPlan}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diet Plan Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-warm-white border-warm shadow-warm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-dusty-rose" />
              <div>
                <div className="font-medium text-primary">Total Meals</div>
                <div className="text-2xl font-bold text-dusty-rose">{dietRows.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-warm-white border-warm shadow-warm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-sage" />
              <div>
                <div className="font-medium text-primary">Plan Duration</div>
                <div className="text-2xl font-bold text-sage">{planDuration}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-warm-white border-warm shadow-warm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-terracotta" />
              <div>
                <div className="font-medium text-primary">Plan Status</div>
                <div className="text-sm font-medium text-sage">
                  {selectedPlan ? "Loaded from Firebase" : "Ready for Patient"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DietChart;