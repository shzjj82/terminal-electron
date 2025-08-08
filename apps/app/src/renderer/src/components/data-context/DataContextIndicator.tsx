import { observer } from 'mobx-react-lite';
import { useDataContext } from './DataContextProvider';
import { Badge } from '@/components/ui/badge';
import { User, Users } from 'lucide-react';

export const DataContextIndicator = observer(() => {
  const { currentMode, currentTeamName } = useDataContext();

  if (currentMode === 'personal') {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <User className="h-3 w-3" />
        <span>个人数据</span>
      </Badge>
    );
  }

  if (currentMode === 'team' && currentTeamName) {
    return (
      <Badge variant="default" className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600">
        <Users className="h-3 w-3" />
        <span>{currentTeamName}</span>
      </Badge>
    );
  }

  return null;
}); 