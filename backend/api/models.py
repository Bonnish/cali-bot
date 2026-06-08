from django.db import models

class Guild(models.Model):
    guild_id = models.BigIntegerField(primary_key=True)
    language = models.CharField(max_length=5, blank=True, null=True)
    prefix = models.CharField(max_length=5, blank=True, null=True)
    xp_enabled = models.BooleanField(blank=True, null=True)
    xp_per_message = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'guilds'


class Infraction(models.Model):
    id = models.AutoField(primary_key=True)
    guild_id = models.BigIntegerField()
    user_id = models.BigIntegerField()
    moderator_id = models.BigIntegerField()
    action_type = models.CharField(max_length=10)
    reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'infractions'


class UserXp(models.Model):
    guild_id = models.BigIntegerField()
    user_id = models.BigIntegerField(primary_key=True)
    xp = models.IntegerField(blank=True, null=True)
    level = models.IntegerField(blank=True, null=True)
    username = models.CharField(max_length=100, blank=True, null=True)
    avatar_url = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'users_xp'

class DailyActivity(models.Model):
    guild_id = models.BigIntegerField(primary_key=True)
    date = models.DateField()
    messages_count = models.IntegerField(default=0)

    class Meta:
        managed = False
        db_table = 'daily_activity'
        unique_together = (('guild_id', 'date'),)

class GuildMember(models.Model):
    guild_id = models.BigIntegerField(primary_key=True)  # Composite key with user_id in DB, django needs a primary key
    user_id = models.BigIntegerField()
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'guild_members'
        unique_together = (('guild_id', 'user_id'),)

class GlobalUser(models.Model):
    user_id = models.BigIntegerField(primary_key=True)
    credits = models.IntegerField(default=0)
    global_xp = models.IntegerField(default=0)
    rankcard_bg = models.CharField(max_length=255, default='default')
    rankcard_color = models.CharField(max_length=7, default='#2ecc71')

    class Meta:
        managed = False
        db_table = 'global_users'

class AutoMessagesConfig(models.Model):
    guild_id = models.BigIntegerField(primary_key=True)
    welcome_enabled = models.BooleanField(default=False)
    welcome_channel_id = models.BigIntegerField(blank=True, null=True)
    welcome_message = models.TextField(blank=True, null=True)
    welcome_image_enabled = models.BooleanField(default=True)
    goodbye_enabled = models.BooleanField(default=False)
    goodbye_channel_id = models.BigIntegerField(blank=True, null=True)
    goodbye_message = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'auto_messages_config'