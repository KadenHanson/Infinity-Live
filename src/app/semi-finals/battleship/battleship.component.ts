import { Component, ViewContainerRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BoardService } from './board.service';
import { Board } from './board';
import { Router } from '@angular/router';
declare const Pusher: any;

// set game constants
const NUM_PLAYERS: number = 2;
const BOARD_SIZE: number = 6;

@Component({
    selector: 'app-battleship',
    templateUrl: './battleship.component.html',
    styleUrls: ['./battleship.component.css'],
    providers: [BoardService]
})
export class BattleshipComponent {
    pusherChannel: any;
    canPlay: boolean = true;
    showBoard: boolean = false;
    spectator: boolean = false;
    player: number = 0;
    players: number = 0;
    gameId: string;
    gameUrl: string = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port: '') + this.router.url;

    constructor(
        public _vcr: ViewContainerRef,
        private boardService: BoardService,
        public router: Router,
        private toastr: ToastrService
    ) {
        this.initPusher();
        this.createBoards();
        this.listenForChanges();
    }

    initPusher(): BattleshipComponent {
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
        
        // bind to relevant channels
        this.pusherChannel = pusher.subscribe(id);
        this.pusherChannel.bind('pusher:member_added', member => { this.players++; this.showBoard = true })
        this.pusherChannel.bind('pusher:subscription_succeeded', members => {
            this.players = members.count;
            this.setPlayer(this.players);
            this.toastr.success("Success", 'Connected!');
        })
        this.pusherChannel.bind('pusher:member_removed', member => { this.players--; this.showBoard = false });

        return this;
    }

    listenForChanges(): BattleshipComponent {
        this.pusherChannel.bind('client-fire', (obj) => {
            this.canPlay = !this.canPlay;
            this.boards[obj.boardId] = obj.board;
            this.boards[obj.player].player.score = obj.score;
        });
        return this;
    }

    setPlayer(players: number = 0): BattleshipComponent {
        this.player = players - 1;
        if (players == 1) {
            this.canPlay = true;
            this.showBoard = false;
        } else if (players == 2) {
            this.canPlay = false;
            this.showBoard = true;
        } else {
            this.spectator = true;
            this.canPlay = false;
        }
        return this;
    }

    fireTorpedo(e: any): BattleshipComponent {
        let id = e.target.id,
            boardId = id.substring(1, 2),
            row = id.substring(2, 3), col = id.substring(3, 4),
            tile = this.boards[boardId].tiles[row][col];
        if (!this.checkValidHit(boardId, tile)) {
            return;
        }

        if (tile.value == 1) {
            this.toastr.success("You're almost as deadly as stabbin' stan!", "YOU SANK A SHIP!");
            this.boards[boardId].tiles[row][col].status = 'win';
            this.boards[this.player].player.score++;
        } else {
            this.toastr.info("You have brought shame to your infinity family.", "OOPS! YOU MISSED THIS TIME");
            this.boards[boardId].tiles[row][col].status = 'fail'
        }
        this.canPlay = false;
        this.boards[boardId].tiles[row][col].used = true;
        this.boards[boardId].tiles[row][col].value = "X";
        this.pusherChannel.trigger('client-fire', {
            player: this.player,
            score: this.boards[this.player].player.score,
            boardId: boardId,
            board: this.boards[boardId]
        });
        return this;
    }

    createBoards(): BattleshipComponent {
        for (let i = 0; i < NUM_PLAYERS; i++)
            this.boardService.createBoard(BOARD_SIZE);
        return this;
    }

    checkValidHit(boardId: number, tile: any): boolean {
        if (boardId == this.player) {
            this.toastr.error("Stop hitting yourself!!", "You can't hit your own board.")
            return false;
        }
        if (this.winner) {
            this.toastr.error("Game is over");
            return false;
        }
        if (!this.canPlay) {
            this.toastr.error("A bit too eager.", "It's not your turn to play.");
            return false;
        }
        if (tile.value == "X") {
            this.toastr.error("Rule #2 may be double tap, but with explosives that isn't necessary", "You already shot here.");
            return false;
        }
        return true;
    }

    getQueryParam(name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }

    getUniqueId() {
        return 'presence-' + Math.random().toString(36).substr(2, 8);
    }

    get boards(): Board[] {
        return this.boardService.getBoards()
    }

    get winner(): Board {
        return this.boards.find(board => board.player.score >= BOARD_SIZE);
    }

    get validPlayer(): boolean {
        return (this.players >= NUM_PLAYERS) && (this.player < NUM_PLAYERS);
    }
}