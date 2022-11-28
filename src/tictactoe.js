import crypto from 'crypto';
import { ActionRowBuilder, ButtonBuilder } from 'discord.js';
import config from './config.js';
import "./extension.js";

export default class TicTacToe {
    static allGames = new Array();
    static winConditions = [
        //Row
        config.ticTacToeTopRow,
        config.ticTacToeMidRow,
        config.ticTacToeBotRow,
        //Column
        [config.ticTacToeTopRow[0], config.ticTacToeMidRow[0], config.ticTacToeBotRow[0]],
        [config.ticTacToeTopRow[1], config.ticTacToeMidRow[1], config.ticTacToeBotRow[1]],
        [config.ticTacToeTopRow[2], config.ticTacToeMidRow[2], config.ticTacToeBotRow[2]],
        //Diagonal
        [config.ticTacToeTopRow[0], config.ticTacToeMidRow[1], config.ticTacToeBotRow[2]],
        [config.ticTacToeBotRow[0], config.ticTacToeMidRow[1], config.ticTacToeTopRow[2]]
    ];

    constructor() {}

    static newGame(player1, player2) {
        let secret = player1 + player2;
        let hash = crypto.createHash('sha256').update(secret).digest('hex');

        let existing = this.allGames.findIndex(x => x._id == hash);
        if (existing >= 0) return "";

        let newTicTacToe = new TicTacToe();

        newTicTacToe._id = hash
        newTicTacToe._messageId = "";

        newTicTacToe._player1 = player1.id;
        newTicTacToe._player1Username = player1.username;
        newTicTacToe._player1Emoji = "🇽";

        newTicTacToe._player2 = player2.id;
        newTicTacToe._player2Username = player2.username;
        newTicTacToe._player2Emoji = "🇴";

        newTicTacToe._playerTurn = 1;
        newTicTacToe._emojiList = new Array();

        this.allGames.push(newTicTacToe);
        return hash;
    }

    static cancelMatch(game) {
        game._emojiList.push("❌");

        let index = this.allGames.findIndex(x => x._id == game._id);
        if (index < 0) return;

        this.allGames.splice(index);
    }

    addTicTacToeEmoji(emojiToCheck) {
        if (!this._emojiList.includes(emojiToCheck)) return " ";

        let emojiIndex = this._emojiList.indexOf(emojiToCheck);
        return emojiIndex % 2 == 0 ? this._player1Emoji : this._player2Emoji;
    }

    createOrUpdateMessage(winnerFound = false) {
        let message = `${this._player1Username} vs ${this._player2Username}\n\n`;
        const styleNo = 1;

        let topRowButtons = [];
        let midRowButtons = [];
        let botRowButtons = [];

        let topEmoji, topLabel, topButton;
        let midEmoji, midLabel, midButton;
        let botEmoji, botLabel, botButton;

        for (let i = 0; i < 3; ++i) {
            topEmoji = config.ticTacToeTopRow[i];
            midEmoji = config.ticTacToeMidRow[i];
            botEmoji = config.ticTacToeBotRow[i];

            topLabel = this.addTicTacToeEmoji(topEmoji);
            midLabel = this.addTicTacToeEmoji(midEmoji);
            botLabel = this.addTicTacToeEmoji(botEmoji);

            topButton = new ButtonBuilder().setLabel(topLabel).setCustomId(`ttt${this._id}${topEmoji}`).setStyle(styleNo);
            midButton = new ButtonBuilder().setLabel(midLabel).setCustomId(`ttt${this._id}${midEmoji}`).setStyle(styleNo);
            botButton = new ButtonBuilder().setLabel(botLabel).setCustomId(`ttt${this._id}${botEmoji}`).setStyle(styleNo);

            if (topLabel !== " " || winnerFound) topButton.setDisabled(true);
            if (midLabel !== " " || winnerFound) midButton.setDisabled(true);
            if (botLabel !== " " || winnerFound) botButton.setDisabled(true);

            topRowButtons.push(topButton);
            midRowButtons.push(midButton);
            botRowButtons.push(botButton);
        }

        let cancelButton = new ButtonBuilder().setLabel("❌").setCustomId(`ttt${this._id}❌`).setStyle(styleNo).setDisabled(winnerFound);

        let topRow = new ActionRowBuilder().setComponents(topRowButtons);
        let midRow = new ActionRowBuilder().setComponents(midRowButtons);
        let botRow = new ActionRowBuilder().setComponents(botRowButtons);
        let cancelRow = new ActionRowBuilder().setComponents(cancelButton);

        return {
            content: `${"Tic-Tac-Toe".ToBold()}\n${message}`,
            components: [topRow, midRow, botRow, cancelRow]
        };
    }

    endOfRoundAction(message) {
        // One person wins
        let player1Emojis = this._emojiList.filter((emoji, index) => index % 2 == 0);
        let player2Emojis = this._emojiList.filter((emoji, index) => index % 2 != 0);
        let winnerFound = false;
        let winner = "";
        let gameIndex = TicTacToe.allGames.findIndex(x => x._id == this._id);
        let game = TicTacToe.allGames[gameIndex];

        TicTacToe.winConditions.forEach((winCondition) => {
            if (winnerFound) return;

            if (winCondition.every(x => player1Emojis.includes(x))) {
                winner = this._player1Username;
                winnerFound = true;
            } else if (winCondition.every(x => player2Emojis.includes(x))) {
                winner = this._player2Username
                winnerFound = true;
            }
        });

        if (winnerFound) {
            let msgPayload = game.createOrUpdateMessage(winnerFound);
            TicTacToe.allGames.splice(gameIndex, 1);
            message.edit({
                content: msgPayload.content + `${winner} is the winner!`.ToBold(),
                components: msgPayload.components
            });
            message.react("🎉");
            return;
        }

        // Tie
        if (this._emojiList.length == 9) {
            TicTacToe.allGames.splice(gameIndex, 1);
            message.edit({
                content: message.content + `\nGame Tied!`.ToBold()
            });
            return;
        }

        // Continue game
        this.togglePlayerTurn();
        let turnPlayer = this._playerTurn == 1 ? this._player1Username : this._player2Username;
        message.edit({
            content: message.content + `\n${turnPlayer}'s turn`
        });
    }

    togglePlayerTurn() {
        this._playerTurn += 1;

        if (this._playerTurn > 2) {
            this._playerTurn = 1;
        }
    }
}