<template>
  <!-- <tr v-for="radnik in radnici" :key="radnik.id"> -->
  <td class="py-2 px-4 border-b">{{ radnik.id }}</td>
  <td class="py-2 px-4 border-b">{{ radnik.ime }}</td>
  <td class="py-2 px-4 border-b">{{ radnik.prezime }}</td>
  <td class="py-2 px-4 border-b">{{ radnik.aktivan }}</td>
  <td class="py-2 px-4 border-b">{{ radnik.kategorija }}</td>
  <td class="py-2 px-4 border-b">{{ radnik.vrednost }}</td>
  <td class="py-2 px-4 border-b">
    <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
      <UButton
        color="white"
        variant="ghost"
        trailing-icon="i-heroicons-ellipsis-horizontal"
      />
    </UDropdown>
  </td>
  <!-- </tr> -->
</template>
<script setup>
const props = defineProps({
  radnik: Object,
});
const items = [
  [
    {
      label: "Izmeni status radnika",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => console.log("Izmeni"),
    },
    {
      label: "Izmeni status radnika",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => console.log("Izmeni"),
    },
  ],
];
</script>
