<template>
  <NuxtLink to="/tabele/lista-tabela"
    ><UButton
      icon="i-heroicons-arrow-left"
      color="white"
      variant="solid"
      label="Povratak na tabele"
  /></NuxtLink>

  <table
    class="min-w-full bg-white border border-gray-300 align-center text-center"
  >
    <thead>
      <tr>
        <th class="py-2 px-4 border-b">ID</th>
        <th class="py-2 px-4 border-b">Ime</th>
        <th class="py-2 px-4 border-b">Aktivno</th>
        <th class="py-2 px-4 border-b">...</th>
      </tr>
    </thead>
    <tbody v-if="!isLoading">
      <tr v-for="gradiliste in gradilista" :key="gradiliste.id">
        <Gradiliste :gradiliste="gradiliste" />
      </tr>
    </tbody>
    <tbody v-else>
      <tr>
        <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
      </tr>
    </tbody>
  </table>
  <div>
    <NovoGradilisteModal
      v-model="isOpen"
      @update="refreshGradilista()"
      @saved="refreshGradilista()"
    />
    <UButton
      @click="isOpen = true"
      icon="i-heroicons-plus-circle"
      color="white"
      variant="solid"
      label="Dodaj gradiliste"
    />
  </div>
</template>
<script setup>
const isOpen = ref(false);
const supabase = useSupabaseClient();
const gradilista = ref([]);
const isLoading = ref(false);

const fetchGradilista = async () => {
  isLoading.value = true;
  try {
    const { data } = await useAsyncData("gradilista", async () => {
      const { data, error } = await supabase
        .from("gradilista")
        .select()
        .order("created_at", { ascending: false });
      if (error) return [];
      return data;
    });
    return data.value;
  } finally {
    isLoading.value = false;
  }
};
gradilista.value = await fetchGradilista();
const refreshGradilista = async () =>
  (gradilista.value = await fetchGradilista());
await refreshGradilista();

console.log(gradilista.value);
</script>
