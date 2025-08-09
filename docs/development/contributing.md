# 贡献指南

感谢您对 Terminal Electron 项目的关注！本文档将指导您如何参与项目开发，包括代码贡献、问题报告、功能建议等。

## 贡献方式

### 1. 报告问题 (Bug Reports)

#### 问题报告模板
```markdown
**问题描述**
简要描述问题

**复现步骤**
1. 打开应用
2. 点击某个功能
3. 观察错误行为

**预期行为**
描述您期望的正确行为

**实际行为**
描述实际发生的错误行为

**环境信息**
- 操作系统: [如 macOS 12.0]
- 应用版本: [如 v1.0.0]
- Node.js 版本: [如 18.0.0]

**附加信息**
- 错误截图 (如果适用)
- 错误日志 (如果适用)
- 其他相关信息
```

#### 报告渠道
- **GitHub Issues**: 主要问题报告渠道
- **Discord**: 实时讨论和快速反馈
- **Email**: 安全相关问题

### 2. 功能建议 (Feature Requests)

#### 功能建议模板
```markdown
**功能描述**
详细描述您希望添加的功能

**使用场景**
描述这个功能的使用场景和用户价值

**实现建议**
如果有的话，提供实现思路或技术方案

**优先级**
- [ ] 高优先级 (核心功能)
- [ ] 中优先级 (重要功能)
- [ ] 低优先级 (优化功能)

**附加信息**
- 相关截图或设计稿
- 类似功能的参考
- 其他相关信息
```

### 3. 代码贡献 (Code Contributions)

#### 贡献流程

##### 1. Fork 项目
```bash
# Fork 项目到您的 GitHub 账户
# 访问 https://github.com/shzjj82/terminal-electron
# 点击 "Fork" 按钮
```

##### 2. 克隆您的 Fork
```bash
# 克隆您的 Fork
git clone https://github.com/shzjj82/terminal-electron.git

# 添加上游仓库
git remote add upstream https://github.com/original-owner/terminal-electron.git

# 验证远程仓库
git remote -v
```

##### 3. 创建功能分支
```bash
# 更新主分支
git checkout main
git pull upstream main

# 创建功能分支
git checkout -b feature/your-feature-name

# 或创建修复分支
git checkout -b fix/your-fix-name
```

##### 4. 开发功能
```bash
# 安装依赖
yarn install

# 启动开发服务器
yarn dev

# 运行测试
yarn test

# 检查代码质量
yarn lint
yarn typecheck
```

##### 5. 提交代码
```bash
# 添加修改的文件
git add .

# 提交代码 (使用 Conventional Commits)
git commit -m "feat: add new feature description"

# 推送到您的 Fork
git push origin feature/your-feature-name
```

##### 6. 创建 Pull Request
- 访问您的 GitHub Fork
- 点击 "Compare & pull request"
- 填写详细的 PR 描述
- 等待代码审查

#### 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
# 新功能
git commit -m "feat: add SSH key management"

# 修复 Bug
git commit -m "fix: resolve connection timeout issue"

# 文档更新
git commit -m "docs: update API documentation"

# 代码重构
git commit -m "refactor: improve error handling"

# 性能优化
git commit -m "perf: optimize database queries"

# 测试相关
git commit -m "test: add unit tests for auth module"

# 构建相关
git commit -m "build: update electron builder config"

# 其他
git commit -m "chore: update dependencies"
```

#### 代码审查标准

##### 代码质量
- [ ] 代码符合项目编码规范
- [ ] 通过了所有自动化测试
- [ ] 没有引入新的警告或错误
- [ ] 代码有适当的注释和文档

##### 功能完整性
- [ ] 功能按预期工作
- [ ] 包含了必要的测试用例
- [ ] 更新了相关文档
- [ ] 考虑了向后兼容性

##### 安全性
- [ ] 没有引入安全漏洞
- [ ] 敏感信息得到适当保护
- [ ] 输入验证和错误处理完善

## 开发环境设置

### 1. 环境准备

#### 系统要求
- Node.js 18.x+
- Yarn 1.22.x+
- Git 2.30.x+
- 支持的操作系统 (Windows/macOS/Linux)

#### 开发工具
- **VS Code** (推荐)
  - TypeScript 扩展
  - ESLint 扩展
  - Prettier 扩展
  - GitLens 扩展

### 2. 项目设置

```bash
# 克隆项目
git clone https://github.com/shzjj82/terminal-electron.git
cd terminal-electron

# 安装依赖
yarn install

# 配置环境变量
cp env/env.example env/development.env

# 启动开发服务器
yarn dev
```

### 3. 开发工作流

#### 日常开发
```bash
# 1. 更新主分支
git checkout main
git pull upstream main

# 2. 创建功能分支
git checkout -b feature/your-feature

# 3. 开发功能
# ... 编写代码 ...

# 4. 运行测试
yarn test

# 5. 检查代码质量
yarn lint
yarn typecheck

# 6. 提交代码
git add .
git commit -m "feat: your feature description"

# 7. 推送分支
git push origin feature/your-feature
```

#### 代码审查
```bash
# 1. 确保测试通过
yarn test

# 2. 检查代码覆盖率
yarn test:coverage

# 3. 运行集成测试
yarn test:integration

# 4. 检查构建
yarn build

# 5. 更新文档
# 确保相关文档已更新
```

## 代码规范

### 1. TypeScript 规范

#### 类型定义
```typescript
// 使用接口定义对象结构
interface Server {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
}

// 使用类型别名定义联合类型
type AuthType = 'password' | 'key' | 'agent';

// 使用泛型提高代码复用性
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
```

#### 函数定义
```typescript
// 使用箭头函数
const connectServer = async (server: Server): Promise<Connection> => {
  // 实现逻辑
};

// 使用可选参数和默认值
const createServer = (
  config: ServerConfig,
  options: CreateOptions = {}
): Server => {
  // 实现逻辑
};
```

### 2. React 规范

#### 组件定义
```typescript
// 使用函数组件
interface ServerListProps {
  servers: Server[];
  onSelect: (server: Server) => void;
}

const ServerList: React.FC<ServerListProps> = ({ servers, onSelect }) => {
  return (
    <div className="server-list">
      {servers.map(server => (
        <ServerItem key={server.id} server={server} onSelect={onSelect} />
      ))}
    </div>
  );
};
```

#### Hooks 使用
```typescript
// 使用自定义 Hooks
const useServers = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchServers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.getServers();
      setServers(response.data);
    } catch (error) {
      console.error('Failed to fetch servers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { servers, loading, fetchServers };
};
```

### 3. 后端规范

#### 控制器定义
```typescript
@Controller('servers')
export class ServersController {
  constructor(private readonly serversService: ServersService) {}

  @Get()
  async findAll(@Query() query: GetServersDto): Promise<Server[]> {
    return this.serversService.findAll(query);
  }

  @Post()
  async create(@Body() createServerDto: CreateServerDto): Promise<Server> {
    return this.serversService.create(createServerDto);
  }
}
```

#### 服务定义
```typescript
@Injectable()
export class ServersService {
  constructor(
    @InjectRepository(Server)
    private readonly serverRepository: Repository<Server>
  ) {}

  async findAll(query: GetServersDto): Promise<Server[]> {
    const { namespace, status } = query;
    
    const queryBuilder = this.serverRepository.createQueryBuilder('server');
    
    if (namespace) {
      queryBuilder.where('server.namespace = :namespace', { namespace });
    }
    
    if (status) {
      queryBuilder.andWhere('server.status = :status', { status });
    }
    
    return queryBuilder.getMany();
  }
}
```

### 4. 测试规范

#### 单元测试
```typescript
describe('ServersService', () => {
  let service: ServersService;
  let repository: Repository<Server>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ServersService,
        {
          provide: getRepositoryToken(Server),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ServersService>(ServersService);
    repository = module.get<Repository<Server>>(getRepositoryToken(Server));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all servers', async () => {
      const mockServers = [/* mock data */];
      jest.spyOn(repository, 'find').mockResolvedValue(mockServers);

      const result = await service.findAll({});

      expect(result).toEqual(mockServers);
    });
  });
});
```

#### 集成测试
```typescript
describe('ServersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/servers (GET)', () => {
    return request(app.getHttpServer())
      .get('/servers')
      .expect(200);
  });
});
```

## 文档贡献

### 1. 文档类型

#### API 文档
- 更新 API 接口文档
- 添加请求/响应示例
- 完善错误码说明

#### 用户指南
- 编写功能使用教程
- 添加截图和示例
- 更新安装和配置说明

#### 开发文档
- 更新架构文档
- 添加开发指南
- 完善部署文档

### 2. 文档规范

#### Markdown 格式
```markdown
# 标题使用 #

## 二级标题

### 三级标题

**粗体文本**
*斜体文本*

`代码片段`

```bash
# 代码块
yarn install
```

> 引用文本

- 列表项 1
- 列表项 2

1. 有序列表 1
2. 有序列表 2
```

#### 文档结构
- 使用清晰的标题层次
- 保持一致的格式风格
- 添加适当的链接和引用
- 包含必要的截图和示例

## 社区参与

### 1. 讨论参与

#### GitHub Discussions
- 参与功能讨论
- 回答用户问题
- 分享使用经验

#### Discord 社区
- 实时技术交流
- 问题快速反馈
- 开发者协作

### 2. 代码审查

#### 审查他人代码
- 提供建设性反馈
- 关注代码质量和安全性
- 帮助改进实现方案

#### 接受审查反馈
- 积极回应审查意见
- 及时修改问题代码
- 学习最佳实践

### 3. 知识分享

#### 技术博客
- 分享开发经验
- 介绍新功能特性
- 提供使用教程

#### 技术演讲
- 参与技术会议
- 分享项目经验
- 推广开源文化

## 发布流程

### 1. 版本发布

#### 版本号规范
使用 [语义化版本](https://semver.org/)：
- **主版本号**: 不兼容的 API 修改
- **次版本号**: 向下兼容的功能性新增
- **修订号**: 向下兼容的问题修正

#### 发布步骤
```bash
# 1. 更新版本号
yarn version --patch  # 或 --minor, --major

# 2. 构建发布版本
yarn build:electron:all

# 3. 运行测试
yarn test

# 4. 创建发布标签
git tag -a v1.0.0 -m "Release version 1.0.0"

# 5. 推送标签
git push origin v1.0.0
```

### 2. 发布说明

#### 发布说明模板
```markdown
# v1.0.0

## 🎉 新功能
- 添加 SSH 密钥管理功能
- 支持端口转发配置
- 新增团队协作功能

## 🐛 修复
- 修复连接超时问题
- 解决内存泄漏问题
- 修复 UI 显示异常

## 📚 文档
- 更新 API 文档
- 添加用户指南
- 完善开发文档

## 🔧 技术改进
- 优化构建性能
- 提升应用启动速度
- 改进错误处理机制
```

## 行为准则

### 1. 社区准则

#### 尊重他人
- 保持友好和专业的交流态度
- 尊重不同的观点和经验
- 避免人身攻击和歧视性言论

#### 建设性反馈
- 提供具体和有建设性的反馈
- 关注问题本身而非个人
- 帮助他人改进和学习

#### 包容性
- 欢迎不同背景的贡献者
- 支持新手学习和成长
- 创造包容的开发环境

### 2. 技术准则

#### 代码质量
- 编写清晰、可维护的代码
- 遵循项目编码规范
- 添加必要的测试和文档

#### 安全性
- 关注代码安全性
- 及时报告安全漏洞
- 遵循安全最佳实践

#### 性能
- 考虑代码性能影响
- 优化资源使用
- 进行必要的性能测试

## 获取帮助

### 1. 常见问题

#### 开发环境问题
- 检查 [环境配置文档](./environment.md)
- 查看 [故障排除指南](./troubleshooting.md)
- 搜索 GitHub Issues

#### 代码问题
- 查看项目文档
- 搜索现有 Issues
- 在 Discussions 中提问

### 2. 联系方式

#### 官方渠道
- **GitHub Issues**: 问题报告和功能建议
- **GitHub Discussions**: 技术讨论和问答
- **Discord**: 实时交流和协作

#### 社区资源
- **项目文档**: 详细的使用和开发指南
- **代码示例**: 查看现有代码实现
- **贡献者指南**: 本文档

### 3. 学习资源

#### 技术文档
- [Electron 官方文档](https://www.electronjs.org/docs)
- [React 官方文档](https://reactjs.org/docs)
- [NestJS 官方文档](https://docs.nestjs.com/)

#### 开发工具
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
- [Vite 官方文档](https://vitejs.dev/guide/)
- [Turborepo 文档](https://turbo.build/repo/docs)

## 致谢

感谢所有为 Terminal Electron 项目做出贡献的开发者！

### 贡献者名单
- 查看 [GitHub Contributors](https://github.com/shzjj82/terminal-electron/graphs/contributors)
- 查看 [项目致谢页面](./acknowledgments.md)

### 特别感谢
- 感谢所有报告问题和提供建议的用户
- 感谢所有参与代码审查的开发者
- 感谢所有提供文档和教程的贡献者

---

**让我们一起构建更好的 Terminal Electron！** 🚀 