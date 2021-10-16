import crypto from 'crypto';
import config from './config.js';
import "./extension.js";

export default class TicTacToe {
    static allGames = new Array();
    static winConditions = [
        //Row
        ["↖", "⬆", "↗"],
        ["⬅", "⏺", "➡"],
        ["↙", "⬇", "↘"],
        //Column
        ["↖", "⬅", "↙"],
        ["⬆", "⏺", "⬇"],
        ["↗", "➡", "↘"],
        //Diagonal
        ["↖", "⏺", "↘"],
        ["↗", "⏺", "↙"]
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

    addTicTacToeEmoji(emojiToCheck) {
        if (!this._emojiList.includes(emojiToCheck)) return "🟦";

        let emojiIndex = this._emojiList.indexOf(emojiToCheck);
        return emojiIndex % 2 == 0 ? this._player1Emoji : this._player2Emoji;
    }

    createOrUpdateMessage() {
        let waitForReactions = "[Please wait for the reactions...]\n\n";
        let message = `${this._player1Username} vs ${this._player2Username}\n\n`;

        if (this._emojiList.length <= 0) {
            message = `${waitForReactions}${message}${config.ticTacToeFormat}`;
        } else {
            message += this.addTicTacToeEmoji("↖");
            message += " ";
            message += this.addTicTacToeEmoji("⬆");
            message += " ";
            message += this.addTicTacToeEmoji("↗");
            message += "\n";

            message += this.addTicTacToeEmoji("⬅");
            message += " ";
            message += this.addTicTacToeEmoji("⏺");
            message += " ";
            message += this.addTicTacToeEmoji("➡");
            message += "\n";

            message += this.addTicTacToeEmoji("↙");
            message += " ";
            message += this.addTicTacToeEmoji("⬇");
            message += " ";
            message += this.addTicTacToeEmoji("↘");
        }

        return `${"Tic-Tac-Toe".ToBold()}\n${message}`;
    }

    endOfRoundAction(message) {
        // One person wins
        let player1Emojis = this._emojiList.filter((emoji, index) => index % 2 == 0);
        let player2Emojis = this._emojiList.filter((emoji, index) => index % 2 != 0);
        let winnerFound = false;
        let winner = "";

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
            TicTacToe.allGames.splice(TicTacToe.allGames.findIndex(x => x._id == this._id), 1);
            message.edit({
                content: message.content + `\n${winner} is the winner!`.ToBold()
            });
            message.react("🎉");
            return;
        }

        // Tie
        if (this._emojiList.length == 9) {
            TicTacToe.allGames.splice(TicTacToe.allGames.findIndex(x => x._id == this._id), 1);
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