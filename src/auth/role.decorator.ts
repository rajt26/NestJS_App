import { SetMetadata } from "@nestjs/common/decorators"
import { Role } from '../constants/user/user.constants'
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);