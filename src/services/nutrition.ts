/**
 * CalorIA Demo - Mock Nutrition Service
 * Provides sample nutrition data for demo purposes
 */

export class NutritionService {
  static async searchFood(query: string) {
    // Mock nutrition data
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [{
      id: `demo_food_${Date.now()}`,
      name: query,
      nutrition: {
        calories: Math.floor(Math.random() * 300) + 100,
        protein: Math.floor(Math.random() * 20) + 5,
        carbs: Math.floor(Math.random() * 40) + 10,
        fat: Math.floor(Math.random() * 15) + 2,
        fiber: Math.floor(Math.random() * 8) + 1,
        sugar: Math.floor(Math.random() * 15) + 2,
        sodium: Math.floor(Math.random() * 500) + 100,
        cholesterol: 0,
        saturatedFat: Math.floor(Math.random() * 5) + 1,
        transFat: 0,
        potassium: Math.floor(Math.random() * 300) + 100,
        calcium: Math.floor(Math.random() * 100) + 20,
        iron: Math.floor(Math.random() * 3) + 1,
        vitaminA: Math.floor(Math.random() * 500) + 100,
        vitaminC: Math.floor(Math.random() * 20) + 5,
      },
      servingSize: {
        amount: 1,
        unit: 'porción',
        grams: 100,
      },
      category: 'prepared',
      verified: false,
    }];
  }
}