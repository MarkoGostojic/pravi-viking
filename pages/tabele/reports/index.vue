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
    <h1 class="text-4xl font-extrabold">IZVEŠTAJI</h1>
    <!-- <USelectMenu v-model="selected" :options="period" /> -->
  </section>
  <table
    class="min-w-full bg-white border border-gray-300 align-center text-center"
  >
    <thead>
      <tr>
        <th class="py-2 px-4 border-b">ID</th>
        <th class="py-2 px-4 border-b">Ime</th>
        <th class="py-2 px-4 border-b">Prezime</th>
        <th class="py-2 px-4 border-b">Rad ukupno</th>
        <th class="py-2 px-4 border-b">Dani rada na terenu</th>
        <th class="py-2 px-4 border-b">
          <UButton @click="showDetails" :loading="isLoading"
            >Detalji rada</UButton
          >
        </th>
      </tr>
    </thead>
    <tbody v-if="!isLoading">
      <tr v-for="r in radnikWithSum" :key="r.id">
        <td class="py-2 px-4 border-b">{{ r.id }}</td>
        <td class="py-2 px-4 border-b">{{ r.ime }}</td>
        <td class="py-2 px-4 border-b">{{ r.prezime }}</td>
        <td class="py-2 px-4 border-b">{{ r.totalVreme }}</td>
        <td class="py-2 px-4 border-b">11</td>
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
// import { period } from "~/constants";
// const selected = ref(period[1]);
// const { current, previous } = useSelectedTimePeriod(selected);
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};
const isLoading = ref(false);
const supabase = useSupabaseClient();
const radnici = ref([]);
const details = ref(false);
const showDetails = () => (details.value = !details.value);
// Time period

// watch(period, async () => {
//   await refreshRadnici();
// });

// Fetch radnici table
const fetchRadnici = async () => {
  try {
    isLoading.value = true;
    const { data } = await useAsyncData("radnici", async () => {
      const { data, error } = await supabase
        .from("radnici")
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
radnici.value = await fetchRadnici();
const refreshRadnici = async () => (radnici.value = await fetchRadnici());
await refreshRadnici();
console.log(radnici.value[0].rad[1].vreme);

const radnik = computed(() => {
  let allRad = [];

  for (const r of radnici.value) {
    allRad.push(r);
  }
  return allRad;
});
const radnikWithSum = computed(() => {
  return radnici.value.map((r) => {
    if (!r.rad) {
      return { ...r, totalVreme: 0 }; // Set totalVreme to 0 if r.rad is null or undefined
    }
    const totalVreme = r.rad.reduce((acc, item) => acc + item.vreme, 0);

    return { ...r, totalVreme };
  });
});

console.log(radnikWithSum.value);

console.log(radnik.value);
</script>
