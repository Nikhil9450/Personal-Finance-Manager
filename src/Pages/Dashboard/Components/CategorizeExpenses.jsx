import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const CategorizeExpenses = () => {
  const [categorizedExpenses, setCategorizedExpenses] = useState([]);

  const Monthly_total_data = useSelector(
    (state) => state.user.month_wise_totalExpense
  );
  const allExpenses = Monthly_total_data?.allExpenses || [];

  // Define categories and extended keywords for manual categorization
  const categories = [
    "Food & Beverages","Vegetables" ,"Electronics", "Clothing", "Entertainment", "Utilities","Grocery",
    "Transportation", "Health & Fitness", "Travel", "Education", "Home Improvement",
    "Personal Care", "Pets", "Gifts", "Renting", "Others"
  ];

  useEffect(() => {
    if (allExpenses.length > 0) {
      categorizeExpenses(allExpenses);
    }
  }, [Monthly_total_data]);

  const categorizeExpenses = (expenses) => {
    const categorized = expenses.map((expense) => {
      return {
        ...expense,
        category: getCategory(expense.description),
      };
    });
    setCategorizedExpenses(categorized);
  };

  // Function for manual categorization based on extended keywords
  const getCategory = (description) => {
    const groceryKeywords = [
        "ata", "maida", "suji", "rice", "dal", "toor dal", "moong dal", "chana dal", "urad dal", 
        "arhar dal", "besan", "sugar", "salt", "cheeni", "namak", "haldi", "mirch", "jeera", 
        "garam masala", "sambar masala", "pav bhaji masala", "chili powder", "kitchen king masala", 
        "garlic", "ginger", "laung", "tej patta", "elaichi", "ajwain", "methi", "ghee", 
        "butter", "cream", "milk", "curd", "yogurt", "paneer", "cheese", "ice cream", "tea", 
        "coffee", "chocolate", "biscuits", "cookies", "chips", "namkeen", "bhel puri", "samosa", 
        "papad", "kachori", "kurkure", "soft drink", "cold drink", "fanta", "thums up", "coca cola", 
        "pepsi", "water", "bottle", "shampoo", "soap", "detergent", "toothpaste", "toothbrush", 
        "moongphali", "roasted peanuts", "chana", "makhana", "badam", "kaju", "pista", "khajoor", 
        "dates", "tamarind", "sugarcane juice", "fruit juice", "spices", "herbs", "pickles", "jam", 
        "jelly", "sweets", "gajar ka halwa", "gulab jamun", "rasgulla", "barfi", "kheer", "peda", 
        "mithai", "golgappa", "dahi puri", "sev puri", "pani puri", "bhature", "paratha", 
        "roti", "naan", "puri", "poori", "idli", "dosa", "vada", "chapati", "paranthas", 
        "sambar", "rasam", "dal tadka", "dal fry", "biryani", "pulao", "fried rice", "khichdi", 
        "methi thepla", "kathi roll", "tikka", "pakora", "pav", "bread", "toast", "loaf", 
        "croissant", "buns", "cucumber", "tomato ketchup", "mustard sauce", "vinegar", "oil", 
        "sunflower oil", "mustard oil", "groundnut oil", "olive oil", "vanaspati", "soya sauce", 
        "honey", "fruit spread"
    ];
    
    const vegetableKeywords = [
        "potato", "onion", "tomato", "cauliflower", "carrot", "spinach", "peas", "beans", "brinjal", 
        "bitter gourd", "pumpkin", "cabbage", "bottle gourd", "ridge gourd", "sweet potato", "corn", 
        "okra", "chili", "mushroom", "fenugreek", "zucchini", "radish", "chayote", "lettuce", 
        "beetroot", "garlic", "ginger", "green chilies", "green peas", "coriander", "mint", "curry leaves", 
        "garlic greens", "kale", "squash", "eggplant", "bamboo shoots", "basil", "shallots", "spring onion", 
        "arbi", "ash gourd", "paprika", "green beans", "french beans", "kohlrabi", "pigeon pea", 
        "turmeric", "carrot leaves", "radish leaves", "lauki", "shalgam", "surti papdi", "kachauli", 
        "appleseed", "pumpkin flowers", "chili leaves", "jaggery", "drumstick", "yams", "tindora", 
        "amaranth", "karela", "thoran", "bok choy", "broad beans", "sweet pepper", "jackfruit", 
        "jackfruit seeds", "lotus stem", "spicy garlic", "paprika", "aloo", "pyaaz", "gobhi", "gajar", 
        "matar", "beans", "baingan", "karela", "lauki", "pumpkin", "band gobhi", "tori", "shakarkandi", 
        "bhindi", "mirch", "mushroom", "kheera", "methi", "corn", "mooli", "arbi", "tindora", "chukandar", 
        "lahsun", "adrak", "green chili", "lemon", "hara dhaniya", "mint", "curry patta", "hari pyaaz", 
        "gundhi", "bottle gourd", "kachri", "sarson ka saag", "ratalu", "chana", "rajma", "bamboo shoots", 
        "tinda", "methi ke patte", "gajar ka patta", "radish leaves", "bhindi", "jaivik", "baida", 
        "shalgam", "jackfruit", "shabnam", "jaivik sabzi"
    ];
    
    const foodKeywords = [
        "pizza", "burger", "sandwich", "sushi", "pasta", "salad", "snack", "cafe", "drink", 
        "beer", "wine", "cocktail", "smoothie", "breakfast", "dal makhani", "chole", "pav bhaji", 
        "idli", "dosa", "vada", "upma", "poha", "puri", "chole bhature", "kachori", "papad", 
        "raita", "aloo tikki", "pakora", "bhel puri", "sev puri", "pani puri", "chutney", "curry", 
        "korma", "khichdi", "puran poli", "gobi manchurian", "chana masala", "tandoori", "lassi", 
        "mango lassi", "masala chai", "milk tea", "sugarcane juice", "coconut water", "jaljeera", 
        "thandai", "halwa", "gulab jamun", "rasgulla", "kheer", "jalebi", "barfi", "mithai", 
        "peda", "khoya", "chikki", "ladoos", "puran poli", "mango", "banana chips", "aloo bhujia", 
        "methi thepla", "guava", "fruit chaat", "paneer tikka", "sundal", "pistachio", "khatta meetha", 
        "dahi puri", "gajar halwa", "besan ladoo", "moong dal halwa", "aloo gobi", "dal fry", 
        "cheese naan", "egg curry", "methi paratha", "sambhar rice", "keema", "kadhi", "rava upma", 
        "kachaudi", "makhani dal"
    ];
    
    const electronicsKeywords = [
        "laptop", "phone", "headphones", "tv", "tablet", "camera", "charger", "speaker", 
        "keyboard", "monitor", "smartwatch", "gaming", "console", "earphones", "gadget", "computer"
    ];
    
    const clothingKeywords = [
        "shirt", "pants", "dress", "shoes", "jacket", "coat", "sweater", "jeans", "skirt", 
        "shorts", "hat", "scarf", "gloves", "t-shirt", "socks", "jewelry", "accessory"
    ];
    
    const entertainmentKeywords = [
        "movie", "concert", "game", "theater", "play", "sport", "ticket", "show", "event", 
        "sports", "music", "band", "guitar", "dance", "party", "festival", "streaming", "tv show"
    ];
    
    const utilitiesKeywords = [
        "electricity", "water", "internet", "gas", "phone bill", "electric bill", "gas bill", 
        "mobile bill", "wifi", "subscription", "rent", "household", "maintenance", "insurance"
    ];
    
    const transportationKeywords = [
        "gas", "fuel", "taxi", "bus", "uber", "car rental", "train", "flight", "subway", 
        "ride share", "transportation", "toll", "parking"
    ];
    
    const healthKeywords = [
        "doctor", "medicine", "health", "gym", "fitness", "workout", "hospital", "clinic", 
        "appointment", "therapy", "medication", "insurance", "wellness", "trainer"
    ];
    
    const travelKeywords = [
        "hotel", "flight", "airfare", "vacation", "trip", "tour", "cruise", "destination", 
        "travel", "resort", "tourism", "sightseeing", "backpacking"
    ];
    
    const educationKeywords = [
        "tuition", "course", "book", "study", "school", "university", "college", "workshop", 
        "training", "seminar", "e-learning", "exam", "library", "education"
    ];
    
    const homeImprovementKeywords = [
        "furniture", "appliance", "renovation", "repair", "tool", "paint", "hardware", 
        "kitchen", "bathroom", "remodeling", "landscaping", "gardening"
    ];
    
    const personalCareKeywords = [
        "haircut", "beauty", "skincare", "cosmetics", "spa", "massage", "facial", "toiletries", 
        "makeup", "shampoo", "lotion", "perfume"
    ];
    
    const petsKeywords = [
        "dog", "cat", "pet food", "pet care", "vet", "grooming", "dog leash", "cat toy", 
        "animal", "pets", "pet insurance"
    ];
    
    const giftsKeywords = [
        "gift", "present", "birthday", "holiday", "wedding", "anniversary", "gift card", "charity"
    ];
    
    const rentingKeywords = [
        "rent", "lease", "apartment", "house rent", "rental", "renting", "landlord", "rent agreement", 
        "room rent", "tenant", "property rent"
    ];
    

    // Checking the description for keywords
    if (groceryKeywords.some(keyword => description.toLowerCase().includes(keyword))) {
        return "Grocery";
    }
    if (vegetableKeywords.some(keyword => description.toLowerCase().includes(keyword))) {
    return "Vegetables";
    }
    if (foodKeywords.some(keyword => description.toLowerCase().includes(keyword))) {
      return "Food & Beverages";
    }
    if (electronicsKeywords.some(keyword => description.toLowerCase().includes(keyword))) {
      return "Electronics";
    }
    if (clothingKeywords.some(keyword => description.toLowerCase().includes(keyword))) {
      return "Clothing";
    }
    if (entertainmentKeywords.some(keyword => description.toLowerCase().includes(keyword))) {
      return "Entertainment";
    }
    if (utilitiesKeywords.some(keyword => description.toLowerCase().includes(keyword))) {
      return "Utilities";
    }
    if (transportationKeywords.some(keyword => description.toLowerCase().includes(keyword))) {
      return "Transportation";
    }
    if (healthKeywords.some(keyword => description.toLowerCase().includes(keyword))) {
      return "Health & Fitness";
    }
    if (travelKeywords.some(keyword => description.toLowerCase().includes(keyword))) {
      return "Travel";
    }
    if (educationKeywords.some(keyword => description.toLowerCase().includes(keyword))) {
      return "Education";
    }
    if (homeImprovementKeywords.some(keyword => description.toLowerCase().includes(keyword))) {
      return "Home Improvement";
    }
    if (personalCareKeywords.some(keyword => description.toLowerCase().includes(keyword))) {
      return "Personal Care";
    }
    if (petsKeywords.some(keyword => description.toLowerCase().includes(keyword))) {
      return "Pets";
    }
    if (giftsKeywords.some(keyword => description.toLowerCase().includes(keyword))) {
      return "Gifts";
    }
    if (rentingKeywords.some(keyword => description.toLowerCase().includes(keyword))) {
      return "Renting";
    }

    return "Others";
  };

  // Handle the category change manually if needed
  const handleCategoryChange = (expenseId, newCategory) => {
    const updatedExpenses = categorizedExpenses.map((expense) =>
      expense.id === expenseId ? { ...expense, category: newCategory } : expense
    );
    setCategorizedExpenses(updatedExpenses);
  };

  return (
    <div>
      <h3>Categorized Expenses</h3>
      <ul>
        {categorizedExpenses.map((expense) => (
          <li key={expense.id}>
            {expense.name} - {expense.description} - {expense.expense} -{" "}
            <strong>{expense.category}</strong>
            {/* Manually change category */}
            <select
              value={expense.category}
              onChange={(e) => handleCategoryChange(expense.id, e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorizeExpenses;
