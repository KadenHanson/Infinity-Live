import { Component, OnInit } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

interface contestant {
    firstname: string;
    lastname: string;
    pictureUrl: string;
    gameUrl: string;
}

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }
    transform(url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}
@Component({
    selector: 'app-semi-final-menu',
    templateUrl: './semi-final-menu.component.html',
    styleUrls: ['./semi-final-menu.component.css']
})
export class SemiFinalMenuComponent implements OnInit {
    contestantList: Array<Array<contestant>>;
    currentContestants: Array<contestant>;
    currentContestantsIndex: number = -1;
    currentGameUrl: string;
    gameStart: boolean = false;

    constructor() {
        
        this.contestantList = [
            [
                { firstname: 'TheDarkLordVesuvius', lastname: 'Hanson', pictureUrl: '../../../assets/player-profiles/kaden_profile.png', gameUrl: 'kaden-vs-amy' },
                { firstname: 'Chatty Cathy', lastname: 'Buccambuso', pictureUrl: '../../../assets/player-profiles/amy_profile.png', gameUrl: 'kaden-vs-amy' }
            ],
            [
                { firstname: 'BossMan', lastname: 'Reidy', pictureUrl: '../../../assets/player-profiles/jake_profile.png', gameUrl: 'jake-vs-chris' },
                { firstname: 'TheAncient1', lastname: 'Grant', pictureUrl: '../../../assets/player-profiles/chris_profile.png', gameUrl: 'jake-vs-chris' }
            ],
            [
                { firstname: 'MicMacPattyWack', lastname: 'Costello', pictureUrl: '../../../assets/player-profiles/michaela_profile.png', gameUrl: 'micaela-vs-steven' },
                { firstname: 'NevetsRubio', lastname: 'Rubio', pictureUrl: '../../../assets/player-profiles/steven_profile.png', gameUrl: 'micaela-vs-steven' }
            ],
            [
                { firstname: 'RobBoss054', lastname: 'Nelson', pictureUrl: '../../../assets/player-profiles/andy_profile.png', gameUrl: 'andy-vs-prince' },
                { firstname: 'Praetor Al Zek', lastname: 'Noble', pictureUrl: '../../../assets/player-profiles/prince_profile.png', gameUrl: 'andy-vs-prince' }
            ],
            [
                { firstname: 'beloud', lastname: 'Brandon Lao', pictureUrl: '../../../assets/player-profiles/brandon_profile.png', gameUrl: 'brandon-vs-eli' },
                { firstname: 'LebronasaurusRex', lastname: 'Hsieh', pictureUrl: '../../../assets/player-profiles/eli_profile.png', gameUrl: 'brandon-vs-eli' }
            ]
        ];
    }

    ngOnInit() {
        this.currentContestants = this.contestantList[this.currentContestantsIndex];
    }

    startGame() {
        document.body.style.height = "auto";
        this.setCurrentGame();
        this.gameStart = true;
    }

    setCurrentGame() {
        if (this.currentContestantsIndex < 4) {
            this.currentContestantsIndex++;
            this.currentContestants = this.contestantList[this.currentContestantsIndex];
            this.currentGameUrl = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + "/semi-finals/battleship?id=presence-" + this.currentContestants[0].gameUrl + '&spectator=true';
        }
    }
}