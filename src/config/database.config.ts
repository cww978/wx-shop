import { TypeOrmModuleOptions } from '@nestjs/typeorm'
export default <TypeOrmModuleOptions>{
  type: 'mysql',
  host: '43.156.38.80',
  port: 3306,
  username: 'root',
  password: 'chuyin978',
  database: 'wx-platform',
  synchronize: false,
  autoLoadEntities: true
}
