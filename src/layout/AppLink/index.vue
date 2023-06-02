<template>
  <component v-if="type" :is="type" v-bind="linkProps">
    <slot />
  </component>
  <slot v-else />
</template>

<script setup>
  const { to } = defineProps(["to"]);
  const linkProps = {};
  let type = "";

  if (to.startsWith("http")) {
    type = "a";
    linkProps.href = to;
    linkProps.target = "_blank";
  } else {
    type = "router-link";
    linkProps.to = to;
  }
</script>

<style scoped>
  .app-link__sharp {
    font-size: 0.85em;
    color: var(--primary-color);
  }

  .app-link__sharp:hover {
    border-bottom: 2px solid var(--primary-color);
  }

  .app-link--disabled {
    pointer-events: none;
  }
  a {
    text-decoration: none;
  }
</style>
