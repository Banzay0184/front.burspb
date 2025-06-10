<script setup lang="ts">
import { ref, watch, computed } from 'vue';

const props = defineProps<{
  modelValue: string;
  error?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'update:error', value: boolean): void;
  (e: 'error', message: string): void;
}>();

const errorMessage = ref('');
const inputRef = ref<HTMLInputElement | null>(null);

// Вычисляемое свойство для форматированного значения
const displayValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    // Фильтруем нечисловые символы
    const cleanValue = value.replace(/\D/g, '');
    
    // Форматируем только если есть цифры
    if (cleanValue.length > 0) {
      let formatted = '+7 (';
      const digits = cleanValue.substring(1); // Убираем первую 7 (так как уже есть +7)
      
      if (digits.length > 0) {
        formatted += digits.substring(0, 3);
      }
      if (digits.length >= 3) {
        formatted += ') ' + digits.substring(3, 6);
      }
      if (digits.length >= 6) {
        formatted += '-' + digits.substring(6, 8);
      }
      if (digits.length >= 8) {
        formatted += '-' + digits.substring(8, 10);
      }
      
      emit('update:modelValue', formatted);
    } else {
      emit('update:modelValue', '');
    }
    
    emit('update:error', false);
    errorMessage.value = '';
    emit('error', '');
  }
});

const handleKeydown = (event: KeyboardEvent) => {
  // Разрешаем служебные клавиши
  const allowedKeys = [
    'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
  ];
  
  // Разрешаем комбинации Ctrl/Command + A, C, V, X, Z
  if (event.ctrlKey || event.metaKey) {
    return;
  }
  
  // Запрещаем все, кроме цифр и разрешенных клавиш
  if (!/\d/.test(event.key) && !allowedKeys.includes(event.key)) {
    event.preventDefault();
  }
};

const validatePhone = () => {
  const cleanPhone = props.modelValue.replace(/\D/g, '');
  if (cleanPhone.length !== 11) {
    errorMessage.value = 'Введите корректный телефон';
    emit('update:error', true);
    emit('error', errorMessage.value);
  } else {
    errorMessage.value = '';
    emit('update:error', false);
    emit('error', '');
  }
};

watch(() => props.error, (newVal) => {
  if (newVal) {
    errorMessage.value = 'Введите корректный телефон';
    emit('error', errorMessage.value);
  }
});
</script>

<template>
  <input
    ref="inputRef"
    type="text"
    class="input"
    v-model="displayValue"
    @keydown="handleKeydown"
    @blur="validatePhone"
    placeholder="+7 (___) ___-__-__"
    maxlength="18"
    inputmode="tel"
  />
</template>