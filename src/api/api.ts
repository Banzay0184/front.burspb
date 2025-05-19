import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

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
  // Структура для блока преимуществ
}

// Другие блоки...

// Типы для форм
export interface HelpForm {
  name: string;
  phone: string;
  email?: string;
  message: string;
}

export interface CallMeForm {
  name: string;
  phone: string;
}

export interface CostForm {
  name: string;
  phone: string;
  details: string;
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
  baseURL: 'https://burspb.com/api/data/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});


// API сервис
const apiService = {
  // Метод для получения глобальных настроек
  getGlobals: (): Promise<ApiResponse<GlobalsData>> => 
    api.get('/globals').then(response => ({
      data: response.data,
      status: response.status,
      statusText: response.statusText
    })),
  
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
  search: (query: string): Promise<ApiResponse<any>> => 
    api.get('/search', { params: { query } }).then(response => ({
      data: response.data,
      status: response.status,
      statusText: response.statusText
    })),
  
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