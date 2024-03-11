<template>
  <td class="py-2 px-4 border-b">{{ radnik.id }}</td>
  <td class="py-2 px-4 border-b">{{ radnik.ime }}</td>
  <td class="py-2 px-4 border-b">{{ radnik.prezime }}</td>
  <td class="py-2 px-4 border-b">
    <div class="text-2xl mt-2">
      <i
        :class="{
          'i-heroicons-check-circle': radnik.aktivan,
          'text-green-500': radnik.aktivan,
          'i-heroicons-x-circle': !radnik.aktivan,
          'text-red-500': !radnik.aktivan,
        }"
      ></i>
    </div>
  </td>
  <td class="py-2 px-4 border-b">{{ radnik.kategorija }}</td>
  <!-- <td class="py-2 px-4 border-b">{{ radnik.vrednost[0].value }} RSD</td> -->
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
  radnik: Object,
});
const items = [
  [
    // {
    //   label: "Izmeni status radnika",
    //   icon: "i-heroicons-pencil-square-20-solid",
    //   click: async () => {
    //     isLoading.value = true;
    //     try {
    //       const currentAktivanValue = props.radnik.aktivan;
    //       const newAktivanValue = !currentAktivanValue;

    //       await supabase
    //         .from("radnici")
    //         .update({ aktivan: newAktivanValue })
    //         .eq("id", props.radnik.id);
    //       toast.add({
    //         title: "Izmenjen statsu radnika",
    //         icon: "i-heroicons-check-circle",
    //         color: "green",
    //       });
    //       emit("update", props.radnik.id);
    //     } catch (error) {
    //       toast.add({
    //         title: "Neuspešna radnja",
    //         icon: "i-heroicons-check-circle",
    //         color: "red",
    //       });
    //     } finally {
    //       isLoading.value = false;
    //     }
    //   },
    // },
    {
      label: "Izmeni status radnika",
      icon: "i-heroicons-pencil-square-20-solid",
      click: async () =>
        await navigateTo({
          path: `/tabele/radnici/${props.radnik.id}`,
          query: {
            page: props.radnik.id,
            sort: "asc",
          },
        }),
    },
  ],
];
</script>
