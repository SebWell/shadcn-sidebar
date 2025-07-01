<template>
  <div 
    :class="cn(
      'relative flex h-full',
      content.position === 'right' && 'flex-row-reverse',
      content.customClass
    )"
  >
    <!-- Backdrop -->
    <Transition name="backdrop">
      <div
        v-if="isOpen && content.showBackdrop"
        class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        @click="close"
      />
    </Transition>
    
    <!-- Sidebar -->
    <Transition name="sidebar" :css="false" @enter="onEnter" @leave="onLeave">
      <aside
        v-show="isOpen || !content.collapsible"
        ref="sidebarRef"
        :class="cn(
          'z-50 flex flex-col border-r bg-background',
          // Position
          content.position === 'right' && 'border-l border-r-0',
          // Width
          content.variant === 'compact' && 'w-16',
          content.variant === 'default' && 'w-64',
          content.variant === 'wide' && 'w-80',
          // Mobile
          content.collapsible && 'fixed inset-y-0 left-0 md:relative md:translate-x-0',
          content.position === 'right' && content.collapsible && 'left-auto right-0',
          content.sidebarClass
        )"
        :style="sidebarStyle"
      >
        <!-- Header -->
        <div 
          v-if="content.showHeader"
          :class="cn(
            'flex items-center gap-2 border-b px-4 py-3',
            content.headerClass
          )"
        >
          <!-- Logo/Icon -->
          <div 
            v-if="content.showLogo"
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
          >
            <span class="text-lg font-bold">{{ content.logoText || 'L' }}</span>
          </div>
          
          <!-- Title -->
          <div 
            v-if="content.title && content.variant !== 'compact'"
            class="flex-1"
          >
            <h2 :class="cn('text-lg font-semibold', content.titleClass)">
              {{ content.title }}
            </h2>
            <p 
              v-if="content.subtitle"
              :class="cn('text-sm text-muted-foreground', content.subtitleClass)"
            >
              {{ content.subtitle }}
            </p>
          </div>
          
          <!-- Close button -->
          <button
            v-if="content.collapsible && content.showCloseButton"
            @click="close"
            :class="cn(
              'inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors',
              'hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <!-- Navigation -->
        <nav 
          :class="cn(
            'flex-1 space-y-1 p-2',
            content.navClass
          )"
        >
          <!-- Navigation items -->
          <div
            v-for="(item, index) in navigationItems"
            :key="index"
            :class="cn(
              'group relative',
              item.type === 'separator' && 'my-2 border-t border-border',
              item.type === 'group' && 'mb-4'
            )"
          >
            <!-- Group label -->
            <div
              v-if="item.type === 'group'"
              :class="cn(
                'px-2 pb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider',
                content.variant === 'compact' && 'sr-only'
              )"
            >
              {{ item.label }}
            </div>
            
            <!-- Navigation link -->
            <a
              v-else-if="item.type !== 'separator'"
              :href="item.href || '#'"
              :class="cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                'hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                item.active && 'bg-accent text-accent-foreground',
                item.disabled && 'pointer-events-none opacity-50',
                content.variant === 'compact' && 'justify-center px-2'
              )"
              @click="onItemClick(item, $event)"
            >
              <!-- Icon -->
              <div 
                v-if="item.icon"
                class="h-4 w-4 shrink-0"
                v-html="item.icon"
              />
              
              <!-- Label -->
              <span 
                v-if="content.variant !== 'compact'"
                class="flex-1"
              >
                {{ item.label }}
              </span>
              
              <!-- Badge -->
              <div
                v-if="item.badge && content.variant !== 'compact'"
                :class="cn(
                  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                  'bg-secondary text-secondary-foreground'
                )"
              >
                {{ item.badge }}
              </div>
              
              <!-- Arrow for submenus -->
              <svg
                v-if="item.children && content.variant !== 'compact'"
                class="h-4 w-4 transition-transform"
                :class="{ 'rotate-90': item.expanded }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
            
            <!-- Tooltip for compact mode -->
            <div
              v-if="content.variant === 'compact' && item.label"
              :class="cn(
                'absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 rounded-md bg-popover px-2 py-1',
                'text-xs text-popover-foreground shadow-md opacity-0 transition-opacity',
                'group-hover:opacity-100 pointer-events-none'
              )"
            >
              {{ item.label }}
            </div>
          </div>
        </nav>
        
        <!-- Footer -->
        <div 
          v-if="content.showFooter"
          :class="cn(
            'border-t p-4',
            content.footerClass
          )"
        >
          <slot name="footer">
            <div 
              v-if="content.footerContent"
              class="text-sm text-muted-foreground"
              v-html="content.footerContent"
            />
          </slot>
        </div>
      </aside>
    </Transition>
    
    <!-- Main content -->
    <main 
      :class="cn(
        'flex-1 overflow-hidden',
        content.mainContentClass
      )"
    >
      <slot />
    </main>
    
    <!-- Toggle button (mobile) -->
    <button
      v-if="content.collapsible && content.showToggle"
      @click="toggle"
      :class="cn(
        'fixed bottom-4 left-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full',
        'bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden',
        content.toggleButtonClass
      )"
    >
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { cn } from './cn.js'

const props = defineProps({
  content: {
    type: Object,
    default: () => ({})
  },
  modelValue: {
    type: Boolean,
    default: undefined
  }
})

const emit = defineEmits(['update:modelValue', 'toggle', 'open', 'close', 'itemClick'])

// Reactive data
const sidebarRef = ref(null)
const internalOpen = ref(false)

// Computed properties
const isOpen = computed({
  get: () => props.modelValue !== undefined ? props.modelValue : internalOpen.value,
  set: (value) => {
    if (props.modelValue !== undefined) {
      emit('update:modelValue', value)
    } else {
      internalOpen.value = value
    }
  }
})

const sidebarStyle = computed(() => ({
  width: content.value?.customWidth || undefined
}))

const navigationItems = computed(() => {
  return content.value?.navigationItems || [
    {
      type: 'link',
      label: 'Dashboard',
      href: '#',
      icon: '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/></svg>',
      active: true
    },
    {
      type: 'link',
      label: 'Settings',
      href: '#',
      icon: '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>'
    }
  ]
})

// Methods
const toggle = () => {
  const newValue = !isOpen.value
  isOpen.value = newValue
  emit('toggle', newValue)
  
  if (newValue) {
    emit('open')
  } else {
    emit('close')
  }
}

const open = () => {
  if (!isOpen.value) {
    toggle()
  }
}

const close = () => {
  if (isOpen.value) {
    toggle()
  }
}

const onItemClick = (item, event) => {
  if (item.disabled) {
    event.preventDefault()
    return
  }
  
  emit('itemClick', { item, event })
  
  // Close sidebar on mobile after item click
  if (content.value?.collapsible && window.innerWidth < 768) {
    close()
  }
}

// Animation handlers
const onEnter = (el, done) => {
  if (!content.value?.collapsible) {
    done()
    return
  }
  
  el.style.transform = content.value?.position === 'right' ? 'translateX(100%)' : 'translateX(-100%)'
  el.style.transition = 'transform 0.3s ease'
  
  requestAnimationFrame(() => {
    el.style.transform = 'translateX(0)'
    setTimeout(done, 300)
  })
}

const onLeave = (el, done) => {
  if (!content.value?.collapsible) {
    done()
    return
  }
  
  el.style.transition = 'transform 0.3s ease'
  el.style.transform = content.value?.position === 'right' ? 'translateX(100%)' : 'translateX(-100%)'
  
  setTimeout(done, 300)
}

// Handle resize
const handleResize = () => {
  if (content.value?.collapsible && window.innerWidth >= 768) {
    // Desktop: keep sidebar open
    if (!isOpen.value) {
      open()
    }
  }
}

// Watchers
watch(() => content.value?.defaultOpen, (newValue) => {
  if (newValue && !isOpen.value) {
    isOpen.value = true
  }
}, { immediate: true })

// Lifecycle
onMounted(() => {
  if (content.value?.defaultOpen || (!content.value?.collapsible)) {
    internalOpen.value = true
  }
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Expose methods
defineExpose({
  toggle,
  open,
  close,
  isOpen: readonly(isOpen)
})
</script>

<style>
/* Import global shadcn/ui styles */
@import './globals.css';
</style>

<style scoped>
/* Backdrop animation */
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}
</style> 