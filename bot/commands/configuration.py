from discord.ext import commands
from utils.translator import translator
import asyncio
import discord

class Configuration(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    # Configuracion de idioma
    @commands.command()
    @commands.has_permissions(administrator=True)
    async def set_lang(self, ctx, nuevo_idioma: str = None):
        idioma_actual = await asyncio.to_thread(self.bot.db.get_guild_lang, ctx.guild.id)
        idiomas_disponibles = ["es", "en"]
        if nuevo_idioma is None:
            msg = translator.translate("error_missing_lang", lang=idioma_actual)
            return await ctx.send(msg)
        
        nuevo_idioma = nuevo_idioma.lower()

        if nuevo_idioma not in idiomas_disponibles:
            msg = translator.translate(
                "error_invalid_lang", 
                lang=idioma_actual, 
                list=", ".join(idiomas_disponibles)
            )
            return await ctx.send(msg)
        
        await asyncio.to_thread(self.bot.db.set_guild_lang, ctx.guild.id, nuevo_idioma)

        confirmacion = translator.translate("lang_updated", lang=nuevo_idioma)
        await ctx.send(f"✅ {confirmacion}")
        
    @set_lang.error
    async def setlang_error(self, ctx, error):
        if isinstance(error, commands.MissingPermissions):
            idioma = await asyncio.to_thread(self.bot.db.get_guild_lang, ctx.guild.id)
            msg = translator.translate("error_no_perms", lang=idioma)
            await ctx.send(msg)

    # Configuracion de prefix

    @commands.command()
    @commands.has_permissions(administrator=True)
    async def set_prefix(self, ctx, nuevo_prefijo: str = None):
        config = await asyncio.to_thread(self.bot.db.get_guild_config, ctx.guild.id)
        idioma = config["language"]
        prefijo_actual = config.get("prefix", "!")

        if nuevo_prefijo is None:
            msg = translator.translate("prefix_missing", lang=idioma, current=prefijo_actual)
            return await ctx.send(msg)

        if len(nuevo_prefijo) > 5:
            msg = translator.translate("prefix_too_long", lang=idioma)
            return await ctx.send(msg)

        await asyncio.to_thread(self.bot.db.set_guild_prefix, ctx.guild.id, nuevo_prefijo)
        
        msg = translator.translate("prefix_updated", lang=idioma, prefix=nuevo_prefijo)
        await ctx.send(msg)

    # Configuracion de XP

    @commands.command()
    @commands.has_permissions(administrator=True)
    async def toggle_xp(self, ctx, estado: str = None):
        config = await asyncio.to_thread(self.bot.db.get_guild_config, ctx.guild.id)
        idioma = config["language"]

        if estado not in ["on", "off"]:
            return await ctx.send(f"Uso / Usage: `{config.get('prefix', '!')}toggle_xp <on/off>`")

        nuevo_estado = (estado == "on")
        await asyncio.to_thread(self.bot.db.set_xp_status, ctx.guild.id, nuevo_estado)
        
        status_key = "status_enabled" if nuevo_estado else "status_disabled"
        status_translated = translator.translate(status_key, lang=idioma)
        
        msg = translator.translate("xp_status_updated", lang=idioma, status=status_translated)
        await ctx.send(msg)

async def setup(bot):
    await bot.add_cog(Configuration(bot))