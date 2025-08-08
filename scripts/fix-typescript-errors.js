#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 修复未使用的导入和变量
const fixes = [
  // 修复 usePortForwardList.ts
  {
    file: 'apps/app/src/renderer/src/hooks/portForwarding/usePortForwardList.ts',
    search: 'const { canEditData, canDeleteData, canUseData } = useTeamPermissions();',
    replace: 'const { canEditData, canDeleteData } = useTeamPermissions();'
  },
  // 修复 useServerList.ts
  {
    file: 'apps/app/src/renderer/src/hooks/servers/useServerList.ts',
    search: 'const isPersonalMode = currentMode === \'personal\';',
    replace: '// const isPersonalMode = currentMode === \'personal\';'
  },
  // 修复 Keys.tsx
  {
    file: 'apps/app/src/renderer/src/pages/ssh/Keys.tsx',
    search: 'const { canCreateData, canEditData, canDeleteData } = useTeamPermissions();',
    replace: 'const { canCreateData } = useTeamPermissions();'
  },
  // 修复 PortForwarding.tsx
  {
    file: 'apps/app/src/renderer/src/pages/ssh/PortForwarding.tsx',
    search: 'const { canCreateData, canEditData, canDeleteData, canUseData } = useTeamPermissions();',
    replace: 'const { canCreateData } = useTeamPermissions();'
  },
  // 修复 sshService.ts
  {
    file: 'apps/app/src/renderer/src/services/sshService.ts',
    search: '(window as any).electron.on(eventName, (...args: any[]) => {',
    replace: '(window as any).electron.on(eventName, (..._args: any[]) => {'
  },
  // 修复 teamDataService.ts
  {
    file: 'apps/app/src/renderer/src/services/teamDataService.ts',
    search: 'import { teamsApi } from \'@/api/teams\';',
    replace: '// import { teamsApi } from \'@/api/teams\';'
  },
  // 修复 serversStore.ts
  {
    file: 'apps/app/src/renderer/src/stores/serversStore.ts',
    search: 'private async closeTerminalSession(serverId: string) {',
    replace: '// private async closeTerminalSession(serverId: string) {'
  },
  // 修复 TeamDetail.tsx 中的未使用导入
  {
    file: 'apps/app/src/renderer/src/pages/team/TeamDetail.tsx',
    search: 'import { Card, CardContent, CardHeader, CardTitle } from \'@/components/ui/card\';',
    replace: '// import { Card, CardContent, CardHeader, CardTitle } from \'@/components/ui/card\';'
  },
  // 修复 TeamDetail.tsx 中的未使用变量
  {
    file: 'apps/app/src/renderer/src/pages/team/TeamDetail.tsx',
    search: 'import { Badge } from \'@/components/ui/badge\';',
    replace: '// import { Badge } from \'@/components/ui/badge\';'
  },
  // 修复 TeamDetail.tsx 中的未使用导入
  {
    file: 'apps/app/src/renderer/src/pages/team/TeamDetail.tsx',
    search: 'import { ArrowLeft, Users, Settings, UserPlus, UserMinus, Copy } from \'lucide-react\';',
    replace: 'import { ArrowLeft, Users, UserPlus, Copy } from \'lucide-react\';'
  },
  // 修复 TeamDetail.tsx 中的未使用变量
  {
    file: 'apps/app/src/renderer/src/pages/team/TeamDetail.tsx',
    search: 'const { canEditMemberRoles, canInviteMembers, canRemoveMembers, currentUserRole } = useTeamPermissions();',
    replace: 'const { canEditMemberRoles, canInviteMembers, canRemoveMembers } = useTeamPermissions();'
  },
  // 修复 Teams.tsx 中的未使用导入
  {
    file: 'apps/app/src/renderer/src/pages/team/Teams.tsx',
    search: 'import { Card, CardContent, CardHeader, CardTitle } from \'@/components/ui/card\';',
    replace: '// import { Card, CardContent, CardHeader, CardTitle } from \'@/components/ui/card\';'
  },
  // 修复 Teams.tsx 中的未使用导入
  {
    file: 'apps/app/src/renderer/src/pages/team/Teams.tsx',
    search: 'import { Label } from \'@/components/ui/label\';',
    replace: '// import { Label } from \'@/components/ui/label\';'
  },
  // 修复 Teams.tsx 中的未使用导入
  {
    file: 'apps/app/src/renderer/src/pages/team/Teams.tsx',
    search: 'import { Plus, Users, Trash2, Copy, UserCheck, Settings } from \'lucide-react\';',
    replace: 'import { Plus, Users, Trash2, UserCheck } from \'lucide-react\';'
  }
];

// 应用修复
fixes.forEach(fix => {
  const filePath = path.join(process.cwd(), fix.file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    if (content.includes(fix.search)) {
      content = content.replace(fix.search, fix.replace);
      fs.writeFileSync(filePath, content);
      console.log(`✅ 修复了 ${fix.file}`);
    } else {
      console.log(`⚠️  在 ${fix.file} 中未找到匹配项`);
    }
  } else {
    console.log(`❌ 文件不存在: ${fix.file}`);
  }
});

console.log('🎉 TypeScript 错误修复完成！'); 