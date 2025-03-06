
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        # Authenticate the user
        user = authenticate(username=username, password=password)

        if user is None:
            return Response({"detail": "Incorrect password or username."}, status=status.HTTP_400_BAD_REQUEST)

        # If authentication is successful, generate tokens
        return super().post(request, *args, **kwargs)