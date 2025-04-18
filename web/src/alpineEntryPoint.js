import { Alpine } from 'alpinejs'
import collapse from '@alpinejs/collapse' // PenguinUI dependency
import focus from '@alpinejs/focus' // PenguinUI dependency 
import mask from '@alpinejs/mask' // PenguinUI dependency 

// import './styles/global.css' // Vite gets CSS this way, for both, dev and build, no need to import CSS in HTML

// import Auth from './auth';


// Alpine.plugin(collapse)
// Alpine.plugin(focus)
// Alpine.plugin(mask)

// Create global store to hold the auth0 config
// Alpine.store('auth0', {
//     auth0Client: null
// })

// Alpine.data('auth', Auth);

export default function() {
    // PenguinUI may require one or more of these for some components, hence they have been proactivly imported
    Alpine.plugin(collapse)
    Alpine.plugin(focus)
    Alpine.plugin(mask)
}