<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

// Интерфейс для данных SEO анализа
interface SeoAnalysisData {
  totalPages: number;
  indexed: number;
  duplicates: number;
  noindex: number;
  errors: number;
  warnings: number;
  problemPages: Array<{
    url: string;
    issue: string;
    status: string;
    canonical?: string;
  }>;
  lastAnalysisDate: string;
}

// Безопасное получение origin для отображения
const currentOrigin = ref('');

// Состояние данных
const seoData = ref<SeoAnalysisData>({
  totalPages: 0,
  indexed: 0,
  duplicates: 0,
  noindex: 0,
  errors: 0,
  warnings: 0,
  problemPages: [],
  lastAnalysisDate: new Date().toLocaleString('ru-RU')
});

const isLoading = ref(true);

// Загрузка данных из localStorage или API
const loadSeoData = async () => {
  try {
    // Попытка получить данные из localStorage (где SEO Dashboard мог их сохранить)
    const savedData = localStorage.getItem('seo-analysis-data');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      seoData.value = {
        ...parsedData,
        lastAnalysisDate: parsedData.lastAnalysisDate || new Date().toLocaleString('ru-RU')
      };
    } else {
      // Если данных нет, показываем что анализ еще не проводился
      seoData.value = {
        totalPages: 0,
        indexed: 0,
        duplicates: 0,
        noindex: 0,
        errors: 0,
        warnings: 0,
        problemPages: [],
        lastAnalysisDate: 'Анализ еще не проводился'
      };
    }
  } catch (error) {
    console.error('Ошибка при загрузке данных SEO анализа:', error);
  } finally {
    isLoading.value = false;
  }
};

// Генерация итогового отчета на основе реальных данных
const finalReport = computed(() => {
  const data = seoData.value;
  
  // Если данных нет, показываем сообщение
  if (data.totalPages === 0) {
    return `
📋 ЛОКАЛЬНЫЙ SEO ОТЧЕТ - ${currentOrigin.value || 'LOCALHOST'}
Дата: ${new Date().toLocaleDateString('ru-RU')}

⚠️ АНАЛИЗ НЕ ПРОВЕДЕН

Для получения отчета необходимо:
1. Перейти в SEO Dashboard: /seo-dashboard
2. Запустить анализ ЛОКАЛЬНЫХ страниц сайта
3. Дождаться завершения проверки
4. Вернуться на эту страницу для просмотра отчета

После проведения анализа здесь будет доступен полный SEO отчет с реальными данными о состоянии ЛОКАЛЬНОГО сервера.

ВАЖНО: Этот отчет анализирует ЛОКАЛЬНЫЙ сервер (${currentOrigin.value || 'localhost:3001'}), 
а не продакшн сайт burspb.com!
`.trim();
  }
  
  return `
📋 ЛОКАЛЬНЫЙ SEO ОТЧЕТ - ${currentOrigin.value || 'LOCALHOST'}
Дата: ${new Date().toLocaleDateString('ru-RU')}
Анализируемый сервер: ${currentOrigin.value || 'localhost:3001'}
Последний анализ: ${data.lastAnalysisDate}

📊 СТАТИСТИКА:
• Общее количество страниц: ${data.totalPages}
• ✅ Индексируется: ${data.indexed} (${Math.round(data.indexed / data.totalPages * 100)}%)
• ⚠️ Дубли: ${data.duplicates} (${Math.round(data.duplicates / data.totalPages * 100)}%)
• 🚫 Не индексируется: ${data.noindex} (${Math.round(data.noindex / data.totalPages * 100)}%)
• ❌ Ошибки: ${data.errors} (${Math.round(data.errors / data.totalPages * 100)}%)
• ⚠️ Предупреждения: ${data.warnings} (${Math.round(data.warnings / data.totalPages * 100)}%)

${data.problemPages.length > 0 ? `🚨 ОСНОВНЫЕ ПРОБЛЕМЫ:

${data.problemPages.map((page, index) => `${index + 1}. ${page.url}
   Проблема: ${page.issue}
   Статус: ${page.status}
   ${page.canonical ? `Canonical: ${page.canonical}` : ''}`).join('\n\n')}

💡 РЕКОМЕНДАЦИИ ПО ИСПРАВЛЕНИЮ:

1. Проверьте мета-теги:
   ✓ Убедитесь, что все страницы имеют уникальные title и description
   ✓ Длина title: 30-60 символов
   ✓ Длина description: 120-160 символов

2. Исправьте технические проблемы:
   ✓ Проверьте страницы с ошибками HTTP
   ✓ Настройте правильные canonical URL
   ✓ Добавьте отсутствующие заголовки H1

3. Оптимизируйте индексацию:
   ✓ Проверьте настройки robots.txt
   ✓ Убедитесь в корректности robots meta тегов
   ✓ Настройте XML sitemap

ИТОГ: ${data.errors + data.warnings > 0 ? `⚠️ Необходимо исправить ${data.errors + data.warnings} проблем` : '✅ Критических проблем не найдено'}
ПРИОРИТЕТ: ${data.errors > 0 ? 'Высокий' : data.warnings > 0 ? 'Средний' : 'Низкий'}` : 
`✅ ОТЛИЧНЫЕ НОВОСТИ!

Критических проблем не обнаружено. SEO сайта настроено корректно:
• Все страницы имеют правильные мета-теги
• Canonical URL настроены корректно
• Robots meta теги работают правильно
• Структура сайта оптимизирована для поисковых систем

💡 РЕКОМЕНДАЦИИ ДЛЯ УЛУЧШЕНИЯ:

1. Продолжайте следить за:
   ✓ Уникальностью мета-тегов
   ✓ Скоростью загрузки страниц
   ✓ Мобильной адаптивностью

2. Регулярно проводите SEO аудит:
   ✓ Проверяйте новые страницы
   ✓ Отслеживайте изменения в индексации
   ✓ Обновляйте XML sitemap

ИТОГ: ✅ SEO в отличном состоянии!
ПРИОРИТЕТ: Поддержание текущего уровня`}

═══════════════════════════════════════════════════════════════
ЛОКАЛЬНЫЙ SEO отчет создан на основе анализа сервера: ${currentOrigin.value || 'localhost:3001'}
Для детального анализа: /seo-dashboard

ВНИМАНИЕ: Этот отчет показывает состояние ЛОКАЛЬНОГО сервера разработки,
а не продакшн сайта burspb.com! Для развертывания исправлений на продакшн
используйте систему деплоя проекта.
`.trim();
});

// Проверка актуальности данных
const isDataFresh = computed(() => {
  if (!seoData.value.lastAnalysisDate || seoData.value.lastAnalysisDate === 'Анализ еще не проводился') {
    return false;
  }
  
  // Проверяем, что данные не старше 24 часов
  try {
    const analysisDate = new Date(seoData.value.lastAnalysisDate);
    const now = new Date();
    const hoursDiff = (now.getTime() - analysisDate.getTime()) / (1000 * 60 * 60);
    return hoursDiff < 24;
  } catch {
    return false;
  }
});

// Копирование отчета
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(finalReport.value);
    alert('📋 Отчет скопирован в буфер обмена!');
  } catch (err) {
    // Fallback для старых браузеров
    const textArea = document.createElement('textarea');
    textArea.value = finalReport.value;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('📋 Отчет скопирован в буфер обмена!');
  }
};

// Сохранение как файл
const downloadReport = () => {
  const blob = new Blob([finalReport.value], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `seo-report-${new Date().toISOString().split('T')[0]}.txt`;
  link.click();
};

// Обновление данных из SEO Dashboard
// const refreshData = () => {
//   loadSeoData();
// };

onMounted(() => {
  // Безопасно устанавливаем origin
  if (typeof window !== 'undefined') {
    currentOrigin.value = window.location.origin;
  }
  
  loadSeoData();
  
  // Обновляем данные каждые 30 секунд, если пользователь на странице
  const interval = setInterval(() => {
    if (document.visibilityState === 'visible') {
      loadSeoData();
    }
  }, 30000);
  
  // Очищаем интервал при размонтировании
  onUnmounted(() => {
    clearInterval(interval);
  });
});
</script>

<template>
  <div class="screen">
    <!-- Простой заголовок -->
    <header class="report-header">
      <div class="wrapper">
        <h1><i class="fa fa-file-text-o"></i> Локальный SEO Отчет</h1>
        <p>Анализ локального сервера: {{ currentOrigin || 'localhost:3001' }}</p>
      </div>
    </header>

    <main class="main">
      <div class="wrapper">
        <!-- Информация о локальном анализе -->
        <section class="section">
          <div class="local-info-card">
            <div class="local-info-icon">
              <i class="fa fa-desktop"></i>
            </div>
            <div class="local-info-content">
              <h3>🏠 Локальный анализ</h3>
              <p>Отчет основан на данных анализа <strong>локального сервера</strong> {{ currentOrigin || 'localhost:3001' }}</p>
              <p class="local-info-note">
                <i class="fa fa-info-circle"></i>
                Для анализа продакшн сайта burspb.com используйте внешние SEO инструменты
              </p>
            </div>
          </div>
        </section>

        <!-- Простая статистика -->
        <section class="section">
          <div class="stats-simple">
            <div class="stat-item">
              <div class="stat-number">{{ seoData.indexed }}</div>
              <div class="stat-label">Индексируется</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ seoData.duplicates }}</div>
              <div class="stat-label">Дубли</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ seoData.noindex }}</div>
              <div class="stat-label">Не индексируется</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ seoData.errors + seoData.warnings }}</div>
              <div class="stat-label">Проблемы</div>
            </div>
          </div>
        </section>

        <!-- Простой отчет -->
        <section class="section">
          <div class="report-card">
            <div class="report-header">
              <h2><i class="fa fa-clipboard"></i> Готовый отчет</h2>
              <div class="report-actions">
                <button @click="copyToClipboard" class="button button--blue">
                  <i class="fa fa-copy"></i> Копировать
                </button>
                <button @click="downloadReport" class="button button--outline">
                  <i class="fa fa-download"></i> Скачать
                </button>
              </div>
            </div>
            
            <div class="report-content">
              <pre>{{ finalReport }}</pre>
            </div>
          </div>
        </section>

        <!-- Простые действия -->
        <section class="section">
          <div class="actions-simple">
            <RouterLink to="/seo-dashboard" class="button button--blue">
              <i class="fa fa-search"></i> Открыть дашборд
            </RouterLink>
            
            <div v-if="!isDataFresh" class="data-warning">
              <i class="fa fa-exclamation-triangle"></i>
              Данные устарели. Запустите новый анализ в дашборде.
            </div>
          </div>
        </section>

        <!-- Простое сообщение о статусе -->
        <section class="section">
          <div v-if="seoData.totalPages === 0" class="status-message status-message--warning">
            <h3><i class="fa fa-exclamation-triangle"></i> Анализ не проведен</h3>
            <p>Перейдите в SEO Dashboard и запустите анализ для получения отчета.</p>
          </div>
          
          <div v-else-if="seoData.errors + seoData.warnings === 0" class="status-message status-message--success">
            <h3><i class="fa fa-check-circle"></i> Все отлично!</h3>
            <p>Критических проблем не найдено. SEO настроено корректно.</p>
          </div>
          
          <div v-else class="status-message status-message--info">
            <h3><i class="fa fa-info-circle"></i> Требует внимания</h3>
            <p>Найдено {{ seoData.errors + seoData.warnings }} проблем, которые рекомендуется исправить.</p>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Простой заголовок */
.report-header {
  background: #006079;
  color: #fff;
  padding: 2rem 0;
  text-align: center;
}

.report-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.report-header p {
  opacity: 0.9;
}

/* Информация о локальном анализе */
.local-info-card {
  background: linear-gradient(135deg, #e3f2fd 0%, #f8f9fa 100%);
  border: 2px solid #0cf;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.local-info-icon {
  width: 60px;
  height: 60px;
  background: #0cf;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.local-info-content h3 {
  margin: 0 0 0.5rem 0;
  color: #006079;
  font-size: 1.25rem;
}

.local-info-content p {
  margin: 0 0 0.5rem 0;
  color: #495057;
}

.local-info-note {
  font-size: 0.9rem !important;
  color: #6c757d !important;
  font-style: italic;
}

.local-info-note i {
  margin-right: 0.5rem;
  color: #0cf;
}

/* Простая статистика */
.stats-simple {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.stat-item {
  text-align: center;
  background: #fff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #006079;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #666;
}

/* Простая карточка отчета */
.report-card {
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.report-header {
  background: #f8f9fa;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.report-header h2 {
  margin: 0;
  color: #006079;
}

.report-actions {
  display: flex;
  gap: 1rem;
}

.report-content {
  max-height: 400px;
  overflow-y: auto;
}

.report-content pre {
  background: #f8f9fa;
  color: #495057;
  padding: 1.5rem;
  margin: 0;
  font-family: monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  white-space: pre-wrap;
  border: none;
}

/* Простые действия */
.actions-simple {
  text-align: center;
  margin-bottom: 2rem;
}

.data-warning {
  margin-top: 1rem;
  padding: 1rem;
  background: #fff3cd;
  color: #856404;
  border-radius: 0.5rem;
  display: inline-block;
}

/* Простые сообщения о статусе */
.status-message {
  background: #fff;
  padding: 2rem;
  border-radius: 0.5rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-message--success {
  border-left: 4px solid #28a745;
}

.status-message--warning {
  border-left: 4px solid #ffc107;
}

.status-message--info {
  border-left: 4px solid #17a2b8;
}

.status-message h3 {
  margin-bottom: 1rem;
  color: #006079;
}

.status-message--success h3 { color: #28a745; }
.status-message--warning h3 { color: #856404; }
.status-message--info h3 { color: #0c5460; }

.status-message p {
  color: #6c757d;
  margin: 0;
}

/* Адаптивность */
@media screen and (max-width: 768px) {
  .report-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .stats-simple {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
  }

  .stat-item {
    padding: 1rem;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .report-content pre {
    font-size: 0.8rem;
    padding: 1rem;
  }

  .local-info-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .local-info-icon {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }
}
</style> 