import { Component, OnInit } from '@angular/core';
import FuzzySet from 'fuzzyset'

interface questionObject {
    question: string;
    answer: Array<answerObject>;
    id: number;
}

interface tieQuestionObject {
    question: string;
    answer: string;
    id: number;
}

interface answerObject {
    value: string;
    correct: boolean;
}

@Component({
    selector: 'app-finals',
    templateUrl: './finals.component.html',
    styleUrls: ['./finals.component.css']
})
export class FinalsComponent implements OnInit {
    questionsAndAnswers: Array<questionObject>;
    tieBreakerQuestion: tieQuestionObject;

    constructor() {
        this.questionsAndAnswers = [
            {
                question: "Who is the founder of Infinity?",
                answer: [
                    { value: "open-ended: [Chris Leyva]", correct: true }
                ],
                id: 1
            },
            {
                question: "What year was Infinity founded?",
                answer: [
                    { value: "1997", correct: false },
                    { value: "2000", correct: false },
                    { value: "2003", correct: true }
                ],
                id: 2
            },
            {
                question: "What is the name of Infinity's Happy Hour establishment?",
                answer: [
                    { value: "open-ended: [Final Draught]", correct: true }
                ],
                id: 3
            },
            {
                question: "What is the address of our office in Sparks?",
                answer: [
                    { value: "4864 Sparks Boulevard", correct: true },
                    { value: "910 Roberta Lane", correct: false },
                    { value: "6824 Victorian Avenue", correct: false }
                ],
                id: 4
            },
            {
                question: "Which of the following is a core company value?",
                answer: [
                    { value: "Expand Elevate", correct: false },
                    { value: "Happiness is Our Advantage", correct: false },
                    { value: "Average Performance is Poor Performance", correct: true },
                    { value: "Honestly Awesome", correct: false }
                ],
                id: 5
            },
            {
                question: "In what city was Infinity's last User Conference held?",
                answer: [
                    { value: "Austin, TX", correct: true },
                    { value: "Las Vegas, NV", correct: false },
                    { value: "Funner, CA", correct: false },
                    { value: "Lake Tahoe, NV", correct: false }
                ],
                id: 6
            },
            {
                question: "What is Brandon Lao's real first name?",
                answer: [
                    { value: "Ron", correct: true },
                    { value: "Ryan", correct: false },
                    { value: "Ralph", correct: false }
                ],
                id: 7
            },
            {
                question: "How many children does Kaden have?",
                answer: [
                    { value: "2", correct: true },
                    { value: "3", correct: false },
                    { value: "none", correct: false }
                ],
                id: 8
            },
            {
                question: "Who has been with Infinity longer, Jeffrey Bethers or Bryan Morgan?",
                answer: [
                    { value: "Jeffrey Bethers", correct: true },
                    { value: "Bryan Morgan", correct: false }
                ],
                id: 9
            },
            {
                question: "Who is the 4th oldest Leyva son?",
                answer: [
                    { value: "Ryen", correct: false },
                    { value: "Brandon", correct: true },
                    { value: "Jordan", correct: false },
                    { value: "Alexx", correct: false }
                ],
                id: 10
            },
            {
                question: "What primary language is Eclipse written in?",
                answer: [
                    { value: "Java", correct: false },
                    { value: "C#", correct: true },
                    { value: "Ruby", correct: false },
                    { value: "PHP", correct: false }
                ],
                id: 11
            },
            {
                question: "What is Amy's daughter's name?",
                answer: [
                    { value: "Sarah", correct: false },
                    { value: "Jane", correct: true },
                    { value: "Abby", correct: false }
                ],
                id: 12
            },
            {
                question: "What is Maddie's gamer tag name?",
                answer: [
                    { value: "LilMadDawg Wolf", correct: true },
                    { value: "BigDawg Wolf", correct: false },
                    { value: "TicketCloser Wolf", correct: false }
                ],
                id: 13
            },
            {
                question: "Where is Chris Grant?",
                answer: [
                    { value: "Fallon, NV", correct: false },
                    { value: "Silver Springs, NV", correct: true },
                    { value: "Lovelock, NV", correct: false },
                    { value: "Washoe Valley, NV", correct: false }
                ],
                id: 14
            },
            {
                question: "Where did Michaela recently move from?",
                answer: [
                    { value: "Virginia", correct: true },
                    { value: "California", correct: false },
                    { value: "North Carolina", correct: false }
                ],
                id: 15
            },
            {
                question: "What is Natalia's cat's name?",
                answer: [
                    { value: "Kitty", correct: false },
                    { value: "Oscar", correct: false },
                    { value: "Marley", correct: true }
                ],
                id: 16
            },
            {
                question: "What kind of dog does Valarie have?",
                answer: [
                    { value: "Golden retriever", correct: true },
                    { value: "Yellow lab", correct: false },
                    { value: "Husky", correct: false }
                ],
                id: 17
            },
            {
                question: "What is the name of Natalie's boyfriend?",
                answer: [
                    { value: "Brett", correct: false },
                    { value: "John", correct: false },
                    { value: "Ryan", correct: true }
                ],
                id: 18
            },
            {
                question: "What are the names of the 3 Vietnamese team members who came to visit us last year?",
                answer: [
                    { value: "open-ended: [Mike, Ella, Quant]", correct: true }
                ],
                id: 19
            },
            {
                question: "Where did the phrase, 'Stabbin Stan' come from?",
                answer: [
                    { value: "open-ended: [The Jack Box trivia game night]", correct: true }
                ],
                id: 20
            }
        ];
        this.tieBreakerQuestion = {
            question: "I have a bag and in the bag is a ball. The ball is either green or red and there is a 50% chance of it being either color. I add to the bag a red ball. I then reach into the bag and randomly pull out one of the balls that happens to be red. What are the chances now that the other ball is also red?",
            answer: "66%",
            id: 21
        };
    }

    ngOnInit() {
        
    }

    verifyAnswer(questionId: number, contestantAnswer: string, tieBreaker?: boolean) {
        if (tieBreaker) {
            let compareString = FuzzySet([this.tieBreakerQuestion.answer]);
            let compare = compareString.get(contestantAnswer);

            if (compare === undefined || compare === null) {
                return false;
            } else if (compare[0] > 0.6) {
                return true;
            }
        }

        let questionObj = this.questionsAndAnswers.find(q => q.id === questionId);
        let answer = questionObj.answer;
        let correctAnswer = (answer as Array<answerObject>).find(a => a.correct);

        if (answer.length === 1) {
            let strippedAnswer = (correctAnswer.value.match(/(?<=\[).+?(?=\])/g))[0];
            let compareString = FuzzySet([strippedAnswer]);
            let compare = compareString.get(contestantAnswer);

            if (compare === undefined || compare === null) {
                alert('Wrong, shame on you!');
                return false;
            } else {
                if (compare[0][0] > 0.5) {
                    alert('Correct!');
                    return true;
                }
                alert('Wrong, shame on you!');
                return false;
            }
        } else {
            if (correctAnswer.value === contestantAnswer) {
                return true;
            }
            return false;
        }
    }
}
