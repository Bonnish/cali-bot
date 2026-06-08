from rest_framework import serializers
from .models import Guild, Infraction, UserXp, DailyActivity, AutoMessagesConfig

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

class DailyActivitySerializer(serializers.ModelSerializer):
    guild_id = serializers.CharField()
    class Meta:
        model = DailyActivity
        fields = '__all__'

class AutoMessagesConfigSerializer(serializers.ModelSerializer):
    guild_id = serializers.CharField()
    welcome_channel_id = serializers.CharField(allow_null=True, required=False)
    goodbye_channel_id = serializers.CharField(allow_null=True, required=False)
    class Meta:
        model = AutoMessagesConfig
        fields = '__all__'