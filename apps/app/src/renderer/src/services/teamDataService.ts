import { serversStore } from '@/stores/serversStore';
import { keysStore } from '@/stores/keysStore';
import { portForwardingStore } from '@/stores/portForwardingStore';
import { syncApi } from '@/api/sync';
// import { teamsApi } from '@/api/teams';

class TeamDataService {
  private currentTeamId: string | null = null;
  private isTeamMode: boolean = false;

  // 切换到团队模式
  async switchToTeam(teamId: string) {
    this.currentTeamId = teamId;
    this.isTeamMode = true;
    
    try {
      // 清空当前数据
      serversStore.clearServers();
      keysStore.clearKeys();
      portForwardingStore.clearPortForwards();

      // 使用 namespace 从服务器获取团队数据
      const [servers, keys, portForwards] = await Promise.all([
        syncApi.getServers(teamId),
        syncApi.getKeys(teamId),
        syncApi.getPortForwards(teamId)
      ]);
      
      // 加载团队数据到 stores
      servers.forEach(server => {
        serversStore.addServerFromCloud(server);
      });
      
      keys.forEach(key => {
        keysStore.addKeyFromCloud(key);
      });
      
      portForwards.forEach(forward => {
        portForwardingStore.addPortForwardFromCloud(forward);
      });
    } catch (error) {
      console.error('切换团队数据失败:', error);
    }
  }

  // 切换到个人模式
  async switchToPersonal() {
    this.currentTeamId = null;
    this.isTeamMode = false;
    
    try {
      // 清空当前数据
      serversStore.clearServers();
      keysStore.clearKeys();
      portForwardingStore.clearPortForwards();

      // 使用 namespace 从服务器获取个人数据
      const [servers, keys, portForwards] = await Promise.all([
        syncApi.getServers(),
        syncApi.getKeys(),
        syncApi.getPortForwards()
      ]);
      
      // 加载个人数据到 stores
      servers.forEach(server => {
        serversStore.addServerFromCloud(server);
      });
      
      keys.forEach(key => {
        keysStore.addKeyFromCloud(key);
      });
      
      portForwards.forEach(forward => {
        portForwardingStore.addPortForwardFromCloud(forward);
      });
    } catch (error) {
      console.error('切换个人数据失败:', error);
    }
  }

  // 获取当前模式
  getCurrentMode() {
    return {
      isTeamMode: this.isTeamMode,
      currentTeamId: this.currentTeamId
    };
  }

  // 检查是否在团队模式
  isInTeamMode() {
    return this.isTeamMode;
  }

  // 获取当前团队ID
  getCurrentTeamId() {
    return this.currentTeamId;
  }

  // 加载团队数据
  async loadTeamData() {
    if (this.currentTeamId) {
      await this.switchToTeam(this.currentTeamId);
    }
  }
}

export const teamDataService = new TeamDataService(); 