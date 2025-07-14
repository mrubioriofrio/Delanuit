// Inicializar AOS (Animate on Scroll)
document.addEventListener('DOMContentLoaded', () => {
    // Configuración de AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: false,
        mirror: true
    });

    // Animación de entrada para el nombre del artista usando GSAP
    gsap.fromTo('#artist-name', 
        { opacity: 0, y: -50 }, 
        { opacity: 1, y: 0, duration: 2, ease: "power3.out" }
    );
    
    // Control de audio 
    const audioToggle = document.getElementById('audio-toggle');
    const soundMessage = document.querySelector('.sound-message');
    const vinylDiscImage = document.querySelector('.vinyl-disc-image');
    let artistVideo = document.getElementById('artist-video');
    
    // Variable para controlar el estado de la animación
    let isAnimating = false;
    let fadeTimeout = null;
    
    if (audioToggle && artistVideo && soundMessage) {
        // Estado inicial: audio apagado (muted) y disco sin girar
        artistVideo.muted = true;
        
        // Asegurar que el control sea visible inicialmente
        audioToggle.style.opacity = 1;
        audioToggle.style.display = 'flex';
        
        // Añadir evento de clic al disco
        audioToggle.addEventListener('click', () => {
            // Evitar múltiples clics durante animaciones
            if (isAnimating) return;
            isAnimating = true;
            
            // Limpiar cualquier timeout pendiente
            if (fadeTimeout) {
                clearTimeout(fadeTimeout);
                fadeTimeout = null;
            }
            
            // Cambiar estado de muted
            artistVideo.muted = !artistVideo.muted;
            
            // Cambiar animación del disco y mensaje
            if (!artistVideo.muted) {
                // Activar sonido
                vinylDiscImage.classList.add('spinning');
                soundMessage.textContent = 'Sonido activado';
                
                // Mostrar brevemente el mensaje de sonido activado y luego ocultar
                setTimeout(() => {
                    gsap.to(audioToggle, {
                        opacity: 0,
                        duration: 0.3,
                        onComplete: () => {
                            audioToggle.style.display = 'none';
                            isAnimating = false;
                        }
                    });
                }, 1000);
            } else {
                // Desactivar sonido
                vinylDiscImage.classList.remove('spinning');
                soundMessage.textContent = 'Haz clic para activar el sonido';
                
                // Asegurar que el control esté visible
                audioToggle.style.display = 'flex';
                audioToggle.style.opacity = 1;
                
                gsap.to(audioToggle, { 
                    scale: 0.95, 
                    duration: 0.2,
                    boxShadow: 'none',
                    onComplete: () => {
                        gsap.to(audioToggle, { 
                            scale: 1, 
                            duration: 0.2,
                            onComplete: () => {
                                isAnimating = false;
                            }
                        });
                    }
                });
            }
        });
        
        // Mostrar el control al hacer hover sobre el video
        const videoContainer = document.querySelector('.full-width-video-container');
        if (videoContainer) {
            videoContainer.addEventListener('mouseenter', () => {
                // Solo mostrar de nuevo si el audio está activado y el control está oculto
                if (audioToggle.style.display === 'none') {
                    // Limpiar cualquier timeout pendiente
                    if (fadeTimeout) {
                        clearTimeout(fadeTimeout);
                        fadeTimeout = null;
                    }
                    
                    audioToggle.style.display = 'flex';
                    gsap.to(audioToggle, {
                        opacity: 1,
                        duration: 0.5,
                        onComplete: () => {
                            // Volver a ocultar después de un tiempo
                            fadeTimeout = setTimeout(() => {
                                gsap.to(audioToggle, {
                                    opacity: 0,
                                    duration: 0.8,
                                    onComplete: () => {
                                        audioToggle.style.display = 'none';
                                    }
                                });
                            }, 2000);
                        }
                    });
                }
            });
        }
    }

    // Agregar clase de neón al nombre del artista después de la animación inicial
    setTimeout(() => {
        document.getElementById('artist-name').classList.add('neon-glow');
    }, 2000);
    
    // Hacer las canciones clicables - Spotify
    const spotifyTracks = document.querySelectorAll('.spotify-card .track-item');
    spotifyTracks.forEach(track => {
        track.style.cursor = 'pointer';
        track.addEventListener('click', () => {
            const trackUrl = track.getAttribute('data-track-url');
            if (trackUrl) {
                window.open(trackUrl, '_blank');
            }
        });
    });
    
    // Hacer las canciones clicables - Apple Music
    const appleTracks = document.querySelectorAll('.apple-card .track-item');
    appleTracks.forEach(track => {
        track.style.cursor = 'pointer';
        track.addEventListener('click', () => {
            const trackUrl = track.getAttribute('data-apple-track-url');
            if (trackUrl) {
                window.open(trackUrl, '_blank');
            }
        });
    });
    
    // Hacer las plataformas clicables en Amazon
    const platformLinks = document.querySelectorAll('.platform-link');
    platformLinks.forEach(link => {
        if (!link.hasAttribute('href') || link.getAttribute('href') === '#') {
            link.style.opacity = '0.6';
            link.style.cursor = 'default';
            link.addEventListener('click', (e) => {
                e.preventDefault();
            });
        }
    });
    
    // Animación para el título con efecto de tecleo
    const letters = document.querySelectorAll('.handwritten-letter');
    if (letters.length > 0) {
        // Retrasar un poco la animación para que sea secuencial con otras animaciones
        setTimeout(() => {
            // Ocultar todas las letras al inicio
            letters.forEach(letter => {
                letter.style.opacity = '0';
                letter.classList.remove('cursor');
            });
            
            // Establecer el cursor en la primera letra antes de comenzar
            if (letters[0]) {
                letters[0].classList.add('cursor');
            }
            
            // Animar cada letra secuencialmente con efecto de tecleo
            let currentIndex = 0;
            
            // Función para simular el tecleo de una letra
            const typeLetter = () => {
                // Si hemos terminado todas las letras, aplicar el efecto final
                if (currentIndex >= letters.length) {
                    // Quitar el cursor de la última letra
                    letters[letters.length - 1].classList.remove('cursor');
                    
                    // Efecto de brillo al final de la animación
                    gsap.to(".music-title", {
                        filter: "brightness(1.4) drop-shadow(0 0 15px rgba(0,255,255,0.9))",
                        duration: 0.8,
                        yoyo: true,
                        repeat: 1,
                        ease: "power4.out"
                    });
                    return;
                }
                
                // Mostrar la letra actual
                const letter = letters[currentIndex];
                letter.classList.add('typed');
                gsap.to(letter, {
                    opacity: 1,
                    duration: 0.05,
                    ease: "none",
                });
                
                // Calcular un tiempo aleatorio para la siguiente letra (efecto más realista)
                const nextDelay = 70 + Math.floor(Math.random() * 60);
                
                // Avanzar a la siguiente letra después del retraso
                setTimeout(() => {
                    // Quitar el cursor de la letra actual
                    letter.classList.remove('cursor');
                    currentIndex++;
                    
                    // Añadir el cursor a la siguiente letra
                    if (currentIndex < letters.length) {
                        letters[currentIndex].classList.add('cursor');
                    }
                    
                    // Llamar recursivamente para la siguiente letra
                    typeLetter();
                }, nextDelay);
            };
            
            // Iniciar la animación de tecleo después de un breve retraso
            setTimeout(typeLetter, 300);
        }, 1500); // Retardo inicial antes de empezar la animación de tecleo
    }
    
    // Animación para el contenedor del video
    gsap.fromTo('.artist-video-container',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.5, delay: 0.5, ease: "power2.out" }
    );
    
    // Gestión mejorada del video para reproducción automática con sonido
    // Reutilizamos la variable artistVideo ya declarada anteriormente
    if (artistVideo) {
        // Asegurar que el video esté visible
        artistVideo.style.display = 'block';
        
        // Ocultar el placeholder si existe
        const placeholder = document.querySelector('.video-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }
        
        // Crear un mensaje que indica que se necesita hacer clic para reproducir con sonido
        const createPlayOverlay = () => {
            // Comprobar si ya existe el overlay
            if (document.querySelector('.play-overlay')) return;
            
            const overlay = document.createElement('div');
            overlay.className = 'play-overlay';
            overlay.innerHTML = '<div class="play-message"><div class="vinyl-record"></div> Haz clic para activar el sonido</div>';
            
            const videoContainer = document.querySelector('.full-width-video-container');
            videoContainer.appendChild(overlay);
            
            // Añadir evento de clic al overlay
            overlay.addEventListener('click', function() {
                artistVideo.muted = false;
                artistVideo.play();
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.remove();
                }, 1000);
            });
        };
        
        // Función para intentar reproducir el video con sonido
        const attemptPlayWithSound = async () => {
            try {
                artistVideo.muted = false;
                await artistVideo.play();
                console.log('Reproducción con sonido iniciada con éxito');
            } catch (error) {
                console.warn('No se pudo iniciar la reproducción con sonido:', error);
                
                // Si falla, intentar reproducir sin sonido y mostrar el overlay
                artistVideo.muted = true;
                artistVideo.play().then(() => {
                    console.log('Reproducción sin sonido iniciada');
                    createPlayOverlay();
                }).catch(e => {
                    console.error('No se pudo reproducir el video en absoluto:', e);
                });
            }
        };
        
        // Intento #1: Esperar a que el documento esté completamente listo
        if (document.readyState === 'complete') {
            attemptPlayWithSound();
        } else {
            window.addEventListener('load', attemptPlayWithSound);
        }
        
        // Intento #2: Intentar reproducir cuando el video esté listo
        if (artistVideo.readyState >= 3) {
            attemptPlayWithSound();
        } else {
            artistVideo.addEventListener('canplay', attemptPlayWithSound, { once: true });
        }
        
        // Intento #3: Usar interacción del usuario si está disponible
        const userEvents = ['click', 'touchend', 'keydown'];
        const handleUserInteraction = () => {
            artistVideo.muted = false;
            artistVideo.play().then(() => {
                // Quitar el overlay si existe
                const overlay = document.querySelector('.play-overlay');
                if (overlay) overlay.remove();
            });
            
            // Eliminar todos los event listeners una vez que haya una interacción
            userEvents.forEach(event => {
                document.removeEventListener(event, handleUserInteraction);
            });
        };
        
        userEvents.forEach(event => {
            document.addEventListener(event, handleUserInteraction);
        });
        
        // Asegurar que el bucle funcione
        artistVideo.addEventListener('ended', function() {
            artistVideo.currentTime = 0;
            artistVideo.play();
        });
        
        // Manejar errores de carga del video
        artistVideo.addEventListener('error', function(e) {
            console.error('Error al cargar el video:', e);
        });
    }
    
    // Efecto de desvanecimiento para la sección hero al hacer scroll
    window.addEventListener('scroll', () => {
        const scrollValue = window.scrollY;
        
        // Cambiar la opacidad del nombre del artista basado en el scroll
        const artistName = document.getElementById('artist-name');
        if (artistName && scrollValue > 100) {
            const opacity = 1 - (scrollValue - 100) / 300;
            if (opacity > 0) {
                artistName.style.opacity = opacity;
            }
        }
    });

    // Animación para las tarjetas de canciones al hacer hover
    const songCards = document.querySelectorAll('.song-card');
    songCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { 
                backgroundColor: 'rgba(255,255,255,0.08)', 
                boxShadow: '0 10px 30px rgba(0,255,255,0.2)',
                duration: 0.3 
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { 
                backgroundColor: 'rgba(255,255,255,0.03)', 
                boxShadow: 'none',
                duration: 0.3 
            });
        });
    });

    // Animación para el botón de Spotify
    const spotifyButton = document.querySelector('.spotify-button');
    if (spotifyButton) {
        spotifyButton.addEventListener('mouseenter', () => {
            gsap.to(spotifyButton, { 
                scale: 1.05, 
                y: -3, 
                boxShadow: '0 10px 30px rgba(29, 185, 84, 0.6)',
                duration: 0.3 
            });
        });
        
        spotifyButton.addEventListener('mouseleave', () => {
            gsap.to(spotifyButton, { 
                scale: 1, 
                y: 0, 
                boxShadow: '0 0 20px rgba(29, 185, 84, 0.4)',
                duration: 0.3 
            });
        });
        
        spotifyButton.addEventListener('click', (e) => {
            e.preventDefault();
            gsap.to(spotifyButton, { 
                scale: 0.98, 
                duration: 0.1,
                onComplete: () => {
                    gsap.to(spotifyButton, { scale: 1, duration: 0.3 });
                    // Aquí podrías abrir un enlace real de Spotify
                    // window.open('https://open.spotify.com/artist/tuArtistaID', '_blank');
                }
            });
        });
    }
});
