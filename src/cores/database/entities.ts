import roleEntities from '../../modules/roles/entities';
import userEntities from '../../modules/users/entities';
import userSessionEntities from '../../modules/user-sessions/entities';
import imageEntities from '../../modules/images/entites';

const entities = [...roleEntities, ...userEntities, ...userSessionEntities, ...imageEntities];
export default entities;
