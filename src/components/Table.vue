<template>
    {{ console.log(items, "showNoData") }}
    <div class="card">
        <!-- Loader -->
        <!-- Loader -->
        <div v-if="(!items || items.length === 0) && !showNoData"
            class="flex justify-center items-center min-h-[550px]">
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" animationDuration=".7s" />
        </div>

        <!-- No items found -->
        <div v-else-if="showNoData" class="flex justify-center items-center min-h-[550px]">
            <p class="text-gray-500 text-lg">No items found</p>
        </div>

        <div v-else>
            <DataTable :value="items" :key="items.length" tableStyle="min-width: 50rem" showGridlines>
                <Column header="S.N">
                    <template #body="slotProps">
                        {{ slotProps.index + 1 }}
                    </template>
                </Column>

                <Column
                    v-for="col in (columns || []).filter(c => c.field && !['status', 'action', 'Status', 'Reward'].includes(c.field))"
                    :key="col.field" :field="col.field" :header="col.header" class="text-black">
                </Column>



                <Column v-if="columns?.some(col => col.field === 'Reward')" header="Reward"
                    body-class="text-center text-black">
                    <template #body="slotProps">
                        {{ getRewardTypeText(slotProps?.data) }}

                    </template>
                </Column>

                <!-- Ticket Status Column -->
                <Column v-if="columns?.some(col => col.field === 'Status')" header="Status" body-class="text-center">
                    <template #body="slotProps">
                        <button :class="getStatus(slotProps?.data?.Status)" class="px-4 py-2 rounded text-white">
                            {{ getStatusText(slotProps?.data?.Status) }}
                        </button>
                    </template>
                </Column>


                <!-- Status Column -->
                <Column v-if="columns?.some(col => col.field === 'status')" header="Status" body-class="text-center">
                    <template #body="slotProps">
                        {{ console.log(slotProps, "slotProps?.data.status") }}
                        <ToggleSwitch :model-value="!!parseInt(slotProps?.data.status, 10)"
                            @change="emitStatusChange(slotProps?.data)" />
                    </template>
                </Column>

                <!-- Action Column -->
                <Column v-if="columns?.some(col => col.field === 'action')" :class="{ 'custom-width': showAssign }"  header="Action" body-class="text-center">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" class="p-button-text " @click="emitEdit(slotProps?.data)"
                            label="Edit" />
                        <Button v-if="showAssign" icon="pi pi-users" class="p-button-text"
                            @click="emitAssignUser(slotProps?.data)" label="Assign User" />
                        <Button v-if="showAssign" icon="pi pi-plus-circle" class="p-button-text"
                            @click="emitAssignRole(slotProps?.data)" label="Assign Role" />
                    </template>
                </Column>
            </DataTable>
        </div>
        <!-- Modal Slot -->
        <slot name="modal"></slot>
    </div>
</template>
<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ToggleSwitch from 'primevue/toggleswitch';
import ProgressSpinner from 'primevue/progressspinner';

export default {
    name: 'Table',
    components: {
        DataTable,
        Column,
        ToggleSwitch,
        ProgressSpinner,
    },
    props: {
        items: {
            type: Array,
            required: true,
        },
        columns: {
            type: Array,
            required: true,
        },
        getStatus: {
            type: Function,
            required: false,
        },
        getStatusText: {
            type: Function,
            required: false,
        },
        showAssign: {
            type: Boolean,
            default: false, // By default, the Assign User button is not shown
        },
    },
    emits: ['update-status', 'edit-operator', 'edit-details', 'get-rewardType', 'get-statusText', 'get-status', 'assign-user', 'assign-role'],
    data() {
        return {
            showNoData: false,
        };
    },
    methods: {
        emitStatusChange(status) {
            this.$emit('update-status', status);
        },
        emitEdit(row) {
            this.$emit('edit-operator', row);
        },
        emitAssignUser(row) {
            this.$emit('assign-user', row)
        },
        emitAssignRole(row) {
            this.$emit('assign-role', row)
        },
        getRewardTypeText(data) {
            const rewardTypeMap = {
                0: 'NO_WIN',
                1: 'POINT',
                2: 'CREDIT',
                3: 'PHYSICAL',
                4: 'SPIN_TICKET',
            };
            const rewardTypeText = rewardTypeMap[data.RewardType] || ' ';
            return data.RewardAmount ? `${data.RewardAmount} ${rewardTypeText}` : rewardTypeText;
        },
    },
    watch: {
        items: {
            immediate: true,
            handler(newItems) {
                console.log(newItems, !newItems || newItems.length === 0, "newItems")
                if (!newItems || newItems.length === 0) {
                    setTimeout(() => {
                        if (!this.items || this.items.length === 0) {
                            console.log("triggerred")
                            this.showNoData = true;
                        }
                    }, 1000);
                } else {
                    this.showNoData = false;
                }
            },
        },
    },
};
</script>

<style>
.p-datatable-header-cell {
    background-color: #f3f4f6 !important;
    color: #3f3f46;
}

tbody tr:hover {
    background-color: #f9fafb !important;
}

.custom-width {
  width: 40%;
}


input[type="search"]::-webkit-search-cancel-button {
    -webkit-appearance: none;
    height: 1.1rem;
    width: 1.1rem;
    border-radius: 50em;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23a1a1aa' stroke-linecap='round' stroke-width='2.3' d='M20 20L4 4m16 0L4 20'/%3E%3C/svg%3E") no-repeat 50% 50%;
    background-size: contain;
    opacity: 1;
    cursor: pointer;
}
</style>
