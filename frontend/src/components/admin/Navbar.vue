<template>
  <div class="h-10 flex justify-between lg:justify-end items-center px-2">
    <div class="flex items-center block lg:hidden">
      <slot name="left"/>
    </div>
    <div class="flex items-center gap-4">
      <slot name="right"/>
    </div>
  </div>
</template>
