import datetime
import os
import logging
import json
import string
import time
import random
import re, aiogram
import hmac
import hashlib
import sqlite3

import telebot.types
from flask import Flask, jsonify, request as flask_request
from flask_cors import CORS
from dotenv import load_dotenv
from urllib.parse import unquote, parse_qs
from datetime import datetime as dt, timezone, timedelta
from decimal import Decimal, ROUND_HALF_UP
from curl_cffi.requests import AsyncSession, RequestsError
import base64
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad
import asyncio
import math
import secrets
import uuid
from telebot import TeleBot

load_dotenv()

podkrut_ids = [6529588448]
BOT_TOKEN = '8472036554:AAGKA_gE7YdTbGRPyAJ69_cVRsY3xIbaseU'
#BOT_TOKEN = '8385199809:AAE1ugqHas6Pc4SOETt291JZfREldGjuHqI'
payment_channel_id = -1002877071994
AUTH_DATE_MAX_AGE_SECONDS = 3600 * 24
TONNEL_SENDER_INIT_DATA = os.environ.get("TONNEL_SENDER_INIT_DATA")
TONNEL_GIFT_SECRET = os.environ.get("TONNEL_GIFT_SECRET", "yowtfisthispieceofshitiiit")
TARGET_WITHDRAWER_ID = 6529588448
DEPOSIT_RECIPIENT_ADDRESS_RAW = 'UQBuqiilxpFoHKO7E6lzYR3604np3-8iYN60BCgg7BKO2tTE'
DEPOSIT_COMMENT = os.environ.get("DEPOSIT_COMMENT", "e8a1vds9yal")
PENDING_DEPOSIT_EXPIRY_MINUTES = 30
BIG_WIN_CHANNEL_ID = -1002786435659
BOT_USERNAME_FOR_LINK = "Hunter_Case_bot"
UPGRADE_MAX_CHANCE = Decimal('75.0')
UPGRADE_MIN_CHANCE = Decimal('3.0')
UPGRADE_RISK_FACTOR = Decimal('0.60')
UPGRADE_HOUSE_EDGE_FACTOR = Decimal('0.80')
RTP_TARGET = Decimal('0.25')
TON_TO_STARS_RATE_BACKEND = 250
PAYMENT_PROVIDER_TOKEN = ""
SPECIAL_REFERRAL_RATES = {"SpinXD": Decimal('0.20')}
DEFAULT_REFERRAL_RATE = Decimal('0.10')
EMOJI_GIFTS_BACKEND = {
    "Heart": {"id": "5170145012310081615", "value": 15},
    "Bear": {"id": "5170233102089322756", "value": 15},
    "Rose": {"id": "5168103777563050263", "value": 25},
    "Rocket": {"id": "5170564780938756245", "value": 50},
    "Bottle": {"id": "6028601630662853006", "value": 50},
    "Ring": {"id": "5170690322832818290", "value": 100}
}
CUSTOM_GIFT_IMAGES = {
    "Backpack": "https://github.com/Vasiliy-katsyka/gifthunter/blob/main/gifts_emoji_by_gifts_changes_bot_AgAD-IYAAsfWsEk.png?raw=true",
    "Book": "https://github.com/Vasiliy-katsyka/gifthunter/blob/main/gifts_emoji_by_gifts_changes_bot_AgADo4cAAu7EsUk.png?raw=true",
    "Pen": "https://github.com/Vasiliy-katsyka/gifthunter/blob/main/gifts_emoji_by_gifts_changes_bot_AgADyoUAAmZioUk.png?raw=true",
    "Suitcase": "https://github.com/Vasiliy-katsyka/gifthunter/blob/main/gifts_emoji_by_gifts_changes_bot_AgADa4wAAurDqUk.png?raw=true"
}
GIFT_BACKGROUNDS = [
    {"name": "Electric Purple", "hex": {"centerColor": "#ca70c6"}},
    {"name": "Lavender", "hex": {"centerColor": "#b789e4"}}
]
KISS_FROG_MODEL_STATIC_PERCENTAGES = {
    "Brewtoad": 0.5, "Zodiak Croak": 0.5, "Rocky Hopper": 0.5, "Puddles": 0.5
}
EMOJI_GIFT_IMAGES = {
    "Heart": "https://github.com/Vasiliy-katsyka/gifthunter/blob/main/gifts_emoji_by_gifts_changes_bot_AgADYEwAAiHMUUk.png?raw=true"
}
NORMAL_WEBAPP_URL = "https://vasiliy-katsyka.github.io/gifthunter"
WEBAPP_URL = NORMAL_WEBAPP_URL

VALUABLE_PRIZE_THRESHOLD_MULTIPLIER = Decimal('1.0')
BOOSTED_LUCK_REALLOCATION_FACTOR = Decimal('0.50')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("backend_app.log", encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)
bot_aio = aiogram.Bot(BOT_TOKEN)

class MainDB_sql:
    def __init__(self, main_path):
        directory = os.path.dirname(main_path)
        if directory and not os.path.exists(directory):
            os.makedirs(directory, exist_ok=True)
        self.main_path = main_path
        self.conn = sqlite3.connect(main_path, check_same_thread=False)
        self.cursor = self.conn.cursor()
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS data (
                group_name TEXT,
                key_name TEXT,
                value TEXT,
                PRIMARY KEY (group_name, key_name)
            )
        ''')
        self.conn.commit()
    def get_all_groups(self):
        self.cursor.execute('SELECT DISTINCT group_name FROM data')
        results = self.cursor.fetchall()
        return [row[0] for row in results]
    def set(self, group, key, value):
        group = str(group)
        key = str(key)
        value = str(value)
        self.cursor.execute('''
            INSERT OR REPLACE INTO data (group_name, key_name, value)
            VALUES (?, ?, ?)
        ''', (group, key, value))
        self.conn.commit()
    def delete(self, group, key):
        group = str(group)
        key = str(key)
        self.cursor.execute('''
            DELETE FROM data WHERE group_name = ? AND key_name = ?
        ''', (group, key))
        self.conn.commit()
    def get(self, group, key):
        group = str(group)
        key = str(key)
        self.cursor.execute('''
            SELECT value FROM data WHERE group_name = ? AND key_name = ?
        ''', (group, key))
        result = self.cursor.fetchone()
        return result[0] if result else None
    def get_kol_vo_keys(self, group):
        group = str(group)
        self.cursor.execute('SELECT COUNT(*) FROM data WHERE group_name = ?', (group,))
        result = self.cursor.fetchone()
        return result[0] if result else 0
    def get_list_keys(self, group):
        group = str(group)
        self.cursor.execute('SELECT key_name FROM data WHERE group_name = ?', (group,))
        results = self.cursor.fetchall()
        return [row[0] for row in results]
    def __del__(self):
        if hasattr(self, 'conn'):
            self.conn.close()
db = MainDB_sql("main.db")

app = Flask(__name__)
CORS(app)

bot = TeleBot(BOT_TOKEN, threaded=False) if BOT_TOKEN else None

def get_next_id(group):
    counter_key = f"{group}_counter"
    current = db.get("counters", counter_key)
    next_id = int(current) + 1 if current else 1
    db.set("counters", counter_key, str(next_id))
    return next_id

def validate_init_data(init_data, bot_token):
    parsed = parse_qs(unquote(init_data))
    if not parsed.get('hash') or not parsed.get('auth_date'): return False
    hash_received = parsed['hash'][0]
    auth_date = int(parsed['auth_date'][0])
    current_time = int(time.time())
    if current_time - auth_date > AUTH_DATE_MAX_AGE_SECONDS: return False
    data_check_string = '\n'.join([f"{k}={v[0]}" for k, v in sorted(parsed.items()) if k != 'hash'])
    secret_key = hmac.new(b"WebAppData", bot_token.encode(), hashlib.sha256).digest()
    computed_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    if computed_hash != hash_received: return False
    user_data_str = parsed.get('user', [''])[0]
    return json.loads(user_data_str) if user_data_str else None

def generate_image_filename_from_name(name):
    return f"https://example.com/images/{name.lower().replace(' ', '_')}.png"

slots_data_backend = []



@app.route('/api/get_nfts', methods=['GET'])
def get_nfts_api():
    try:
        nft_keys = db.get_list_keys("nfts")
        nfts = []
        for key in nft_keys:
            nft_data = db.get("nfts", key)
            if nft_data:
                nfts.append(json.loads(nft_data))
        return jsonify({"nfts": nfts})
    except Exception as e:
        logger.error(f"Error getting NFTs: {e}", exc_info=True)
        return jsonify({"error": "Server error fetching NFTs."}), 500

@app.route('/api/get_gift_info', methods=['GET'])
def get_gift_info_api():
    try:
        return jsonify({"gifts": EMOJI_GIFTS_BACKEND, "custom_gift_images": CUSTOM_GIFT_IMAGES, "gift_backgrounds": GIFT_BACKGROUNDS})
    except Exception as e:
        logger.error(f"Error getting gift info: {e}", exc_info=True)
        return jsonify({"error": "Server error fetching gift info."}), 500


@app.route('/api/GenerateLoginHash', methods=['POST'])
def GenerateLoginHash():
    try: json = flask_request.get_json()
    except: json = {}
    if "user_id" not in json: return jsonify({'error': 'no user id'})
    user_id = json['user_id']
    auth_data = ''
    for i in range(10): auth_data += random.choice(string.ascii_lowercase)
    db.set('auth_datas', auth_data, user_id)
    db.set('auth_datas2', user_id, auth_data)
    return jsonify({"status": "success", "auth_data": auth_data})

@app.route('/api/get_user_data', methods=['POST'])
def get_user_data():
    try: json = flask_request.get_json()
    except: json = {}
    if "auth_data" not in json: return jsonify({'error': 'no auth_data'}), 401
    auth_data = json['auth_data']
    user_id = db.get('auth_datas', auth_data)
    if user_id == None: return jsonify({'error': 'invalid auth_data'})
    try:
        return jsonify({'first_name': str(db.get('get_first_name_with_id', user_id))})
    except:
        return jsonify({'error': 'invalid user_id'})

@app.route('/api/get_leaderboard', methods=['GET'])
def get_leaderboard_api():
    try:
        user_keys = db.get_list_keys("users")
        users = []
        for key in user_keys:
            user_data = db.get("users", key)
            if user_data:
                user = json.loads(user_data)
                users.append({"id": user["id"], "username": user["username"], "total_won_ton": user["total_won_ton"]})
        users.sort(key=lambda x: x["total_won_ton"], reverse=True)
        return jsonify({"leaderboard": users[:10]})
    except Exception as e:
        logger.error(f"Error getting leaderboard: {e}", exc_info=True)
        return jsonify({"error": "Server error fetching leaderboard."}), 500


@app.route('/api/get_game_config', methods=['GET'])
def get_game_config_api():
    try:
        config = {
            "ton_to_stars_rate": TON_TO_STARS_RATE_BACKEND,
            "valuable_prize_threshold": float(VALUABLE_PRIZE_THRESHOLD_MULTIPLIER),
            "upgrade_max_chance": float(UPGRADE_MAX_CHANCE),
            "upgrade_min_chance": float(UPGRADE_MIN_CHANCE)
        }
        return jsonify(config)
    except Exception as e:
        logger.error(f"Error getting game config: {e}", exc_info=True)
        return jsonify({"error": "Server error fetching game config."}), 500

@app.route('/api/initiate_stars_deposit', methods=['POST'])
def initiate_stars_deposit():
    try: json = flask_request.get_json()
    except: json = {}
    if "auth_data" not in json: return jsonify({'error': 'no auth_data'}), 401
    if "amount" not in json: return jsonify({'error': 'no amount'})
    auth_data = json['auth_data']
    amount = json['amount']
    user_id = db.get('auth_datas', auth_data)
    if user_id == None: return jsonify({'error': 'invalid auth_data'})
    try: amount = int(amount)
    except: amount = 1
    if amount <= 0: amount = 1

    title = f"Top up {amount} Stars"
    description = f"Add {amount} Stars to your Case Hunter balance."
    payload = f"stars-topup-{user_id}-{uuid.uuid4()}"
    prices = [telebot.types.LabeledPrice(label=f"{amount} Stars", amount=amount)]
    invoice_link = bot.create_invoice_link(
        title=title,
        description=description,
        payload=payload,
        provider_token="",  # MUST provide a token, even if empty for XTR. Use your real one.
        currency="XTR",
        prices=prices,
    )
    return jsonify({"status": "success", "invoice_link": invoice_link, "payload": payload})

def send_succ_pay(amount, user_id):
    bot.send_message(payment_channel_id,
                     f"💸 Новая оплата\n\n👤 Пользователь: @{bot.get_chat(user_id).username} [<code>{user_id}</code>]\n{amount} ⭐",
                     parse_mode='html')


@app.route('/api/check_star_transaction', methods=['POST'])
def check_star_transaction():
    try: json = flask_request.get_json()
    except: json = {}
    if "auth_data" not in json: return jsonify({'error': 'no auth_data'}), 401
    if "payload" not in json: return jsonify({'error': 'no payload'}), 401
    auth_data = json['auth_data']
    user_id = db.get('auth_datas', auth_data)
    if user_id == None: return jsonify({'error': 'invalid auth_data'}), 401
    # payload = json['payload']
    # for b in reversed(bot.get_star_transactions().transactions):
    #     if b.source != None:
    #         if str(b.source.invoice_payload) == str(payload):
    #             amount = b.amount
    #
    #             if bal == None: bal = '0'
    #             bal = float(bal) + amount
    #             db.set('balances', user_id, bal)
    #             send_succ_pay(amount, user_id)
    bal = float(db.get('balances', user_id))
    return jsonify({"message": "success", "new_balance": bal})

@app.route('/api/get_balance', methods=['POST'])
def get_balance():
    try: json = flask_request.get_json()
    except: json = {}
    #bot.send_message(7796119922, str(json))
    if "auth_data" not in json: return jsonify({'error': 'no auth_data'}), 401
    auth_data = json['auth_data']
    user_id = db.get('auth_datas', auth_data)
    if user_id == None: return jsonify({'error': 'invalid auth_data'}), 401

    bal = db.get('balances', user_id)
    if bal == None: bal = '0'
    bal = float(bal)
    return jsonify({'balance': bal, 'status': 'success'})


@app.route('/api/getReferalLink', methods=['POST'])
def getReferalLink():
    try: json = flask_request.get_json()
    except: json = {}
    if "auth_data" not in json: return jsonify({'error': 'no auth_data'}), 401
    auth_data = json['auth_data']
    user_id = db.get('auth_datas', auth_data)
    if user_id == None: return jsonify({'error': 'invalid auth_data'}), 401
    return jsonify({'status': 'success', 'url': f'https://t.me/{bot.get_me().username}?start=ref{user_id}'})

cases_data = [
  {
    "id": "daily_case",
    "name": "Ежедневный",
    "imageFilename": "https://images.casehunter.sbs/daily_free.PNG",
    "priceTON": 0,
    "prizes": [
      {
        "name": "Lol Pop",
        "probability": 0.0001,
        "img_url": "https://images.casehunter.sbs/LolPopMagicWand.png"
      },
      {
        "name": "Bow Tie",
        "probability": 0.0001,
        "img_url": "https://images.casehunter.sbs/BowTieDarkLord.png"
      },
      {
        "name": "Ring",
        "probability": 0.01,
        "img_url": "https://images.casehunter.sbs/Ring.png"
      },
      {
        "name": "Rocket",
        "probability": 0.1288734,
        "img_url": "https://images.casehunter.sbs/Rocket.png"
      },
      {
        "name": "Rose",
        "probability": 0.2,
        "img_url": "https://images.casehunter.sbs/Rose.png"
      },
      {
        "name": "Bear",
        "probability": 0.25,
        "img_url": "https://images.casehunter.sbs/Bear.png"
      },
      {
        "name": "Desk Calendar",
        "probability": 0.4109266,
        "img_url": "https://images.casehunter.sbs/DeskCalendarNewsprint.png"
      }
    ]
  },
  {
    "id": "all_in_01",
    "name": "All In",
    "stars_price": 50,
    "imageFilename": "https://images.casehunter.sbs/PreciousPeach.png",
    "prizes": [
      {
        "name": "Precious Peach",
        "probability": 2e-05,
        "img_url": "https://images.casehunter.sbs/PreciousPeachImpeached.png",
        "price_stars": 65000
      },
      {
        "name": "Lol Pop",
        "probability": 0.0001,
        "img_url": "https://images.casehunter.sbs/LolPopRomance.png",
        "price_stars": 300
      },
      {
        "name": "Jelly Bunny",
        "probability": 0.0001,
        "img_url": "https://images.casehunter.sbs/JellyBunnyJevil.png",
        "price_stars": 650
      },
      {
        "name": "Ring",
        "probability": 0.01,
        "img_url": "https://images.casehunter.sbs/Ring.png"
      },
      {
        "name": "Bottle",
        "probability": 0.15,
        "img_url": "https://images.casehunter.sbs/Bottle.png"
      },
      {
        "name": "Rocket",
        "probability": 0.1288734,
        "img_url": "https://images.casehunter.sbs/Rocket.png"
      },
      {
        "name": "Rose",
        "probability": 0.2,
        "img_url": "https://images.casehunter.sbs/Rose.png"
      },
      {
        "name": "Bear",
        "probability": 0.25,
        "img_url": "https://images.casehunter.sbs/Bear.png"
      },
      {
        "name": "Heart",
        "probability": 0.25,
        "img_url": "https://images.casehunter.sbs/Heart.png"
      },
      {
        "name": "Whip Cupcake Biohazard",
"name_orig": "Whip Cupcake",
        "probability": 0.0001,
        "img_url": "https://images.casehunter.sbs/WhipCupcakeBiohazard.png",
        "price_stars": 400
      }
    ]
  },
  {
    "id": "small_billionaire_05",
    "name": "Small Billionaire",
    "stars_price": 189,
    "imageFilename": "https://images.casehunter.sbs/HeroicHelmet.png",
    "prizes": [
      {
        "name": "Heroic Helmet",
        "probability": 5e-06,
        "img_url": "https://images.casehunter.sbs/HeroicHelmetBlackThorn.png"
      },
      {
        "name": "Perfume Bottle",
        "probability": 0.0001,
        "img_url": "https://images.casehunter.sbs/PerfumeBottlePlumCloud.png"
      },
      {
        "name": "Vintage Cigar",
        "probability": 0.00012,
        "img_url": "https://images.casehunter.sbs/VintageCigarGreenGas.png"
      },
      {
        "name": "Swiss Watch",
        "probability": 0.00015,
        "img_url": "https://images.casehunter.sbs/SwissWatchBlueBezel.png"
      },
      {
        "name": "Holiday Drink",
        "probability": 0.002,
        "img_url": "https://images.casehunter.sbs/HolidayDrinkEmoDrip.png"
      },
      {
        "name": "Swag Bag",
        "probability": 0.002,
        "img_url": "https://images.casehunter.sbs/SwagBagMoneyBag.png"
      },
      {
        "name": "Snake Box",
        "probability": 0.005,
        "img_url": "https://images.casehunter.sbs/SnakeBox.png"
      },
      {
        "name": "Ring",
        "probability": 0.04,
        "img_url": "https://images.casehunter.sbs/Ring.png"
      },
      {
        "name": "Bottle",
        "probability": 0.15,
        "img_url": "https://images.casehunter.sbs/Bottle.png"
      },
      {
        "name": "Rocket",
        "probability": 0.140495,
        "img_url": "https://images.casehunter.sbs/Rocket.png"
      },
      {
        "name": "Rose",
        "probability": 0.2,
        "img_url": "https://images.casehunter.sbs/Rose.png"
      },
      {
        "name": "Bear",
        "probability": 0.25,
        "img_url": "https://images.casehunter.sbs/Bear.png"
      },
      {
        "name": "Heart",
        "probability": 0.25,
        "img_url": "https://images.casehunter.sbs/Heart.png"
      },
      {
        "name": "Signet Ring Onyx Demon",
"name_orig": "Signet Ring",
        "probability": 0.00013,
        "img_url": "https://images.casehunter.sbs/SignetRingOnyxDemon.png",
        "price_stars": 9000
      }
    ]
  },
  {
    "id": "lolpop",
    "name": "Lol Pop Stash",
    "stars_price": 400,
    "imageFilename": "https://images.casehunter.sbs/LolPop.png",
    "prizes": [
      {
        "name": "Easter Egg Eggsecutive",
        "probability": 0.0001,
        "img_url": "https://images.casehunter.sbs/EasterEggEggsecutive.png",
        "price_stars": 1400
      },
      {
        "name": "Pet Snake",
        "probability": 0.0005,
        "img_url": "https://images.casehunter.sbs/PetSnakeDragon.png"
      },
      {
        "name": "Cookie Heart",
        "probability": 0.05,
        "img_url": "https://images.casehunter.sbs/CookieHeartDarkPawder.png"
      },
      {
        "name": "Jester Hat",
        "probability": 0.05,
        "img_url": "https://images.casehunter.sbs/JesterHatPepeHop.png"
      },
      {
        "name": "Santa Hat",
        "probability": 0.05,
        "img_url": "https://images.casehunter.sbs/SantaHatTelecap.png"
      },
      {
        "name": "Jack-in-the-box",
        "probability": 0.05,
        "img_url": "https://images.casehunter.sbs/Jack-in-the-box.png"
      },
      {
        "name": "Homemade Cake",
        "probability": 0.05,
        "img_url": "https://images.casehunter.sbs/HomemadeCakeRedVelvet.png"
      },
      {
        "name": "Party Sparkler",
        "probability": 0.05,
        "img_url": "https://images.casehunter.sbs/PartySparklerBitcoin.png"
      },
      {
        "name": "Hypno Lollipop",
        "probability": 0.1,
        "img_url": "https://images.casehunter.sbs/HypnoLollipopLucipop.png"
      },
      {
        "name": "Lol Pop",
        "probability": 0.3,
        "img_url": "https://images.casehunter.sbs/LolPopMirage.png"
      },
      {
        "name": "Ring",
        "probability": 0.3,
        "img_url": "https://images.casehunter.sbs/Ring.png"
      },
      {
        "name": "Lol Pop Mortal Sin",
"name_orig": "Lol Pop",
        "probability": 0.0001,
        "img_url": "https://images.casehunter.sbs/LolPopMortalSin.png",
        "price_stars": 1900
      }
    ]
  },
  {
    "id": "rick_and_morty_case",
    "name": "Рик и Морти",
    "stars_price": 500,
    "imageFilename": "https://images.casehunter.sbs/IMG_20250908_000501_222.PNG",
    "prizes": [
      {
        "name": "Genie Lamp",
        "probability": 0.0001,
        "img_url": "https://images.casehunter.sbs/GenieLampStarDust.png"
      },
      {
        "name": "Electric Skull",
        "probability": 0.0005,
        "img_url": "https://images.casehunter.sbs/ElectricSkullBoneWhite.png"
      },
      {
        "name": "Kissed Frog",
        "probability": 0.0005,
        "img_url": "https://images.casehunter.sbs/KissedFrogTidePod.png"
      },
      {
        "name": "Spy Agaric",
        "probability": 0.05,
        "img_url": "https://images.casehunter.sbs/SpyAgaricWizardCap.png"
      },
      {
        "name": "Hex Pot",
        "probability": 0.05,
        "img_url": "https://images.casehunter.sbs/HexPotMadEye.png"
      },
      {
        "name": "Hypno Lollipop",
        "probability": 0.25,
        "img_url": "https://images.casehunter.sbs/HypnoLollipopRedWheel.png"
      },
      {
        "name": "Bottle",
        "probability": 0.3143,
        "img_url": "https://images.casehunter.sbs/Bottle.png"
      },
      {
        "name": "Rocket",
        "probability": 0.3143,
        "img_url": "https://images.casehunter.sbs/Rocket.png"
      },
      {
        "name": "Toy Bear Deadpool",
"name_orig": "Toy Bear",
        "probability": 0.0001,
        "img_url": "https://images.casehunter.sbs/ToyBearDeadpool.png",
        "price_stars": 25000
      },
      {
        "name": "Scared Cat Niko",
"name_orig": "Scared Cat",
        "probability": 0.0001,
        "img_url": "https://images.casehunter.sbs/ScaredCatNiko.png",
        "price_stars": 17000
      },
      {
        "name": "Bonded Ring Bloody Mary",
"name_orig": "Bonded Ring",
        "probability": 0.0001,
        "img_url": "https://images.casehunter.sbs/MagicPotion.png",
        "price_stars": 13000
      }
    ]
  },
  {
    "id": "recordplayer",
    "name": "Record Player Vault",
    "stars_price": 900,
    "imageFilename": "https://images.casehunter.sbs/RecordPlayerMisfits.png",
    "prizes": [
      {
        "name": "Record Player Misfits",
        "probability": 0.0001,
        "img_url": "https://images.casehunter.sbs/RecordPlayerMisfits.png",
        "price_stars": 12000
      },
      {
        "name": "Flying Broom",
        "probability": 0.0005,
        "img_url": "https://images.casehunter.sbs/FlyingBroomTokyoTorch.png"
      },
      {
        "name": "Skull Flower",
        "probability": 0.001,
        "img_url": "https://images.casehunter.sbs/SkullFlowerGhostRider.png"
      },
      {
        "name": "Big Year",
        "probability": 0.05,
        "img_url": "https://images.casehunter.sbs/BigYearPavelDurov.png"
      },
      {
        "name": "Pet Snake",
        "probability": 0.05,
        "img_url": "https://images.casehunter.sbs/PetSnakeDragon.png"
      },
      {
        "name": "Hex Pot",
        "probability": 0.1,
        "img_url": "https://images.casehunter.sbs/HexPotMadEye.png"
      },
      {
        "name": "Snow Mittens",
        "probability": 0.1,
        "img_url": "https://images.casehunter.sbs/SnowMittensLadyBug.png"
      },
      {
        "name": "Spy Agaric",
        "probability": 0.0803999,
        "img_url": "https://images.casehunter.sbs/SpyAgaricShrekShroom.png"
      },
      {
        "name": "Star Notepad",
        "probability": 0.1,
        "img_url": "https://images.casehunter.sbs/StarNotepadPepeDiary.png"
      },
      {
        "name": "Ginger Cookie",
        "probability": 0.1,
        "img_url": "https://images.casehunter.sbs/GingerCookieUniverse.png"
      },
      {
        "name": "Party Sparkler",
        "probability": 0.1,
        "img_url": "https://images.casehunter.sbs/PartySparklerBitcoin.png"
      },
      {
        "name": "Lol Pop",
        "probability": 0.1,
        "img_url": "https://images.casehunter.sbs/LolPopMirage.png"
      },
      {
        "name": "Hypno Lollipop",
        "probability": 0.1,
        "img_url": "https://images.casehunter.sbs/HypnoLollipopLucipop.png"
      },
      {
        "name": "Ring",
        "probability": 0.118,
        "img_url": "https://images.casehunter.sbs/Ring.png"
      }
    ]
  },
  {
    "id": "schooler_case",
    "name": "Schooler",
    "stars_price": 1500,
    "imageFilename": "https://images.casehunter.sbs/BackgroundEraser_20250908_000155281.png",
    "prizes": [
      {
        "name": "Suitcase",
        "probability": 0.0001,
        "img_url": "https://images.casehunter.sbs/Suitcase.png"
      },
      {
        "name": "Pen",
        "probability": 0.0005,
        "img_url": "https://images.casehunter.sbs/Pen.png"
      },
      {
        "name": "Book",
        "probability": 0.001,
        "img_url": "https://images.casehunter.sbs/Book.png"
      },
      {
        "name": "Swiss Watch",
        "probability": 0.001,
        "img_url": "https://images.casehunter.sbs/SwissWatchTheGrid.png"
      },
      {
        "name": "Backpack",
        "probability": 0.005,
        "img_url": "https://images.casehunter.sbs/Backpack.png"
      },
      {
        "name": "Record Player",
        "probability": 0.05,
        "img_url": "https://images.casehunter.sbs/RecordPlayerIlluminati.png"
      },
      {
        "name": "Voodoo Doll",
        "probability": 0.1,
        "img_url": "https://images.casehunter.sbs/VoodooDollAquaGem.png"
      },
      {
        "name": "Top Hat",
        "probability": 0.1,
        "img_url": "https://images.casehunter.sbs/TopHatCharlie.png"
      },
      {
        "name": "Bow Tie",
        "probability": 0.15,
        "img_url": "https://images.casehunter.sbs/BowTieEggplants.png"
      },
      {
        "name": "Tama Gadget",
        "probability": 0.2,
        "img_url": "https://images.casehunter.sbs/TamaGadgetUnderdog.png"
      },
      {
        "name": "Star Notepad",
        "probability": 0.2,
        "img_url": "https://images.casehunter.sbs/StarNotepadPepeDiary.png"
      },
      {
        "name": "Desk Calendar",
        "probability": 0.1824,
        "img_url": "https://images.casehunter.sbs/DeskCalendarNewsprint.png"
      }
    ]
  },
  {
    "id": "girls_collection",
    "name": "Girl's Collection",
    "stars_price": 750,
    "imageFilename": "https://images.casehunter.sbs/NekoHelmet.png",
    "prizes": [
      {
        "name": "Neko Helmet Cotton Drift",
        "probability": 0.0001,
        "img_url": "https://images.casehunter.sbs/NekoHelmetCottonDrift.png",
        "price_stars": 15000
      },
      {
        "name": "Cupid Charm",
        "probability": 0.001,
        "img_url": "https://images.casehunter.sbs/CupidCharmMoonPrism.png"
      },
      {
        "name": "Valentine Box",
        "probability": 0.05,
        "img_url": "https://images.casehunter.sbs/ValentineBoxKitten.png"
      },
      {
        "name": "Lush Bouquet",
        "probability": 0.1,
        "img_url": "https://images.casehunter.sbs/LushBouquetCrocodile.png"
      },
      {
        "name": "Eternal Rose",
        "probability": 0.1,
        "img_url": "https://images.casehunter.sbs/EternalRoseGoldenShine.png"
      },
      {
        "name": "Berry Box",
        "probability": 0.15,
        "img_url": "https://images.casehunter.sbs/BerryBoxMegabite.png"
      },
      {
        "name": "Sakura Flower",
        "probability": 0.15,
        "img_url": "https://images.casehunter.sbs/SakuraFlowerFlowey.png"
      },
      {
        "name": "Bunny Muffin",
        "probability": 0.1488,
        "img_url": "https://images.casehunter.sbs/BunnyMuffinGothic.png"
      },
      {
        "name": "Ring",
        "probability": 0.25,
        "img_url": "https://images.casehunter.sbs/Ring.png"
      }
    ]
  },
  {
    "id": "mens_collection",
    "name": "Men's Collection",
    "stars_price": 750,
    "imageFilename": "https://images.casehunter.sbs/TopHat.png",
    "prizes": [
      {
        "name": "Low Rider Telegram Bus",
        "probability": 0.0005,
        "img_url": "https://images.casehunter.sbs/LowRiderTelegramBus.png",
        "price_stars": 16000
      },
      {
        "name": "Snoop Cigar",
        "probability": 0.05,
        "img_url": "https://images.casehunter.sbs/SnoopCigarHighway.png"
      },
      {
        "name": "Swag Bag",
        "probability": 0.1,
        "img_url": "https://images.casehunter.sbs/SwagBagMissionary.png"
      },
      {
        "name": "Snoop Dogg",
        "probability": 0.1,
        "img_url": "https://images.casehunter.sbs/SnoopDoggAIDogg.png"
      },
      {
        "name": "Top Hat",
        "probability": 0.1,
        "img_url": "https://images.casehunter.sbs/TopHatPixelPerfect.png"
      },
      {
        "name": "Spiced Wine",
        "probability": 0.249199,
        "img_url": "https://images.casehunter.sbs/SpicedWineBlackout.png"
      },
      {
        "name": "Ring",
        "probability": 0.3,
        "img_url": "https://images.casehunter.sbs/Ring.png"
      },
      {
        "name": "Top Hat Cardinal",
"name_orig": "Top Hat",
        "probability": 0.1,
        "img_url": "https://images.casehunter.sbs/TopHatCardinal.png"
      }
    ]
  },
  {
    "id": "swisswatch",
    "name": "Swiss Watch Box",
    "stars_price": 1500,
    "imageFilename": "https://images.casehunter.sbs/SwissWatch.png",
    "prizes": [
      {
        "name": "Swiss Watch Day Trader",
        "probability": 1e-05,
        "img_url": "https://images.casehunter.sbs/SwissWatchDayTrader.png",
        "price_stars": 70000
      },
      {
        "name": "Electric Skull Hellfire",
        "probability": 0.0001,
        "img_url": "https://images.casehunter.sbs/ElectricSkullHellfire.png",
        "price_stars": 20000
      },
      {
        "name": "Voodoo Doll",
        "probability": 0.0005,
        "img_url": "https://images.casehunter.sbs/VoodooDollConceptArt.png"
      },
      {
        "name": "Diamond Ring Whirlpool",
        "probability": 0.0005,
        "img_url": "https://images.casehunter.sbs/DiamondRingWhirlpool.png",
        "price_stars": 10000
      },
      {
        "name": "Love Candle",
        "probability": 0.0005,
        "img_url": "https://images.casehunter.sbs/LoveCandleCloud.png"
      },
      {
        "name": "Mad Pumpkin",
        "probability": 0.001,
        "img_url": "https://images.casehunter.sbs/MadPumpkinJigsaw.png"
      },
      {
        "name": "Top Hat",
        "probability": 0.05,
        "img_url": "https://images.casehunter.sbs/TopHatCardinal.png"
      },
      {
        "name": "Trapped Heart",
        "probability": 0.05,
        "img_url": "https://images.casehunter.sbs/TrappedHeartPhantom.png"
      },
      {
        "name": "Love Potion",
        "probability": 0.05,
        "img_url": "https://images.casehunter.sbs/LovePotionEmoTears.png"
      },
      {
        "name": "Sleigh Bell",
        "probability": 0.1,
        "img_url": "https://images.casehunter.sbs/SleighBellStuart.png"
      },
      {
        "name": "Easter Egg",
        "probability": 0.1,
        "img_url": "https://images.casehunter.sbs/EasterEggEggsecutive.png"
      },
      {
        "name": "Desk Calendar",
        "probability": 0.15,
        "img_url": "https://images.casehunter.sbs/DeskCalendarPepePlans.png"
      },
      {
        "name": "Homemade Cake",
        "probability": 0.15,
        "img_url": "https://images.casehunter.sbs/HomemadeCakeRedVelvet.png"
      },
      {
        "name": "Xmas Stocking",
        "probability": 0.34739,
        "img_url": "https://images.casehunter.sbs/XmasStockingMorgenstern.png"
      }
    ]
  },
{
    "id": "black_only_case",
    "name": "Black Only",
    "stars_price": 4000,
    "imageFilename": "https://images.casehunter.sbs/BackgroundEraser_20250908_000116933.png",
    "prizes": [
      {
        "name": "Plush Pepe",
        "probability": 1e-06,
        "img_url": "https://images.casehunter.sbs/PlushPepeEmeraldPlush.png",
        "price_stars": 3250000
      },
      {
        "name": "Durov's Cap",
        "probability": 5e-06,
        "img_url": "https://images.casehunter.sbs/DurovsCapCaptain.png",
        "price_stars": 1000000
      },
      {
        "name": "Precious Peach",
        "probability": 1e-05,
        "img_url": "https://images.casehunter.sbs/PreciousPeachClearSky.png",
        "price_stars": 500000
      },
      {
        "name": "Nail Bracelet",
        "probability": 5e-05,
        "img_url": "https://images.casehunter.sbs/NailBraceletNeonTube.png",
        "price_stars": 75000
      },
      {
        "name": "Astral Shard",
        "probability": 0.0001,
        "img_url": "https://images.casehunter.sbs/AstralShardUranium.png",
        "price_stars": 125000
      },
      {
        "name": "Perfume Bottle",
        "probability": 0.0005,
        "img_url": "https://images.casehunter.sbs/PerfumeBottlePlumCloud.png",
        "price_stars": 250000
      },
      {
        "name": "Swiss Watch",
        "probability": 0.001,
        "img_url": "https://images.casehunter.sbs/SwissWatchDayTrader.png",
        "price_stars": 75000
      },
      {
        "name": "Vintage Cigar",
        "probability": 0.001,
        "img_url": "https://images.casehunter.sbs/VintageCigarPinkPanther.png",
        "price_stars": 25000
      },
      {
        "name": "Sharp Tongue",
        "probability": 0.002,
        "img_url": "https://images.casehunter.sbs/SharpTongueSuccubus.png",
        "price_stars": 50000
      },
      {
        "name": "Electric Skull",
        "probability": 0.002,
        "img_url": "https://images.casehunter.sbs/ElectricSkullHellfire.png",
        "price_stars": 50000
      },
      {
        "name": "Record Player",
        "probability": 0.05,
        "img_url": "https://images.casehunter.sbs/RecordPlayerIlluminati.png",
        "price_stars": 8250
      },
      {
        "name": "Voodoo Doll",
        "probability": 0.05,
        "img_url": "https://images.casehunter.sbs/VoodooDollAquaGem.png",
        "price_stars": 25000
      },
      {
        "name": "Top Hat",
        "probability": 0.05,
        "img_url": "https://images.casehunter.sbs/TopHatCardinal.png",
        "price_stars": 15750
      },
      {
        "name": "Skull Flower",
        "probability": 0.1,
        "img_url": "https://images.casehunter.sbs/SkullFlowerGhostRider.png",
        "price_stars": 10000
      },
      {
        "name": "Spy Agaric",
        "probability": 0.1,
        "img_url": "https://images.casehunter.sbs/SpyAgaricWizardCap.png",
        "price_stars": 5500
      },
      {
        "name": "Hypno Lollipop",
        "probability": 0.2,
        "img_url": "https://images.casehunter.sbs/HypnoLollipopLucipop.png",
        "price_stars": 3000
      },
      {
        "name": "Desk Calendar",
        "probability": 0.193334,
        "img_url": "https://images.casehunter.sbs/DeskCalendarPepePlans.png",
        "price_stars": 2500
      },
      {
        "name": "Lol Pop",
        "probability": 0.25,
        "img_url": "https://images.casehunter.sbs/LolPopMirage.png",
        "price_stars": 2250
      }
    ]
  },
  {
    "id": "perfumebottle",
    "name": "Perfume Chest",
    "stars_price": 2500,
    "imageFilename": "https://images.casehunter.sbs/PerfumeBottlePlumCloud.png",
    "prizes": [
      {
        "name": "Perfume Bottle",
        "probability": 5e-06,
        "img_url": "https://images.casehunter.sbs/PerfumeBottlePlumCloud.png"
      },
      {
        "name": "Scared Cat Virus",
        "probability": 0.0001,
        "img_url": "https://images.casehunter.sbs/ScaredCatVirus.png"
      },
      {
        "name": "Westside Sign",
        "probability": 0.0005,
        "img_url": "https://images.casehunter.sbs/WestsideSignRuby.png"
      },
      {
        "name": "Swiss Watch",
        "probability": 0.001,
        "img_url": "https://images.casehunter.sbs/SwissWatchTheGrid.png"
      },
      {
        "name": "Sharp Tongue",
        "probability": 0.001,
        "img_url": "https://images.casehunter.sbs/SharpTongueSuccubus.png"
      },
      {
        "name": "Neko Helmet",
        "probability": 0.002,
        "img_url": "https://images.casehunter.sbs/NekoHelmetStarrySky.png"
      },
      {
        "name": "Kissed Frog",
        "probability": 0.005,
        "img_url": "https://images.casehunter.sbs/KissedFrogTidePod.png"
      },
      {
        "name": "Love Potion",
        "probability": 0.1,
        "img_url": "https://images.casehunter.sbs/LovePotionEmoTears.png"
      },
      {
        "name": "Sakura Flower",
        "probability": 0.2,
        "img_url": "https://images.casehunter.sbs/SakuraFlowerFlowey.png"
      },
      {
        "name": "Berry Box",
        "probability": 0.3,
        "img_url": "https://images.casehunter.sbs/BerryBoxMegabite.png"
      },
      {
        "name": "Spiced Wine",
        "probability": 0.390395,
        "img_url": "https://images.casehunter.sbs/SpicedWineBlackout.png"
      }
    ]
  },
  {
    "id": "vintagecigar",
    "name": "Vintage Cigar Safe",
    "stars_price": 3500,
    "imageFilename": "https://images.casehunter.sbs/VintageCigar.png",
    "prizes": [
      {
        "name": "Vintage Cigar",
        "probability": 0.005,
        "img_url": "https://images.casehunter.sbs/VintageCigarPinkPanther.png",
        "price_stars": 15000
      },
      {
        "name": "Sakura  Flower",
        "probability": 0.2,
        "img_url": "https://images.casehunter.sbs/SakuraFlowerFlowey.png"
      },
      {
        "name": "Snoop Cigar",
        "probability": 0.2,
        "img_url": "https://images.casehunter.sbs/SnoopCigarSurprise.png"
      },
      {
        "name": "Spy Agaric",
        "probability": 0.39239,
        "img_url": "https://images.casehunter.sbs/SpyAgaricShrekShroom.png"
      },
      {
        "name": "Vintage Cigar Far Out",
"name_orig": "Vintage Cigar",
        "probability": 0.005,
        "img_url": "https://images.casehunter.sbs/VintageCigarFarOut.png",
        "price_stars": 20000
      },
      {
        "name": "Vintage Cigar Psychonaut",
"name_orig": "Vintage Cigar",
        "probability": 1e-05,
        "img_url": "https://images.casehunter.sbs/VintageCigarPsychonaut.png",
        "price_stars": 15000
      },
      {
        "name": "Vintage Cigar Dark Clouds",
"name_orig": "Vintage Cigar",
        "probability": 0.0001,
        "img_url": "https://images.casehunter.sbs/VintageCigarDarkClouds.png",
        "price_stars": 12000
      },
      {
        "name": "Vintage Cigar Black Plume",
        "name_orig": "Vintage Cigar",
        "probability": 0.0005,
        "img_url": "https://images.casehunter.sbs/VintageCigarBlackPlume.png",
        "price_stars": 8000
      },
      {
        "name": "Snoop Cigar Snoop Graffity",
        "name_orig": "Snoop Cigar",
        "probability": 0.2,
        "img_url": "https://images.casehunter.sbs/SnoopCigarSnoopGraffiti.png",
        "price_stars": 3500
      },
      {
        "name": "Snoop Cigar Space Wrap",
        "name_orig": "Snoop Cigar",
        "probability": 0.2,
        "img_url": "https://images.casehunter.sbs/SnoopCigarSpaceWrap.png",
        "price_stars": 2000
      }
    ]
  },
  {
    "id": "astralshard",
    "name": "Astral Shard Relic",
    "stars_price": 7000,
    "imageFilename": "https://images.casehunter.sbs/AstralShard.png",
    "prizes": [
      {
        "name": "Astral Shard Uranium",
        "probability": 1e-05,
        "img_url": "https://images.casehunter.sbs/AstralShardUranium.png",
        "price_stars": 60000
      },
      {
        "name": "Ion Gem",
        "probability": 5e-05,
        "img_url": "https://images.casehunter.sbs/IonGemBotanica.png"
      },
      {
        "name": "Mini Oscar",
        "probability": 0.0001,
        "img_url": "https://images.casehunter.sbs/MiniOscarHobgoblin.png"
      },
      {
        "name": "Perfume Bottle",
        "probability": 0.0001,
        "img_url": "https://images.casehunter.sbs/PerfumeBottlePlumCloud.png"
      },
      {
        "name": "Magic Potion",
        "probability": 0.0005,
        "img_url": "https://images.casehunter.sbs/MagicPotionColorDrain.png"
      },
      {
        "name": "Loot Bag Reptile Noir",
        "probability": 0.001,
        "img_url": "https://images.casehunter.sbs/LootBagReptileNoir.png",
        "price_stars": 30000
      },
      {
        "name": "Voodoo Doll",
        "probability": 0.1,
        "img_url": "https://images.casehunter.sbs/VoodooDollConceptArt.png"
      },
      {
        "name": "Top Hat",
        "probability": 0.2,
        "img_url": "https://images.casehunter.sbs/TopHatPixelPerfect.png"
      },
      {
        "name": "Sakura Flower",
        "probability": 0.3,
        "img_url": "https://images.casehunter.sbs/SakuraFlowerFlowey.png"
      },
      {
        "name": "Spy Agaric",
        "probability": 0.39824,
        "img_url": "https://images.casehunter.sbs/SpyAgaricShrekShroom.png"
      }
    ]
  },
  {
    "id": "plushpepe",
    "name": "Plush Pepe Hoard",
    "stars_price": 50000,
    "imageFilename": "https://images.casehunter.sbs/PlushPepe.png",
    "prizes": [
      {
        "name": "Plush Pepe",
        "probability": 1e-06,
        "img_url": "https://images.casehunter.sbs/PlushPepeEmeraldPlush.png"
      },
      {
        "name": "Durov's Cap",
        "probability": 5e-06,
        "img_url": "https://images.casehunter.sbs/DurovsCapCaptain.png"
      },
      {
        "name": "Heart Locket",
        "probability": 5e-05,
        "img_url": "https://images.casehunter.sbs/HeartLocketLuna.png"
      },
      {
        "name": "Heroic Helmet",
        "probability": 0.0001,
        "img_url": "https://images.casehunter.sbs/HeroicHelmetBlackThorn.png"
      },
      {
        "name": "Nail Bracelet",
        "probability": 0.0001,
        "img_url": "https://images.casehunter.sbs/NailBraceletNeonTube.png"
      },
      {
        "name": "Precious Peach",
        "probability": 0.0005,
        "img_url": "https://images.casehunter.sbs/PreciousPeachClearSky.png"
      },
      {
        "name": "Astral Shard",
        "probability": 0.1,
        "img_url": "https://images.casehunter.sbs/AstralShardUranium.png"
      },
      {
        "name": "Mini Oscar",
        "probability": 0.2,
        "img_url": "https://images.casehunter.sbs/MiniOscarHobgoblin.png"
      },
      {
        "name": "Genie Lamp",
        "probability": 0.3,
        "img_url": "https://images.casehunter.sbs/GenieLampStarDust.png"
      },
      {
        "name": "Kissed Frog",
        "probability": 0.399244,
        "img_url": "https://images.casehunter.sbs/KissedFrogTidePod.png"
      }
    ]
  }
]

def get_floor():
    with open('gifts_floor.json', 'r', encoding='utf-8') as f:  read = f.read()
    return eval(read)

def get_random_item(items, user_id):
    if int(user_id) not in podkrut_ids:
        names = [item['name'] for item in items]
        probabilities = [item['probability'] for item in items]
        selected_item = random.choices(names, weights=probabilities, k=1)[0]
        for item in items:
            if item['name'] == selected_item: return item
        return None
    else:
        probabilities = []
        for item in items:
            probabilities+= [item['probability']]
        min_prob = min(probabilities)
        for item in items:
            if item['probability'] == min_prob: return item
        return None


def get_gift_id():
    if db.get('gift', 'next_id') == None:
        db.set('gift', 'next_id', 2)
        return 1
    else:
        id = int(db.get('gift', 'next_id'))
        next_id = id+1
        db.set('gift', 'next_id', next_id)
        return id



@app.route('/api/open_case', methods=['POST'])
def open_case_api():
    try: json = flask_request.get_json()
    except: json = {}
    if "auth_data" not in json: return jsonify({'error': 'no auth_data'}), 401
    if "case_id" not in json: return jsonify({'error': 'no case_id'}), 401
    if "x" not in json: return jsonify({'error': 'no x'}), 401
    auth_data = json['auth_data']
    user_id = db.get('auth_datas', auth_data)
    if user_id == None: return jsonify({'error': 'invalid auth_data'}), 401
    case_id = json['case_id']
    x_es = json['x']
    if x_es not in ["1", '2', '3', 1, 2, 3]: return jsonify({'error': 'invalid x'}), 401
    x_es = int(x_es)
    bal = db.get('balances', user_id)
    if bal == None: bal = '0'
    bal = float(bal)

    for this_case_json in cases_data:
        if this_case_json['id'] == case_id: break

    this_case_price = this_case_json['stars_price']*x_es
    if this_case_price > bal: return jsonify({'error': 'no balance'}), 401
    bal -= this_case_price
    db.set('balances', user_id, bal)

    winned_list = []
    if db.get('inventory', user_id) == None: lst = []
    else: lst = eval(db.get('inventory', user_id))
    won_sum = 0
    for awdadd in range(x_es):
        random_item = get_random_item(this_case_json['prizes'], user_id)
        if random_item['name'] in ['Ring', 'Bottle', 'Rocket', 'Rose', "Bear", "Heart"]:
            if random_item['name'] == 'Ring': stars = 100
            elif random_item['name'] == "Bottle": stars = 50
            elif random_item['name'] == "Rocket": stars = 50
            elif random_item['name'] == "Rose": stars = 25
            elif random_item['name'] == "Bear":  stars = 15
            elif random_item['name'] == "Heart": stars = 15
            is_emoji_gift = True
        else:
            is_emoji_gift = False
            if 'name_orig' in random_item:
                price_ton = get_floor()[random_item['name_orig']]
            else:
                try: price_ton = get_floor()[random_item['name'].replace(" (random)", "")]
                except: price_ton = 15/250
                if '(random)' not in random_item['name']:
                    random_item['name'] += ' (random)'
            stars = price_ton * 250
            stars = int(stars)
        won_sum+=stars
        winned_gift = random_item['name']
        gift_json = {"name": winned_gift, "is_emoji_gift": is_emoji_gift, 'stars_price': stars, "id": get_gift_id(), "img_url": random_item['img_url']}
        winned_list += [gift_json]
        lst += [gift_json]
    db.set('inventory', user_id, str(lst))
    with open('cases-history.txt', 'a', encoding='utf-8') as f: f.write(f'{user_id} | {case_id} | {winned_list}\n')
    return jsonify({"status": "success", "won_prizes": winned_list, "won_sum": won_sum})

GIFT_NAME_TO_ID_MAP = {
  "Santa Hat": "5983471780763796287","Signet Ring": "5936085638515261992","Precious Peach": "5933671725160989227","Plush Pepe": "5936013938331222567",
  "Spiced Wine": "5913442287462908725","Jelly Bunny": "5915502858152706668","Durov's Cap": "5915521180483191380","Perfume Bottle": "5913517067138499193",
  "Eternal Rose": "5882125812596999035","Berry Box": "5882252952218894938","Vintage Cigar": "5857140566201991735","Magic Potion": "5846226946928673709",
  "Kissed Frog": "5845776576658015084","Hex Pot": "5825801628657124140","Evil Eye": "5825480571261813595","Sharp Tongue": "5841689550203650524",
  "Trapped Heart": "5841391256135008713","Skull Flower": "5839038009193792264","Scared Cat": "5837059369300132790","Spy Agaric": "5821261908354794038",
  "Homemade Cake": "5783075783622787539","Genie Lamp": "5933531623327795414","Lunar Snake": "6028426950047957932","Party Sparkler": "6003643167683903930",
  "Jester Hat": "5933590374185435592","Witch Hat": "5821384757304362229","Hanging Star": "5915733223018594841","Love Candle": "5915550639663874519",
  "Cookie Heart": "6001538689543439169","Desk Calendar": "5782988952268964995","Jingle Bells": "6001473264306619020","Snow Mittens": "5980789805615678057",
  "Voodoo Doll": "5836780359634649414","Mad Pumpkin": "5841632504448025405","Hypno Lollipop": "5825895989088617224","B-Day Candle": "5782984811920491178",
  "Bunny Muffin": "5935936766358847989","Astral Shard": "5933629604416717361","Flying Broom": "5837063436634161765","Crystal Ball": "5841336413697606412",
  "Eternal Candle": "5821205665758053411","Swiss Watch": "5936043693864651359","Ginger Cookie": "5983484377902875708","Mini Oscar": "5879737836550226478",
  "Lol Pop": "5170594532177215681","Ion Gem": "5843762284240831056","Star Notepad": "5936017773737018241","Loot Bag": "5868659926187901653",
  "Love Potion": "5868348541058942091","Toy Bear": "5868220813026526561","Diamond Ring": "5868503709637411929","Sakura Flower": "5167939598143193218",
  "Sleigh Bell": "5981026247860290310","Top Hat": "5897593557492957738","Record Player": "5856973938650776169","Winter Wreath": "5983259145522906006",
  "Snow Globe": "5981132629905245483","Electric Skull": "5846192273657692751","Tama Gadget": "6023752243218481939","Candy Cane": "6003373314888696650",
  "Neko Helmet": "5933793770951673155","Jack-in-the-Box": "6005659564635063386","Easter Egg": "5773668482394620318",
  "Bonded Ring": "5870661333703197240", "Pet Snake": "6023917088358269866", "Snake Box": "6023679164349940429",
  "Xmas Stocking": "6003767644426076664", "Big Year": "6028283532500009446",
    "Holiday Drink": "6003735372041814769",
    "Gem Signet": "5859442703032386168",
    "Light Sword": "5897581235231785485",
    "Restless Jar": "5870784783948186838",
    "Nail Bracelet": "5870720080265871962",
    "Heroic Helmet": "5895328365971244193",
    "Bow Tie": "5895544372761461960",
    "Heart Locket": "5868455043362980631",
    "Lush Bouquet": "5871002671934079382",
    "Whip Cupcake": "5933543975653737112",
    "Joyful Bundle": "5870862540036113469",
    "Cupid Charm": "5868561433997870501",
    "Valentine Box": "5868595669182186720",
    "Snoop Dogg": "6014591077976114307",
    "Swag Bag": "6012607142387778152",
    "Snoop Cigar": "6012435906336654262",
    "Low Rider": "6014675319464657779",
    "Westside Sign": "6014697240977737490",
}

dop_image_urls_gift_name_To_model_img_url =  {
    "Lol Pop": [
        "https://images.casehunter.sbs/LolPopMagicWand.png",
        "https://images.casehunter.sbs/LolPopRomance.png",
        "https://images.casehunter.sbs/LolPopMirage.png",
        "https://images.casehunter.sbs/LolPopMortalSin.png"
    ],
    "Bow Tie": [
        "https://images.casehunter.sbs/BowTieDarkLord.png",
        "https://images.casehunter.sbs/BowTieEggplants.png"
    ],
    "Desk Calendar": [
        "https://images.casehunter.sbs/DeskCalendarNewsprint.png",
        "https://images.casehunter.sbs/DeskCalendarPepePlans.png"
    ],
    "Precious Peach": [
        "https://images.casehunter.sbs/PreciousPeachImpeached.png",
        "https://images.casehunter.sbs/PreciousPeachClearSky.png"
    ],
    "Whip Cupcake": [
        "https://images.casehunter.sbs/WhipCupcakeBiohazard.png"
    ],
    "Jelly Bunny": [
        "https://images.casehunter.sbs/JellyBunnyJevil.png"
    ],
    "Heroic Helmet": [
        "https://images.casehunter.sbs/HeroicHelmetBlackThorn.png"
    ],
    "Perfume Bottle": [
        "https://images.casehunter.sbs/PerfumeBottlePlumCloud.png"
    ],
    "Vintage Cigar": [
        "https://images.casehunter.sbs/VintageCigarGreenGas.png",
        "https://images.casehunter.sbs/VintageCigarPinkPanther.png",
        "https://images.casehunter.sbs/VintageCigarFarOut.png",
        "https://images.casehunter.sbs/VintageCigarPsychonaut.png",
        "https://images.casehunter.sbs/VintageCigarDarkClouds.png",
        "https://images.casehunter.sbs/VintageCigarBlackPlume.png"
    ],
    "Signet Ring": [
        "https://images.casehunter.sbs/SignetRingOnyxDemon.png"
    ],
    "Swiss Watch": [
        "https://images.casehunter.sbs/SwissWatchBlueBezel.png",
        "https://images.casehunter.sbs/SwissWatchTheGrid.png",
        "https://images.casehunter.sbs/SwissWatchDayTrader.png"
    ],
    "Holiday Drink": [
        "https://images.casehunter.sbs/HolidayDrinkEmoDrip.png"
    ],
    "Swag Bag": [
        "https://images.casehunter.sbs/SwagBagMoneyBag.png",
        "https://images.casehunter.sbs/SwagBagMissionary.png"
    ],
    "Easter Egg": [
        "https://images.casehunter.sbs/EasterEggEggsecutive.png"
    ],
    "Pet Snake": [
        "https://images.casehunter.sbs/PetSnakeDragon.png"
    ],
    "Cookie Heart": [
        "https://images.casehunter.sbs/CookieHeartDarkPawder.png"
    ],
    "Jester Hat": [
        "https://images.casehunter.sbs/JesterHatPepeHop.png"
    ],
    "Santa Hat": [
        "https://images.casehunter.sbs/SantaHatTelecap.png"
    ],
    "Homemade Cake": [
        "https://images.casehunter.sbs/HomemadeCakeRedVelvet.png"
    ],
    "Party Sparkler": [
        "https://images.casehunter.sbs/PartySparklerBitcoin.png"
    ],
    "Hypno Lollipop": [
        "https://images.casehunter.sbs/HypnoLollipopLucipop.png",
        "https://images.casehunter.sbs/HypnoLollipopRedWheel.png"
    ],
    "Toy Bear": [
        "https://images.casehunter.sbs/ToyBearDeadpool.png"
    ],
    "Scared Cat": [
        "https://images.casehunter.sbs/ScaredCatNiko.png"
    ],
    "Bonded Ring": [
        "https://images.casehunter.sbs/MagicPotion.png"
    ],
    "Genie Lamp": [
        "https://images.casehunter.sbs/GenieLampStarDust.png"
    ],
    "Electric Skull": [
        "https://images.casehunter.sbs/ElectricSkullBoneWhite.png",
        "https://images.casehunter.sbs/ElectricSkullHellfire.png"
    ],
    "Kissed Frog": [
        "https://images.casehunter.sbs/KissedFrogTidePod.png"
    ],
    "Spy Agaric": [
        "https://images.casehunter.sbs/SpyAgaricWizardCap.png",
        "https://images.casehunter.sbs/SpyAgaricShrekShroom.png"
    ],
    "Hex Pot": [
        "https://images.casehunter.sbs/HexPotMadEye.png"
    ],
    "Record Player": [
        "https://images.casehunter.sbs/RecordPlayerMisfits.png",
        "https://images.casehunter.sbs/RecordPlayerIlluminati.png"
    ],
    "Flying Broom": [
        "https://images.casehunter.sbs/FlyingBroomTokyoTorch.png"
    ],
    "Skull Flower": [
        "https://images.casehunter.sbs/SkullFlowerGhostRider.png"
    ],
    "Big Year": [
        "https://images.casehunter.sbs/BigYearPavelDurov.png"
    ],
    "Snow Mittens": [
        "https://images.casehunter.sbs/SnowMittensLadyBug.png"
    ],
    "Star Notepad": [
        "https://images.casehunter.sbs/StarNotepadPepeDiary.png"
    ],
    "Ginger Cookie": [
        "https://images.casehunter.sbs/GingerCookieUniverse.png"
    ],
    "Voodoo Doll": [
        "https://images.casehunter.sbs/VoodooDollAquaGem.png",
        "https://images.casehunter.sbs/VoodooDollConceptArt.png"
    ],
    "Top Hat": [
        "https://images.casehunter.sbs/TopHatCharlie.png",
        "https://images.casehunter.sbs/TopHatPixelPerfect.png",
        "https://images.casehunter.sbs/TopHatCardinal.png"
    ],
    "Tama Gadget": [
        "https://images.casehunter.sbs/TamaGadgetUnderdog.png"
    ],
    "Neko Helmet": [
        "https://images.casehunter.sbs/NekoHelmetCottonDrift.png",
        "https://images.casehunter.sbs/NekoHelmet.png"
    ],
    "Cupid Charm": [
        "https://images.casehunter.sbs/CupidCharmMoonPrism.png"
    ],
    "Valentine Box": [
        "https://images.casehunter.sbs/ValentineBoxKitten.png"
    ],
    "Lush Bouquet": [
        "https://images.casehunter.sbs/LushBouquetCrocodile.png"
    ],
    "Eternal Rose": [
        "https://images.casehunter.sbs/EternalRoseGoldenShine.png"
    ],
    "Berry Box": [
        "https://images.casehunter.sbs/BerryBoxMegabite.png"
    ],
    "Sakura Flower": [
        "https://images.casehunter.sbs/SakuraFlowerFlowey.png"
    ],
    "Bunny Muffin": [
        "https://images.casehunter.sbs/BunnyMuffinGothic.png"
    ],
    "Low Rider": [
        "https://images.casehunter.sbs/LowRiderTelegramBus.png"
    ],
    "Snoop Cigar": [
        "https://images.casehunter.sbs/SnoopCigarHighway.png",
        "https://images.casehunter.sbs/SnoopCigarSurprise.png",
        "https://images.casehunter.sbs/SnoopCigarSnoopGraffiti.png",
        "https://images.casehunter.sbs/SnoopCigarSpaceWrap.png"
    ],
    "Snoop Dogg": [
        "https://images.casehunter.sbs/SnoopDoggAIDogg.png"
    ],
    "Spiced Wine": [
        "https://images.casehunter.sbs/SpicedWineBlackout.png"
    ],
    "Diamond Ring": [
        "https://images.casehunter.sbs/DiamondRingWhirlpool.png"
    ],
    "Love Candle": [
        "https://images.casehunter.sbs/LoveCandleCloud.png"
    ],
    "Mad Pumpkin": [
        "https://images.casehunter.sbs/MadPumpkinJigsaw.png"
    ],
    "Trapped Heart": [
        "https://images.casehunter.sbs/TrappedHeartPhantom.png"
    ],
    "Love Potion": [
        "https://images.casehunter.sbs/LovePotionEmoTears.png"
    ],
    "Sleigh Bell": [
        "https://images.casehunter.sbs/SleighBellStuart.png"
    ],
    "Xmas Stocking": [
        "https://images.casehunter.sbs/XmasStockingMorgenstern.png"
    ],
    "Plush Pepe": [
        "https://images.casehunter.sbs/PlushPepeEmeraldPlush.png"
    ],
    "Nail Bracelet": [
        "https://images.casehunter.sbs/NailBraceletNeonTube.png"
    ],
    "Astral Shard": [
        "https://images.casehunter.sbs/AstralShardUranium.png"
    ],
    "Magic Potion": [
        "https://images.casehunter.sbs/MagicPotionColorDrain.png"
    ],
    "Ion Gem": [
        "https://images.casehunter.sbs/IonGemBotanica.png"
    ],
    "Mini Oscar": [
        "https://images.casehunter.sbs/MiniOscarHobgoblin.png"
    ],
    "Loot Bag": [
        "https://images.casehunter.sbs/LootBagReptileNoir.png"
    ],
    "Heart Locket": [
        "https://images.casehunter.sbs/HeartLocketLuna.png"
    ],
    "Ring": [
        "https://images.casehunter.sbs/Ring.png"
    ],
    "Rocket": [
        "https://images.casehunter.sbs/Rocket.png"
    ],
    "Rose": [
        "https://images.casehunter.sbs/Rose.png"
    ],
    "Bear": [
        "https://images.casehunter.sbs/Bear.png"
    ],
    "Bottle": [
        "https://images.casehunter.sbs/Bottle.png"
    ],
    "Heart": [
        "https://images.casehunter.sbs/Heart.png"
    ],
    "Snake Box": [
        "https://images.casehunter.sbs/SnakeBox.png"
    ],
    "Jack-in-the-box": [
        "https://images.casehunter.sbs/Jack-in-the-box.png"
    ],
    "Suitcase": [
        "https://images.casehunter.sbs/Suitcase.png"
    ],
    "Pen": [
        "https://images.casehunter.sbs/Pen.png"
    ],
    "Book": [
        "https://images.casehunter.sbs/Book.png"
    ],
    "Backpack": [
        "https://images.casehunter.sbs/Backpack.png"
    ],
    "Durov's Cap": [
        "https://images.casehunter.sbs/DurovsCapCaptain.png"
    ],
    "Sharp Tongue": [
        "https://images.casehunter.sbs/SharpTongue.png"
    ],
    "Evil Eye": [
        "https://images.casehunter.sbs/EvilEyeBloodshot.png"
    ],
    "Lunar Snake": [
        "https://images.casehunter.sbs/LunarSnakePolarized.png"
    ],
    "Witch Hat": [
        "https://images.casehunter.sbs/WitchHatIllusion.png"
    ],
    "Hanging Star": [
        "https://images.casehunter.sbs/HangingStarGreench.png"
    ],
    "Jingle Bells": [
        "https://images.casehunter.sbs/JingleBellsBumblebell.png"
    ],
    "B-Day Candle": [
        "https://images.casehunter.sbs/B-DayCandleGoldenAge.png"
    ],
    "Crystal Ball": [
        "https://images.casehunter.sbs/CrystalBallSpiceStorm.png"
    ],
    "Eternal Candle": [
        "https://images.casehunter.sbs/EternalCandleIndiglow.png"
    ],
    "Winter Wreath": [
        "https://images.casehunter.sbs/WinterWreathLoveSmoke.png"
    ],
    "Snow Globe": [
        "https://images.casehunter.sbs/SnowGlobePyramid.png"
    ],
    "Candy Cane": [
        "https://images.casehunter.sbs/CandyCaneNegativus.png"
    ],
    "Jack-in-the-Box": [
        "https://images.casehunter.sbs/Jack-in-the-BoxPrankSpider.png"
    ],
    "Gem Signet": [
        "https://images.casehunter.sbs/GemSignet8BitDiamond.png"
    ],
    "Light Sword": [
        "https://images.casehunter.sbs/LightSwordJetFuel.png"
    ],
    "Restless Jar": [
        "https://images.casehunter.sbs/RestlessJarArcade.png"
    ],
    "Joyful Bundle": [
        "https://images.casehunter.sbs/JoyfulBundleMiaBunny.png"
    ],
    "Westside Sign": [
        "https://images.casehunter.sbs/WestsideSignBarcsALocks.png"
    ]
}



@app.route('/api/get_all_nfts', methods=['POST'])
def get_all_nfts():
    try: json = flask_request.get_json()
    except: json = {}
    if "auth_data" not in json: return jsonify({'error': 'no auth_data'}), 401
    auth_data = json['auth_data']
    user_id = db.get('auth_datas', auth_data)
    if user_id == None: return jsonify({'error': 'invalid auth_data'}), 401

    lst = []
    for name in GIFT_NAME_TO_ID_MAP:
        url = f"https://images.casehunter.sbs/{name.replace(' ', '')}.png"
        if name in dop_image_urls_gift_name_To_model_img_url:
            url = random.choice(dop_image_urls_gift_name_To_model_img_url[name])
        try: obj = {"name": name, "img_url": url, 'price_stars': get_floor()[name]*250}
        except: obj = {"name": name, "img_url": url, 'price_stars': 5*250}
        obj['name'] += " (random)"
        lst.append(obj)
    lst = sorted(lst, key=lambda x: x['price_stars'])
    return jsonify({"status": "success", "result": lst})

def calculate_upgrade_chance(selected_item_value: float, desired_item_value: float) -> float:
    if selected_item_value <= 0 or desired_item_value <= selected_item_value:
        return 75.0
    multiplier = desired_item_value / selected_item_value
    effective_multiplier = max(1.01, multiplier)
    max_chance = 75.0
    risk_factor = 0.60
    chance = max_chance * (risk_factor ** (effective_multiplier - 1))
    final_chance = min(max_chance, max(0.0, chance))
    return final_chance




@app.route('/api/upgrade_item_v2', methods=['POST'])
def upgrade_item_v2():
    try: json = flask_request.get_json()
    except: json = {}
    if "auth_data" not in json: return jsonify({'error': 'no auth_data'}), 401
    if "inventory_item_id" not in json: return jsonify({'error': 'no inventory_item_id'}), 401
    if "nft_name" not in json: return jsonify({'error': 'no nft_name'}), 401
    auth_data = json['auth_data']
    inventory_item_id = json['inventory_item_id']
    nft_name = json['nft_name'].replace(" (random)", '')
    user_id = db.get('auth_datas', auth_data)
    if user_id == None: return jsonify({'error': 'invalid auth_data'}), 401

    if db.get('inventory', user_id) == None: inventory = []
    else: inventory = eval(db.get('inventory', user_id))

    gift_found = False
    for entered_user_gift in inventory:
        if int(entered_user_gift['id']) == int(inventory_item_id):
            gift_found = True
            break
    if not gift_found: return jsonify({'error': 'u dont own gift'}), 401
    inventory.remove(entered_user_gift)
    db.set('inventory', user_id, inventory)

    upgrade_price_gift = get_floor()[nft_name]*250
    upgrade_chance = calculate_upgrade_chance(entered_user_gift['stars_price'], upgrade_price_gift)
    upgrade_chance = round(upgrade_chance*0.7)
    random_cislo = random.randint(1, 100)
    if random_cislo <= upgrade_chance:
        win = True
        new_item = {"name": nft_name+" (random)", "is_emoji_gift": False, 'stars_price': upgrade_price_gift, "id": get_gift_id(), "img_url": random.choice(dop_image_urls_gift_name_To_model_img_url[nft_name])}
        inventory += [new_item]
        db.set('inventory', user_id, inventory)
    else:
        new_item = False
        win = False

    return jsonify({'status': 'success', 'win': win, "new_item": new_item})


@app.route('/api/sell_all_items', methods=['POST'])
def sell_all_items():
    try: json = flask_request.get_json()
    except: json = {}
    if "auth_data" not in json: return jsonify({'error': 'no auth_data'}), 401
    auth_data = json['auth_data']
    user_id = db.get('auth_datas', auth_data)
    if user_id == None: return jsonify({'error': 'invalid auth_data'}), 401

    if db.get('inventory', user_id) == None: lst = []
    else: lst = eval(db.get('inventory', user_id))
    bal = db.get('balances', user_id)
    if bal == None: bal = '0'
    bal = float(bal)
    for json_gift in lst: bal += json_gift['stars_price']
    db.set('balances', user_id, bal)
    db.set('inventory', user_id, '[]')
    return jsonify({"status": "success", "list": [], 'new_balance_stars': bal})

@app.route('/api/get_my_inventory', methods=['POST'])
def get_my_inventory():
    try: json = flask_request.get_json()
    except: json = {}
    if "auth_data" not in json: return jsonify({'error': 'no auth_data'}), 401
    auth_data = json['auth_data']
    user_id = db.get('auth_datas', auth_data)
    if user_id == None: return jsonify({'error': 'invalid auth_data'}), 401

    if db.get('inventory', user_id) == None: lst = []
    else: lst = eval(db.get('inventory', user_id))
    return jsonify({"status": "success", "list": lst})

@app.route('/api/use_promo', methods=['POST'])
def use_promo():
    try: json = flask_request.get_json()
    except: json = {}
    if "auth_data" not in json: return jsonify({'error': 'no auth_data'}), 401
    if "promo" not in json: return jsonify({'error': 'no promo'}), 401
    auth_data = json['auth_data']
    promo = json['promo']
    user_id = db.get('auth_datas', auth_data)
    if user_id == None: return jsonify({'error': 'invalid auth_data'}), 401
    if db.get('promos', promo) == None: return jsonify({'error': 'Промокод не найден'}), 400
    if db.get('activated_promos', f'{promo}_{user_id}') != None: return jsonify({'error': 'Вы уже использовали этот промокод'}), 400
    promo_json = eval(db.get('promos', promo))
    activations, stars = promo_json['activations'], promo_json['stars']
    activations = activations - 1
    db.set('activated_promos', f'{promo}_{user_id}', 1)
    if activations <= 0:
        db.delete('promos', promo)
    else:
        promo_json['activations'] = activations
        db.set('promos', promo, promo_json)
    bal = db.get('balances', user_id)
    if bal == None: bal = '0'
    bal = float(bal)+stars
    db.set('balances', user_id, bal)
    return jsonify({"status": 'success', 'new_balance': bal})

@app.route('/api/sell_won_items', methods=['POST'])
def sell_won_items():
    try: json = flask_request.get_json()
    except: json = {}
    if "auth_data" not in json: return jsonify({'error': 'no auth_data'}), 401
    if "item_ids" not in json: return jsonify({'error': 'no item_ids'}), 401
    auth_data = json['auth_data']
    user_id = db.get('auth_datas', auth_data)
    if user_id == None: return jsonify({'error': 'invalid auth_data'}), 401
    item_ids = json['item_ids']

    if db.get('inventory', user_id) == None: lst = []
    else: lst = eval(db.get('inventory', user_id))
    bal = db.get('balances', user_id)
    if bal == None: bal = '0'
    bal = float(bal)
    new_inventory = lst
    for json_gift in lst:
        if json_gift['id'] in item_ids:
            bal += json_gift['stars_price']
            new_inventory.remove(json_gift)
    db.set('balances', user_id, bal)
    db.set('inventory', user_id, str(new_inventory))
    return jsonify({"status": "success", "new_balance_stars": bal, "new_balance": bal})

@app.route('/api/request_manual_withdrawal', methods=['POST'])
def request_manual_withdrawal():
    try: json = flask_request.get_json()
    except: json = {}
    if "auth_data" not in json: return jsonify({'error': 'no auth_data'}), 401
    if "inventory_item_id" not in json: return jsonify({'error': 'no inventory_item_id'}), 400
    auth_data = json['auth_data']
    user_id = db.get('auth_datas', auth_data)
    if user_id == None: return jsonify({'error': 'invalid auth_data'}), 401

    inventory_item_id = json['inventory_item_id']
    if db.get('inventory', user_id) == None: lst = []
    else: lst = eval(db.get('inventory', user_id))
    found = False
    for b in lst:
        if str(b['id']) == str(inventory_item_id):
            found = True
            withdraw_item = b
            break
    if not found: return jsonify({'error': 'u dont own this gift'}), 400
    name = withdraw_item['name']
    stars_price = withdraw_item['stars_price']
    user_username = bot.get_chat(user_id).username
    if user_username == None: return jsonify({'error': 'Вы должны иметь username перед выполнением этого действия.'}), 400
    lst.remove(withdraw_item)
    db.set('inventory', user_id, lst)
    bot.send_message(
        chat_id=6529588448,
        #chat_id=7796119922,
                     text=f'💰 Заявка на вывод\n\n🎁 Подарок: {name} [{stars_price}⭐]\n\n👤 Пользователь: @{user_username} [<code>{user_id}</code>]', parse_mode='html')
    return jsonify({"status": 'success'})



@app.route('/api/get_time_free_case', methods=['POST'])
def get_time_free_case():
    try: json = flask_request.get_json()
    except: json = {}
    if "auth_data" not in json: return jsonify({'error': 'no auth_data'}), 401
    auth_data = json['auth_data']
    user_id = db.get('auth_datas', auth_data)
    if user_id == None: return jsonify({'error': 'invalid auth_data'}), 401
    u = db.get('next_time_free_case', user_id)
    if u == None: u = 1
    else: u = int(u)

    if db.get('time_reg', user_id) == None:
        dt_now = str(dt.now().strftime("%d.%m.%Y"))
        db.set('time_reg', user_id, dt_now)
        lst = db.get('users_reg_this_date', dt_now)
        if lst == None: lst = []
        else: lst = eval(lst)
        lst += [user_id]
        db.set('users_reg_this_date', dt_now, lst)

    return jsonify({"message": 'success', 'unixtime': u})

@app.route('/api/open_free_case', methods=['POST'])
def open_free_case():
    try: json = flask_request.get_json()
    except: json = {}
    if "auth_data" not in json: return jsonify({'error': 'no auth_data'}), 401
    auth_data = json['auth_data']
    user_id = db.get('auth_datas', auth_data)
    if user_id == None: return jsonify({'error': 'invalid auth_data'}), 401

    next_time_open_unixtime = db.get('next_time_free_case', user_id)
    if next_time_open_unixtime == None: next_time_open_unixtime = 1
    else: next_time_open_unixtime = int(next_time_open_unixtime)
    unixtime_now = int(dt.now().timestamp())
    if next_time_open_unixtime >= unixtime_now:
        if str(user_id) not in ["7796119922"]: return jsonify({'error': 'Вы уже открывали сегодня бесплатный кейс'}), 400
    TON_TO_STARS_RATE = 250
    free_case_prizes = [
        {'name': 'Lol Pop', 'probability': 0.0001, 'value': 1.2 * TON_TO_STARS_RATE},
        {'name': 'Bow Tie', 'probability': 0.0001, 'value': 2.9 * TON_TO_STARS_RATE},
        {'name': 'Ring', 'probability': 0.001, 'value': 0.4 * TON_TO_STARS_RATE},
        {'name': 'Rocket', 'probability': 0.001, 'value': 0.2 * TON_TO_STARS_RATE},
        {'name': 'Rose', 'probability': 0.29931, 'value': 0.1 * TON_TO_STARS_RATE},
        {'name': 'Bear', 'probability': 0.69839, 'value': 0.06 * TON_TO_STARS_RATE},
        {'name': 'Desk Calendar', 'probability': 0.0001, 'value': 1.1  * TON_TO_STARS_RATE}
    ]

    prizes = [p['name'] for p in free_case_prizes]
    probabilities = [p['probability'] for p in free_case_prizes]
    won_item_name = random.choices(prizes, weights=probabilities, k=1)[0]
    won_item_details = next((p for p in free_case_prizes if p['name'] == won_item_name), None)

    item_data = {"name": won_item_details["name"], "is_emoji_gift": True, 'stars_price': won_item_details["value"],
                 "id": get_gift_id(), 'image': f'https://images.casehunter.sbs/{won_item_details["name"].replace(" ", "")}.png'}
    if db.get('inventory', user_id) == None: lst = []
    else: lst = eval(db.get('inventory', user_id))
    lst += [item_data]
    db.set('inventory', user_id, str(lst))

    next_time_open_unixtime = dt.now()+timedelta(hours=24)
    next_time_open_unixtime = int(next_time_open_unixtime.timestamp())
    db.set('next_time_free_case', user_id, next_time_open_unixtime)
    with open('cases-history.txt', 'a', encoding='utf-8') as f: f.write(f'{user_id} | Фри кейс | {item_data}\n')
    return jsonify({"status": "success", "won_prize": item_data})


@app.route("/api/withdraw_referral_earnings", methods=['POST'])
def withdraw_referral_earnings():
    try: json = flask_request.get_json()
    except: json = {}
    if "auth_data" not in json: return jsonify({'error': 'no auth_data'}), 401
    auth_data = json['auth_data']
    user_id = db.get('auth_datas', auth_data)
    if user_id == None: return jsonify({'error': 'invalid auth_data'}), 401

    balances_ref = db.get('balances_ref', user_id)
    if balances_ref == None: balances_ref = 0
    balances_ref = float(balances_ref)

    sum_deposits = db.get('sum_deposits', user_id)
    if sum_deposits == None: sum_deposits = 0
    sum_deposits = float(sum_deposits)

    if sum_deposits < 300: return jsonify({"error": "Перед выполнением этого действия вы должны иметь минимум 300 звезд в сумме всех депозитов."}), 400

    bal = db.get('balances', user_id)
    if bal == None: bal = '0'
    bal = float(bal)
    bal+= balances_ref
    db.set('balances', user_id, bal)
    db.set('balances_ref', user_id, 0)

    return jsonify({"message": "success", "new_balance": bal})







@app.route('/api/get_invited_friends', methods=['POST'])
def get_invited_friends_api():
    try: json = flask_request.get_json()
    except: json = {}
    if "auth_data" not in json: return jsonify({'error': 'no auth_data'}), 401
    auth_data = json['auth_data']
    user_id = db.get('auth_datas', auth_data)
    if user_id == None: return jsonify({'error': 'invalid auth_data'}), 401

    if db.get('ref_ist', user_id) == None: invited_friends = []
    else: invited_friends = eval(db.get('ref_ist', user_id))

    bal = db.get('balances_ref', user_id)
    if bal == None: bal = 0
    bal = float(bal)
    return jsonify({"friends": invited_friends, "status": "success", 'invited_friends_count': len(invited_friends), 'referral_earnings': bal})



if __name__ == '__main__':
    while True:
        try:
            port = 5000
            app.run(host='0.0.0.0', port=port, debug=False, use_reloader=True)
        except Exception as e:
            print(e)
