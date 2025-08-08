import { makeAutoObservable } from 'mobx';

export interface TerminalSession {
  id: string;
  serverId: string;
  serverName: string;
  host: string;
  username: string;
  status: 'connected' | 'disconnected' | 'connecting';
  createdAt: string;
  lastActivity?: string;
}

class TerminalStore {
  // 终端会话列表
  sessions: TerminalSession[] = [];
  
  // 当前活跃的会话ID
  activeSessionId: string | null = null;

  // 每个 sessionId 对应的消息内容（如命令、输出等）
  sessionContents: Record<string, string[]> = {};

  // 每个 sessionId 对应的终端内容（用于 xterm 显示）
  sessionTerminalContents: Record<string, string> = {};

  constructor() {
    makeAutoObservable(this);
  }

  // 检查会话是否已存在
  getSessionByServerId(serverId: string): TerminalSession | null {
    return this.sessions.find(session => session.serverId === serverId) || null;
  }

  // 创建新的终端会话
  createSession(serverId: string, serverName: string, host: string, username: string): string {
    // 检查是否已存在该服务器的会话
    const existingSession = this.getSessionByServerId(serverId);
    if (existingSession) {
      // 如果会话已存在，设置为活跃会话并返回现有会话ID
      this.setActiveSession(existingSession.id);
      return existingSession.id;
    }

    // 创建新会话
    const sessionId = `session_${Date.now()}`;
    const newSession: TerminalSession = {
      id: sessionId,
      serverId,
      serverName,
      host,
      username,
      status: 'connecting',
      createdAt: new Date().toISOString()
    };

    this.sessions.push(newSession);
    this.sessionContents[sessionId] = [];
    this.sessionTerminalContents[sessionId] = '';
    this.setActiveSession(sessionId);
    
    return sessionId;
  }

  // 设置活跃会话
  setActiveSession(sessionId: string | null) {
    this.activeSessionId = sessionId;
  }

  // 获取当前活跃会话
  get activeSession(): TerminalSession | null {
    return this.sessions.find(session => session.id === this.activeSessionId) || null;
  }

  // 获取当前活跃会话的内容
  get activeSessionContent(): string[] {
    if (!this.activeSessionId) return [];
    return this.sessionContents[this.activeSessionId] || [];
  }

  // 获取当前活跃会话的终端内容
  get activeSessionTerminalContent(): string {
    if (!this.activeSessionId) return '';
    return this.sessionTerminalContents[this.activeSessionId] || '';
  }

  // 追加消息到指定 session
  appendMessage(sessionId: string, message: string) {
    if (!this.sessionContents[sessionId]) {
      this.sessionContents[sessionId] = [];
    }
    this.sessionContents[sessionId].push(message);
  }

  // 追加终端内容到指定 session
  appendTerminalContent(sessionId: string, content: string) {
    if (!this.sessionTerminalContents[sessionId]) {
      this.sessionTerminalContents[sessionId] = '';
    }
    this.sessionTerminalContents[sessionId] += content;
  }

  // 清空指定 session 的终端内容
  clearSessionTerminalContent(sessionId: string) {
    this.sessionTerminalContents[sessionId] = '';
  }

  // 更新会话状态
  updateSessionStatus(sessionId: string, status: TerminalSession['status']) {
    const session = this.sessions.find(s => s.id === sessionId);
    if (session) {
      session.status = status;
      session.lastActivity = new Date().toISOString();
      
      // 同步服务器状态
      this.syncServerStatus(session.serverId, status);
    }
  }

  // 同步服务器状态
  private async syncServerStatus(serverId: string, status: 'connected' | 'disconnected' | 'connecting') {
    try {
      const { serversStore } = await import('./serversStore');
      
      // 更新服务器状态
      const server = serversStore.servers.find(s => s.id === serverId);
      if (server) {
        server.status = status;
        if (status === 'connected') {
          server.lastConnected = new Date().toISOString();
        }
      }
    } catch (error) {
      console.error('Failed to sync server status:', error);
    }
  }

  // 关闭会话
  closeSession(sessionId: string) {
    const session = this.sessions.find(s => s.id === sessionId);
    if (session) {
      // 同步服务器状态为断开连接
      this.syncServerStatus(session.serverId, 'disconnected');
    }
    
    this.sessions = this.sessions.filter(s => s.id !== sessionId);
    delete this.sessionContents[sessionId];
    delete this.sessionTerminalContents[sessionId];
    
    // 如果关闭的是当前活跃会话，切换到其他会话
    if (this.activeSessionId === sessionId) {
      this.activeSessionId = this.sessions.length > 0 ? this.sessions[0].id : null;
    }
  }

  // 根据服务器ID关闭会话
  closeSessionByServerId(serverId: string) {
    const session = this.sessions.find(s => s.serverId === serverId);
    if (session) {
      this.closeSession(session.id);
    }
  }

  // 获取会话数量
  get sessionCount() {
    return this.sessions.length;
  }

  // 获取活跃会话数量
  get activeSessionCount() {
    return this.sessions.filter(s => s.status === 'connected').length;
  }

  // 清空所有会话（应用重启时调用）
  clearAllSessions() {
    this.sessions = [];
    this.activeSessionId = null;
    this.sessionContents = {};
    this.sessionTerminalContents = {};
  }
}

export const terminalStore = new TerminalStore(); 