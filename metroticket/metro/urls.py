from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StationViewSet, RouteViewSet, TicketViewSet, UserRegistrationView, calculate_ticket_cost

router = DefaultRouter()
router.register(r'stations', StationViewSet)
router.register(r'routes', RouteViewSet)
router.register(r'tickets', TicketViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('calculate-ticket-cost/', calculate_ticket_cost, name='calculate-ticket-cost'),
    
]