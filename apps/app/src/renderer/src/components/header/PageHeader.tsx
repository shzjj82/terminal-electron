import { observer } from 'mobx-react-lite';
import { Search } from 'lucide-react';
import { Input } from '@renderer/components/ui/input';

interface PageHeaderProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
  children?: React.ReactNode;
  renderActions?: () => React.ReactNode;
  className?: string;
}

const PageHeader = observer(({ 
  searchPlaceholder = "搜索...",
  searchValue = "",
  onSearchChange,
  showSearch = true,
  children,
  renderActions,
  className = ""
}: PageHeaderProps) => {
  return (
    <div className={`border-b border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between">
        {showSearch && (
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}
        <div className="flex items-center space-x-2">
          {renderActions ? renderActions() : children}
        </div>
      </div>
    </div>
  );
});

export default PageHeader; 