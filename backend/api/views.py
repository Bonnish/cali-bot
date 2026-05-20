from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Guild, Infraction, UserXp
from .serializers import GuildSerializer, InfractionSerializer, UserXpSerializer

class GuildConfigView(APIView):
    def get(self, request, guild_id):
        try:
            guild = Guild.objects.get(guild_id=guild_id)
            serializer = GuildSerializer(guild)
            return Response(serializer.data)
        except Guild.DoesNotExist:
            return Response({"error": "Server not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, guild_id):
        try:
            guild = Guild.objects.get(guild_id=guild_id)
            serializer = GuildSerializer(guild, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Guild.DoesNotExist:
            return Response({"error": "Server not found"}, status=status.HTTP_404_NOT_FOUND)


class InfractionsListView(APIView):
    def get(self, request, guild_id):
        infractions = Infraction.objects.filter(guild_id=guild_id).order_by('-created_at')
        serializer = InfractionSerializer(infractions, many=True)
        return Response(serializer.data)