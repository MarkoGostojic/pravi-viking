<template>
  <UModal v-model="isOpen">
    <UForm :state="state" :schema="schema" ref="form" @submit="save">
      <UCard>
        <template #header>Dodaj radnika</template>
        <UFormGroup label="Ime radnika" required name="ime" class="mb-4">
          <UInput
            type="text"
            placeholder="upišite ime radnika"
            v-model="state.ime"
          />
        </UFormGroup>
        <UFormGroup
          label="Prezime radnika"
          required
          name="prezime"
          class="mb-4"
        >
          <UInput
            type="text"
            placeholder="upišite prezime radnika"
            v-model="state.prezime"
          />
        </UFormGroup>
        <UFormGroup
          label="Kategorija radnika"
          required
          name="kategorija"
          class="mb-4"
        >
          <USelect
            placeholder="odredite kateogoriju radnika"
            :options="['vozač', 'rukovalac', 'poslovođa']"
            v-model="state.kategorija"
          />
        </UFormGroup>
        <UFormGroup
          label="Datum zasnivanja radnog odnosa"
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
  prezime: z.string(),
  kategorija: z.string(),
  created_at: z.string(),
  
});
const initialState = {
  ime: undefined,
  prezime: undefined,
  kategorija: undefined,
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
    const { error } = await supabase.from("radnici").upsert({ ...state.value });

    if (!error) {
      toast.add({
        title: "Novi radnik je dodat",
        icon: "i-heroicons-check-circle",
      });
      isOpen.value = false;
      emit("saved");
    }
  } catch (error) {
    toast.add({
      title: "Neuspešno dodavanje radnika",
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
