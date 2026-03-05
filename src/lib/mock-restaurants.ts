interface MockRestaurant {
  name: string;
  cuisine: string;
  priceRange: number;
  rating: string;
  description: string;
}

const restaurantTemplates: Record<string, MockRestaurant[]> = {
  italian: [
    { name: "Trattoria del Sole", cuisine: "Italian", priceRange: 2, rating: "4.5", description: "Authentic Neapolitan pizza and handmade pasta in a cozy setting" },
    { name: "Osteria Bella", cuisine: "Italian", priceRange: 3, rating: "4.7", description: "Fine Italian dining with an extensive wine list and seasonal menu" },
    { name: "Pasta & Vino", cuisine: "Italian", priceRange: 2, rating: "4.3", description: "Casual Italian eatery known for fresh pasta and generous portions" },
  ],
  asian: [
    { name: "Golden Dragon", cuisine: "Chinese", priceRange: 2, rating: "4.4", description: "Traditional Cantonese cuisine with dim sum brunch on weekends" },
    { name: "Sakura Garden", cuisine: "Japanese", priceRange: 3, rating: "4.6", description: "Premium sushi and omakase experience with imported fish" },
    { name: "Thai Orchid", cuisine: "Thai", priceRange: 2, rating: "4.3", description: "Aromatic Thai curries and street food favorites" },
    { name: "Seoul Kitchen", cuisine: "Korean", priceRange: 2, rating: "4.5", description: "Korean BBQ and bibimbap with lively atmosphere" },
  ],
  american: [
    { name: "The Smokehouse", cuisine: "BBQ", priceRange: 2, rating: "4.4", description: "Slow-smoked meats, craft beers, and homestyle sides" },
    { name: "Liberty Burger Co.", cuisine: "American", priceRange: 1, rating: "4.2", description: "Gourmet burgers with creative toppings and hand-cut fries" },
    { name: "The Farm Table", cuisine: "Farm-to-Table", priceRange: 3, rating: "4.6", description: "Seasonal menu sourced from local farms with a rustic ambiance" },
  ],
  mexican: [
    { name: "Casa de Fuego", cuisine: "Mexican", priceRange: 2, rating: "4.5", description: "Authentic tacos, mole, and over 50 tequilas" },
    { name: "El Jardin", cuisine: "Mexican", priceRange: 2, rating: "4.3", description: "Fresh ceviche, enchiladas, and margaritas on the patio" },
  ],
  vegetarian: [
    { name: "Green Roots", cuisine: "Vegetarian", priceRange: 2, rating: "4.5", description: "Creative plant-based dishes that even meat lovers enjoy" },
    { name: "The Mindful Plate", cuisine: "Vegan", priceRange: 2, rating: "4.4", description: "Globally-inspired vegan comfort food" },
    { name: "Sprout & Seed", cuisine: "Health Food", priceRange: 2, rating: "4.3", description: "Nutrient-dense bowls, fresh juices, and raw desserts" },
  ],
  mediterranean: [
    { name: "Olive & Vine", cuisine: "Mediterranean", priceRange: 2, rating: "4.5", description: "Mezze platters, grilled meats, and fresh seafood" },
    { name: "Aegean Blue", cuisine: "Greek", priceRange: 2, rating: "4.4", description: "Traditional Greek dishes with ocean views and live music" },
  ],
  indian: [
    { name: "Saffron House", cuisine: "Indian", priceRange: 2, rating: "4.6", description: "Rich curries, fresh naan, and aromatic biryanis" },
    { name: "Spice Route", cuisine: "Indian", priceRange: 2, rating: "4.4", description: "South Indian dosas and North Indian classics" },
  ],
  fine: [
    { name: "The Gilded Fork", cuisine: "Fine Dining", priceRange: 4, rating: "4.8", description: "Multi-course tasting menus with wine pairings" },
    { name: "Maison Lumière", cuisine: "French", priceRange: 4, rating: "4.7", description: "Classic French cuisine with modern techniques" },
  ],
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateMockRestaurants(
  location: string,
  dietaryPrefs?: string
): MockRestaurant[] {
  const allRestaurants: MockRestaurant[] = [];

  // If vegetarian/vegan preferences, prioritize those
  const prefs = dietaryPrefs?.toLowerCase() || "";
  if (prefs.includes("vegetarian") || prefs.includes("vegan")) {
    allRestaurants.push(...restaurantTemplates.vegetarian);
  }

  // Add variety from different cuisines
  const cuisineTypes = Object.keys(restaurantTemplates);
  for (const type of cuisineTypes) {
    if (type !== "vegetarian") {
      allRestaurants.push(...restaurantTemplates[type]);
    }
  }

  // Shuffle and pick 4-5
  const shuffled = shuffleArray(allRestaurants);
  const count = 4 + Math.floor(Math.random() * 2); // 4 or 5
  const selected = shuffled.slice(0, count);

  // Add location context to descriptions
  return selected.map((r) => ({
    ...r,
    description: `${r.description}. Located near ${location}.`,
  }));
}
