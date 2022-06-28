import * as dotenv from 'dotenv';

dotenv.config();

export default {
    prefix: "ser",
    botId: "807613302817292319",
    embedColor: "#11116B",
    embedPauseIconURL: "https://p7.hiclipart.com/preview/362/566/476/creative-commons-license-public-domain-wikimedia-commons-pause-icon.jpg",
    r6apiEmail: process.env.R6_API_EMAIL,
    r6apiPassword: process.env.R6_API_PASSWORD,
    token: process.env.SERBOTJS_BOT_TOKEN,
    distubeCookie: "VISITOR_INFO1_LIVE=Qo1VKf8nCPQ; CONSENT=YES+MY.en+20171022-09-0; PREF=f6=40000400&tz=Asia.Singapore&al=en&f4=4000000&f5=30000&volume=100&library_tab_browse_id=FEmusic_liked_playlists; NID=222=B4ySB7JZ9420fn_nN2Dz1X61Yi1MZ_RJTrAm2vnXxe-ig_UJilCmVN3Yb0G5M3jOdf2qSM14KRWYA8Pcb1pZpoJIqOg5ENJ70rjwJfg7sOGRbCK5rftI5K8JO5SJrS_5pshlqx9_PJB1nMd5tmhyTA7dpu6i6L6kuLcIdfzEsAM; __Secure-3PSID=CggJrdxJSgU6mWTpsI6w_oaJbb5un-tHeriD_KrtCWEWj5xoZzK8mw7W-xEkpZJCiDewAg.; __Secure-3PAPISID=1sBOjVV-kveyzsmb/AfFxvamY6udk_UWyc; LOGIN_INFO=AFmmF2swRQIgeH-NxVpXl03I96nrEGx73duz8Cq1zUQMJoEemWOVxIUCIQCLcvGinTJHwJeVb-B53cNWG9Bn9LxRbL2Yqh-SBZCTMg:QUQ3MjNmeTZoc05iMFhQM0VicG5HcW9BclRaMzNxVVpXQWh6T2pQTXpBMDdqTld1UEdFVGo5djhVTFE0UVNzWVRseHhqRnoydHcwYXd6bnpUY0Q3NzFXXzUtZWx2YmNGb0g5MjgwNUtuc2VrYzdDVzhzZl9WQVFNN0tHOFItemJEMWVMN3RJWFhfQWlTWTctUnhoc0RJeEJUeHR5QzhuSU5R; YSC=eh37Zv1pUto; __Secure-3PSIDCC=AJi4QfF-wyQ9vkM0JUb3V3eFFCFdQioL-zYQKeENzkx7D83m1X51ZSUtu6dua8OOAB4AkIZVsa8; ST-1b=disableCache=true&itct=CB8QsV4iEwjdxv6IwK3zAhXNCrcAHQHTD8E%3D&csn=MC4xOTYwMzg3NjM0MTA3Njgz&endpoint=%7B%22clickTrackingParams%22%3A%22CB8QsV4iEwjdxv6IwK3zAhXNCrcAHQHTD8E%3D%22%2C%22commandMetadata%22%3A%7B%22webCommandMetadata%22%3A%7B%22url%22%3A%22%2F%22%2C%22webPageType%22%3A%22WEB_PAGE_TYPE_BROWSE%22%2C%22rootVe%22%3A3854%2C%22apiUrl%22%3A%22%2Fyoutubei%2Fv1%2Fbrowse%22%7D%7D%2C%22browseEndpoint%22%3A%7B%22browseId%22%3A%22FEwhat_to_watch%22%7D%7D",
    ticTacToeTopRow: ["↖", "⬆", "↗"],
    ticTacToeMidRow: ["⬅", "⏺", "➡"],
    ticTacToeBotRow: ["↙", "⬇", "↘"],
    eightBallReplies: ["Ummm, yeah... maybe..", "Yes", "No", "HAHAHHAHAHAHHA, oh you're being serious", "Yeah, sure, whatever", "Stop asking me bro damn", "Yeah nah", "Get juked", "Horizon cracked"],
    enrollmentMessageId: process.env.ENROLLMENT_MESSAGE_ID
}