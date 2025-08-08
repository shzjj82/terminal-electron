import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Plus, Users, Trash2, Copy, UserCheck, Settings } from 'lucide-react';
import { teamsApi, type TeamData, type CreateTeamData, type JoinTeamData } from '@/api/teams';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '@/components/empty';
import { PageHeader } from '@/components/header';
import DataCard from '@/components/data-card';

const Teams: React.FC = observer(() => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<TeamData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [createTeamData, setCreateTeamData] = useState<CreateTeamData>({ name: '' });
  const [joinTeamData, setJoinTeamData] = useState<JoinTeamData>({ inviteCode: '' });

  // 加载我的团队列表
  const loadMyTeams = async () => {
    try {
      const teamsData = await teamsApi.getMyTeams();
      setTeams(teamsData);
      setFilteredTeams(teamsData);
    } catch (error) {
      console.error('加载团队列表失败:', error);
    }
  };

  // 处理搜索
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setFilteredTeams(teams);
    } else {
      const filtered = teams.filter(team =>
        team.name.toLowerCase().includes(value.toLowerCase()) ||
        team.inviteCode.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTeams(filtered);
    }
  };

  // 创建团队
  const handleCreateTeam = async () => {
    try {
      await teamsApi.createTeam(createTeamData);
      loadMyTeams();
      setCreateTeamData({ name: '' });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('创建团队失败:', error);
    }
  };

  // 加入团队
  const handleJoinTeam = async () => {
    try {
      await teamsApi.joinTeam(joinTeamData);
      loadMyTeams();
      setJoinTeamData({ inviteCode: '' });
      setIsJoinDialogOpen(false);
    } catch (error) {
      console.error('加入团队失败:', error);
    }
  };

  // 复制邀请码
  const copyInviteCode = async (inviteCode: string) => {
    try {
      await navigator.clipboard.writeText(inviteCode);
    } catch (error) {
      console.error('复制邀请码失败:', error);
    }
  };

  // 解散团队
  const handleDissolveTeam = async (teamId: string) => {
    try {
      await teamsApi.dissolveTeam(teamId);
      loadMyTeams();
    } catch (error) {
      console.error('解散团队失败:', error);
    }
  };

  // 进入团队详情
  const handleEnterTeam = (team: TeamData) => {
    navigate(`/teams/${team.id}`);
  };

  useEffect(() => {
    loadMyTeams();
  }, []);

  return (
    <div className="flex-1 bg-white">
      {/* Header */}
      <PageHeader
        searchPlaceholder="搜索团队..."
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        renderActions={() => (
          <div className="flex space-x-2">
            <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <UserCheck className="w-4 h-4 mr-2" />
                  加入团队
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>加入团队</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">

                  <div className="flex justify-center mt-2">
                    <InputOTP
                      value={joinTeamData.inviteCode}
                      onChange={(value) => setJoinTeamData({ inviteCode: value })}
                      maxLength={8}
                    >
                      <InputOTPGroup>
                        {
                          Array.from({ length: 8 }).map((_, index) => (
                            <InputOTPSlot key={index} index={index} className='flex-1'/>
                          ))
                        }
                      </InputOTPGroup>

                    </InputOTP>
                  </div>

                  <Button onClick={handleJoinTeam} className="w-full">
                    加入团队
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  创建团队
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>创建新团队</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className='space-y-2'>
                    <Input
                      id="teamName"
                      value={createTeamData.name}
                      onChange={(e) => setCreateTeamData({ name: e.target.value })}
                      placeholder="请输入团队名称"
                    />
                  </div>
                  <Button onClick={handleCreateTeam} className="w-full">
                    创建团队
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      />

      {/* Content */}
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">团队管理</h2>
          <p className="text-gray-600">创建和管理您的团队，邀请成员协作</p>
        </div>

        {/* Team List or Empty State */}
        {filteredTeams.length > 0 ? (
          <div className="space-y-4">
            {filteredTeams.map((team) => (
              <DataCard
                key={team.id}
                id={team.id}
                title={team.name}
                createdAt={new Date(team.createdAt)}
                iconType="team"
                iconBgColor="bg-purple-100"
                iconColor="text-purple-600"
                badges={[
                  {
                    text: team.inviteCode,
                    variant: 'outline'
                  }
                ]}
                actions={[
                  {
                    type: 'copy',
                    onClick: () => copyInviteCode(team.inviteCode),
                    variant: 'outline'
                  },
                  {
                    type: 'manage',
                    onClick: () => handleEnterTeam(team),
                    variant: 'outline'
                  },
                  {
                    type: 'delete',
                    onClick: () => handleDissolveTeam(team.id),
                    variant: 'outline',
                    className: 'text-red-600 hover:text-red-700'
                  }
                ]}
              >
              </DataCard>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title={teams.length === 0 ? "暂无团队" : "未找到匹配的团队"}
            description={teams.length === 0 ? "创建您的第一个团队开始协作" : "尝试调整搜索条件"}
            action={
              teams.length === 0 ? (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  创建团队
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

export default Teams; 