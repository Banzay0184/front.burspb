<script setup lang="ts">
import { onMounted } from 'vue';

defineOptions({
    name: 'Map.vue'
});

onMounted(() => {
    if (typeof window !== 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://api-maps.yandex.ru/2.1/?apikey=61e237f8-27e4-4433-881c-f8e000fdf483&lang=ru_RU';
        script.onload = initYandexMap;
        document.head.appendChild(script);
    }
});

function initYandexMap() {
    // @ts-ignore
    ymaps.ready(() => {
        // @ts-ignore
        const map = new ymaps.Map('map-container', {
            center: [59.985676, 30.307997], // Центр между двумя точками
            zoom: 11,
            controls: ['zoomControl', 'fullscreenControl']
        });

        // Офис-склад Юг
        // @ts-ignore
        const placemarkSouth = new ymaps.Placemark([59.846603, 30.294963], {
            hintContent: 'Офис-склад Юг',
            balloonContent: `
                <strong>Офис-склад Юг</strong><br/>
                Санкт-Петербург, Южное шоссе, 37 к.4 лит. Б<br/>
                Тел.: <a href="tel:89213717766">8 921 371 77 66</a>
            `
        }, {
            preset: 'islands#redIcon'
        });

        // Офис-склад Север
        // @ts-ignore
        const placemarkNorth = new ymaps.Placemark([60.065016, 30.332723], {
            hintContent: 'Офис-склад Север',
            balloonContent: `
                <strong>Офис-склад Север</strong><br/>
                Санкт-Петербург, Выборгское шоссе, 356<br/>
                Тел.: <a href="tel:89110369668">8 911 036 96 68</a>
            `
        }, {
            preset: 'islands#blueIcon'
        });

        map.geoObjects.add(placemarkSouth);
        map.geoObjects.add(placemarkNorth);

        // Автоматически подбираем масштаб, чтобы были видны все метки
        map.setBounds(map.geoObjects.getBounds(), {
            checkZoomRange: true
        });
    });
}
</script>

<template>
    <section class="ymap-container" id="map-container" ></section>
</template>

<style lang="scss" scoped>
.ymap-container {
  position:relative;
  width:100%;
  height:auto;
  margin-bottom:1.5rem;
  padding-bottom:62.5%
}
.ymap-container>div {
  position:absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
  width:100%;
  height:100%
}
@media (max-width:1024px) {
  .ymap-container {
    pointer-events: none;
  }
}
@media screen and (min-width:768px) {
  .ymap-container {
    margin-bottom:4.5rem
  }
}
@media screen and (min-width:1024px) {
  .ymap-container {
    margin-bottom:0;
    padding-bottom:0;
    height:100%
  }
}
</style>