<template>
  <NuxtLink to="/tabele/radnici"
    ><UButton
      icon="i-heroicons-arrow-left"
      color="white"
      variant="solid"
      label="Povratak na Radnici tabele"
  /></NuxtLink>
  <UCard>
    <template #header>
      <Placeholder class="h-8" />
      <div
        class="flex items-center justify-between mb-10"
        v-if="radnik.length > 0"
      >
        <span>image</span>
        <h1 class="text-3xl">{{ radnik[0].ime }} {{ radnik[0].prezime }}</h1>
        <div class="bg-transparent">
          <UButton
            @click="toggleAktivan"
            :loading="isLoading"
            class="text-3xl mt-2 bg-transparent"
          >
            <i
              :class="{
                'i-heroicons-check-circle': radnik[0].aktivan,
                'text-green-500': radnik[0].aktivan,
                'i-heroicons-x-circle': !radnik[0].aktivan,
                'text-red-500': !radnik[0].aktivan,
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
          v-if="radnik[0] && radnik[0].vrednost"
          class="min-w-full bg-white border border-gray-300 align-center text-center"
        >
          <thead>
            <tr>
              <th class="py-2 px-4 border-b">Datum promene vrednosti</th>
              <th class="py-2 px-4 border-b">Vrednost radnog sata</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in radnik[0].vrednost" :key="index">
              <td class="py-2 px-4 border-b">{{ item.timestamp }}</td>
              <td class="py-2 px-4 border-b">{{ item.cena }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else>
          <h1 v-if="radnik[0]">Unesite vrednost radnog sata</h1>
          <h1 v-else>Data not available</h1>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-4 place-items-center">
        <div v-if="radnik[0] && radnik[0].opis" class="ml-5">
          <h1>{{ radnik[0].opis }}</h1>
        </div>
        <div v-else>
          <h1 v-if="radnik[0]">dodaj opis radnika</h1>
          <h1 v-else>Data not available</h1>
        </div>
      </div>
    </div>
    <template #footer>
      <Placeholder class="h-8" />
      <div class="flex items-center justify-between m-2">
        <UButton
          @click="isOpenCene = true"
          icon="i-heroicons-plus-circle"
          color="green"
          variant="solid"
          label="Promena cene radnog sata"
        />
        <UButton
          @click="isOpenOpis = true"
          icon="i-heroicons-plus-circle"
          color="green"
          variant="solid"
          label="Zabeleška o radniku"
        />
      </div>
      <NovaCenaRadnogSata
        v-model="isOpenCene"
        @update="refreshRadnici()"
        @saved="refreshRadnici()"
      />
      <NoviOpisRadnikaModal
        v-model="isOpenOpis"
        @update="refreshRadnici()"
        @saved="refreshRadnici()"
      />
    </template>
  </UCard>
  =
  <UCard>
    <template #header>
      <Placeholder class="h-8" />
      <div
        class="flex items-center justify-between mb-10"
        v-if="radnik.length > 0"
      >
        <h1 class="text-3xl">Aktivnosti radnika</h1>
      </div>
    </template>
    <Placeholder class="h-32" />
    <div class="grid gap-3 grid-cols-2">
      <div>
        <table
          v-if="radnik[0] && radnik[0].vrednost"
          class="min-w-full bg-white border border-gray-300 align-center text-center"
        >
          <thead>
            <tr>
              <th class="py-2 px-4 border-b">Datum rada</th>
              <th class="py-2 px-4 border-b">Mesto rada</th>
              <th class="py-2 px-4 border-b">Časovi rada</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in radnik[0].rad" :key="index">
              <td class="py-2 px-4 border-b">
                {{ formatDate(item.datum) }}
              </td>
              <td class="py-2 px-4 border-b">{{ item.mesto }}</td>
              <td class="py-2 px-4 border-b">{{ item.vreme }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else>
          <h1 v-if="radnik[0]">Unesite svoje angažovanje</h1>
          <h1 v-else>Data not available</h1>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-4 place-items-center"></div>
    </div>
    <template #footer>
      <Placeholder class="h-8" />
      <div class="flex items-center justify-between m-2">
        <UButton
          @click="isOpenRad = true"
          icon="i-heroicons-plus-circle"
          color="green"
          variant="solid"
          label="aktivnost po danu"
        />
      </div>
      <NovaAktivnostRadnika
        v-model="isOpenRad"
        @update="refreshRadnici()"
        @saved="refreshRadnici()"
      />
    </template>
  </UCard>
</template>
<script setup>
const isOpenCene = ref(false);
const isOpenOpis = ref(false);
const isOpenRad = ref(false);
const { id } = useRoute().params;
const supabase = useSupabaseClient();
const radnik = ref([]);
const isLoading = ref(false);
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};
// Izvuci individualnog radnika
const fetchRadnik = async () => {
  isLoading.value = true;
  try {
    const { data } = await useAsyncData("radnici", async () => {
      const { data, error } = await supabase
        .from("radnici")
        .select("id,ime,prezime,aktivan,vrednost,created_at,opis,rad")
        .eq("id", id);
      if (error) return [];
      return data;
    });
    return data.value;
  } finally {
    isLoading.value = false;
  }
};
radnik.value = await fetchRadnik();
const refreshRadnici = async () => (radnik.value = await fetchRadnik());
await refreshRadnici();
console.log(radnik.value);
// Aktivan ili pasivan radnik
const toggleAktivan = async () => {
  if (radnik.value.length === 0 || !radnik.value[0]) {
    console.error("No data available to update");
    return;
  }
  isLoading.value = true;
  const updatedAktivan = !radnik.value[0].aktivan;

  try {
    const { radnik: updateData, error: updateError } = await supabase
      .from("radnici")
      .update({ aktivan: updatedAktivan })
      .eq("id", id);

    if (updateError) {
      console.error("Error updating data:", updateError.message);
    } else {
      console.log("Data updated successfully!", radnik);
      radnik.value[0].aktivan = updatedAktivan;
    }
  } finally {
    isLoading.value = false;
    console.error(updateError.message);
  }
};
</script>
