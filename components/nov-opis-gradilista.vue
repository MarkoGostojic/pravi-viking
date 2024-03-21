<template>
  <UModal v-model="isOpenOpis">
    <div class="p-4">
      <UForm @submit="saveOpis" :state="state" :schema="schema" ref="form">
        <UCard class="ml-20 mr-20">
          <template #header>Dodaj opis gradilišta</template>
          <UFormGroup
            required
            label="unesi podatke relevantne za gradilište"
            name="opis"
          >
            <UInput
              v-model="state.opis"
              type="text"
              placeholder="dodaj opis radnika"
            />
          </UFormGroup>
          <UButton
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
  opis: z.string(),
});
const initialState = {
  opis: undefined,
};
const state = ref({
  ...initialState,
});
const resetForm = () => {
  Object.assign(state.value, initialState);
  form.value.clear();
};
const form = ref();
const saveOpis = async () => {
  if (form.value.errors.length) return;
  // STORE INTO the SUPABASE
  isLoading.value = true;
  try {
    const { error } = await supabase
      .from("gradilista")
      .update({ ...state.value })
      .eq("id", id);

    if (!error) {
      toast.add({
        title: "Opis gradilišta je izmenjen",
        icon: "i-heroicons-check-circle",
      });
      isOpenOpis.value = false;
      emit("saved");
    }
  } catch (error) {
    toast.add({
      title: "Neuspešna izmena gradilišta",
      description: error.message,
      icon: "i-heroicons-exclamation-circle",
    });
  } finally {
    isLoading.value = false;
  }
};
const isOpenOpis = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) resetForm();
    emit("update:modelValue", value);
  },
});
</script>
