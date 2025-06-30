export default {
  editor: {
    label: { en: 'Sidebar', fr: 'Barre latérale' },
    icon: 'sidebar',
    bubble: { icon: 'sidebar' }
  },
  triggerEvents: [
    { name: 'toggle', label: { en: 'On toggle', fr: 'Lors du basculement' } },
    { name: 'open', label: { en: 'On open', fr: 'Lors de l\'ouverture' } },
    { name: 'close', label: { en: 'On close', fr: 'Lors de la fermeture' } },
    { name: 'itemClick', label: { en: 'On item click', fr: 'Lors du clic sur un élément' } }
  ],
  properties: {
    // Layout
    variant: {
      label: { en: 'Variant', fr: 'Variante' },
      type: 'TextSelect',
      options: {
        choices: [
          { value: 'compact', label: { en: 'Compact (64px)', fr: 'Compact (64px)' } },
          { value: 'default', label: { en: 'Default (256px)', fr: 'Par défaut (256px)' } },
          { value: 'wide', label: { en: 'Wide (320px)', fr: 'Large (320px)' } }
        ]
      },
      defaultValue: 'default',
      bindable: true,
      section: 'layout'
    },
    position: {
      label: { en: 'Position', fr: 'Position' },
      type: 'TextSelect',
      options: {
        choices: [
          { value: 'left', label: { en: 'Left', fr: 'Gauche' } },
          { value: 'right', label: { en: 'Right', fr: 'Droite' } }
        ]
      },
      defaultValue: 'left',
      bindable: true,
      section: 'layout'
    },
    collapsible: {
      label: { en: 'Collapsible', fr: 'Pliable' },
      type: 'OnOff',
      defaultValue: false,
      bindable: true,
      section: 'behavior'
    },
    defaultOpen: {
      label: { en: 'Default open', fr: 'Ouvert par défaut' },
      type: 'OnOff',
      defaultValue: true,
      bindable: true,
      section: 'behavior'
    },
    showBackdrop: {
      label: { en: 'Show backdrop', fr: 'Afficher l\'arrière-plan' },
      type: 'OnOff',
      defaultValue: true,
      bindable: true,
      section: 'behavior'
    },
    
    // Header
    showHeader: {
      label: { en: 'Show header', fr: 'Afficher l\'en-tête' },
      type: 'OnOff',
      defaultValue: true,
      bindable: true,
      section: 'header'
    },
    showLogo: {
      label: { en: 'Show logo', fr: 'Afficher le logo' },
      type: 'OnOff',
      defaultValue: true,
      bindable: true,
      section: 'header'
    },
    logoText: {
      label: { en: 'Logo text', fr: 'Texte du logo' },
      type: 'Text',
      defaultValue: 'L',
      bindable: true,
      section: 'header'
    },
    title: {
      label: { en: 'Title', fr: 'Titre' },
      type: 'Text',
      defaultValue: 'Navigation',
      bindable: true,
      multiLang: true,
      section: 'header'
    },
    subtitle: {
      label: { en: 'Subtitle', fr: 'Sous-titre' },
      type: 'Text',
      defaultValue: '',
      bindable: true,
      multiLang: true,
      section: 'header'
    },
    showCloseButton: {
      label: { en: 'Show close button', fr: 'Afficher le bouton fermer' },
      type: 'OnOff',
      defaultValue: true,
      bindable: true,
      section: 'header'
    },
    
    // Footer
    showFooter: {
      label: { en: 'Show footer', fr: 'Afficher le pied de page' },
      type: 'OnOff',
      defaultValue: false,
      bindable: true,
      section: 'footer'
    },
    footerContent: {
      label: { en: 'Footer content', fr: 'Contenu du pied de page' },
      type: 'LongText',
      defaultValue: '',
      bindable: true,
      multiLang: true,
      section: 'footer'
    },
    
    // Toggle
    showToggle: {
      label: { en: 'Show toggle button', fr: 'Afficher le bouton basculer' },
      type: 'OnOff',
      defaultValue: true,
      bindable: true,
      section: 'toggle'
    },
    
    // Style
    customClass: {
      label: { en: 'Custom CSS class', fr: 'Classe CSS personnalisée' },
      type: 'Text',
      section: 'style'
    }
  },
  defaultContent: {
    variant: 'default',
    position: 'left',
    collapsible: false,
    defaultOpen: true,
    showBackdrop: true,
    showHeader: true,
    showLogo: true,
    logoText: 'L',
    title: 'Navigation',
    subtitle: '',
    showCloseButton: true,
    showFooter: false,
    footerContent: '',
    showToggle: true,
    customClass: ''
  },
  actions: [
    { label: { en: 'Toggle', fr: 'Basculer' }, action: 'toggle' },
    { label: { en: 'Open', fr: 'Ouvrir' }, action: 'open' },
    { label: { en: 'Close', fr: 'Fermer' }, action: 'close' }
  ]
} 