export type card = {
    question: string;
    answer: string;
}

/** parses user given text to flash cards */
export const parseDeck = (text: string): undefined | card[] => {
    const deck: card[] = [];
    const lines: string[] = text.split('\n');
    for (const card of lines) {
        
        const index: number = card.indexOf('|');
        if (index === -1) {
            return undefined;
        } else if (index === card.length-1 || index === 0) {
            return undefined;
        } else {
            deck.push({question: card.slice(0, index), answer: card.slice(index+1, card.length)});
        }
        
    }
    return deck;
}

/** converts strings to json format */
export const toJson = (data: card[]): unknown => {
    return data;
}
