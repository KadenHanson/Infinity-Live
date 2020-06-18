export class Player {
    id: number;
    score: number = 0;
    name: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}