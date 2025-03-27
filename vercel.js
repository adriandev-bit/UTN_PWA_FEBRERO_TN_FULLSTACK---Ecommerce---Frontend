{
    "rewrites": [
      { "source": "/api/(.*)", "destination": "https://utn-pwa-febrero-tn-fullstack-ecommerce-backend.vercel.app/api/$1" }
    ],
    "redirects": [
      { "source": "/(.*)", "destination": "/", "statusCode": 200 }
    ]
  }
  