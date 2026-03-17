// data.js - Local Data Mock

window.appData = {
  categories: [
    { id: 1, name: "North Indian", image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029845/PC_Creative%20refresh/3D_bau/banners_new/North_Indian.png" },
    { id: 2, name: "Pizzas", image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029856/PC_Creative%20refresh/3D_bau/banners_new/Pizza.png" },
    { id: 3, name: "Burgers", image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029845/PC_Creative%20refresh/3D_bau/banners_new/Burger.png" },
    { id: 4, name: "Biryani", image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1675667625/PC_Creative%20refresh/Biryani_2.png" },
    { id: 5, name: "Rolls", image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029858/PC_Creative%20refresh/3D_bau/banners_new/Rolls.png" },
    { id: 6, name: "Chinese", image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029848/PC_Creative%20refresh/3D_bau/banners_new/Chinese.png" },
    { id: 7, name: "Cakes", image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029845/PC_Creative%20refresh/3D_bau/banners_new/Cakes.png" }
  ],
  restaurants: [
    {
      id: "res1",
      name: "Domino's Pizza",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400",
      rating: 3.9,
      eta: "20-25 mins",
      cuisines: "Pizzas, Italian, Pastas",
      isVeg: false,
      freeDelivery: true,
      offerText: "ITEMS AT ₹59",
      fastDelivery: true,
      menu: [
        { id: "m1", name: "Margherita Pizza", price: 149, isVeg: true, desc: "Classic cheese pizza with a tomato base." },
        { id: "m2", name: "Pepperoni Pizza", price: 299, isVeg: false, desc: "Loaded with spicy pepperoni and cheese." },
        { id: "m3", name: "Garlic Breadsticks", price: 99, isVeg: true, desc: "Freshly baked garlic bread." }
      ]
    },
    {
      id: "res2",
      name: "Get Together",
      image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&q=80&w=400",
      rating: 4.2,
      eta: "40-45 mins",
      cuisines: "North Indian, Mughlai",
      isVeg: false,
      freeDelivery: false,
      offerText: "₹50 OFF ABOVE ₹99",
      fastDelivery: false,
      menu: [
        { id: "m4", name: "Butter Chicken", price: 349, isVeg: false, desc: "Creamy tomato curry with tender chicken." },
        { id: "m5", name: "Paneer Tikka Masala", price: 289, isVeg: true, desc: "Cottage cheese cubes in spicy gravy." },
        { id: "m6", name: "Garlic Naan", price: 45, isVeg: true, desc: "Soft flatbread flavored with garlic." }
      ]
    },
    {
      id: "res3",
      name: "Tibet Kitchen",
      image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=400",
      rating: 4.5,
      eta: "40-45 mins",
      cuisines: "Chinese, Tibetan",
      isVeg: false,
      freeDelivery: false,
      offerText: "ITEMS AT ₹99",
      fastDelivery: false,
      menu: [
        { id: "m7", name: "Chicken Momos", price: 120, isVeg: false, desc: "Steamed dumplings filled with minced chicken." },
        { id: "m8", name: "Veg Hakka Noodles", price: 150, isVeg: true, desc: "Wok-tossed noodles with fresh vegetables." },
        { id: "m9", name: "Chilli Chicken", price: 220, isVeg: false, desc: "Spicy, crispy chicken tossed in soy sauce." }
      ]
    },
    {
      id: "res4",
      name: "Biryani Express",
      image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&q=80&w=400",
      rating: 3.9,
      eta: "45-50 mins",
      cuisines: "Biryani, Hyderabadi",
      isVeg: false,
      freeDelivery: false,
      offerText: "₹50 OFF ABOVE ₹99",
      fastDelivery: false,
      menu: [
        { id: "m10", name: "Chicken Hyderabadi Biryani", price: 250, isVeg: false, desc: "Aromatic basmati rice cooked with spiced chicken." },
        { id: "m11", name: "Mutton Biryani", price: 350, isVeg: false, desc: "Rich and flavorful mutton biryani." },
        { id: "m12", name: "Veg Biryani", price: 180, isVeg: true, desc: "Mixed vegetable biryani served with raita." }
      ]
    },
    {
      id: "res5",
      name: "Burger King",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
      rating: 4.3,
      eta: "30-35 mins",
      cuisines: "Burgers, American",
      isVeg: false,
      freeDelivery: true,
      offerText: "60% OFF UPTO ₹120",
      fastDelivery: true,
      menu: [
        { id: "m13", name: "Whopper", price: 199, isVeg: false, desc: "Flame-grilled beef patty with fresh toppings." },
        { id: "m14", name: "Crispy Veg Burger", price: 89, isVeg: true, desc: "Crunchy vegetable patty with mayo." },
        { id: "m15", name: "French Fries (Large)", price: 119, isVeg: true, desc: "Crispy golden completely salted fries." }
      ]
    },
    {
      id: "res6",
      name: "Salad Days",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
      rating: 4.7,
      eta: "25-30 mins",
      cuisines: "Healthy Food, Salads",
      isVeg: true,
      freeDelivery: false,
      offerText: "₹150 OFF ABOVE ₹399",
      fastDelivery: true,
      menu: [
        { id: "m16", name: "Greek Salad", price: 220, isVeg: true, desc: "Fresh cucumbers, olives, feta cheese and vinaigrette." },
        { id: "m17", name: "Caesar Salad", price: 210, isVeg: true, desc: "Lettuce, croutons, and parmesan cheese." },
        { id: "m18", name: "Avocado Toast", price: 190, isVeg: true, desc: "Mashed avocado on toasted sourdough." }
      ]
    },
    {
      id: "res7",
      name: "KFC",
      image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&q=80&w=400",
      rating: 3.8,
      eta: "35-40 mins",
      cuisines: "American, Fast Food",
      isVeg: false,
      freeDelivery: false,
      offerText: "ITEMS AT ₹129",
      fastDelivery: false,
      menu: [
        { id: "m19", name: "Hot & Crispy Chicken (4 pcs)", price: 349, isVeg: false, desc: "Signature crispy fried chicken." },
        { id: "m20", name: "Zinger Burger", price: 169, isVeg: false, desc: "Spicy chicken fillet burger." },
        { id: "m21", name: "Popcorn Chicken", price: 129, isVeg: false, desc: "Bite-sized crispy chicken pieces." }
      ]
    },
    {
      id: "res8",
      name: "Bikanervala",
      image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=400",
      rating: 4.4,
      eta: "40-45 mins",
      cuisines: "North Indian, Sweets",
      isVeg: true,
      freeDelivery: false,
      offerText: "₹100 OFF ABOVE ₹499",
      fastDelivery: false,
      menu: [
        { id: "m22", name: "Raj Kachori", price: 110, isVeg: true, desc: "Crispy shell filled with yogurt, chutneys and sprouts." },
        { id: "m23", name: "Chole Bhature", price: 160, isVeg: true, desc: "Spicy chickpea curry served with fried bread." },
        { id: "m24", name: "Rasmalai (2 pcs)", price: 90, isVeg: true, desc: "Soft cottage cheese dumplings in sweetened milk." }
      ]
    },
    {
      id: "res9",
      name: "Subway",
      image: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&q=80&w=400",
      rating: 4.1,
      eta: "20-30 mins",
      cuisines: "Healthy Food, Sandwiches",
      isVeg: false,
      freeDelivery: true,
      offerText: "Buy 1 Get 1 Free",
      fastDelivery: true,
      menu: [
        { id: "m25", name: "Roasted Chicken Sub", price: 210, isVeg: false, desc: "Tender chicken strips with fresh veggies." },
        { id: "m26", name: "Veggie Delite Sub", price: 180, isVeg: true, desc: "Classic combination of lettuce, tomatoes, and green peppers." },
        { id: "m27", name: "Chocolate Chip Cookie", price: 50, isVeg: true, desc: "Fresh baked sweet chocolate chip cookie." }
      ]
    },
    {
      id: "res10",
      name: "Starbucks Coffee",
      image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=400",
      rating: 4.6,
      eta: "15-20 mins",
      cuisines: "Beverages, Desserts",
      isVeg: false,
      freeDelivery: false,
      offerText: "Flat ₹50 OFF",
      fastDelivery: true,
      menu: [
        { id: "m28", name: "Java Chip Frappuccino", price: 295, isVeg: true, desc: "Coffee blended with chocolate chips and milk." },
        { id: "m29", name: "Mocha Cookie Crumble", price: 325, isVeg: true, desc: "Rich mocha syrup with cookie crumbles." },
        { id: "m30", name: "Butter Croissant", price: 185, isVeg: false, desc: "Flaky and buttery layered pastry." }
      ]
    },
    {
      id: "res11",
      name: "Wow! Momo",
      image: "https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?auto=format&fit=crop&q=80&w=400",
      rating: 4.2,
      eta: "30-40 mins",
      cuisines: "Tibetan, Fast Food",
      isVeg: false,
      freeDelivery: false,
      offerText: "20% OFF",
      fastDelivery: false,
      menu: [
        { id: "m31", name: "Chicken Pan Fried Momos", price: 199, isVeg: false, desc: "Spicy pan fried dumplings in schezwan sauce." },
        { id: "m32", name: "Veg Darjeeling Momos", price: 129, isVeg: true, desc: "Authentic steamed vegetable momos." },
        { id: "m33", name: "Moburg", price: 89, isVeg: false, desc: "Fried momos packed inside a burger bun." }
      ]
    },
    {
      id: "res12",
      name: "Nirula's",
      image: "https://images.unsplash.com/photo-1557142046-c704a3adf364?auto=format&fit=crop&q=80&w=400",
      rating: 4.0,
      eta: "35-45 mins",
      cuisines: "Ice Cream, Desserts",
      isVeg: true,
      freeDelivery: false,
      offerText: "FREE DELIVERY",
      fastDelivery: false,
      menu: [
        { id: "m34", name: "Hot Chocolate Fudge", price: 250, isVeg: true, desc: "Vanilla ice cream with nuts and hot chocolate fudge." },
        { id: "m35", name: "Nutty Buddy", price: 160, isVeg: true, desc: "Crunchy waffle cone loaded with nuts." },
        { id: "m36", name: "Strawberry Shake", price: 195, isVeg: true, desc: "Thick and creamy classic strawberry milkshake." }
      ]
    }
  ]
};
