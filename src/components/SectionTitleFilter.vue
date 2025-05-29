<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Props {
  title?: string
  showFilter?: boolean
  sortOptions?: Array<{
    value: string
    label: string
  }>
}

withDefaults(defineProps<Props>(), {
  title: 'Товары каталога',
  showFilter: true,
  sortOptions: () => [
    { value: 'popularity-desc', label: 'От популярного к менее популярному' },
    { value: 'popularity-asc', label: 'От менее популярного к популярному' },
    { value: 'price-asc', label: 'От дешёвых к дорогим' },
    { value: 'price-desc', label: 'От дорогих к дешёвым' },
    { value: 'name-asc', label: 'По названию (А-Я)' },
    { value: 'name-desc', label: 'По названию (Я-А)' }
  ]
})

const emit = defineEmits(['sort-change', 'price-filter-change']);

// Состояния фильтров
const minPriceInput = ref('');
const maxPriceInput = ref('');
const selectedSort = ref('price-asc');
let filterTimeout: number | null = null;

// Обработчики изменений
const handleSortChange = (event: Event) => {
  const selectElement = event.target as HTMLSelectElement;
  selectedSort.value = selectElement.value;

  emit('sort-change', selectedSort.value);
};

// Обработчик применения фильтра цены
const applyPriceFilter = () => {
  let min = null;
  let max = null;
  
  // Преобразуем значения в числа, если они не пустые
  if (minPriceInput.value !== '') {
    const minValue = parseInt(minPriceInput.value);
    if (!isNaN(minValue) && minValue >= 0) {
      min = minValue.toString();
    }
  }
  
  if (maxPriceInput.value !== '') {
    const maxValue = parseInt(maxPriceInput.value);
    if (!isNaN(maxValue) && maxValue >= 0) {
      max = maxValue.toString();
    }
  }
  
  // Если оба значения указаны и минимальное больше максимального, меняем их местами
  if (min !== null && max !== null && parseInt(min) > parseInt(max)) {
    const temp = min;
    min = max;
    max = temp;
    
    // Обновляем поля ввода
    minPriceInput.value = min;
    maxPriceInput.value = max;
  }
  

  
  // Отправляем событие фильтрации
  emit('price-filter-change', min, max);
};

// Обработчик потери фокуса полями ввода
const handleBlur = () => {
  if (filterTimeout) {
    clearTimeout(filterTimeout);
    filterTimeout = null;
  }
  applyPriceFilter();
};

// Обработчик нажатия Enter в полях ввода
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    if (filterTimeout) {
      clearTimeout(filterTimeout);
      filterTimeout = null;
    }
    applyPriceFilter();
  }
};

// Обработчик изменения значений в полях ввода
const handleInputChange = () => {
  // Отменяем предыдущий таймаут, если он есть
  if (filterTimeout) {
    clearTimeout(filterTimeout);
  }
  
  // Устанавливаем новый таймаут
  filterTimeout = window.setTimeout(() => {
    applyPriceFilter();
    filterTimeout = null;
  }, 1000); // Увеличиваем задержку до 1 секунды
};

// Очистка таймаута при размонтировании компонента
onUnmounted(() => {
  if (filterTimeout) {
    clearTimeout(filterTimeout);
  }
});

// Инициализация начальных значений
onMounted(() => {
  // Устанавливаем изначальную сортировку
  emit('sort-change', selectedSort.value);
});
</script>

<template>
  <div class="section-title section-title--with-filter">
    <h1 class="section-title-tag">{{ title }}</h1>

    <div v-if="showFilter" class="section-title-filter">
      <ul>
        <li><i class="fa fa-filter"></i></li>
        <li class="filter-price">
          <span>Цена</span>
          <div class="row">
            <div>
              <label for="price-min">От</label> 
              <input 
                id="price-min"
                type="number" 
                class="input-number" 
                v-model="minPriceInput"
                @input="handleInputChange"
                @keypress="handleKeyPress"
                @blur="handleBlur"
                min="0"
                placeholder="0"
              />
            </div>
            <div>
              <label for="price-max">До</label> 
              <input 
                id="price-max"
                type="number" 
                class="input-number" 
                v-model="maxPriceInput"
                @input="handleInputChange"
                @keypress="handleKeyPress"
                @blur="handleBlur"
                min="0"
                placeholder="∞"
              />
            </div>
          </div>
        </li>
        <li class="filter-sort">
          <span>Сортировка</span>
          <div>
            <select 
              class="select" 
              v-model="selectedSort"
              @change="handleSortChange"
            >
              <option 
                v-for="option in sortOptions" 
                :key="option.value" 
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.section-title--with-filter {
  font-size:1.2rem;
  line-height:1;
  margin-bottom:1.5rem
}
@media screen and (min-width:1024px) {
  .section-title--with-filter {
    font-size:1.4rem
  }
}
.section-title--with-filter ul li {
  width:100%;
  display:flex;
  flex-direction:row;
  align-items:center;
  justify-content:space-between;
  padding:0 0 1.5rem
}
.section-title--with-filter ul li:first-child {
  display:none
}
.section-title--with-filter ul li:last-child {
  padding-bottom:0
}
@media screen and (min-width:768px) {
  .section-title--with-filter ul {
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:space-between
  }
  .section-title--with-filter ul li {
    width:auto;
    padding-bottom:0
  }
  .section-title--with-filter ul li:first-child {
    display:flex
  }
  .section-title--with-filter ul li:after {
    content:"";
    height:3.3rem;
    width:.1rem;
    background:#ccc;
    display:inline-block;
    color:#aaa;
    margin-left:1.5rem;
    margin-right:.75rem
  }
}
@media screen and (min-width:768px)and (min-width:1024px) {
  .section-title--with-filter ul li:after {
    margin-left:2.25rem;
    margin-right:2.25rem
  }
}
@media screen and (min-width:768px) {
  .section-title--with-filter ul li:last-child:after {
    display:none
  }
}
@media screen and (min-width:768px) {
  .section-title--with-filter ul li.filter-price,
  .section-title--with-filter ul li.filter-sort {
    width:calc(50% - 2rem)
  }
}
@media screen and (min-width:1024px) {
  .section-title--with-filter ul li.filter-price {
    width:calc(60% - 2rem)
  }
  .section-title--with-filter ul li.filter-sort {
    width:calc(40% - 2rem)
  }
}
.section-title--with-filter label {
  text-transform:lowercase;
  margin:0 .75rem;
  color:#888;
  font-weight:600
}
@media screen and (min-width:1024px) {
  .section-title--with-filter label {
    margin:0 1.5rem
  }
}
.section-title--with-filter span {
  width:auto;
  display:inline-block;
  font-weight:600;
  margin-right:1.5rem
}
.section-title--with-filter .row {
  display:flex;
  flex-direction:row;
  align-items:center;
  margin-left:auto;
  margin-right:0
}
.section-title--with-filter .input-number {
  width:auto;
  min-width:7.5rem;
  max-width:8rem;
  height:3.3rem;
  line-height:3.2rem;
  font-size:1.2rem;
  text-align:left;
  padding:0 .75rem;
  border-radius:.5rem
}
.section-title--with-filter .select {
  border-radius:.5rem;
  font-weight:600;
  text-transform:lowercase
}
@media screen and (min-width:480px) {
  .section-title--with-filter .input-number {
    min-width:10rem;
    max-width:10rem
  }
  .section-title--with-filter .select {
    min-width:17.5rem;
    max-width:17.5rem
  }
}
@media screen and (min-width:768px) {
  .section-title--with-filter {
    margin-bottom:4.5rem!important
  }
}
@media screen and (min-width:1024px) {
  .section-title--with-filter .input-number {
    min-width:15rem;
    max-width:15rem
  }
}
@media screen and (min-width:1200px) {
  .section-title--with-filter {
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-items:flex-end;
    padding-bottom:4.5rem;
    border-bottom:.2rem solid #0cf
  }
  .section-title--with-filter .section-title-tag {
    padding-bottom:0!important;
    margin-bottom:0!important;
    border:none!important;
    padding-right:3rem
  }
  .section-title--with-filter ul {
    min-width:72rem
  }
  .section-title--with-filter .input-number {
    min-width:10rem;
    max-width:10rem
  }
}
@media screen and (min-width:1400px) {
  .section-title--with-filter .input-number {
    min-width:12.5rem;
    max-width:12.5rem
  }
}
@media screen and (min-width:1600px) {
  .section-title--with-filter .input-number {
    min-width:15rem;
    max-width:15rem
  }
}
</style>