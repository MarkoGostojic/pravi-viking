<template>
  <UModal v-model="isOpenCene">
    <div class="p-4">
      <UForm @submit="saveCene" :state="state" :schema="schema" ref="form">
        <UCard class="ml-20 mr-20">
          <template #header>Izmeni cenu radnog sata</template>
          <UFormGroup required label="nova cena radnog sata" name="cena">
            <UInput
              v-model="state.cena"
              type="number"
              placeholder="upiši vrednost radnog sata"
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
  cena: z.number().positive("Vrednost radnog sata mora biti veća od 0"),
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
const saveCene = async () => {
  if (form.value.errors.length) return;
  isLoading.value = true;
  try {
    // Fetch existing vrednost from Supabase
    const { data: existingData, error: fetchError } = await supabase
      .from("radnici")
      .select("vrednost")
      .eq("id", id)
      .single();
    if (fetchError) {
      throw fetchError;
    }
    // Update the existing vrednost array with the new value
    const updatedVrednost = existingData.vrednost
      ? [...existingData.vrednost, { ...state.value, timestamp: formattedDate }]
      : [{ ...state.value, timestamp: formattedDate }];

    // Update the record in Supabase with the updated vrednost array
    const { error: updateError } = await supabase
      .from("radnici")
      .update({ vrednost: updatedVrednost })
      .eq("id", id);

    if (!updateError) {
      toast.add({
        title: "Nova cena radnog sata je dodata",
        icon: "i-heroicons-check-circle",
      });
      isOpenCene.value = false;
      emit("saved");
    }
  } catch (error) {
    toast.add({
      title: "Neuspešno izmena cene radnog sata",
      description: error.message,
      icon: "i-heroicons-exclamation-circle",
    });
  } finally {
    isLoading.value = false;
  }
};

const isOpenCene = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) resetForm();
    emit("update:modelValue", value);
  },
});
</script>
