import { Plus, ChevronDown } from 'lucide-react';
import { Button } from '@renderer/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@renderer/components/ui/dropdown-menu';
import { FORWARD_TYPE_OPTIONS } from '@renderer/constants';

interface ForwardActionButtonProps {
  onForwardTypeSelect: (type: 'local' | 'remote' | 'dynamic') => void;
  onMainButtonClick: () => void;
}

const ForwardActionButton = ({ onForwardTypeSelect, onMainButtonClick }: ForwardActionButtonProps) => {
  const handleDropdownSelect = (type: 'local' | 'remote' | 'dynamic') => {
    // 直接调用父组件的回调，让父组件控制后续操作
    onForwardTypeSelect(type);
  };

  return (
    <div className="flex items-center">
      <Button onClick={onMainButtonClick} className="bg-gray-900 text-white hover:bg-gray-800 rounded-r-none border-r-0">
        <Plus className="mr-2 h-4 w-4" />
        创建转发
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-l-none border-l-0">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {FORWARD_TYPE_OPTIONS.map((option) => (
            <DropdownMenuItem 
              key={option.type}
              onClick={() => handleDropdownSelect(option.type)}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ForwardActionButton; 