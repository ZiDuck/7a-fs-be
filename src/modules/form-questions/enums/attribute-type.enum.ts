export enum AttributeType {
    TEXT_BOX = 'TEXT_BOX',
    PARAGRAPH = 'PARAGRAPH',
    CHECKBOX_BUTTON = 'CHECKBOX_BUTTON',
    RADIO_BUTTON = 'RADIO_BUTTON',
    DROPDOWN = 'DROPDOWN',
    FILE_UPLOAD = 'FILE_UPLOAD',
    STAR = 'STAR',
    CHECKBOX_GRID = 'CHECKBOX_GRID',
    RADIO_GRID = 'RADIO_GRID',
}

export const TEXT_QUESTION_TYPES = [AttributeType.TEXT_BOX, AttributeType.PARAGRAPH];

export const ONE_SELECTION_QUESTION_TYPES = [AttributeType.RADIO_BUTTON, AttributeType.DROPDOWN];

export const SELECTION_QUESTION_TYPES = [...ONE_SELECTION_QUESTION_TYPES, AttributeType.CHECKBOX_BUTTON];

export const NO_ANSWER_QUESTION_TYPES = [AttributeType.STAR, AttributeType.FILE_UPLOAD];

export const SINGLE_QUESTION_TYPES = [...TEXT_QUESTION_TYPES, ...SELECTION_QUESTION_TYPES, ...NO_ANSWER_QUESTION_TYPES];

export const GROUP_QUESTION_TYPES = [AttributeType.CHECKBOX_GRID, AttributeType.RADIO_GRID];

export const QUESTION_TYPES = [...SINGLE_QUESTION_TYPES, ...GROUP_QUESTION_TYPES];
