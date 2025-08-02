<template>
  <div 
    :class="cn(
      'sidebar-container',
      content.position === 'right' && 'sidebar-container--right',
      content.customClass
    )"
  >
    <!-- Backdrop -->
    <Transition name="backdrop">
      <div
        v-if="isOpen && content.showBackdrop"
        class="sidebar-backdrop"
        @click="close"
      />
    </Transition>
    
    <!-- Sidebar -->
    <Transition name="sidebar" :css="false" @enter="onEnter" @leave="onLeave">
      <aside
        v-show="isOpen || !content.collapsible"
        ref="sidebarRef"
        :class="cn(
          'sidebar',
          // Position
          content.position === 'right' && 'sidebar--right',
          // Width
          content.variant === 'compact' && 'sidebar--compact',
          content.variant === 'default' && 'sidebar--default',
          content.variant === 'wide' && 'sidebar--wide',
          // Mobile
          content.collapsible && 'sidebar--collapsible',
          content.position === 'right' && content.collapsible && 'sidebar--collapsible-right',
          content.sidebarClass
        )"
        :style="sidebarStyle"
      >
        <!-- Header -->
        <div 
          v-if="content.showHeader"
          :class="cn(
            'sidebar-header',
            content.headerClass
          )"
        >
          <!-- Logo/Icon -->
          <div 
            v-if="content.showLogo"
            class="sidebar-logo"
          >
            <span class="sidebar-logo-text">{{ content.logoText || 'L' }}</span>
          </div>
          
          <!-- Title -->
          <div 
            v-if="content.title && content.variant !== 'compact'"
            class="sidebar-title-container"
          >
            <h2 :class="cn('sidebar-title', content.titleClass)">
              {{ content.title }}
            </h2>
            <p 
              v-if="content.subtitle"
              :class="cn('sidebar-subtitle', content.subtitleClass)"
            >
              {{ content.subtitle }}
            </p>
          </div>
          
          <!-- Close button -->
          <button
            v-if="content.collapsible && content.showCloseButton"
            @click="close"
            class="sidebar-close-btn"
          >
            <svg class="sidebar-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <!-- Navigation -->
        <nav 
          :class="cn(
            'sidebar-nav',
            content.navClass
          )"
        >
          <!-- Navigation items -->
          <div
            v-for="(item, index) in navigationItems"
            :key="index"
            :class="cn(
              'sidebar-nav-item-wrapper',
              item.type === 'separator' && 'sidebar-nav-separator',
              item.type === 'group' && 'sidebar-nav-group'
            )"
          >
            <!-- Group label -->
            <div
              v-if="item.type === 'group'"
              :class="cn(
                'sidebar-group-label',
                content.variant === 'compact' && 'sidebar-group-label--hidden'
              )"
            >
              {{ item.label }}
            </div>
            
            <!-- Navigation link -->
            <a
              v-else-if="item.type !== 'separator'"
              :href="item.href || '#'"
              :class="cn(
                'sidebar-nav-link',
                item.active && 'sidebar-nav-link--active',
                item.disabled && 'sidebar-nav-link--disabled',
                content.variant === 'compact' && 'sidebar-nav-link--compact'
              )"
              @click="onItemClick(item, $event)"
            >
              <!-- Icon -->
              <div 
                v-if="item.icon"
                class="sidebar-nav-icon"
                v-html="item.icon"
              />
              
              <!-- Label -->
              <span 
                v-if="content.variant !== 'compact'"
                class="sidebar-nav-label"
              >
                {{ item.label }}
              </span>
              
              <!-- Badge -->
              <div
                v-if="item.badge && content.variant !== 'compact'"
                class="sidebar-nav-badge"
              >
                {{ item.badge }}
              </div>
              
              <!-- Arrow for submenus -->
              <svg
                v-if="item.children && content.variant !== 'compact'"
                :class="cn('sidebar-nav-arrow', { 'sidebar-nav-arrow--expanded': item.expanded })"
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
              class="sidebar-tooltip"
            >
              {{ item.label }}
            </div>
          </div>
        </nav>
        
        <!-- Footer -->
        <div 
          v-if="content.showFooter"
          :class="cn(
            'sidebar-footer',
            content.footerClass
          )"
        >
          <slot name="footer">
            <div 
              v-if="content.footerContent"
              class="sidebar-footer-content"
              v-html="content.footerContent"
            />
          </slot>
        </div>
      </aside>
    </Transition>
    
    <!-- Main content -->
    <main 
      :class="cn(
        'sidebar-main-content',
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
        'sidebar-toggle-btn',
        content.toggleButtonClass
      )"
    >
      <svg class="sidebar-toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>
  </div>
</template>

<script>
import { cn } from './cn.js'

export default {
  props: {
    content: {
      type: Object,
      default: () => ({})
    },
    modelValue: {
      type: Boolean,
      default: undefined
    }
  },
  data() {
    return {
      sidebarRef: null,
      internalOpen: false
    }
  },
  computed: {
    isOpen: {
      get() {
        return this.modelValue !== undefined ? this.modelValue : this.internalOpen
      },
      set(value) {
        if (this.modelValue !== undefined) {
          this.$emit('update:modelValue', value)
        } else {
          this.internalOpen = value
        }
      }
    },
    
    sidebarStyle() {
      return {
        width: this.content?.customWidth || undefined
      }
    },
    
    navigationItems() {
      return this.content?.navigationItems || [
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
    }
  },
  watch: {
    'content.defaultOpen': {
      handler(newValue) {
        if (newValue && !this.isOpen) {
          this.isOpen = true
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.content?.defaultOpen || (!this.content?.collapsible)) {
      this.internalOpen = true
    }
    
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    cn,
    
    toggle() {
      const newValue = !this.isOpen
      this.isOpen = newValue
      this.$emit('toggle', newValue)
      
      if (newValue) {
        this.$emit('open')
      } else {
        this.$emit('close')
      }
    },
    
    open() {
      if (!this.isOpen) {
        this.toggle()
      }
    },
    
    close() {
      if (this.isOpen) {
        this.toggle()
      }
    },
    
    onItemClick(item, event) {
      if (item.disabled) {
        event.preventDefault()
        return
      }
      
      this.$emit('itemClick', { item, event })
      
      // Close sidebar on mobile after item click
      if (this.content?.collapsible && window.innerWidth < 768) {
        this.close()
      }
    },
    
    // Animation handlers
    onEnter(el, done) {
      if (!this.content?.collapsible) {
        done()
        return
      }
      
      el.style.transform = this.content?.position === 'right' ? 'translateX(100%)' : 'translateX(-100%)'
      el.style.transition = 'transform 0.3s ease'
      
      requestAnimationFrame(() => {
        el.style.transform = 'translateX(0)'
        setTimeout(done, 300)
      })
    },
    
    onLeave(el, done) {
      if (!this.content?.collapsible) {
        done()
        return
      }
      
      el.style.transition = 'transform 0.3s ease'
      el.style.transform = this.content?.position === 'right' ? 'translateX(100%)' : 'translateX(-100%)'
      
      setTimeout(done, 300)
    },
    
    // Handle resize
    handleResize() {
      if (this.content?.collapsible && window.innerWidth >= 768) {
        // Desktop: keep sidebar open
        if (!this.isOpen) {
          this.open()
        }
      }
    }
  }
}
</script>

<style>
/* Import global shadcn/ui styles */
@import './globals.css';
</style>

<style scoped>
/* ================================== */
/* SIDEBAR COMPONENT STYLES */
/* ================================== */

/* Container */
.sidebar-container {
  position: relative;
  display: flex;
  height: 100%;
}

.sidebar-container--right {
  flex-direction: row-reverse;
}

/* Backdrop */
.sidebar-backdrop {
  position: fixed;
  inset: 0;
  z-index: 40;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

/* Backdrop animations */
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

/* Sidebar */
.sidebar {
  z-index: 50;
  display: flex;
  flex-direction: column;
  border-right: 1px solid hsl(var(--border));
  background-color: hsl(var(--background));
}

.sidebar--right {
  border-left: 1px solid hsl(var(--border));
  border-right: none;
}

/* Sidebar variants */
.sidebar--compact {
  width: 4rem; /* 64px */
}

.sidebar--default {
  width: 16rem; /* 256px */
}

.sidebar--wide {
  width: 20rem; /* 320px */
}

/* Collapsible sidebar */
.sidebar--collapsible {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
}

.sidebar--collapsible-right {
  left: auto;
  right: 0;
}

/* Responsive behavior */
@media (min-width: 768px) {
  .sidebar--collapsible {
    position: relative;
    transform: translateX(0);
  }
}

/* Header */
.sidebar-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid hsl(var(--border));
  padding: 0.75rem 1rem;
}

/* Logo */
.sidebar-logo {
  display: flex;
  height: 2rem;
  width: 2rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

.sidebar-logo-text {
  font-size: 1.125rem;
  font-weight: 700;
}

/* Title container */
.sidebar-title-container {
  flex: 1;
}

.sidebar-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: hsl(var(--foreground));
}

.sidebar-subtitle {
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
}

/* Close button */
.sidebar-close-btn {
  display: inline-flex;
  height: 2rem;
  width: 2rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  color: hsl(var(--muted-foreground));
  transition: all 0.2s ease;
  border: none;
  background: transparent;
  cursor: pointer;
}

.sidebar-close-btn:hover {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}

.sidebar-close-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px hsl(var(--ring));
}

.sidebar-close-icon {
  height: 1rem;
  width: 1rem;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

/* Navigation item wrapper */
.sidebar-nav-item-wrapper {
  position: relative;
}

.sidebar-nav-separator {
  margin: 0.5rem 0;
  border-top: 1px solid hsl(var(--border));
}

.sidebar-nav-group {
  margin-bottom: 1rem;
}

/* Group label */
.sidebar-group-label {
  padding: 0 0.5rem 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: hsl(var(--muted-foreground));
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sidebar-group-label--hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Navigation links */
.sidebar-nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  color: hsl(var(--foreground));
  text-decoration: none;
}

.sidebar-nav-link:hover {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}

.sidebar-nav-link:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px hsl(var(--ring));
}

.sidebar-nav-link--active {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}

.sidebar-nav-link--disabled {
  pointer-events: none;
  opacity: 0.5;
}

.sidebar-nav-link--compact {
  justify-content: center;
  padding: 0.5rem;
}

/* Navigation icons */
.sidebar-nav-icon {
  height: 1rem;
  width: 1rem;
  flex-shrink: 0;
}

/* Navigation labels */
.sidebar-nav-label {
  flex: 1;
}

/* Navigation badges */
.sidebar-nav-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: hsl(var(--secondary));
  color: hsl(var(--secondary-foreground));
}

/* Navigation arrows */
.sidebar-nav-arrow {
  height: 1rem;
  width: 1rem;
  transition: transform 0.2s ease;
}

.sidebar-nav-arrow--expanded {
  transform: rotate(90deg);
}

/* Tooltips for compact mode */
.sidebar-tooltip {
  position: absolute;
  left: 100%;
  top: 50%;
  z-index: 50;
  margin-left: 0.5rem;
  transform: translateY(-50%);
  border-radius: 0.375rem;
  background-color: hsl(var(--popover));
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  color: hsl(var(--popover-foreground));
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.sidebar-nav-item-wrapper:hover .sidebar-tooltip {
  opacity: 1;
}

/* Footer */
.sidebar-footer {
  border-top: 1px solid hsl(var(--border));
  padding: 1rem;
}

.sidebar-footer-content {
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
}

/* Main content */
.sidebar-main-content {
  flex: 1;
  overflow: hidden;
}

/* Toggle button */
.sidebar-toggle-btn {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  z-index: 50;
  display: inline-flex;
  height: 3rem;
  width: 3rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
  border: none;
  cursor: pointer;
}

.sidebar-toggle-btn:hover {
  transform: scale(1.1);
}

.sidebar-toggle-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px hsl(var(--ring));
}

.sidebar-toggle-icon {
  height: 1.5rem;
  width: 1.5rem;
}

/* Hide toggle button on desktop */
@media (min-width: 768px) {
  .sidebar-toggle-btn {
    display: none;
  }
}

/* Dark mode support */
.dark .sidebar {
  border-color: hsl(var(--border));
  background-color: hsl(var(--background));
}

.dark .sidebar-header {
  border-bottom-color: hsl(var(--border));
}

.dark .sidebar-nav-separator {
  border-top-color: hsl(var(--border));
}

.dark .sidebar-footer {
  border-top-color: hsl(var(--border));
}

/* Animation support */
@media (prefers-reduced-motion: reduce) {
  .sidebar-nav-link,
  .sidebar-close-btn,
  .sidebar-toggle-btn,
  .sidebar-nav-arrow,
  .sidebar-tooltip {
    transition: none;
  }
}
</style> 