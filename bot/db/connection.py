import psycopg
from psycopg_pool import ConnectionPool
from config import DB_CONFIG

class Database:
    def __init__(self):
        self.conn_info = f"host={DB_CONFIG['host']} port={DB_CONFIG['port']} dbname={DB_CONFIG['dbname']} user={DB_CONFIG['user']} password={DB_CONFIG['password']}"
        self.pool = ConnectionPool(self.conn_info, open=True)
        self.guild_cache = {}
        
        # Ensure tables exist
        with self.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS global_users (
                        user_id BIGINT PRIMARY KEY,
                        credits INTEGER DEFAULT 0,
                        global_xp INTEGER DEFAULT 0,
                        rankcard_bg VARCHAR(255) DEFAULT 'default',
                        rankcard_color VARCHAR(7) DEFAULT '#2ecc71'
                    )
                """)
                conn.commit()

    # Sistema de Lenguaje

    def get_guild_lang(self, guild_id: int):
        if guild_id in self.guild_cache:
            return self.guild_cache[guild_id].get("language", "en")

        with self.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT language FROM guilds WHERE guild_id = %s", (guild_id,))
                result = cur.fetchone()
                if result: 
                    return result[0]
                
                cur.execute("INSERT INTO guilds (guild_id, language) VALUES (%s, %s) ON CONFLICT DO NOTHING", (guild_id, 'en'))
                conn.commit()
                return "en"

    def set_guild_lang(self, guild_id: int, lang: str):
        if guild_id in self.guild_cache:
            self.guild_cache[guild_id]["language"] = lang

        with self.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO guilds (guild_id, language) VALUES (%s, %s)
                    ON CONFLICT (guild_id) DO UPDATE SET language = EXCLUDED.language
                """, (guild_id, lang))
                conn.commit()

    # Sistema de XP

    def get_guild_config(self, guild_id: int):
        print(f"get_guild_config: {guild_id}", flush=True)
        if guild_id in self.guild_cache:
            print("En cache", flush=True)
            return self.guild_cache[guild_id]

        print("Pidiendo conexion...", flush=True)
        try:
            with self.pool.connection() as conn:
                print("Conexion obtenida", flush=True)
                with conn.cursor() as cur:
                    print("Ejecutando select", flush=True)
                    cur.execute("""
                        SELECT language, prefix, xp_enabled, xp_per_message 
                        FROM guilds WHERE guild_id = %s
                    """, (str(guild_id),))
                    result = cur.fetchone()
                    print(f"Resultado select: {result}", flush=True)
                    
                    config = {"language": "en", "prefix": "!", "xp_enabled": True, "xp_per_message": 20}
                    if result:
                        config = {
                            "language": result[0] if result[0] is not None else "en",
                            "prefix": result[1] if result[1] is not None else "!",
                            "xp_enabled": result[2] if result[2] is not None else True,
                            "xp_per_message": result[3] if result[3] is not None else 20
                        }
                    else:
                        print("Insertando guild...", flush=True)
                        cur.execute("""
                            INSERT INTO guilds (guild_id, guild_name, language, prefix, xp_enabled, xp_per_message)
                            VALUES (%s, 'Unknown', 'en', '!', True, 20)
                            ON CONFLICT DO NOTHING
                        """, (str(guild_id),))
                        print("Commiting...", flush=True)
                        conn.commit()
                    
                    self.guild_cache[guild_id] = config
                    print("Retornando config...", flush=True)
                    return config
        except Exception as e:
            print(f"Error en get_guild_config: {e}", flush=True)
            raise
        
    def add_xp(self, guild_id, user_id, xp_to_add, username, avatar_url):
        with self.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO users_xp (guild_id, user_id, xp, level, username, avatar_url)
                    VALUES (%s, %s, %s, 1, %s, %s)
                    ON CONFLICT (guild_id, user_id)
                    DO UPDATE SET xp = users_xp.xp + EXCLUDED.xp, username = EXCLUDED.username, avatar_url = EXCLUDED.avatar_url
                    RETURNING xp, level
                """, (guild_id, user_id, xp_to_add, username, avatar_url))
                conn.commit()
                return cur.fetchone()

    # Global Users

    def get_global_user(self, user_id):
        with self.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT credits, global_xp, rankcard_bg, rankcard_color FROM global_users WHERE user_id = %s", (user_id,))
                res = cur.fetchone()
                if res:
                    return {"credits": res[0], "global_xp": res[1], "rankcard_bg": res[2], "rankcard_color": res[3]}
                return {"credits": 0, "global_xp": 0, "rankcard_bg": "default", "rankcard_color": "#2ecc71"}
            
    def get_user_xp(self, guild_id: int, user_id: int):
        with self.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT xp, level FROM users_xp WHERE guild_id = %s AND user_id = %s",
                    (str(guild_id), str(user_id))
                )
                return cur.fetchone()
    
    def update_level(self, guild_id: int, user_id: int, nuevo_nivel: int):
        with self.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "UPDATE users_xp SET level = %s WHERE guild_id = %s AND user_id = %s",
                    (nuevo_nivel, str(guild_id), str(user_id))
                )
                conn.commit()

    def get_top_users(self, guild_id: int, limit: int = 10):
        with self.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT user_id, xp, level, username, avatar_url FROM users_xp 
                    WHERE guild_id = %s 
                    ORDER BY xp DESC LIMIT %s
                """, (str(guild_id), limit))
                return cur.fetchall()
            
    def get_auto_messages_config(self, guild_id: int):
        with self.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT welcome_enabled, welcome_channel_id, welcome_message, welcome_image_enabled,
                           goodbye_enabled, goodbye_channel_id, goodbye_message
                    FROM auto_messages_config
                    WHERE guild_id = %s
                """, (str(guild_id),))
                row = cur.fetchone()
                if row:
                    return {
                        "welcome_enabled": row[0],
                        "welcome_channel_id": row[1],
                        "welcome_message": row[2],
                        "welcome_image_enabled": row[3],
                        "goodbye_enabled": row[4],
                        "goodbye_channel_id": row[5],
                        "goodbye_message": row[6]
                    }
                return None

    def set_guild_prefix(self, guild_id: int, prefix: str):
        if guild_id in self.guild_cache:
            self.guild_cache[guild_id]["prefix"] = prefix

        with self.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "UPDATE guilds SET prefix = %s WHERE guild_id = %s",
                    (prefix, str(guild_id))
                )
                conn.commit()

    def set_xp_status(self, guild_id: int, status: bool):
        if guild_id in self.guild_cache:
            self.guild_cache[guild_id]["xp_enabled"] = status

        with self.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "UPDATE guilds SET xp_enabled = %s WHERE guild_id = %s",
                    (status, str(guild_id))
                )
                conn.commit()

    # Sistema de Moderacion

    def add_infraction(self, guild_id: int, user_id: int, moderator_id: int, action_type: str, reason: str):
        with self.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO infractions (guild_id, user_id, moderator_id, action_type, reason)
                    VALUES (%s, %s, %s, %s, %s)
                    """,
                    (str(guild_id), str(user_id), str(moderator_id), action_type, reason)
                )
                conn.commit()

    def get_user_infractions(self, guild_id: int, user_id: int):
        with self.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT action_type, reason, moderator_id, created_at 
                    FROM infractions 
                    WHERE guild_id = %s AND user_id = %s
                    ORDER BY created_at DESC
                    """,
                    (guild_id, user_id)
                )
                return cur.fetchall()

    def log_message_activity(self, guild_id: int):
        from datetime import date
        today = date.today()
        with self.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO daily_activity (guild_id, date, messages_count)
                    VALUES (%s, %s, 1)
                    ON CONFLICT (guild_id, date)
                    DO UPDATE SET messages_count = daily_activity.messages_count + 1
                """, (str(guild_id), today))
                conn.commit()

    # Sistema de Usuarios (Guild Members)

    def register_member_join(self, guild_id: int, user_id: int):
        with self.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO guild_members (guild_id, user_id)
                    VALUES (%s, %s)
                    ON CONFLICT (guild_id, user_id) DO NOTHING
                """, (str(guild_id), str(user_id)))
                conn.commit()