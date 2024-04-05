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

export const SINGLE_QUESTION_TYPES = [
    AttributeType.TEXT_BOX,
    AttributeType.PARAGRAPH,
    AttributeType.CHECKBOX_BUTTON,
    AttributeType.RADIO_BUTTON,
    AttributeType.DROPDOWN,
];

export const GROUP_QUESTION_TYPES = [AttributeType.CHECKBOX_GRID, AttributeType.RADIO_GRID];

export const QUESTION_TYPES = [...SINGLE_QUESTION_TYPES, ...GROUP_QUESTION_TYPES];
