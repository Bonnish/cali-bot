from django.urls import path
from .views import GuildConfigView, InfractionsListView, DiscordAuthView, LeaderboardView, AnalyticsView, GuildDashboardStatsView, GlobalUserView, AutoMessagesConfigView, GuildChannelsView

urlpatterns = [
    path('guilds/<int:guild_id>/', GuildConfigView.as_view(), name='guild-config'),
    path('guilds/<int:guild_id>/infractions/', InfractionsListView.as_view(), name='guild-infractions'),
    path('guilds/<int:guild_id>/leaderboard/', LeaderboardView.as_view(), name='guild-leaderboard'),
    path('guilds/<int:guild_id>/analytics/', AnalyticsView.as_view(), name='guild-analytics'),
    path('guilds/<int:guild_id>/dashboard_stats/', GuildDashboardStatsView.as_view(), name='guild-dashboard-stats'),
    path('guilds/<int:guild_id>/auto-messages/', AutoMessagesConfigView.as_view(), name='guild-auto-messages'),
    path('guilds/<int:guild_id>/channels/', GuildChannelsView.as_view(), name='guild-channels'),
    path('users/me/', GlobalUserView.as_view(), name='global-user'),
    path('auth/discord/', DiscordAuthView.as_view(), name='discord-auth'),
]