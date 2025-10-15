import asyncio
import datetime
import os
import sqlite3
import logging

from aiogram import Bot, Dispatcher, F
from aiogram.filters import Command, CommandStart, StateFilter
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import StatesGroup, State
from aiogram.types import (
    Message,
    CallbackQuery,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    WebAppInfo,
    PreCheckoutQuery,
    SuccessfulPayment,
)
from aiogram.enums import ParseMode

# --- Конфигурация ---
REQUIRED_CHANNELS = []  # Пример: ['@mychannel1', '@mychannel2']
PAYMENT_CHANNEL_ID = -1002877071994
ADMIN_USER_IDS = [6529588448, 5146625949, 8116972271, 6533915508]
WEBAPP_URL = "https://t.me/Hunter_Case_bot/app"
BOT_TOKEN = '8472036554:AAF7MXqAkyrZFHA2AMCkMsCDYqqCLRKUUZI'
#BOT_TOKEN = '8472036554:AAGKA_gE7YdTbGRPyAJ69_cVRsY3xIbaseU'
#BOT_TOKEN = '8385199809:AAE1ugqHas6Pc4SOETt291JZfREldGjuHqI'

# --- Логирование и инициализация ---

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()


# --- Класс для работы с БД (без изменений) ---
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


# --- Состояния для рассылки ---
class BroadcastState(StatesGroup):
    get_content = State()
    get_text = State()
    get_buttons = State()
    confirm = State()


# --- Состояния для управления заданиями ---
class TaskManagementState(StatesGroup):
    waiting_for_channel = State()
    waiting_for_reward = State()
    waiting_for_name = State()


# --- Вспомогательные функции ---
def generate_date_lists():
    today = datetime.datetime.now()
    date_format = "%d.%m.%Y"
    last_7_days = [(today - datetime.timedelta(days=i)).strftime(date_format) for i in range(7)]
    last_30_days = [(today - datetime.timedelta(days=i)).strftime(date_format) for i in range(30)]
    return sorted(last_7_days), sorted(last_30_days)


def update_user(message: Message):
    user_id = message.from_user.id
    user_info = message.from_user
    if user_info.username:
        db.set('get_id_with_username', user_info.username.lower(), user_id)
        db.set('get_username_with_id', user_id, user_info.username)
    db.set('get_first_name_with_id', user_id, user_info.first_name)

    if db.get('time_reg', user_id) is None:
        dt_now = datetime.datetime.now().strftime("%d.%m.%Y")
        db.set('time_reg', user_id, dt_now)
        lst_str = db.get('users_reg_this_date', dt_now)
        lst = eval(lst_str) if lst_str else []
        lst.append(user_id)
        db.set('users_reg_this_date', dt_now, str(lst))


# --- ОБРАБОТЧИКИ ДЛЯ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ ---

@dp.message(CommandStart())
async def send_welcome(message: Message):
    user_id = message.from_user.id
    tg_user = message.from_user

    try:
        command_parts = message.text.split(' ')
        if len(command_parts) > 1 and command_parts[1].startswith('ref'):
            referral_code = command_parts[1]
            if db.get('get_first_name_with_id', user_id) is None:
                inviter_id = referral_code.replace('ref', '')
                db.set('inviter_of_user', user_id, inviter_id)

                ref_list_str = db.get('ref_ist', inviter_id)
                ref_list = eval(ref_list_str) if ref_list_str else []

                ref_list.append({
                    "user_id": user_id, "id": user_id, "username": tg_user.username,
                    "first_name": tg_user.first_name, "last_name": tg_user.last_name
                })
                db.set('ref_ist', inviter_id, str(ref_list))

                bal_str = db.get('balances_ref', inviter_id)
                bal = float(bal_str) if bal_str else 0
                bal += 5
                db.set('balances_ref', inviter_id, bal)
    except Exception as e:
        logging.error(f"Referral processing error: {e}")

    update_user(message)

    missing_subscriptions = []
    for channel_id in REQUIRED_CHANNELS:
        try:
            chat_member = await bot.get_chat_member(channel_id, user_id)
            if chat_member.status not in ['member', 'administrator', 'creator']:
                missing_subscriptions.append(channel_id)
        except Exception:
            missing_subscriptions.append(channel_id)

    if not missing_subscriptions:
        markup = InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="🎮 Open Case Hunter", url=WEBAPP_URL)]
        ])
        # Для работы с локальным файлом, нужно использовать FSInputFile
        from aiogram.types import FSInputFile
        photo = FSInputFile('menu.jpg')
        await message.answer_photo(
            photo=photo,
            # Используйте file_id или FSInputFile
            caption="Welcome to Case Hunter! 🎁\n\nTap the button below to start!",
            reply_markup=markup
        )
    else:
        buttons = []
        for channel_handle in REQUIRED_CHANNELS:
            channel_name = channel_handle.replace('@', '')
            buttons.append([InlineKeyboardButton(text=f"➡️ Join {channel_name}", url=f"https://t.me/{channel_name}")])
        buttons.append([InlineKeyboardButton(text="✅ Check Subscription", callback_data="check_subscription")])

        markup = InlineKeyboardMarkup(inline_keyboard=buttons)
        await message.answer("Для входа в приложение нужна подписка на наши каналы:", reply_markup=markup)


@dp.callback_query(F.data == 'check_subscription')
async def check_subscription_callback(call: CallbackQuery):
    await call.answer("Checking your subscription status...")
    await send_welcome(call.message)
    await call.message.delete()


@dp.pre_checkout_query()
async def pre_checkout_query_handler(pre_checkout_query: PreCheckoutQuery):
    await bot.answer_pre_checkout_query(pre_checkout_query.id, ok=True)


@dp.message(F.successful_payment)
async def successful_payment_handler(message: Message):
    user_id = message.from_user.id
    amount = message.successful_payment.total_amount  # Сумма в минимальных единицах валюты

    bal_str = db.get('balances', user_id)
    bal = float(bal_str) if bal_str else 0
    db.set('balances', user_id, bal + amount)

    sum_deposits_str = db.get('sum_deposits', user_id)
    sum_deposits = float(sum_deposits_str) if sum_deposits_str else 0
    db.set('sum_deposits', user_id, sum_deposits + amount)

    await bot.send_message(
        PAYMENT_CHANNEL_ID,
        f"💸 Новая оплата\n\n"
        f"👤 Пользователь: @{message.from_user.username} [<code>{user_id}</code>]\n{amount} ⭐\n\n",
        parse_mode=ParseMode.HTML
    )


# --- ОБРАБОТЧИКИ КОМАНД (С ПРОВЕРКОЙ НА АДМИНА ВНУТРИ) ---

# --- Функции для работы с заданиями ---
def get_task_id():
    """Генерация уникального ID для задания"""
    current = db.get("counters", "task_id_counter")
    next_id = int(current) + 1 if current else 1
    db.set("counters", "task_id_counter", str(next_id))
    return next_id


def get_all_tasks():
    """Получить все задания"""
    tasks_str = db.get("system", "tasks_list")
    if tasks_str:
        try:
            return eval(tasks_str)
        except:
            return {}
    return {}


def save_tasks(tasks_dict):
    """Сохранить задания"""
    db.set("system", "tasks_list", str(tasks_dict))


def is_task_completed(user_id, task_id):
    """Проверить, выполнено ли задание пользователем"""
    key = f"{user_id}_{task_id}"
    return db.get("completed_tasks", key) is not None


def mark_task_completed(user_id, task_id):
    """Отметить задание как выполненное"""
    key = f"{user_id}_{task_id}"
    db.set("completed_tasks", key, "1")


def get_task_completions_count(task_id):
    """Получить количество выполнений задания"""
    all_completed_keys = db.get_list_keys("completed_tasks")
    count = 0
    for key in all_completed_keys:
        # Формат ключа: "{user_id}_{task_id}"
        if key.endswith(f"_{task_id}"):
            count += 1
    return count


@dp.message(Command("admin"))
async def admin_panel(message: Message):
    if message.from_user.id not in ADMIN_USER_IDS:
        return  # Игнорируем команду от не-админа
    text = ('Админ\n\n'
            '<code>/add </code>[username] [stars]\n'
            '<code>/set_balance </code>[username] [stars]\n'
            '/rassilka\n'
            '/statistics\n'
            '<code>/create_promo </code>[promo] [activations] [stars]\n'
            '/manage_tasks - Управление заданиями')
    await message.answer(text, parse_mode=ParseMode.HTML)


@dp.message(Command("statistics"))
async def statistics_handler(message: Message):
    if message.from_user.id not in ADMIN_USER_IDS:
        return
    last_7, last_30 = generate_date_lists()
    dt_now = datetime.datetime.now().strftime("%d.%m.%Y")

    kolvo_last_30, kolvo_last_7, kolvo_last_1 = 0, 0, 0

    for date in db.get_list_keys('users_reg_this_date'):
        lst_str = db.get('users_reg_this_date', date)
        users_count = len(eval(lst_str)) if lst_str else 0
        if date == dt_now: kolvo_last_1 += users_count
        if date in last_7: kolvo_last_7 += users_count
        if date in last_30: kolvo_last_30 += users_count

    total_users = len(db.get_list_keys("get_first_name_with_id"))
    text = (f"📈 Статистика\n\n"
            f"<b>👥 Пользователей всего</b>: {total_users}\n\n"
            f"<b>📅 За последние 30 дней</b>: {kolvo_last_30}\n"
            f"<b>📅 За последние 7 дней</b>: {kolvo_last_7}\n"
            f"<b>📅 За сегодня</b>: {kolvo_last_1}")
    await message.answer(text, parse_mode=ParseMode.HTML)


@dp.message(Command("create_promo"))
async def create_promo_handler(message: Message):
    if message.from_user.id not in ADMIN_USER_IDS:
        return
    args = message.text.split()
    if len(args) != 4:
        await message.reply('❌ Не по форме. Используйте: /create_promo [promo] [activations] [stars]')
        return

    _, promo, activations_str, stars_str = args
    if db.get('promos', promo):
        await message.reply('❌ Такой промокод уже существует')
        return
    try:
        activations = int(activations_str)
        stars = int(stars_str)
        if activations <= 0 or stars <= 0: raise ValueError
    except ValueError:
        await message.reply('❌ Количество активаций и звезд должно быть положительным числом.')
        return
    db.set('promos', promo, str({"activations": activations, "stars": stars}))
    await message.reply('✅ Промокод создан.')

@dp.message(Command("set_balance"))
async def set_balance(message: Message):
    if message.from_user.id not in ADMIN_USER_IDS:
        return
    args = message.text.split()
    if len(args) != 3:
        await message.reply('❌ Не по форме. Используйте: /set_balance [username] [stars]')
        return

    _, username, amount_str = args
    username = username.replace('@', '').lower()
    user_id = db.get('get_id_with_username', username)
    if not user_id:
        await message.reply('❌ Пользователя не существует')
        return
    try:
        amount = int(amount_str)
        if amount <= 0: raise ValueError
    except ValueError:
        await message.reply('❌ Количество звезд должно быть положительным числом.')
        return
    db.set('balances', user_id,  amount)
    await message.reply(f'✅ Новый баланс: {amount}')

@dp.message(Command("add"))
async def add_balance_handler(message: Message):
    if message.from_user.id not in ADMIN_USER_IDS:
        return
    args = message.text.split()
    if len(args) != 3:
        await message.reply('❌ Не по форме. Используйте: /add [username] [stars]')
        return

    _, username, amount_str = args
    username = username.replace('@', '').lower()
    user_id = db.get('get_id_with_username', username)
    if not user_id:
        await message.reply('❌ Пользователя не существует')
        return
    try:
        amount = int(amount_str)
        if amount <= 0: raise ValueError
    except ValueError:
        await message.reply('❌ Количество звезд должно быть положительным числом.')
        return

    bal_str = db.get('balances', user_id)
    bal = float(bal_str) if bal_str else 0.0
    db.set('balances', user_id, bal + amount)

    sum_deposits_str = db.get('sum_deposits', user_id)
    sum_deposits = float(sum_deposits_str) if sum_deposits_str else 0.0
    db.set('sum_deposits', user_id, sum_deposits + amount)

    await bot.send_message(
        PAYMENT_CHANNEL_ID,
        f"💸 Новая оплата\n\n"
        f"👤 Пользователь: @{username} [<code>{user_id}</code>]\n{amount} ⭐\n\n"
        f"🥷 Пополнение выдано админом @{message.from_user.username} [<code>{message.from_user.id}</code>]",
        parse_mode=ParseMode.HTML
    )
    await message.reply('✅ Баланс пополнен')


# --- Обработчики рассылки (FSM) ---

@dp.message(Command("rassilka"))
async def start_broadcast(message: Message, state: FSMContext):
    if message.from_user.id not in ADMIN_USER_IDS:
        return
    markup = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="💬 Текст", callback_data="rassilka_text")],
        [
            InlineKeyboardButton(text="🖼️ Фото", callback_data="rassilka_photo"),
            InlineKeyboardButton(text="🎥 Видео", callback_data="rassilka_video")
        ]
    ])
    await message.answer('Выберите тип рассылки', reply_markup=markup)
    await state.set_state(BroadcastState.get_content)


@dp.message(StateFilter("*"), Command("cancel"))
async def cancel_handler(message: Message, state: FSMContext):
    if message.from_user.id not in ADMIN_USER_IDS:
        return
    current_state = await state.get_state()
    if current_state is None:
        return
    await state.clear()
    await message.answer("❌ Действие отменено.")


@dp.callback_query(BroadcastState.get_content)
async def get_broadcast_type(call: CallbackQuery, state: FSMContext):
    if call.from_user.id not in ADMIN_USER_IDS:
        await call.answer()
        return
    await call.message.delete()
    broadcast_type = call.data.split('_')[1]
    await state.update_data(type=broadcast_type)

    if broadcast_type == 'text':
        await call.message.answer('📨 Пришлите текст рассылки (HTML).\n\n/cancel для отмены')
        await state.set_state(BroadcastState.get_text)
    else:
        media_type = "фото" if broadcast_type == 'photo' else 'видео'
        await call.message.answer(f'📨 Пришлите {media_type} для рассылки.\n\n/cancel для отмены')
        # Остаемся в том же состоянии, ожидая фото/видео


@dp.message(BroadcastState.get_content, F.photo | F.video)
async def get_broadcast_content(message: Message, state: FSMContext):
    if message.from_user.id not in ADMIN_USER_IDS:
        return
    file_id = message.photo[-1].file_id if message.photo else message.video.file_id
    await state.update_data(file_id=file_id)
    await message.answer('📨 Теперь пришлите текст рассылки (HTML).\n\n/cancel для отмены')
    await state.set_state(BroadcastState.get_text)


@dp.message(BroadcastState.get_text)
async def get_broadcast_text(message: Message, state: FSMContext):
    if message.from_user.id not in ADMIN_USER_IDS:
        return
    await state.update_data(text=message.html_text)
    await message.answer(
        '💬 Теперь отправьте кнопки.\nФормат: `текст - ссылка`\n\n/out - без кнопок.'
    )
    await state.set_state(BroadcastState.get_buttons)


@dp.message(BroadcastState.get_buttons)
async def get_broadcast_buttons(message: Message, state: FSMContext):
    if message.from_user.id not in ADMIN_USER_IDS:
        return
    buttons = []
    if message.text != '/out':
        for line in message.text.split('\n'):
            if " - " in line:
                text, url = map(str.strip, line.split(' - ', 1))
                if "://" in url:
                    buttons.append([InlineKeyboardButton(text=text, url=url)])

    await state.update_data(buttons=buttons)
    data = await state.get_data()
    markup = InlineKeyboardMarkup(inline_keyboard=buttons) if buttons else None

    # Показываем превью
    if data['type'] == 'text':
        await message.answer(data['text'], reply_markup=markup, parse_mode=ParseMode.HTML)
    elif data['type'] == 'photo':
        await message.answer_photo(data['file_id'], caption=data['text'], reply_markup=markup,
                                   parse_mode=ParseMode.HTML)
    elif data['type'] == 'video':
        await message.answer_video(data['file_id'], caption=data['text'], reply_markup=markup,
                                   parse_mode=ParseMode.HTML)

    confirm_markup = InlineKeyboardMarkup(
        inline_keyboard=[[InlineKeyboardButton(text="✅ Да, начать", callback_data="yes_start_rassilka")]])
    await message.answer("👆 Ваш пост выглядит так.\n\nНачать рассылку?", reply_markup=confirm_markup)
    await state.set_state(BroadcastState.confirm)


@dp.callback_query(BroadcastState.confirm, F.data == 'yes_start_rassilka')
async def confirm_broadcast(call: CallbackQuery, state: FSMContext):
    if call.from_user.id not in ADMIN_USER_IDS:
        await call.answer()
        return
    await call.message.edit_text("✅ Начинаю рассылку...")
    data = await state.get_data()
    await state.clear()

    markup = InlineKeyboardMarkup(inline_keyboard=data['buttons']) if data['buttons'] else None

    success, error = 0, 0
    all_users = db.get_list_keys('get_first_name_with_id')
    total = len(all_users)

    for user_id in all_users:
        try:
            if data['type'] == 'text':
                await bot.send_message(user_id, data['text'], reply_markup=markup, parse_mode=ParseMode.HTML)
            elif data['type'] == 'photo':
                await bot.send_photo(user_id, data['file_id'], caption=data['text'], reply_markup=markup,
                                     parse_mode=ParseMode.HTML)
            elif data['type'] == 'video':
                await bot.send_video(user_id, data['file_id'], caption=data['text'], reply_markup=markup,
                                     parse_mode=ParseMode.HTML)
            success += 1
        except Exception as e:
            logging.warning(f"Failed to send message to {user_id}: {e}")
            error += 1
        await asyncio.sleep(0.1)

    await call.message.answer(
        f'✅ Рассылка завершена\n\n'
        f'👥 Всего пользователей: {total}\n'
        f'✅ Успешно отправлено: {success}\n'
        f'❌ Ошибка отправки: {error}'
    )


# --- Обработчики для управления заданиями (админы) ---

@dp.message(Command("manage_tasks"))
async def manage_tasks(message: Message):
    """Админская панель управления заданиями"""
    if message.from_user.id not in ADMIN_USER_IDS:
        return
    
    tasks = get_all_tasks()
    
    text = "🎯 <b>Управление заданиями</b>\n\n"
    
    if tasks:
        text += "<b>Текущие задания:</b>\n\n"
        for task_id, task_info in tasks.items():
            # Получаем количество выполнений
            completions = get_task_completions_count(task_id)
            
            text += f"ID: <code>{task_id}</code>\n"
            text += f"📝 Название: {task_info['name']}\n"
            text += f"📢 Канал: {task_info['channel_id']}\n"
            text += f"💰 Награда: {task_info['reward']}⭐\n"
            text += f"✅ <b>Выполнило задание: {completions}</b>\n\n"
    else:
        text += "Заданий пока нет.\n\n"
    
    buttons = [
        [InlineKeyboardButton(text="➕ Добавить задание", callback_data="add_task")],
        [InlineKeyboardButton(text="🗑️ Удалить задание", callback_data="delete_task")]
    ]
    markup = InlineKeyboardMarkup(inline_keyboard=buttons)
    
    await message.answer(text, reply_markup=markup, parse_mode=ParseMode.HTML)


@dp.callback_query(F.data == "add_task")
async def start_add_task(call: CallbackQuery, state: FSMContext):
    """Начать добавление задания"""
    if call.from_user.id not in ADMIN_USER_IDS:
        await call.answer()
        return
    
    await call.message.edit_text(
        "📝 <b>Добавление нового задания</b>\n\n"
        "Отправьте ID канала (например: @mychannel или -1001234567890)\n\n"
        "/cancel для отмены",
        parse_mode=ParseMode.HTML
    )
    await state.set_state(TaskManagementState.waiting_for_channel)


@dp.message(TaskManagementState.waiting_for_channel)
async def get_task_channel(message: Message, state: FSMContext):
    """Получить ID канала для задания"""
    if message.from_user.id not in ADMIN_USER_IDS:
        return
    
    channel_id = message.text.strip()
    
    # Проверяем, что бот может получить информацию о канале
    try:
        chat = await bot.get_chat(channel_id)
        channel_name = chat.title or channel_id
        
        await state.update_data(channel_id=channel_id, channel_name=channel_name)
        await message.answer(
            f"✅ Канал найден: <b>{channel_name}</b>\n\n"
            f"Теперь отправьте сумму награды в звездах (целое число)\n\n"
            f"/cancel для отмены",
            parse_mode=ParseMode.HTML
        )
        await state.set_state(TaskManagementState.waiting_for_reward)
    except Exception as e:
        await message.answer(
            f"❌ Ошибка: не удалось получить информацию о канале.\n\n"
            f"Убедитесь, что:\n"
            f"1. ID канала указан правильно\n"
            f"2. Бот добавлен в канал как администратор\n\n"
            f"Попробуйте еще раз или /cancel для отмены"
        )


@dp.message(TaskManagementState.waiting_for_reward)
async def get_task_reward(message: Message, state: FSMContext):
    """Получить награду за задание"""
    if message.from_user.id not in ADMIN_USER_IDS:
        return
    
    try:
        reward = int(message.text.strip())
        if reward <= 0:
            raise ValueError
        
        await state.update_data(reward=reward)
        await message.answer(
            f"💰 Награда установлена: {reward}⭐\n\n"
            f"Теперь отправьте название задания (например: 'Подписаться на наш канал')\n\n"
            f"/cancel для отмены"
        )
        await state.set_state(TaskManagementState.waiting_for_name)
    except ValueError:
        await message.answer(
            "❌ Неверный формат. Введите целое положительное число.\n\n"
            "/cancel для отмены"
        )


@dp.message(TaskManagementState.waiting_for_name)
async def get_task_name(message: Message, state: FSMContext):
    """Получить название задания и сохранить его"""
    if message.from_user.id not in ADMIN_USER_IDS:
        return
    
    task_name = message.text.strip()
    data = await state.get_data()
    
    # Создаем новое задание
    task_id = str(get_task_id())
    tasks = get_all_tasks()
    
    tasks[task_id] = {
        'channel_id': data['channel_id'],
        'reward': data['reward'],
        'name': task_name,
        'type': 'subscribe'
    }
    
    save_tasks(tasks)
    await state.clear()
    
    await message.answer(
        f"✅ <b>Задание успешно создано!</b>\n\n"
        f"ID: <code>{task_id}</code>\n"
        f"📝 Название: {task_name}\n"
        f"📢 Канал: {data['channel_id']}\n"
        f"💰 Награда: {data['reward']}⭐",
        parse_mode=ParseMode.HTML
    )


@dp.callback_query(F.data == "delete_task")
async def delete_task_prompt(call: CallbackQuery):
    """Показать список заданий для удаления"""
    if call.from_user.id not in ADMIN_USER_IDS:
        await call.answer()
        return
    
    tasks = get_all_tasks()
    
    if not tasks:
        await call.answer("❌ Нет заданий для удаления", show_alert=True)
        return
    
    buttons = []
    for task_id, task_info in tasks.items():
        buttons.append([
            InlineKeyboardButton(
                text=f"🗑️ {task_info['name']} (ID: {task_id})",
                callback_data=f"confirm_delete_{task_id}"
            )
        ])
    buttons.append([InlineKeyboardButton(text="❌ Отмена", callback_data="cancel_delete")])
    
    markup = InlineKeyboardMarkup(inline_keyboard=buttons)
    await call.message.edit_text(
        "🗑️ <b>Выберите задание для удаления:</b>",
        reply_markup=markup,
        parse_mode=ParseMode.HTML
    )


@dp.callback_query(F.data.startswith("confirm_delete_"))
async def confirm_delete_task(call: CallbackQuery):
    """Подтвердить удаление задания"""
    if call.from_user.id not in ADMIN_USER_IDS:
        await call.answer()
        return
    
    task_id = call.data.split("_")[2]
    tasks = get_all_tasks()
    
    if task_id in tasks:
        task_info = tasks[task_id]
        del tasks[task_id]
        save_tasks(tasks)
        
        await call.message.edit_text(
            f"✅ <b>Задание удалено</b>\n\n"
            f"Название: {task_info['name']}\n"
            f"ID: <code>{task_id}</code>",
            parse_mode=ParseMode.HTML
        )
        await call.answer("✅ Задание удалено", show_alert=True)
    else:
        await call.answer("❌ Задание не найдено", show_alert=True)


@dp.callback_query(F.data == "cancel_delete")
async def cancel_delete(call: CallbackQuery):
    """Отменить удаление"""
    if call.from_user.id not in ADMIN_USER_IDS:
        await call.answer()
        return
    
    await call.message.edit_text("❌ Удаление отменено")
    await call.answer()


# --- Главная функция для запуска бота ---
async def main():
    await bot.delete_webhook(drop_pending_updates=True)
    while True:
        try:
            await dp.start_polling(bot)
        except Exception as e:
            print(e)


if __name__ == "__main__":
    asyncio.run(main())
