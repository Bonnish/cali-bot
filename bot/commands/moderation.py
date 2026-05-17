import discord
from discord.ext import commands
import asyncio
from utils.translator import translator

class Moderation(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    def check_hierarchy(self, ctx, target: discord.Member):
        if target.id == ctx.author.id:
            return "SELF"
        if target == ctx.guild.owner:
            return "OWNER"
        if target.top_role >= ctx.author.top_role and ctx.author != ctx.guild.owner:
            return "HIERARCHY"
        if target.top_role >= ctx.guild.me.top_role:
            return "BOT_HIERARCHY"
        return "OK"

    async def handle_hierarchy_errors(self, ctx, status, idioma):
        """Maneja las respuestas visuales según el fallo de jerarquía"""
        if status == "SELF":
            await ctx.send(translator.translate("mod_error_self_harm", lang=idioma))
            return False
        if status in ["OWNER", "HIERARCHY", "BOT_HIERARCHY"]:
            await ctx.send(translator.translate("mod_error_hierarchy", lang=idioma))
            return False
        return True

    @commands.command()
    @commands.has_permissions(kick_members=True)
    async def kick(self, ctx, member: discord.Member, *, reason: str = "No reason provided."):
        config = await asyncio.to_thread(self.bot.db.get_guild_config, ctx.guild.id)
        idioma = config["language"]

        status = self.check_hierarchy(ctx, member)
        if not await self.handle_hierarchy_errors(ctx, status, idioma):
            return

        await member.kick(reason=reason)

        await asyncio.to_thread(
            self.bot.db.add_infraction, 
            ctx.guild.id, member.id, ctx.author.id, "KICK", reason
        )

        msg = translator.translate("mod_kick_success", lang=idioma, user=member.display_name, reason=reason)
        await ctx.send(msg)

    @commands.command()
    @commands.has_permissions(ban_members=True)
    async def ban(self, ctx, member: discord.Member, *, reason: str = "No reason provided."):
        config = await asyncio.to_thread(self.bot.db.get_guild_config, ctx.guild.id)
        idioma = config["language"]

        status = self.check_hierarchy(ctx, member)
        if not await self.handle_hierarchy_errors(ctx, status, idioma):
            return

        await member.ban(reason=reason)

        await asyncio.to_thread(
            self.bot.db.add_infraction, 
            ctx.guild.id, member.id, ctx.author.id, "BAN", reason
        )

        msg = translator.translate("mod_ban_success", lang=idioma, user=member.display_name, reason=reason)
        await ctx.send(msg)

    @commands.command()
    @commands.has_permissions(manage_messages=True)
    async def warn(self, ctx, member: discord.Member, *, reason: str = "No reason provided."):
        config = await asyncio.to_thread(self.bot.db.get_guild_config, ctx.guild.id)
        idioma = config["language"]

        status = self.check_hierarchy(ctx, member)
        if not await self.handle_hierarchy_errors(ctx, status, idioma):
            return

        await asyncio.to_thread(
            self.bot.db.add_infraction, 
            ctx.guild.id, member.id, ctx.author.id, "WARN", reason
        )

        emoji_warn = "⚠️"
        texto = f"{emoji_warn} **{member.display_name}**"
        texto += " has been warned." if idioma == "en" else " ha sido advertido."
        texto += f" Reason: `{reason}`"
        
        await ctx.send(texto)

    @kick.error
    @ban.error
    @warn.error
    async def mod_errors(self, ctx, error):
        config = await asyncio.to_thread(self.bot.db.get_guild_config, ctx.guild.id)
        idioma = config["language"]
        prefix = config.get("prefix", "!")

        if isinstance(error, commands.MissingRequiredArgument):
            msg = translator.translate("mod_error_missing_user", lang=idioma, prefix=prefix, command=ctx.command.name)
            return await ctx.send(msg)

        if isinstance(error, commands.MemberNotFound):
            msg = "❌ User not found." if idioma == "en" else "❌ Usuario no encontrado."
            return await ctx.send(msg)

        if isinstance(error, commands.MissingPermissions):
            msg = translator.translate("mod_error_perms", lang=idioma)
            return await ctx.send(msg)

async def setup(bot):
    await bot.add_cog(Moderation(bot))