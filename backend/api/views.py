from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import requests
import os
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


class DiscordAuthView(APIView):
    def post(self, request):
        code = request.data.get('code')
        if not code:
            return Response({'error': 'No se proporcionó el código de autenticación'}, status=status.HTTP_400_BAD_REQUEST)

        token_url = 'https://discord.com/api/v10/oauth2/token'
        data = {
            'client_id': os.getenv('DISCORD_CLIENT_ID'),
            'client_secret': os.getenv('DISCORD_CLIENT_SECRET'),
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': os.getenv('DISCORD_REDIRECT_URI'),
        }
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        token_response = requests.post(token_url, data=data, headers=headers)
        
        if token_response.status_code != 200:
            return Response({'error': 'Error al obtener el token de Discord', 'details': token_response.json()}, status=status.HTTP_400_BAD_REQUEST)

        token_data = token_response.json()
        access_token = token_data.get('access_token')

        user_url = 'https://discord.com/api/v10/users/@me'
        user_headers = {'Authorization': f'Bearer {access_token}'}
        user_response = requests.get(user_url, headers=user_headers)
        user_info = user_response.json() if user_response.status_code == 200 else {}
        guilds_url = 'https://discord.com/api/v10/users/@me/guilds'
        guilds_response = requests.get(guilds_url, headers=user_headers)
        
        if guilds_response.status_code != 200:
            return Response({'error': 'Error al obtener los servidores del usuario'}, status=status.HTTP_400_BAD_REQUEST)

        all_guilds = guilds_response.json()

        guilds_en_db = set(str(gid) for gid in Guild.objects.values_list('guild_id', flat=True))

        admin_guilds = []
        for g in all_guilds:
            is_owner = g.get('owner', False)
            permissions = int(g.get('permissions', 0))
            is_admin = (permissions & 0x8) == 0x8

            if is_owner or is_admin:
                guild_id_str = g['id']
                bot_presente = guild_id_str in guilds_en_db

                admin_guilds.append({
                    'id': guild_id_str,
                    'name': g['name'],
                    'icon': g['icon'],
                    'is_owner': is_owner,
                    'has_bot': bot_presente
                })

        admin_guilds.sort(key=lambda x: x['has_bot'], reverse=True)

        return Response({
            'user': {
                'id': user_info.get('id'),
                'username': user_info.get('username'),
                'avatar': user_info.get('avatar'),
            },
            'guilds': admin_guilds
        }, status=status.HTTP_200_OK)