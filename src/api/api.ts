import axios, { type AxiosInstance } from 'axios';

// Конфигурация API URL в зависимости от окружения
const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    return 'https://admin.burspb.com/data/v1';
  }
  return '/api/data/v1';
};


// Экспортируемая функция для получения API URL
export const getApiUrl = (endpoint: string = '') => {
  const baseUrl = getApiBaseUrl();
  return endpoint ? `${baseUrl}/${endpoint.replace(/^\//, '')}` : baseUrl;
};

// Функция для получения URL файлов (статические ресурсы)
export const getFileUrl = (path: string) => {
  const baseUrl = import.meta.env.DEV ? 'https://admin.burspb.com' : '';
  return `${baseUrl}/api/files/${path.replace(/^\//, '')}`;
};

// Определение типов для API
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

// Типы для глобальных данных
export interface GlobalsData {
  siteTitle: string;
  favicon: string | null;
  logo: {
    default: string;
    footer: string;
    dev: string;
  };
  navigation: {
    main: Array<{
      nav_id: number;
      object_id: string;
      parent: boolean | string;
      icon: string;
      title: string;
      slug: string;
    }>;
    categories: Array<any>;
    categories_full: Array<any>;
    locations: Array<any>;
  };
  contact: {
    address: string;
    phone: string;
    phone_alt: string;
    email: string;
    entity: string;
    working_days: string;
    working_hours: string;
    coordinates: string;
  };
  social: Array<{
    title: string;
    url: string;
    icon: string;
  }>;
}

// Основные типы данных
export interface Product {
  id: number;
  slug: string;
  title: string;
  content: string;
  price: number;
  image: string;
  // Дополнительные поля по необходимости
}

export interface Post {
  id: number;
  slug: string;
  title: string;
  content: string;
  date: string;
  modified: string;
  author: string;
  img: {
    full: string;
    square_350: string;
    webp_full: string | null;
    webp_square_350: string | null;
    alt: {
      title: string;
      description: string;
    }
  };
  category: Array<{
    id: number;
    title: string;
    slug: string;
    parent: null | number;
  }>;
  meta: {
    priority_category: string;
    read_time: string | null;
    views: number;
  };
  excerpt: string | null;
  blocks?: {
    gratitude?: any;
    comments?: boolean;
  };
  breadcrumbs?: Array<{
    title: string;
    slug: string;
  }>;
  similar?: Array<any>;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  // Дополнительные поля по необходимости
}

export interface Page {
  id: number;
  slug: string;
  title: string;
  content: string;
  // Дополнительные поля по необходимости
}

// Типы для блоков
export interface SliderBlock {
  // Структура для блока слайдера
}

export interface BenefitsBlock {
  content: Array<{
    id: number;
    title: string;
    description: string;
    icon: string;
  }>;
}

// Другие блоки...

// Типы для форм
export interface HelpForm {
  name: string;
  phone: string;
  email?: string;
  message: string;
  type?: string;
}

export interface CallMeForm {
  name: string;
  phone: string;
}

export interface CostForm {
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  city: string;
  inn?: string;
  payment: string;
  type: string;
  weight: number | string;
}

export interface OrderForm {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  comment?: string;
  products: {
    id: number;
    quantity: number;
  }[];
}

export interface QuickOrderForm {
  name: string;
  phone: string;
  productId: number;
}

// Создание экземпляра axios
const api: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Кеш для хранения данных globals
let globalsCache: Promise<ApiResponse<GlobalsData>> | null = null;

// API сервис
const apiService = {
  // Метод для получения глобальных настроек с кешированием
  getGlobals: (): Promise<ApiResponse<GlobalsData>> => {
    if (globalsCache === null) {
      // Если кеш пуст, выполняем запрос и сохраняем промис в кеше
      globalsCache = api.get('/globals').then(response => ({
        data: response.data,
        status: response.status,
        statusText: response.statusText
      }));
    }
    
    // Возвращаем кешированный результат
    return globalsCache;
  },
  
  // Методы для получения данных о продуктах
  products: {
    getAll: (): Promise<ApiResponse<Product[]>> => 
      api.get('/products').then(response => ({
        data: response.data,
        status: response.status,
        statusText: response.statusText
      })),
    
    getById: (id: number): Promise<ApiResponse<Product>> => 
      api.get(`/product/${id}`).then(response => ({
        data: response.data,
        status: response.status,
        statusText: response.statusText
      })),
    
    getBySlug: (slug: string): Promise<ApiResponse<Product>> => 
      api.get(`/product/slug/${slug}`).then(response => ({
        data: response.data,
        status: response.status,
        statusText: response.statusText
      })),
    
    filter: (params?: Record<string, any>): Promise<ApiResponse<Product[]>> => 
      api.get('/products/filter', { params }).then(response => ({
        data: response.data,
        status: response.status,
        statusText: response.statusText
      })),
  },
  
  // Методы для категорий
  categories: {
    getById: (id: number): Promise<ApiResponse<Category>> => 
      api.get(`/category/${id}`).then(response => ({
        data: response.data,
        status: response.status,
        statusText: response.statusText
      })),
    
    getBySlug: (slug: string): Promise<ApiResponse<Category>> => 
      api.get(`/category/slug/${slug}`).then(response => ({
        data: response.data,
        status: response.status,
        statusText: response.statusText
      })),
  },
  
  // Методы для постов
  posts: {
    getAll: (): Promise<ApiResponse<Post[]>> => 
      api.get('/posts').then(response => ({
        data: response.data,
        status: response.status,
        statusText: response.statusText
      })),
    
    getById: (id: number): Promise<ApiResponse<Post>> => 
      api.get(`/post/${id}`).then(response => ({
        data: response.data,
        status: response.status,
        statusText: response.statusText
      })),
    
    getBySlug: (slug: string): Promise<ApiResponse<Post>> => 
      api.get(`/post/slug/${slug}`).then(response => ({
        data: response.data,
        status: response.status,
        statusText: response.statusText
      })),
    
    getByCategory: (categorySlug: string): Promise<ApiResponse<Post[]>> => 
      api.get(`/posts/category/${categorySlug}`).then(response => ({
        data: response.data,
        status: response.status,
        statusText: response.statusText
      })),
  },
  
  // Методы для страниц
  pages: {
    getById: (id: number): Promise<ApiResponse<Page>> => 
      api.get(`/page/${id}`).then(response => ({
        data: response.data,
        status: response.status,
        statusText: response.statusText
      })),
    
    getBySlug: (slug: string): Promise<ApiResponse<Page>> => 
      api.get(`/page/slug/${slug}`).then(response => ({
        data: response.data,
        status: response.status,
        statusText: response.statusText
      })),
  },
  
  // Методы для блоков
  blocks: {
    getSlider: (): Promise<ApiResponse<SliderBlock>> => 
      api.get('/block/slider').then(response => ({
        data: response.data,
        status: response.status,
        statusText: response.statusText
      })),
    
    getBenefits: (): Promise<ApiResponse<BenefitsBlock>> => 
      api.get('/block/benefits').then(response => ({
        data: response.data,
        status: response.status,
        statusText: response.statusText
      })),
    
    getPartnership: (): Promise<ApiResponse<any>> => 
      api.get('/block/partnership').then(response => ({
        data: response.data,
        status: response.status,
        statusText: response.statusText
      })),
    
    getPopular: (): Promise<ApiResponse<any>> => 
      api.get('/block/popular').then(response => ({
        data: response.data,
        status: response.status,
        statusText: response.statusText
      })),
    
    getGratitude: (): Promise<ApiResponse<any>> => 
      api.get('/block/gratitude').then(response => ({
        data: response.data,
        status: response.status,
        statusText: response.statusText
      })),
    
    getCover: (): Promise<ApiResponse<any>> => 
      api.get('/block/cover').then(response => ({
        data: response.data,
        status: response.status,
        statusText: response.statusText
      })),
    
    getSeo: (): Promise<ApiResponse<any>> => 
      api.get('/block/seo').then(response => ({
        data: response.data,
        status: response.status,
        statusText: response.statusText
      })),
    
    getHelp: (): Promise<ApiResponse<any>> => 
      api.get('/block/help').then(response => ({
        data: response.data,
        status: response.status,
        statusText: response.statusText
      })),
    
    getRecentPosts: (): Promise<ApiResponse<any>> => 
      api.get('/block/recent-posts').then(response => ({
        data: response.data,
        status: response.status,
        statusText: response.statusText
      })),
    
    getSelectedProducts: (): Promise<ApiResponse<any>> => 
      api.get('/block/selected-products').then(response => ({
        data: response.data,
        status: response.status,
        statusText: response.statusText
      })),
  },
  
  // Методы для поиска
  search: {
    searchPosts: async (query: string): Promise<ApiResponse<any>> => {
      const response = await fetch(getApiUrl(`search?query=${encodeURIComponent(query)}`));
      
      if (!response.ok) {
        throw new Error(`Ошибка поиска: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        data,
        status: response.status,
        statusText: response.statusText
      };
    },
  },
  
  // Методы для выборок
  selections: {
    getBySlug: (slug: string): Promise<ApiResponse<any>> => 
      api.get(`/selections/slug/${slug}`).then(response => ({
        data: response.data,
        status: response.status,
        statusText: response.statusText
      })),
  },
  
  // Методы для действий (формы)
  actions: {
    submitHelp: (data: HelpForm): Promise<ApiResponse<any>> => 
      api.post('/action/help', data).then(response => ({
        data: response.data,
        status: response.status,
        statusText: response.statusText
      })),
    
    submitCallMe: (data: CallMeForm): Promise<ApiResponse<any>> => 
      api.post('/action/help/call-me', data).then(response => ({
        data: response.data,
        status: response.status,
        statusText: response.statusText
      })),
    
    submitCost: (data: CostForm): Promise<ApiResponse<any>> => 
      api.post('/action/cost', data).then(response => ({
        data: response.data,
        status: response.status,
        statusText: response.statusText
      })),
    
    submitOrder: (data: OrderForm): Promise<ApiResponse<any>> => 
      api.post('/action/order', data).then(response => ({
        data: response.data,
        status: response.status,
        statusText: response.statusText
      })),
    
    submitQuickOrder: (data: QuickOrderForm): Promise<ApiResponse<any>> => 
      api.post('/action/order/quick', data).then(response => ({
        data: response.data,
        status: response.status,
        statusText: response.statusText
      })),
  },
  
  // Метод для получения информации о сборке
  getBuild: (): Promise<ApiResponse<any>> => 
    api.get('/build').then(response => ({
      data: response.data,
      status: response.status,
      statusText: response.statusText
    })),
};

export default apiService;

// Интерфейс элемента корзины
interface CartItem {
  id: number;
  title: string;
  price: string;
  image: string;
  articul: string;
  quantity: number;
  slug: string;
  available: boolean;
  isOrderable: boolean; // Флаг для товаров "Под заказ"
  weight?: string; // Вес товара (опциональное поле)
}

// Класс для управления корзиной с использованием localStorage
export class CartService {
  private static STORAGE_KEY = 'burspb_cart';

  // Получить все товары из корзины
  static getCart(): CartItem[] {
    const cartData = localStorage.getItem(this.STORAGE_KEY);
    if (!cartData) return [];
    
    try {
      return JSON.parse(cartData);
    } catch (error) {
      return [];
    }
  }

  // Добавить товар в корзину
  static addToCart(item: CartItem): void {
    const cart = this.getCart();
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex !== -1) {
      // Если товар уже в корзине, увеличиваем количество
      cart[existingItemIndex].quantity += item.quantity;
    } else {
      // Если товара еще нет, добавляем его
      cart.push(item);
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    this.triggerCartChange();
  }

  // Обновить количество товара в корзине
  static updateItemQuantity(id: number, quantity: number): void {
    const cart = this.getCart();
    const existingItemIndex = cart.findIndex(item => item.id === id);
    
    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity = Math.max(1, quantity); // Минимум 1 товар
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
      this.triggerCartChange();
    }
  }

  // Удалить товар из корзины
  static removeFromCart(id: number): void {
    let cart = this.getCart();
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    this.triggerCartChange();
  }

  // Очистить корзину
  static clearCart(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    this.triggerCartChange();
  }

  // Получить общее количество товаров в корзине
  static getCartItemsCount(): number {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  // Получить общую стоимость корзины
  static getCartTotal(): number {
    const cart = this.getCart();
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/\s+/g, '').replace('₽', ''));
      return total + (price * item.quantity);
    }, 0);
  }

  // Проверить, есть ли товар в корзине
  static isInCart(id: number): boolean {
    const cart = this.getCart();
    return cart.some(item => item.id === id);
  }

  // Получить количество конкретного товара в корзине
  static getItemQuantity(id: number): number {
    const cart = this.getCart();
    const item = cart.find(item => item.id === id);
    return item ? item.quantity : 0;
  }

  // Триггер события изменения корзины
  static triggerCartChange(): void {
    window.dispatchEvent(new CustomEvent('cart-changed'));
  }
}