<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isVisible = ref(false);

const acceptCookies = () => {
  localStorage.setItem('cookiesAccepted', 'true');
  isVisible.value = false;
};

onMounted(() => {
  const cookiesAccepted = localStorage.getItem('cookiesAccepted');
  if (!cookiesAccepted) {
    isVisible.value = true;
  }
});
</script>

<template>
  <Transition name="slide-up">
    <div 
      v-if="isVisible" 
      class="cookie-banner"
      role="alert"
      aria-live="polite"
    >
      <div class="cookie-banner__content">
        <div class="cookie-banner__icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#0CF"/>
            <path d="M12 6C11.45 6 11 6.45 11 7V13C11 13.55 11.45 14 12 14C12.55 14 13 13.55 13 13V7C13 6.45 12.55 6 12 6Z" fill="#0CF"/>
            <path d="M12 16C12.55 16 13 15.55 13 15C13 14.45 12.55 14 12 14C11.45 14 11 14.45 11 15C11 15.55 11.45 16 12 16Z" fill="#0CF"/>
          </svg>
        </div>
        <div class="cookie-banner__text-wrapper">
          <p class="cookie-banner__text">
            Этот сайт использует файлы cookie для улучшения работы сайта и предоставления вам наилучшего пользовательского опыта. Используя данный сайт, вы соглашаетесь с использованием файлов cookie.
          </p>
        </div>
        <button 
          class="cookie-banner__button"
          @click="acceptCookies"
          aria-label="Принять использование cookie"
        >
          OK
        </button>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.cookie-banner {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 90%;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 1.6rem;
  box-shadow: 0 0.8rem 2.4rem rgba(0, 0, 0, 0.12);
  padding: 2rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  
  &__content {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  
  &__icon {
    flex-shrink: 0;
    width: 4.8rem;
    height: 4.8rem;
    background: rgba(0, 204, 255, 0.1);
    border-radius: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &__text-wrapper {
    flex: 1;
    min-width: 0;
  }
  
  &__text {
    font-size: 1.4rem;
    line-height: 1.5;
    color: #333;
    margin: 0;
  }
  
  &__button {
    flex-shrink: 0;
    min-width: 9.6rem;
    height: 4.8rem;
    background: linear-gradient(223.06deg, #0CF 3.37%, #006079 100.96%);
    border: none;
    border-radius: 1.2rem;
    color: #fff;
    font-size: 1.6rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 0.4rem 1.2rem rgba(0, 204, 255, 0.3);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
}

// Анимация появления/исчезновения
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translate(-50%, 100%);
  opacity: 0;
}

@media screen and (max-width: 768px) {
  .cookie-banner {
    margin-bottom: 25%;
    padding: 1.6rem;
    
    &__content {
      flex-direction: column;
      gap: 1.6rem;
      text-align: center;
    }
    
    &__icon {
      margin: 0 auto;
    }
    
    &__button {
      width: 100%;
    }
  }
}
</style> 