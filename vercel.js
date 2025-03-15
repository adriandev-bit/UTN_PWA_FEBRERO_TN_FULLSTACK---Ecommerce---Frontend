{
    "rewrites": [
      { "source": "/api/(.*)", "destination": "https://tu-backend.vercel.app/api/$1" }
    ],
    "redirects": [
      { "source": "/(.*)", "destination": "/", "statusCode": 200 }
    ]
  }
  