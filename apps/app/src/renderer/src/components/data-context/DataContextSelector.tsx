import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, User, Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDataContext } from './DataContextProvider';
import { teamsApi } from '@/api/teams';

interface Team {
  id: string;
  name: string;
  inviteCode: string;
  role: string;
}

export const DataContextSelector = observer(() => {
  const navigate = useNavigate();
  const { currentMode, currentTeamId, currentTeamName, switchToPersonal, switchToTeam } = useDataContext();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);

  // 加载用户的团队列表
  const loadTeams = async () => {
    if (!teams.length) {
      setIsLoadingTeams(true);
      try {
        const userTeams = await teamsApi.getMyTeams();
        setTeams(userTeams as unknown as Team[]);
      } catch (error) {
        console.error('加载团队列表失败:', error);
      } finally {
        setIsLoadingTeams(false);
      }
    }
  };

  // 处理切换到个人模式
  const handleSwitchToPersonal = async () => {
    await switchToPersonal();
    navigate('/servers');
  };

  // 处理切换到团队模式
  const handleSwitchToTeam = async (team: Team) => {
    await switchToTeam(team.id);
    navigate(`/teams/${team.id}`);
  };

  // 获取当前显示的文本
  const getCurrentDisplayText = () => {
    if (isLoadingTeams) {
      return '加载中...';
    }
    
    if (currentMode === 'personal') {
      return '个人';
    }
    
    if (currentMode === 'team' && currentTeamName) {
      return currentTeamName;
    }
    
    return '选择数据源';
  };

  // 获取当前图标
  const getCurrentIcon = () => {
    if (isLoadingTeams) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    
    if (currentMode === 'personal') {
      return <User className="h-4 w-4" />;
    }
    
    if (currentMode === 'team') {
      return <Users className="h-4 w-4" />;
    }
    
    return <User className="h-4 w-4" />;
  };

  return (
    <DropdownMenu onOpenChange={(open) => open && loadTeams()}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="min-w-[120px] justify-between"
          disabled={isLoadingTeams}
        >
          <div className="flex items-center gap-2">
            {getCurrentIcon()}
            <span className="truncate">{getCurrentDisplayText()}</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        {/* 个人选项 */}
        <DropdownMenuItem 
          onClick={handleSwitchToPersonal}
          className="flex items-center gap-2"
        >
          <User className="h-4 w-4" />
          <span>个人</span>
          {currentMode === 'personal' && (
            <span className="ml-auto text-xs text-muted-foreground">当前</span>
          )}
        </DropdownMenuItem>
        
        {/* 团队选项 */}
        {teams.length > 0 && (
          <>
            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              我的团队
            </div>
            {isLoadingTeams ? (
              <div className="flex items-center gap-2 px-2 py-1.5">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">加载团队中...</span>
              </div>
            ) : (
              teams.map((team) => (
                <DropdownMenuItem 
                  key={team.id}
                  onClick={() => handleSwitchToTeam(team)}
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  <span className="truncate">{team.name}</span>
                  {currentMode === 'team' && currentTeamId === team.id && (
                    <span className="ml-auto text-xs text-muted-foreground">当前</span>
                  )}
                </DropdownMenuItem>
              ))
            )}
          </>
        )}
        
        {!isLoadingTeams && teams.length === 0 && (
          <div className="px-2 py-1.5 text-xs text-muted-foreground">
            暂无团队
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}); 