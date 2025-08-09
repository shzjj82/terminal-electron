import { observer } from 'mobx-react-lite';
import { useDataContext } from './DataContextProvider';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, User, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { authStore } from '@/stores/authStore';

export const DataContextSwitcher = observer(() => {
  const { 
    currentMode, 
    currentTeamId, 
    currentTeamName, 
    userTeams, 
    switchToPersonal, 
    switchToTeam 
  } = useDataContext();

  const handleSwitchToPersonal = async () => {
    await switchToPersonal();
  };

  const handleSwitchToTeam = async (teamId: string) => {
    await switchToTeam(teamId);
  };

  const getCurrentDisplayText = () => {
    if (currentMode === 'personal') {
      return '个人';
    } else if (currentMode === 'team' && currentTeamName) {
      return currentTeamName;
    }
    return '选择数据源';
  };

  const getCurrentIcon = () => {
    if (currentMode === 'personal') {
      return <User className="h-4 w-4" />;
    } else {
      return <Users className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={cn(
            "flex items-center gap-2 min-w-[120px] justify-between",
          )}
        >
          {getCurrentIcon()}
          <span className="truncate">{getCurrentDisplayText()}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem 
          onClick={handleSwitchToPersonal}
          className={cn(
            "flex items-center gap-2",
            currentMode === 'personal' && "bg-blue-50 text-blue-600"
          )}
        >
          <User className="h-4 w-4" />
          <span>个人</span>
        </DropdownMenuItem>
        
        {authStore.isAuthenticated && userTeams.length > 0 && (
          <>
            {userTeams.map((team) => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => handleSwitchToTeam(team.id)}
                className={cn(
                  "flex items-center gap-2",
                  currentMode === 'team' && currentTeamId === team.id && "bg-blue-50 text-blue-600"
                )}
              >
                <Users className="h-4 w-4" />
                <span className="truncate">{team.name}</span>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}); 