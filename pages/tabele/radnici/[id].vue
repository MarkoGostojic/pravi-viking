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
        v-if="data.length > 0"
      >
        <span>image</span>
        <h1 class="text-3xl">{{ data[0].ime }} {{ data[0].prezime }}</h1>
        <!-- <h3>rad:{{ data[0].rad[0].vreme }} časova</h3> -->
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
  <!-- VEZBAMMMMMMM -->
  <UCard>
    <template #header>
      <Placeholder class="h-8" />
      <div
        class="flex items-center justify-between mb-10"
        v-if="data.length > 0"
      >
        
        <h1 class="text-3xl">aktivnnosti radnika</h1>
        <!-- <h3>rad:{{ data[0].rad[0].vreme }} časova</h3> -->
        
      </div>
    </template>
    <Placeholder class="h-32" />
    <div class="grid gap-3 grid-cols-2">
      <div>
        <table
          v-if="data[0] && data[0].vrednost"
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
            <tr v-for="(item, index) in data[0].rad" :key="index">
              <td class="py-2 px-4 border-b">{{ item.timestamp }}</td>
              <td class="py-2 px-4 border-b">{{ item.gradilište }}</td>
              <td class="py-2 px-4 border-b">{{ item.vreme }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else>
          <h1 v-if="data[0]">Unesite svoje angažovanje</h1>
          <h1 v-else>Data not available</h1>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-4 place-items-center">
       
      </div>
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
      <!-- Modal koji dodaje aktivnosti radnika -->
      <UModal v-model="isOpenRad">
        <div class="p-4">
          <UCard class="ml-20 mr-20">
            <UForm @submit="saveRad">
              <UFormGroup
                required
                label="nova aktivnost radnika"
                name="nova aktivnost"
              >
                <UInput v-model="novaAktivnost" type="number" />
              </UFormGroup>
              <UFormGroup
                required
                label="nova mesto radnika"
                name="nova mesto"
              >
                <UInput v-model="novoMesto" type="text" />
              </UFormGroup>
              
              <UButton class="mt-2" @click="isOpenRad = false" type="submit"
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
const isOpenRad=ref(false)
const { id } = useRoute().params;
const supabase = useSupabaseClient();
const novaVrednost = ref(null);
const novoMesto=ref('')
const data = ref([]);
const noviOpis = ref("");
const novaAktivnost=ref(null)
const isLoading = ref(false);

// Izvuci individualnog radnika
const fetchRadnik = async () => {
  isLoading.value = true;
  try {
    const { data: responseData, error } = await supabase
      .from("radnici")
      .select("id,ime,prezime,aktivan,vrednost,created_at,opis,rad")
      .eq("id", id);
    if (error) {
      console.error("Error fetching data:", error.message);
    } else {
      data.value = responseData;
      console.log(data.value[0].rad[0].vreme);
    }
  } finally {
    isLoading.value = false;
  }
};
fetchRadnik();

// Nova vrednost radnog sata
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
      .from("radnici")
      .update(updatedData)
      .eq("id", id);
    if (updateError) {
      console.error("Error updating data:", updateError.message);
    } else {
      if (updateData !== null) {
        data.value = updateData;
      } else {
        await fetchRadnik();
      }
    }
  } catch (error) {
    console.error("Unexpected error:", error.message);
  }
};
// Novi opis o radniku
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
      .from("radnici")
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

// Aktivan ili pasivan radnik
const toggleAktivan = async () => {
  if (data.value.length === 0 || !data.value[0]) {
    console.error("No data available to update");
    return;
  }

  const updatedAktivan = !data.value[0].aktivan;

  try {
    const { data: updateData, error: updateError } = await supabase
      .from("radnici")
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
//Nova aktivnost
const saveRad = async () => {
  try {
    if (data.value.length === 0 || !data.value[0]) {
      console.error("No data available to update");
      return;
    }
    const existingData = { ...data.value[0] };
    if (!existingData.rad) {
      existingData.rad = [];
    }
    const updatedData = {
      ...existingData,
      rad: [
        ...existingData.rad,
        {
          vreme: novaAktivnost.value,
          timestamp: formattedDate,
          gradilište:novoMesto.value
        },
      ],
    };
    const { data: updateData, error: updateError } = await supabase
      .from("radnici")
      .update(updatedData)
      .eq("id", id);
    if (updateError) {
      console.error("Error updating data:", updateError.message);
    } else {
      if (updateData !== null) {
        data.value = updateData;
      } else {
        await fetchRadnik();
      }
    }
  } catch (error) {
    console.error("Unexpected error:", error.message);
  }
}; 
</script>
