from django.urls import path
from .views import GuildConfigView, InfractionsListView, DiscordAuthView

urlpatterns = [
    path('guilds/<int:guild_id>/', GuildConfigView.as_view(), name='guild-config'),
    path('guilds/<int:guild_id>/infractions/', InfractionsListView.as_view(), name='guild-infractions'),
    path('auth/discord/', DiscordAuthView.as_view(), name='discord-auth'),
]