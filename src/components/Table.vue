<template>
    <div class="card">
        <div v-if="!items || items.length === 0" class="flex justify-center items-center min-h-[550px]">
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" animationDuration=".7s" />
        </div>
        <div v-else>
            <DataTable :value="items" tableStyle="min-width: 50rem" showGridlines>
                <Column header="S.N">
                    <template #body="slotProps">
                        {{ slotProps.index + 1 }}
                    </template>
                </Column>

                <Column v-for="col in columns?.filter(c => c.field !== 'status' && c.field !== 'action')"
                    :key="col.field" :field="col.field" :header="col.header" class="text-black">
                </Column>

                <!-- Status Column -->
                <Column v-if="columns?.some(col => col.field === 'status')" header="Status" body-class="text-center">
                    <template #body="slotProps">
                        <ToggleSwitch :model-value="!!slotProps.data.status"
                            @change="emitStatusChange(slotProps.data)" />
                    </template>
                </Column>

                <!-- Action Column -->
                <Column v-if="columns?.some(col => col.field === 'action')" header="Action" body-class="text-center">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" class="p-button-text " @click="emitEdit(slotProps.data)"
                            label="Edit" />
                    </template>
                </Column>
            </DataTable>
        </div>
        <!-- Modal Slot -->
        <slot name="modal"></slot>
    </div>
</template>

<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ToggleSwitch from 'primevue/toggleswitch';
import ProgressSpinner from 'primevue/progressspinner'

defineProps({
    items: {
        type: Array,
        required: true,
    },
    columns: {
        type: Array,
        required: true,
    },
});
const emit = defineEmits(['update-status', 'edit-operator', 'edit-details']);

const emitStatusChange = (status) => {
    emit('update-status', status);
};

const emitEdit = (edit) => {
    emit('edit-operator', edit);
};

</script>
<style >

.p-datatable-header-cell{
  background-color: #f3f4f6 !important;
  color: #3f3f46;
}

tbody tr:hover {
  background-color: #f9fafb !important; 
}

</style>