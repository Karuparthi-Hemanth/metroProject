from django.db import models
from django.contrib.auth.models import User

class Station(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Route(models.Model):
    source = models.ForeignKey(Station, on_delete=models.CASCADE, related_name='source_routes')
    destination = models.ForeignKey(Station, on_delete=models.CASCADE, related_name='destination_routes')
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.source} to {self.destination}"

class Ticket(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    route = models.ForeignKey(Route, on_delete=models.CASCADE)
    booking_time = models.DateTimeField(auto_now_add=True)
    travel_date = models.DateField()
    payment_status = models.BooleanField(default=False)

    def __str__(self):
        return f"Ticket for {self.route} on {self.travel_date}"
    