import roleEntities from '../../modules/roles/entities';
import userEntities from '../../modules/users/entities';
import userSessionEntities from '../../modules/user-sessions/entities';
import imageEntities from '../../modules/images/entites';
import formQuestionEntities from '../../modules/form-questions/entities';
import formEntities from '../../modules/forms/entities';
import singleQuestionEntities from '../../modules/single-questions/entities';
import groupQuestionEntities from '../../modules/group-questions/entities';

const entities = [
    ...roleEntities,
    ...userEntities,
    ...userSessionEntities,
    ...imageEntities,
    ...formEntities,
    ...formQuestionEntities,
    ...singleQuestionEntities,
    ...groupQuestionEntities,
];
export default entities;
