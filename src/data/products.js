const products = [
  // One Piece
{
  id: 1,
  title: "Luffy Wanted Poster Shirt",
  price: 32,
  category: "One Piece",
  image:
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
  description: "Classic anime streetwear shirt inspired by Luffy.",
  rating: 4.8,
},
  {
    id: 2,
    title: "Zoro Three Sword Shirt",
    price: 35,
    category: "One Piece",
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500",
    description: "Premium cotton shirt inspired by Roronoa Zoro.",
    rating: 4.9,
  },
  {
    id: 3,
    title: "Straw Hat Crew Shirt",
    price: 30,
    category: "One Piece",
    image:
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500",
    description: "Comfortable streetwear shirt inspired by the Straw Hat crew.",
    rating: 4.7,
  },
  {
    id: 4,
    title: "Gear Fifth Graphic Shirt",
    price: 38,
    category: "One Piece",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    description: "Bold graphic T-shirt inspired by Luffy's Gear Fifth style.",
    rating: 4.9,
  },
  {
    id: 5,
    title: "Pirate Crew Oversized Shirt",
    price: 40,
    category: "One Piece",
    image:
      "https://images.unsplash.com/photo-1503341338985-5f9f9c9c3e4b?w=500",
    description: "Oversized anime streetwear shirt for pirate fans.",
    rating: 4.8,
  },
  {
    id: 6,
    title: "Nika Oversized Hoodie",
    price: 45,
    category: "One Piece",
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500",
    description: "Premium anime-inspired oversized hoodie.",
    rating: 4.8,
  },
  {
    id: 7,
    title: "Pirate King Sneakers",
    price: 80,
    category: "One Piece",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    description: "Comfortable sneakers inspired by pirate adventures.",
    rating: 4.7,
  },
  {
    id: 8,
    title: "Straw Hat T-Shirt",
    price: 30,
    category: "One Piece",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    description: "Anime-inspired premium cotton T-shirt.",
    rating: 4.6,
  },
  {
    id: 9,
    title: "Nika Cap",
    price: 25,
    category: "One Piece",
    image:
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500",
    description: "Classic cap with an anime-inspired design.",
    rating: 4.7,
  },

  // Demon Slayer
  {
    id: 10,
    title: "Demon Slayer Watch",
    price: 75,
    category: "Demon Slayer",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500",
    description: "Anime-inspired wrist watch with a sleek Demon Slayer style.",
    rating: 4.8,
  },
  {
    id: 11,
    title: "Hashira Edition Watch",
    price: 85,
    category: "Demon Slayer",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500",
    description: "Premium watch inspired by the Hashira warriors.",
    rating: 4.9,
  },
  {
    id: 12,
    title: "Tanjiro Style Watch",
    price: 70,
    category: "Demon Slayer",
    image:
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=500",
    description: "Stylish anime-inspired watch with a classic design.",
    rating: 4.7,
  },
  {
    id: 13,
    title: "Demon Slayer Haori",
    price: 65,
    category: "Demon Slayer",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500",
    description: "Traditional anime-inspired haori streetwear.",
    rating: 4.9,
  },
  {
    id: 14,
    title: "Breathing Style T-Shirt",
    price: 32,
    category: "Demon Slayer",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500",
    description: "Comfortable T-shirt inspired by breathing styles.",
    rating: 4.6,
  },

  // Accessories
  {
    id: 15,
    title: "Anime Round Glasses",
    price: 28,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500",
    description: "Stylish round glasses for an anime-inspired streetwear look.",
    rating: 4.6,
  },
  {
    id: 16,
    title: "Anime Black Frame Glasses",
    price: 30,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500",
    description: "Minimal black-frame glasses with a modern anime aesthetic.",
    rating: 4.7,
  },
  {
    id: 17,
    title: "Anime Clear Glasses",
    price: 25,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1577803645773-f96470509666?w=500",
    description: "Lightweight clear glasses for everyday anime fashion.",
    rating: 4.5,
  },
  {
    id: 18,
    title: "Anime Street Watch",
    price: 55,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500",
    description: "Modern anime-inspired wrist watch.",
    rating: 4.5,
  },

  // Black Clover
  {
    id: 19,
    title: "Black Bulls Mask",
    price: 35,
    category: "Black Clover",
    image:
      "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=500",
    description: "Dark anime-inspired mask inspired by the Black Bulls.",
    rating: 4.8,
  },
  {
    id: 20,
    title: "Magic Knight Mask",
    price: 40,
    category: "Black Clover",
    image:
      "https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?w=500",
    description: "Fantasy-inspired mask designed for Magic Knight fans.",
    rating: 4.7,
  },
  {
    id: 21,
    title: "Asta Style Black Mask",
    price: 32,
    category: "Black Clover",
    image:
      "https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=500",
    description: "Black anime-style mask inspired by Asta's dark aesthetic.",
    rating: 4.8,
  },
  {
    id: 22,
    title: "Magic Knight Hoodie",
    price: 58,
    category: "Black Clover",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
    description: "Magic-inspired hoodie for aspiring Magic Knights.",
    rating: 4.8,
  },
  {
    id: 23,
    title: "Black Bulls T-Shirt",
    price: 38,
    category: "Black Clover",
    image:
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500",
    description: "Streetwear T-shirt inspired by the Black Bulls.",
    rating: 4.7,
  },

  // Jujutsu Kaisen
  {
    id: 24,
    title: "Cursed Energy Hoodie",
    price: 55,
    category: "Jujutsu Kaisen",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
    description: "Dark anime-inspired hoodie with cursed energy style.",
    rating: 4.9,
  },
  {
    id: 25,
    title: "Sorcerer Oversized T-Shirt",
    price: 35,
    category: "Jujutsu Kaisen",
    image:
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500",
    description: "Oversized streetwear T-shirt inspired by sorcerers.",
    rating: 4.7,
  },
  {
    id: 26,
    title: "Jujutsu Sorcerer Horse Shirt",
    price: 38,
    category: "Jujutsu Kaisen",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    description: "Anime-inspired horse graphic shirt with a Jujutsu style.",
    rating: 4.7,
  },
  {
    id: 27,
    title: "Cursed Horse Oversized Shirt",
    price: 42,
    category: "Jujutsu Kaisen",
    image:
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500",
    description: "Oversized streetwear shirt with a dark cursed-horse theme.",
    rating: 4.8,
  },
  {
    id: 28,
    title: "Sorcerer Horse Hoodie",
    price: 60,
    category: "Jujutsu Kaisen",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
    description: "Dark anime-inspired hoodie with a mystical horse design.",
    rating: 4.9,
  },

  // Solo Leveling
  {
    id: 29,
    title: "Shadow Monarch Hoodie",
    price: 70,
    category: "Solo Leveling",
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500",
    description: "Dark streetwear hoodie inspired by the Shadow Monarch.",
    rating: 4.9,
  },
  {
    id: 30,
    title: "Dungeon Hunter Jacket",
    price: 85,
    category: "Solo Leveling",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
    description: "Modern jacket inspired by dungeon hunters.",
    rating: 4.8,
  },

  // Naruto
  {
    id: 31,
    title: "Shinobi Headband",
    price: 20,
    category: "Naruto",
    image:
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500",
    description: "Anime-inspired shinobi style headband.",
    rating: 4.7,
  },
  {
    id: 32,
    title: "Hidden Leaf Hoodie",
    price: 60,
    category: "Naruto",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
    description: "Streetwear hoodie inspired by the Hidden Leaf.",
    rating: 4.8,
  },

  // Dragon Ball
  {
    id: 33,
    title: "Saiyan Training T-Shirt",
    price: 35,
    category: "Dragon Ball",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    description: "Training-inspired anime streetwear T-shirt.",
    rating: 4.8,
  },
  {
    id: 34,
    title: "Super Saiyan Hoodie",
    price: 65,
    category: "Dragon Ball",
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500",
    description: "Power-inspired hoodie for anime fans.",
    rating: 4.9,
  },

  // My Hero Academia
  {
    id: 35,
    title: "Hero Academy Backpack",
    price: 65,
    category: "My Hero Academia",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    description: "Everyday backpack inspired by hero academies.",
    rating: 4.7,
  },
  {
    id: 36,
    title: "Plus Ultra T-Shirt",
    price: 34,
    category: "My Hero Academia",
    image:
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500",
    description: "Hero-inspired premium cotton T-shirt.",
    rating: 4.6,
  },

  // Bags
  {
    id: 37,
    title: "Anime Backpack",
    price: 60,
    category: "Bags",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    description: "Stylish backpack for everyday anime adventures.",
    rating: 4.8,
  },
];

export default products;