<template>
  <table
    class="min-w-full bg-white border border-gray-300 align-center text-center"
  >
    <thead>
      <tr>
        <th class="py-2 px-4 border-b">ID</th>
        <th class="py-2 px-4 border-b">Ime</th>
        <th class="py-2 px-4 border-b">Prezime</th>
        <th class="py-2 px-4 border-b">Aktivan</th>
        <th class="py-2 px-4 border-b">Kategorija</th>
        <th class="py-2 px-4 border-b">Vrednost radnog sata</th>
        <th class="py-2 px-4 border-b">...</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="radnik in radnici" :key="radnik.id">
        <Radnik :radnik="radnik" />
      </tr>
      <!-- <Radnik :radnik="radnik" /> -->

      <!-- Add more rows as needed -->
    </tbody>
  </table>
</template>
<script setup>
const supabase = useSupabaseClient();
const radnici = ref([]);

const { data, pending } = await useAsyncData("radnici", async () => {
  const { data, error } = await supabase.from("radnici").select();
  if (error) return [];
  return data;
});
radnici.value = data.value;

console.log(radnici.value);
</script>
