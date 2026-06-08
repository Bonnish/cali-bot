import discord
from discord.ext import commands
from utils.cards import generate_welcome_card

class AutoMessages(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_member_join(self, member: discord.Member):
        guild = member.guild
        config = self.bot.db.get_auto_messages_config(guild.id)
        if not config:
            return

        if config.get('welcome_enabled') and config.get('welcome_channel_id'):
            channel = guild.get_channel(int(config['welcome_channel_id']))
            if channel:
                msg = config.get('welcome_message', '¡Hola {user}, bienvenido a {server}!')
                msg = msg.replace('{user}', member.mention).replace('{server}', guild.name)
                
                if config.get('welcome_image_enabled'):
                    avatar_url = str(member.display_avatar.url)
                    card_file = await generate_welcome_card(
                        user_name=member.name,
                        avatar_url=avatar_url,
                        server_name=guild.name,
                        member_count=guild.member_count
                    )
                    await channel.send(content=msg, file=card_file)
                else:
                    await channel.send(content=msg)

    @commands.Cog.listener()
    async def on_member_remove(self, member: discord.Member):
        guild = member.guild
        config = self.bot.db.get_auto_messages_config(guild.id)
        if not config:
            return

        if config.get('goodbye_enabled') and config.get('goodbye_channel_id'):
            channel = guild.get_channel(int(config['goodbye_channel_id']))
            if channel:
                msg = config.get('goodbye_message', '¡{user} nos ha dejado!')
                msg = msg.replace('{user}', f"**{member.name}**")
                await channel.send(content=msg)

    @commands.command()
    @commands.has_permissions(administrator=True)
    async def testwelcome(self, ctx):
        """Simulates a member joining to test the welcome message."""
        await self.on_member_join(ctx.author)
        await ctx.send("✅ Prueba de bienvenida ejecutada.")

async def setup(bot):
    await bot.add_cog(AutoMessages(bot))
