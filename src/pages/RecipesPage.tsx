// pages/RecipesPage.tsx
// Updated with free Overpass API integration

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChefHat,
  Clock,
  Users,
  Play,
  Heart,
  MapPin,
  Star,
  MessageCircle,
  Share2,
  Utensils,
  Apple,
  Salad,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import SpotifyEmbedPlayer from "@/components/SpotifyEmbedPlayer";
import { useEffect, useState } from "react";
// import { fetchHealthyRestaurants, getUserLocation, type Restaurant } from "@/services/placesService";
import { fetchHealthyRestaurants,getUserLocation,type Restaurant } from "../services/placesService";
const RecipesPage = () => {
  const [nearbyRestaurants, setNearbyRestaurants] = useState<Restaurant[]>([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const cheatMeals = [
    {
      id: 1,
      name: "Ultimate Burger Stack",
      image: "🍔",
      time: "30 min",
      difficulty: "Easy",
      calories: "850 cal",
      description: "Juicy beef patty with crispy bacon and melted cheese",
    },
    {
      id: 2,
      name: "Loaded Pizza",
      image: "🍕",
      time: "45 min",
      difficulty: "Medium",
      calories: "720 cal",
      description: "Homemade pizza with all your favorite toppings",
    },
    {
      id: 3,
      name: "Chocolate Brownies",
      image: "🍫",
      time: "25 min",
      difficulty: "Easy",
      calories: "420 cal",
      description: "Fudgy chocolate brownies with nuts",
    },
  ];

  const healthyMeals = [
    {
      id: 1,
      name: "Quinoa Power Bowl",
      image: "🥗",
      time: "20 min",
      difficulty: "Easy",
      calories: "380 cal",
      description: "Nutrient-packed bowl with quinoa, vegetables, and protein",
    },
    {
      id: 2,
      name: "Grilled Salmon",
      image: "🐟",
      time: "25 min",
      difficulty: "Medium",
      calories: "320 cal",
      description: "Omega-3 rich salmon with roasted vegetables",
    },
    {
      id: 3,
      name: "Green Smoothie",
      image: "🥤",
      time: "5 min",
      difficulty: "Easy",
      calories: "180 cal",
      description: "Refreshing blend of spinach, fruits, and protein",
    },
  ];

  const diets = [
    {
      name: "Mediterranean",
      description: "Heart-healthy with olive oil, fish, and vegetables",
      color: "bg-blue-100 text-blue-800",
    },
    {
      name: "Keto",
      description: "Low-carb, high-fat for weight management",
      color: "bg-green-100 text-green-800",
    },
    {
      name: "Vegan",
      description: "Plant-based nutrition for health and environment",
      color: "bg-purple-100 text-purple-800",
    },
    {
      name: "Paleo",
      description: "Whole foods based on ancestral eating patterns",
      color: "bg-orange-100 text-orange-800",
    },
  ];

  const dishOfTheDay = {
    name: "Avocado Toast Supreme",
    image: "🥑",
    description: "Perfectly ripe avocado on sourdough with poached egg and everything seasoning",
    chef: "Chef Maria",
    rating: 4.8,
    time: "15 min",
  };

  // Fetch restaurants on mount
// inside RecipesPage component (replace existing useEffect)
useEffect(() => {
  const loadRestaurants = async () => {
    setLoadingRestaurants(true);

    // small helper to add timeout to the API call
    const withTimeout = <T,>(p: Promise<T>, ms = 10000) =>
      Promise.race([
        p,
        new Promise<T>((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), ms)
        ),
      ]);

    try {
      const location = await getUserLocation();
      setUserLocation(location);

      // fetch with 10s timeout
      const restaurants = await withTimeout(
        fetchHealthyRestaurants(location.lat, location.lng, 2),
        10000
      );
      setNearbyRestaurants(restaurants);
    } catch (error) {
      console.error("Error loading restaurants (or timed out):", error);

      // try a quick fallback call without location (fast)
      try {
        const fallback = await Promise.race([
          fetchHealthyRestaurants(),
          new Promise<Restaurant[]>((_, reject) =>
            setTimeout(() => reject(new Error("fallback-timeout")), 5000)
          ),
        ]);
        setNearbyRestaurants(fallback);
      } catch (err2) {
        console.warn("Fallback failed:", err2);
        setNearbyRestaurants([]); // give up, show empty state
      }
    } finally {
      setLoadingRestaurants(false);
    }
  };

  loadRestaurants();
}, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-28 py-8 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Fuel Your <span className="text-primary">Fitness Journey</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover delicious recipes, nutrition tips, and food inspiration to complement your workouts
          </p>
        </div>

        {/* Dish of the Day */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-100 border-blue-400 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 hover:scale-[1.02]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Star className="h-5 w-5" />
              Dish of the Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="text-6xl">{dishOfTheDay.image}</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-blue-900">{dishOfTheDay.name}</h3>
                <p className="text-blue-700 mb-2">{dishOfTheDay.description}</p>
                <div className="flex items-center gap-4 text-sm text-blue-600">
                  <span>By {dishOfTheDay.chef}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{dishOfTheDay.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{dishOfTheDay.time}</span>
                  </div>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all">
                Get Recipe
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Cheat Meals */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border hover:border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                Cheat Meals
              </CardTitle>
              <CardDescription>Indulge responsibly with these delicious treats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cheatMeals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex items-center gap-4 p-4 border border-border rounded-lg hover:border-primary/50 transition-all hover:shadow-md hover:scale-[1.02]"
                >
                  <div className="text-3xl">{meal.image}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{meal.name}</h4>
                    <p className="text-sm text-muted-foreground">{meal.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {meal.time}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {meal.calories}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="hover:bg-red-50 hover:text-red-600 transition-all"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Healthy Meals */}
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border hover:border-secondary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Salad className="h-5 w-5" />
                Healthy Meals
              </CardTitle>
              <CardDescription>Nutritious recipes to fuel your workouts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {healthyMeals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex items-center gap-4 p-4 border border-border rounded-lg hover:border-secondary/50 transition-all hover:shadow-md hover:scale-[1.02]"
                >
                  <div className="text-3xl">{meal.image}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{meal.name}</h4>
                    <p className="text-sm text-muted-foreground">{meal.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {meal.time}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {meal.calories}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="hover:bg-green-50 hover:text-green-600 transition-all"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Spotify Playlists */}
        <SpotifyEmbedPlayer />

        {/* Diet Information */}
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Apple className="h-5 w-5" />
              Popular Diets
            </CardTitle>
            <CardDescription>Learn about different dietary approaches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {diets.map((diet, index) => (
                <div
                  key={index}
                  className="p-4 border border-border rounded-lg hover:shadow-md hover:scale-[1.02] transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{diet.name}</h4>
                    <Badge className={diet.color}>{diet.name}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{diet.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        
{/* Restaurants Nearby */}
<Card className="shadow-lg hover:shadow-xl transition-all duration-300">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <MapPin className="h-5 w-5" />
      Restaurants Nearby
    </CardTitle>

    <CardDescription>
      Healthy dining options
      {userLocation &&
        ` near (${userLocation.lat.toFixed(2)}, ${userLocation.lng.toFixed(2)})`}
    </CardDescription>
  </CardHeader>

  <CardContent>
    {loadingRestaurants ? (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        <span className="text-muted-foreground">
          Finding healthy places near you...
        </span>
      </div>
    ) : nearbyRestaurants.length === 0 ? (
      <p className="text-sm text-muted-foreground py-6">
        No restaurants found nearby.
      </p>
    ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nearbyRestaurants.map((restaurant, index) => {
          const mapsUrl =
            restaurant.mapsUrl ||
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${restaurant.name} ${restaurant.address || ""}`
            )}`;

          const FALLBACK_IMAGE =
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop";

          const imageUrl = restaurant.image || FALLBACK_IMAGE;

          return (
            <a
              key={index}
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl overflow-hidden border border-border bg-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="h-44 overflow-hidden bg-muted relative">
                <img
                  src={imageUrl}
                  alt={restaurant.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Distance badge */}
                {restaurant.distance && (
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {restaurant.distance} km
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition">
                  {restaurant.name}
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {restaurant.address || "Address not available"}
                </p>

                <div className="flex items-center justify-between mt-2">
                  {/* Rating */}
                  {restaurant.rating ? (
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      {restaurant.rating}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      No rating
                    </span>
                  )}

                  {/* Cuisine */}
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">
                    {restaurant.cuisine || "Restaurant"}
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    )}
  </CardContent>
</Card>

        {/* Food Memories Community Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-100 border-blue-400 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 hover:scale-[1.02]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <MessageCircle className="h-5 w-5" />
              Share Your Food Memories
            </CardTitle>
            <CardDescription className="text-blue-700">
              Connect with the community and share your favorite food experiences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🍽️</div>
                <div>
                  <div className="font-semibold text-blue-800">Join the Food Community</div>
                  <div className="text-sm text-blue-600">
                    Share recipes, memories, and connect with fellow food lovers
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-blue-400 text-blue-700 hover:bg-blue-100 shadow-md hover:shadow-lg transition-all"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Memory
                </Button>
                <Link to="/community">
                  <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all">
                    <Users className="h-4 w-4 mr-2" />
                    Join Community
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecipesPage;