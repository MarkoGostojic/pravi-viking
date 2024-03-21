<template>
  <NuxtLink to="/tabele/gradilista"
    ><UButton
      icon="i-heroicons-arrow-left"
      color="white"
      variant="solid"
      label="Povratak na Gradilista tabele"
  /></NuxtLink>
  <UCard>
    <template #header>
      <Placeholder class="h-8" />
      <div
        class="flex items-center justify-between mb-10"
        v-if="gradiliste.length > 0"
      >
        <span>image</span>
        <h1 class="text-3xl">{{ gradiliste[0].ime }}</h1>
        <div class="bg-transparent">
          <UButton
            @click="toggleAktivan"
            :loading="isLoading"
            class="text-3xl mt-2 bg-transparent"
          >
            <i
              :class="{
                'i-heroicons-check-circle': gradiliste[0].aktivan,
                'text-green-500': gradiliste[0].aktivan,
                'i-heroicons-x-circle': !gradiliste[0].aktivan,
                'text-red-500': !gradiliste[0].aktivan,
              }"
            ></i
          ></UButton>
        </div>
      </div>
    </template>
    <Placeholder class="h-32" />
    <div class="grid gap-3 grid-cols-2">
      <div>
        <table
          v-if="gradiliste[0] && gradiliste[0].vrednost"
          class="min-w-full bg-white border border-gray-300 align-center text-center"
        >
          <thead>
            <tr>
              <th class="py-2 px-4 border-b">Datum promene vrednosti</th>
              <th class="py-2 px-4 border-b">Vrednost terenskog dodatka</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in gradiliste[0].vrednost" :key="index">
              <td class="py-2 px-4 border-b">{{ item.timestamp }}</td>
              <td class="py-2 px-4 border-b">{{ item.cena }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else>
          <h1 v-if="gradiliste[0]">Unesite vrednost terenskog dodatka</h1>
          <h1 v-else>gradiliste not available</h1>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-4 place-items-center">
        <div v-if="gradiliste[0] && gradiliste[0].opis" class="ml-5">
          <h1>{{ gradiliste[0].opis }}</h1>
        </div>
        <div v-else>
          <h1 v-if="gradiliste[0]">dodaj opis gradilista</h1>
          <h1 v-else>gradiliste not available</h1>
        </div>
      </div>
    </div>
    <template #footer>
      <Placeholder class="h-8" />
      <div class="flex items-center justify-between m-2">
        <UButton
          @click="isOpenTeren = true"
          icon="i-heroicons-plus-circle"
          color="green"
          variant="solid"
          label="Promena cene terenskog dodatka"
          :loading="isLoading"
        />
        <UButton
          @click="isOpenOpis = true"
          icon="i-heroicons-plus-circle"
          color="green"
          variant="solid"
          label="Zabeleška o gradilistu"
          :loading="isLoading"
        />
      </div>
      <NovaVrednostTerenskogDodatka
        v-model="isOpenTeren"
        @update="refreshGradilista()"
        @saved="refreshGradilista()"
      />
      <NovOpisGradilista
        v-model="isOpenOpis"
        @update="refreshGradilista()"
        @saved="refreshGradilista()"
      />
    </template>
  </UCard>
</template>
<script setup>
const isOpenTeren = ref(false);
const isOpenOpis = ref(false);
const { id } = useRoute().params;
const supabase = useSupabaseClient();
const gradiliste = ref([]);
const isLoading = ref(false);

const fetchGradiliste = async () => {
  isLoading.value = true;
  try {
    const { data } = await useAsyncData("gradilista", async () => {
      const { data, error } = await supabase
        .from("gradilista")
        .select("id,ime,aktivan,vrednost,created_at,opis")
        .eq("id", id);
      if (error) return [];
      return data;
    });
    return data.value;
  } finally {
    isLoading.value = false;
  }
};
gradiliste.value = await fetchGradiliste();
const refreshGradilista = async () =>
  (gradiliste.value = await fetchGradiliste());
await refreshGradilista();
console.log(gradiliste.value);

// Aktivno ili pasivno gradiliste
const toggleAktivan = async () => {
  if (gradiliste.value.length === 0 || !gradiliste.value[0]) {
    console.error("No data available to update");
    return;
  }
  isLoading.value = true;
  const updatedAktivan = !gradiliste.value[0].aktivan;

  try {
    const { gradiliste: updateData, error: updateError } = await supabase
      .from("gradilista")
      .update({ aktivan: updatedAktivan })
      .eq("id", id);

    if (updateError) {
      console.error("Error updating data:", updateError.message);
    } else {
      console.log("Data updated successfully!", gradiliste);
      gradiliste.value[0].aktivan = updatedAktivan;
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
