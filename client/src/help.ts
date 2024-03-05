export type card = {
    question: string;
    answer: string;
}

/** parses user given text to flash cards */
export const parseDeck = (text: string): undefined | card[] => {
    const deck: card[] = [];
    const lines: string[] = text.split('\n');
    for (const card of lines) {
        const newCard = card.trim();
        const index: number = newCard.indexOf('|');
        if (index === -1) {
            return undefined;
        } else if (index === newCard.length-1 || index === 0) {
            return undefined;
        } else {
            deck.push({question: newCard.slice(0, index), answer: newCard.slice(index+1, newCard.length)});
        }
        
    }
    return deck;
}