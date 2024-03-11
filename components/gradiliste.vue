<template>
  <td class="py-2 px-4 border-b">{{ gradiliste.id }}</td>
  <td class="py-2 px-4 border-b">{{ gradiliste.ime }}</td>
  <td class="py-2 px-4 border-b">
    <div class="text-2xl mt-2">
      <i
        :class="{
          'i-heroicons-check-circle': gradiliste.aktivan,
          'text-green-500': gradiliste.aktivan,
          'i-heroicons-x-circle': !gradiliste.aktivan,
          'text-red-500': !gradiliste.aktivan,
        }"
      ></i>
    </div>
  </td>
  <td class="py-2 px-4 border-b">
    <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
      <UButton
        color="white"
        variant="ghost"
        trailing-icon="i-heroicons-ellipsis-horizontal"
        :loading="isLoading"
      />
    </UDropdown>
  </td>
  <!-- </tr> -->
</template>
<script setup>
const emit = defineEmits(["update"]);
const toast = useToast();
const supabase = useSupabaseClient();
const isLoading = ref(false);
const props = defineProps({
  gradiliste: Object,
});
const items = [
  [
    {
      label: "Izmeni status gradilistea",
      icon: "i-heroicons-pencil-square-20-solid",
      click: async () =>
        await navigateTo({
          path: `/tabele/gradilista/${props.gradiliste.id}`,
          query: {
            page: props.gradiliste.id,
            sort: "asc",
          },
        }),
    },
  ],
];
</script>
