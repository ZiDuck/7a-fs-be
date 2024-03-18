import roleEntities from '../../modules/roles/entities';
import userEntities from '../../modules/users/entities';
import refreshTokenEntities from '../../modules/user-sessions/entities';

const entities = [...roleEntities, ...userEntities, ...refreshTokenEntities];
export default entities;
