import { Key, Lock, FileText, FileKey, ChevronDown } from 'lucide-react';
import { Button } from '@renderer/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@renderer/components/ui/dropdown-menu';

interface CreateKeyOption {
  mode: 'password' | 'file' | 'content';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

interface CreateKeyDropdownProps {
  onCreateKey: (mode: 'password' | 'file' | 'content') => void;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  triggerText?: string;
  showIcon?: boolean;
}

const CreateKeyDropdown = ({ 
  onCreateKey, 
  variant = 'default',
  size = 'default',
  className = '',
  triggerText = '创建密钥',
  showIcon = true
}: CreateKeyDropdownProps) => {
  const createKeyOptions: CreateKeyOption[] = [
    {
      mode: 'password',
      label: '密码模式',
      icon: Lock,
      description: '输入密码生成密钥'
    },
    {
      mode: 'file',
      label: '密钥文件',
      icon: FileText,
      description: '选择密钥文件路径'
    },
    {
      mode: 'content',
      label: '密钥内容',
      icon: FileKey,
      description: '直接输入密钥内容'
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={className}
        >
          {showIcon && <Key className="mr-2 h-4 w-4" />}
          {triggerText}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {createKeyOptions.map((option) => (
          <DropdownMenuItem 
            key={option.mode}
            onClick={() => onCreateKey(option.mode)}
          >
            <option.icon className="mr-2 h-4 w-4" />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CreateKeyDropdown; 