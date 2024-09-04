import * as dotenv from 'dotenv';

dotenv.config();

export default {
    prefix: "ser",
    botId: "807613302817292319",
    embedColor: "#11116B",
    embedPauseIconURL: "https://p7.hiclipart.com/preview/362/566/476/creative-commons-license-public-domain-wikimedia-commons-pause-icon.jpg",
    token: process.env.SERBOTJS_BOT_TOKEN,
    distubeCookie: process.env.DISTUBE_COOKIE, // https://github.com/skick1234/DisTube/wiki/YouTube-Cookies
    ticTacToeTopRow: ["↖", "⬆", "↗"],
    ticTacToeMidRow: ["⬅", "⏺", "➡"],
    ticTacToeBotRow: ["↙", "⬇", "↘"],
    eightBallReplies: ["Ummm, yeah... maybe..", "Yes", "No", "HAHAHHAHAHAHHA, oh you're being serious", "Yeah, sure, whatever", "Stop asking me bro damn", "Yeah nah", "Get juked", "Horizon cracked", "gg"],
    enrollmentMessageId: process.env.ENROLLMENT_MESSAGE_ID
}