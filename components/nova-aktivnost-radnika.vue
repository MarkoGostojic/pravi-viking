<template>
  <UModal v-model="isOpenRad">
    <div class="p-4">
      <UForm @submit="saveRad" :state="state" :schema="schema" ref="form">
        <UCard class="ml-20 mr-20">
          <template #header>Dodaj novu aktivnost zposlenog</template>
          <UFormGroup required label="nova aktivnost radnika" name="aktivnost">
            <UInput
              v-model="state.vreme"
              type="number"
              placeholder="period rada zaposlenog"
            />
          </UFormGroup>
          <UFormGroup required label="nova mesto radnika" name="nova mesto">
            <UInput required v-model="state.mesto" type="text" />
          </UFormGroup>
          <UFormGroup required label="nov period rada" name="period">
            <UInput
              required
              v-model="state.datum"
              type="date"
              icon="i-heroicons-calendar-days-20-solid"
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
  datum: z.string(),
  mesto: z.string(),
  vreme: z.number().positive("Vrednost radnog sata mora biti veća od 0"),
});

const initialState = {
  datum: new Date().toISOString().substr(0, 10),
  mesto: "",
  vreme: undefined,
};
const state = ref({
  ...initialState,
});
const resetForm = () => {
  Object.assign(state.value, initialState);
  form.value.clear();
};
const form = ref();

const saveRad = async () => {
  if (form.value.errors.length) return;
  isLoading.value = true;
  try {
    // Fetch existing data from Supabase
    const { data: existingData, error: fetchError } = await supabase
      .from("radnici")
      .select("rad")
      .eq("id", id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // Merge existing rad array with the new value
    const updatedVrednost = existingData.rad
      ? [...existingData.rad, { ...state.value }]
      : [{ ...state.value }];

    // Update the record in Supabase with the updated rad array
    const { error: updateError } = await supabase
      .from("radnici")
      .update({ rad: updatedVrednost })
      .eq("id", id);

    if (!updateError) {
      toast.add({
        title: "Nova aktivnost radnika je dodata",
        icon: "i-heroicons-check-circle",
      });
      isOpenRad.value = false;
      emit("saved");
    }
  } catch (error) {
    toast.add({
      title: "Neuspešno dodavanje aktivnosti radnik",
      description: error.message,
      icon: "i-heroicons-exclamation-circle",
    });
  } finally {
    isLoading.value = false;
  }
};

const isOpenRad = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) resetForm();
    emit("update:modelValue", value);
  },
});
</script>
