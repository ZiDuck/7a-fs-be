import backupHistories from '../../modules/backup/entities';
import fileHistories from '../../modules/file-history/entites';
import formTemplateEntities from '../../modules/form_templates/entities';
import formQuestionEntities from '../../modules/form-questions/entities';
import formSubmitEntities from '../../modules/form-submits/entities';
import formEntities from '../../modules/forms/entities';
import groupQuestionEntities from '../../modules/group-questions/entities';
import imageHistories from '../../modules/image-history/entities';
import imageEntities from '../../modules/images/entites';
import notificationEntities from '../../modules/notifications/entities';
import rawFileEntities from '../../modules/raw-files/enitites';
import roleEntities from '../../modules/roles/entities';
import singleQuestionEntities from '../../modules/single-questions/entities';
import userSessionEntities from '../../modules/user-sessions/entities';
import userEntities from '../../modules/users/entities';

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
    ...formSubmitEntities,
    ...rawFileEntities,
    ...imageHistories,
    ...fileHistories,
];
export default entities;
