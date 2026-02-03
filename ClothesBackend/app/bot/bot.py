import asyncio
import re
import aiohttp
import aiomysql

from aiogram import Bot, Dispatcher
from aiogram.filters import CommandStart
from aiogram.types import (
    Message,
    InlineKeyboardMarkup,
    InlineKeyboardButton,
    WebAppInfo,
    PreCheckoutQuery,
    FSInputFile
)

from config import BOT_TOKEN, API_URL
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.context import FSMContext
from aiogram.fsm.storage.memory import MemoryStorage

# ================== CONFIG ==================

BOT_USERNAME = "CLOTHES_AAA_BOT"
WEBAPP_URL = "https://fiting-room.vercel.app/"

# Константы для старта
START_CAPTION = "<b>Привет! Добро пожаловать в генератор.</b>\n\nНажми на кнопку ниже, чтобы запустить магию нейросетей! 🎆"
START_BUTTON_TEXT = "Начать генерацию 🎆"

ADMIN_TG_IDS = {1008871802, 7296978075}

DB_CONFIG = {
    "host": "fittingtestrt.online",
    "port": 3306,
    "user": "appuser",
    "password": "141722",
    "db": "tryon_db",
    "autocommit": True,
    "charset": "utf8mb4"
}

# ============================================

bot = Bot(BOT_TOKEN)
dp = Dispatcher(storage=MemoryStorage())


class BroadcastState(StatesGroup):
    waiting_message = State()


# --- Вспомогательные функции для рассылки ---

async def fetch_all_tg_ids():
    try:
        conn = await aiomysql.connect(**DB_CONFIG)
        async with conn.cursor() as cur:
            await cur.execute("SELECT tg_id FROM users WHERE tg_id IS NOT NULL")
            rows = await cur.fetchall()
        conn.close()
        return [int(r[0]) for r in rows if r[0]]
    except Exception as e:
        print(f"Ошибка БД: {e}")
        return []


async def broadcast_any(message: Message, text: str, keyboard):
    tg_ids = await fetch_all_tg_ids()
    for tg_id in tg_ids:
        try:
            if message.photo:
                await bot.send_photo(tg_id, message.photo[-1].file_id, caption=text, reply_markup=keyboard,
                                     parse_mode="HTML")
            elif message.video:
                await bot.send_video(tg_id, message.video.file_id, caption=text, reply_markup=keyboard,
                                     parse_mode="HTML")
            else:
                await bot.send_message(tg_id, text=text, reply_markup=keyboard, parse_mode="HTML",
                                       disable_web_page_preview=True)
            await asyncio.sleep(0.05)
        except Exception as e:
            print(f"❌ FAIL {tg_id}: {e}")


def extract_button(text: str):
    btn_text = None
    match = re.search(r"<btn>(.*?)</btn>", text)
    if match:
        btn_text = match.group(1).strip()
        text = re.sub(r"<btn>.*?</btn>", "", text)

    keyboard = None
    if btn_text:
        keyboard = InlineKeyboardMarkup(inline_keyboard=[[
            InlineKeyboardButton(text=btn_text, web_app=WebAppInfo(url=WEBAPP_URL))
        ]])
    return text.strip(), keyboard


# ================== HANDLERS ==================

@dp.message(CommandStart())
async def start_handler(message: Message):
    # Статичная клавиатура с WebApp
    keyboard = InlineKeyboardMarkup(inline_keyboard=[[
        InlineKeyboardButton(text=START_BUTTON_TEXT, web_app=WebAppInfo(url=WEBAPP_URL))
    ]])

    try:
        banner = FSInputFile("bannerSTART.jpg")
        await message.answer_photo(
            photo=banner,
            caption=START_CAPTION,
            reply_markup=keyboard,
            parse_mode="HTML"
        )
    except Exception:
        # Если баннера нет, отправляем просто текстом
        await message.answer(START_CAPTION, reply_markup=keyboard, parse_mode="HTML")


# --- Рассылка ---

@dp.message(lambda m: m.text == "/send")
async def start_broadcast(message: Message, state: FSMContext):
    if message.from_user.id not in ADMIN_TG_IDS:
        return
    await state.set_state(BroadcastState.waiting_message)
    await message.answer(
        "📣 Отправь сообщение для рассылки (текст/фото/видео).\nДобавь тег <btn>Текст кнопки</btn> для WebApp кнопки.")


@dp.message(BroadcastState.waiting_message)
async def process_broadcast_message(message: Message, state: FSMContext):
    if message.from_user.id not in ADMIN_TG_IDS:
        return

    raw_text = message.text or message.caption or ""
    text, keyboard = extract_button(raw_text)

    await state.clear()
    await message.answer("🚀 Рассылка запущена")

    asyncio.create_task(broadcast_any(message, text, keyboard))


# ================== START ==================

async def main():
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())