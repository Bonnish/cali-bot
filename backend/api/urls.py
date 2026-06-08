from django.urls import path
from .views import GuildConfigView, InfractionsListView, DiscordAuthView, LeaderboardView, AnalyticsView

urlpatterns = [
    path('guilds/<int:guild_id>/', GuildConfigView.as_view(), name='guild-config'),
    path('guilds/<int:guild_id>/infractions/', InfractionsListView.as_view(), name='guild-infractions'),
    path('guilds/<int:guild_id>/leaderboard/', LeaderboardView.as_view(), name='guild-leaderboard'),
    path('guilds/<int:guild_id>/analytics/', AnalyticsView.as_view(), name='guild-analytics'),
    path('auth/discord/', DiscordAuthView.as_view(), name='discord-auth'),
]