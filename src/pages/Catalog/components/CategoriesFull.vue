<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiService from '../../../api/api'

defineOptions({
  name: 'CategoriesFull'
})

interface CategoryItem {
  nav_id: number
  object_id: string
  type: string
  parent: boolean | string
  icon: string | null
  title: string
  slug: string
  params: {
    title: string | null
    is_h1: string | null
    is_link: {
      url: string
      title: string
    }
  }
}

// Структура трансформированных категорий для отображения
interface TransformedCategory {
  id: number
  title: string
  href: string
  img: string
  alt: string
  subcategories?: {
    title: string
    href: string
    is_link: {
      url: string
      title: string
    }
  }[]
}

const categories = ref<TransformedCategory[]>([])
const activeCategory = ref<number | null>(null)

const toggleCategory = (id: number) => {
  activeCategory.value = activeCategory.value === id ? null : id
}

// Функция для получения пути иконки по id
const getIconPath = (iconClass: string | null) => {
  if (!iconClass) return '/image/4138f1.svg' // Дефолтная иконка
  
  const iconMap: Record<string, string> = {
    'icon-cat-1': '/image/0638dd.svg',
    'icon-cat-2': '/image/0cbb3c.svg',
    'icon-cat-3': '/image/8cf2d3.svg',
    'icon-cat-4': '/image/b4113b.svg',
    'icon-cat-5': '/image/f17657.svg',
    'icon-cat-6': '/image/c0fc52.svg',
    'icon-cat-7': '/image/919b76.svg',
    'icon-cat-8': '/image/c2e082.svg',
    'icon-cat-9': '/image/f7e482.svg',
    'icon-cat-11': '/image/4138f1.svg',
    'icon-cat-12': '/image/8197a9.svg',
    'icon-cat-13': '/image/a19cb7.svg'
  }
  
  return iconMap[iconClass] || '/image/4138f1.svg'
}

// Функция для формирования URL категории
const getCategoryPath = (category: CategoryItem) => {
  if (category.type === 'taxonomy') {
    return `/catalog/selection-${category.slug}`
  } else if (category.type === 'post_type') {
    return `/catalog/${category.slug}`
  }
  return `/catalog/selection-${category.slug}`
}

// Функция для преобразования массива категорий в древовидную структуру
const transformCategories = (categoriesData: CategoryItem[]) => {
  // Создаем карту родительских категорий (id => index в массиве результатов)
  const parentCategories: Record<string, number> = {}
  const result: TransformedCategory[] = []

  // Проходим по всем категориям и находим родительские
  categoriesData.forEach((category) => {
    if (category.parent === false) {
      const transformedCategory: TransformedCategory = {
        id: category.nav_id,
        title: category.title,
        href: getCategoryPath(category),
        img: getIconPath(category.icon),
        alt: `Перейти к ${category.title}`,
        subcategories: []
      }
      parentCategories[category.nav_id.toString()] = result.length
      result.push(transformedCategory)
    }
  })

  // Добавляем подкатегории
  categoriesData.forEach((category) => {
    if (category.parent !== false) {
      const parentId = category.parent.toString()
      if (parentId in parentCategories) {
        const parentIndex = parentCategories[parentId]
        if (result[parentIndex].subcategories) {
          result[parentIndex].subcategories!.push({
            title: category.title,
            href: getCategoryPath(category),
            is_link: category.params.is_link
          })
        }
      }
    }
  })

  return result
}

// Функция для загрузки данных с API
const fetchGlobalData = async () => {
  try {
    const response = await apiService.getGlobals()
    if (response.data && response.data.navigation && response.data.navigation.categories_full) {
      const categoriesData = response.data.navigation.categories_full
      categories.value = transformCategories(categoriesData)
    }
  } catch (error) {
  }
}

onMounted(() => {
  fetchGlobalData()
})
</script>

<template>
  <nav itemtype="http://schema.org/SiteNavigationElement" class="categories-full">
    <ul itemprop="about" itemtype="http://schema.org/ItemList">
      <li 
        v-for="category in categories" 
        :key="category.id"
        :class="{ active: activeCategory === category.id }"
        itemprop="itemListElement" 
        itemtype="http://schema.org/ItemList"
      >
        <a 
          :href="category.href" 
          itemprop="url" 
          class="categories-full__parent"
        >
          <span>
            <img 
              :src="category.img" 
              width="92" 
              height="92" 
              :alt="category.alt" 
              loading="lazy" 
            />
          </span>
          {{ category.title }}
        </a>
        <meta itemprop="name" content="Информация" />
        <i 
          class="categories-full__parent__mobile-action"
          @click.prevent="toggleCategory(category.id)"
        ></i>
        
        <ul 
          v-if="category.subcategories && category.subcategories.length > 0"
          itemprop="itemListElement" 
          itemtype="http://schema.org/ItemList"
        >
          <li 
            v-for="(subcategory, index) in category.subcategories" 
            :key="index"
            itemprop="itemListElement" 
            itemtype="http://schema.org/ItemList"
          >
            <a :href="subcategory.href" itemprop="url" class="">
              {{ subcategory.is_link?.title || subcategory.title }}
            </a>
            <meta itemprop="name" content="Учебные статьи" />
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>
<style lang="scss" scoped>
.categories-full>ul>li {
  margin-bottom:3rem;
  position:relative
}
.categories-full>ul>li li {
  padding-left:5.3rem;
  margin-bottom:.75rem
}
@media screen and (max-width:1199.99px) {
  .categories-full>ul>li>ul {
    display:none
  }
  .categories-full>ul>li.active>ul {
    display:block
  }
}
.categories-full__parent {
  font-weight:700;
  display:flex;
  flex-direction:row;
  line-height:1.2
}
.categories-full__parent span {
  min-width:3.8rem;
  max-width:3.8rem;
  flex-basis:3.8rem;
  margin-right:1.5rem
}
.categories-full__parent span img,
.categories-full__parent span svg {
  width:100%;
  height:auto
}
.categories-full__parent span .icon-background {
  fill:#0cf
}
@media screen and (max-width:1199.999px) {
  .categories-full__parent__mobile-action {
    display:inline-block;
    position:absolute;
    top:0;
    right:0;
    width:2rem;
    height:2rem;
    border:thin solid #aaa;
    border-radius:50%;
    cursor:pointer
  }
  .categories-full__parent__mobile-action:before {
    line-height:1;
    content:"";
    font-family:FontAwesome;
    font-size:1rem;
    display:inline-block;
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    color:#aaa
  }
  .active .categories-full__parent__mobile-action:before {
    transform:translate(-50%,-50%) rotate(180deg)
  }
}
@media screen and (min-width:768px) {
  .categories-full>ul {
    display:flex;
    flex-direction:row;
    flex-wrap:wrap;
    margin-left:-2.25rem;
    margin-right:-2.25rem
  }
  .categories-full>ul>li {
    display:block;
    width:calc(50% - 4.5rem);
    margin-left:2.25rem;
    margin-right:2.25rem
  }
}
@media screen and (min-width:1200px) {
  .categories-full>ul {
    margin-left:-1.5rem;
    margin-right:-1.5rem
  }
  .categories-full>ul>li {
    width:calc(25% - 3rem);
    margin-left:1.5rem;
    margin-right:1.5rem
  }
}
</style>