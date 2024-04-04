import roleEntities from '../../modules/roles/entities';
import userEntities from '../../modules/users/entities';
import userSessionEntities from '../../modules/user-sessions/entities';
import imageEntities from '../../modules/images/entites';
import formQuestionEntities from '../../modules/form-questions/entities';
import formEntities from '../../modules/forms/entities';
import singleQuestionEntities from '../../modules/single-questions/entities';
import groupQuestionEntities from '../../modules/group-questions/entities';
import notificationEntities from '../../modules/notifications/entities';
import backupHistories from '../../modules/backup/entities';
import formTemplateEntities from '../../modules/form_templates/entities';

const entities = [
    ...roleEntities,
    ...userEntities,
    ...userSessionEntities,
    ...imageEntities,
    ...formEntities,
    ...formQuestionEntities,
    ...singleQuestionEntities,
    ...groupQuestionEntities,
    ...notificationEntities,
    ...backupHistories,
    ...formTemplateEntities,
];
export default entities;
