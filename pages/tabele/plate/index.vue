<template>
  <NuxtLink to="/tabele/lista-tabela">
    <UButton
      class="mb-5"
      icon="i-heroicons-arrow-left"
      color="white"
      variant="solid"
      label="Povratak na tabele"
    />
  </NuxtLink>
  <section class="flex items-center justify-between mb-10">
    <h1 class="text-4xl font-extrabold">PLATNE LISTE</h1>
    <!-- <USelectMenu v-model="selected" :options="period" /> -->
  </section>

  <table
    class="min-w-full bg-white border border-gray-300 align-center text-center"
  >
    <thead>
      <tr>
        <th class="py-2 px-4 border-b">Ime</th>
        <th class="py-2 px-4 border-b">Prezime</th>
        <th class="py-2 px-4 border-b">Vreme rada</th>
        <th class="py-2 px-4 border-b">Datum rada</th>
        <th class="py-2 px-4 border-b">Mesto rada</th>
        <!-- <th class="py-2 px-4 border-b">
          <UButton @click="showDetails" :loading="isLoading"
            >Detalji rada</UButton
          >
        </th> -->
      </tr>
    </thead>
    <tbody v-if="!isLoading">
      <tr v-for="p in plate" :key="p.id">
        <td class="py-2 px-4 border-b">{{ p.radnici.ime }}</td>
        <td class="py-2 px-4 border-b">{{ p.radnici.prezime }}</td>

        <td class="py-2 px-4 border-b">{{ p.vreme_rada }}</td>
        <td class="py-2 px-4 border-b">{{ formatDate(p.radno_vreme) }}</td>
        <td class="py-2 px-4 border-b">{{ p.gradilista.ime }}</td>

        <div v-if="details">
          <td class="py-2 px-4 border-b" v-for="(item, i) in r.rad" :key="i">
            {{ formatDate(item.datum) }}, <br />{{ item.vreme }},
            {{ item.mesto }}
          </td>
        </div>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
const supabase = useSupabaseClient();
const plate = ref([]);
const isLoading = ref(false);
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};
const fetchPlate = async () => {
  isLoading.value = true;
  try {
    const { data } = await useAsyncData("platne_liste", async () => {
      const { data, error } = await supabase
        .from("platne_liste")
        .select(`*,radnici(*),gradilista(*)`)
        .order("created_at", { ascending: false });
      if (error) return [];
      return data;
    });
    return data.value;
  } finally {
    isLoading.value = false;
  }
};
plate.value = await fetchPlate();
const refreshPlate = async () => (plate.value = await fetchPlate());
await refreshPlate();

console.log(plate.value);
</script>
