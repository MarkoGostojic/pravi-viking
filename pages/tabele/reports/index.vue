<template>
  <NuxtLink to="/tabele/lista-tabela"
    ><UButton
      class="mb-5"
      icon="i-heroicons-arrow-left"
      color="white"
      variant="solid"
      label="Povratak na tabele"
  /></NuxtLink>
  <section class="flex items-center justify-between mb-10">
    <h1 class="text-4-xl font-extrabold">IZVEŠTAJI</h1>
    <USelectMenu v-model="selected" :options="period" />
  </section>
  <table
    class="min-w-full bg-white border border-gray-300 align-center text-center"
  >
    <thead>
      <tr>
        <th class="py-2 px-4 border-b">ID</th>
        <th class="py-2 px-4 border-b">Ime</th>
        <th class="py-2 px-4 border-b">Prezime</th>
        <th class="py-2 px-4 border-b">Sati rada po danima</th>

        <th class="py-2 px-4 border-b">Ukupno sati</th>
        <th class="py-2 px-4 border-b">Ukupno rad</th>
        <th class="py-2 px-4 border-b">Terenski dadatak</th>
      </tr>
    </thead>
    <tbody v-if="!isLoading">
      <tr v-for="radnik in radnici" :key="radnik.id">
        <td class="py-2 px-4 border-b">{{ radnik.id }}</td>
        <td class="py-2 px-4 border-b">{{ radnik.ime }}</td>
        <td class="py-2 px-4 border-b">{{ radnik.prezime }}</td>
        <div v-for="(item, index) in radnik.rad">
          <td class="py-2 px-4 border-b">{{ item.vreme }}</td>
          <td class="py-2 px-4 border-b">{{ item.timestamp }}</td>
        </div>
      </tr>
    </tbody>
    <tbody v-else>
      <tr>
        <USkeleton class="h-8 w-full mb-2" v-for="i in 6" :key="i" />
      </tr>
    </tbody>
  </table>
</template>
<script setup>
import { period } from "~/constants";
const selected = ref(period[1]);
const dates = useSelectedTimePeriod(selected);
const isLoading = ref(false);
const supabase = useSupabaseClient();
const radnici = ref([]);

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
</script>
