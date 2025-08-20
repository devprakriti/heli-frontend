<template>
  <div id="app" class="min-h-screen flex flex-col">
    <div class="flex flex-1 bg-gray-800">
      <!-- Sidebar -->
      <aside v-if="isAuthenticated && !loading"
        :class="`bg-primary-700 text-white pb-6 transition-all duration-300 ${isSidebarMinimized ? 'w-24' : 'w-64'}`"
        class="h-full">
        <div class="flex items-center space-x-5 py-6 border-b border-gray-600 px-6 ">
          <div class="text-white p-0 cursor-pointer" @click="toggleSidebar">
            <span v-if="isSidebarMinimized"><i class="pi pi-angle-right text-white text-base"></i></span>
            <span v-else><i class="pi pi-angle-left text-white text-base"></i></span>
          </div>
          <span v-if="!isSidebarMinimized" class="text-base font-semibold">Menu</span>
        </div>

        <!-- Sidebar Links -->
        <ul class="space-y-3 mt-4 px-6">

          <!-- Dashboard -->
          <li>
            <router-link to="/dashboard" class="flex items-center py-2.5 px-4 rounded transition-all" :class="{
              'bg-[#6b7280]': isActiveRoute('/dashboard'),
              'hover:bg-gray-700': !isActiveRoute('/dashboard'),
            }">
              <span><i class="pi pi-home"></i></span>
              <span v-if="!isSidebarMinimized" class="ml-3 text-base">Dashboard</span>
            </router-link>
          </li>
         

          <!-- User & Role Management -->
          <li>
            <div class="flex items-center py-2.5 px-4 rounded transition-all cursor-pointer" @click="toggleUserRoleManagement" :class="{
              'bg-[#6b7280]': isActiveRoute('/user-role-management'),
              'hover:bg-gray-700': !isActiveRoute('/user-role-management'),
            }">
              <span><i class="pi pi-users"></i></span>
              <span v-if="!isSidebarMinimized" class="ml-3">User & Role Management</span>
              <span v-if="!isSidebarMinimized" class="ml-auto">
                <i class="pi" :class="isUserRoleManagementOpen ? 'pi-chevron-down' : 'pi-chevron-right'"></i>
              </span>
            </div>
            <ul v-if="isUserRoleManagementOpen" class="ml-6 space-y-2 mt-4">
              <!-- Submenus for User & Role Management -->
              <!-- <li>
                <router-link to="/user-role-management/users" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-user"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Users</span>
                </router-link>
              </li> -->
              <li v-if="store?.hasRoutePermission('operators', 'get') || store?.hasRoutePermission('operators', 'view')">
                <router-link to="/operators" class="flex items-center py-2.5 px-4 rounded transition-all" :class="{
                  'bg-[#6b7280]': isActiveRoute('/operators'),
                  'hover:bg-gray-700': !isActiveRoute('/operators'),
                }">
                  <span><i class="pi pi-user"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Users</span>
                </router-link>
          </li> 

              <!-- <li>
                <router-link to="/user-role-management/roles" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-user-plus"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Roles</span>
                </router-link>
              </li> -->
              <li v-if="store?.hasRoutePermission('roles', 'get') || store?.hasRoutePermission('roles', 'view')">
                <router-link to="/roles" class="flex items-center py-2 px-4 rounded transition-all" :class="{
                  'bg-[#6b7280]': isActiveRoute('/roles'),
                  'hover:bg-gray-700': !isActiveRoute('/roles'),
                }">
                  <span><i class="pi pi-user-plus"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Role</span>
                </router-link>
              </li>         

              <li>
                <router-link to="/user-role-management/permissions" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-key"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Permissions</span>
                </router-link>
              </li>
            </ul>
          </li>
            <!-- Fleet Management -->
            <li>
            <div class="flex items-center py-2.5 px-4 rounded transition-all cursor-pointer" @click="toggleFleetManagement" :class="{
              'bg-[#6b7280]': isActiveRoute('/fleet-management'),
              'hover:bg-gray-700': !isActiveRoute('/fleet-management'),
            }">
              <span><i class="pi pi-arrows-alt"></i></span>
              <span v-if="!isSidebarMinimized" class="ml-3">Fleet Management</span>
              <span v-if="!isSidebarMinimized" class="ml-auto">
                <i class="pi" :class="isFleetManagementOpen ? 'pi-chevron-down' : 'pi-chevron-right'"></i>
              </span>
            </div>
            <ul v-if="isFleetManagementOpen" class="ml-6 space-y-2 mt-4">
              <!-- Submenus for Fleet Management -->
              <li>
                <router-link to="/fleet-management/overview" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-send"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Helicopter Overview</span>
                </router-link>
              </li>
              <li>
                <router-link to="/fleet-management/flight-hours-tracker" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-clock"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Flight Hours Tracker</span>
                </router-link>
              </li>
            </ul>
          </li>
          <!-- Maintenance Planning -->
          <li>
            <div class="flex items-center py-2.5 px-4 rounded transition-all cursor-pointer" @click="toggleMaintenancePlanning" :class="{
              'bg-[#6b7280]': isActiveRoute('/maintenance-planning'),
              'hover:bg-gray-700': !isActiveRoute('/maintenance-planning'),
            }">
              <span><i class="pi pi-calendar"></i></span>
              <span v-if="!isSidebarMinimized" class="ml-3">Maintenance Planning</span>
              <span v-if="!isSidebarMinimized" class="ml-auto cursor-pointer">
                <i class="pi" :class="isMaintenancePlanningOpen ? 'pi-chevron-down' : 'pi-chevron-right'"></i>
              </span>
            </div>
            <ul v-if="isMaintenancePlanningOpen" class="ml-6 space-y-2 mt-4">
              <li>
                <router-link to="/maintenance-planning/tlp-scan" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-search"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">TLP Scan</span>
                </router-link>
              </li>
              <li>
                <router-link to="/maintenance-planning/daily-log" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-calendar-plus"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Daily Log</span>
                </router-link>
              </li>
              <li>
                <router-link to="/maintenance-planning/monitoring-chart" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-chart-line"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Monitoring Chart</span>
                </router-link>
              </li>
              <li>
                <router-link to="/maintenance-planning/component-status" class="flex items-center py-2 px-4 rounded transition-all">
    <span><i class="pi pi-cog"></i></span> <!-- Replaced pi icon with Font Awesome -->
    <span v-if="!isSidebarMinimized" class="ml-3">Component Status</span>
  </router-link>
              </li>
              <li>
                <router-link to="/maintenance-planning/out-of-phase-inspection" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-exclamation-triangle"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Out of Phase Inspection</span>
                </router-link>
              </li>
              <li>
                <router-link to="/maintenance-planning/nrc" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-refresh"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">NRC</span>
                </router-link>
              </li>
              <li>
                <router-link to="/maintenance-planning/awc" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-shield"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">AWC</span>
                </router-link>
              </li>
              <li>
                <router-link to="/maintenance-planning/component-changes" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-refresh"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Component Changes</span>
                </router-link>
              </li>
              <li>
                <router-link to="/maintenance-planning/maintenance-works-order-tracking" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-truck"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Maintenance Works Order Tracking</span>
                </router-link>
              </li>
              <li>
                <router-link to="/maintenance-planning/engine-health-check" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-heart"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Engine Health Check</span>
                </router-link>
              </li>
              <li>
                <router-link to="/maintenance-planning/ado-tracking" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-list"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">ADO Tracking</span>
                </router-link>
              </li>
              <li>
                <router-link to="/maintenance-planning/airframe-logbook" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-book"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Airframe Logbook</span>
                </router-link>
              </li>
              <li>
                <router-link to="/maintenance-planning/engine-logbook" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-bookmark"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Engine Logbook</span>
                </router-link>
              </li>
              <li>
                <router-link to="/maintenance-planning/maintenance-occurrence-report" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-file"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Maintenance Occurrence Report</span>
                </router-link>
              </li>
              <li>
                <router-link to="/maintenance-planning/work-pack-scan" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-qrcode"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Work Pack Scan</span>
                </router-link>
              </li>
            </ul>
          </li>
           <!-- Technical Services -->
           <li>
            <div class="flex items-center py-2.5 px-4 rounded transition-all cursor-pointer" @click="toggleTechnicalServices" :class="{
              'bg-[#6b7280]': isActiveRoute('/technical-services'),
              'hover:bg-gray-700': !isActiveRoute('/technical-services'),
            }">
              <span><i class="pi pi-wrench"></i></span>
              <span v-if="!isSidebarMinimized" class="ml-3">Technical Services</span>
              <span v-if="!isSidebarMinimized" class="ml-auto">
                <i class="pi" :class="isTechnicalServicesOpen ? 'pi-chevron-down' : 'pi-chevron-right'"></i>
              </span>
            </div>
            <ul v-if="isTechnicalServicesOpen" class="ml-6 space-y-2 mt-4">
              <!-- Submenus for Technical Services -->
              <li>
                <router-link to="/technical-services/website-visit-log" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-globe"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Website Visit Log</span>
                </router-link>
              </li>
              <li>
                <router-link to="/technical-services/ad-sb-compliance-summary" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-file"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">AD/SB Compliance Summary</span>
                </router-link>
              </li>
              <li>
                <router-link to="/technical-services/individual-troubleshoot-logbook" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-book"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Individual Troubleshoot Logbook</span>
                </router-link>
              </li>
              <li>
                <router-link to="/technical-services/ai-si-tracking-system" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-cog"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">AD/SB Tracking System</span>
                </router-link>
              </li>
              <li>
                <router-link to="/technical-services/e10" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-cloud"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">E10</span>
                </router-link>
              </li>
              <li>
                <router-link to="/technical-services/tdr" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-caret-down"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">TDR</span>
                </router-link>
              </li>
            </ul>
          </li>

             <!-- Technical Library -->
             <li>
            <div class="flex items-center py-2.5 px-4 rounded transition-all cursor-pointer" @click="toggleTechnicalLibrary" :class="{
              'bg-[#6b7280]': isActiveRoute('/technical-library'),
              'hover:bg-gray-700': !isActiveRoute('/technical-library'),
            }">
              <span><i class="pi pi-book"></i></span>
              <span v-if="!isSidebarMinimized" class="ml-3">Technical Library</span>
              <span v-if="!isSidebarMinimized" class="ml-auto">
                <i class="pi" :class="isTechnicalLibraryOpen ? 'pi-chevron-down' : 'pi-chevron-right'"></i>
              </span>
            </div>
            <ul v-if="isTechnicalLibraryOpen" class="ml-6 space-y-2 mt-4">
              <!-- Submenus for Technical Library -->
              <li>
                <router-link to="/technical-library/company-document" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-file"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Company Document</span>
                </router-link>
              </li>
              <li>
                <router-link to="/technical-library/camo-document" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-file"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">CAMO Document</span>
                </router-link>
              </li>
              <li>
                <router-link to="/technical-library/manufacturers-document" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-briefcase"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Manufacturers Document</span>
                </router-link>
              </li>
              <li>
                <router-link to="/technical-library/distribution-operational-manual" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-book"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Distribution and Operational Manual</span>
                </router-link>
              </li>
              <li>
                <router-link to="/technical-library/maintenance-data-record" class="flex items-center py-2 px-4 rounded transition-all">
                  <span><i class="pi pi-file"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Maintenance Data Record</span>
                </router-link>
              </li>
              <!-- Technical Training Record submenu -->
              <li>
                <div class="flex items-center py-2.5 px-4 rounded transition-all cursor-pointer" @click="toggleTrainingRecord" :class="{
                  'bg-[#6b7280]': isActiveRoute('/technical-library/technical-training-record'),
                  'hover:bg-gray-700': !isActiveRoute('/technical-library/technical-training-record'),
                }">
                  <span><i class="pi pi-user"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Technical Training Record</span>
                  <span v-if="!isSidebarMinimized" class="ml-auto">
                    <i class="pi" :class="isTrainingRecordOpen ? 'pi-chevron-down' : 'pi-chevron-right'"></i>
                  </span>
                </div>
                <ul v-if="isTrainingRecordOpen" class="ml-6 space-y-2 mt-4">
                  <li>
                    <router-link to="/technical-library/technical-training-record/overview" class="flex items-center py-2 px-4 rounded transition-all">
                      <span><i class="pi pi-eye"></i></span>
                      <span v-if="!isSidebarMinimized" class="ml-3">Overview</span>
                    </router-link>
                  </li>
                  <li>
                    <router-link to="/technical-library/technical-training-record/details" class="flex items-center py-2 px-4 rounded transition-all">
                      <span><i class="pi pi-info-circle"></i></span>
                      <span v-if="!isSidebarMinimized" class="ml-3">Details</span>
                    </router-link>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          
          <!-- Settings -->

            <!-- Settings -->
          <li>
            <div class="flex items-center py-2.5 px-4 rounded transition-all cursor-pointer" @click="toggleSettings" :class="{
              'bg-[#6b7280]': isActiveRoute('/settings/system-config') || isActiveRoute('/settings/fleet-config') || isActiveRoute('/settings/compliance-settings') || isActiveRoute('/settings/user-manual') || isActiveRoute('/settings/knowledge-base'),
              'hover:bg-gray-700': !isActiveRoute('/settings/system-config') && !isActiveRoute('/settings/fleet-config') && !isActiveRoute('/settings/compliance-settings') && !isActiveRoute('/settings/user-manual') && !isActiveRoute('/settings/knowledge-base'),
            }">
              <span><i class="pi pi-cog"></i></span>
              <span v-if="!isSidebarMinimized" class="ml-3">Settings</span>
              <span v-if="!isSidebarMinimized" class="ml-auto">
                <i class="pi" :class="isSettingOpen ? 'pi-chevron-down' : 'pi-chevron-right'"></i>
              </span>
            </div>
            <ul v-if="isSettingOpen" class="ml-6 space-y-2 mt-4">
              <!-- Submenus for Settings -->
              <li>
                <router-link to="/settings/system-config" class="flex items-center py-2 px-4 rounded transition-all" :class="{
                  'bg-[#6b7280]': isActiveRoute('/settings/system-config'),
                  'hover:bg-gray-700': !isActiveRoute('/settings/system-config'),
                }">
                  <span><i class="pi pi-asterisk"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">System Configuration</span>
                </router-link>
              </li>
              <li>
                <router-link to="/settings/fleet-config" class="flex items-center py-2 px-4 rounded transition-all" :class="{
                  'bg-[#6b7280]': isActiveRoute('/settings/fleet-config'),
                  'hover:bg-gray-700': !isActiveRoute('/settings/fleet-config'),
                }">
                  <span><i class="pi pi-arrows-alt"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Fleet Configurations</span>
                </router-link>
              </li>
              <li>
                <router-link to="/settings/compliance-settings" class="flex items-center py-2 px-4 rounded transition-all" :class="{
                  'bg-[#6b7280]': isActiveRoute('/settings/compliance-settings'),
                  'hover:bg-gray-700': !isActiveRoute('/settings/compliance-settings'),
                }">
                  <span><i class="pi pi-check-circle"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Compliance Settings</span>
                </router-link>
              </li>
              <li>
                <router-link to="/settings/user-manual" class="flex items-center py-2 px-4 rounded transition-all" :class="{
                  'bg-[#6b7280]': isActiveRoute('/settings/user-manual'),
                  'hover:bg-gray-700': !isActiveRoute('/settings/user-manual'),
                }">
                  <span><i class="pi pi-book"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">User Manual</span>
                </router-link>
              </li>
              <li>
                <router-link to="/settings/knowledge-base" class="flex items-center py-2 px-4 rounded transition-all" :class="{
                  'bg-[#6b7280]': isActiveRoute('/settings/knowledge-base'),
                  'hover:bg-gray-700': !isActiveRoute('/settings/knowledge-base'),
                }">
                  <span><i class="pi pi-info-circle"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Knowledge Base</span>
                </router-link>
              </li>
            </ul>
          </li>
          <!-- <li>
            <div class="flex items-center py-2.5 px-4 rounded transition-all cursor-pointer" @click="toggleSettings" :class="{
              'bg-[#6b7280]':isActiveRoute('/profilesettings') || isActiveRoute('/groups') || isActiveRoute('/roles'),
              'hover:bg-gray-700': !isActiveRoute('/profilesettings') && !isActiveRoute('/groups') && !isActiveRoute('/roles'),
            }">
               <span><i class="pi pi-cog"></i></span>
              <span v-if="!isSidebarMinimized" class="ml-3">Settings</span>
              <span v-if="!isSidebarMinimized" class="ml-auto">
                <i class="pi" :class="isSettingOpen ? 'pi-chevron-down' : 'pi-chevron-right'"></i>
              </span>
            </div>
            <ul v-if="isSettingOpen" class="ml-6 space-y-2 mt-4">
              <li>
                <router-link to="/profilesettings" class="flex items-center py-2 px-4 rounded transition-all" :class="{
                  'bg-[#6b7280]': isActiveRoute('/profilesettings'),
                  'hover:bg-gray-700': !isActiveRoute('/profilesettings'),
                }">
                  <span><i class="pi pi-user-edit"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Profile</span>
                </router-link>
              </li>   
              <li v-if="store?.hasRoutePermission('groups', 'get') || store?.hasRoutePermission('groups', 'view')">
                <router-link to="/groups" class="flex items-center py-2 px-4 rounded transition-all" :class="{
                  'bg-[#6b7280]': isActiveRoute('/groups'),
                  'hover:bg-gray-700': !isActiveRoute('/groups'),
                }">
                  <span><i class="pi pi-users"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Group</span>
                </router-link>
              </li>  
              <li v-if="store?.hasRoutePermission('roles', 'get') || store?.hasRoutePermission('roles', 'view')">
                <router-link to="/roles" class="flex items-center py-2 px-4 rounded transition-all" :class="{
                  'bg-[#6b7280]': isActiveRoute('/roles'),
                  'hover:bg-gray-700': !isActiveRoute('/roles'),
                }">
                  <span><i class="pi pi-user-minus"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Role</span>
                </router-link>
              </li>         
            </ul>
          </li> -->

          <!-- <li v-if="store?.hasRoutePermission('operators', 'get') || store?.hasRoutePermission('operators', 'view')">
                <router-link to="/operators" class="flex items-center py-2.5 px-4 rounded transition-all" :class="{
                  'bg-[#6b7280]': isActiveRoute('/operators'),
                  'hover:bg-gray-700': !isActiveRoute('/operators'),
                }">
                  <span><i class="pi pi-user"></i></span>
                  <span v-if="!isSidebarMinimized" class="ml-3">Operators</span>
                </router-link>
          </li>  -->

        </ul>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 bg-gray-100">
        <header v-if="isAuthenticated && !loading" class="text-black border-b bg-white backdrop-blur-xl px-6 py-3 flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <h1 class="text-xl font-semibold">{{ pageHeader }}</h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <span class="text-sm text-slate-400">Welcome, {{ user.username }}</span>
            <button class="bg-red-500 text-sm px-4 py-2 text-white rounded hover:bg-red-600" @click="logout">Logout</button>
          </div>
        </header>

        <div v-if="loading" class="flex justify-center items-center h-full p-6">
          <div class="text-center">
            <div class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status"></div>
            <p class="text-xl mt-2">Processing...</p>
          </div>
        </div>
        <router-view v-else></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import { store } from './store/auth';
import axios from "axios";
export default {
  data() {
    return {
      sidebarWidth: 240, // default width
      isResizing: false,
      minSidebarWidth: 80,
      maxSidebarWidth: 400,
      userCurrencies: JSON.parse(localStorage.getItem("userCurrency")) || [],
      selectedCurrency: localStorage.getItem('selectedCurrency') || null, // Default value to null
      user: {},
      store,
      isSidebarMinimized: false,
      isSpinwinOpen: false,
      isSettingOpen: false,
      loading: false,
      isFleetManagementOpen: false, 
      isUserRoleManagementOpen: false,
      isTrainingRecordOpen: false,  
      isTechnicalLibraryOpen: false,
      isTechnicalServicesOpen: false,  
      isMaintenancePlanningOpen: false, 
    };
  },
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('authToken');
    },
    pageHeader() {
      const route = this.$route.path;
      switch (route) {
        case '/dashboard':
          return 'Dashboard Overview';
        case '/settings':
          return 'Settings';
        case '/profilesettings':
          return 'Profile Settings';
        case '/groups':
          return 'Group';
        case '/roles':
          return 'Role';
        case '/operators':
          return 'Operators';
        default:
          return 'Dashboard'; 
      }
    },
  },
  methods: {
    toggleFleetManagement() {
      this.isFleetManagementOpen = !this.isFleetManagementOpen;
    },
    toggleUserRoleManagement() {
      this.isUserRoleManagementOpen = !this.isUserRoleManagementOpen;
    },
    toggleTrainingRecord() {
      this.isTrainingRecordOpen = !this.isTrainingRecordOpen;
    },
    toggleTechnicalLibrary() {
      this.isTechnicalLibraryOpen = !this.isTechnicalLibraryOpen;
    },
    
    toggleTechnicalServices() {
      this.isTechnicalServicesOpen = !this.isTechnicalServicesOpen;
    },
    startResizing(e) {
      this.isResizing = true;
      document.addEventListener("mousemove", this.resizeSidebar);
      document.addEventListener("mouseup", this.stopResizing);
    },
    resizeSidebar(e) {
      if (!this.isResizing) return;
      let newWidth = e.clientX;
      if (newWidth < this.minSidebarWidth) newWidth = this.minSidebarWidth;
      if (newWidth > this.maxSidebarWidth) newWidth = this.maxSidebarWidth;
      this.sidebarWidth = newWidth;
    },
    stopResizing() {
      this.isResizing = false;
      document.removeEventListener("mousemove", this.resizeSidebar);
      document.removeEventListener("mouseup", this.stopResizing);
    },
    toggleSidebar() {
      if (this.sidebarWidth > this.minSidebarWidth + 20) {
        this.sidebarWidth = this.minSidebarWidth;
      } else {
        this.sidebarWidth = 240;
      }
    },
    toggleMaintenancePlanning() {
      this.isMaintenancePlanningOpen = !this.isMaintenancePlanningOpen;
    },
    toggleSettings() {
      this.isSettingOpen = !this.isSettingOpen;
    },
    toggleSidebar() {
      this.isSidebarMinimized = !this.isSidebarMinimized;
      this.isSettingOpen = false;
      this.isSpinwinOpen = false;
    },
    isActiveRoute(route) {
      return this.$route.path === route;
    },
    async logout() {
      window.location.replace('/login');
      localStorage.clear();
    },
  },
  mounted() {
    if (!localStorage.getItem('authToken')) {
      this.$router.push('/login');
    }
  },
  created() {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  },
};
</script>
