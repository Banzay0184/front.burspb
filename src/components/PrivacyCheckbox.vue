<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
  error?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.checked);
};
</script>

<template>
  <div class="privacy-checkbox">
    <label class="privacy-checkbox__label">
      <input
        type="checkbox"
        class="privacy-checkbox__input"
        :checked="props.modelValue"
        @change="handleChange"
      />
      <span class="privacy-checkbox__text">
        Я соглашаюсь с 
        <a 
          href="/policy" 
          target="_blank" 
          rel="noopener noreferrer"
          class="privacy-checkbox__link"
        >
          политикой конфиденциальности
        </a>
        и даю согласие на 
        <a 
          href="/terms" 
          target="_blank" 
          rel="noopener noreferrer"
          class="privacy-checkbox__link"
        >
          обработку персональных данных
        </a>
      </span>
    </label>
    <span v-if="props.error" class="privacy-checkbox__error">
      Необходимо согласиться с условиями
    </span>
  </div>
</template>

<style lang="scss" scoped>
.privacy-checkbox {
  margin: 1rem 0;
  
  &__label {
    display: flex;
    align-items: flex-start;
    cursor: pointer;
  }
  
  &__input {
    margin-right: 0.5rem;
    margin-top: 0.2rem;
  }
  
  &__text {
    font-size: 0.9rem;
    line-height: 1.4;
    color: #000;
  }
  
  &__link {
    color: #0cf;
    font-weight: 700;
    font-size: 0.9rem;
    line-height: 1.4;
    letter-spacing: 0.05em;
    text-decoration: underline;
    
    &:hover {
      color: #000;
      text-decoration: underline;
    }
  }
  
  &__error {
    display: block;
    color: #f44336;
    font-size: 0.8rem;
    margin-top: 0.5rem;
  }
}
</style> 