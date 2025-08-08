import { ReactNode } from 'react';
import { Card, CardContent } from '@renderer/components/ui/card';
import { Button } from '@renderer/components/ui/button';
import { Badge } from '@renderer/components/ui/badge';
import { formatRelativeTime, formatCreatedTime } from '@renderer/lib/timeUtils';
import { 
  Key, 
  Edit, 
  Trash2, 
  Play, 
  Square, 
  Server, 
  ArrowLeftRight,
  Users,
  Copy,
  Settings,
  User,
  ChevronDown
} from 'lucide-react';

export interface ActionButton {
  type: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'destructive';
  disabled?: boolean;
  className?: string;
  text?: string;
}

export interface DataCardProps {
  id: string;
  title: string;
  createdAt: Date;
  lastUsed?: Date;
  iconType: string;
  iconBgColor: string;
  iconColor: string;
  badges?: Array<{
    text: string;
    variant: 'default' | 'outline' | 'secondary' | 'destructive';
  }>;
  actions: ActionButton[];
  children?: ReactNode;
}

const getIcon = (iconType: string, size: 'sm' | 'md' = 'md') => {
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  
  switch (iconType) {
    case 'key':
      return <Key className={iconSize} />;
    case 'server':
      return <Server className={iconSize} />;
    case 'arrow-left-right':
      return <ArrowLeftRight className={iconSize} />;
    case 'team':
      return <Users className={iconSize} />;
    case 'member':
      return <User className={iconSize} />;
    default:
      return null;
  }
};

const getActionIcon = (type: string) => {
  switch (type) {
    case 'edit':
      return <Edit className="h-4 w-4" />;
    case 'delete':
      return <Trash2 className="h-4 w-4" />;
    case 'start':
      return <Play className="h-4 w-4" />;
    case 'stop':
      return <Square className="h-4 w-4" />;
    case 'connect':
      return <Play className="h-4 w-4" />;
    case 'disconnect':
      return <Square className="h-4 w-4" />;
    case 'manage':
      return <Settings className="h-4 w-4" />;
    case 'copy':
      return <Copy className="h-4 w-4" />;
    case 'role-select':
      return <ChevronDown className="h-4 w-4" />;
    default:
      return null;
  }
};

const DataCard = ({
  title,
  createdAt,
  lastUsed,
  iconType,
  iconBgColor,
  iconColor,
  badges = [],
  actions,
  children
}: DataCardProps) => {
  return (
    <Card className="hover:bg-gray-50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center`}>
              <div className={iconColor}>
                {getIcon(iconType)}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{title}</h3>
              <p className="text-xs text-gray-400" title={formatCreatedTime(createdAt)}>
                创建于: {formatRelativeTime(createdAt)}
                {lastUsed && (
                  <span title={formatCreatedTime(lastUsed)}>
                    {' • 最后使用: '}{formatRelativeTime(lastUsed)}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {badges.map((badge, index) => (
              <Badge key={index} variant={badge.variant}>
                {badge.text}
              </Badge>
            ))}

            <div className="flex items-center space-x-1">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'outline'}
                  size="sm"
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={action.className}
                >
                  {action.text || getActionIcon(action.type)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {children}
      </CardContent>
    </Card>
  );
};

export default DataCard; 