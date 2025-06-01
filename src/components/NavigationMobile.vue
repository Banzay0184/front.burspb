<script setup lang="ts">
import { ref, onMounted } from "vue";
import apiService from "../api/api";

const emit = defineEmits(["close"]);

const isExpanded = ref(false);
const categoriesFull = ref<any[]>([]);

const toggleSubmenu = () => {
  isExpanded.value = !isExpanded.value;
};

// Функция для построения дерева категорий
const buildCategoryTree = (categories: any[]) => {
  // Группируем категории по родителю
  const categoryMap = new Map();
  const rootCategories: any[] = [];

  // Сначала сгруппируем все категории по id
  categories.forEach((category) => {
    categoryMap.set(category.nav_id, { ...category, children: [] });
  });

  // Затем построим дерево
  categories.forEach((category) => {
    if (category.parent === false) {
      rootCategories.push(categoryMap.get(category.nav_id));
    } else if (categoryMap.has(category.parent)) {
      categoryMap
        .get(category.parent)
        .children.push(categoryMap.get(category.nav_id));
    }
  });

  return rootCategories;
};

const fetchGlobalData = async () => {
  try {
    const response = await apiService.getGlobals();
    if (
      response.data &&
      response.data.navigation &&
      response.data.navigation.categories_full
    ) {
      categoriesFull.value = buildCategoryTree(
        response.data.navigation.categories_full
      );
    }
  } catch (error) {}
};

onMounted(() => {
  fetchGlobalData();
});

const getCategoryPath = (category: any) => {
  if (category.type === "taxonomy") {
    return `/catalog/category-${category.slug}`;
  } else if (category.type === "post_type") {
    return `/catalog/category-${category.slug}`;
  }
   return `/catalog/category-${category.slug}`;
};
</script>

<template>
  <nav class="navigation-mobile">
    <span class="navigation-mobile__close" @click="emit('close')"> × </span>
    <ul>
      <li class="navigation-mobile__item navigation-mobile__item--expanded">
        <span class="as-link" @click="toggleSubmenu">
          <span
            class="navigation-mobile__item__icon navigation-mobile__item__icon--icon-page-1"
          >
            <img
              src="/image/e93b66.svg"
              width="28"
              height="28"
              alt="Перейти в каталог "
              loading="lazy"
            />
          </span>
          <span class="navigation-mobile__item__title">
            Каталог
            <span class="triangle"></span>
          </span>
        </span>
        <ul class="navigation-mobile__nested" :class="{ expanded: isExpanded }">
          <!-- Родительские категории -->
          <li v-for="category in categoriesFull" :key="category.nav_id">
            <RouterLink :to="getCategoryPath(category)" @click="emit('close')">
              {{ category.title }}
            </RouterLink>
            <!-- Подкатегории (если есть) -->
            <ul v-if="category.children && category.children.length > 0">
              <li
                v-for="subcategory in category.children"
                :key="subcategory.nav_id"
              >
                <RouterLink
                  :to="getCategoryPath(subcategory)"
                  itemprop="url"
                  @click="emit('close')"
                >
                  {{ subcategory.title }}
                </RouterLink>
                <!-- Подкатегории третьего уровня (если есть) -->
                <ul
                  v-if="subcategory.children && subcategory.children.length > 0"
                >
                  <li
                    v-for="subsubcategory in subcategory.children"
                    :key="subsubcategory.nav_id"
                  >
                
                  </li>
                </ul>
              </li>
            </ul>
          </li>

          <!-- Если категории не загружены, показываем стандартные пункты -->
          <template v-if="categoriesFull.length === 0">
            // ... existing code ...
          </template>
        </ul>
      </li>

      <li class="navigation-mobile__item">
        <RouterLink to="/statji" @click="emit('close')">
          <span
            class="navigation-mobile__item__icon navigation-mobile__item__icon--icon-page-7"
            ><img
              src="/image/a16de5.svg"
              width="28"
              height="28"
              alt="Перейти к Статьи"
              loading="lazy"
          /></span>
          <span class="navigation-mobile__item__title">Статьи</span>
        </RouterLink>
      </li>

      <li class="navigation-mobile__item">
        <RouterLink to="/garantiya" @click="emit('close')">
          <span
            class="navigation-mobile__item__icon navigation-mobile__item__icon--icon-page-4"
            ><img
              src="/image/4d5a09.svg"
              width="28"
              height="28"
              alt="Перейти к Гарантия"
              loading="lazy"
          /></span>
          <span class="navigation-mobile__item__title">Гарантия</span>
        </RouterLink>
      </li>

      <li class="navigation-mobile__item">
        <RouterLink to="/oplata" @click="emit('close')">
          <span
            class="navigation-mobile__item__icon navigation-mobile__item__icon--icon-page-3"
            ><img
              src="/image/d159ba.svg"
              width="28"
              height="28"
              alt="Перейти к Оплата"
              loading="lazy"
          /></span>
          <span class="navigation-mobile__item__title">Оплата</span>
        </RouterLink>
      </li>

      <li class="navigation-mobile__item">
        <RouterLink to="/dostavka" @click="emit('close')">
          <span
            class="navigation-mobile__item__icon navigation-mobile__item__icon--icon-page-2"
            ><img
              src="/image/3ff0cd.svg"
              width="28"
              height="28"
              alt="Перейти к Доставка"
              loading="lazy"
          /></span>
          <span class="navigation-mobile__item__title">Доставка</span>
        </RouterLink>
      </li>

      <li class="navigation-mobile__item">
        <RouterLink to="/o-kompanii" @click="emit('close')">
          <span
            class="navigation-mobile__item__icon navigation-mobile__item__icon--icon-page-5"
            ><img
              src="/image/8774d1.svg"
              width="28"
              height="28"
              alt="Перейти к О компании"
              loading="lazy"
          /></span>
          <span class="navigation-mobile__item__title">О компании</span>
        </RouterLink>
      </li>

      <li class="navigation-mobile__item">
        <RouterLink to="/kontakty" @click="emit('close')">
          <span
            class="navigation-mobile__item__icon navigation-mobile__item__icon--icon-page-6"
            ><img
              src="/image/ec4772.svg"
              width="28"
              height="28"
              alt="Перейти к Контакты"
              loading="lazy"
          /></span>
          <span class="navigation-mobile__item__title">Контакты</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.navigation-mobile {
  background: #06313d;
  color: #fff;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
  overflow-y: auto;
  padding: 3rem 3rem 12rem;
}

.navigation-mobile .as-link,
.navigation-mobile a {
  color: #fff;
}

.navigation-mobile .as-link:hover,
.navigation-mobile a:hover {
  color: #0cf;
}

.navigation-mobile .as-link {
  cursor: pointer;
}

.navigation-mobile__close {
  display: block;
  color: #fff;
  border-radius: 50%;
  width: 2.2rem;
  height: 2.2rem;
  line-height: 1.8rem;
  font-size: 1.6rem;
  font-weight: 600;
  text-align: center;
  border: thin solid #fff;
  cursor: pointer;
  position: absolute;
  top: 3rem;
  right: 3rem;
}

.navigation-mobile__close:hover {
  color: #0cf;
  border-color: #0cf;
}

.navigation-mobile__item {
  padding: 0 0 1.5rem;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 1.2rem;
  line-height: 1.2rem;
}

.navigation-mobile__item .as-link,
.navigation-mobile__item a {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.navigation-mobile__item__icon {
  display: inline-block;
  width: 1.6rem;
  margin-right: 1.05rem;
}

.navigation-mobile__item__icon svg {
  width: 100%;
  max-width: 100%;
}

.navigation-mobile__item__icon--icon-page-4 {
  width: 1rem;
}

.navigation-mobile__item__icon--icon-page-5,
.navigation-mobile__item__icon--icon-page-6 {
  width: 1.3rem;
}

.navigation-mobile__item--expanded .navigation-mobile__item__title {
  position: relative;
}

.navigation-mobile__item--expanded .triangle {
  position: absolute;
  top: 0;
  left: 100%;
  display: inline-block;
  width: 0;
  height: 0;
  border-color: #0cf transparent transparent;
  border-style: solid;
  border-width: 6px 4px 0;
  transform: translate(100%, 50%);
}

.navigation-mobile__item--expanded .triangle.expanded {
  transform: rotate(180deg) translate(-100%, -50%);
}

.navigation-mobile__nested {
  display: none;
  font-weight: 400;
  text-transform: none;
  font-size: 1.4rem;
  margin-top: 1.5rem;
}

.navigation-mobile__nested li {
  margin-bottom: 3rem;
  font-weight: 600;
}

.navigation-mobile__nested li:last-child {
  margin-bottom: 0;
}

.navigation-mobile__nested li ul {
  margin-top: 1.5rem;
}

.navigation-mobile__nested li ul li {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: 400;
  margin-bottom: 1.5rem;
}

.navigation-mobile__nested li ul li:last-child {
  margin-bottom: 0;
}

.navigation-mobile__nested li ul li:before {
  content: "—";
  display: inline-block;
  margin-right: 0.8rem;
}

.navigation-mobile__nested.expanded {
  display: block;
}
</style>