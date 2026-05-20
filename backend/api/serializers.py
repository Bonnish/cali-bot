from rest_framework import serializers
from .models import Guild, Infraction, UserXp

class GuildSerializer(serializers.ModelSerializer):
    guild_id = serializers.CharField()
    class Meta:
        model = Guild
        fields = '__all__'

class InfractionSerializer(serializers.ModelSerializer):
    guild_id = serializers.CharField()
    user_id = serializers.CharField()
    moderator_id = serializers.CharField()
    class Meta:
        model = Infraction
        fields = '__all__'

class UserXpSerializer(serializers.ModelSerializer):
    guild_id = serializers.CharField()
    user_id = serializers.CharField()
    class Meta:
        model = UserXp
        fields = '__all__'