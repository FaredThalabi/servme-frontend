<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Orders</h1>
        <p class="mt-1 text-sm text-gray-500">Manage your restaurant orders</p>
      </div>
      <div class="flex space-x-3">
        <BaseButton variant="outline" @click="refresh">
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
          Refresh
        </BaseButton>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg
                class="h-6 w-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                ></path>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total Orders
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.total || 0 }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg
                class="h-6 w-6 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Pending
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.pending || 0 }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg
                class="h-6 w-6 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Preparing
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.preparing || 0 }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg
                class="h-6 w-6 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Completed
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.completed || 0 }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow-sm border">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-64">
          <label
            for="search"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Search</label
          >
          <VInput
            v-model="filters.search"
            placeholder="Search by order number, customer..."
            @input="debouncedSearch"
          />
        </div>
        <div class="min-w-40">
          <label
            for="status"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Status</label
          >
          <VSelect
            id="status"
            v-model="filters.status"
            :options="[
              { value: 'pending', label: 'Pending' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'preparing', label: 'Preparing' },
              { value: 'ready', label: 'Ready' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
            ]"
            @change="loadOrders"
          >
          </VSelect>
        </div>
        <div class="min-w-40">
          <label
            for="date_range"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Date Range</label
          >
          <VSelect
            id="date_range"
            v-model="filters.date_range"
            :options="[
              { value: '', label: 'All Time' },
              { value: 'today', label: 'Today' },
              { value: 'yesterday', label: 'Yesterday' },
              { value: 'this_week', label: 'This Week' },
              { value: 'this_month', label: 'This Month' },
            ]"
            @change="loadOrders"
          >
          </VSelect>
        </div>
      </div>
    </div>

    <!-- Orders List -->
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <div v-if="loading" class="px-4 py-12 text-center">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
        ></div>
        <p class="mt-2 text-sm text-gray-500">Loading orders...</p>
      </div>

      <div v-else-if="orders.length === 0" class="px-4 py-12 text-center">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
        <p class="mt-1 text-sm text-gray-500">
          Orders will appear here when customers place them.
        </p>
      </div>

      <ul v-else class="divide-y divide-gray-200">
        <li v-for="order in orders" :key="order.id" class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2">
                  <p class="text-sm font-medium text-gray-900">
                    #{{ order.order_number }}
                  </p>
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStatusColor(order.status),
                    ]"
                  >
                    {{ formatStatus(order.status) }}
                  </span>
                  <span
                    :class="[
                      'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border',
                      order.payment_status === 'paid'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-yellow-50 text-yellow-700 border-yellow-200',
                    ]"
                  >
                    {{ order.payment_status === "paid" ? "Paid" : "Unpaid" }}
                  </span>
                </div>

                <div
                  class="mt-1 flex items-center space-x-4 text-sm text-gray-500"
                >
                  <span>{{ order.customer_name || "Guest" }}</span>
                  <span>•</span>
                  <span
                    >{{ order.items_count }}
                    {{ order.items_count === 1 ? "item" : "items" }}</span
                  >
                  <span>•</span>
                  <span>{{ formatCurrency(order.total_amount) }}</span>
                  <span>•</span>
                  <span>{{ formatDateTime(order.created_at) }}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <BaseButton
                v-if="order.status === 'pending'"
                variant="success"
                size="sm"
                @click="updateOrderStatus(order, 'confirmed')"
                :loading="order.updating"
              >
                Confirm
              </BaseButton>

              <BaseButton
                v-if="order.status === 'confirmed'"
                variant="primary"
                size="sm"
                @click="updateOrderStatus(order, 'preparing')"
                :loading="order.updating"
              >
                Start Preparing
              </BaseButton>

              <BaseButton
                v-if="order.status === 'preparing'"
                variant="success"
                size="sm"
                @click="updateOrderStatus(order, 'ready')"
                :loading="order.updating"
              >
                Mark Ready
              </BaseButton>

              <BaseButton
                v-if="order.status === 'ready'"
                variant="success"
                size="sm"
                @click="updateOrderStatus(order, 'completed')"
                :loading="order.updating"
              >
                Complete
              </BaseButton>

              <BaseButton
                variant="outline"
                size="sm"
                @click="viewOrderDetails(order)"
              >
                View Details
              </BaseButton>

              <BaseButton
                v-if="['pending', 'confirmed'].includes(order.status)"
                variant="danger"
                size="sm"
                @click="confirmCancel(order)"
              >
                Cancel
              </BaseButton>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Order Details Modal -->
    <BaseModal
      :show="showDetailsModal"
      title="Order Details"
      size="xl"
      @close="showDetailsModal = false"
    >
      <div v-if="selectedOrder" class="space-y-6 text-sm">
        <!-- Order Header -->
        <div
          class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100"
        >
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-xl font-bold text-gray-900">
                Order #{{ selectedOrder.order_number }}
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                {{ formatDateTime(selectedOrder.created_at) }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <span
                :class="[
                  'inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold',
                  getStatusColor(selectedOrder.status),
                ]"
              >
                <span
                  class="w-2 h-2 rounded-full mr-2"
                  :class="getStatusDot(selectedOrder.status)"
                ></span>
                {{ formatStatus(selectedOrder.status) }}
              </span>
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                  selectedOrder.payment_status === 'paid'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-yellow-50 text-yellow-700 border-yellow-200',
                ]"
              >
                {{
                  selectedOrder.payment_status === "paid" ? "Paid" : "Unpaid"
                }}
              </span>
            </div>
          </div>

          <!-- Payment Info -->
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span class="text-gray-600">Payment Method:</span>
              <span class="ml-2 font-medium capitalize">{{
                selectedOrder.payment_method || "N/A"
              }}</span>
            </div>
            <div>
              <span class="text-gray-600">Total Amount:</span>
              <span class="ml-2 font-bold text-base">{{
                formatCurrency(selectedOrder.total_amount)
              }}</span>
            </div>
          </div>

          <div class="mt-3 flex items-start text-sm">
            <svg
              class="w-4 h-4 text-gray-400 mr-2 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 8h10M7 12h6m1 8l-4-4H7a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-1l-4 4z"
              />
            </svg>
            <div class="text-gray-700 whitespace-pre-line">{{ selectedOrder.notes || "No notes" }}</div>
          </div>
        </div>

        <!-- Customer & Order Info -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Customer Information -->
          <div class="bg-white rounded-xl p-6 border border-gray-200">
            <h4
              class="text-base font-semibold text-gray-900 mb-3 flex items-center"
            >
              <svg
                class="w-5 h-5 mr-2 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Customer Information
            </h4>
            <div class="space-y-2.5">
              <!-- Name -->
              <div class="flex items-center">
                <svg
                  class="w-5 h-5 text-gray-400 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <div>
                  <div class="text-sm text-gray-600">Name</div>
                  <div class="font-medium text-gray-900">
                    {{ selectedOrder.customer_name || "Guest" }}
                  </div>
                </div>
              </div>
              <!-- Phone -->
              <div
                v-if="selectedOrder.customer_phone"
                class="flex items-center"
              >
                <svg
                  class="w-3 h-3 text-gray-400 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <div>
                  <div class="text-sm text-gray-600">Phone</div>
                  <div class="font-medium text-gray-900">
                    {{ selectedOrder.customer_phone }}
                  </div>
                </div>
              </div>
              <!-- Email -->
              <div class="flex items-center">
                <svg
                  class="w-6 h-6 text-gray-400 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 12l-4-4-4 4m8 0l-4 4-4-4m0-4h8m2 0a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V10a2 2 0 012-2h12z"
                  />
                </svg>

                <div
                  class="font-medium text-gray-900 max-w-[180px] truncate"
                  title="{{ selectedOrder.customer_email }}"
                >
                  {{ selectedOrder.customer_email }}
                </div>
              </div>
            </div>
          </div>

          <!-- Order Information -->
          <div class="bg-white rounded-xl p-5 border border-gray-200">
            <h4
              class="text-base font-semibold text-gray-900 mb-3 flex items-center"
            >
              <svg
                class="w-5 h-5 mr-2 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Order Information
            </h4>
            <div class="space-y-2.5">
              <div class="flex items-center">
                <svg
                  class="w-5 h-5 text-gray-400 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <div>
                  <div class="text-sm text-gray-600">Order ID</div>
                  <div class="font-mono text-sm text-gray-900">
                    {{ selectedOrder.id }}
                  </div>
                </div>
              </div>
              <div class="flex items-center">
                <svg
                  class="w-3 h-3 text-gray-400 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <div class="text-sm text-gray-600">Created</div>
                  <div class="font-medium text-gray-900">
                    {{ formatDateTime(selectedOrder.created_at) }}
                  </div>
                </div>
              </div>
              <div class="flex items-center">
                <svg
                  class="w-3 h-3 text-gray-400 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <div>
                  <div class="text-sm text-gray-600">Last Updated</div>
                  <div class="font-medium text-gray-900">
                    {{ formatDateTime(selectedOrder.updated_at) }}
                  </div>
                </div>
              </div>
              <div class="flex items-start">
                <svg
                  class="w-3 h-3 text-gray-400 mr-3 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                <div>
                  <div class="text-sm text-gray-600">Notes</div>
                  <div class="font-medium text-gray-900">
                    {{ selectedOrder.notes || "No notes" }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="bg-gray-50 rounded-xl p-5">
          <h4
            class="text-base font-semibold text-gray-900 mb-3 flex items-center"
          >
            <svg
              class="w-5 h-5 mr-2 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Order Items
          </h4>
          <div
            v-if="
              !selectedOrder.order_items ||
              selectedOrder.order_items.length === 0
            "
            class="text-center py-8 text-gray-500"
          >
            <svg
              class="w-12 h-12 mx-auto mb-3 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            No items found
          </div>
          <div v-else class="space-y-2.5">
            <div
              v-for="item in selectedOrder.order_items"
              :key="item.id"
              class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
            >
              <div class="flex-1">
                <p class="font-medium text-gray-900">{{ item.product_name }}</p>
                <p class="text-sm text-gray-500">
                  Quantity: {{ item.quantity }}
                </p>
                <p v-if="item.notes" class="text-xs text-gray-500 mt-1 italic">
                  {{ item.notes }}
                </p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-900">
                  {{ formatCurrency(item.total_price) }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ formatCurrency(item.product_price) }} each
                </p>
              </div>
            </div>
          </div>

          <!-- Order Total -->
          <div
            class="mt-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100"
          >
            <div class="flex justify-between items-center">
              <div>
                <p class="text-lg font-semibold text-gray-900">Total Amount</p>
                <p class="text-sm text-gray-600">
                  {{ selectedOrder.order_items?.length || 0 }} items
                </p>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-blue-600">
                  {{ formatCurrency(selectedOrder.total_amount) }}
                </p>
                <p class="text-sm text-gray-600">Including tax</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="w-full flex items-center justify-end">
          <div>
            <BaseButton
              v-if="
                selectedOrder &&
                selectedOrder.payment_method === 'counter' &&
                selectedOrder.payment_status !== 'paid' &&
                selectedOrder.status === 'completed'
              "
              variant="success"
              @click="markOrderPaid(selectedOrder)"
              :loading="selectedOrder.paying"
            >
              Mark as Paid
            </BaseButton>
            <BaseButton
              variant="outline"
              class="ml-2"
              @click="showDetailsModal = false"
              >Close</BaseButton
            >
          </div>
        </div>
      </template>
    </BaseModal>

    <!-- Cancel Order Modal -->
    <BaseModal
      :show="showCancelModal"
      title="Cancel Order"
      @close="showCancelModal = false"
    >
      <div class="space-y-4">
        <p class="text-sm text-gray-500">
          Are you sure you want to cancel order
          <strong>#{{ orderToCancel?.order_number }}</strong
          >?
        </p>

        <div>
          <label
            for="cancel_reason"
            class="block text-sm font-medium text-gray-700"
            >Reason (optional)</label
          >
          <BaseTextArea
            id="cancel_reason"
            v-model="cancelReason"
            :rows="3"
            class="mt-1"
            placeholder="Enter cancellation reason..."
          />
        </div>
      </div>

      <template #footer>
        <BaseButton
          variant="outline"
          @click="showCancelModal = false"
          class="mr-3"
        >
          Keep Order
        </BaseButton>
        <BaseButton variant="danger" @click="cancelOrder" :loading="cancelling">
          Cancel Order
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
 import { ref, onMounted, onUnmounted, reactive } from "vue";
import { ordersService } from "@/services/ordersService.js";
import BaseModal from "@/components/shared/BaseModal.vue";
import BaseButton from "@/components/shared/BaseButton.vue";
import BaseTextArea from "@/components/shared/BaseTextArea.vue";
import VInput from "../../components/input/VInput.vue";
import VSelect from "../../components/input/VSelect.vue";
import { useNotificationsStore } from '@/stores/notifications.js'

// Reactive data
const orders = ref([]);
const stats = ref({});
const loading = ref(true);
const cancelling = ref(false);
const notifications = useNotificationsStore()

// Modal states
const showDetailsModal = ref(false);
const showCancelModal = ref(false);

// Selected data
const selectedOrder = ref(null);
const orderToCancel = ref(null);
const cancelReason = ref("");

// Filters
const filters = reactive({
  search: "",
  status: "",
  date_range: "",
});

// Debounced search
let searchTimeout = null;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    refresh();
  }, 300);
};

async function refresh() {
  await loadOrders();
  await loadStats();
}

// Auto-refresh every 15 seconds
let autoRefreshTimer = null;

// Methods
async function loadOrders() {
  try {
    loading.value = true;
    const params = {};

    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.date_range) params.date_range = filters.date_range;

    const response = await ordersService.getAll(params);
    orders.value = response.data || response;
  } catch (error) {
    console.error("Error loading orders:", error);
  } finally {
    loading.value = false;
  }
}

async function loadStats() {
  try {
    const response = await ordersService.getStats();
    stats.value = response.data || response;
  } catch (error) {
    console.error("Error loading stats:", error);
  }
}

async function updateOrderStatus(order, newStatus) {
  try {
    order.updating = true;
    await ordersService.updateStatus(order.id, newStatus);
    await Promise.all([loadOrders(), loadStats()]);
  } catch (error) {
    console.error("Error updating order status:", error);
  } finally {
    order.updating = false;
  }
}

async function markOrderPaid(order) {
  try {
    order.paying = true;
    await ordersService.markPaid(order.id);
    
    // Update the selectedOrder object immediately
    selectedOrder.value.payment_status = 'paid';
    
    notifications.push({ title: "Order Marked as Paid", message: `Order #${order.order_number} has been marked as paid.`, type: "success" });
    await Promise.all([loadOrders(), loadStats()]);
  } catch (error) {
    console.error("Error marking order as paid:", error);
  } finally {
    order.paying = false;
  }
}

async function viewOrderDetails(order) {
  try {
    const response = await ordersService.getById(order.id);
    selectedOrder.value = response.data || response;
    showDetailsModal.value = true;
  } catch (error) {
    console.error("Error loading order details:", error);
  }
}

function confirmCancel(order) {
  orderToCancel.value = order;
  cancelReason.value = "";
  showCancelModal.value = true;
}

async function cancelOrder() {
  try {
    cancelling.value = true;
    await ordersService.cancel(orderToCancel.value.id, cancelReason.value);
    showCancelModal.value = false;
    orderToCancel.value = null;
    cancelReason.value = "";
    await Promise.all([loadOrders(), loadStats()]);
  } catch (error) {
    console.error("Error cancelling order:", error);
  } finally {
    cancelling.value = false;
  }
}

// Helper functions
function getStatusColor(status) {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    preparing: "bg-purple-100 text-purple-800",
    ready: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

function getStatusDot(status) {
  const dots = {
    pending: "bg-yellow-500",
    confirmed: "bg-blue-500",
    preparing: "bg-purple-500",
    ready: "bg-green-500",
    completed: "bg-gray-500",
    cancelled: "bg-red-500",
  };
  return dots[status] || "bg-gray-500";
}

function formatStatus(status) {
  const statuses = {
    pending: "Pending",
    confirmed: "Confirmed",
    preparing: "Preparing",
    ready: "Ready",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return statuses[status] || status;
}

function formatDateTime(dateTime) {
  if (!dateTime) return "";

  const date = new Date(dateTime);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    // Show time if it's today
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffInHours < 48) {
    // Show "Yesterday" if it was yesterday
    return (
      "Yesterday " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  } else {
    // Show full date for older orders
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

// Currency helper
function formatCurrency(value) {
  const num = Number(value || 0);
  try {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
      currencyDisplay: "narrowSymbol",
    }).format(num);
  } catch (e) {
    return `RM${num.toFixed(2)}`;
  }
}

// Load data on component mount
onMounted(async () => {
  await Promise.all([loadOrders(), loadStats()]);
  autoRefreshTimer = setInterval(() => {
    refresh();
  }, 15000);
});

onUnmounted(() => {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer);
    autoRefreshTimer = null;
  }
});
</script>
