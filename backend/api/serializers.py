from rest_framework import serializers
from .models import Guild, Infraction, UserXp

class GuildSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guild
        fields = '__all__' # Expone todos los campos (guild_id, language, prefix, etc.)

class InfractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Infraction
        fields = '__all__'

class UserXpSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserXp
        fields = '__all__'