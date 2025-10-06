// Global Constants and Data Definitions
const IMAGE_BASE_URL = 'https://images.casehunter.sbs/';
const API_BASE_URL = 'https://casehunter.sbs';
const BOT_USERNAME = 'Hunter_Case_bot';
const TON_TO_STARS_RATE = 250;
const STAR_ICON_URL = 'https://images.casehunter.sbs/DMJTGStarsEmoji_AgADZxIAAjoUmVI.png';
const MINI_APP_NAME = 'app';
const TON_COIN_FULL_URL = 'https://case-bot.com/images/actions/ton.svg';

const currentUser = {
    id: null, username: null, first_name: 'User', last_name: null,
    walletAddress: null, walletAddressRaw: null, tonBalance: 0.00, starBalance: 0,
    inventory: [], referralCode: null, referralEarningsPending: 0, total_won_ton: 0,
    invited_friends_count: 0,
    photo_url: null,
    last_free_case_opened: null,
    next_free_case_time: null // <-- ДОБАВЛЕНО НОВОЕ ПОЛЕ
};
// --- In your <script> tag in index.html ---

const giftDepositModal = document.getElementById('gift-deposit-modal');
const openGiftDepositBtn = document.getElementById('initiate-deposit-gifts-button');
const closeGiftDepositBtn = document.getElementById('close-gift-deposit-modal-button');
const giftPricesListContainer = document.getElementById('gift-prices-list');
let allGiftsForDeposit = [];




const EMOJI_GIFTS = {
    "Heart": {
        id: "5170145012310081615",
        value: 15, // Star value
        imageFilename: "https://images.casehunter.sbs/gifts_emoji_by_gifts_changes_bot_AgADYEwAAiHMUUk.png?raw=true"
    },
    "Bear": {
        id: "5170233102089322756",
        value: 15, // Star value
        imageFilename: "https://images.casehunter.sbs/gifts_emoji_by_gifts_changes_bot_AgADomAAAvRzSEk.png?raw=true"
    },
    "Rose": {
        id: "5168103777563050263",
        value: 25, // Star value
        imageFilename: "https://images.casehunter.sbs/gifts_emoji_by_gifts_changes_bot_AgADslsAAqCxSUk.png?raw=true"
    },
    "Rocket": {
        id: "5170564780938756245",
        value: 50, // Star value
        imageFilename: "https://images.casehunter.sbs/gifts_emoji_by_gifts_changes_bot_AgAD9lAAAsBFUUk.png?raw=true"
    },
    "Bottle": {
        id: "6028601630662853006",
        value: 50, // Star value
        imageFilename: "https://images.casehunter.sbs/gifts_emoji_by_gifts_changes_bot_AgADA2cAAm0PqUs.png?raw=true"
    },
    "Ring": {
        id: "5170690322832818290",
        value: 100,
        imageFilename: "https://images.casehunter.sbs/IMG_20250901_162059_844.png?raw=true"
    }
};
let currentOpenCaseOrSlot = null;
let selectedCaseMultiplier = 1;
let itemToWithdraw = null;
const upgradeChances = { 1.5: 50, 2: 35, 3: 25, 5: 15, 10: 8, 20: 3 };
let lastWonPrizesForOverlay = [];
let selectedUpgradeMultiplier = 1.5;
let starsDepositPayload = null; // Store payload from /api/initiate_stars_deposit
let spinAnimationTimeoutOuter = null;

let selectedItemForUpgrade = null;
let desiredItemForUpgrade = null;
let calculatedUpgradeMultiplier = 0;
let calculatedUpgradeChance = 0;
let currentUpgradePickerType = null;
let allAppGiftsForUpgrade = [];

const lottieAnimationUrls = {
    'all_in_01': 'https://images.casehunter.sbs/all_in_01.json', 'small_billionaire_05': 'https://images.casehunter.sbs/small_billionaire_05.json', 'lolpop': 'https://images.casehunter.sbs/lolpop.json', 'recordplayer': 'https://images.casehunter.sbs/recordplayer.json', 'girls_collection': 'https://images.casehunter.sbs/girls_collection.json', 'mens_collection': 'https://images.casehunter.sbs/mens_collection.json', 'swisswatch': 'https://images.casehunter.sbs/swisswatch.json', 'kissedfrog': 'https://images.casehunter.sbs/kissedfrog.json', 'perfumebottle': 'https://images.casehunter.sbs/perfumebottle.json', 'vintagecigar': 'https://images.casehunter.sbs/vintagecigar.json', 'astralshard': 'https://images.casehunter.sbs/astralshard.json', 'plushpepe': 'https://images.casehunter.sbs/plushpepe.json'
};
const limitedCaseIds = ['schooler_case', 'black_only_case', 'rick_and_morty_case'];

const bannersData = [
    {
        name: 'Subscribe',
        image: 'https://images.casehunter.sbs/IMG_20250904_214550_415.jpg',
        url: 'https://t.me/CaseHunterNews'
    },
    {
        name: 'Case Promo',
        image: 'https://images.casehunter.sbs/IMG_20250904_214550_024.jpg',
        url: null // No link for this banner
    }
];
let bannerCurrentIndex = 0;
let bannerAutoSwipeInterval;
let bannerTouchStartX = 0;
let bannerTouchMoveX = 0;

// In index.html <script> tag, near the top
const BG_COLORS_MAP = {
    "Electric Purple": "#ca70c6", "Lavender": "#b789e4", "Cyberpunk": "#858ff3",
    "Electric Indigo": "#a980f3", "Neon Blue": "#7596f9", "Navy Blue": "#6c9edd",
    "Sapphire": "#58a3c8", "Sky Blue": "#58b4c8", "Azure Blue": "#5db1cb",
    "Pacific Cyan": "#5abea6", "Aquamarine": "#60b195", "Pacific Green": "#6fc793",
    "Emerald": "#78c585", "Mint Green": "#7ecb82", "Malachite": "#95b457",
    "Shamrock Green": "#8ab163", "Lemongrass": "#aeb85a", "Light Olive": "#c2af64",
    "Satin Gold": "#bf9b47", "Pure Gold": "#ccab41", "Amber": "#dab345",
    "Caramel": "#d09932", "Orange": "#d19a3a", "Carrot Juice": "#db9867",
    "Coral Red": "#da896b", "Persimmon": "#e7a75a", "Strawberry": "#dd8e6f",
    "Raspberry": "#e07b85", "Mystic Pearl": "#d08b6d", "Fandango": "#e28ab6",
    "Dark Lilac": "#b17da5", "English Violet": "#b186bb", "Moonstone": "#7eb1b4",
    "Pine Green": "#6ba97c", "Hunter Green": "#8fae78", "Pistachio": "#97b07c",
    "Khaki Green": "#adb070", "Desert Sand": "#b39f82", "Cappuccino": "#b1907e",
    "Rosewood": "#b77a77", "Ivory White": "#bab6b1", "Platinum": "#b2aea7",
    "Roman Silver": "#a3a8b5", "Steel Grey": "#97a2ac", "Silver Blue": "#80a4b8",
    "Burgundy": "#a35e66", "Indigo Dye": "#537991", "Midnight Blue": "#5c6985",
    "Onyx Black": "#4d5254", "Battleship Grey": "#8c8c85", "Purple": "#ae6cae",
    "Grape": "#9d74c1", "Cobalt Blue": "#6088cf", "French Blue": "#5c9bc4",
    "Turquoise": "#5ec0b8", "Jade Green": "#55c49c", "Copper": "#d08656",
    "Chestnut": "#be6f54", "Chocolate": "#a46e58", "Marine Blue": "#4e689c",
    "Tactical Pine": "#44826b", "Gunship Green": "#558a65", "Dark Green": "#516341",
    "Seal Brown": "#664d45", "Rifle Green": "#64695c", "Ranger Green": "#5f7849",
    "Camo Green": "#75944d", "Feldgrau": "#899288", "Gunmetal": "#4c5d63",
    "Deep Cyan": "#31b5aa", "Mexican Pink": "#e36692", "Tomato": "#e6793e",
    "Fire Engine": "#f05f4f", "Celtic Blue": "#45b8ed", "Old Gold": "#b58d38",
    "Burnt Sienna": "#d66f3c", "Carmine": "#e0574a", "Mustard": "#d4980d",
    "French Violet": "#c260e6"
};



const GIFT_NAME_TO_ID_MAP = {
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
};

// --- НОВАЯ ФУНКЦИЯ ДЛЯ ЗАГРУЗКИ ВРЕМЕНИ БЕСПЛАТНОГО КЕЙСА ---
async function fetchFreeCaseTime() {
    const authData = localStorage.getItem('auth_data');
    if (!authData) return;

    try {
        const response = await apiRequest('/api/get_time_free_case', 'POST', { auth_data: authData });
        if (response.message === 'success' && typeof response.unixtime === 'number') {
            currentUser.next_free_case_time = response.unixtime;
        }
    } catch (error) {
        console.error("Could not fetch free case time:", error);
    }
}

const UPDATED_FLOOR_PRICES_FRONTEND = {
    'Plush Pepe': 3889.0,
    'Neko Helmet': 22.7,
    'Sharp Tongue': 29.8,
    "Durov's Cap": 609.0,
    'Voodoo Doll': 13.9,
    'Vintage Cigar': 20.0,
    'Astral Shard': 80.0,
    'Scared Cat': 36.0,
    'Swiss Watch': 29.0,
    'Perfume Bottle': 71.0,
    'Precious Peach': 246.0,
    'Toy Bear': 16.3,
    'Genie Lamp': 46.0,
    'Loot Bag': 80.0,
    'Kissed Frog': 24.0,
    'Electric Skull': 24.9,
    'Diamond Ring': 14.0,
    'Mini Oscar': 74.5,
    'Party Sparkler': 1.7,
    'Homemade Cake': 1.5,
    'Cookie Heart': 1.6,
    'Jack-in-the-box': 1.7,
    'Skull Flower': 5.7,
    'Lol Pop': 1.2,
    'Hypno Lollipop': 1.78,
    'Desk Calendar': 1.1,
    'B-Day Candle': 1.1,
    'Record Player': 9.1,
    'Jelly Bunny': 2.6,
    'Tama Gadget': 1.6,
    'Snow Globe': 2.1,
    'Eternal Rose': 12.0,
    'Love Potion': 8,
    'Top Hat': 7.7,
    'Berry Box': 3.4,
    'Bunny Muffin': 3,
    'Candy Cane': 1.4,
    'Crystal Ball': 6.0,
    'Easter Egg': 2.6,
    'Eternal Candle': 2.3,
    'Evil Eye': 3.1,
    'Flying Broom': 8.4,
    'Ginger Cookie': 1.7,
    'Hanging Star': 4.1,
    'Hex Pot': 2.2,
    'Ion Gem': 62.9,
    'Jester Hat': 1.6,
    'Jingle Bells': 1.7,
    'Love Candle': 6.0,
    'Lunar Snake': 1.3,
    'Mad Pumpkin': 12,
    'Magic Potion': 52.0,
    'Pet Snake': 1.4,
    'Sakura Flower': 4.1,
    'Santa Hat': 2.0,
    'Signet Ring': 22.8,
    'Sleigh Bell': 5.0,
    'Snow Mittens': 2.9,
    'Spiced Wine': 2.1,
    'Spy Agaric': 2.9,
    'Star Notepad': 1.9,
    'Trapped Heart': 6.4,
    'Winter Wreath': 1.6,
    "Big Year": 1.5,
    "Snake Box": 1.3,
    "Bonded Ring": 43.5,
    "Xmas Stocking": 1.3,
    "Holiday Drink": 1.8,
    "Gem Signet": 55.9,
    "Light Sword": 2.8,
    "Restless Jar": 2.3,
    "Nail Bracelet": 107.8,
    "Heroic Helmet": 188.0,
    "Bow Tie": 2.9,
    "Heart Locket": 1170.0,
    "Lush Bouquet": 2.4,
    "Whip Cupcake": 1.4,
    "Joyful Bundle": 2.6,
    "Cupid Charm": 9.0,
    "Valentine Box": 3.7,
    "Snoop Dogg": 1.6,
    "Swag Bag": 1.8,
    "Snoop Cigar": 4.4,
    "Low Rider": 21.7,
    "Westside Sign": 44.5,
    "Backpack": 10.0,
    "Book": 20.0,
    "Pen": 30.0,
    "Suitcase": 100.0,
    'Heart': 0.06,
    'Bear': 0.06,
    'Rose': 0.1,
    'Rocket': 0.2,
    'Bottle': 0.2,
    'Ring': 0.4
};
const KISSED_FROG_VARIANT_FLOORS={"Happy Pepe":500.0,"Tree Frog":150.0,"Brewtoad":150.0,"Puddles":150.0,"Honeyhop":150.0,"Melty Butter":150.0,"Lucifrog":150.0,"Zodiak Croak":150.0,"Count Croakula":150.0,"Lilie Pond":150.0,"Sweet Dream":150.0,"Frogmaid":150.0,"Rocky Hopper":150.0,"Icefrog":45.0,"Lava Leap":45.0,"Toadstool":45.0,"Desert Frog":45.0,"Cupid":45.0,"Hopberry":45.0,"Ms. Toad":45.0,"Trixie":45.0,"Prince Ribbit":45.0,"Pond Fairy":45.0,"Boingo":45.0,"Tesla Frog":45.0,"Starry Night":30.0,"Silver":30.0,"Ectofrog":30.0,"Poison":30.0,"Minty Bloom":30.0,"Sarutoad":30.0,"Void Hopper":30.0,"Ramune":30.0,"Lemon Drop":30.0,"Ectobloom":30.0,"Duskhopper":30.0,"Bronze":30.0,"Lily Pond":19.0,"Toadberry":19.0,"Frogwave":19.0,"Melon":19.0,"Sky Leaper":19.0,"Frogtart":19.0,"Peach":19.0,"Sea Breeze":19.0,"Lemon Juice":19.0,"Cranberry":19.0,"Tide Pod":19.0,"Brownie":19.0,"Banana Pox":19.0};
Object.assign(UPDATED_FLOOR_PRICES_FRONTEND, KISSED_FROG_VARIANT_FLOORS);

// Добавьте эту функцию после функции apiRequest
// Найдите эту функцию и ЗАМЕНИТЕ её целиком на этот новый код
async function fetchAllPossibleUpgrades() {
    const authData = localStorage.getItem('auth_data');
    if (!authData) {
        // showTGNotification("Ошибка авторизации. Пожалуйста, перезагрузите приложение.", 'error');
        return [];
    }

    try {
        const response = await apiRequest('/api/get_all_nfts', 'POST', { auth_data: authData });

        // --- НАЧАЛО ИЗМЕНЕНИЙ ---
        if (response.status === 'success' && Array.isArray(response.result)) {
            // Теперь response.result - это уже готовый массив.
            // Нам нужно просто пройтись по нему и привести ключи к формату,
            // который используется в остальном приложении.
            const upgradesArray = response.result.map(item => ({
                name: item.name,
                imageFilename: item.img_url,
                floorPrice: (item.price_stars || 0) / TON_TO_STARS_RATE // Конвертируем звезды в TON
            }));
            return upgradesArray;
        // --- КОНЕЦ ИЗМЕНЕНИЙ ---
        } else {
            showTGNotification(response.error || "Не удалось загрузить список предметов для апгрейда.", "error");
            return [];
        }
    } catch (error) {
        console.error("API error fetching all possible upgrades:", error);
        showTGNotification("Ошибка сети при загрузке предметов для апгрейда.", "error");
        return [];
    }
}

function generateImageFilename(nameOrUrl) {
    if (!nameOrUrl) return IMAGE_BASE_URL + 'placeholder.png';
    if (nameOrUrl.startsWith('http://') || nameOrUrl.startsWith('https://')) return nameOrUrl;

    // Check if the name is one of our special image gifts
    if (EMOJI_GIFTS[nameOrUrl]) {
        return EMOJI_GIFTS[nameOrUrl].imageFilename; // Return the new image URL
    }

    const name = nameOrUrl;
    if (name.toLowerCase().includes("ton") && name.toLowerCase().includes("prize")) return TON_COIN_FULL_URL;
    if (GIFT_NAME_TO_ID_MAP[name]) return `https://cdn.changes.tg/gifts/originals/${GIFT_NAME_TO_ID_MAP[name]}/Original.png`;
    if (Object.keys(KISSED_FROG_VARIANT_FLOORS).includes(name)) return `https://cdn.changes.tg/gifts/models/Kissed%20Frog/png/${name.replace(/\s/g, '%20')}.png`;
    if (CUSTOM_GIFT_IMAGES[nameOrUrl]) {
        return CUSTOM_GIFT_IMAGES[nameOrUrl];
    }

    let filename = name.replace(/\s+/g, '-').replace(/&/g, 'and').replace(/'/g, "");
    if (name === "Durov's Cap") filename = "Durov's-Cap";
    if (name === "Vintage Cigar") filename = "Vintage-Cigar";
    if (name === "placeholder_nothing.png") return 'https://images.emojiterra.com/mozilla/512px/274c.png';
    if (['Amber', 'Midnight_Blue', 'Onyx_Black', 'Black'].includes(name.replace(/-/g, '_'))) filename = name.replace('-', '_');

    if (!/\.(jpeg|jpg|gif|png|svg)$/i.test(filename)) filename += '.png';
    console.log("generateImageFilename");
    console.log(IMAGE_BASE_URL + filename);
    return IMAGE_BASE_URL + filename;
}

function formatLargeNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
}

const finalKissedFrogPrizesWithConsolation = [{'name': 'Happy Pepe', 'probability': 1e-07, 'imageFilename': 'https://images.casehunter.sbs/Happy Pepe.png', 'floorPrice': 500.0}, {'name': 'Tree Frog', 'probability': 5e-07, 'imageFilename': 'https://images.casehunter.sbs/Tree Frog.png', 'floorPrice': 150.0}, {'name': 'Brewtoad', 'probability': 5e-07, 'imageFilename': 'https://images.casehunter.sbs/Brewtoad.png', 'floorPrice': 150.0}, {'name': 'Puddles', 'probability': 5e-07, 'imageFilename': 'https://images.casehunter.sbs/Puddles.png', 'floorPrice': 150.0}, {'name': 'Honeyhop', 'probability': 5e-07, 'imageFilename': 'https://images.casehunter.sbs/Honeyhop.png', 'floorPrice': 150.0}, {'name': 'Melty Butter', 'probability': 5e-07, 'imageFilename': 'https://images.casehunter.sbs/Melty Butter.png', 'floorPrice': 150.0}, {'name': 'Lucifrog', 'probability': 5e-07, 'imageFilename': 'https://images.casehunter.sbs/Lucifrog.png', 'floorPrice': 150.0}, {'name': 'Zodiak Croak', 'probability': 5e-07, 'imageFilename': 'https://images.casehunter.sbs/Zodiak Croak.png', 'floorPrice': 150.0}, {'name': 'Count Croakula', 'probability': 5e-07, 'imageFilename': 'https://images.casehunter.sbs/Count Croakula.png', 'floorPrice': 150.0}, {'name': 'Lilie Pond', 'probability': 5e-07, 'imageFilename': 'https://images.casehunter.sbs/Lilie Pond.png', 'floorPrice': 150.0}, {'name': 'Sweet Dream', 'probability': 5e-07, 'imageFilename': 'https://images.casehunter.sbs/Sweet Dream.png', 'floorPrice': 150.0}, {'name': 'Frogmaid', 'probability': 5e-07, 'imageFilename': 'https://images.casehunter.sbs/Frogmaid.png', 'floorPrice': 150.0}, {'name': 'Rocky Hopper', 'probability': 5e-07, 'imageFilename': 'https://images.casehunter.sbs/Rocky Hopper.png', 'floorPrice': 150.0}, {'name': 'Icefrog', 'probability': 2e-06, 'imageFilename': 'https://images.casehunter.sbs/Icefrog.png', 'floorPrice': 45.0}, {'name': 'Lava Leap', 'probability': 2e-06, 'imageFilename': 'https://images.casehunter.sbs/Lava Leap.png', 'floorPrice': 45.0}, {'name': 'Toadstool', 'probability': 2e-06, 'imageFilename': 'https://images.casehunter.sbs/Toadstool.png', 'floorPrice': 45.0}, {'name': 'Desert Frog', 'probability': 2e-06, 'imageFilename': 'https://images.casehunter.sbs/Desert Frog.png', 'floorPrice': 45.0}, {'name': 'Cupid', 'probability': 2e-06, 'imageFilename': 'https://images.casehunter.sbs/Cupid.png', 'floorPrice': 45.0}, {'name': 'Hopberry', 'probability': 2e-06, 'imageFilename': 'https://images.casehunter.sbs/Hopberry.png', 'floorPrice': 45.0}, {'name': 'Ms. Toad', 'probability': 2e-06, 'imageFilename': 'https://images.casehunter.sbs/Ms. Toad.png', 'floorPrice': 45.0}, {'name': 'Trixie', 'probability': 2e-06, 'imageFilename': 'https://images.casehunter.sbs/Trixie.png', 'floorPrice': 45.0}, {'name': 'Prince Ribbit', 'probability': 2e-06, 'imageFilename': 'https://images.casehunter.sbs/Prince Ribbit.png', 'floorPrice': 45.0}, {'name': 'Pond Fairy', 'probability': 2e-06, 'imageFilename': 'https://images.casehunter.sbs/Pond Fairy.png', 'floorPrice': 45.0}, {'name': 'Boingo', 'probability': 2e-06, 'imageFilename': 'https://images.casehunter.sbs/Boingo.png', 'floorPrice': 45.0}, {'name': 'Tesla Frog', 'probability': 2e-06, 'imageFilename': 'https://images.casehunter.sbs/Tesla Frog.png', 'floorPrice': 45.0}, {'name': 'Starry Night', 'probability': 1e-05, 'imageFilename': 'https://images.casehunter.sbs/Starry Night.png', 'floorPrice': 30.0}, {'name': 'Silver', 'probability': 1e-05, 'imageFilename': 'https://images.casehunter.sbs/Silver.png', 'floorPrice': 30.0}, {'name': 'Ectofrog', 'probability': 1e-05, 'imageFilename': 'https://images.casehunter.sbs/Ectofrog.png', 'floorPrice': 30.0}, {'name': 'Poison', 'probability': 1e-05, 'imageFilename': 'https://images.casehunter.sbs/Poison.png', 'floorPrice': 30.0}, {'name': 'Minty Bloom', 'probability': 1e-05, 'imageFilename': 'https://images.casehunter.sbs/Minty Bloom.png', 'floorPrice': 30.0}, {'name': 'Sarutoad', 'probability': 1e-05, 'imageFilename': 'https://images.casehunter.sbs/Sarutoad.png', 'floorPrice': 30.0}, {'name': 'Void Hopper', 'probability': 1e-05, 'imageFilename': 'https://images.casehunter.sbs/Void Hopper.png', 'floorPrice': 30.0}, {'name': 'Ramune', 'probability': 1e-05, 'imageFilename': 'https://images.casehunter.sbs/Ramune.png', 'floorPrice': 30.0}, {'name': 'Lemon Drop', 'probability': 1e-05, 'imageFilename': 'https://images.casehunter.sbs/Lemon Drop.png', 'floorPrice': 30.0}, {'name': 'Ectobloom', 'probability': 1e-05, 'imageFilename': 'https://images.casehunter.sbs/Ectobloom.png', 'floorPrice': 30.0}, {'name': 'Duskhopper', 'probability': 1e-05, 'imageFilename': 'https://images.casehunter.sbs/Duskhopper.png', 'floorPrice': 30.0}, {'name': 'Bronze', 'probability': 1e-05, 'imageFilename': 'https://images.casehunter.sbs/Bronze.png', 'floorPrice': 30.0}, {'name': 'Lily Pond', 'probability': 0.001, 'imageFilename': 'https://images.casehunter.sbs/Lily Pond.png', 'floorPrice': 19.0}, {'name': 'Toadberry', 'probability': 0.001, 'imageFilename': 'https://images.casehunter.sbs/Toadberry.png', 'floorPrice': 19.0}, {'name': 'Frogwave', 'probability': 0.001, 'imageFilename': 'https://images.casehunter.sbs/Frogwave.png', 'floorPrice': 19.0}, {'name': 'Melon', 'probability': 0.001, 'imageFilename': 'https://images.casehunter.sbs/Melon.png', 'floorPrice': 19.0}, {'name': 'Sky Leaper', 'probability': 0.001, 'imageFilename': 'https://images.casehunter.sbs/Sky Leaper.png', 'floorPrice': 19.0}, {'name': 'Frogtart', 'probability': 0.001, 'imageFilename': 'https://images.casehunter.sbs/Frogtart.png', 'floorPrice': 19.0}, {'name': 'Peach', 'probability': 0.001, 'imageFilename': 'https://images.casehunter.sbs/Peach.png', 'floorPrice': 19.0}, {'name': 'Sea Breeze', 'probability': 0.001, 'imageFilename': 'https://images.casehunter.sbs/Sea Breeze.png', 'floorPrice': 19.0}, {'name': 'Lemon Juice', 'probability': 0.001, 'imageFilename': 'https://images.casehunter.sbs/Lemon Juice.png', 'floorPrice': 19.0}, {'name': 'Cranberry', 'probability': 0.001, 'imageFilename': 'https://images.casehunter.sbs/Cranberry.png', 'floorPrice': 19.0}, {'name': 'Tide Pod', 'probability': 0.001, 'imageFilename': 'https://images.casehunter.sbs/Tide Pod.png', 'floorPrice': 19.0}, {'name': 'Brownie', 'probability': 0.001, 'imageFilename': 'https://images.casehunter.sbs/Brownie.png', 'floorPrice': 19.0}, {'name': 'Banana Pox', 'probability': 0.001, 'imageFilename': 'https://images.casehunter.sbs/Banana Pox.png', 'floorPrice': 19.0}, {'name': 'Spy Agaric', 'probability': 0.2, 'imageFilename': 'https://images.casehunter.sbs/Spy Agaric.png', 'floorPrice': 5}, {'name': 'Desk Calendar', 'probability': 0.78, 'imageFilename': 'https://images.casehunter.sbs/Desk Calendar.png', 'floorPrice': 2}].sort((a,b) => (b.floorPrice || 0) - (a.floorPrice || 0));
let currentProbSumForKF = finalKissedFrogPrizesWithConsolation.reduce((sum,p)=>sum+p.probability,0);
let remainingProbForConsolation = 1.0 - currentProbSumForKF;
if(remainingProbForConsolation > 0.00001){finalKissedFrogPrizesWithConsolation.push({name:"Desk Calendar",probability:remainingProbForConsolation});}
finalKissedFrogPrizesWithConsolation.forEach(p=>{if(!p.imageFilename)p.imageFilename=generateImageFilename(p.name);if(p.floorPrice===undefined)p.floorPrice=UPDATED_FLOOR_PRICES_FRONTEND[p.name];});

const caseNameTranslations = {
    'All In': 'Всё сразу',
    'Small Billionaire': 'Мини Миллиардер',
    'Lol Pop Stash': 'Леденец',
    'Record Player Vault': 'Проигрыватель',
    'Girl\'s Collection': 'Женская Коллекция',
    'Men\'s Collection': 'Мужская Коллекция',
    'Swiss Watch Box': 'Швейцарские Часы',
    'Kissed Frog Pond': 'Лягушки',
    'Perfume Chest': 'Парфюм',
    'Vintage Cigar Safe': 'Сигарки',
    'Astral Shard Relic': 'Алмазы',
    'Plush Pepe Hoard': 'Плюш Пепе',
    'Black Only': 'Чёрный фон',
    'Schooler': 'Школьный',
    'Рик и Морти': 'Рик и Морти',
    'Ежедневный': 'Ежедневный' // <-- ДОБАВЛЕН ПЕРЕВОД ДЛЯ НОВОГО КЕЙСА
};

const CUSTOM_GIFT_IMAGES = {
    "Backpack": "https://images.casehunter.sbs/gifts_emoji_by_gifts_changes_bot_AgAD-IYAAsfWsEk.png?raw=true",
    "Book": "https://images.casehunter.sbs/gifts_emoji_by_gifts_changes_bot_AgADo4cAAu7EsUk.png?raw=true",
    "Pen": "https://images.casehunter.sbs/gifts_emoji_by_gifts_changes_bot_AgADyoUAAmZioUk.png?raw=true",
    "Suitcase": "https://images.casehunter.sbs/gifts_emoji_by_gifts_changes_bot_AgADa4wAAurDqUk.png?raw=true",
};

const CASE_REPRESENTATIVE_IMAGE_MAP = {
    'all_in_01': 'Precious Peach',
    'small_billionaire_05': 'Heroic Helmet',
    'lolpop': 'Lol Pop',
    'recordplayer': 'Record Player',
    'girls_collection': 'Neko Helmet',
    'mens_collection': 'Top Hat',
    'swisswatch': 'Swiss Watch',
    'kissedfrog': 'Kissed Frog',
    'perfumebottle': 'Perfume Bottle',
    'vintagecigar': 'Vintage Cigar',
    'astralshard': 'Astral Shard',
    'plushpepe': 'Plush Pepe'
};

// --- START: REPLACE THE ENTIRE casesData ARRAY IN index.html WITH THIS ---
const casesData = [
    // --- НАЧАЛО: НОВЫЙ БЕСПЛАТНЫЙ КЕЙС ---
    {
        'id': 'daily_case', // Используем 'daily_case' для соответствия логике в renderCases
        'name': 'Ежедневный',
        'imageFilename': 'https://images.casehunter.sbs/daily_free.PNG',
        'priceTON': 0, // Бесплатный
        'prizes': [
            {'name': 'Lol Pop', 'probability': 0.0001, 'img_url': 'https://images.casehunter.sbs/LolPopMagicWand.png'},
            {'name': 'Bow Tie', 'probability': 0.0001, 'img_url': 'https://images.casehunter.sbs/BowTieDarkLord.png'},
            {'name': 'Ring', 'probability': 0.01, 'img_url': 'https://images.casehunter.sbs/Ring.png'},
            {'name': 'Rocket', 'probability': 0.1288734, 'img_url': 'https://images.casehunter.sbs/Rocket.png'},
            {'name': 'Rose', 'probability': 0.2, 'img_url': 'https://images.casehunter.sbs/Rose.png'},
            {'name': 'Bear', 'probability': 0.25, 'img_url': 'https://images.casehunter.sbs/Bear.png'},
            // Вероятность последнего предмета скорректирована, чтобы сумма была равна 1
            {'name': 'Desk Calendar', 'probability': 0.4109266, 'img_url': 'https://images.casehunter.sbs/DeskCalendarNewsprint.png'}
        ]
    },
    // --- КОНЕЦ: НОВЫЙ БЕСПЛАТНЫЙ КЕЙС ---
    {'id': 'all_in_01', 'name': 'All In', 'imageFilename': 'https://images.casehunter.sbs/PreciousPeachImpeached.png', 'priceTON': 0.2, 'prizes':
            [
                {'name': 'Precious Peach', 'probability': 2e-05, 'img_url': 'https://images.casehunter.sbs/PreciousPeachImpeached.png', 'price_stars': 65000},
                {'name': 'Whip Cupcake Biohazard', 'probability': 0.0001, 'img_url': 'https://images.casehunter.sbs/WhipCupcakeBiohazard.png', 'price_stars': 400},
                {'name': 'Jelly Bunny', 'probability': 0.0001, 'img_url': 'https://images.casehunter.sbs/JellyBunnyJevil.png', 'price_stars': 650},
                {'name': 'Lol Pop', 'probability': 0.0001, 'img_url': 'https://images.casehunter.sbs/LolPopRomance.png', 'price_stars': 300},
                {'name': 'Ring', 'probability': 0.01, 'img_url': 'https://images.casehunter.sbs/Ring.png'},
                {'name': 'Bottle', 'probability': 0.15, 'img_url': 'https://images.casehunter.sbs/Bottle.png'},
                {'name': 'Rocket', 'probability': 0.1288734, 'img_url': 'https://images.casehunter.sbs/Rocket.png'},
                {'name': 'Rose', 'probability': 0.2, 'img_url': 'https://images.casehunter.sbs/Rose.png'},
                {'name': 'Bear', 'probability': 0.25, 'img_url': 'https://images.casehunter.sbs/Bear.png'},
                {'name': 'Heart', 'probability': 0.25, 'img_url': 'https://images.casehunter.sbs/Heart.png'}]},

    {'id': 'small_billionaire_05', 'name': 'Small Billionaire', 'imageFilename': 'https://images.casehunter.sbs/HeroicHelmetBlackThorn.png', 'priceTON': 0.756, 'prizes': [
            {'name': 'Heroic Helmet', 'probability': 5e-06, 'img_url': 'https://images.casehunter.sbs/HeroicHelmetBlackThorn.png'},
            {'name': 'Perfume Bottle', 'probability': 0.0001, 'img_url': 'https://images.casehunter.sbs/PerfumeBottlePlumCloud.png'},
            {'name': 'Vintage Cigar', 'probability': 0.00012, 'img_url': 'https://images.casehunter.sbs/VintageCigarGreenGas.png'},
            {'name': 'Signet Ring Onyx Demon', 'probability': 0.00013, 'img_url': 'https://images.casehunter.sbs/SignetRingOnyxDemon.png', 'price_stars': 9000},
            {'name': 'Swiss Watch', 'probability': 0.00015, 'img_url': 'https://images.casehunter.sbs/SwissWatchBlueBezel.png'},
            {'name': 'Holiday Drink', 'probability': 0.002, 'img_url': 'https://images.casehunter.sbs/HolidayDrinkEmoDrip.png'},
            {'name': 'Swag Bag', 'probability': 0.002, 'img_url': 'https://images.casehunter.sbs/SwagBagMoneyBag.png'},
            {'name': 'Snake Box', 'probability': 0.005, 'img_url': 'https://images.casehunter.sbs/SnakeBox.png'},
            {'name': 'Ring', 'probability': 0.04, 'img_url': 'https://images.casehunter.sbs/Ring.png'},
            {'name': 'Bottle', 'probability': 0.15, 'img_url': 'https://images.casehunter.sbs/Bottle.png'},
            {'name': 'Rocket', 'probability': 0.140495, 'img_url': 'https://images.casehunter.sbs/Rocket.png'},
            {'name': 'Rose', 'probability': 0.2, 'img_url': 'https://images.casehunter.sbs/Rose.png'},
            {'name': 'Bear', 'probability': 0.25, 'img_url': 'https://images.casehunter.sbs/Bear.png'},
            {'name': 'Heart', 'probability': 0.25, 'img_url': 'https://images.casehunter.sbs/Heart.png'}]},


    {'id': 'lolpop', 'name': 'Lol Pop Stash', 'imageFilename': 'https://images.casehunter.sbs/LolPopMortalSin.png', 'priceTON': 1.6, 'prizes': [
            {'name': 'Lol Pop Mortal Sin', 'probability': 0.0001, 'img_url': 'https://images.casehunter.sbs/LolPopMortalSin.png', 'price_stars': 1900},
            {'name': 'Easter Egg Eggsecutive', 'probability': 0.0001, 'img_url': 'https://images.casehunter.sbs/EasterEggEggsecutive.png', 'price_stars': 1400},
            {'name': 'Pet Snake', 'probability': 0.0005, 'img_url': 'https://images.casehunter.sbs/PetSnakeDragon.png'},
            {'name': 'Cookie Heart', 'probability': 0.05, 'img_url': 'https://images.casehunter.sbs/CookieHeartDarkPawder.png'},
            {'name': 'Jester Hat', 'probability': 0.05, 'img_url': 'https://images.casehunter.sbs/JesterHatPepeHop.png'},
            {'name': 'Santa Hat', 'probability': 0.05, 'img_url': 'https://images.casehunter.sbs/SantaHatTelecap.png'},
            {'name': 'Jack-in-the-box', 'probability': 0.05, 'img_url': 'https://images.casehunter.sbs/Jack-in-the-box.png'},
            {'name': 'Homemade Cake', 'probability': 0.05, 'img_url': 'https://images.casehunter.sbs/HomemadeCakeRedVelvet.png'},
            {'name': 'Party Sparkler', 'probability': 0.05, 'img_url': 'https://images.casehunter.sbs/PartySparklerBitcoin.png'},
            {'name': 'Hypno Lollipop', 'probability': 0.1, 'img_url': 'https://images.casehunter.sbs/HypnoLollipopLucipop.png'},
            {'name': 'Lol Pop', 'probability': 0.3, 'img_url': 'https://images.casehunter.sbs/LolPopMirage.png'},
            {'name': 'Ring', 'probability': 0.3, 'img_url': 'https://images.casehunter.sbs/Ring.png'}]},

    {'id': 'rick_and_morty_case', 'name': 'Рик и Морти', 'imageFilename': 'https://images.casehunter.sbs/IMG_20250908_000501_222.PNG', 'priceTON': 2.0, 'prizes': [
            {'name': 'Toy Bear Deadpool', 'probability': 0.0001, 'img_url': 'https://images.casehunter.sbs/ToyBearDeadpool.png', 'price_stars': 25000},
            {'name': 'Scared Cat Niko', 'probability': 0.0001, 'img_url': 'https://images.casehunter.sbs/ScaredCatNiko.png', 'price_stars': 17000},
            {'name': 'Bonded Ring Bloody Mary', 'probability': 0.0001, 'img_url': 'https://images.casehunter.sbs/MagicPotion.png', 'price_stars': 13000},
            {'name': 'Genie Lamp', 'probability': 0.0001, 'img_url': 'https://images.casehunter.sbs/GenieLampStarDust.png'},
            {'name': 'Electric Skull', 'probability': 0.0005, 'img_url': 'https://images.casehunter.sbs/ElectricSkullBoneWhite.png'},
            {'name': 'Kissed Frog', 'probability': 0.0005, 'img_url': 'https://images.casehunter.sbs/KissedFrogTidePod.png'},
            {'name': 'Spy Agaric', 'probability': 0.05, 'img_url': 'https://images.casehunter.sbs/SpyAgaricWizardCap.png'},
            {'name': 'Hex Pot', 'probability': 0.05, 'img_url': 'https://images.casehunter.sbs/HexPotMadEye.png'},
            {'name': 'Hypno Lollipop', 'probability': 0.25, 'img_url': 'https://images.casehunter.sbs/HypnoLollipopRedWheel.png'},
            {'name': 'Bottle', 'probability': 0.3143, 'img_url': 'https://images.casehunter.sbs/Bottle.png'},
            {'name': 'Rocket', 'probability': 0.3143, 'img_url': 'https://images.casehunter.sbs/Rocket.png'}]},

    {'id': 'recordplayer', 'name': 'Record Player Vault', 'imageFilename': 'https://images.casehunter.sbs/RecordPlayerMisfits.png', 'priceTON': 3.6, 'prizes': [
            {'name': 'Record Player Misfits', 'probability': 0.0001, 'img_url': 'https://images.casehunter.sbs/RecordPlayerMisfits.png', 'price_stars': 12000},
            {'name': 'Flying Broom', 'probability': 0.0005, 'img_url': 'https://images.casehunter.sbs/FlyingBroomTokyoTorch.png'},
            {'name': 'Skull Flower', 'probability': 0.001, 'img_url': 'https://images.casehunter.sbs/SkullFlowerGhostRider.png'},
            {'name': 'Big Year', 'probability': 0.05, 'img_url': 'https://images.casehunter.sbs/BigYearPavelDurov.png'},
            {'name': 'Pet Snake', 'probability': 0.05, 'img_url': 'https://images.casehunter.sbs/PetSnakeDragon.png'},
            {'name': 'Hex Pot', 'probability': 0.1, 'img_url': 'https://images.casehunter.sbs/HexPotMadEye.png'},
            {'name': 'Snow Mittens', 'probability': 0.1, 'img_url': 'https://images.casehunter.sbs/SnowMittensLadyBug.png'},
            {'name': 'Spy Agaric', 'probability': 0.0803999, 'img_url': 'https://images.casehunter.sbs/SpyAgaricShrekShroom.png'},
            {'name': 'Star Notepad', 'probability': 0.1, 'img_url': 'https://images.casehunter.sbs/StarNotepadPepeDiary.png'},
            {'name': 'Ginger Cookie', 'probability': 0.1, 'img_url': 'https://images.casehunter.sbs/GingerCookieUniverse.png'},
            {'name': 'Party Sparkler', 'probability': 0.1, 'img_url': 'https://images.casehunter.sbs/PartySparklerBitcoin.png'},
            {'name': 'Lol Pop', 'probability': 0.1, 'img_url': 'https://images.casehunter.sbs/LolPopMirage.png'},
            {'name': 'Hypno Lollipop', 'probability': 0.1, 'img_url': 'https://images.casehunter.sbs/HypnoLollipopLucipop.png'},
            {'name': 'Ring', 'probability': 0.118, 'img_url': 'https://images.casehunter.sbs/Ring.png'}]},

    {'id': 'schooler_case', 'name': 'Schooler', 'imageFilename': 'https://images.casehunter.sbs/BackgroundEraser_20250908_000155281.png', 'priceTON': 6.0, 'prizes': [
            {'name': 'Suitcase', 'probability': 0.0001, 'img_url': 'https://images.casehunter.sbs/Suitcase.png'},
            {'name': 'Pen', 'probability': 0.0005, 'img_url': 'https://images.casehunter.sbs/Pen.png'},
            {'name': 'Book', 'probability': 0.001, 'img_url': 'https://images.casehunter.sbs/Book.png'},
            {'name': 'Swiss Watch', 'probability': 0.001, 'img_url': 'https://images.casehunter.sbs/SwissWatchTheGrid.png'},
            {'name': 'Backpack', 'probability': 0.005, 'img_url': 'https://images.casehunter.sbs/Backpack.png'},
            {'name': 'Record Player', 'probability': 0.05, 'img_url': 'https://images.casehunter.sbs/RecordPlayerIlluminati.png'},
            {'name': 'Voodoo Doll', 'probability': 0.1, 'img_url': 'https://images.casehunter.sbs/VoodooDollAquaGem.png'},
            {'name': 'Top Hat', 'probability': 0.1, 'img_url': 'https://images.casehunter.sbs/TopHatCharlie.png'},
            {'name': 'Bow Tie', 'probability': 0.15, 'img_url': 'https://images.casehunter.sbs/BowTieEggplants.png'},
            {'name': 'Tama Gadget', 'probability': 0.2, 'img_url': 'https://images.casehunter.sbs/TamaGadgetUnderdog.png'},
            {'name': 'Star Notepad', 'probability': 0.2, 'img_url': 'https://images.casehunter.sbs/StarNotepadPepeDiary.png'},
            {'name': 'Desk Calendar', 'probability': 0.1824, 'img_url': 'https://images.casehunter.sbs/DeskCalendarNewsprint.png'}]},

    {'id': 'girls_collection', 'name': "Girl's Collection", 'imageFilename': 'https://images.casehunter.sbs/NekoHelmetCottonDrift.png', 'priceTON': 3.0, 'prizes': [
            {'name': 'Neko Helmet Cotton Drift', 'probability': 0.0001, 'img_url': 'https://images.casehunter.sbs/NekoHelmetCottonDrift.png', 'price_stars': 15000},
            {'name': 'Cupid Charm', 'probability': 0.001, 'img_url': 'https://images.casehunter.sbs/CupidCharmMoonPrism.png'},
            {'name': 'Valentine Box', 'probability': 0.05, 'img_url': 'https://images.casehunter.sbs/ValentineBoxKitten.png'},
            {'name': 'Lush Bouquet', 'probability': 0.1, 'img_url': 'https://images.casehunter.sbs/LushBouquetCrocodile.png'},
            {'name': 'Eternal Rose', 'probability': 0.1, 'img_url': 'https://images.casehunter.sbs/EternalRoseGoldenShine.png'},
            {'name': 'Berry Box', 'probability': 0.15, 'img_url': 'https://images.casehunter.sbs/BerryBoxMegabite.png'},
            {'name': 'Sakura Flower', 'probability': 0.15, 'img_url': 'https://images.casehunter.sbs/SakuraFlowerFlowey.png'},
            {'name': 'Bunny Muffin', 'probability': 0.1488, 'img_url': 'https://images.casehunter.sbs/BunnyMuffinGothic.png'},
            {'name': 'Ring', 'probability': 0.25, 'img_url': 'https://images.casehunter.sbs/Ring.png'}]},
    {'id': 'mens_collection', 'name': "Men's Collection", 'imageFilename': 'https://images.casehunter.sbs/LowRiderTelegramBus.png', 'priceTON': 3.0, 'prizes': [
            {'name': 'Low Rider Telegram Bus', 'probability': 0.0005, 'img_url': 'https://images.casehunter.sbs/LowRiderTelegramBus.png', 'price_stars': 16000},
            {'name': 'Snoop Cigar', 'probability': 0.05, 'img_url': 'https://images.casehunter.sbs/SnoopCigarHighway.png'},
            {'name': 'Swag Bag', 'probability': 0.1, 'img_url': 'https://images.casehunter.sbs/SwagBagMissionary.png'},
            {'name': 'Snoop Dogg', 'probability': 0.1, 'img_url': 'https://images.casehunter.sbs/SnoopDoggAIDogg.png'},
            {'name': 'Top Hat', 'probability': 0.1, 'img_url': 'https://images.casehunter.sbs/TopHatPixelPerfect.png'},
            {'name': 'Top Hat Cardinal', 'probability': 0.1, 'img_url': 'https://images.casehunter.sbs/TopHatCardinal.png', 'price_stars': 2300},
            {'name': 'Spiced Wine', 'probability': 0.249199, 'img_url': 'https://images.casehunter.sbs/SpicedWineBlackout.png'},
            {'name': 'Ring', 'probability': 0.3, 'img_url': 'https://images.casehunter.sbs/Ring.png'}]},

    {'id': 'swisswatch', 'name': 'Swiss Watch Box', 'imageFilename': 'https://images.casehunter.sbs/SwissWatchDayTrader.png', 'priceTON': 6.0, 'prizes': [
            {'name': 'Swiss Watch Day Trader', 'probability': 1e-05, 'img_url': 'https://images.casehunter.sbs/SwissWatchDayTrader.png', 'price_stars': 70000},
            {'name': 'Electric Skull Hellfire', 'probability': 0.0001, 'img_url': 'https://images.casehunter.sbs/ElectricSkullHellfire.png', 'price_stars': 20000},
            {'name': 'Voodoo Doll', 'probability': 0.0005, 'img_url': 'https://images.casehunter.sbs/VoodooDollConceptArt.png'},
            {'name': 'Diamond Ring Whirlpool', 'probability': 0.0005, 'img_url': 'https://images.casehunter.sbs/DiamondRingWhirlpool.png', 'price_stars': 10000},
            {'name': 'Love Candle', 'probability': 0.0005, 'img_url': 'https://images.casehunter.sbs/LoveCandleCloud.png'},
            {'name': 'Mad Pumpkin', 'probability': 0.001, 'img_url': 'https://images.casehunter.sbs/MadPumpkinJigsaw.png'},
            {'name': 'Top Hat', 'probability': 0.05, 'img_url': 'https://images.casehunter.sbs/TopHat.png'},
            {'name': 'Trapped Heart', 'probability': 0.05, 'img_url': 'https://images.casehunter.sbs/TrappedHeartPhantom.png'},
            {'name': 'Love Potion', 'probability': 0.05, 'img_url': 'https://images.casehunter.sbs/LovePotionEmoTears.png'},
            {'name': 'Sleigh Bell', 'probability': 0.1, 'img_url': 'https://images.casehunter.sbs/SleighBellStuart.png'},
            {'name': 'Easter Egg', 'probability': 0.1, 'img_url': 'https://images.casehunter.sbs/EasterEggEggsecutive.png'},
            {'name': 'Desk Calendar', 'probability': 0.15, 'img_url': 'https://images.casehunter.sbs/DeskCalendarPepePlans.png'},
            {'name': 'Homemade Cake', 'probability': 0.15, 'img_url': 'https://images.casehunter.sbs/HomemadeCakeRedVelvet.png'},
            {'name': 'Xmas Stocking', 'probability': 0.34739, 'img_url': 'https://images.casehunter.sbs/XmasStockingMorgenstern.png'}]},

    {'id': 'black_only_case', 'name': 'Black Only', 'imageFilename': 'https://images.casehunter.sbs/BackgroundEraser_20250908_000116933.png', 'priceTON': 16.0, 'prizes': [
            {'name': 'Plush Pepe', 'probability': 1e-06, 'img_url': 'https://images.casehunter.sbs/PlushPepeEmeraldPlush.png', 'price_stars': 3250000},
            {'name': "Durov's Cap", 'probability': 5e-06, 'img_url': "https://images.casehunter.sbs/DurovsCapCaptain.png", 'price_stars': 1000000},
            {'name': 'Precious Peach', 'probability': 1e-05, 'img_url': 'https://images.casehunter.sbs/PreciousPeachClearSky.png', 'price_stars': 500000},
            {'name': 'Nail Bracelet', 'probability': 5e-05, 'img_url': 'https://images.casehunter.sbs/NailBraceletNeonTube.png', 'price_stars': 75000},
            {'name': 'Astral Shard', 'probability': 0.0001, 'img_url': 'https://images.casehunter.sbs/AstralShardUranium.png', 'price_stars': 125000},
            {'name': 'Perfume Bottle', 'probability': 0.0005, 'img_url': 'https://images.casehunter.sbs/PerfumeBottlePlumCloud.png', 'price_stars': 250000},
            {'name': 'Swiss Watch', 'probability': 0.001, 'img_url': 'https://images.casehunter.sbs/SwissWatchDayTrader.png', 'price_stars': 75000},
            {'name': 'Vintage Cigar', 'probability': 0.001, 'img_url': 'https://images.casehunter.sbs/VintageCigarPinkPanther.png', 'price_stars': 25000},
            {'name': 'Sharp Tongue', 'probability': 0.002, 'img_url': 'https://images.casehunter.sbs/SharpTongueSuccubus.png', 'price_stars': 50000},
            {'name': 'Electric Skull', 'probability': 0.002, 'img_url': 'https://images.casehunter.sbs/ElectricSkullHellfire.png', 'price_stars': 50000},
            {'name': 'Record Player', 'probability': 0.05, 'img_url': 'https://images.casehunter.sbs/RecordPlayerIlluminati.png', 'price_stars': 8250},
            {'name': 'Voodoo Doll', 'probability': 0.05, 'img_url': 'https://images.casehunter.sbs/VoodooDollAquaGem.png', 'price_stars': 25000},
            {'name': 'Top Hat', 'probability': 0.05, 'img_url': 'https://images.casehunter.sbs/TopHatCardinal.png', 'price_stars': 63*250},
            {'name': 'Skull Flower', 'probability': 0.1, 'img_url': 'https://images.casehunter.sbs/SkullFlowerGhostRider.png', 'price_stars': 40*250},
            {'name': 'Spy Agaric', 'probability': 0.1, 'img_url': 'https://images.casehunter.sbs/SpyAgaricWizardCap.png', 'price_stars': 22*250},
            {'name': 'Hypno Lollipop', 'probability': 0.2, 'img_url': 'https://images.casehunter.sbs/HypnoLollipopLucipop.png', 'price_stars': 12*250},
            {'name': 'Desk Calendar', 'probability': 0.193334, 'img_url': 'https://images.casehunter.sbs/DeskCalendarPepePlans.png', 'price_stars': 10*250},
            {'name': 'Lol Pop', 'probability': 0.25, 'img_url': 'https://images.casehunter.sbs/LolPopMirage.png', 'price_stars': 9*250}]},

    {'id': 'perfumebottle', 'name': 'Perfume Chest', 'imageFilename': 'https://images.casehunter.sbs/PerfumeBottlePlumCloud.png', 'priceTON': 10.0, 'prizes': [
            {'name': 'Perfume Bottle', 'probability': 5e-06, 'img_url': 'https://images.casehunter.sbs/PerfumeBottlePlumCloud.png'},
            {'name': 'Scared Cat Virus', 'probability': 0.0001, 'img_url': 'https://images.casehunter.sbs/ScaredCatVirus.png', 'price_stars': 12000},
            {'name': 'Westside Sign', 'probability': 0.0005, 'img_url': 'https://images.casehunter.sbs/WestsideSignRuby.png'},
            {'name': 'Swiss Watch', 'probability': 0.001, 'img_url': 'https://images.casehunter.sbs/SwissWatchTheGrid.png'},
            {'name': 'Sharp Tongue', 'probability': 0.001, 'img_url': 'https://images.casehunter.sbs/SharpTongueSuccubus.png'},
            {'name': 'Neko Helmet', 'probability': 0.002, 'img_url': 'https://images.casehunter.sbs/NekoHelmetStarrySky.png'},
            {'name': 'Kissed Frog', 'probability': 0.005, 'img_url': 'https://images.casehunter.sbs/KissedFrogTidePod.png'},
            {'name': 'Love Potion', 'probability': 0.1, 'img_url': 'https://images.casehunter.sbs/LovePotionEmoTears.png'},
            {'name': 'Sakura Flower', 'probability': 0.2, 'img_url': 'https://images.casehunter.sbs/SakuraFlowerFlowey.png'},
            {'name': 'Berry Box', 'probability': 0.3, 'img_url': 'https://images.casehunter.sbs/BerryBoxMegabite.png'},
            {'name': 'Spiced Wine', 'probability': 0.390395, 'img_url': 'https://images.casehunter.sbs/SpicedWineBlackout.png'}]},

    {'id': 'vintagecigar', 'name': 'Vintage Cigar Safe', 'imageFilename': 'https://images.casehunter.sbs/VintageCigarFarOut.png', 'priceTON': 14.0, 'prizes': [
            {'name': 'Vintage Cigar Far Out', 'probability': 0.005, 'img_url': 'https://images.casehunter.sbs/VintageCigarFarOut.png', 'price_stars': 20000},
            {'name': 'Vintage Cigar Psychonaut', 'probability': 1e-05, 'img_url': 'https://images.casehunter.sbs/VintageCigarPsychonaut.png', 'price_stars': 15000},
            {'name': 'Vintage Cigar Dark Clouds', 'probability': 0.0001, 'img_url': 'https://images.casehunter.sbs/VintageCigarDarkClouds.png', 'price_stars': 12000},
            {'name': 'Vintage Cigar Black Plume', 'probability': 0.0005, 'img_url': 'https://images.casehunter.sbs/VintageCigarBlackPlume.png', 'price_stars': 8000},
            {'name': 'Vintage Cigar', 'probability': 0.001, 'img_url': 'https://images.casehunter.sbs/VintageCigarPinkPanther.png'},
            {'name': 'Snoop Cigar Snoop Graffity', 'probability': 0.2, 'img_url': 'https://images.casehunter.sbs/SnoopCigarSnoopGraffiti.png', 'price_stars': 3500},
            {'name': 'Snoop Cigar Space Wrap', 'probability': 0.2, 'img_url': 'https://images.casehunter.sbs/SnoopCigarSpaceWrap.png', 'price_stars': 2000},
            {'name': 'Snoop Cigar', 'probability': 0.2, 'img_url': 'https://images.casehunter.sbs/SnoopCigarSurprise.png',},
            {'name': 'Sakura Flower', 'probability': 0.2, 'img_url': 'https://images.casehunter.sbs/SakuraFlowerFlowey.png'},
            {'name': 'Spy Agaric', 'probability': 0.39239, 'img_url': 'https://images.casehunter.sbs/SpyAgaricShrekShroom.png'}]},

    {'id': 'astralshard', 'name': 'Astral Shard Relic', 'imageFilename': 'https://images.casehunter.sbs/AstralShardUranium.png', 'priceTON': 28.0, 'prizes': [
        {'name': 'Astral Shard Uranium', 'probability': 1e-05, 'img_url': 'https://images.casehunter.sbs/AstralShardUranium.png', 'price_stars': 60000},
            {'name': 'Ion Gem', 'probability': 5e-05, 'img_url': 'https://images.casehunter.sbs/IonGemBotanica.png'},
            {'name': 'Mini Oscar', 'probability': 0.0001, 'img_url': 'https://images.casehunter.sbs/MiniOscarHobgoblin.png'},
            {'name': 'Perfume Bottle', 'probability': 0.0001, 'img_url': 'https://images.casehunter.sbs/PerfumeBottlePlumCloud.png'},
            {'name': 'Magic Potion', 'probability': 0.0005, 'img_url': 'https://images.casehunter.sbs/MagicPotionColorDrain.png'},
            {'name': 'Loot Bag Reptile Noir', 'probability': 0.001, 'img_url': 'https://images.casehunter.sbs/LootBagReptileNoir.png', 'price_stars': 30000},
            {'name': 'Voodoo Doll', 'probability': 0.1, 'img_url': 'https://images.casehunter.sbs/VoodooDollConceptArt.png'},
            {'name': 'Top Hat', 'probability': 0.2, 'img_url': 'https://images.casehunter.sbs/TopHatPixelPerfect.png'},
            {'name': 'Sakura Flower', 'probability': 0.3, 'img_url': 'https://images.casehunter.sbs/SakuraFlowerFlowey.png'},
            {'name': 'Spy Agaric', 'probability': 0.39824, 'img_url': 'https://images.casehunter.sbs/SpyAgaricShrekShroom.png'}]},

    {'id': 'plushpepe', 'name': 'Plush Pepe Hoard', 'imageFilename': 'https://images.casehunter.sbs/PlushPepeEmeraldPlush.png', 'priceTON': 200.0, 'prizes': [
        {'name': 'Plush Pepe', 'probability': 1e-06, 'img_url': 'https://images.casehunter.sbs/PlushPepeEmeraldPlush.png'},
            {'name': "Durov's Cap", 'probability': 5e-06, 'img_url': "https://images.casehunter.sbs/DurovsCapCaptain.png"},
            {'name': 'Heart Locket', 'probability': 5e-05, 'img_url': 'https://images.casehunter.sbs/HeartLocketLuna.png'},
            {'name': 'Heroic Helmet', 'probability': 0.0001, 'img_url': 'https://images.casehunter.sbs/HeroicHelmetBlackThorn.png'},
            {'name': 'Nail Bracelet', 'probability': 0.0001, 'img_url': 'https://images.casehunter.sbs/NailBraceletNeonTube.png'},
            {'name': 'Precious Peach', 'probability': 0.0005, 'img_url': 'https://images.casehunter.sbs/PreciousPeachClearSky.png'},
            {'name': 'Astral Shard', 'probability': 0.1, 'img_url': 'https://images.casehunter.sbs/AstralShardUranium.png'},
            {'name': 'Mini Oscar', 'probability': 0.2, 'img_url': 'https://images.casehunter.sbs/MiniOscarHobgoblin.png'},
            {'name': 'Genie Lamp', 'probability': 0.3, 'img_url': 'https://images.casehunter.sbs/GenieLampStarDust.png'},
            {'name': 'Kissed Frog', 'probability': 0.399244, 'img_url': 'https://images.casehunter.sbs/KissedFrogTidePod.png'}]}

];

// --- END: REPLACE THE ENTIRE casesData ARRAY IN index.html WITH THIS ---

// --- CRUCIAL PROCESSING STEP ---
// This loop MUST run after the casesData array is defined.
// It adds the necessary floorPrice and imageFilename properties to each prize.
casesData.forEach(caseItem => {
    let totalProb = 0;
    caseItem.prizes.forEach(prize => {
        prize.floorPrice = prize.price_stars/250 || UPDATED_FLOOR_PRICES_FRONTEND[prize.name] || 0;
        prize.imageFilename = prize.img_url; // This is safe now
        totalProb += prize.probability;
    });

    // A simple check to help you find errors in your probabilities
    if (Math.abs(totalProb - 1.0) > 0.001) {
        console.warn(`Probabilities for case "${caseItem.name}" do not sum to 1.0! Current sum is ${totalProb}`);
    }

    // Sort prizes by value for better display in the 'Possible Prizes' grid
    caseItem.prizes.sort((a, b) => (b.floorPrice || 0) - (a.floorPrice || 0));
});
// DOM Element References
const headerElements = {
    tonConnectButton: document.getElementById('ton-connect-button'),
    walletAddressDisplay: document.getElementById('wallet-address-display'),
    starBalanceSpan: document.getElementById('star-balance'),
    balanceDisplay: document.getElementById('balance')
};
const appNavButtons = document.querySelectorAll('.nav-button');
const pages = document.querySelectorAll('.page');
const casesGrid = document.getElementById('cases-grid');
const loadingScreen = document.getElementById('loading-screen');
const loadingStatusText = document.getElementById('loading-status');
const rouletteModal = document.getElementById('roulette-modal');
const rouletteCaseName = document.getElementById('roulette-case-name');
const rouletteWheelContainer = document.getElementById('roulette-wheel-container');
const spinButton = document.getElementById('spin-button');
const closeRouletteButton = document.getElementById('close-roulette-button');
const possiblePrizesDisplay = document.getElementById('possible-prizes-display');
const caseMultiplierSelector = document.querySelector('.case-multiplier-selector');
const rouletteReel1 = document.getElementById('roulette-reel-1');
const rouletteReel2 = document.getElementById('roulette-reel-2');
const rouletteReel3 = document.getElementById('roulette-reel-3');
const winOverlayModal = document.getElementById('win-overlay-modal');
const winOverlayPrizeImageContainer = document.getElementById('win-overlay-prize-image');
const winOverlayNameEl = document.getElementById('win-overlay-prize-name');
const winOverlayPrizeDetailsEl = document.getElementById('win-overlay-prize-details');
// --- ИЗМЕНЕНИЕ: ОБНОВЛЕНЫ ID КНОПОК ---
const winOverlayClaimBtn = document.getElementById('win-overlay-claim-button');
const winOverlaySellBtn = document.getElementById('win-overlay-sell-button');
const winOverlaySellValue = document.getElementById('win-overlay-sell-value');

const withdrawModal = document.getElementById('withdraw-modal');
const closeWithdrawModalButton = document.getElementById('close-withdraw-modal-button');
const profileElements = {
    avatar: document.getElementById('profile-avatar'),
    username: document.getElementById('profile-username'),
    userid: document.getElementById('profile-userid'),
    balanceDisplay: document.getElementById('profile-balance-display'),
    walletAddress: document.getElementById('profile-wallet-address'),
    inventoryGrid: document.getElementById('inventory-grid'),
    inventoryCount: document.getElementById('inventory-count'),
    emptyInventoryMessage: document.getElementById('empty-inventory-message'),
    disconnectWalletButton: document.getElementById('disconnect-wallet-button'),
    depositAmountInput: document.getElementById('deposit-amount-input'),
    sellAllButton: document.getElementById('sell-all-button'),
    sellAllValueSpan: document.getElementById('sell-all-value'),
    promocodeInput: document.getElementById('promocode-input'),
    redeemPromocodeButton: document.getElementById('redeem-promocode-button')
};
const upgradePageElements = {
    selectedInventoryItemSlot: document.getElementById('selected-inventory-item-slot'),
    desiredUpgradeItemSlot: document.getElementById('desired-upgrade-item-slot'),
    upgradePickerContainer: document.getElementById('upgrade-picker-container'),
    upgradePickerTitle: document.getElementById('upgrade-picker-title'),
    upgradeItemsGrid: document.getElementById('upgrade-items-grid'),
    closeUpgradePickerButton: document.getElementById('close-upgrade-picker-button'),
    chanceDisplayContainer: document.getElementById('upgrade-chance-display-container'),
    chanceCircle: document.getElementById('upgrade-chance-circle'),
    chancePointer: document.getElementById('upgrade-chance-pointer'),
    calculatedMultiplierText: document.getElementById('upgrade-calculated-multiplier'),
    calculatedChanceText: document.getElementById('upgrade-calculated-chance'),
    doUpgradeButton: document.getElementById('do-upgrade-button'),
    upgradeResultModal: document.getElementById('upgrade-result-modal'),
    upgradeResultImageContainer: document.getElementById('upgrade-result-image-container'),
    upgradeResultTitle: document.getElementById('upgrade-result-title'),
    upgradeResultMessage: document.getElementById('upgrade-result-message'),
    closeUpgradeResultModalButton: document.getElementById('close-upgrade-result-modal-button'),
};
const inviteElements = {
    referralLink: document.getElementById('referral-link'),
    copyRefLinkButton: document.getElementById('copy-ref-link-button'),
    referralBalance: document.getElementById('referral-balance'),
    invitedCount: document.getElementById('invited-count'),
    withdrawReferralButton: document.getElementById('withdraw-referral-button'),
    invitedUsersListDisplay: document.getElementById('invited-users-list-display')
};
const leaderboardList = document.getElementById('leaderboard-list');
const depositInstructionsModal = document.getElementById('deposit-instructions-modal');
const tonTransferLink = document.getElementById('ton-transfer-link');
const confirmPaymentSentButton = document.getElementById('confirm-payment-sent-button');
const cancelDepositButton = document.getElementById('cancel-deposit-button');
const depositExpiryInfo = document.getElementById('deposit-expiry-info');
const depositStatusMessageEl = document.getElementById('deposit-status-message');
const depositLoader = document.getElementById('deposit-loader');
const depositWalletAddressEl = document.getElementById('deposit-wallet-address');
const depositCommentTextEl = document.getElementById('deposit-comment-text');
const copyDepositAddressBtn = document.getElementById('copy-deposit-address-button');
const copyDepositCommentBtn = document.getElementById('copy-deposit-comment-button');
let depositCommentText = '';
const VISUAL_ITEMS_PER_REEL_INITIAL = 10;
const VISUAL_ITEMS_PER_REEL_SPIN_BUFFER = 70;
let currentPendingDepositId = null;
let depositExpiryInterval = null;
let depositRecipientAddressRaw = '';

let tgBackButton = null;
const backButtonHandlerStack = [];
let dataFetchedSuccessfully = false;
let tonConnectWalletInfo = null;

// Utility Functions
function _updateTgBackButton() {
    if (!tgBackButton) return;
    if (backButtonHandlerStack.length > 0) {
        const handler = backButtonHandlerStack[backButtonHandlerStack.length - 1];
        tgBackButton.offClick();
        tgBackButton.onClick(handler);
        tgBackButton.show();
    } else {
        tgBackButton.hide();
        tgBackButton.offClick();
    }
}
function pushTgBackButtonHandler(handler) {
    if (!tgBackButton) return;
    backButtonHandlerStack.push(handler);
    _updateTgBackButton();
}
function popTgBackButtonHandler() {
    if (!tgBackButton) return;
    if (backButtonHandlerStack.length > 0) backButtonHandlerStack.pop();
    _updateTgBackButton();
}
function clearTgBackButtonStack() {
    if (!tgBackButton) return;
    backButtonHandlerStack.length = 0;
    _updateTgBackButton();
}
function navigateBackToMainPage() {
    navigateToPage('main-page');
}
function closeRouletteModalWithBackButton() {
    closeRouletteModal();
}
function closeWinOverlayModalWithBackButton() {
    closeWinOverlayModal();
}
function closeDepositModalWithBackButton() {
    closeDepositInstructionsModal();
}
function updateLoadingStatus(message) {
    if (loadingStatusText) {
        loadingStatusText.textContent = message;
    }
}
let dailyCaseInterval = null;

// --- НАЧАЛО: НОВЫЕ ФУНКЦИИ ДЛЯ ТАЙМЕРА ---
function formatTimeLeft(seconds) {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
}


function updateDailyCaseTimer() {
    const priceDiv = document.getElementById('daily-case-button');
    const card = priceDiv ? priceDiv.closest('.case-card') : null;

    if (!priceDiv || !card) {
        if(dailyCaseInterval) clearInterval(dailyCaseInterval);
        return;
    }

    // Если у нас нет данных с сервера, ничего не делаем
    if (currentUser.next_free_case_time === null) {
        priceDiv.textContent = "Загрузка...";
        return;
    }

    // next_free_case_time приходит в секундах, Date.now() - в миллисекундах
    const nextAvailableTimeMs = currentUser.next_free_case_time * 1000;
    const nowMs = Date.now();
    const timeLeftMs = nextAvailableTimeMs - nowMs;

    if (timeLeftMs > 0) {
        priceDiv.textContent = formatTimeLeft(timeLeftMs / 1000);
        card.style.pointerEvents = 'none';
        card.style.opacity = '0.7';
    } else {
        priceDiv.textContent = "Бесплатно";
        card.style.pointerEvents = 'auto';
        card.style.opacity = '1';
        if(dailyCaseInterval) clearInterval(dailyCaseInterval);
    }
}

async function apiRequest(endpoint, method = 'GET', body = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (Telegram.WebApp.initData) headers['X-Telegram-Init-Data'] = Telegram.WebApp.initData;
    const config = { method, headers };
    if (body && (method === 'POST' || method === 'PUT')) config.body = JSON.stringify(body);
    try {
        const response = await fetch(API_BASE_URL + endpoint, config);
        if (!response.ok) {
            let errData; try { errData = await response.json(); } catch (e) { errData = { error: `HTTP ${response.status}: ${response.statusText}` }; }
            // showTGNotification(errData.error || errData.message || `Request failed`, 'error');
            throw new Error(errData.error || errData.message);
        }
        return response.status === 204 ? null : await response.json();
    } catch (error) {
        if (!(error.message.includes("HTTP") || error.message.includes("Request failed"))) {
            // showTGNotification(`Network: ${error.message}`, 'error');
        }
        throw error;
    }
}

// --- Add these new functions to your script ---

function renderBanners() {
    const bannerCarousel = document.getElementById('banner-carousel');
    if (!bannerCarousel) return;
    const slidesContainer = bannerCarousel.querySelector('.banner-slides');
    const paginationContainer = bannerCarousel.querySelector('.banner-pagination');
    slidesContainer.innerHTML = '';
    paginationContainer.innerHTML = '';

    bannersData.forEach((banner, index) => {
        // Create Slide
        const slide = document.createElement('div');
        slide.className = 'banner-slide';
        const img = document.createElement('img');
        img.src = banner.image;
        img.alt = banner.name;

        if (banner.url) {
            const link = document.createElement('a');
            link.href = "#"; // Use JS for navigation to avoid page reload
            link.onclick = (e) => {
                e.preventDefault();
                // Check if the link is a Telegram link
                if (banner.url.startsWith('t.me/') || banner.url.startsWith('https://t.me/')) {
                    Telegram.WebApp.openTelegramLink(banner.url);
                } else {
                    Telegram.WebApp.openLink(banner.url);
                }
            };
            link.appendChild(img);
            slide.appendChild(link);
        } else {
            slide.appendChild(img);
        }
        slidesContainer.appendChild(slide);

        // Create Dot
        const dot = document.createElement('div');
        dot.className = 'banner-dot';
        dot.onclick = () => {
            goToBannerSlide(index);
            resetBannerAutoSwipe(); // Reset timer when user clicks a dot
        };
        paginationContainer.appendChild(dot);
    });

    updateBannerPagination();
    setupBannerEventListeners();
    startBannerAutoSwipe();
}

function populateAllGiftsForDeposit() {
    const uniqueGifts = new Map();
    casesData.forEach(caseItem => {
        caseItem.prizes.forEach(prize => {
            // Only include items with a name and a value > 0
            if (prize.name && prize.floorPrice > 0) {
                if (!uniqueGifts.has(prize.name)) {
                    uniqueGifts.set(prize.name, {
                        name: prize.name,
                        imageFilename: prize.img_url,
                        floorPrice: prize.floorPrice
                    });
                }
            }
        });
    });
    // Convert map to array and sort by value, highest first
    allGiftsForDeposit = Array.from(uniqueGifts.values()).sort((a, b) => b.floorPrice - a.floorPrice);
}

function renderGiftPricesList() {
    if (allGiftsForDeposit.length === 0) {
        populateAllGiftsForDeposit();
    }

    giftPricesListContainer.innerHTML = ''; // Clear previous content

    allGiftsForDeposit.forEach(gift => {
        const starValue = Math.floor(gift.floorPrice * TON_TO_STARS_RATE);

        const listItem = document.createElement('div');
        listItem.style.display = 'flex';
        listItem.style.alignItems = 'center';
        listItem.style.padding = '8px 0';
        listItem.style.borderBottom = '1px solid var(--border-color)';

        listItem.innerHTML = `
            <img src="${gift.imageFilename}" alt="${gift.name}" style="width: 40px; height: 40px; margin-right: 12px; object-fit: contain;">
            <span style="flex-grow: 1; font-weight: 500;">${gift.name}</span>
            <span style="font-weight: 600; display: flex; align-items: center;">
                ${starValue}
                <img src="${STAR_ICON_URL}" class="balance-icon" style="width: 16px; height: 16px; margin-left: 5px;">
            </span>
        `;
        giftPricesListContainer.appendChild(listItem);
    });
}

function goToBannerSlide(index) {
    const slidesContainer = document.querySelector('.banner-slides');
    bannerCurrentIndex = (index + bannersData.length) % bannersData.length;
    slidesContainer.style.transform = `translateX(-${bannerCurrentIndex * 100}%)`;
    updateBannerPagination();
}

function updateBannerPagination() {
    const bannerDots = document.querySelectorAll('.banner-dot');
    bannerDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === bannerCurrentIndex);
    });
}

function startBannerAutoSwipe() {
    stopBannerAutoSwipe();
    bannerAutoSwipeInterval = setInterval(() => {
        goToBannerSlide(bannerCurrentIndex + 1);
    }, 5000);
}

function stopBannerAutoSwipe() {
    clearInterval(bannerAutoSwipeInterval);
}

function resetBannerAutoSwipe() {
    stopBannerAutoSwipe();
    startBannerAutoSwipe();
}

function setupBannerEventListeners() {
    const slidesContainer = document.querySelector('.banner-slides');
    slidesContainer.addEventListener('touchstart', (e) => {
        stopBannerAutoSwipe();
        bannerTouchStartX = e.touches[0].clientX;
        bannerTouchMoveX = bannerTouchStartX;
    }, { passive: true });

    slidesContainer.addEventListener('touchmove', (e) => {
        bannerTouchMoveX = e.touches[0].clientX;
    }, { passive: true });

    slidesContainer.addEventListener('touchend', () => {
        const touchDiff = bannerTouchStartX - bannerTouchMoveX;
        const swipeThreshold = 50; // Minimum pixels to be considered a swipe

        if (touchDiff > swipeThreshold) {
            // Swiped left
            goToBannerSlide(bannerCurrentIndex + 1);
        } else if (touchDiff < -swipeThreshold) {
            // Swiped right
            goToBannerSlide(bannerCurrentIndex - 1);
        }
        startBannerAutoSwipe(); // Always restart the timer after user interaction
    });
}

function updateBalances() {
    const balanceDisplay = document.getElementById('balance'); // Баланс в шапке
    const profileBalanceDisplay = document.getElementById('profile-balance-display'); // Баланс в профиле

    // Обновляем баланс в
    if (balanceDisplay) {
        balanceDisplay.innerHTML = `<img src="${STAR_ICON_URL}" class="balance-icon"> ${currentUser.starBalance.toFixed(0)}`;
    }

    // Обновляем баланс в
    if (profileBalanceDisplay) {
        // Важно: используем innerHTML, чтобы сохранить иконку и добавить значок
        profileBalanceDisplay.innerHTML = `<img src="${STAR_ICON_URL}" alt="Star" class="balance-icon" style="width: 28px; height: 28px; margin-right: 8px;"> <span>${currentUser.starBalance.toFixed(0)}</span>`;
    }
}




function navigateToPage(pageId) {
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(pageId)?.classList.add('active');
    appNavButtons.forEach(b => b.classList.toggle('active', b.dataset.page === pageId));
    if (pageId === 'invite-page') {
        renderInvitedFriendsList();
    }
    if (tgBackButton) {
        if (pageId === 'main-page') {
            clearTgBackButtonStack();
        } else {
            while (backButtonHandlerStack.length > 0 && backButtonHandlerStack[backButtonHandlerStack.length - 1] !== navigateBackToMainPage) {
                popTgBackButtonHandler();
            }
            if (backButtonHandlerStack.length === 0) {
                pushTgBackButtonHandler(navigateBackToMainPage);
            }
        }
    }
    window.scrollTo(0, 0);
}

function updateModalBalanceDisplay() {
    const balanceValueEl = document.getElementById('roulette-modal-balance-value');
    if (balanceValueEl && rouletteModal.classList.contains('active')) {
        // Use the primary starBalance property for consistency
        balanceValueEl.textContent = formatLargeNumber(currentUser.starBalance);
    }
}

function showTGNotification(message, type = 'info') {
    Telegram.WebApp.showAlert?.(message);
    if (Telegram.WebApp.HapticFeedback) {
        if (type === 'success') Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        else if (type === 'error') console.log('1');//Telegram.WebApp.HapticFeedback.notificationOccurred('error');
        else if (type === 'warning') Telegram.WebApp.HapticFeedback.notificationOccurred('warning');
    }
}

// --- Replace the existing checkSubscription function ---
async function checkSubscription() {
    try {
        // This now returns the full object: { is_subscribed: boolean, missing: [...] }
        const response = await apiRequest('/api/check_subscription', 'GET');
        return response;
    } catch (error) {
        console.error("Subscription check failed:", error);
        // Default to allowing action if the API check itself fails
        return { is_subscribed: true, missing: [] };
    }
}

function renderHeader() {
    updateBalances();
}
function updateUIBasedOnWallet(wallet) {
    tonConnectWalletInfo = wallet;
    const connected = !!wallet;
    const tonConnectButtonEl = document.getElementById('ton-connect-button');

    if (connected) {
        const addr = wallet.account.address;
        currentUser.walletAddressRaw = addr;
        const friendlyAddr = TonConnectSDK.toUserFriendlyAddress(addr, wallet.account.chain === TonConnectSDK.CHAIN.TESTNET);
        currentUser.walletAddress = friendlyAddr;

        // Profile page elements
        profileElements.walletAddress.textContent = friendlyAddr;
        profileElements.walletAddress.style.display = 'block';
        profileElements.disconnectWalletButton.style.display = 'block';
        if (tonConnectButtonEl) tonConnectButtonEl.style.display = 'none';

    } else {
        currentUser.walletAddress = null;
        currentUser.walletAddressRaw = null;

        // Profile page elements
        profileElements.walletAddress.textContent = 'Not Connected';
        profileElements.walletAddress.style.display = 'none';
        profileElements.disconnectWalletButton.style.display = 'none';
        if (tonConnectButtonEl) tonConnectButtonEl.style.display = 'block';
    }

    if (dataFetchedSuccessfully) {
        updateBalances();
        renderProfile();
    } else {
        headerElements.starBalanceSpan.textContent = '0';
        const profileBalanceSpan = document.querySelector('#profile-balance-display span');
        if (profileBalanceSpan) {
            profileBalanceSpan.textContent = '0';
        }
    }
}
function renderCasesAndSlots() {
    renderCases();
}
// --- НАЧАЛО: ПОЛНОСТЬЮ ЗАМЕНИТЕ ФУНКЦИЮ renderCases ---
function renderCases() {
    const regularGrid = document.getElementById('cases-grid-regular');
    const limitedGrid = document.getElementById('cases-grid-limited');
    const freeGrid = document.getElementById('cases-grid-free');

    if (!regularGrid || !limitedGrid || !freeGrid) {
        console.error("One or more case grids are missing from the DOM.");
        return;
    }

    regularGrid.innerHTML = '';
    limitedGrid.innerHTML = '';
    freeGrid.innerHTML = '';

    if (!casesData || casesData.length === 0) {
        regularGrid.innerHTML = "<p>Loading cases...</p>";
        return;
    }

    // Очищаем предыдущий интервал, чтобы избежать утечек памяти
    if (dailyCaseInterval) clearInterval(dailyCaseInterval);

    casesData.forEach(caseItem => {
        const card = document.createElement('div');
        card.className = 'case-card';
        card.dataset.caseId = caseItem.id;
        card.onclick = () => openRouletteModal(caseItem);

        const imgCont = document.createElement('div');
        imgCont.className = 'case-image-display';
        const img = document.createElement('img');

        img.src = caseItem.imageFilename; // Теперь все кейсы используют imageFilename
        img.alt = caseItem.name;
        img.loading = 'lazy';
        imgCont.appendChild(img);

        const nameCont = document.createElement('div');
        nameCont.className = 'case-name-container';
        const nameEl = document.createElement('div');
        nameEl.className = 'case-name';
        nameEl.textContent = caseNameTranslations[caseItem.name] || caseItem.name;
        nameCont.appendChild(nameEl);

        card.append(imgCont, nameCont);

        if (caseItem.id === 'daily_case') {
            const freePriceDiv = document.createElement('div');
            freePriceDiv.id = 'daily-case-button'; // ID для управления таймером
            freePriceDiv.className = 'case-price'; // Используем тот же класс для стилей

            card.appendChild(freePriceDiv);
            freeGrid.appendChild(card);

            updateDailyCaseTimer(); // Первый запуск для установки состояния
            dailyCaseInterval = setInterval(updateDailyCaseTimer, 1000); // Запускаем ежесекундное обновление

        } else {
            const priceEl = document.createElement('div');
            priceEl.className = 'case-price';
            const casePriceInStars = Math.floor(caseItem.priceTON * TON_TO_STARS_RATE);
            priceEl.innerHTML = `<img src="${STAR_ICON_URL}" class="balance-icon" style="width: 18px; height: 18px;"> ${formatLargeNumber(casePriceInStars)}`;

            card.appendChild(priceEl);

            if (limitedCaseIds.includes(caseItem.id)) {
                limitedGrid.appendChild(card);
            } else {
                regularGrid.appendChild(card);
            }
        }
    });
}
// --- КОНЕЦ: ПОЛНОСТЬЮ ЗАМЕНИТЕ ФУНКЦИЮ renderCases ---

// START: UPDATED renderProfile FUNCTION
function renderProfile() {
    const profileBalanceDisplay = document.getElementById('profile-balance-display');
    if (profileBalanceDisplay) {
        profileBalanceDisplay.innerHTML = `<img src="${STAR_ICON_URL}" alt="Star" class="balance-icon" style="width: 28px; height: 28px; margin-right: 8px;"> <span>${currentUser.starBalance.toFixed(0)}</span>`;
    }

    // --- Logic to update BOTH avatars (profile page and header) ---
    const profileAvatar = document.getElementById('profile-avatar');
    const headerAvatar = document.getElementById('header-avatar');
    const avatars = [profileAvatar, headerAvatar].filter(el => el != null); // Get both elements if they exist

    avatars.forEach(avatarEl => {
        avatarEl.innerHTML = ''; // Clear previous content
        if (currentUser.photo_url) {
            const img = document.createElement('img');
            img.src = currentUser.photo_url;
            img.alt = currentUser.first_name ? `${currentUser.first_name}'s avatar` : 'User Avatar';
            // Styling is handled by CSS, no need to set it here
            avatarEl.appendChild(img);
        } else {
            avatarEl.textContent = currentUser.first_name ? currentUser.first_name.charAt(0).toUpperCase() : '?';
        }
    });
    // --- End of new avatar logic ---

    profileElements.username.textContent = (currentUser.first_name || currentUser.last_name) ? `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() : currentUser.username || 'User';
    profileElements.userid.textContent = currentUser.id ? `#${currentUser.id}` : '#...';
    renderInventory();
}
// END: UPDATED renderProfile FUNCTION


// In index.html, this function already works correctly with the backend changes. No edits are needed.

// --- ИЗМЕНЕНИЕ: ОБНОВЛЕНА ФУНКЦИЯ РЕНДЕРИНГА ИНВЕНТАРЯ ---
function renderInventory() {
    profileElements.inventoryGrid.innerHTML = '';
    let totalValueInStars = 0;

    if (currentUser.inventory.length === 0) {
        profileElements.emptyInventoryMessage.style.display = 'block';
        profileElements.sellAllButton.style.display = 'none';
    } else {
        profileElements.emptyInventoryMessage.style.display = 'none';

        currentUser.inventory.forEach(item => {
            const itemValueInStars = Math.floor((item.currentValue || 0) * TON_TO_STARS_RATE);
            totalValueInStars += itemValueInStars;

            const itemDiv = document.createElement('div');
            itemDiv.className = 'inventory-item';

            const imgCont = document.createElement('div');
            imgCont.className = 'item-image-display';

            if (item.variant) {
                if (item.variant === 'blackbg') {
                    imgCont.classList.add('black-glow-bg');
                } else if (BG_COLORS_MAP[item.variant]) {
                    const color = BG_COLORS_MAP[item.variant];
                    imgCont.style.background = `radial-gradient(circle, ${color}99 30%, transparent 80%)`;
                }
            }

            const img = document.createElement('img');
            img.src = item.imageFilename || generateImageFilename(item.name);
            img.alt = item.name;
            img.loading = 'lazy';
            imgCont.appendChild(img);

            const nameEl = document.createElement('div');
            nameEl.className = 'inventory-item-name';
            nameEl.title = item.name;
            nameEl.textContent = item.name;

            const valueEl = document.createElement('div');
            valueEl.className = 'inventory-item-value';
            valueEl.innerHTML = `${itemValueInStars} <img src="${STAR_ICON_URL}" class="balance-icon" style="width: 14px; height: 14px; vertical-align: middle;">`;

            const actionsEl = document.createElement('div');
            actionsEl.className = 'inventory-item-actions';
            const isEmojiGift = !!EMOJI_GIFTS[item.name];
            const withdrawButtonDisabledState = isEmojiGift ? 'disabled' : '';
            const withdrawAction = `startWithdrawalProcess(${item.id})`;

            // Обновляем текст и классы кнопок
            actionsEl.innerHTML = `
                <button class="button button-success" onclick="${withdrawAction}" ${withdrawButtonDisabledState}>Вывести</button>
                <button class="button button-secondary" onclick="handleSingleConvert(${item.id})">Продать</button>
            `;

            itemDiv.appendChild(imgCont);
            itemDiv.appendChild(nameEl);
            itemDiv.appendChild(valueEl);
            itemDiv.appendChild(actionsEl);

            profileElements.inventoryGrid.appendChild(itemDiv);
        });

        profileElements.sellAllButton.style.display = 'block';
        profileElements.sellAllValueSpan.textContent = totalValueInStars;
    }
    profileElements.inventoryCount.textContent = currentUser.inventory.length;
}

// --- Replace your existing renderLeaderboard function ---

async function renderLeaderboard() {
    try {
        const leaders = await apiRequest('/api/get_leaderboard');
        leaderboardList.innerHTML = '';
        leaders.forEach(l => {
            const entry = document.createElement('div');
            entry.className = 'leader-entry';
            if (l.user_id === currentUser.id) entry.classList.add('current-user-entry');

            // The 'income' value from the API is now in Stars
            const scoreHtml = `<div class="score">${formatLargeNumber(l.income)} <img src="${STAR_ICON_URL}" class="balance-icon" style="width: 16px; height: 16px; vertical-align: text-bottom;"></div>`;

            entry.innerHTML = `<div class="rank">${l.rank}</div><div class="avatar-placeholder">${l.avatarChar}</div><div class="info"><div class="name">${l.name}</div><div class="details">User ID: ${String(l.user_id).slice(0, 6)}...</div></div>${scoreHtml}`;
            leaderboardList.appendChild(entry);
        });
    } catch (e) {
        leaderboardList.innerHTML = '<p style="text-align:center;color:var(--text-placeholder);padding:20px;">Could not load leaders.</p>';
    }
}
// --- Replace your existing renderInvitePage function ---


// --- НАЧАЛО: ЗАМЕНИТЕ ЭТУ ФУНКЦИЮ ПОЛНОСТЬЮ ---
async function renderInvitePage() {
    const referralLinkInput = inviteElements.referralLink;
    referralLinkInput.value = "Loading..."; // Начальное состояние

    // Загрузка реферальной ссылки (эта часть уже работала корректно)
    try {
        const authData = localStorage.getItem('auth_data');
        if (authData) {
            const response = await apiRequest('/api/getReferalLink', 'POST', {
                auth_data: authData
            });
            if (response.status === 'success' && response.url) {
                referralLinkInput.value = response.url;
            } else {
                referralLinkInput.value = "Failed to load link";
            }
        } else {
            referralLinkInput.value = "Not authenticated";
        }
    } catch (error) {
        referralLinkInput.value = "Error loading link";
    }

    // Загрузка данных о друзьях и заработке (здесь были внесены исправления)
    try {
        const authData = localStorage.getItem('auth_data');
        const payload = authData ? { auth_data: authData } : {};
        const response = await apiRequest('/api/get_invited_friends', 'POST', payload);

        if (response.status === 'success') {
            // ИСПРАВЛЕНО: Используем правильные имена элементов (invitedCount и referralBalance)
            // для вставки данных, полученных от сервера.
            inviteElements.invitedCount.textContent = response.invited_friends_count || 0;
            inviteElements.referralBalance.innerHTML = (response.referral_earnings || 0).toFixed(0) + ` <img src="${STAR_ICON_URL}" class="balance-icon" style="width: 1em; height: 1em; vertical-align: text-bottom;">`;

            // Также обновляем список друзей, если он есть в ответе
            const friendsListContainer = inviteElements.invitedUsersListDisplay;
            friendsListContainer.innerHTML = '';
            if (response.friends && response.friends.length > 0) {
                response.friends.forEach(friend => {
                    const friendItem = document.createElement('div');
                    friendItem.textContent = friend.name || friend.username || `User #${friend.id}`;
                    friendsListContainer.appendChild(friendItem);
                });
            } else {
                friendsListContainer.innerHTML = '<p>No friends invited yet.</p>';
            }
        } else {
            showTGNotification(response.error || 'Failed to load invited friends.', 'error');
        }
    } catch (e) {
        showTGNotification('Error fetching referral data.', 'error');
    }
}
// --- КОНЕЦ: ЗАМЕНИТЕ ЭТУ ФУНКЦИЮ ПОЛНОСТЬЮ ---

async function renderInvitedFriendsList() {
    const listContainer = inviteElements.invitedUsersListDisplay;
    listContainer.innerHTML = '<div class="loader" style="margin: 10px auto; width: 30px; height: 30px;"></div>';
    try {
        const authData = localStorage.getItem('auth_data');
        const payload = authData ? { auth_data: authData } : {};
        const response = await apiRequest('/api/get_invited_friends', "POST", body=payload);
        if (response.friends && response.friends.length > 0) {
            listContainer.innerHTML = '';
            response.friends.forEach(friend => {
                const friendDiv = document.createElement('div');
                friendDiv.textContent = friend.name || `User #${friend.id}`;
                listContainer.appendChild(friendDiv);
            });
        } else {
            listContainer.innerHTML = '<p>No friends invited yet.</p>';
        }
    } catch (error) {
        console.error("Failed to fetch invited friends:", error);
        localStorage.removeItem('auth_data');
        window.location.reload();
        listContainer.innerHTML = '<p style="color: var(--danger-color);">Could not load friends list.</p>';
    }
}

// --- ИЗМЕНЕНИЕ: ОБНОВЛЕНА ФУНКЦИЯ ПОКАЗА ОКНА ВЫИГРЫША ---
// Найдите и ПОЛНОСТЬЮ ЗАМЕНИТЕ эту функцию

function showWinOverlay() { // <-- Убираем все аргументы
    // Функция теперь всегда работает только с глобальной переменной
    if (!lastWonPrizesForOverlay || lastWonPrizesForOverlay.length === 0) {
        console.error("showWinOverlay called with no prize data!");
        return;
    }

    winOverlayPrizeImageContainer.innerHTML = '';
    winOverlayPrizeDetailsEl.innerHTML = '';

    // Используем ваш правильный расчет, но на основе глобальной переменной
    const totalValueInStars = lastWonPrizesForOverlay.reduce((sum, item) => {
        const value = item.stars_price || Math.floor((item.currentValue || 0) * TON_TO_STARS_RATE);
        return sum + value;
    }, 0);

    if (lastWonPrizesForOverlay.length === 1) {
        const prizeItem = lastWonPrizesForOverlay[0];
        winOverlayNameEl.textContent = `Вы выиграли: ${prizeItem.name}!`;
    } else {
        winOverlayNameEl.textContent = `Вы выиграли ${lastWonPrizesForOverlay.length} предмет(а)!`;
    }

    let prizeDetailsHTML = '';
    lastWonPrizesForOverlay.forEach(prizeItem => {
        const img = document.createElement('img');
        img.src = generateImageFilename(prizeItem.imageFilename || prizeItem.name);
        img.alt = prizeItem.name;
        winOverlayPrizeImageContainer.appendChild(img);

        const prizeValueInStars = prizeItem.stars_price || Math.floor((prizeItem.currentValue || 0) * TON_TO_STARS_RATE);
        prizeDetailsHTML += `<div>- ${prizeItem.name} (${prizeValueInStars} <img src="${STAR_ICON_URL}" class="balance-icon" style="width: 12px; height: 12px; vertical-align: middle;">)</div>`;
    });
    winOverlayPrizeDetailsEl.innerHTML = prizeDetailsHTML;

    // Устанавливаем на кнопке точно рассчитанное значение

    winOverlayModal.classList.add('active');
    if (tgBackButton) pushTgBackButtonHandler(closeWinOverlayModalWithBackButton);
    Telegram.WebApp.HapticFeedback?.notificationOccurred('success');
}

function closeWinOverlayModal() {
    if (tgBackButton) popTgBackButtonHandler();
    winOverlayModal.classList.remove('active');
    lastWonPrizesForOverlay = [];
    lastWonPrizesForOverlay = [];
}
function initializeRouletteVisuals(caseItem, multiplier) {
    const allReelContainers = [rouletteReel1, rouletteReel2, rouletteReel3];
    const itemHeight = 80;
    const rouletteRowVisibleHeight = 260;
    allReelContainers.forEach(container => container.classList.remove('active'));
    let availablePrizes = caseItem?.prizes?.length ? caseItem.prizes : [{ name: "Loading..." }];
    const colorKeys = Object.keys(BG_COLORS_MAP);

    for (let i = 0; i < multiplier; i++) {
        const reelContainer = allReelContainers[i];
        if (reelContainer) {
            reelContainer.classList.add('active');
            const spinnerReel = reelContainer.querySelector('.roulette-spinner-reel');
            spinnerReel.innerHTML = '';

            for (let j = 0; j < VISUAL_ITEMS_PER_REEL_INITIAL; j++) {
                const randomPrize = availablePrizes[Math.floor(Math.random() * availablePrizes.length)];
                const itemEl = document.createElement('div');
                itemEl.className = 'roulette-item';

                if (caseItem && caseItem.id === 'black_only_case') {
                    itemEl.classList.add('black-glow-bg');
                } else if (caseItem) {
                    const randomColorName = colorKeys[Math.floor(Math.random() * colorKeys.length)];
                    const color = BG_COLORS_MAP[randomColorName];
                    itemEl.style.background = `radial-gradient(circle, ${color}99 30%, transparent 80%)`;
                }

                const img = document.createElement('img');
                img.src = generateImageFilename(randomPrize.imageFilename || randomPrize.name);
                img.alt = randomPrize.name;
                itemEl.appendChild(img);
                itemEl.dataset.prizeData = JSON.stringify(randomPrize);
                spinnerReel.appendChild(itemEl);
            }
            spinnerReel.style.transition = 'none';
            const middleItemIndex = Math.floor(VISUAL_ITEMS_PER_REEL_INITIAL / 2);
            const initialScrollOffset = (middleItemIndex * itemHeight) + (itemHeight / 2) - (rouletteRowVisibleHeight / 2);
            spinnerReel.style.top = `-${initialScrollOffset}px`;
        }
    }
}
// --- НАЧАЛО: ПОЛНОСТЬЮ ЗАМЕНИТЕ ФУНКЦИЮ openRouletteModal ---
function openRouletteModal(caseItem) {
    currentOpenCaseOrSlot = caseItem;

    const translatedCaseName = caseNameTranslations[caseItem.name] || caseItem.name;
    rouletteCaseName.textContent = translatedCaseName;

    // Проверяем, является ли это бесплатным кейсом
    if (caseItem.id === 'daily_case') {
        selectedCaseMultiplier = 1;
        caseMultiplierSelector.style.display = 'none'; // Скрываем кнопки x1, x2, x3
        spinButton.innerHTML = `Открыть бесплатно`;
        initializeRouletteVisuals(caseItem, 1); // Показываем только один барабан
    } else {
        selectedCaseMultiplier = 1;
        caseMultiplierSelector.style.display = 'flex'; // Показываем кнопки множителя
        updateCaseMultiplierButtons();
        updateSpinButtonText();
    }

    possiblePrizesDisplay.innerHTML = '';
    const sortedPrizes = [...caseItem.prizes].sort((a, b) => (b.floorPrice || 0) - (a.floorPrice || 0));

    sortedPrizes.forEach(pData => {
        if (!pData || !pData.name) return;
        const card = document.createElement('div');
        card.className = 'prize-card';
        let itemValueInTon = pData.floorPrice || 0;
        const displayPriceInStars = Math.floor(itemValueInTon * TON_TO_STARS_RATE);
        const imgCont = document.createElement('div');
        imgCont.className = 'prize-card-image-placeholder';
        if (caseItem.id === 'black_only_case') {
            imgCont.classList.add('black-glow-bg');
        }
        const img = document.createElement('img');
        img.src = generateImageFilename(pData.imageFilename || pData.name);
        img.alt = pData.name;
        imgCont.appendChild(img);
        const priceHTML = `<span class="prize-card-price">${formatLargeNumber(displayPriceInStars)} <img src="${STAR_ICON_URL}" class="balance-icon" style="width: 10px; height: 10px; vertical-align: baseline;"></span>`;
        const nameHTML = `<span class="prize-card-name">${pData.name}</span>`;
        card.innerHTML = `${priceHTML}${nameHTML}`;
        card.insertBefore(imgCont, card.firstChild);
        possiblePrizesDisplay.appendChild(card);
    });

    rouletteModal.classList.add('active');
    updateModalBalanceDisplay();
    if (tgBackButton) pushTgBackButtonHandler(closeRouletteModalWithBackButton);
    Telegram.WebApp.HapticFeedback?.impactOccurred('light');
}
// --- КОНЕЦ: ПОЛНОСТЬЮ ЗАМЕНИТЕ ФУНКЦИЮ openRouletteModal ---

function updateSpinButtonText() {
    if (currentOpenCaseOrSlot && currentOpenCaseOrSlot.priceTON) {
        const priceInStars = Math.floor(currentOpenCaseOrSlot.priceTON * TON_TO_STARS_RATE);
        const totalPrice = priceInStars * selectedCaseMultiplier;
        spinButton.innerHTML = `Spin ${selectedCaseMultiplier}x (${totalPrice} <img src="${STAR_ICON_URL}" class="balance-icon" style="width: 16px; height: 16px;">)`;
    }
}
function updateCaseMultiplierButtons() {
    caseMultiplierSelector.querySelectorAll('button').forEach(btn => {
        btn.classList.toggle('active-multiplier', parseInt(btn.dataset.multiplier) === selectedCaseMultiplier);
        if (parseInt(btn.dataset.multiplier) === selectedCaseMultiplier) btn.classList.remove('button-secondary');
        else btn.classList.add('button-secondary');
    });
    initializeRouletteVisuals(currentOpenCaseOrSlot, selectedCaseMultiplier);
}
function closeRouletteModal() {
    if (tgBackButton) popTgBackButtonHandler();
    rouletteModal.classList.remove('active');
    currentOpenCaseOrSlot = null;
    if (spinAnimationTimeoutOuter) clearTimeout(spinAnimationTimeoutOuter);
    const allReelContainers = [rouletteReel1, rouletteReel2, rouletteReel3];
    allReelContainers.forEach(container => container.classList.remove('active'));

    // --- НАЧАЛО ИЗМЕНЕНИЙ ---
    // Принудительно обновляем состояние таймера на главном экране
    updateDailyCaseTimer();
    // И перезапускаем интервал, чтобы отсчет шел корректно
    if (dailyCaseInterval) clearInterval(dailyCaseInterval);
    dailyCaseInterval = setInterval(updateDailyCaseTimer, 1000);
    // --- КОНЕЦ ИЗМЕНЕНИЙ ---
}
function getItemValue(prizeObject) {
    if (prizeObject.is_ton_prize) {
        return prizeObject.currentValue || prizeObject.value || 0;
    }
    return prizeObject.floorPrice || prizeObject.currentValue || 0;
}

// --- НАЧАЛО: ПОЛНОСТЬЮ ЗАМЕНИТЕ ФУНКЦИЮ spinRoulette ---
async function spinRoulette() {
    if (!currentOpenCaseOrSlot) return;

    spinButton.disabled = true;
    spinButton.textContent = 'Вращение...';
    Telegram.WebApp.HapticFeedback?.impactOccurred('light');

    // --- ЛОГИКА ДЛЯ БЕСПЛАТНОГО КЕЙСА ---
    if (currentOpenCaseOrSlot.id === 'daily_case') {
        const lastOpenedTime = currentUser.last_free_case_opened ? new Date(currentUser.last_free_case_opened).getTime() : 0;
        if (Date.now() - lastOpenedTime < 24 * 60 * 60 * 1000) {
            showTGNotification("Бесплатный кейс еще не доступен.", "warning");
            spinButton.disabled = false;
            spinButton.innerHTML = "Открыть бесплатно";
            return;
        }

        const activeSpinner = rouletteReel1.querySelector('.roulette-spinner-reel');
        const availablePrizes = currentOpenCaseOrSlot.prizes;
        const itemHeight = 80;
        const centerOffset = (260 / 2);

        activeSpinner.style.transition = 'none';
        void activeSpinner.offsetWidth;
        for (let j = 0; j < VISUAL_ITEMS_PER_REEL_SPIN_BUFFER; j++) {
            const randomPrize = availablePrizes[Math.floor(Math.random() * availablePrizes.length)];
            const itemEl = document.createElement('div');
            itemEl.className = 'roulette-item';
            const img = document.createElement('img');
            img.src = generateImageFilename(randomPrize.imageFilename || randomPrize.name);
            img.alt = randomPrize.name;
            itemEl.appendChild(img);
            activeSpinner.appendChild(itemEl);
        }

        try {
            const authData = localStorage.getItem('auth_data');
            const result = await apiRequest('/api/open_free_case', 'POST', { auth_data: authData });

            if (result.status === 'success' && result.won_prize) {
                if (typeof result.unixtime === 'number') {
                    currentUser.next_free_case_time = result.unixtime;
                } else {
                    currentUser.next_free_case_time = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
                }

                updateDailyCaseTimer();
                if (dailyCaseInterval) clearInterval(dailyCaseInterval);
                dailyCaseInterval = setInterval(updateDailyCaseTimer, 1000);

                const prize = result.won_prize;
                const processedPrize = {
                    ...prize,
                    id: prize.id || Date.now(),
                    imageFilename: prize.image || generateImageFilename(prize.name),
                    currentValue: (prize.stars_price || 0) / TON_TO_STARS_RATE
                };

                const currentReelItems = Array.from(activeSpinner.children);
                const landingSpotIndex = VISUAL_ITEMS_PER_REEL_INITIAL + Math.floor(VISUAL_ITEMS_PER_REEL_SPIN_BUFFER / 2);
                const targetEl = currentReelItems[landingSpotIndex];
                if (targetEl) {
                    targetEl.querySelector('img').src = processedPrize.imageFilename;
                    targetEl.querySelector('img').alt = processedPrize.name;
                }

                let scrollDist = (landingSpotIndex * itemHeight) + (itemHeight / 2) - centerOffset;
                activeSpinner.style.transition = `top 6s cubic-bezier(0.25, 0.1, 0.2, 1)`;
                activeSpinner.style.top = `-${scrollDist}px`;

                setTimeout(() => {
                    lastWonPrizesForOverlay = [processedPrize]; // Обновляем глобальную переменную
                    showWinOverlay(); // Вызываем без аргументов
                    spinButton.disabled = false;
                    spinButton.innerHTML = "Открыть бесплатно";
                }, 6100);

            } else {
                throw new Error(result.error || 'Не удалось открыть кейс.');
            }
        } catch (e) {
            showTGNotification(e.message, "error");
            spinButton.disabled = false;
            spinButton.innerHTML = "Открыть бесплатно";
        }
        return;
    }

    // --- ЛОГИКА ДЛЯ ПЛАТНЫХ КЕЙСОВ ---
    const costInStars = Math.floor((currentOpenCaseOrSlot.priceTON || 0) * TON_TO_STARS_RATE * selectedCaseMultiplier);

    if (currentUser.starBalance < costInStars) {
        showTGNotification(`Недостаточно звезд. Необходимо ${costInStars}.`, "error");
        spinButton.disabled = false;
        updateSpinButtonText();
        return;
    }

    currentUser.starBalance -= costInStars;
    updateBalances();
    updateModalBalanceDisplay();

    try {
        const authData = localStorage.getItem('auth_data');
        const result = await apiRequest('/api/open_case', 'POST', {
            case_id: currentOpenCaseOrSlot.id,
            multiplier: selectedCaseMultiplier,
            auth_data: authData,
            x: selectedCaseMultiplier
        });

        if (result.status !== 'success' || !result.won_prizes || !result.won_prizes.length) {
            throw new Error(result.error || 'Не удалось получить выигрыш с сервера.');
        }

        if (typeof result.new_balance_stars === 'number') {
            currentUser.starBalance = result.new_balance_stars;
            updateBalances();
            updateModalBalanceDisplay();
        }

        // --- ИЗМЕНЕНИЕ ЗДЕСЬ ---
        const processedPrizes = result.won_prizes.map((prize, index) => {
            // Ищем данные оригинального приза из настроек кейса по имени
            const originalPrizeData = currentOpenCaseOrSlot.prizes.find(p => p.name === prize.name);

            // Если нашли, используем его ссылку на картинку. Если нет, генерируем (как запасной вариант).

            return {
                ...prize,
                id: prize.id || (Date.now() + index),
                imageFilename: prize.img_url,
                currentValue: (prize.stars_price || 0) / TON_TO_STARS_RATE
            };
        });
        // --- КОНЕЦ ИЗМЕНЕНИЯ ---

        const allReelContainers = [rouletteReel1, rouletteReel2, rouletteReel3];
        const activeSpinners = allReelContainers.filter(container => container.classList.contains('active')).map(container => container.querySelector('.roulette-spinner-reel'));
        const availablePrizes = currentOpenCaseOrSlot.prizes;
        const itemHeight = 80;
        const centerOffset = (260 / 2);

        activeSpinners.forEach((spinnerReel, index) => {
            const actualWonPrizeData = processedPrizes[index];
            if (!actualWonPrizeData) return;

            spinnerReel.style.transition = 'none';
            void spinnerReel.offsetWidth;

            const initialItemCount = spinnerReel.children.length;
            const fragment = document.createDocumentFragment();

            for (let j = 0; j < VISUAL_ITEMS_PER_REEL_SPIN_BUFFER; j++) {
                const randomPrize = availablePrizes[Math.floor(Math.random() * availablePrizes.length)];
                const itemEl = document.createElement('div');
                itemEl.className = 'roulette-item';
                const img = document.createElement('img');
                img.src = generateImageFilename(randomPrize.imageFilename || randomPrize.name);
                img.alt = randomPrize.name;
                itemEl.appendChild(img);
                fragment.appendChild(itemEl);
            }

            const winnerEl = document.createElement('div');
            winnerEl.className = 'roulette-item';
            const winnerImg = document.createElement('img');
            winnerImg.src = actualWonPrizeData.imageFilename; // Используем правильную ссылку
            winnerImg.alt = actualWonPrizeData.name;
            winnerEl.appendChild(winnerImg);
            fragment.appendChild(winnerEl);

            for (let j = 0; j < 10; j++) {
                const randomPrize = availablePrizes[Math.floor(Math.random() * availablePrizes.length)];
                const itemEl = document.createElement('div');
                itemEl.className = 'roulette-item';
                const img = document.createElement('img');
                img.src = generateImageFilename(randomPrize.imageFilename || randomPrize.name);
                img.alt = randomPrize.name;
                itemEl.appendChild(img);
                fragment.appendChild(itemEl);
            }

            spinnerReel.appendChild(fragment);

            const landingIndex = initialItemCount + VISUAL_ITEMS_PER_REEL_SPIN_BUFFER;
            let finalScrollDist = (landingIndex * itemHeight) + (itemHeight / 2) - centerOffset;

            setTimeout(() => {
                spinnerReel.style.transition = `top 6s cubic-bezier(0.25, 0.1, 0.2, 1)`;
                spinnerReel.style.top = `-${finalScrollDist}px`;
            }, 100);
        });

        setTimeout(() => {
            lastWonPrizesForOverlay = processedPrizes;
            showWinOverlay();
            spinButton.disabled = false;
            updateSpinButtonText();
        }, 6100);

    } catch (e) {
        showTGNotification(e.message, "error");
        currentUser.starBalance += costInStars;
        updateBalances();
        updateModalBalanceDisplay();
        spinButton.disabled = false;
        updateSpinButtonText();
    }
}
// --- КОНЕЦ: ПОЛНОСТЬЮ ЗАМЕНИТЕ ФУНКЦИЮ spinRoulette ---

async function loadUserInventory() {
    const authData = localStorage.getItem('auth_data');
    if (!authData) {
        console.error("Cannot load inventory without auth data.");
        return;
    }

    try {
        const response = await apiRequest('/api/get_my_inventory', 'POST', { auth_data: authData });

        if (response.status === 'success' && Array.isArray(response.list)) {
            currentUser.inventory = response.list.map(itemFromServer => ({
                id: itemFromServer.id,
                name: itemFromServer.name,
                is_emoji_gift: itemFromServer.is_emoji_gift,
                currentValue: (itemFromServer.stars_price || 0) / TON_TO_STARS_RATE,
                imageFilename: itemFromServer.img_url || generateImageFilename(itemFromServer.name)
            }));
        } else {
            console.error("Failed to parse inventory from server:", response.error || "Invalid format");
            currentUser.inventory = [];
        }
    } catch (error) {
        console.error("API error fetching inventory:", error);
        showTGNotification("Не удалось загрузить вашу коллекцию.", "error");
        currentUser.inventory = [];
    }
}

async function handleSingleConvert(itemId) {
    const itemInInventory = currentUser.inventory.find(i => i.id === itemId);
    if (!itemInInventory) return;

    const itemValueInStars = Math.floor((itemInInventory.currentValue || 0) * TON_TO_STARS_RATE);
    const success = await convertItemToStars(itemId);
    if (success) {
        // showTGNotification(`Предмет продан за ${itemValueInStars} звёзд!`, 'success');
        updateBalances();
        renderInventory();
    }
}

// Найдите эту функцию и ПОЛНОСТЬЮ ЗАМЕНИТЕ её на код ниже
async function convertItemToStars(itemId) {
    // Эта проверка остается, она не позволяет продавать TON призы
    const itemInInventory = currentUser.inventory.find(i => i.id === itemId);
    if (itemInInventory && itemInInventory.is_ton_prize) {
        showTGNotification("Cannot convert TON prize.", "info");
        return false;
    }

    try {
        // --- НАЧАЛО ИЗМЕНЕНИЙ ---

        // 1. Получаем auth_data из localStorage
        const authData = localStorage.getItem('auth_data');
        if (!authData) {
            showTGNotification("Authorization error. Please reload the app.", 'error');
            return false;
        }

        //    с новым форматом тела JSON.
        const res = await apiRequest('/api/sell_won_items', 'POST', {
            auth_data: authData,
            item_ids: [parseInt(itemId)] // Передаем ID в виде списка с одним элементом
        });

        // 3. Обрабатываем ответ сервера
        if (res.status === 'success') {
            // Предполагаем, что сервер вернет новый баланс в звездах
            if (typeof res.new_balance_stars === 'number') {
                 currentUser.starBalance = res.new_balance_stars;
            } else if (typeof res.new_balance === 'number') {
                 // Добавим запасной вариант, если ключ будет просто 'new_balance'
                 currentUser.starBalance = res.new_balance;
            }

            // Удаляем проданный предмет из локального инвентаря
            currentUser.inventory = currentUser.inventory.filter(i => i.id !== parseInt(itemId));
            return true; // Возвращаем true для индикации успеха
        } else {
            // Если сервер вернул ошибку
            showTGNotification(res.error || res.message || 'Failed to sell item.', 'error');
            return false;
        }
        // --- КОНЕЦ ИЗМЕНЕНИЙ ---

    } catch (e) {
        // Обработка ошибок сети или HTTP-статусов
        showTGNotification("Sell request failed.", "error");
        return false;
    }
}

// --- НОВАЯ ФУНКЦИЯ: ОБРАБОТЧИК КНОПКИ "ПРОДАТЬ" В ОКНЕ ВЫИГРЫША ---
// Добавьте эту НОВУЮ функцию в ваш script.js

// Найдите и ПОЛНОСТЬЮ ЗАМЕНИТЕ эту функцию

// Найдите и ПОЛНОСТЬЮ ЗАМЕНИТЕ эту функцию

// Найдите эту функцию и ПОЛНОСТЬЮ ЗАМЕНИТЕ её на код ниже

// Найдите и ПОЛНОСТЬЮ ЗАМЕНИТЕ эту функцию

async function handleSellAllWonItems() {
    if (lastWonPrizesForOverlay.length === 0) {
        showTGNotification("Нет предметов для продажи.", "warning");
        return;
    }

    const itemIdsToSell = lastWonPrizesForOverlay
        .filter(p => p.id)
        .map(item => item.id);

    if (itemIdsToSell.length === 0) {
        showTGNotification("Не удалось найти предметы для продажи.", "error");
        closeWinOverlayModal();
        return;
    }

    // --- ИЗМЕНЕНИЕ: ИСПОЛЬЗУЕМ ТОТ ЖЕ ТОЧНЫЙ РАСЧЕТ ЗДЕСЬ ---
    const totalValueInStars = lastWonPrizesForOverlay.reduce((sum, item) => {
        const value = item.stars_price || Math.floor((item.currentValue || 0) * TON_TO_STARS_RATE);
        return sum + value;
    }, 0);
    // --- КОНЕЦ ИЗМЕНЕНИЯ ---

    const confirmationMessage = `Вы уверены, что хотите продать все предметы за ${totalValueInStars} звёзд?`;

    Telegram.WebApp.showConfirm(confirmationMessage, async (ok) => {
        if (!ok) {
            return;
        }

        const originalButtonHTML = winOverlaySellBtn.innerHTML;
        winOverlaySellBtn.disabled = true;
        winOverlaySellBtn.innerHTML = 'Продажа...';

        try {
            const result = await handleSellWonItems(itemIdsToSell);
            if (result.success) {
                // showTGNotification(`Предметы (${result.count} шт.) успешно проданы!`, 'success');
            } else {
                showTGNotification(result.message, 'error');
            }
        } catch (error) {
            console.error("Критическая ошибка в процессе продажи:", error);
            showTGNotification("Произошла критическая ошибка.", 'error');
        } finally {
            updateBalances();
            renderInventory();
            updateModalBalanceDisplay();
            winOverlaySellBtn.disabled = false;
            winOverlaySellBtn.innerHTML = originalButtonHTML;
            closeWinOverlayModal();
        }
    });
}

async function handleSellWonItems(itemIds) {
    // Проверка, что есть что продавать
    if (!itemIds || itemIds.length === 0) {
        return { success: false, message: "No items to sell." };
    }

    try {
        const authData = localStorage.getItem('auth_data');
        if (!authData) {
            return { success: false, message: "Authorization error." };
        }

        // Отправляем запрос с полным списком ID
        const res = await apiRequest('/api/sell_won_items', 'POST', {
            auth_data: authData,
            item_ids: itemIds
        });

        // Проверяем ответ сервера и наличие нового баланса
        if (res.status === 'success' && typeof res.new_balance_stars === 'number') {
            // УСПЕХ: Обновляем баланс
            currentUser.starBalance = res.new_balance_stars;

            // Удаляем все проданные предметы из локального инвентаря
            const soldIds = new Set(itemIds);
            currentUser.inventory = currentUser.inventory.filter(item => !soldIds.has(item.id));

            return { success: true, count: itemIds.length };
        } else {
            // ОШИБКА: Сервер вернул ошибку или некорректные данные
            return { success: false, message: res.error || "Failed to update balance from server." };
        }
    } catch (e) {
        // ОШИБКА: Проблема с сетью или сам запрос не удался
        return { success: false, message: "Sell request failed." };
    }
}

// --- НОВАЯ ФУНКЦИЯ: ОБРАБОТЧИК КНОПКИ "ЗАБРАТЬ" В ОКНЕ ВЫИГРЫША ---
function handleClaimWonItems() {
    if (lastWonPrizesForOverlay.length > 0) {
        lastWonPrizesForOverlay.forEach(item => {
            currentUser.inventory.push(item);
        });
        renderInventory();
        // showTGNotification("Предмет(ы) добавлены в коллекцию!", "success");
    }
    closeWinOverlayModal();
}


// Найдите и ПОЛНОСТЬЮ ЗАМЕНИТЕ эту функцию
async function handleUpgrade() {
    if (!selectedItemForUpgrade || !desiredItemForUpgrade) {
        showTGNotification("Please select both your item and the desired item.", 'warning');
        return;
    }

    upgradePageElements.doUpgradeButton.disabled = true;
    upgradePageElements.doUpgradeButton.textContent = "Upgrading...";
    Telegram.WebApp.HapticFeedback?.impactOccurred('medium');

    try {
        const authToken = localStorage.getItem('auth_data');
        if (!authToken) {
            showTGNotification("Ошибка авторизации. Перезагрузите приложение.", 'error');
            upgradePageElements.doUpgradeButton.disabled = false;
            return;
        }

        const res = await apiRequest('/api/upgrade_item_v2', 'POST', {
            auth_data: authToken,
            inventory_item_id: selectedItemForUpgrade.id,
            nft_name: desiredItemForUpgrade.name
        });

        await startUpgradeAnimation(res.win);

        if (res.win) {
            const upgradedItemData = {
                id: Date.now(),
                name: desiredItemForUpgrade.name,
                imageFilename: res.new_item.img_url,
                currentValue: desiredItemForUpgrade.floorPrice,
                is_emoji_gift: false
            };

            currentUser.inventory = currentUser.inventory.filter(i => i.id !== selectedItemForUpgrade.id);
            currentUser.inventory.push(upgradedItemData);

            showUpgradeResultModal(true, selectedItemForUpgrade, upgradedItemData);

        } else {
            currentUser.inventory = currentUser.inventory.filter(i => i.id !== selectedItemForUpgrade.id);
            showUpgradeResultModal(false, selectedItemForUpgrade, null);
        }

        renderProfile();
        updateBalances();

    } catch (e) {
        console.error("Upgrade error:", e);
        showTGNotification("An error occurred during upgrade. Please try again.", "error");
        const pointer = document.getElementById('upgrade-chance-pointer-new');
        if(pointer) {
            pointer.style.transition = 'none';
            pointer.style.transform = `translateX(-50%) rotate(0deg)`;
        }
    }
}


async function sellAllItems() {
    const sellableItems = currentUser.inventory.filter(i => !i.is_ton_prize);
    if (!sellableItems.length) {
        showTGNotification("No sellable items.", "info");
        return;
    }

    const valInStars = parseFloat(profileElements.sellAllValueSpan.textContent);
    const confirmationMessage = `Продать все предметы за ${valInStars} звёзд?`;

    if (Telegram.WebApp.showConfirm) {
        Telegram.WebApp.showConfirm(confirmationMessage, async (ok) => {
            if (ok) doSellAll();
        });
    } else if (confirm(confirmationMessage)) {
        doSellAll();
    }
}
async function doSellAll() {
    const authData = localStorage.getItem('auth_data');
    if (!authData) {
        showTGNotification("Ошибка авторизации. Пожалуйста, перезагрузите приложение.", 'error');
        return;
    }

    try {
        const res = await apiRequest('/api/sell_all_items', 'POST', { auth_data: authData });

        if (res.status === 'success') {
            if (typeof res.new_balance_stars === 'number') {
                 currentUser.starBalance = res.new_balance_stars;
            }

            currentUser.inventory = currentUser.inventory.filter(i => i.is_ton_prize);

            updateBalances();
            renderInventory();
            showTGNotification(res.message || "Все предметы успешно проданы!", "success");
        } else {
            showTGNotification(res.message || "Не удалось продать предметы.", "error");
        }
    } catch (e) {
        showTGNotification("Ошибка запроса на продажу предметов.", "error");
    }
}

function startWithdrawalProcess(inventoryItemId) {
    const item = currentUser.inventory.find(i => i.id === parseInt(inventoryItemId));
    if (!item) {
        showTGNotification("Item not found.", "error");
        return;
    }
    itemToWithdraw = item;

    const isEmoji = !!EMOJI_GIFTS[item.name];
    const withdrawItemNameEl = document.getElementById('withdraw-item-name');
    const modalBodyParagraph = withdrawModal.querySelector('.modal-body p');

    withdrawItemNameEl.textContent = item.name;

    if (isEmoji) {
        modalBodyParagraph.innerHTML = `Are you sure you want to withdraw your <strong>${item.name}</strong>? It will be sent directly to your chat with the bot.`;
    } else {
        modalBodyParagraph.innerHTML = `Are you sure you want to request a withdrawal for <strong>${item.name}</strong>? An administrator will process your request shortly.`;
    }

    withdrawModal.classList.add('active');
    if (tgBackButton) pushTgBackButtonHandler(closeWithdrawModal);
}
function closeWithdrawModal() {
    if (tgBackButton) popTgBackButtonHandler();
    withdrawModal.classList.remove('active');
    itemToWithdraw = null;
}


async function loadUserBalance() {
    const authData = localStorage.getItem('auth_data');
    if (!authData) {
        showTGNotification("No auth data found. Please log in again.", 'error');
        return;
    }
    try {
        const payload = { auth_data: authData };
        const response = await apiRequest('/api/get_balance', 'POST', payload);
        console.log('Balance API response:', response); // Debug log
        if (response.status === 'success') {
            currentUser.starBalance = response.balance ?? 0; // Update star balance
            updateBalances(); // Refresh UI
        } else {
            console.log('Non-success response:', response); // Debug log
            showTGNotification(response, 'error');
            localStorage.removeItem('auth_data');
            window.location.reload();
        }
    } catch (error) {
        console.error('Error loading balance:', error); // Debug log
        showTGNotification("Error loading balance.", 'error');
        localStorage.removeItem('auth_data'); // Treat errors as bad responses
        window.location.reload();
    }
}

async function initiateDepositProcedure(type) {
    if (type === 'stars') {
        try {
            const authData = localStorage.getItem('auth_data');
            if (!authData) {
                showTGNotification("No auth data found. Please log in again.", 'error');
                return;
            }
            const amountInput = profileElements.depositAmountInput;
            const amountStr = amountInput.value.trim();

            if (!amountStr) {
                showTGNotification("Please enter an amount to deposit.", "warning");
                return;
            }
            const amount = parseFloat(amountStr);
            if (isNaN(amount) || amount <= 0) {
                showTGNotification("Please enter a valid number of stars.", 'error');
                return;
            }
            const response = await apiRequest('/api/initiate_stars_deposit', 'POST', { auth_data: authData, amount: amount});
            if (response.status === 'success') {
                starsDepositPayload = response.payload; // Save the payload
                Telegram.WebApp.openInvoice(response.invoice_link, (status) => {
                    if (status === 'paid') {
                        // showTGNotification('Deposit successful! Your balance will be updated.', 'success');
                        setTimeout(async () => {
                            if (!authData || !starsDepositPayload) {
                                showTGNotification("Missing auth data or payload.", 'error');
                                return;
                            }
                            try {
                                const payload = { auth_data: authData, payload: starsDepositPayload };
                                const checkResponse = await apiRequest('/api/check_star_transaction', 'POST', payload);
                                if (checkResponse.message === 'success') {
                                    currentUser.starBalance = checkResponse.new_balance;
                                    updateBalances();
                                    renderProfile();
                                    starsDepositPayload = null;
                                } else {
                                    showTGNotification(checkResponse.error || 'Failed to verify transaction.', 'error');
                                }
                            } catch (error) {
                                showTGNotification('Error verifying transaction.', 'error');
                            }
                        }, 3000);
                    }
                });
            } else {
                showTGNotification(response.error || 'Failed to initiate deposit.', 'error');
            }
        } catch (error) {
            showTGNotification('Error initiating deposit.', 'error');
        }
    } else if (type === 'gifts') {
        renderGiftPricesList();
        giftDepositModal.classList.add('active');
    }
}

function startDepositExpiryTimer(expiresISO) {
    if (depositExpiryInterval) clearInterval(depositExpiryInterval);
    const expiry = new Date(expiresISO).getTime();
    function update() {
        const now = new Date().getTime();
        const dist = expiry - now;
        if (dist < 0) {
            clearInterval(depositExpiryInterval);
            depositExpiryInfo.textContent = "Expired.";
            confirmPaymentSentButton.disabled = true;
            tonTransferLink.classList.add('button-secondary');
            return;
        }
        const m = Math.floor((dist % (1e3 * 60 * 60)) / (1e3 * 60));
        const s = Math.floor((dist % (1e3 * 60)) / 1e3);
        depositExpiryInfo.textContent = `Expires in ${m}m ${s}s.`;
        tonTransferLink.classList.remove('button-secondary');
    }
    update();
    depositExpiryInterval = setInterval(update, 1e3);
}
async function verifyPaymentSent() {
    if (!currentPendingDepositId) {
        showTGNotification("No deposit.", "error");
        return;
    }
    confirmPaymentSentButton.disabled = true;
    confirmPaymentSentButton.textContent = "Verifying...";
    depositLoader.style.display = 'block';
    depositStatusMessageEl.textContent = 'Checking...';
    try {
        const res = await apiRequest('/api/verify_deposit', 'POST', { pending_deposit_id: currentPendingDepositId });
        if (res.status === 'success') {
            showTGNotification(res.message, 'success');
            currentUser.tonBalance = res.new_balance_ton;
            currentUser.starBalance = Math.floor((res.new_balance_ton || 0) * TON_TO_STARS_RATE);
            updateBalances();
            renderProfile();
            closeDepositInstructionsModal();
        } else if (res.status === 'pending') {
            depositStatusMessageEl.textContent = res.message;
            confirmPaymentSentButton.disabled = false;
            confirmPaymentSentButton.textContent = "Check Again";
        } else {
            showTGNotification(res.message || "Failed.", "error");
            depositStatusMessageEl.textContent = res.message || "Failed.";
            if (res.status === 'expired') tonTransferLink.classList.add('button-secondary');
            else {
                confirmPaymentSentButton.disabled = false;
                confirmPaymentSentButton.textContent = "Try Again";
            }
        }
    } catch (e) {
        depositStatusMessageEl.textContent = 'Error verifying.';
        confirmPaymentSentButton.disabled = false;
        confirmPaymentSentButton.textContent = "Try Again";
        showTGNotification("Verification request failed.", "error");
    } finally {
        if (depositLoader.style.display === 'block' && !depositStatusMessageEl.textContent.includes('Checking')) depositLoader.style.display = 'none';
    }
}
function closeDepositInstructionsModal() {
    if (tgBackButton) popTgBackButtonHandler();
    depositInstructionsModal.classList.remove('active');
    if (depositExpiryInterval) clearInterval(depositExpiryInterval);
    currentPendingDepositId = null;
    profileElements.depositAmountInput.value = '';
    tonTransferLink.href = '#';
    depositStatusMessageEl.textContent = '';
    depositLoader.style.display = 'none';
    depositExpiryInfo.textContent = '';
    depositWalletAddressEl.textContent = '';
    depositCommentTextEl.textContent = '';
}

// Найдите эту функцию и ПОЛНОСТЬЮ ЗАМЕНИТЕ её на код ниже

async function redeemPromocode() {
    const code = profileElements.promocodeInput.value.trim();
    if (!code) {
        showTGNotification("Please enter a promocode.", "warning");
        return;
    }

    profileElements.redeemPromocodeButton.disabled = true;

    try {
        // 1. Получаем auth_data из localStorage
        const authData = localStorage.getItem('auth_data');
        if (!authData) {
            showTGNotification("Authorization error. Please reload the app.", 'error');
            profileElements.redeemPromocodeButton.disabled = false;
            return;
        }

        // 2. Отправляем запрос на новый эндпоинт (/api/use_promo) с новым форматом тела
        const res = await apiRequest('/api/use_promo', 'POST', {
            auth_data: authData,
            promo: code
        });

        // 3. Обрабатываем новые варианты ответа от сервера
        if (res.status === 'success') {
            // Положительный ответ
            currentUser.starBalance = res.new_balance; // Обновляем баланс звезд
            updateBalances(); // Обновляем отображение баланса во всем интерфейсе
            showTGNotification("Промокод успешно активирован!", 'success');
            profileElements.promocodeInput.value = ''; // Очищаем поле ввода, как вы и просили
        } else if (res.error) {
            // Отрицательный ответ (например, {'error': '...'})
            showTGNotification(res.error, "error"); // Показываем текст ошибки с сервера
        } else {
            // Обработка других непредвиденных случаев
            showTGNotification("An unknown error occurred.", "error");
        }

    } catch (e) {
        // Эта часть сработает, если сервер вернет ошибку HTTP (например, 404 или 500)
        // или если произойдет ошибка сети.
        // Наша функция apiRequest уже извлекает текст ошибки, так что просто покажем его.
        showTGNotification(e.message || "Promocode request failed.", "error");
    } finally {
        // В любом случае (успех или провал) снова делаем кнопку активной
        profileElements.redeemPromocodeButton.disabled = false;
    }
}

function populateAllAppGifts() {
    const uniqueGifts = new Map();
    casesData.forEach(caseItem => {
        caseItem.prizes.forEach(prize => {
            if (prize.name && prize.name !== 'Nothing' && !prize.is_ton_prize) {
                if (!uniqueGifts.has(prize.name)) {
                    uniqueGifts.set(prize.name, {
                        name: prize.name,
                        imageFilename: prize.imageFilename || generateImageFilename(prize.name),
                        floorPrice: UPDATED_FLOOR_PRICES_FRONTEND[prize.name] || 0
                    });
                }
            }
        });
    });
    for (const name in UPDATED_FLOOR_PRICES_FRONTEND) {
        if (!uniqueGifts.has(name) && name !== 'Nothing') {
             uniqueGifts.set(name, {
                name: name,
                imageFilename: generateImageFilename(name),
                floorPrice: UPDATED_FLOOR_PRICES_FRONTEND[name]
            });
        }
    }
    allAppGiftsForUpgrade = Array.from(uniqueGifts.values()).sort((a,b) => a.floorPrice - b.floorPrice);
}

async function openUpgradeItemPicker(type) {
    currentUpgradePickerType = type;
    upgradePageElements.upgradeItemsGrid.innerHTML = '<div class="loader" style="margin: 20px auto;"></div>';
    upgradePageElements.upgradePickerContainer.style.display = 'block';

    if (type === 'inventory') {
        upgradePageElements.upgradePickerTitle.textContent = "Select Your Item from Inventory";
        const userInventoryForUpgrade = currentUser.inventory.filter(item => !item.is_ton_prize && item.currentValue > 0);
        upgradePageElements.upgradeItemsGrid.innerHTML = '';
        if (userInventoryForUpgrade.length === 0) {
            upgradePageElements.upgradeItemsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--text-placeholder);">Your inventory is empty or has no upgradable items.</p>';
        } else {
            userInventoryForUpgrade.forEach(item => {
                const card = createUpgradeableItemCard(item, 'inventory');
                upgradePageElements.upgradeItemsGrid.appendChild(card);
            });
        }
    } else if (type === 'desired') {
        if (!selectedItemForUpgrade) {
            showTGNotification("Please select your item first.", "warning");
            closeUpgradeItemPicker();
            return;
        }
        upgradePageElements.upgradePickerTitle.textContent = "Select Desired Item";

        const allPossibleUpgrades = await fetchAllPossibleUpgrades();
        upgradePageElements.upgradeItemsGrid.innerHTML = '';

        const potentialDesiredItems = allPossibleUpgrades.filter(
            gift => gift.floorPrice > selectedItemForUpgrade.currentValue
        );

        if (potentialDesiredItems.length === 0) {
            upgradePageElements.upgradeItemsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--text-placeholder);">No items available for upgrade with higher value.</p>';
        } else {
             potentialDesiredItems.forEach(gift => {
                const card = createUpgradeableItemCard(gift, 'desired');
                upgradePageElements.upgradeItemsGrid.appendChild(card);
            });
        }
    }
}

function closeUpgradeItemPicker() {
    upgradePageElements.upgradePickerContainer.style.display = 'none';
    currentUpgradePickerType = null;
}
function createUpgradeableItemCard(itemData, type) {
    const card = document.createElement('div');
    card.className = 'inventory-item';
    const imgCont = document.createElement('div');
    imgCont.className = 'item-image-display';
    const img = document.createElement('img');
    img.src = itemData.imageFilename || generateImageFilename(itemData.name);
    img.alt = itemData.name;
    imgCont.appendChild(img);
    const nameEl = document.createElement('div');
    nameEl.className = 'inventory-item-name';
    nameEl.textContent = itemData.name;
    const valueEl = document.createElement('div');
    valueEl.className = 'inventory-item-value';

    const valueInStars = Math.floor((type === 'inventory' ? itemData.currentValue : itemData.floorPrice) * TON_TO_STARS_RATE);
    valueEl.innerHTML = `${valueInStars} <img src="${STAR_ICON_URL}" class="balance-icon" style="width: 12px; height: 12px; vertical-align: middle;">`;

    const actionsEl = document.createElement('div');
    actionsEl.className = 'inventory-item-actions';
    const selectBtn = document.createElement('button');
    selectBtn.className = 'button';
    selectBtn.textContent = 'Select';
    if (type === 'inventory') {
        selectBtn.onclick = () => handleSelectInventoryItemForUpgrade(itemData.id);
    } else {
        selectBtn.onclick = () => handleSelectDesiredItemForUpgrade(itemData);
    }
    actionsEl.appendChild(selectBtn);
    card.appendChild(imgCont);
    card.appendChild(nameEl);
    card.appendChild(valueEl);
    card.appendChild(actionsEl);
    return card;
}
function updateSlotDisplay(slotElement, itemData, type) {
    const placeholder = slotElement.querySelector('.slot-placeholder');
    const display = slotElement.querySelector('.slot-item-display');
    if (itemData) {
        display.querySelector('img').src = itemData.imageFilename || generateImageFilename(itemData.name);
        display.querySelector('img').alt = itemData.name;
        display.querySelector('.slot-item-name').textContent = itemData.name;

        const valueInStars = Math.floor((type === 'inventory' ? itemData.currentValue : itemData.floorPrice) * TON_TO_STARS_RATE);
        display.querySelector('.slot-item-value').innerHTML = `${valueInStars} <img src="${STAR_ICON_URL}" class="balance-icon" style="width: 14px; height: 14px; vertical-align: middle;">`;

        placeholder.style.display = 'none';
        display.style.display = 'flex';
        display.style.flexDirection = 'column';
    } else {
        placeholder.style.display = 'flex';
        display.style.display = 'none';
    }
}
function handleSelectInventoryItemForUpgrade(inventoryItemId) {
    const item = currentUser.inventory.find(i => i.id === inventoryItemId);
    if (item) {
        selectedItemForUpgrade = { ...item };
        updateSlotDisplay(upgradePageElements.selectedInventoryItemSlot, selectedItemForUpgrade, 'inventory');
        desiredItemForUpgrade = null;
        updateSlotDisplay(upgradePageElements.desiredUpgradeItemSlot, null, 'desired');
        calculateAndDisplayUpgradeStats();
        closeUpgradeItemPicker();
    }
}

function handleSelectDesiredItemForUpgrade(itemObject) {
    if (itemObject) {
        desiredItemForUpgrade = { ...itemObject };
        updateSlotDisplay(upgradePageElements.desiredUpgradeItemSlot, desiredItemForUpgrade, 'desired');
        calculateAndDisplayUpgradeStats();
        closeUpgradeItemPicker();
    }
}

function calculateAndDisplayUpgradeStats() {
    const chanceTextLeft = document.getElementById('upgrade-chance-text-left');
    const multiplierTextRight = document.getElementById('upgrade-multiplier-text-right');
    const pointer = document.getElementById('upgrade-chance-pointer-new');

    if (selectedItemForUpgrade && desiredItemForUpgrade) {
        if (selectedItemForUpgrade.currentValue <= 0) {
            calculatedUpgradeMultiplier = 0;
            calculatedUpgradeChance = 0;
            showTGNotification("Selected item has no value.", "error");
        } else {
            calculatedUpgradeMultiplier = desiredItemForUpgrade.floorPrice / selectedItemForUpgrade.currentValue;

            const xEffective = Math.max(1.01, calculatedUpgradeMultiplier);
            const maxChance = 75;
            const riskFactor = 0.60;

            let chance = maxChance * Math.pow(riskFactor, xEffective - 1);
            calculatedUpgradeChance = Math.min(maxChance, Math.max(0, chance));
        }

        multiplierTextRight.textContent = `${calculatedUpgradeMultiplier.toFixed(1)}x`;
        chanceTextLeft.textContent = `${calculatedUpgradeChance.toFixed(1)}%`;

        const winAngle = (calculatedUpgradeChance / 100) * 360;
        document.documentElement.style.setProperty('--upgrade-win-segment-angle', `${winAngle}deg`);

        upgradePageElements.doUpgradeButton.disabled = false;
        upgradePageElements.doUpgradeButton.textContent = "Крутить колесо";

    } else {
        calculatedUpgradeMultiplier = 0;
        calculatedUpgradeChance = 0;
        multiplierTextRight.textContent = "0x";
        chanceTextLeft.textContent = "0%";
        document.documentElement.style.setProperty('--upgrade-win-segment-angle', `0deg`);

        upgradePageElements.doUpgradeButton.disabled = true;
        upgradePageElements.doUpgradeButton.textContent = "Выберете предмет для апгрейда";
    }

    if (pointer) {
        pointer.style.transition = 'none';
        pointer.style.transform = `translateX(-50%) rotate(0deg)`;
        void pointer.offsetWidth;
        pointer.style.transition = `transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)`;
    }
}

document.getElementById('support-button').addEventListener('click', () => {
    Telegram.WebApp.openTelegramLink('https://t.me/sellerframent');
});

document.addEventListener('DOMContentLoaded', () => {
    const depositStarsButton = document.getElementById('initiate-deposit-stars-button');
    const depositTonButton = document.getElementById('initiate-deposit-ton-button');

    if (depositStarsButton) {
        depositStarsButton.addEventListener('click', () => initiateDepositProcedure('stars'));
    } else {
        console.error("Could not find the 'initiate-deposit-stars-button' element.");
    }

    if (depositTonButton) {
        // Кнопка отключена, поэтому слушатель можно не добавлять или добавить с сообщением
        depositTonButton.addEventListener('click', () => {
             showTGNotification('Депозиты в TON временно недоступны.', 'info');
        });
    } else {
        console.error("Could not find the 'initiate-deposit-ton-button' element.");
    }

    const redeemButton = document.getElementById('redeem-promocode-button');
    if (redeemButton) {
        redeemButton.addEventListener('click', redeemPromocode);
    }
});

let upgradeSpinTimeout;
function startUpgradeAnimation(isSuccess) {
    const pointer = document.getElementById('upgrade-chance-pointer-new');
    if (!pointer) return Promise.resolve();

    const winSegmentAngle = (calculatedUpgradeChance / 100) * 360;
    const safetyMargin = 5;
    let targetAngle;

    if (isSuccess) {
        targetAngle = Math.random() * (winSegmentAngle - (2 * safetyMargin)) + safetyMargin;
    } else {
        const lossSegmentStart = winSegmentAngle + safetyMargin;
        const lossSegmentAngle = 360 - winSegmentAngle - (2 * safetyMargin);
        targetAngle = lossSegmentStart + (Math.random() * lossSegmentAngle);
    }

    const fullSpins = 4 + Math.floor(Math.random() * 4);
    const finalAngle = fullSpins * 360 + targetAngle;

    pointer.style.transform = `translateX(-50%) rotate(${finalAngle}deg)`;

    return new Promise(resolve => {
        if(upgradeSpinTimeout) clearTimeout(upgradeSpinTimeout);
        upgradeSpinTimeout = setTimeout(resolve, 5100);
    });
}
function showUpgradeResultModal(isSuccess, originalItem, newItemData) {
    const modal = upgradePageElements.upgradeResultModal;
    const titleEl = upgradePageElements.upgradeResultTitle;
    const messageEl = upgradePageElements.upgradeResultMessage;
    const imageContainer = upgradePageElements.upgradeResultImageContainer;
    imageContainer.innerHTML = '';
    if (isSuccess && newItemData) {
        titleEl.textContent = "Upgrade Successful!";
        titleEl.style.color = 'var(--success-color)';
        messageEl.textContent = `Your ${originalItem.name} has been upgraded to ${newItemData.name}!`;
        const img = document.createElement('img');
        img.src = newItemData.imageFilename || generateImageFilename(newItemData.name);
        img.alt = newItemData.name;
        imageContainer.appendChild(img);
    } else {
        titleEl.textContent = "Upgrade Failed";
        titleEl.style.color = 'var(--danger-color)';
        messageEl.textContent = `Unfortunately, your ${originalItem.name} was lost in the attempt.`;
        const img = document.createElement('img');
        img.src = originalItem.imageFilename || generateImageFilename(originalItem.name);
        img.alt = originalItem.name;
        imageContainer.appendChild(img);
    }
    modal.classList.add('active');
    Telegram.WebApp.HapticFeedback?.notificationOccurred(isSuccess ? 'success' : 'error');
}


async function closeUpgradeResultModal() {
    upgradePageElements.upgradeResultModal.classList.remove('active');

    // Сначала сбрасываем локальное состояние интерфейса апгрейда
    selectedItemForUpgrade = null;
    desiredItemForUpgrade = null;
    updateSlotDisplay(upgradePageElements.selectedInventoryItemSlot, null, 'inventory');
    updateSlotDisplay(upgradePageElements.desiredUpgradeItemSlot, null, 'desired');
    calculateAndDisplayUpgradeStats();

    // Принудительно запрашиваем все данные пользователя с сервера.
    // Это гарантирует, что инвентарь будет 100% синхронизирован с базой данных.
    await fetchInitialUserData();
    // Также обновляем время бесплатного кейса на всякий случай
    await fetchFreeCaseTime();

    // Перерисовываем инвентарь на странице профиля с новыми данными
    renderInventory();
}

// --- ВСТАВЬТЕ ВМЕСТО НЕГО ЭТОТ ИСПРАВЛЕННЫЙ БЛОК ---

document.addEventListener('DOMContentLoaded', () => {
    // Event Listeners
    upgradePageElements.selectedInventoryItemSlot.addEventListener('click', () => openUpgradeItemPicker('inventory'));
    upgradePageElements.desiredUpgradeItemSlot.addEventListener('click', () => openUpgradeItemPicker('desired'));
    upgradePageElements.closeUpgradePickerButton.addEventListener('click', closeUpgradeItemPicker);
    upgradePageElements.doUpgradeButton.addEventListener('click', handleUpgrade);
    upgradePageElements.closeUpgradeResultModalButton.addEventListener('click', closeUpgradeResultModal);
    appNavButtons.forEach(b => b.addEventListener('click', () => navigateToPage(b.dataset.page)));
    spinButton.addEventListener('click', spinRoulette);
    closeRouletteButton.addEventListener('click', closeRouletteModal);

    winOverlayClaimBtn.addEventListener('click', handleClaimWonItems);
    winOverlaySellBtn.addEventListener('click', handleSellAllWonItems);

    caseMultiplierSelector.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', e => {
            selectedCaseMultiplier = parseInt(e.target.dataset.multiplier);
            updateCaseMultiplierButtons();
            updateSpinButtonText();
        });
    });
    profileElements.redeemPromocodeButton.addEventListener('click', redeemPromocode);
    copyDepositAddressBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(depositRecipientAddressRaw)
            .then(() => showTGNotification("Address copied!", 'success'))
            .catch(() => showTGNotification("Failed to copy address.", 'error'));
    });
    closeWithdrawModalButton.addEventListener('click', closeWithdrawModal);
    document.getElementById('confirm-withdraw-button').addEventListener('click', async () => {
        if (!itemToWithdraw) {
            showTGNotification("No item selected for withdrawal.", "error");
            return;
        }
        const isEmoji = !!EMOJI_GIFTS[itemToWithdraw.name];
        const endpoint = isEmoji ? '/api/withdraw_emoji_gift' : '/api/request_manual_withdrawal';
        const confirmButton = document.getElementById('confirm-withdraw-button');
        confirmButton.disabled = true;
        confirmButton.textContent = 'Processing...';
        try {
            const authData = localStorage.getItem('auth_data');
            const response = await apiRequest(endpoint, 'POST', {
                inventory_item_id: itemToWithdraw.id,
                auth_data: authData
            });
            if (response.status === 'success') {
                const successMessage = isEmoji ? response.message : "Withdrawal request sent successfully!";
                showTGNotification(successMessage, 'success');
                currentUser.inventory = currentUser.inventory.filter(i => i.id !== itemToWithdraw.id);
                renderInventory();
            } else {
                showTGNotification(response.error || "Failed to process withdrawal.", 'error');
            }
        } catch (error) {
            showTGNotification("An error occurred while sending the request.", "error");
        } finally {
            confirmButton.disabled = false;
            confirmButton.textContent = 'Confirm';
            closeWithdrawModal();
        }
    });
    copyDepositCommentBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(depositCommentText)
            .then(() => showTGNotification("Comment copied!", 'success'))
            .catch(() => showTGNotification("Failed to copy comment.", 'error'));
    });
    inviteElements.copyRefLinkButton.addEventListener('click', () => {
        navigator.clipboard.writeText(inviteElements.referralLink.value).then(() => showTGNotification("Copied!", 'success')).catch(() => showTGNotification("Failed.", 'error'));
    });
    inviteElements.withdrawReferralButton.addEventListener('click', async () => {
        const authData = localStorage.getItem('auth_data');
        if (!authData) {
            showTGNotification("Ошибка авторизации. Пожалуйста, перезагрузите приложение.", 'error');
            return;
        }
        const button = inviteElements.withdrawReferralButton;
        button.disabled = true;
        const originalButtonText = button.textContent;
        button.textContent = 'Обработка...';
        try {
            const res = await apiRequest('/api/withdraw_referral_earnings', 'POST', {
                auth_data: authData
            });
            if (res.message === 'success' && typeof res.new_balance !== 'undefined') {
                currentUser.starBalance = res.new_balance;
                currentUser.referralEarningsPending = 0;
                inviteElements.referralBalance.innerHTML = `0 <img src="${STAR_ICON_URL}" class="balance-icon" style="width: 1em; height: 1em; vertical-align: text-bottom;">`;
                updateBalances();
                showTGNotification("Реферальный баланс успешно переведен на основной!", 'success');
            } else {
                showTGNotification(res.error || res.message || "Не удалось вывести средства.", "error");
            }
        } catch (e) {
            showTGNotification("Перед выполнением этого действия вы должны иметь минимум 300 звезд в сумме всех депозитов.", "error");
        } finally {
            button.disabled = false;
            button.textContent = originalButtonText;
        }
    });
    profileElements.sellAllButton?.addEventListener('click', sellAllItems);
    confirmPaymentSentButton?.addEventListener('click', verifyPaymentSent);
    cancelDepositButton?.addEventListener('click', closeDepositInstructionsModal);
    openGiftDepositBtn.addEventListener('click', () => {
        renderGiftPricesList();
        giftDepositModal.classList.add('active');
    });
    closeGiftDepositBtn.addEventListener('click', () => {
        giftDepositModal.classList.remove('active');
    });
    giftDepositModal.addEventListener('click', (event) => {
        if (event.target === giftDepositModal) {
            giftDepositModal.classList.remove('active');
        }
    });
});


async function fetchInitialUserData() {
    if (!Telegram.WebApp.initData) {
        dataFetchedSuccessfully = true;
        return false;
    }
    const authData = localStorage.getItem('auth_data');
    const payload = authData ? { auth_data: authData } : {auth_data: '1'};
    try {
        const data = await apiRequest('/api/get_user_data', 'POST', payload);
        Object.assign(currentUser, data);
        currentUser.first_name = data.first_name || currentUser.first_name || 'User';

        await loadUserInventory();
        await loadUserBalance();
        dataFetchedSuccessfully = true;
        return true;
    } catch (e) {
        showTGNotification(data, 'error');
        dataFetchedSuccessfully = false;
        return false;
    }
}


async function openCase(caseData) {
    currentOpenCaseOrSlot = caseData;
    selectedCaseMultiplier = 1; // Default to 1x
    const modal = document.getElementById('roulette-modal');
    const balanceDisplay = document.getElementById('roulette-modal-balance-value');
    const spinButton = document.getElementById('spin-button');
    balanceDisplay.textContent = currentUser.starBalance || 0;

    const reels = ['roulette-reel-1', 'roulette-reel-2', 'roulette-reel-3'];
    reels.forEach((reelId, index) => {
        const reel = document.getElementById(reelId);
        const spinner = reel.querySelector('.roulette-spinner-reel');
        spinner.innerHTML = '';
        if (index < selectedCaseMultiplier) {
            const prizes = shuffleArray([...caseData.prizes]).slice(0, 3);
            prizes.forEach(prize => {
                const img = document.createElement('img');
                img.src = prize.is_ton_prize ? TON_COIN_FULL_URL : (prize.imageFilename || generateImageFilename(prize.name));
                img.style.maxWidth = '60px';
                img.style.maxHeight = '60px';
                img.style.opacity = '0';
                img.classList.add('prize-image');
                spinner.appendChild(img);
                setTimeout(() => {
                    img.style.transition = 'opacity 0.5s, transform 0.5s';
                    img.style.opacity = '1';
                    img.style.transform = 'scale(1.2)';
                    setTimeout(() => img.style.transform = 'scale(1)', 500);
                }, 100 * index);
            });
        }
    });

    document.getElementById('roulette-case-name').textContent = caseData.name || 'Opening Case...';
    updatePossiblePrizes(caseData.prizes);

    updateMultiplierSelection();
    updateSpinButtonState(spinButton, caseData.cost);
    modal.classList.add('active');
}

function updatePossiblePrizes(prizes) {
    const container = document.getElementById('possible-prizes-display');
    container.innerHTML = '';
    prizes.forEach(prize => {
        const div = document.createElement('div');
        div.innerHTML = `<img src="${prize.is_ton_prize ? TON_COIN_FULL_URL : (prize.imageFilename || generateImageFilename(prize.name))}" style="max-width: 50px; max-height: 50px;"> ${prize.name || 'Item'} (${prize.value || 0} ★)`;
        container.appendChild(div);
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

caseMultiplierSelector.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', e => {
        selectedCaseMultiplier = parseInt(e.currentTarget.dataset.multiplier);
        updateCaseMultiplierButtons();
        updateSpinButtonText();
    });
});




document.getElementById('spin-button').addEventListener('click', async () => {
    const button = document.getElementById('spin-button');
    if (button.disabled) return;
    const totalCost = currentOpenCaseOrSlot.cost * selectedCaseMultiplier;
    if (currentUser.starBalance >= totalCost) {
        currentUser.starBalance -= totalCost;
        document.getElementById('roulette-modal-balance-value').textContent = currentUser.starBalance;
        updateBalances();
        await performSpinAnimation();
    }
});


document.getElementById('close-roulette-button').addEventListener('click', () => {
    const modal = document.getElementById('roulette-modal');
    modal.classList.remove('active');
});


async function performSpinAnimation() {
    const reels = ['roulette-reel-1', 'roulette-reel-2', 'roulette-reel-3'];
    reels.forEach((reelId, index) => {
        if (index < selectedCaseMultiplier) {
            const reel = document.getElementById(reelId);
            const spinner = reel.querySelector('.roulette-spinner-reel');
            spinner.style.transition = 'transform 1s';
            spinner.style.transform = 'rotate(360deg)';
        }
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    reels.forEach((reelId, index) => {
        if (index < selectedCaseMultiplier) {
            const reel = document.getElementById(reelId);
            const spinner = reel.querySelector('.roulette-spinner-reel');
            spinner.style.transform = 'rotate(0deg)';
        }
    });
}

function updateReelDisplay() {
    const reels = ['roulette-reel-1', 'roulette-reel-2', 'roulette-reel-3'];
    reels.forEach((reelId, index) => {
        const reel = document.getElementById(reelId);
        const spinner = reel.querySelector('.roulette-spinner-reel');
        spinner.innerHTML = '';
        if (index < selectedCaseMultiplier) {
            const prizes = shuffleArray([...currentOpenCaseOrSlot.prizes]).slice(0, 3);
            prizes.forEach(prize => {
                const img = document.createElement('img');
                img.src = prize.is_ton_prize ? TON_COIN_FULL_URL : (prize.imageFilename || generateImageFilename(prize.name));
                img.style.maxWidth = '60px';
                img.style.maxHeight = '60px';
                spinner.appendChild(img);
            });
        }
    });
}

function updateMultiplierSelection() {
    document.querySelectorAll('.case-multiplier-selector button').forEach(button => {
        button.classList.toggle('active-multiplier', parseInt(button.dataset.multiplier) === selectedCaseMultiplier);
    });
    updateReelDisplay();
}



function updatePrizeDisplay() {
    const prizeContainer = document.getElementById('prize-display');
    prizeContainer.innerHTML = '';
    const prizes = shuffleArray([...currentOpenCaseOrSlot.prizes]).slice(0, selectedCaseMultiplier * 3);
    prizes.forEach(prize => {
        const img = document.createElement('img');
        img.src = prize.is_ton_prize ? TON_COIN_FULL_URL : (prize.imageFilename || generateImageFilename(prize.name));
        img.style.maxWidth = '60px';
        img.style.maxHeight = '60px';
        prizeContainer.appendChild(img);
    });
}

function updateSpinButtonState(button, caseCost) {
    const totalCost = caseCost * selectedCaseMultiplier;
    const balance = currentUser.starBalance || 0;
    if (totalCost > balance) {
        button.disabled = true;
        button.classList.remove('button');
        button.classList.add('button-secondary');
        button.style.background = 'var(--surface-hover-color)';
        button.style.color = 'var(--text-placeholder)';
        button.style.cursor = 'not-allowed';
    } else {
        button.disabled = false;
        button.classList.remove('button-secondary');
        button.classList.add('button');
        button.style.background = 'linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))';
        button.style.color = 'var(--text-primary)';
        button.style.cursor = 'pointer';
    }
    button.textContent = `Spin ${selectedCaseMultiplier}x (${totalCost} ★)`;
}


async function initializeApp() {
    updateLoadingStatus("Initializing application...");
    const allImageUrls = new Set();
    casesData.forEach(c => {
        const mainImgSrc = c.imageFilename || (c.name ? generateImageFilename(c.name) : null); if (mainImgSrc) allImageUrls.add(mainImgSrc);
        if (c.overlayPrizeName) allImageUrls.add(generateImageFilename(c.overlayPrizeName));
        c.prizes.forEach(p => { if (p.is_ton_prize) allImageUrls.add(TON_COIN_FULL_URL); else allImageUrls.add(generateImageFilename(p.imageFilename || p.name)); });
    });
    allImageUrls.add(TON_COIN_FULL_URL);
    allImageUrls.forEach(url => { const img = new Image(); img.src = url; });
    if (Telegram.WebApp.BackButton) tgBackButton = Telegram.WebApp.BackButton;
    if (Telegram.WebApp && Telegram.WebApp.initDataUnsafe) {
        updateLoadingStatus("Connecting to Telegram Mini App...");
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
        Telegram.WebApp.enableClosingConfirmation();
        const tgUser = Telegram.WebApp.initDataUnsafe.user;
        if (tgUser) {
            currentUser.id = tgUser.id;
            currentUser.username = tgUser.username;
            currentUser.first_name = tgUser.first_name || 'User';
            currentUser.last_name = tgUser.last_name;
            currentUser.photo_url = tgUser.photo_url || null;
            if (!currentUser.referralCode) currentUser.referralCode = `ref_${currentUser.id.toString().slice(-6)}`;
        }
        let authData = localStorage.getItem('auth_data');
        let isAuthValid = false;
        if (authData) {
            try {
                updateLoadingStatus("Verifying authorization...");
                const response = await apiRequest('/api/get_balance', 'POST', { auth_data: authData });
                if (response.status === 'success') {
                    isAuthValid = true;
                    currentUser.starBalance = response.balance;
                    updateBalances();
                } else {
                    console.log('Invalid auth_data response:', response);
                }
            } catch (error) {
                console.error('Error verifying auth_data:', error);
            }
        }
        if (!authData || !isAuthValid) {
            if (tgUser) {
                try {
                    updateLoadingStatus("Generating new login hash...");
                    const response = await apiRequest('/api/GenerateLoginHash', 'POST', { user_id: tgUser.id });
                    if (response.status === 'success' && response.auth_data) {
                        localStorage.setItem('auth_data', response.auth_data);
                        window.location.reload();
                        return;
                    }
                } catch (error) {
                }
            }
            return;
        }
        try {
            const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg-gradient-start').trim() || '#181A25';
            Telegram.WebApp.setHeaderColor(bg);
            Telegram.WebApp.setBackgroundColor(bg);
        } catch (e) {
            console.warn("Failed to set Telegram WebApp colors:", e);
        }
    } else {
        console.warn("Not running inside Telegram WebApp. Using fallback data.");
        if (!currentUser.referralCode) currentUser.referralCode = `ref_BRWSR${Math.random().toString(36).substring(2, 8)}`;
        currentUser.photo_url = 'https://i.ibb.co/N6dt5Pc9/Background-Eraser-20250423-210102862.png';
    }
    updateLoadingStatus("Authenticating wallet...");
        updateLoadingStatus("Loading user data...");
    if (Telegram.WebApp.initData) {
        await fetchInitialUserData();
        await fetchFreeCaseTime(); // <-- ДОБАВЛЕН ВЫЗОВ НОВОЙ ФУНКЦИИ
    } else {
        dataFetchedSuccessfully = true;
    }
    updateLoadingStatus("Loading game content...");
    renderHeader();
    renderBanners();
    renderCasesAndSlots();
    renderProfile();
    renderLeaderboard();
    renderInvitePage();
    navigateToPage('main-page');
    updateLoadingStatus("Ready!");
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);
document.addEventListener('DOMContentLoaded', calculateAndDisplayUpgradeStats);
