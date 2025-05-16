<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  tabs: Array<{ title: string; active: boolean }>;
  description: string[][]; // Теперь это массив массивов, для каждого таба свой контент
}>();

const activeTabIndex = ref(props.tabs.findIndex(tab => tab.active));

const setActiveTab = (index: number) => {
  activeTabIndex.value = index;
};
</script>

<template>
  <div class="tabs">
    <ul class="tabs__nav">
      <li 
        v-for="(tab, index) in tabs" 
        :key="index" 
        :class="{ active: activeTabIndex === index, grow: true }"
        @click="setActiveTab(index)"
      >
        <span>{{ tab.title }}</span>
      </li>
    </ul>
    <div class="tabs__content">
      <div 
        v-for="(content, index) in description" 
        :key="index" 
        class="tab content" 
        :class="{ active: activeTabIndex === index }"
      >
        <p v-for="(paragraph, pIndex) in content" :key="pIndex">
          {{ paragraph }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.tabs {
  margin-bottom:1.5rem
}
@media screen and (min-width:768px) {
  .tabs {
    margin-bottom:4.5rem
  }
}
.tabs__nav {
  width:100%;
  max-width:100%
}
.tabs__nav,
.tabs__nav li {
  display:flex;
  flex-direction:row
}
.tabs__nav li {
  overflow-x:hidden;
  padding-right:.2rem
}
.tabs__nav li.grow {
  flex-grow:1;
  flex-basis:0;
  white-space:nowrap;
  text-overflow:ellipsis
}
.tabs__nav li:last-child {
  padding-right:0
}
.tabs__nav li span {
  display:block;
  padding:.75rem 1.5rem 1.5rem;
  background:#bcc0d0;
  color:#fff;
  font-size:1rem;
  border-top-left-radius:.5rem;
  border-top-right-radius:.5rem;
  text-align:center;
  font-weight:700;
  width:100%;
  text-overflow:ellipsis;
  white-space:nowrap;
  overflow:hidden;
  cursor:pointer
}
.tabs__nav li.active span {
  background:linear-gradient(223.06deg,#0cf 3.37%,#006079 100.96%)
}
.tabs__content {
  position:relative;
  z-index:2;
  padding:1.5rem;
  background:#f1f3f6;
  border-radius:.5rem;
  margin-top:-.75rem
}
.tabs__content a {
  text-decoration:underline;
  color:#005266
}
.tab.content {
  display: none;
  &.active {
    display: block;
  }
}
@media screen and (min-width:480px) {
  .tabs__nav li span {
    font-size:1.2rem
  }
}
@media screen and (min-width:1024px) {
  .tabs__nav li span {
    padding:1.5rem 1.5rem 3rem;
    font-size:1.8rem;
    border-top-left-radius:1rem;
    border-top-right-radius:1rem
  }
  .tabs__content {
    padding:3rem;
    margin-top:-1.5rem;
    border-radius:1rem
  }
}
.tabs img {
  width:100%;
  height:auto;
  margin-bottom:3rem
}
.tabs .about__details {
  display:block;
  width:100%;
  margin-bottom:.45rem
}
.tabs .about__details:last-child {
  margin-bottom:0
}
.tabs .about__details--name {
  font-weight:700;
  margin-bottom:1.5rem
}
.tabs .about__details--address,
.tabs .about__details--okpo {
  margin-bottom:1.5rem
}
.tabs .about__details .k {
  font-weight:700
}
.tabs .about__details__list {
  list-style:none
}
</style>