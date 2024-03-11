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
        <th class="py-2 px-4 border-b">Prezime</th>
        <th class="py-2 px-4 border-b">Aktivan</th>
        <th class="py-2 px-4 border-b">Kategorija</th>
        <th class="py-2 px-4 border-b">...</th>
      </tr>
    </thead>
    <tbody v-if="!isLoading">
      <tr v-for="radnik in radnici" :key="radnik.id">
        <Radnik :radnik="radnik" />
      </tr>
    </tbody>
    <tbody v-else>
      <tr>
        <USkeleton class="h-8 w-full mb-2" v-for="i in 6" :key="i" />
      </tr>
    </tbody>
  </table>
  <div>
    <NoviRadnikModal
      v-model="isOpen"
      @update="refreshRadnici()"
      @saved="refreshRadnici()"
    />
    <UButton
      @click="isOpen = true"
      icon="i-heroicons-plus-circle"
      color="white"
      variant="solid"
      label="Dodaj radnika"
    />
  </div>
</template>
<script setup>
const isOpen = ref(false);
const supabase = useSupabaseClient();
const radnici = ref([]);
const isLoading = ref(false);

const fetchRadnici = async () => {
  isLoading.value = true;
  try {
    const { data } = await useAsyncData("radnici", async () => {
      const { data, error } = await supabase
        .from("radnici")
        .select()
        .order("kategorija", { ascending: false });
      if (error) return [];
      return data;
    });
    return data.value;
  } finally {
    isLoading.value = false;
  }
};
radnici.value = await fetchRadnici();
const refreshRadnici = async () => (radnici.value = await fetchRadnici());
await refreshRadnici();

// console.log(radnici.value);
</script>
