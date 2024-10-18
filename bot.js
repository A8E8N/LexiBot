const TelegramBot = require('node-telegram-bot-api');
const token = '7552192505:AAHhnS0TRStYk8xgn_qokcsMmNY41Pga4FY'; // Replace with your actual bot token
const bot = new TelegramBot(token, { polling: true });

// Answers data for each unit
const unitData = {
    'Unit 1': {
        answers: {
            1: `Answers:\n1. Look-up\n2. Find\n3. Check\n4. Mark`,
            2: `Answers:\n1. K\n2. Y\n3. K\n4. Y\n5. K\n6. K\n7: Y`,
            3: `Answers:\n1. dictionary / a\n2. work / d\n3. index / b`,
            4: `Answers:\n1. Healthy\n2. Hear\n3. Heavy\n4. Helpful`,
            5: `Answers:\n1. travelled\n2. stayed\n3. interesting\n4. swim\n5. had`,
            6: `Answers:\n1. Yes\n2. Yes\n3. No\n4. No\n5. Yes`,
            7: `Answers:\n1. Foot/ball - 2\n2. Mu/se/um - 3\n3. Spell - 1\n4. Se/ven/ty - 3\n5. Buil/ding - 2\n6. Lake - 1\n7. Work - 1\n8. Re/peat - 2\n9. Ho/li/day - 3`,
            8: `Answers:\n1. Two hundred and sixty-five: 265.\n2. 430: Four hundred and thirty.\n3. Five hundred and thirty-two: 532.\n4. 729: Seven hundred and twenty-nine.\n5. One hundred and fifty-two: 152.\n6. 692: Six hundred and ninety-two.\n7. Three-hundred and twenty-six: 326.\n8. 417: Four hundred and seventeen.`
        }
    },
    'Unit 2': {
        answers: {
            1: `Answers:\n1. B\n2. C\n3. A`,
            2: `Answers:\n1. It's 115 metres deep.\n2. It's 335 metres long.\n3. They're 200 metres tall.\n4. It's 162 metres wide.`,
            3: `Answers:\n1. tall\n2. old\n3. wide\n4. deep`,
            4: `Answers:\n1. How old is ...\n2. How wide is ...\n3. How deep is ...\n4. How long is ...`,
            5: `Answers:\n1. hill.\n2. sixteen.\n3. bridge.\n4. museum.\n5. The Jordan Valley.`,
            6: `Answers:\n1. It's about 830 years old.\n2. There were four towers.\n3. About fifteen metres deep.\n4. جواب الطالب الشخصي.`,
            7: `Answers:\n1. Sta\n2. Air\n3. Tow\n4. Tun\n5. Post\n6. Fla\n7. Me\n8. Pa`,
            8: `Answers:\n1. How far is the airport?\n2. The tunnel is 104 metres long. / Is the tunnel 104 metres long?\n3. How old is the palace?\n4. The river is 189 metres wide. / Is the river 189 metres wide?\n5. That isn't an old building.`,
            9: `Answers:\nHomework / واجب`,
        }
    },
    'Unit 3': {
        answers: {
            1: `Answers:\n1. Let's / I'd\n2. Buy / love\n3. to do / I'd`,
            2: `Answers:\n1. I'd\n2. would\n3. prefer\n4. event`,
            3: `Answers:\n1. Lebanese / D\n2. Emerati / C\n3. Egyptian / A`,
            4: `Answers:\nHomework / واجب`,
            5: `Answers:\nOpinion:\n1. It was great!\n2. They were very beautiful.\n3. In my opinion, it's the best festival in Jordan.\nFact:\n1. All the crafts were from Jordan.\n2. My mum bought a small mosaic for our house.\n3. Lots of people were at the festival with their families.`,
            6: `Answers:\n1. The crafts were from Jordan.\n2. He would like to go to Aqaba water festival.\n3. He thinks that Aqaba traditional Arts Festival is the best.\n4. إجابة الطالب الشخصية`,
            7: `Answers:\nالمطلوب هو ايجاد الشدة في الكلمة، الجزء المفخم في اللفظ من الكلمة\n1. di\n2. por\n3. for\n4. val\n5. pen\n6. cor\n7. dic\n8. kil\n9. mar`,
            8: `Answers:\nHomework / واجب`,
        }
    }
};

// Handle greeting messages
bot.onText(/^(hi|hello|مرحبا|السلام عليكم)/i, (msg) => {
    const chatId = msg.chat.id;
    const greetingMessage = detectLanguage(msg.text) === 'ar' 
        ? "مرحبًا! 👋 أنا LexiBot، مساعدك الشخصي لتحسين مهارات اللغة. هل أنت مستعد للارتقاء بقراءة، كتابة، تحدث، واستماع؟ لنبدأ!" 
        : "Hello there! 👋 I'm LexiBot, your personal assistant for mastering language skills. Ready to level up your reading, writing, speaking, and listening? Let’s dive in!";

    const options = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: "Start Learning", callback_data: 'start_learning' }],
                [{ text: "Help", callback_data: 'help' }]
            ]
        })
    };

    bot.sendMessage(chatId, greetingMessage, options);
});

// Function to detect language based on user input
function detectLanguage(text) {
    const arabicRegex = /[\u0600-\u06FF]/; // Regex for Arabic characters
    return arabicRegex.test(text) ? 'ar' : 'en';
}

// Handle callback queries (button presses)
bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;

    if (data === 'start_learning') {
        const options = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{ text: "Unit 1: Use a Dictionary", callback_data: 'unit_1' }],
                    [{ text: "Unit 2: How long is the bridge?", callback_data: 'unit_2' }],
                    [{ text: "Unit 3: At the book fair", callback_data: 'unit_3' }],
                    [{ text: "Back", callback_data: 'back_to_main' }]
                ]
            })
        };
        bot.sendMessage(chatId, "Great! Let's start by choosing a unit.", options);
    } else if (data === 'help') {
        const helpText = "I can help you improve your language skills! Use the following commands:\n/units - Browse language units\n/profile - Check your progress";
        bot.sendMessage(chatId, helpText);
    } else if (data === 'back_to_main') {
        sendMainMenu(chatId);
    } else if (data.includes('unit')) {
        const unit = data.split('_')[1];
        showUnitMenu(chatId, unit);
    } else if (data.includes('exercise')) {
        const [unit, exercise] = data.split('_').slice(1);
        showExerciseAnswer(chatId, unit, exercise);
    }
});

// Show unit menu with exercise buttons
function showUnitMenu(chatId, unit) {
    const exerciseButtons = Object.keys(unitData[`Unit ${unit}`].answers).map((exerciseNum) => {
        return [{ text: `Exercise ${exerciseNum}`, callback_data: `exercise_${unit}_${exerciseNum}` }];
    });

    const options = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                ...exerciseButtons,
                [{ text: "Back", callback_data: 'back_to_main' }]
            ]
        })
    };

    bot.sendMessage(chatId, `You selected Unit ${unit}. Choose an exercise:`, options);
}

// Show answers for selected exercise
function showExerciseAnswer(chatId, unit, exercise) {
    const answer = unitData[`Unit ${unit}`].answers[exercise];
    bot.sendMessage(chatId, `Here are the answers for Exercise ${exercise}:\n\n${answer}\n`);
}

// Send the main menu
function sendMainMenu(chatId) {
    const options = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: "Start Learning", callback_data: 'start_learning' }],
                [{ text: "Help", callback_data: 'help' }]
            ]
        })
    };

    bot.sendMessage(chatId, "What would you like to do?", options);
}
