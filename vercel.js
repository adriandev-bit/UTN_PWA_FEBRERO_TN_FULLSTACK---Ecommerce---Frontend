module.exports = {
  // Rewrites para redirigir las rutas de la API
  rewrites: [
    {
      source: '/api/(.*)',
      destination: 'https://utn-pwa-febrero-tn-fullstack-ecommerce-backend.vercel.app/api/$1',
    },
  ],

  // Redirección de todas las rutas a index.html para manejar el enrutamiento con React (SPA)
  redirects: [
    {
      source: '/(.*)',
      destination: '/index.html',
      statusCode: 200,
    },
  ],
};
