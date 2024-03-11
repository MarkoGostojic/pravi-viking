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
        v-if="data.length > 0"
      >
        <span>image</span>
        <h1 class="text-3xl">{{ data[0].ime }}</h1>
        <div class="bg-transparent">
          <UButton @click="toggleAktivan" class="text-3xl mt-2 bg-transparent">
            <i
              :class="{
                'i-heroicons-check-circle': data[0].aktivan,
                'text-green-500': data[0].aktivan,
                'i-heroicons-x-circle': !data[0].aktivan,
                'text-red-500': !data[0].aktivan,
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
          v-if="data[0] && data[0].vrednost.length"
          class="min-w-full bg-white border border-gray-300 align-center text-center"
        >
          <thead>
            <tr>
              <th class="py-2 px-4 border-b">Datum promene vrednosti</th>
              <th class="py-2 px-4 border-b">Vrednost radnog sata</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in data[0].vrednost" :key="index">
              <td class="py-2 px-4 border-b">{{ item.timestamp }}</td>
              <td class="py-2 px-4 border-b">{{ item.value }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else>
          <h1 v-if="data[0]">Unesite vrednost radnog sata</h1>
          <h1 v-else>Data not available</h1>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-4 place-items-center">
        <div v-if="data[0] && data[0].opis" class="ml-5">
          <h1>{{ data[0].opis }}</h1>
        </div>
        <div v-else>
          <h1 v-if="data[0]">dodaj opis radnika</h1>
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
          label="Promena cene terenskog dodatka"
        />
        <UButton
          @click="isOpenOpis = true"
          icon="i-heroicons-plus-circle"
          color="green"
          variant="solid"
          label="Zabeleška o gradilistu"
        />
      </div>
      <!-- Modal koji menja cene radnog casa -->
      <UModal v-model="isOpenCene">
        <div class="p-4">
          <UCard class="ml-20 mr-20">
            <UForm @submit="saveCene">
              <UFormGroup
                required
                label="nova cena radnog sata"
                name="nova cena"
              >
                <UInput v-model="novaVrednost" type="number" />
              </UFormGroup>
              <UButton class="mt-2" @click="isOpenCene = false" type="submit"
                >sačuvaj</UButton
              >
            </UForm>
          </UCard>
        </div>
      </UModal>
      <!-- Modal koji vrsi zabeleske o radniku -->
      <UModal v-model="isOpenOpis">
        <div class="p-4">
          <UCard class="ml-20 mr-20">
            <UForm @submit="saveOpis">
              <UFormGroup
                required
                label="unesi podatke relevantne za zaposlenog"
                name="novai opis"
              >
                <UInput v-model="noviOpis" type="text" />
              </UFormGroup>
              <UButton class="mt-2" @click="isOpenOpis = false" type="submit"
                >sačuvaj</UButton
              >
            </UForm>
          </UCard>
        </div>
      </UModal>
    </template>
  </UCard>
</template>
<script setup>
// import { ref, watch } from "vue";
const isOpenCene = ref(false);
const isOpenOpis = ref(false);
const { id } = useRoute().params;
const supabase = useSupabaseClient();
const novaVrednost = ref(null);
const data = ref([]);
const noviOpis = ref("");
const isLoading = ref(false);

const fetchGradiliste = async () => {
  isLoading.value = true;
  try {
    const { data: responseData, error } = await supabase
      .from("gradilista")
      .select("id,ime,aktivan,vrednost,created_at,opis")
      .eq("id", id);
    if (error) {
      console.error("Error fetching data:", error.message);
    } else {
      data.value = responseData;
    }
  } finally {
    isLoading.value = false;
  }
};
fetchGradiliste();

//   // Nova vrednost terenskog dodatka
const currentDate = new Date();
const formattedDate = `${currentDate.getDate()}.${
  currentDate.getMonth() + 1
}.${currentDate.getFullYear()}`;
const saveCene = async () => {
  try {
    if (data.value.length === 0 || !data.value[0]) {
      console.error("No data available to update");
      return;
    }
    const existingData = { ...data.value[0] };
    if (!existingData.vrednost) {
      existingData.vrednost = [];
    }
    const updatedData = {
      ...existingData,
      vrednost: [
        ...existingData.vrednost,
        {
          value: novaVrednost.value,
          timestamp: formattedDate,
        },
      ],
    };
    const { data: updateData, error: updateError } = await supabase
      .from("gradilista")
      .update(updatedData)
      .eq("id", id);
    if (updateError) {
      console.error("Error updating data:", updateError.message);
    } else {
      if (updateData !== null) {
        data.value = updateData;
      } else {
        await fetchGradiliste();
      }
    }
  } catch (error) {
    console.error("Unexpected error:", error.message);
  }
};
// Novi opis o gradilistu
const saveOpis = async () => {
  try {
    if (data.value.length === 0 || !data.value[0]) {
      console.error("No data available to update");
      return;
    }

    const existingData = { ...data.value[0].opis };
    const updatedData = {
      ...existingData,
      opis: noviOpis.value, // Use noviOpis.value to update the opis field
    };

    const { data: updateData, error: updateError } = await supabase
      .from("gradilista")
      .update({ opis: updatedData.opis })
      .eq("id", id);

    if (updateError) {
      console.error("Error updating data:", updateError.message);
    } else {
      data.value[0].opis = noviOpis.value;
    }
  } catch (error) {
    console.error("Unexpected error:", error.message);
  }
};

//   // Aktivno ili pasivno gradiliste
const toggleAktivan = async () => {
  if (data.value.length === 0 || !data.value[0]) {
    console.error("No data available to update");
    return;
  }

  const updatedAktivan = !data.value[0].aktivan;

  try {
    const { data: updateData, error: updateError } = await supabase
      .from("gradilista")
      .update({ aktivan: updatedAktivan })
      .eq("id", id);

    if (updateError) {
      console.error("Error updating data:", updateError.message);
    } else {
      console.log("Data updated successfully!", data);
      data.value[0].aktivan = updatedAktivan;
    }
  } catch (error) {
    console.error("Unexpected error:", error.message);
  }
};
</script>
