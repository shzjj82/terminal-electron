<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# Terminal Electron Service

NestJS后端服务，为Terminal Electron应用提供云服务支持。

## 功能特性

- 🔐 用户认证（注册/登录）
- 🖥️ 服务器管理
- 🔑 SSH密钥管理
- 🔄 端口转发管理
- 📱 本地数据同步

## 安装和运行

### 1. 安装依赖

```bash
pnpm install
```

### 2. 环境配置

环境变量文件位于项目根目录的 `env/` 目录：

- `env/development.env` - 开发环境配置
- `env/production.env` - 生产环境配置

### 3. 数据库配置

在开发环境下，应用会自动：
- 检查PostgreSQL连接
- 创建数据库（如果不存在）
- 创建所需的表结构

**注意**: 
- 确保PostgreSQL服务正在运行
- 不要在此目录下创建 `.env` 文件，避免配置冲突
- 配置会自动从 `env/development.env` 或 `env/production.env` 加载

### 3. 启动服务

开发模式：
```bash
pnpm start:dev
```

生产模式：
```bash
pnpm build
pnpm start:prod
```

## API 接口

### 认证接口

#### 注册用户
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

#### 用户登录
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### 服务器管理

#### 获取所有服务器
```http
GET /servers
Authorization: Bearer <token>
```

#### 创建服务器
```http
POST /servers
Authorization: Bearer <token>
Content-Type: application/json

{
  "localId": "local-uuid",
  "name": "My Server",
  "host": "192.168.1.100",
  "port": 22,
  "username": "root",
  "password": "password",
  "authType": "password",
  "description": "My local server"
}
```

#### 同步本地数据
```http
POST /servers/sync
Authorization: Bearer <token>
Content-Type: application/json

[
  {
    "localId": "local-uuid-1",
    "name": "Server 1",
    "host": "192.168.1.100",
    "port": 22,
    "username": "root",
    "authType": "password"
  },
  {
    "localId": "local-uuid-2",
    "name": "Server 2",
    "host": "192.168.1.101",
    "port": 22,
    "username": "admin",
    "authType": "key",
    "keyId": "key-uuid"
  }
]
```

### 密钥管理

#### 获取所有密钥
```http
GET /keys
Authorization: Bearer <token>
```

#### 创建密钥
```http
POST /keys
Authorization: Bearer <token>
Content-Type: application/json

{
  "localId": "local-key-uuid",
  "name": "My SSH Key",
  "type": "rsa",
  "privateKey": "-----BEGIN RSA PRIVATE KEY-----...",
  "passphrase": "optional-passphrase",
  "description": "My SSH key for server access"
}
```

#### 同步本地密钥
```http
POST /keys/sync
Authorization: Bearer <token>
Content-Type: application/json

[
  {
    "localId": "local-key-uuid",
    "name": "Key 1",
    "type": "rsa",
    "privateKey": "-----BEGIN RSA PRIVATE KEY-----..."
  }
]
```

### 端口转发管理

#### 获取所有端口转发
```http
GET /port-forwards
Authorization: Bearer <token>
```

#### 创建端口转发
```http
POST /port-forwards
Authorization: Bearer <token>
Content-Type: application/json

{
  "localId": "local-forward-uuid",
  "name": "Web Server Forward",
  "type": "local",
  "localHost": "127.0.0.1",
  "localPort": 8080,
  "remoteHost": "127.0.0.1",
  "remotePort": 80,
  "serverId": "server-uuid"
}
```

#### 同步本地端口转发
```http
POST /port-forwards/sync
Authorization: Bearer <token>
Content-Type: application/json

[
  {
    "localId": "local-forward-uuid",
    "name": "Forward 1",
    "type": "local",
    "localHost": "127.0.0.1",
    "localPort": 8080,
    "remoteHost": "127.0.0.1",
    "remotePort": 80
  }
]
```

## 数据同步策略

### 本地ID和服务端ID

- **localId**: 前端生成的UUID，用于标识本地数据
- **id**: 服务端生成的UUID，用于标识服务端数据

### 同步逻辑

1. **首次登录同步**: 用户首次登录时，将本地数据同步到服务端
2. **重复数据检测**: 通过 `localId` 检测是否已存在相同数据
3. **数据更新**: 如果存在相同 `localId`，则更新现有记录
4. **新数据创建**: 如果不存在相同 `localId`，则创建新记录

### 防重复机制

- 使用 `localId` 作为唯一标识符
- 在同步时检查 `localId` 是否已存在
- 避免创建重复记录

## 开发

### 数据库

使用PostgreSQL作为数据库，支持高并发和复杂查询。TypeORM会自动创建所需的表结构。

### 认证

使用JWT进行用户认证，token有效期为7天。

### 数据验证

使用 `class-validator` 进行请求数据验证。

## 部署

### 环境变量

确保设置正确的环境变量：

- `JWT_SECRET`: JWT签名密钥
- `DB_TYPE`: 数据库类型 (postgres)
- `DB_HOST`: 数据库主机地址
- `DB_PORT`: 数据库端口
- `DB_USERNAME`: 数据库用户名
- `DB_PASSWORD`: 数据库密码
- `DB_DATABASE`: 数据库名称
- `PORT`: 服务端口

### 生产环境

1. 设置强密码的JWT密钥
2. 使用数据库迁移而不是 `synchronize: true`
3. 配置适当的CORS策略
4. 使用HTTPS
