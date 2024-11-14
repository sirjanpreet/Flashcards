
/** Respresent a card in a deck of flashcards */
export type card = {
    question: string;
    answer: string;
}

/** parses user given text to flash cards 
 * @param text accepts a string that represents a deck of flash cars
 * @returns undefined if the deck was improperly formatted (no | in the middle of each line).
 * Otherwise, returns an array of cards, with each line having its own element in the array.
*/
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

/** Represents the current page that the app should be display to the user */
export type Page = {kind: "list"} | {kind: "takequiz"} | {kind: "createquiz"} | {kind: "endquiz"};
