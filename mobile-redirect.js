// Mobile detection and redirect
(function() {
    // Check if user is on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                    || window.innerWidth <= 768;
    
    // Check if slow connection
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
    
    // Check if already on mobile page
    const isOnMobilePage = window.location.pathname.includes('mobile') || window.location.pathname.includes('simple');
    
    // Redirect to mobile-optimized page if needed
    if ((isMobile || isSlowConnection) && !isOnMobilePage && window.location.pathname === '/') {
        console.log('Redirecting to mobile-optimized page');
        window.location.href = 'index-mobile.html';
    }
})();