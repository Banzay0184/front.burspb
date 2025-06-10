import { ref } from 'vue';

// Глобальное состояние уведомлений
const showNotification = ref(false);
const notificationMessage = ref('');
let notificationTimeout: number | null = null;

// Функция показа уведомления
export const useNotifications = () => {
  const showNotificationMessage = (message: string) => {
    // Очищаем предыдущий таймер, если он существует
    if (notificationTimeout) {
      if (typeof window !== 'undefined') {
        clearTimeout(notificationTimeout);
      }
    }
    
    // Устанавливаем сообщение и показываем уведомление
    notificationMessage.value = message;
    showNotification.value = true;
    
    // Скрываем уведомление через 3 секунды
    if (typeof window !== 'undefined') {
      notificationTimeout = window.setTimeout(() => {
        showNotification.value = false;
      }, 3000);
    }
  };

  return {
    showNotification,
    notificationMessage,
    showNotificationMessage
  };
}; 