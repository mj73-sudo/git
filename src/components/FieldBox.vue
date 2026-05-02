<template>
  <!--  <div class="row-box">

    &lt;!&ndash; باکس اصلی &ndash;&gt;
    <div class="input-box" :class="{ opened: item.open }">      <span>{{ item.title }}</span>

      <v-btn
        v-if="hasChildren"
        icon
        size="x-small"
        @click="item.open = !item.open"
      >
        {{ item.open ? '-' : '+' }}
      </v-btn>
    </div>


    &lt;!&ndash; زیرآیتم‌ها &ndash;&gt;
    <div
      v-if="item.open && hasChildren"
      class="right-items"
    >
      <FieldBox
        v-for="(child, index) in item.children"
        :key="index"
        :item="child"
      />
    </div>

  </div>-->

  <div
    v-for="(level, levelIndex) in levels"
    :key="levelIndex"
    class="tree-row"
    dir="ltr"
    :style="{ paddingLeft: (levelIndex * 20) + 'px' }"
  >
    <div
      v-for="item in level"
      :key="item.title"
      class="arrow-node"
    >
      <button class="arrow-body" @click="toggle(item, levelIndex)">
        <span class="arrow-text">{{ item.title }}</span>

        <!-- فقط مثبت و منفی -->
        <span v-if="item.children?.length" class="pm-sign">
          {{ item.open ? '−' : '+' }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
 /* import { computed } from 'vue'

  import FieldBox from './FieldBox.vue'

  const props = defineProps({
    item: Object,
  })

  const hasChildren = computed(() =>
    props.item.children && props.item.children.length
  )*/
  import { ref } from 'vue'

  const props = defineProps({
    items: Array,
  })

  const levels = ref([props.items])

  function closeChildren (nodes){
    nodes?.forEach(n => {
      n.open = false
      if (n.children) closeChildren(n.children)
    })
  }

  function toggle (item, levelIndex) {

    const wasOpen = item.open

    // بستن همه آیتم‌های سطح فعلی
    levels.value[levelIndex].forEach(n => n.open = false)

    // حذف سطوح پایین
    levels.value = levels.value.slice(0, levelIndex + 1)

    // اگر قبلاً باز بوده → کامل ببند
    if (wasOpen) {
      closeChildren(item.children)
      return
    }

    // باز کردن آیتم
    item.open = true

    // اضافه کردن سطح بعد
    if (item.children?.length) {
      levels.value.push(item.children)
    }
  }
</script>

<style scoped>
.tree-row {
  display: flex;
  gap: 24px;
  margin-bottom: 18px;

}

/* نود */
.arrow-node {
  position: relative;
}

/* بدنه فلش */
.arrow-body {
  position: relative;
  background: #2563eb;
  color: #fff;
  font-size: 14px;
  padding: 10px 34px 10px 16px; /* راست کمتر، چپ بیشتر برای فلش */
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 150px;
  font-weight: 500;
  box-shadow: 0 6px 12px rgba(0,0,0,0.1);

  /* شکل فلش */
  clip-path: polygon(
    0% 0%,
    85% 0%,
    100% 50%,
    85% 100%,
    0% 100%
  );
}

/* متن */
.arrow-text {
  flex: 1;
  text-align: left;
}

/* فلش توی خود نود */
.arrow-icon-right,
.arrow-icon-down {
  width: 0;
  height: 0;
  border-style: solid;
}

/* حالت بسته ▶ */
.arrow-icon-right {
  border-width: 6px 0 6px 8px;
  border-color: transparent transparent transparent white;

}

/* حالت باز ▼ */
.arrow-icon-down {
  border-width: 8px 6px 0 6px;
  border-color: white transparent transparent transparent;

}

/*
.row-box{
  display:flex;
  align-items:stretch;
  margin-bottom:0px;
}

!* باکس هر آیتم (چپ) *!
.input-box{
  width:220px;
  border:1px solid #d0d4da;
  border-radius:6px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:6px 10px;
  background:#ffffff;
  font-size:14px;
  color:#263043;
  box-shadow:0 1px 2px rgba(0,0,0,0.03);
  transition:all .2s ease;
}

!* هاور شیک *!
.input-box:hover{
  background:#f6f8fb;
  border-color:#b8c2d1;
  box-shadow:0 2px 4px rgba(0,0,0,0.08);
}

!* حالت باز *!
.input-box.opened{
  border-color:#2d6cdf;
  background:#eef3ff;
  color:#1e3f8a;
  box-shadow:0 2px 6px rgba(45,108,223,0.15);
}

!* خط درختی سمت راست *!
.right-items{
  margin-left:20px;
  display:flex;
  flex-direction:column;
  gap:4px;
  border-left:2px solid #e4e7ec;
  padding-left:14px;
}

!* دکمه باز/بسته *!
.v-btn{
  min-width:22px;
  height:22px;
  font-size:16px;
  border-radius:5px;
  background:#eef1f5 !important;
  color: #f81212 !important;
  transition:all .2s ease;
  box-shadow:0 1px 2px rgba(0,0,0,0.05);
}

.v-btn:hover{
  background:#d9dee6 !important;
  color:#1d2a3d !important;
  box-shadow:0 2px 4px rgb(30, 50, 225);
}

*/


</style>
`
