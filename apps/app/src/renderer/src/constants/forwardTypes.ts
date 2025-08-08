import { ArrowRight, ArrowLeft, Network } from 'lucide-react';

export interface ForwardTypeOption {
  type: 'local' | 'remote' | 'dynamic';
  title: string;
  description: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  iconBg: string;
  iconColor: string;
  textColor: string;
  borderColor: string;
  hoverGradient: string;
  hoverBorderColor: string;
}

export const FORWARD_TYPE_OPTIONS: ForwardTypeOption[] = [
  {
    type: 'local',
    title: '本地端口转发',
    description: '将本地端口转发到远程主机端口，适用于访问远程服务',
    label: '本地端口转发',
    icon: ArrowRight,
    gradient: 'from-blue-50 to-blue-100',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    textColor: 'text-blue-900',
    borderColor: 'border-blue-200',
    hoverGradient: 'hover:from-blue-100 hover:to-blue-200',
    hoverBorderColor: 'hover:border-blue-300'
  },
  {
    type: 'remote',
    title: '远程端口转发',
    description: '将远程端口转发到本地主机端口，适用于暴露本地服务',
    label: '远程端口转发',
    icon: ArrowLeft,
    gradient: 'from-purple-50 to-purple-100',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    textColor: 'text-purple-900',
    borderColor: 'border-purple-200',
    hoverGradient: 'hover:from-purple-100 hover:to-purple-200',
    hoverBorderColor: 'hover:border-purple-300'
  },
  {
    type: 'dynamic',
    title: '动态端口转发',
    description: '创建 SOCKS 代理服务器，提供灵活的代理访问',
    label: '动态端口转发',
    icon: Network,
    gradient: 'from-green-50 to-green-100',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    textColor: 'text-green-900',
    borderColor: 'border-green-200',
    hoverGradient: 'hover:from-green-100 hover:to-green-200',
    hoverBorderColor: 'hover:border-green-300'
  }
]; 