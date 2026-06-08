from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
import requests
import os
from .models import Guild, Infraction, UserXp, DailyActivity, GlobalUser, AutoMessagesConfig
from .serializers import GuildSerializer, InfractionSerializer, UserXpSerializer, DailyActivitySerializer, AutoMessagesConfigSerializer

class GuildConfigView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, guild_id):
        guild, created = Guild.objects.get_or_create(
            guild_id=guild_id,
            defaults={'language': 'en', 'prefix': '!', 'xp_enabled': True, 'xp_per_message': 20}
        )
        serializer = GuildSerializer(guild)
        return Response(serializer.data)

    def put(self, request, guild_id):
        guild, created = Guild.objects.get_or_create(
            guild_id=guild_id,
            defaults={'language': 'en', 'prefix': '!', 'xp_enabled': True, 'xp_per_message': 20}
        )
        serializer = GuildSerializer(guild, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InfractionsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, guild_id):
        infractions = Infraction.objects.filter(guild_id=guild_id).order_by('-created_at')
        serializer = InfractionSerializer(infractions, many=True)
        return Response(serializer.data)


class LeaderboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, guild_id):
        # Limitar a los mejores 50 usuarios
        top_users = UserXp.objects.filter(guild_id=guild_id).order_by('-xp')[:50]
        serializer = UserXpSerializer(top_users, many=True)
        return Response(serializer.data)

class AnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, guild_id):
        # Obtener los últimos 14 días de actividad de mensajes
        from datetime import date, timedelta
        
        # Primero aseguramos tener registros rellenados de los últimos 7 días
        # Esto lo haremos en react, aquí solo retornamos los últimos 7 registros disponibles
        # O podemos generar los últimos 7 días y rellenar con 0
        
        end_date = date.today()
        start_date = end_date - timedelta(days=6)
        
        activities = DailyActivity.objects.filter(
            guild_id=guild_id, 
            date__range=[start_date, end_date]
        ).order_by('date')
        
        # Construir array con 7 días siempre
        data_dict = {a.date.isoformat(): a.messages_count for a in activities}
        result = []
        for i in range(7):
            current_date = start_date + timedelta(days=i)
            date_str = current_date.isoformat()
            result.append({
                "date": date_str,
                "display_date": current_date.strftime("%d %b"),
                "messages_count": data_dict.get(date_str, 0)
            })
            
        return Response(result)

class GuildDashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, guild_id):
        from datetime import date, timedelta
        end_date = date.today()
        start_date = end_date - timedelta(days=6)

        # Level and XP
        user_id = request.user.username  # User model username is the Discord ID
        user_xp = UserXp.objects.filter(guild_id=guild_id, user_id=user_id).first()
        level = user_xp.level if user_xp and user_xp.level else 0
        xp = user_xp.xp if user_xp and user_xp.xp else 0

        # Message activity (last 7 days)
        activities = DailyActivity.objects.filter(
            guild_id=guild_id, 
            date__range=[start_date, end_date]
        ).order_by('date')
        
        data_dict = {a.date.isoformat(): a.messages_count for a in activities}
        messages_chart = []
        for i in range(7):
            current_date = start_date + timedelta(days=i)
            date_str = current_date.isoformat()
            messages_chart.append({
                "date": current_date.strftime("%d %b"),
                "count": data_dict.get(date_str, 0)
            })

        # Bans in last 7 days
        bans_count = Infraction.objects.filter(
            guild_id=guild_id,
            action_type='ban',
            created_at__gte=start_date
        ).count()

        # New members in last 7 days
        try:
            from .models import GuildMember
            new_members_count = GuildMember.objects.filter(
                guild_id=guild_id,
                joined_at__gte=start_date
            ).count()
        except Exception:
            new_members_count = 0

        return Response({
            "level": level,
            "xp": xp,
            "messages_chart": messages_chart,
            "bans_this_week": bans_count,
            "new_members_this_week": new_members_count
        })

class GlobalUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.username
        global_user, created = GlobalUser.objects.get_or_create(
            user_id=user_id,
            defaults={'credits': 0, 'global_xp': 0, 'rankcard_bg': 'default', 'rankcard_color': '#2ecc71'}
        )
        return Response({
            "user_id": global_user.user_id,
            "credits": global_user.credits,
            "global_xp": global_user.global_xp,
            "rankcard_bg": global_user.rankcard_bg,
            "rankcard_color": global_user.rankcard_color
        })

    def put(self, request):
        user_id = request.user.username
        global_user, created = GlobalUser.objects.get_or_create(
            user_id=user_id,
            defaults={'credits': 0, 'global_xp': 0, 'rankcard_bg': 'default', 'rankcard_color': '#2ecc71'}
        )
        
        bg = request.data.get('rankcard_bg')
        color = request.data.get('rankcard_color')
        
        if bg:
            global_user.rankcard_bg = bg
        if color:
            global_user.rankcard_color = color
            
        global_user.save()
            
        return Response({
            "user_id": global_user.user_id,
            "credits": global_user.credits,
            "global_xp": global_user.global_xp,
            "rankcard_bg": global_user.rankcard_bg,
            "rankcard_color": global_user.rankcard_color
        })

class AutoMessagesConfigView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, guild_id):
        config, created = AutoMessagesConfig.objects.get_or_create(guild_id=guild_id)
        serializer = AutoMessagesConfigSerializer(config)
        return Response(serializer.data)

    def put(self, request, guild_id):
        config, created = AutoMessagesConfig.objects.get_or_create(guild_id=guild_id)
        serializer = AutoMessagesConfigSerializer(config, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GuildChannelsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, guild_id):
        token = os.getenv('DISCORD_TOKEN')
        if not token:
            return Response({'error': 'No bot token'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        url = f'https://discord.com/api/v10/guilds/{guild_id}/channels'
        headers = {'Authorization': f'Bot {token}'}
        res = requests.get(url, headers=headers)
        if res.status_code == 200:
            channels = res.json()
            text_channels = [{'id': str(c['id']), 'name': c['name']} for c in channels if c.get('type') == 0]
            return Response(text_channels)
        return Response({'error': 'Failed to fetch channels'}, status=status.HTTP_400_BAD_REQUEST)
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

        user, created = User.objects.get_or_create(username=user_info.get('id'))
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': {
                'id': user_info.get('id'),
                'username': user_info.get('username'),
                'avatar': user_info.get('avatar'),
            },
            'guilds': admin_guilds,
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        }, status=status.HTTP_200_OK)