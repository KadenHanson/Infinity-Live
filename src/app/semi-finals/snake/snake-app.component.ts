import { Component } from '@angular/core';
import { CONTROLS, COLORS, BOARD_SIZE, GAME_MODES } from './snake-app.constants';
import { Player } from '../../player';

declare const Pusher: any;

@Component({
    selector: 'ngx-snake',
    templateUrl: './snake-app.component.html',
    styleUrls: ['./snake-app.component.css'],
    host: {
        '(document:keydown)': 'handleKeyboardEvents($event)'
    }
})
export class SnakeAppComponent {
    // Pusher vars
    player: Player;
    pusherChannel: any;
    canPlay: boolean = true;
    playerId: number = 0;
    players: number = 0;
    gameId: string;
    // gameUrl: string = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');

    private interval: number;
    private tempDirection: number;
    private default_mode = 'classic';
    private isGameOver = false;

    public all_modes = GAME_MODES;
    public getKeys = Object.keys;
    public board = [];
    public obstacles = [];
    public score = 0;
    public showMenuChecker = false;
    public gameStarted = false;
    public newBestScore = false;

    private snake = {
        direction: CONTROLS.LEFT,
        parts: [
            {
                x: -1,
                y: -1
            }
        ]
    };

    private fruit = {
        x: -1,
        y: -1
    };

    constructor() {
        // Object.assign(this, values);
        this.setBoard();
        this.initPusher();
        this.listenForChanges();
    }

    // initialise Pusher and bind to presence channel
    initPusher(): SnakeAppComponent {
        // findOrCreate unique channel ID
        let id = this.getQueryParam('id');
        if (!id) {
            id = this.getUniqueId();
            location.search = location.search ? '&id=' + id : 'id=' + id;
        }
        this.gameId = id;

        // init pusher
        const pusher = new Pusher('8f5d8c8479ce914e18b5', {
            appId: '1016839',
            secret: '631d6f6c2e2c24215236',
            cluster: 'us3',
            encrypted: false
        });

        // bind to relevant Pusher presence channel
        this.pusherChannel = pusher.subscribe(this.gameId);
        this.pusherChannel.bind('pusher:member_added', data => { this.players++ });
        this.pusherChannel.bind('pusher:subscription_succeeded', members => {
            members.each(function(member) {
                // for example:
                console.log(member.id, member.info);
              });
        });
        this.pusherChannel.bind('pusher:member_removed', data => { this.players-- });

        return this;
    }

    // Listen for `client-fire` events.
    // Update the board object and other properties when 
    // event triggered
    listenForChanges(): SnakeAppComponent {
        this.pusherChannel.bind('client-fire', (obj) => {
            this.canPlay = !this.canPlay;
            console.log(obj);
            // this.boards[obj.boardId] = obj.board;
            // this.boards[obj.player].player.score = obj.score;
        });
        return this;
    }

    // helper function to get a query param
    getQueryParam(name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }

    // helper function to create a unique presence channel
    // name for each game
    getUniqueId() {
        return 'presence-' + Math.random().toString(36).substr(2, 8);
    }

    // initialise player and set turn
    setPlayer(players: number = 0): SnakeAppComponent {
        this.playerId = players - 1;
        if (players == 1) {
            this.canPlay = true;
        } else if (players == 2) {
            this.canPlay = false;
        }
        return this;
    }

    handleKeyboardEvents(e: KeyboardEvent) {
        if (e.keyCode === CONTROLS.LEFT && this.snake.direction !== CONTROLS.RIGHT) {
            this.pusherChannel.trigger("client-fire", { input: 'left' })
            this.tempDirection = CONTROLS.LEFT;
        } else if (e.keyCode === CONTROLS.UP && this.snake.direction !== CONTROLS.DOWN) {
            this.tempDirection = CONTROLS.UP;
        } else if (e.keyCode === CONTROLS.RIGHT && this.snake.direction !== CONTROLS.LEFT) {
            this.tempDirection = CONTROLS.RIGHT;
        } else if (e.keyCode === CONTROLS.DOWN && this.snake.direction !== CONTROLS.UP) {
            this.tempDirection = CONTROLS.DOWN;
        }
    }

    setColors(col: number, row: number): string {
        if (this.isGameOver) {
            return COLORS.GAME_OVER;
        } else if (this.fruit.x === row && this.fruit.y === col) {
            return COLORS.FRUIT;
        } else if (this.snake.parts[0].x === row && this.snake.parts[0].y === col) {
            return COLORS.HEAD;
        } else if (this.board[col][row] === true) {
            return COLORS.BODY;
        } else if (this.default_mode === 'obstacles' && this.checkObstacles(row, col)) {
            return COLORS.OBSTACLE;
        }

        return COLORS.BOARD;
    };

    updatePositions(): void {
        let newHead = this.repositionHead();
        let me = this;

        if (this.default_mode === 'classic' && this.boardCollision(newHead)) {
            return this.gameOver();
        } else if (this.default_mode === 'no_walls') {
            this.noWallsTransition(newHead);
        } else if (this.default_mode === 'obstacles') {
            this.noWallsTransition(newHead);
            if (this.obstacleCollision(newHead)) {
                return this.gameOver();
            }
        }

        if (this.selfCollision(newHead)) {
            return this.gameOver();
        } else if (this.fruitCollision(newHead)) {
            this.eatFruit();
        }

        let oldTail = this.snake.parts.pop();
        this.board[oldTail.y][oldTail.x] = false;

        this.snake.parts.unshift(newHead);
        this.board[newHead.y][newHead.x] = true;

        this.snake.direction = this.tempDirection;

        setTimeout(() => {
            me.updatePositions();
        }, this.interval);
    }

    repositionHead(): any {
        let newHead = Object.assign({}, this.snake.parts[0]);

        if (this.tempDirection === CONTROLS.LEFT) {
            newHead.x -= 1;
        } else if (this.tempDirection === CONTROLS.RIGHT) {
            newHead.x += 1;
        } else if (this.tempDirection === CONTROLS.UP) {
            newHead.y -= 1;
        } else if (this.tempDirection === CONTROLS.DOWN) {
            newHead.y += 1;
        }

        return newHead;
    }

    noWallsTransition(part: any): void {
        if (part.x === BOARD_SIZE) {
            part.x = 0;
        } else if (part.x === -1) {
            part.x = BOARD_SIZE - 1;
        }

        if (part.y === BOARD_SIZE) {
            part.y = 0;
        } else if (part.y === -1) {
            part.y = BOARD_SIZE - 1;
        }
    }

    addObstacles(): void {
        let x = this.randomNumber();
        let y = this.randomNumber();

        if (this.board[y][x] === true || y === 8) {
            return this.addObstacles();
        }

        this.obstacles.push({
            x: x,
            y: y
        });
    }

    checkObstacles(x, y): boolean {
        let res = false;

        this.obstacles.forEach((val) => {
            if (val.x === x && val.y === y) {
                res = true;
            }
        });

        return res;
    }

    obstacleCollision(part: any): boolean {
        return this.checkObstacles(part.x, part.y);
    }

    boardCollision(part: any): boolean {
        return part.x === BOARD_SIZE || part.x === -1 || part.y === BOARD_SIZE || part.y === -1;
    }

    selfCollision(part: any): boolean {
        return this.board[part.y][part.x] === true;
    }

    fruitCollision(part: any): boolean {
        return part.x === this.fruit.x && part.y === this.fruit.y;
    }

    resetFruit(): void {
        let x = this.randomNumber();
        let y = this.randomNumber();

        if (this.board[y][x] === true || this.checkObstacles(x, y)) {
            return this.resetFruit();
        }

        this.fruit = {
            x: x,
            y: y
        };
    }

    eatFruit(): void {
        this.score++;

        let tail = Object.assign({}, this.snake.parts[this.snake.parts.length - 1]);

        this.snake.parts.push(tail);
        this.resetFruit();

        if (this.score % 5 === 0) {
            this.interval -= 15;
        }
    }

    gameOver(): void {
        this.isGameOver = true;
        this.gameStarted = false;
        let me = this;

        setTimeout(() => {
            me.isGameOver = false;
        }, 500);

        this.setBoard();
    }

    randomNumber(): any {
        return Math.floor(Math.random() * BOARD_SIZE);
    }

    setBoard(): void {
        this.board = [];

        for (let i = 0; i < BOARD_SIZE; i++) {
            this.board[i] = [];
            for (let j = 0; j < BOARD_SIZE; j++) {
                this.board[i][j] = false;
            }
        }
    }

    showMenu(): void {
        this.showMenuChecker = !this.showMenuChecker;
    }

    newGame(mode: string): void {
        this.default_mode = mode || 'classic';
        this.showMenuChecker = false;
        this.newBestScore = false;
        this.gameStarted = true;
        this.score = 0;
        this.tempDirection = CONTROLS.LEFT;
        this.isGameOver = false;
        this.interval = 150;
        this.snake = {
            direction: CONTROLS.LEFT,
            parts: []
        };

        for (let i = 0; i < 3; i++) {
            this.snake.parts.push({ x: 8 + i, y: 8 });
        }

        if (mode === 'obstacles') {
            this.obstacles = [];
            let j = 1;
            do {
                this.addObstacles();
            } while (j++ < 9);
        }

        this.resetFruit();
        this.updatePositions();
    }
}
