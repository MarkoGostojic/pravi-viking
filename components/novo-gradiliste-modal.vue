<template>
  <UModal v-model="isOpen">
    <UForm :state="state" :schema="schema" ref="form" @submit="save">
      <UCard>
        <template #header>Dodaj gradiliste</template>
        <UFormGroup label="Naziv gradilista" required name="ime" class="mb-4">
          <UInput
            type="text"
            placeholder="upišite ime gradilista"
            v-model="state.ime"
          />
        </UFormGroup>

        <UFormGroup
          label="Datum kreiranja gradilista"
          required
          name="created_at"
          class="mb-4"
        >
          <UInput
            type="date"
            icon="i-heroicons-calendar-days-20-solid"
            v-model="state.created_at"
          />
        </UFormGroup>

        <UButton
          type="submit"
          color="green"
          varian="solid"
          label="sačuvati"
          :loading="isLoading"
        />
      </UCard>
    </UForm>
  </UModal>
</template>
<script setup>
const supabase = useSupabaseClient();
const toast = useToast();
import { z } from "zod";
const isLoading = ref(false);
const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(["update:modelValue", "saved"]);
const schema = z.object({
  ime: z.string(),
  created_at: z.string(),
});
const initialState = {
  ime: undefined,
  created_at: undefined,
};
const state = ref({
  ...initialState,
});
const resetForm = () => {
  Object.assign(state.value, initialState);
  form.value.clear();
};
const form = ref();
const save = async () => {
  if (form.value.errors.length) return;
  // STORE INTO the SUPABASE
  isLoading.value = true;
  try {
    const { error } = await supabase
      .from("gradilista")
      .upsert({ ...state.value });

    if (!error) {
      toast.add({
        title: "Novo gradiliste je dodato",
        icon: "i-heroicons-check-circle",
      });
      isOpen.value = false;
      emit("saved");
    }
  } catch (error) {
    toast.add({
      title: "Neuspešno dodavanje gradilista",
      description: error.message,
      icon: "i-heroicons-exclamation-circle",
    });
  } finally {
    isLoading.value = false;
  }
};
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) resetForm();
    emit("update:modelValue", value);
  },
});
</script>
