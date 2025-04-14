import '' // Vite gets CSS this way, for both, dev and build, no need to import CSS in HTML

import Alpine from 'alpinejs'
import collapse from '@alpinejs/collapse' // PenguinUI dependency
import focus from '@alpinejs/focus' // PenguinUI dependency 
import mask from '@alpinejs/mask' // PenguinUI dependency 

// PenguinUI may require one or more of these for some components, hence they have been proactivly imported
Alpine.plugin(collapse)
Alpine.plugin(focus)
Alpine.plugin(mask)

window.Alpine = Alpine
Alpine.start()
