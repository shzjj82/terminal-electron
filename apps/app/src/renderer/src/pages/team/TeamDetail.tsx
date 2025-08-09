import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Users, UserPlus, Copy } from 'lucide-react';
import { teamsApi, type TeamData, type TeamMemberData, type AddMemberData } from '@/api/teams';
import { EmptyState } from '@/components/empty';
import { PageHeader } from '@/components/header';
import DataCard from '@/components/data-card';
import { useTeamPermissions } from '@/contexts/TeamPermissionContext';
import { TeamPermissions } from '@/utils/permissions';

const TeamDetail: React.FC = observer(() => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { canEditMemberRoles, canInviteMembers, canRemoveMembers } = useTeamPermissions();
  const [team, setTeam] = useState<TeamData | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMemberData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteData, setInviteData] = useState<AddMemberData>({ userId: '', role: 'user' });

  // 加载团队信息
  const loadTeamInfo = async () => {
    if (!teamId) return;
    try {
      const teamsData = await teamsApi.getMyTeams();
      const currentTeam = teamsData.find(t => t.id === teamId);
      if (currentTeam) {
        setTeam(currentTeam);
      }
    } catch (error) {
      console.error('加载团队信息失败:', error);
    }
  };

  // 加载团队成员
  const loadTeamMembers = async () => {
    if (!teamId) return;
    try {
      const members = await teamsApi.getTeamMembers(teamId);
      setTeamMembers(members);
      setFilteredMembers(members);
    } catch (error) {
      console.error('加载团队成员失败:', error);
    }
  };

  // 处理搜索
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setFilteredMembers(teamMembers);
    } else {
      const filtered = teamMembers.filter(member => 
        (member.user?.username || member.userId).toLowerCase().includes(value.toLowerCase()) ||
        (member.user?.email || '').toLowerCase().includes(value.toLowerCase()) ||
        getRoleText(member.role).toLowerCase().includes(value.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  };

  // 邀请成员
  const handleInviteMember = async () => {
    if (!teamId) return;
    try {
      await teamsApi.inviteMember(teamId, inviteData);
      setIsInviteDialogOpen(false);
      setInviteData({ userId: '', role: 'user' });
      loadTeamMembers();
    } catch (error) {
      console.error('邀请成员失败:', error);
    }
  };

  // 移除成员
  const handleRemoveMember = async (memberId: string) => {
    if (!teamId) return;
    try {
      await teamsApi.removeMember(teamId, memberId);
      loadTeamMembers();
    } catch (error) {
      console.error('移除成员失败:', error);
    }
  };

  // 更新成员身份
  const handleUpdateMemberRole = async (memberId: string, role: 'developer' | 'user') => {
    if (!teamId) return;
    try {
      await teamsApi.updateMemberRole(teamId, memberId, { memberId, role });
      loadTeamMembers();
    } catch (error) {
      console.error('更新成员身份失败:', error);
    }
  };

  // 复制邀请码（直接使用已加载的团队邀请码）
  const copyInviteCode = async () => {
    const code = team?.inviteCode || '';
    try {
      await navigator.clipboard.writeText(code);
    } catch (error) {
      console.error('复制邀请码失败:', error);
    }
  };

  // 获取角色显示文本
  const getRoleText = (role: string) => {
    return TeamPermissions.getRoleText(role as any);
  };

  // （如需角色颜色，可按需启用）

  useEffect(() => {
    loadTeamInfo();
    loadTeamMembers();
  }, [teamId]);

  if (!team) {
    return (
      <div className="flex-1 bg-white">
        <div className="p-6">
          <div className="text-center py-16">
            <p className="text-gray-500">团队不存在或您没有权限访问</p>
            <Button onClick={() => navigate('/teams')} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回团队列表
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white">
      {/* Header */}
      <PageHeader
        searchPlaceholder="搜索成员..."
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        renderActions={() => (
          <div className="flex items-center space-x-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">邀请码:</span>
                <span className="font-mono text-sm bg-white px-2 py-1 rounded border">
                  {team.inviteCode}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyInviteCode}
                  className="h-6 px-2"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
            {canInviteMembers && (
              <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    邀请成员
                  </Button>
                </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>邀请新成员</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="userId">用户ID</Label>
                    <Input
                      id="userId"
                      value={inviteData.userId}
                      onChange={(e) => setInviteData({ ...inviteData, userId: e.target.value })}
                      placeholder="请输入用户ID"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">角色</Label>
                    <Select
                      value={inviteData.role}
                      onValueChange={(value: 'developer' | 'user') =>
                        setInviteData({ ...inviteData, role: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="developer">开发者</SelectItem>
                        <SelectItem value="user">使用者</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleInviteMember} className="w-full">
                    邀请成员
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            )}
          </div>
        )}
      />

      {/* Content */}
      <div className="p-6">
        {/* Team Members List or Empty State */}
        {filteredMembers.length > 0 ? (
          <div className="space-y-4">
            {filteredMembers.map((member) => (
              <DataCard
                key={member.id}
                id={member.id}
                title={member.user?.username || member.userId}
                createdAt={new Date(member.createdAt)}
                iconType="member"
                iconBgColor="bg-blue-100"
                iconColor="text-blue-600"
                badges={[
                  {
                    text: getRoleText(member.role),
                    variant: 'outline'
                  }
                ]}
                actions={
                  member.role !== 'owner' && (canEditMemberRoles || canRemoveMembers) ? [
                    ...(canEditMemberRoles ? [{
                      type: 'role-select' as const,
                      onClick: () => {
                        const newRole = member.role === 'developer' ? 'user' : 'developer';
                        handleUpdateMemberRole(member.id, newRole);
                      },
                      variant: 'outline' as const,
                      text: member.role === 'developer' ? '设为使用者' : '设为开发者'
                    }] : []),
                    ...(canRemoveMembers ? [{
                      type: 'delete' as const,
                      onClick: () => handleRemoveMember(member.id),
                      variant: 'outline' as const,
                      className: 'text-red-600 hover:text-red-700',
                      text: '删除'
                    }] : [])
                  ] : []
                }
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title={teamMembers.length === 0 ? "暂无成员" : "未找到匹配的成员"}
            description={teamMembers.length === 0 ? "邀请成员加入您的团队开始协作" : "尝试调整搜索条件"}
            action={
              teamMembers.length === 0 ? (
                <Button onClick={() => setIsInviteDialogOpen(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  邀请成员
                </Button>
              ) : (
                <Button onClick={() => handleSearchChange('')}>
                  清除搜索
                </Button>
              )
            }
          />
        )}
      </div>
    </div>
  );
});

export default TeamDetail; 