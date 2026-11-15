/**
 * Restaurant-OS Digital Menu & Catalog Engine
 */

export const DEFAULT_MENU = [
  {
    id: 'dish-01',
    name: 'Paneer Butter Masala',
    category: 'Mains',
    price: 280,
    isVeg: true,
    spiceLevel: 'Medium',
    description: 'Cottage cheese cubes simmered in a rich tomato, butter, and cashew gravy.',
    inStock: true
  },
  {
    id: 'dish-02',
    name: 'Dal Makhani',
    category: 'Mains',
    price: 220,
    isVeg: true,
    spiceLevel: 'Mild',
    description: 'Slow-cooked black lentils simmered overnight with butter and fresh cream.',
    inStock: true
  },
  {
    id: 'dish-03',
    name: 'Butter Garlic Naan',
    category: 'Breads',
    price: 60,
    isVeg: true,
    spiceLevel: 'Mild',
    description: 'Crisp and fluffy tandoor-baked flatbread infused with fresh minced garlic.',
    inStock: true
  },
  {
    id: 'dish-04',
    name: 'Chicken Dum Biryani',
    category: 'Rice & Biryani',
    price: 340,
    isVeg: false,
    spiceLevel: 'Spicy',
    description: 'Fragrant long-grain basmati rice layered with marinated chicken and saffron.',
    inStock: true
  },
  {
    id: 'dish-05',
    name: 'Masala Chai',
    category: 'Beverages',
    price: 40,
    isVeg: true,
    spiceLevel: 'Mild',
    description: 'Freshly brewed Assam tea spiced with crushed cardamom, ginger, and cloves.',
    inStock: true
  },
  {
    id: 'dish-06',
    name: 'Gulab Jamun (2 Pcs)',
    category: 'Desserts',
    price: 90,
    isVeg: true,
    spiceLevel: 'Sweet',
    description: 'Warm, melt-in-the-mouth khoya dumplings soaked in fragrant cardamom sugar syrup.',
    inStock: true
  }
];

export class MenuManager {
  constructor(menu = DEFAULT_MENU) {
    this.menu = [...menu];
  }

  getItems(category = null) {
    if (!category || category === 'All') return this.menu;
    return this.menu.filter(i => i.category.toLowerCase() === category.toLowerCase());
  }

  getItemById(id) {
    return this.menu.find(i => i.id === id) || null;
  }

  searchItems(query) {
    if (!query) return this.menu;
    const q = query.toLowerCase();
    return this.menu.filter(i => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
  }
}

export const defaultMenu = new MenuManager();
