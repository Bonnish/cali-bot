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

    class Meta:
        managed = False
        db_table = 'users_xp'