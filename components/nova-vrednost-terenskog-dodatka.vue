<template>
  <UModal v-model="isOpenTeren">
    <div class="p-4">
      <UForm @submit="saveTeren" :state="state" :schema="schema" ref="form">
        <UCard class="ml-20 mr-20">
          <template #header>Izmeni cenu terenskog dodatka</template>
          <UFormGroup required label="nova cena terenskog dodatka" name="cena">
            <UInput
              v-model="state.cena"
              type="number"
              placeholder="upiši vrednost terenskog dodatka"
            />
          </UFormGroup>
          <UButton
            class="mt-2"
            type="submit"
            color="green"
            variant="solid"
            label="sačuvati"
            :loading="isLoading"
          ></UButton>
        </UCard>
      </UForm>
    </div>
  </UModal>
</template>
<script setup>
const { id } = useRoute().params;
const supabase = useSupabaseClient();
const toast = useToast();
import { z } from "zod";
const isLoading = ref(false);
const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(["update:modelValue", "saved"]);
const schema = z.object({
  cena: z.number(),
});
const initialState = {
  cena: undefined,
};
const state = ref({
  ...initialState,
});
const resetForm = () => {
  Object.assign(state.value, initialState);
  form.value.clear();
};
const form = ref();
const currentDate = new Date();
const formattedDate = `${currentDate.getDate()}.${
  currentDate.getMonth() + 1
}.${currentDate.getFullYear()}`;
// STORE INTO the SUPABASE

const saveTeren = async () => {
  try {
    if (form.value.errors.length) return;
    isLoading.value = true;

    console.log("Fetching existing data from Supabase...");
    const { data: existingData, error: fetchError } = await supabase
      .from("gradilista")
      .select("vrednost")
      .eq("id", id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    console.log("Existing data fetched:", existingData);

    const updatedVrednost = existingData.vrednost
      ? [...existingData.vrednost, { ...state.value, timestamp: formattedDate }]
      : [{ ...state.value, timestamp: formattedDate }];

    console.log("Updated vrednost:", updatedVrednost);

    console.log("Updating record in Supabase...");
    const { error: updateError } = await supabase
      .from("gradilista")
      .update({ vrednost: updatedVrednost })
      .eq("id", id);

    if (!updateError) {
      toast.add({
        title: "Nova cena terenskog dodatka je dodata",
        icon: "i-heroicons-check-circle",
      });
      isOpenTeren.value = false;
      emit("saved");
      console.log("Record updated successfully.");
    }
  } catch (error) {
    console.error("Error during saveTeren:", error);
    toast.add({
      title: "Neuspešno izmena cene terenskog dodatka",
      description: error.message || "Nepoznata greška",
      icon: "i-heroicons-exclamation-circle",
    });
  } finally {
    isLoading.value = false;
  }
};

const isOpenTeren = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) resetForm();
    emit("update:modelValue", value);
  },
});
</script>
