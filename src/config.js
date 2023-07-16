import * as dotenv from 'dotenv';

dotenv.config();

export default {
    prefix: "ser",
    botId: "807613302817292319",
    embedColor: "#11116B",
    embedPauseIconURL: "https://p7.hiclipart.com/preview/362/566/476/creative-commons-license-public-domain-wikimedia-commons-pause-icon.jpg",
    token: process.env.SERBOTJS_BOT_TOKEN,
    distubeCookie: "VISITOR_INFO1_LIVE=Qo1VKf8nCPQ; CONSENT=YES+MY.en+20171022-09-0; LOGIN_INFO=AFmmF2swRAIgNvG4gZwZM6HhLs1hcgEYuZ5PCpo253reTzU5l6u6NikCIBcz2gG2C982UDj363-d7MXo2gsLYkCoiVYfG9VUj-Os:QUQ3MjNmeWUyU1NPRmhQbHZFVjdSc05TdlZQc3MzVDkwNXZBT1NaM3NWQldTRnMzOUxZZmNsNWNqUWxlY2VvQ0FKalNnc3FEWGdEVi1zYnNCS09FdzhOU3lVQkw1WlVwMU45aWNLd2NBM1liZXZMRVhPN0dud19QQ1ZRQ1MtX1NmQU5QcjBTdUxXUmdVcmRQNHlxT0NremIxanpnQlE1bVpwZTBEdVRyWkJmd1RfN1IwVmZaN3gxa3hyZnZraHY4NjJkX2s1VFB1dWplLVQxWi1zcThxOHlrcFR6VVhLWUpCdw==; HSID=AONsm9bcc3juePCw5; SSID=AOZFbLKqOeDsoMmn0; APISID=R8H5QHCpjEjC24iB/AXCnKv_iqDWeHBJi1; SAPISID=RHNGCjakUCyQw3Jy/AuxTd9OFpQYT9KVLx; __Secure-1PAPISID=RHNGCjakUCyQw3Jy/AuxTd9OFpQYT9KVLx; __Secure-3PAPISID=RHNGCjakUCyQw3Jy/AuxTd9OFpQYT9KVLx; SID=NQgJrQGnpFZBcIv8m5ywNOOFkrVklqQIgP09CdI8z0TDLV62hKO_yfeaSKY-TjWnAU3i6Q.; __Secure-1PSID=NQgJrQGnpFZBcIv8m5ywNOOFkrVklqQIgP09CdI8z0TDLV62XzPdQoH2FMgxY904dGZpcQ.; __Secure-3PSID=NQgJrQGnpFZBcIv8m5ywNOOFkrVklqQIgP09CdI8z0TDLV62c0Wq7W1ogcu5xItcIYtZPw.; PREF=tz=Asia.Singapore&f6=40000000&f5=30000; YSC=TivF7gMU-m8; SIDCC=AEf-XMRB3kU7NprYoWzu8YR_AhnpM5x4iopTO87xmIEXIXelko8nQqEzmdGUHNA6DmWzCKOCW5l_; __Secure-1PSIDCC=AEf-XMQCYYvHi8tbUvwsuAHJTYFGjnNGWdss8WytEag8Ipm2QveNARM169n0DBRjuFW0HSzI2TI; __Secure-3PSIDCC=AEf-XMQaqM-F35Y3eFuLD1qQm45U6_xpVGQ87Ukdxp6wpB5uXsgAKT6u-_vMPrhQVcYVAtT40XV6",
    ticTacToeTopRow: ["↖", "⬆", "↗"],
    ticTacToeMidRow: ["⬅", "⏺", "➡"],
    ticTacToeBotRow: ["↙", "⬇", "↘"],
    eightBallReplies: ["Ummm, yeah... maybe..", "Yes", "No", "HAHAHHAHAHAHHA, oh you're being serious", "Yeah, sure, whatever", "Stop asking me bro damn", "Yeah nah", "Get juked", "Horizon cracked", "gg"],
    enrollmentMessageId: process.env.ENROLLMENT_MESSAGE_ID
}