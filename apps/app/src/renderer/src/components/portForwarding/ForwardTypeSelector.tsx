import { Button } from '@renderer/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@renderer/components/ui/dialog';
import { portForwardingStore } from '@renderer/stores/portForwardingStore';
import { FORWARD_TYPE_OPTIONS } from '@renderer/constants';

interface ForwardTypeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onForwardTypeSelect: (type: 'local' | 'remote' | 'dynamic') => void;
}

const ForwardTypeSelector = ({ open, onOpenChange, onForwardTypeSelect }: ForwardTypeSelectorProps) => {
  const handleTypeSelect = (type: 'local' | 'remote' | 'dynamic') => {
    // 只调用父组件的回调，让父组件控制后续操作
    onForwardTypeSelect(type);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center pb-6">
          <DialogTitle className="text-xl font-semibold">选择转发类型</DialogTitle>
          <DialogDescription className="text-gray-600">
            选择您要创建的 SSH 端口转发类型
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {FORWARD_TYPE_OPTIONS.map((option) => {
            const IconComponent = option.icon;
            const isSelected = portForwardingStore.selectedForwardType === option.type;
            return (
              <Button
                key={option.type}
                className={`w-full justify-start h-auto p-6 bg-gradient-to-r ${option.gradient} ${option.hoverGradient} ${option.textColor} border-2 ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : option.borderColor} ${option.hoverBorderColor} transition-all duration-200 shadow-sm hover:shadow-md`}
                variant="outline"
                onClick={() => handleTypeSelect(option.type)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`flex-shrink-0 p-3 ${option.iconBg} rounded-xl`}>
                    <IconComponent className={`h-8 w-8 ${option.iconColor}`} />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-lg mb-1">{option.title}</div>
                    <div className={`text-sm ${option.textColor.replace('900', '700')} leading-relaxed`}>
                      {option.description}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ForwardTypeSelector; 