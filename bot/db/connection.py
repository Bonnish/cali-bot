import psycopg
from psycopg_pool import ConnectionPool
from config import DB_CONFIG

class Database:
    def __init__(self):
        self.conn_info = f"host={DB_CONFIG['host']} port={DB_CONFIG['port']} dbname={DB_CONFIG['dbname']} user={DB_CONFIG['user']} password={DB_CONFIG['password']}"
        self.pool = ConnectionPool(self.conn_info, open=True)

    # Sistema de Lenguaje

    def get_guild_lang(self, guild_id: int):
        with self.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT language FROM guilds WHERE guild_id = %s", (guild_id,))
                result = cur.fetchone()
                if result: return result[0]
                
                cur.execute("INSERT INTO guilds (guild_id, language) VALUES (%s, %s) ON CONFLICT DO NOTHING", (guild_id, 'en'))
                conn.commit()
                return "en"

    def set_guild_lang(self, guild_id: int, lang: str):
        with self.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO guilds (guild_id, language) VALUES (%s, %s)
                    ON CONFLICT (guild_id) DO UPDATE SET language = EXCLUDED.language
                """, (guild_id, lang))
                conn.commit()

    # Sistema de XP

    def get_guild_config(self, guild_id: int):
        with self.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT language, xp_enabled, xp_per_message 
                    FROM guilds WHERE guild_id = %s
                """, (guild_id,))
                result = cur.fetchone()
                
                if result:
                    return {
                        "language": result[0],
                        "xp_enabled": result[1],
                        "xp_per_message": result[2]
                    }
                return {"language": "en", "xp_enabled": True, "xp_per_message": 20}
        
    def add_xp(self, guild_id: int, user_id: int, points: int):
        with self.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO users_xp (guild_id, user_id, xp) 
                    VALUES (%s, %s, %s)
                    ON CONFLICT (guild_id, user_id) 
                    DO UPDATE SET xp = users_xp.xp + EXCLUDED.xp
                    RETURNING xp, level;
                """, (guild_id, user_id, points))
                result = cur.fetchone()
                conn.commit()
                return result
            
    def get_user_xp(self, guild_id: int, user_id: int):
        with self.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT xp, level FROM users_xp WHERE guild_id = %s AND user_id = %s",
                    (guild_id, user_id)
                )
                return cur.fetchone()
    
    def update_level(self, guild_id: int, user_id: int, nuevo_nivel: int):
        with self.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "UPDATE users_xp SET level = %s WHERE guild_id = %s AND user_id = %s",
                    (nuevo_nivel, guild_id, user_id)
                )
                conn.commit()

    def get_top_users(self, guild_id: int, limit: int = 10):
        with self.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT user_id, xp, level FROM users_xp 
                    WHERE guild_id = %s 
                    ORDER BY xp DESC LIMIT %s
                """, (guild_id, limit))
                return cur.fetchall()