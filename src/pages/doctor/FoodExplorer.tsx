// src/pages/doctor/FoodExplorer.tsx
import React, { useState, useMemo } from "react";
import { useFoodContext, Food } from "@/context/FoodContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus,
  Minus,
  Search,
  Filter,
  ShoppingCart,
  Leaf,
  Award,
  Info,
} from "lucide-react";
import { toast } from "sonner";

const FoodExplorer: React.FC = () => {
  const { foods, selectedFoods, addToSelectedFoods, removeFromSelectedFoods, setSelectedFoods } = useFoodContext();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFoodGroup, setSelectedFoodGroup] = useState("All");
  const [doshaFilter, setDoshaFilter] = useState("All");
  const [dietaryFilter, setDietaryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const clearAllSelected = () => {
    setSelectedFoods([]);
  };

  const categories = ["All", ...Array.from(new Set(foods.map((f) => f.Category)))];
  const foodGroups = ["All", ...Array.from(new Set(foods.map((f) => f.Food_Group)))];
  const doshaOptions = ["All", "Vata Pacifying", "Pitta Pacifying", "Kapha Pacifying"];
  const dietaryOptions = ["All", "Vegetarian", "Vegan", "Non-Vegetarian"];

  const filteredAndSortedFoods = useMemo(() => {
    const filtered = foods.filter((f) => {
      const matchesSearch = f.Food_Item.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "All" || f.Category === selectedCategory;
      const matchesFoodGroup = selectedFoodGroup === "All" || f.Food_Group === selectedFoodGroup;

      const matchesDosha =
        doshaFilter === "All" ||
        (doshaFilter === "Vata Pacifying" && f.Dosha_Vata === "Pacifying") ||
        (doshaFilter === "Pitta Pacifying" && f.Dosha_Pitta === "Pacifying") ||
        (doshaFilter === "Kapha Pacifying" && f.Dosha_Kapha === "Pacifying");

      const matchesDietary =
        dietaryFilter === "All" ||
        (dietaryFilter === "Vegetarian" && f.Vegetarian === "Yes") ||
        (dietaryFilter === "Vegan" && f.Vegan === "Yes") ||
        (dietaryFilter === "Non-Vegetarian" && f.Vegetarian === "No");

      return matchesSearch && matchesCategory && matchesFoodGroup && matchesDosha && matchesDietary;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "calories":
          return Number(b.Calories) - Number(a.Calories);
        case "protein":
          return Number(b.Protein) - Number(a.Protein);
        case "name":
        default:
          return a.Food_Item.localeCompare(b.Food_Item);
      }
    });
  }, [foods, search, selectedCategory, selectedFoodGroup, doshaFilter, dietaryFilter, sortBy]);

  const isSelected = (food: Food) => selectedFoods.some((f) => f.Food_Item === food.Food_Item);

  const getDoshaColor = (food: Food) => {
    if (food.Dosha_Vata === "Pacifying") return "bg-sage-light text-primary";
    if (food.Dosha_Pitta === "Pacifying") return "bg-blush text-primary";
    if (food.Dosha_Kapha === "Pacifying") return "bg-peach text-primary";
    return "bg-cream text-primary";
  };

  const getDoshaLabel = (food: Food) => {
    if (food.Dosha_Vata === "Pacifying") return "Vata";
    if (food.Dosha_Pitta === "Pacifying") return "Pitta";
    if (food.Dosha_Kapha === "Pacifying") return "Kapha";
    return "Neutral";
  };

  const clearAllFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedFoodGroup("All");
    setDoshaFilter("All");
    setDietaryFilter("All");
    setSortBy("name");
  };

  const addAllFiltered = () => {
    let addedCount = 0;
    filteredAndSortedFoods.forEach((food) => {
      if (!isSelected(food)) {
        addToSelectedFoods(food);
        addedCount++;
      }
    });
    if (addedCount > 0) toast.success(`Added ${addedCount} foods`);
    else toast.info("All filtered foods already selected");
  };

  const FoodCard = ({ food }: { food: Food }) => (
    <Card className="h-full hover:shadow-warm transition-shadow duration-200 bg-warm-white border-warm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg leading-tight text-primary">{food.Food_Item}</CardTitle>
          <Badge className={getDoshaColor(food)} variant="outline">
            {getDoshaLabel(food)}
          </Badge>
        </div>
        <CardDescription className="text-sm">
          <Badge variant="secondary" className="mr-1 bg-cream text-primary">{food.Category}</Badge>
          {food.Vegetarian === "Yes" && (
            <Badge variant="outline" className="mr-1 text-sage border-sage">
              <Leaf className="w-3 h-3 mr-1" />Veg
            </Badge>
          )}
          {food.Vegan === "Yes" && (
            <Badge variant="outline" className="mr-1 text-sage border-sage">
              <Award className="w-3 h-3 mr-1" />Vegan
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex justify-between">
              <span className="text-secondary">Calories:</span>
              <span className="font-medium text-primary">{food.Calories}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Protein:</span>
              <span className="font-medium text-primary">{food.Protein}g</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Carbs:</span>
              <span className="font-medium text-primary">{food.Carbs}g</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Fat:</span>
              <span className="font-medium text-primary">{food.Fat}g</span>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            {!isSelected(food) ? (
              <Button
                size="sm"
                className="flex-1 gap-1 bg-dusty-rose hover:bg-mauve text-white"
                onClick={() => {
                  addToSelectedFoods(food);
                  toast.success(`Added ${food.Food_Item}`);
                }}
              >
                <Plus className="w-3 h-3" /> Add
              </Button>
            ) : (
              <>
                <Button size="sm" disabled variant="secondary" className="bg-cream text-primary flex-1">
                  <ShoppingCart className="w-3 h-3 mr-1" /> Added
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-warm hover:bg-cream"
                  onClick={() => {
                    removeFromSelectedFoods(food);
                    toast.success(`Removed ${food.Food_Item}`);
                  }}
                >
                  <Minus className="w-3 h-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 bg-gradient-warm min-h-screen">
      <style>{`
        .bg-gradient-warm { background: linear-gradient(135deg, #F0EBDB 0%, #F8F4EB 50%, #F0EBDB 100%); }
        .bg-warm-white { background-color: #FDFBF7; }
        .bg-cream { background-color: #F0EBDB; }
        .bg-dusty-rose { background-color: #C9A6A1; }
        .bg-mauve { background-color: #B89690; }
        .bg-sage-light { background-color: #CDD6C0; }
        .bg-blush { background-color: #F8BBD0; }
        .bg-peach { background-color: #FFD4B8; }
        .border-warm { border-color: #E3D8C8; }
        .border-sage { border-color: #B5BFA8; }
        .text-primary { color: #5D4E47; }
        .text-secondary { color: #8B7D73; }
        .shadow-warm { box-shadow: 0 4px 12px rgba(201,166,161,0.15); }
      `}</style>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-primary">🍽️ Food Explorer</h1>
          <p className="text-secondary">Discover and select foods for your Ayurvedic diet plans</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 border-warm text-primary">
            <ShoppingCart className="w-3 h-3" /> {selectedFoods.length} selected
          </Badge>
          {selectedFoods.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="border-warm hover:bg-cream text-primary"
              onClick={clearAllSelected}
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6 bg-warm-white border-warm shadow-warm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2 text-primary">
              <Filter className="w-5 h-5" /> Filters & Search
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-warm hover:bg-cream text-primary" onClick={clearAllFilters}>
                Clear Filters
              </Button>
              <Button variant="outline" size="sm" className="border-warm hover:bg-cream text-primary" onClick={addAllFiltered}>
                Add All Filtered
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-warm hover:bg-cream text-primary"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              >
                {viewMode === "grid" ? "List View" : "Grid View"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-4">
            <div>
              <Label htmlFor="search" className="text-primary">Search Foods</Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Search food..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 border-warm focus:border-dusty-rose"
                />
              </div>
            </div>

            <div>
              <Label className="text-primary">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="border-warm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-primary">Food Group</Label>
              <Select value={selectedFoodGroup} onValueChange={setSelectedFoodGroup}>
                <SelectTrigger className="border-warm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {foodGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-primary">Dosha Effect</Label>
              <Select value={doshaFilter} onValueChange={setDoshaFilter}>
                <SelectTrigger className="border-warm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {doshaOptions.map((dosha) => (
                    <SelectItem key={dosha} value={dosha}>
                      {dosha}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-primary">Dietary Type</Label>
              <Select value={dietaryFilter} onValueChange={setDietaryFilter}>
                <SelectTrigger className="border-warm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dietaryOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-primary">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="border-warm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A–Z)</SelectItem>
                  <SelectItem value="calories">Calories (High → Low)</SelectItem>
                  <SelectItem value="protein">Protein (High → Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Food Display */}
      {filteredAndSortedFoods.length === 0 ? (
        <div className="text-center text-secondary mt-12">
          <Info className="w-6 h-6 mx-auto mb-2 text-dusty-rose" />
          <p>No foods match your filters.</p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : ""
          }
        >
          {filteredAndSortedFoods.map((food) => (
            <div key={food.Food_Item}>
              {viewMode === "grid" ? <FoodCard food={food} /> : <div>{food.Food_Item}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodExplorer;