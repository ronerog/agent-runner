"""
URL configuration for weddings app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WeddingViewSet, WeddingPageViewSet

router = DefaultRouter()
router.register(r'', WeddingViewSet, basename='wedding')
router.register(r'pages', WeddingPageViewSet, basename='weddingpage')

urlpatterns = [
    path('', include(router.urls)),
]
