import { ServerItem } from './servers';
import { KeyItem } from './keys';
import { SSHConfig } from './ssh';

// ==================== Hooks 相关类型 ====================

export interface ResolvedServerData {
  server: ServerItem;
  key?: KeyItem | null; // 关联的密钥信息
  sshConfig: SSHConfig;
}

// 重新导出ServerListItem以便统一管理
export type { ServerListItem } from './servers'; 