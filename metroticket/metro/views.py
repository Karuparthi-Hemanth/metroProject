from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Station, Route, Ticket
from .serializers import StationSerializer, RouteSerializer, TicketSerializer
import stripe
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework import status
from .serializers import UserSerializer
from django.http import JsonResponse
from .utils import build_station_graph, dijkstra_shortest_path

stripe.api_key = settings.STRIPE_SECRET_KEY

class StationViewSet(viewsets.ModelViewSet):
    queryset = Station.objects.all()
    serializer_class = StationSerializer

class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def book_ticket(self, request):
        route_id = request.data.get('route_id')
        travel_date = request.data.get('travel_date')
        route = Route.objects.get(id=route_id)
        ticket = Ticket.objects.create(user=request.user, route=route, travel_date=travel_date)
        return Response({'message': 'Ticket booked successfully!', 'ticket_id': ticket.id})

    @action(detail=True, methods=['post'])
    def process_payment(self, request, pk=None):
        ticket = self.get_object()
        try:
            payment_intent = stripe.PaymentIntent.create(
                amount=int(ticket.route.price * 100),  
                currency='usd',
                payment_method_types=['card'],
            )
            ticket.payment_status = True
            ticket.save()
            return Response({'client_secret': payment_intent.client_secret})
        except Exception as e:
            return Response({'error': str(e)}, status=400)
        

class UserRegistrationView(APIView):
    def post(self, request):
        print(request)
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
def calculate_ticket_cost(request):
    start = request.GET.get('start')  # Source station ID
    end = request.GET.get('end')      # Destination station ID
    
    if not start or not end:
        return JsonResponse({"error": "Please provide start and end station IDs."}, status=400)
    
    graph = build_station_graph()
    total_cost, path = dijkstra_shortest_path(graph, int(start), int(end))
    
    if total_cost == float('inf'):
        return JsonResponse({"error": "No path found."}, status=404)
    
    return JsonResponse({
        "total_cost": total_cost,
        "path": path,
    })