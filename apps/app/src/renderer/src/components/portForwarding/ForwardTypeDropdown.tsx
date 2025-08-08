import { ChevronDown } from 'lucide-react';
import { Button } from '@renderer/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@renderer/components/ui/dropdown-menu';
import { FORWARD_TYPE_OPTIONS } from '@renderer/constants';

interface ForwardTypeDropdownProps {
  onForwardTypeSelect: (type: 'local' | 'remote' | 'dynamic') => void;
  triggerClassName?: string;
}

const ForwardTypeDropdown = ({ onForwardTypeSelect, triggerClassName }: ForwardTypeDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={`bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-l-none border-l-0 ${triggerClassName || ''}`}>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {FORWARD_TYPE_OPTIONS.map((option) => (
          <DropdownMenuItem 
            key={option.type}
            onClick={() => onForwardTypeSelect(option.type)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ForwardTypeDropdown; 