import roleEntities from '../../modules/roles/entities';
import userEntities from '../../modules/users/entities';
import userSessionEntities from '../../modules/user-sessions/entities';

const entities = [...roleEntities, ...userEntities, ...userSessionEntities];
export default entities;
